import { useEffect, useRef } from 'react';
import TrackPlayer from 'react-native-track-player';
import socketService from '../utils/socket/socketService';

export const useHostSync = ({
    isHost,
    isLive,
    isAppleActive,
    sessionId,
    sessionDetailReduxdata,
    userProfileResp,
    currentPlayinSongData,
    appleFullSongPlaying,
    playerState,
    positionRef,
    setCurrentSyncStatus,
}) => {

    const hostTrackPlayerIndexRef = useRef(-1);

    // Track index update for non-Apple (TrackPlayer)
    useEffect(() => {
        if (!isHost || isAppleActive || !isLive) {
            return;
        }

        const updateIndex = async () => {
            try {
                const idx = await TrackPlayer.getCurrentTrack();
                if (idx !== null && idx !== undefined) {
                    const track = await TrackPlayer.getTrack(idx);
                    if (track?.id && sessionDetailReduxdata?.session_songs) {
                        const indexInSongs = sessionDetailReduxdata.session_songs.findIndex(
                            s => s._id === track.id
                        );
                        if (indexInSongs !== -1) {
                            hostTrackPlayerIndexRef.current = indexInSongs;
                        }
                    }
                }
            } catch (e) {
                // console.log('❌ [Host Sync] Error updating track index:', e);
            }
        };

        const interval = setInterval(updateIndex, 1000);
        return () => clearInterval(interval);
    }, [isHost, isAppleActive, isLive, sessionDetailReduxdata?.session_songs]);

    // Session status interval (Emitting only if live and host)
    useEffect(() => {
        let intervalId;

        if (isLive && isHost && sessionId) {
            console.log('🚀 [Host Sync] Starting Host Emission for session:', sessionId);

            intervalId = setInterval(() => {
                let currentTrackIndex = -1;
                const songs = sessionDetailReduxdata?.session_songs || [];

                if (isAppleActive) {
                    if (currentPlayinSongData?.id) {
                        currentTrackIndex = songs.findIndex(
                            item => item.apple_song_id === currentPlayinSongData.id || item._id === currentPlayinSongData.id
                        );
                    }
                } else {
                    currentTrackIndex = hostTrackPlayerIndexRef.current;
                }

                const tpState = playerState?.state ?? playerState;
                const isTrackPlayerPlaying = tpState === 'playing' || tpState === 3;

                // Enhanced Apple Music playing detection
                // If the hook says false, but position is moving, it might still be playing
                const isPlaying = isAppleActive ? appleFullSongPlaying : isTrackPlayerPlaying;

                const emitObjData = {
                    hostId: userProfileResp?._id,
                    playIndex: currentTrackIndex,
                    playLoading: false,
                    currentTime: positionRef.current,
                    startedAt: Date.now(),
                    pausedAt: null,
                    sessionId: sessionId,
                    startAudioMixing: isPlaying,
                };

                console.log('📡 [Host Sync] Emitting Payload:', {
                    ...emitObjData,
                    debug: {
                        appleFullSongPlaying,
                        isTrackPlayerPlaying,
                        tpState,
                        isAppleActive,
                        currentTime: positionRef.current,
                    },
                });

                socketService.emit('session_play_status', emitObjData);

                setCurrentSyncStatus(emitObjData);
            }, 1000);
        }

        return () => {
            if (intervalId) {
                console.log('🛑 [Host Sync] Stopping Host Emission');
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
        playerState,
        isAppleActive,
        sessionDetailReduxdata?.session_songs,
        positionRef,
        setCurrentSyncStatus,
    ]);

};
