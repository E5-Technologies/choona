import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Player } from '@lomray/react-native-apple-music';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';
import socketService from '../utils/socket/socketService';
import { startSessionRequest } from '../action/SessionAction';


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
    const dispatch = useDispatch();
    const hostTrackPlayerIndexRef = useRef(-1);
    const lastTrackIndexRef = useRef(-1);
    const isStoppingRef = useRef(false);

    const handleStopKillSession = useCallback(() => {
        if (!sessionId || isStoppingRef.current) {
            return;
        }

        isStoppingRef.current = true;
        // console.log('📡 [Host Sync] Automatic session closure triggered. Stopping emissions.');
        const requestObj = {
            isLive: false,
            sessionId: sessionId,
        };
        dispatch(startSessionRequest(requestObj));
    }, [dispatch, sessionId]);

    // Reset isStoppingRef when session changes or goes live again
    useEffect(() => {
        if (isLive) {
            isStoppingRef.current = false;
        }
    }, [isLive, sessionId]);

    // Apple Music end-of-queue detection
    useEffect(() => {
        if (!isHost || !isLive || !isAppleActive) {
            return;
        }

        const playbackListener = Player.addListener(
            'onPlaybackStateChange',
            state => {
                const duration = state?.currentSong?.duration;
                const time = state?.playbackTime;

                // Enhanced completion detection: if paused near the end
                const isNearEnd = duration > 0 && Math.abs(duration - time) < 2.0;
                const isCompleted = state.playbackStatus === 'paused' && isNearEnd;

                // console.log('🔍 [Host Sync] Apple Playback Detection:', {
                //     playbackStatus: state.playbackStatus,
                //     duration,
                //     time,
                //     isNearEnd,
                //     isCompleted,
                //     currentSongId: currentPlayinSongData?.id,
                // });

                if (isCompleted) {
                    const songs = sessionDetailReduxdata?.session_songs || [];
                    const appleId = currentPlayinSongData?.id;
                    const currentTrackIndex = appleId ? songs.findIndex(
                        item => item.apple_song_id === appleId || item._id === appleId
                    ) : -1;

                    // console.log('🔍 [Host Sync] Apple Completion Check:', {
                    //     currentTrackIndex,
                    //     songsCount: songs.length,
                    //     isLastTrack: (currentTrackIndex !== -1 && currentTrackIndex === songs.length - 1),
                    // });

                    if (currentTrackIndex !== -1 && currentTrackIndex === songs.length - 1) {
                        handleStopKillSession();
                    }
                }
            }
        );

        return () => {
            playbackListener.remove();
        };
    }, [isHost, isLive, isAppleActive, sessionDetailReduxdata?.session_songs, currentPlayinSongData, handleStopKillSession]);

    // TrackPlayer end-of-queue detection
    useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
        if (isHost && isLive && !isAppleActive) {
            // console.log('✅ [Host Sync] TrackPlayer PlaybackQueueEnded');
            handleStopKillSession();
        }
    });

    // Track index update for non-Apple (TrackPlayer)

    useEffect(() => {
        if (!isHost || isAppleActive || !isLive) {
            return;
        }

        const updateIndex = async () => {
            if (isStoppingRef.current) {
                return;
            }
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
            // console.log('🚀 [Host Sync] Starting Host Emission for session:', sessionId);

            intervalId = setInterval(() => {
                if (isStoppingRef.current) {
                    return;
                }

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
                const isPlaying = isAppleActive ? appleFullSongPlaying : isTrackPlayerPlaying;

                // TRANSITION-BASED CLOSURE DETECTION (Apple Music / Loopback Fix)
                // If it jumps from the last song to the first song, it means the queue ended.
                if (lastTrackIndexRef.current !== -1 &&
                    lastTrackIndexRef.current === songs.length - 1 &&
                    currentTrackIndex === 0 &&
                    songs.length > 1) {
                    console.log('📡 [Host Sync] Detected jump from last track to first track. Closing session.');
                    handleStopKillSession();
                    return;
                }

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
                    isStopping: isStoppingRef.current,
                });

                socketService.emit('session_play_status', emitObjData);

                setCurrentSyncStatus(emitObjData);

                // Always update last track index at the end of successful calculation
                lastTrackIndexRef.current = currentTrackIndex;
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
        handleStopKillSession,
    ]);

};
