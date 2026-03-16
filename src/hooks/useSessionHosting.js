import { useEffect, useRef, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';
import socketService from '../utils/socket/socketService';
import { useIsPlaying, useCurrentSong, Player } from '@lomray/react-native-apple-music';
import { useMusicPlayer } from '../context/AppleMusicContext';
import { usePlaybackState, useProgress } from 'react-native-track-player';
import TrackPlayer from 'react-native-track-player';
import { usePlayFullAppleMusic } from './usePlayFullAppleMusic';

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

    const positionRef = useRef(0);
    const [currentSyncStatus, setCurrentSyncStatus] = useState(null);
    const lastSyncedIndex = useRef(-1);
    const hostTrackPlayerIndexRef = useRef(-1);

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
                    // setupPlayer is safe to call multiple times in some versions, 
                    // but we should catch if it's already setup
                    await TrackPlayer.setupPlayer();
                    console.log('✅ [Sync Hook] TrackPlayer setup successfully');
                } catch (e) {
                    // console.log('ℹ️ [Sync Hook] TrackPlayer already setup or error:', e.message);
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

    // PROACTIVE RESET when joining a session
    useEffect(() => {
        if (enablePlaybackSync && isJoinee && sessionId) {
            console.log('🎵 [Joinee Sync] Proactively resetting local music for session:', sessionId);
            const initialReset = async () => {
                try {
                    if (isAppleActive) {
                        await resetPlaybackQueue();
                    } else {
                        await TrackPlayer.reset();
                    }
                } catch (error) {
                    console.error('❌ [Joinee Sync] Error during initial reset:', error);
                }
            };
            initialReset();
        }
    }, [isJoinee, sessionId, isAppleActive, resetPlaybackQueue, enablePlaybackSync]);

    // 1. STATE-ONLY SYNC: Always update currentSyncStatus if in session
    useEffect(() => {
        if (!sessionId || (!isJoinee && !isHost)) {
            return;
        }

        const handleStatusUpdate = (status) => {
            console.log('📬 [Sync Hook] Received status update:', status.playIndex);
            setCurrentSyncStatus(status);
        };

        socketService.on('session_play_status', handleStatusUpdate);
        return () => {
            socketService.off('session_play_status', handleStatusUpdate);
        };
    }, [sessionId, isJoinee, isHost]);

    // 2. PLAYBACK SYNC: Only for Joinees with enablePlaybackSync = true
    useEffect(() => {
        if (!enablePlaybackSync || !isJoinee || !sessionId || !currentSyncStatus) {
            return;
        }

        const syncPlayback = async () => {
            try {
                const songs = sessionDetailReduxdata?.session_songs || [];
                const status = currentSyncStatus;
                const currentIndex = status.playIndex;

                if (currentIndex === -1 || currentIndex === null || currentIndex === undefined) {
                    return;
                }
                if (currentIndex >= songs.length) {
                    return;
                }

                const targetSong = songs[currentIndex];

                if (isAppleActive) {
                    // Apple Music Sync
                    // Ensure TrackPlayer is STOPPED when switching to Apple Music
                    try {
                        const tpState = await TrackPlayer.getState();
                        if (tpState === 'playing' || tpState === 3) { // 3 is State.Playing
                            console.log('🛑 [Joinee Sync] Stopping TrackPlayer because Apple Music is active');
                            await TrackPlayer.reset();
                        }
                    } catch (e) { }

                    if (lastSyncedIndex.current !== currentIndex) {
                        console.log('🔄 [Joinee Sync] Switching Apple Music track to:', targetSong.apple_song_id, 'at index:', currentIndex);
                        await resetPlaybackQueue();
                        await setPlaybackQueue(targetSong.apple_song_id);
                        lastSyncedIndex.current = currentIndex;
                    }

                    // Sync Play/Pause
                    if (status.startAudioMixing && !appleFullSongPlaying) {
                        console.log('▶️ [Joinee Sync] Apple Music Play');
                        Player.play();
                    } else if (!status.startAudioMixing && appleFullSongPlaying) {
                        console.log('⏸️ [Joinee Sync] Apple Music Pause');
                        Player.pause();
                    }
                } else {
                    // TrackPlayer (Preview/Spotify) Sync
                    console.log('📻 [Joinee Sync] TrackPlayer Branch Active. Preview URL:', targetSong.song_uri);
                    // Ensure Apple Music is STOPPED when switching to TrackPlayer
                    if (appleFullSongPlaying) {
                        console.log('🛑 [Joinee Sync] Stopping Apple Music because TrackPlayer is active');
                        try {
                            await Player.pause();
                        } catch (e) { }
                    }

                    const tpState = playerState?.state ?? playerState;
                    const isTrackPlayerPlaying = tpState === 'playing' || tpState === 3;
                    console.log('📊 [Joinee Sync] TrackPlayer State:', tpState, 'isPlaying:', isTrackPlayerPlaying);

                    if (lastSyncedIndex.current !== currentIndex) {
                        console.log('🔄 [Joinee Sync] Switching TrackPlayer track to preview:', targetSong.song_uri, 'at index:', currentIndex);
                        await TrackPlayer.reset();
                        const track = {
                            id: targetSong._id,
                            url: targetSong.song_uri,
                            title: targetSong.song_name,
                            artist: targetSong.artist_name,
                            artwork: targetSong.song_image,
                        };
                        console.log('🎵 [Joinee Sync] Adding track to TrackPlayer:', track.title);
                        await TrackPlayer.add([track]);
                        if (status.currentTime) {
                            console.log('🕒 [Joinee Sync] Seeking TrackPlayer to:', status.currentTime);
                            await TrackPlayer.seekTo(status.currentTime);
                        }
                        lastSyncedIndex.current = currentIndex;
                    }

                    // Sync Play/Pause
                    if (status.startAudioMixing && !isTrackPlayerPlaying) {
                        console.log('▶️ [Joinee Sync] TrackPlayer Play');
                        await TrackPlayer.play();
                    } else if (!status.startAudioMixing && isTrackPlayerPlaying) {
                        console.log('⏸️ [Joinee Sync] TrackPlayer Pause');
                        await TrackPlayer.pause();
                    }

                    // Sync seeking
                    const timeDiff = Math.abs((position || 0) - (status.currentTime || 0));
                    if (timeDiff > 3 && status.startAudioMixing) {
                        await TrackPlayer.seekTo(status.currentTime);
                    }
                }
            } catch (error) {
                console.error('❌ [Joinee Sync] Error syncing playback:', error);
            }
        };

        syncPlayback();
    }, [
        currentSyncStatus,
        enablePlaybackSync,
        isJoinee,
        sessionId,
        isAppleActive,
        sessionDetailReduxdata?.session_songs,
        appleFullSongPlaying,
        playerState,
        position,
        resetPlaybackQueue,
        setPlaybackQueue,
    ]);

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
            console.log('🚀 [Sync Hook] Starting Host Emission for session:', sessionId);

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

                // console.log('📡 [Sync Hook] Emitting Payload:', { index: currentTrackIndex, playing: isPlaying, time: positionRef.current });
                socketService.emit('session_play_status', emitObjData);
                setCurrentSyncStatus(emitObjData);
            }, 1000);
        }

        return () => {
            if (intervalId) {
                console.log('🛑 [Sync Hook] Stopping Host Emission');
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
        sessionReduxData?.sessionDetailData,
    ]);

    return {
        isLive,
        isHost,
        isJoinee,
        sessionId,
        sessionDetailReduxdata,
        currentSyncStatus,
        isAppleActive, // Exposed for UI debugging
    };
};
