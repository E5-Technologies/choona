import { useEffect, useRef, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';
import socketService from '../utils/socket/socketService';
import { useIsPlaying, useCurrentSong } from '@lomray/react-native-apple-music';
import { useMusicPlayer } from '../context/AppleMusicContext';
import { usePlaybackState, useProgress } from 'react-native-track-player';
import TrackPlayer from 'react-native-track-player';
import { usePlayFullAppleMusic } from './usePlayFullAppleMusic';
import { useHostSync } from './useHostSync';
import { useJoineeSync } from './useJoineeSync';

export const useSessionHosting = (config = { enablePlaybackSync: false }) => {
    const { enablePlaybackSync } = config;
    const userProfileResp = useSelector(state => state.UserReducer.userProfileResp);
    const userTokenData = useSelector(state => state.TokenReducer);
    const sessionReduxData = useSelector(state => state.SessionReducer);
    const sessionDetailReduxdata = sessionReduxData?.sessionDetailData?.data;

    const { isPlaying: appleFullSongPlaying } = useIsPlaying();
    const playerState = usePlaybackState();
    const { progress } = useMusicPlayer();
    const {
        setPlaybackQueue,
        resetPlaybackQueue,
        haveAppleMusicSubscription,
        isAuthorizeToAccessAppleMusic,
    } = usePlayFullAppleMusic();
    const { position } = useProgress(200);
    const { song: currentPlayinSongData } = useCurrentSong();

    const isLive = sessionDetailReduxdata?.isLive ?? false;
    const isHost = userProfileResp?._id === sessionDetailReduxdata?.own_user?._id;
    const sessionId = sessionDetailReduxdata?._id;

    const isJoinee = useMemo(() => {
        if (!isLive || isHost || !sessionDetailReduxdata?.users) {
            return false;
        }
        return sessionDetailReduxdata.users.some(
            user => user._id === userProfileResp?._id,
        );
    }, [isLive, isHost, sessionDetailReduxdata?.users, userProfileResp?._id]);

    // console.log('🔍 [Sync Hook Role]', {
    //     role: isHost ? 'HOST' : (isJoinee ? 'JOINEE' : 'VIEWER'),
    //     isLive,
    //     sessionId,
    //     userCount: sessionDetailReduxdata?.users?.length,
    //     myId: userProfileResp?._id,
    //     hostId: sessionDetailReduxdata?.own_user?._id,
    // });


    const positionRef = useRef(0);
    const [currentSyncStatus, setCurrentSyncStatus] = useState(null);

    // Determine if we are using Apple Music or Preview/Spotify
    const isAppleRegisterType = userTokenData?.registerType === 'apple';

    const isAppleActive = useMemo(() => {
        return Platform.OS === 'ios' &&
            isAppleRegisterType &&
            haveAppleMusicSubscription &&
            isAuthorizeToAccessAppleMusic;
    }, [isAppleRegisterType, haveAppleMusicSubscription, isAuthorizeToAccessAppleMusic]);

    useEffect(() => {
        if (isAppleActive) {
            positionRef.current = progress;
        } else {
            positionRef.current = position;
        }
    }, [position, progress, isAppleActive]);

    // Setup TrackPlayer if not already setup
    useEffect(() => {
        if (!isAppleActive) {
            const setup = async () => {
                try {
                    await TrackPlayer.setupPlayer();
                    console.log('✅ [Sync Hook] TrackPlayer setup successfully');
                } catch (e) {
                }
            };
            setup();
        }
    }, [isAppleActive]);

    // Socket initialization
    useEffect(() => {
        if (userTokenData?.token) {
            socketService.initializeSocket(userTokenData.token).catch(err => {
                console.error('Socket initialization error in useSessionHosting:', err);
            });
        }
    }, [userTokenData?.token]);

    // Handle incoming status updates
    useEffect(() => {
        if (!sessionId || (!isJoinee && !isHost)) {
            return;
        }

        const handleStatusUpdate = (status) => {
            if (isJoinee) {
                console.log('✅ [Joinee Sync] Success: Received data from Host:', status);
            } else if (isHost) {
                console.log('📡 [Host Sync] Received own data back from server (Loopback):', status.playIndex);
            } else {
                console.log('📬 [Viewer Sync] Received host status update:', status.playIndex);
            }
            setCurrentSyncStatus(status);
        };

        socketService.on('session_play_status', handleStatusUpdate);
        return () => {
            socketService.off('session_play_status', handleStatusUpdate);
        };
    }, [sessionId, isJoinee, isHost]);

    // Role-specific hooks
    useHostSync({
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
    });


    useJoineeSync({
        isJoinee,
        isAppleActive,
        sessionId,
        sessionDetailReduxdata,
        currentSyncStatus,
        enablePlaybackSync,
        appleFullSongPlaying,
        playerState,
        position,
        resetPlaybackQueue,
        setPlaybackQueue
    });

    return {
        isLive,
        isHost,
        isJoinee,
        sessionId,
        sessionDetailReduxdata,
        currentSyncStatus,
        isAppleActive,
    };
};
