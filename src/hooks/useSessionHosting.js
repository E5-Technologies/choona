import { useEffect, useRef, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
    const dispatch = useDispatch();
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
        if (!isLive || isHost) {
            return false;
        }
        // If users list is available, check it
        if (sessionDetailReduxdata?.users && sessionDetailReduxdata.users.length > 0) {
            const exists = sessionDetailReduxdata.users.some(
                user => (user?._id || user) === userProfileResp?._id,
            );
            if (exists) {
                return true;
            }
        }

        // No fallback, strictly check user list
        return false;
    }, [isLive, isHost, sessionDetailReduxdata?.users, userProfileResp?._id]);
    // console.log(sessionDetailReduxdata?.users, 'itsjoinee', isJoinee)
    // console.log(userProfileResp, 'ididhjfd')

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
    const [isSocketReady, setIsSocketReady] = useState(socketService.isConnected());

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
            socketService.initializeSocket(userTokenData.token)
                .then(() => {
                    console.log('🔌 [Sync Hook] Socket initialized successfully');
                    setIsSocketReady(true);
                })
                .catch(err => {
                    console.error('❌ [Sync Hook] Socket initialization error in useSessionHosting:', err);
                });
        }
    }, [userTokenData?.token]);

    // Handle incoming status updates
    useEffect(() => {
        if (!sessionId || !isSocketReady) {
            console.log('🔌 [Sync Hook] Postponing listener attachment:', {
                hasSessionId: !!sessionId,
                isSocketReady
            });
            return;
        }

        const socket = socketService.socket;
        if (!socket) {
            return;
        }

        // Emit JOIN event (Server requirement for room broadcast)
        socketService.emit('join_session', { sessionId: sessionId });

        const handleStatusUpdate = (status) => {
            const receivedSessionId = status?.sessionId || status?.session_id;
            const receivedHostId = status?.hostId || status?.host_id;
            const currentHostId = sessionDetailReduxdata?.own_user?._id;

            // Filter by sessionId or fallback to hostId (HostId is more reliable on this server)
            if (receivedSessionId) {
                if (receivedSessionId !== sessionId) {
                    return;
                }
            } else if (receivedHostId && currentHostId) {
                if (receivedHostId !== currentHostId) {
                    return;
                }
            }

            if (isJoinee) {
                console.log('✅ [Joinee Sync] Sync data received from Host:', status.playIndex);
            }
            setCurrentSyncStatus(status);
        };

        const handleUsersUpdate = (data) => {
            // Updated users list (handled internally)
        };

        const handleSessionEnded = (data) => {
            if (isJoinee) {
                console.log('📡 [Sync Hook] Session ended by host:', data);
                // Dispatch action to update Redux (hides miniplayer and triggers stop)
                dispatch({
                    type: 'START_SESSION_JOINEE_STOP_HOST',
                    data: { data: { ...data, isLive: false } },
                });
            }
        };

        socketService.on('session_play_status', handleStatusUpdate);
        socketService.on('session_users_status', handleUsersUpdate);
        socketService.on('session_ended_status', handleSessionEnded);

        return () => {
            socketService.off('session_play_status', handleStatusUpdate);
            socketService.off('session_users_status', handleUsersUpdate);
            socketService.off('session_ended_status', handleSessionEnded);
        };
    }, [sessionId, isJoinee, isHost, isSocketReady, isLive, sessionDetailReduxdata, userProfileResp, dispatch]);


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
        setPlaybackQueue,
        isLive,
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
