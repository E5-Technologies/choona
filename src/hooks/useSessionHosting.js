import { useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';
import socketService from '../utils/socket/socketService';
import { useIsPlaying, useCurrentSong } from '@lomray/react-native-apple-music';
import { useMusicPlayer } from '../context/AppleMusicContext';
import { usePlaybackState, useProgress } from 'react-native-track-player';

export const useSessionHosting = () => {
    const userProfileResp = useSelector(state => state.UserReducer.userProfileResp);
    const userTokenData = useSelector(state => state.TokenReducer);
    const sessionReduxData = useSelector(state => state.SessionReducer);
    const sessionDetailReduxdata = sessionReduxData?.sessionDetailData?.data;

    const { isPlaying: appleFullSongPlaying } = useIsPlaying();
    const playerState = usePlaybackState();
    const { progress } = useMusicPlayer();
    const { position } = useProgress(200);
    const { song: currentPlayinSongData } = useCurrentSong();

    const isLive = sessionDetailReduxdata?.isLive ?? false;
    const isHost = userProfileResp?._id === sessionDetailReduxdata?.own_user?._id;
    const sessionId = sessionDetailReduxdata?._id;

    const positionRef = useRef(0);

    // Determine if we are using Apple Music or Preview/Spotify
    const isAppleRegisterType = userTokenData?.registerType === 'apple';

    // TO CHECK THAT USER APPLE STATUS (Simplified from MySessionDetailScreen)
    const isAppleActive = useMemo(() => {
        return Platform.OS === 'ios' && isAppleRegisterType;
    }, [isAppleRegisterType]);

    useEffect(() => {
        if (isAppleActive) {
            positionRef.current = progress;
        } else {
            positionRef.current = position;
        }
    }, [position, progress, isAppleActive]);

    // Socket initialization
    useEffect(() => {
        if (userTokenData?.token) {
            socketService.initializeSocket(userTokenData.token).catch(err => {
                console.error('Socket initialization error in useSessionHosting:', err);
            });
        }

        return () => {
            // Disconnect only if necessary, but usually we want it global
            // socketService.disconnect();
        };
    }, [userTokenData?.token]);

    // Session status interval (Emitting only if live and host)
    useEffect(() => {
        let intervalId;

        if (isLive && isHost && sessionId) {
            console.log('🚀 Starting global session sync for session:', sessionId);

            intervalId = setInterval(() => {
                // Find current track index based on the song ID
                let currentTrackIndex = -1;
                if (currentPlayinSongData?.id && sessionDetailReduxdata?.session_songs) {
                    currentTrackIndex = sessionDetailReduxdata.session_songs.findIndex(
                        item => item.apple_song_id === currentPlayinSongData.id || item._id === currentPlayinSongData.id
                    );
                }

                const emitObjData = {
                    hostId: userProfileResp?._id,
                    playIndex: currentTrackIndex,
                    playLoading: false,
                    currentTime: positionRef.current,
                    startedAt: Date.now(),
                    pausedAt: null,
                    sessionId: sessionId,
                };

                emitObjData.startAudioMixing = isAppleActive
                    ? appleFullSongPlaying
                    : playerState?.state === 'playing';

                console.log('📡 Emitting Global Sync Payload:', JSON.stringify(emitObjData, null, 2));
                socketService.emit('session_play_status', emitObjData);
            }, 1000);
        }

        return () => {
            if (intervalId) {
                console.log('🛑 Stopping global session sync');
                clearInterval(intervalId);
            }
        };
    }, [
        userProfileResp,
        isLive,
        isHost,
        sessionId,
        currentPlayinSongData,
        appleFullSongPlaying,
        playerState?.state,
        isAppleActive,
        sessionDetailReduxdata?.session_songs,
        sessionReduxData?.sessionDetailData,
    ]);

    return {
        isLive,
        isHost,
        sessionId,
        sessionDetailReduxdata
    };
};
