import { useEffect, useRef, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';
import socketService from '../utils/socket/socketService';
import { useIsPlaying, useCurrentSong, Player } from '@lomray/react-native-apple-music';
import { useMusicPlayer } from '../context/AppleMusicContext';
import { usePlaybackState, useProgress } from 'react-native-track-player';
import TrackPlayer from 'react-native-track-player';

export const useSessionHosting = () => {
    const userProfileResp = useSelector(state => state.UserReducer.userProfileResp);
    const userTokenData = useSelector(state => state.TokenReducer);
    const sessionReduxData = useSelector(state => state.SessionReducer);
    const sessionDetailReduxdata = sessionReduxData?.sessionDetailData?.data;

    const { isPlaying: appleFullSongPlaying } = useIsPlaying();
    const playerState = usePlaybackState();
    const { progress, setPlaybackQueue, resetPlaybackQueue } = useMusicPlayer();
    const { position } = useProgress(200);
    const { song: currentPlayinSongData } = useCurrentSong();

    const isLive = sessionDetailReduxdata?.isLive ?? false;
    const isHost = userProfileResp?._id === sessionDetailReduxdata?.own_user?._id;
    const sessionId = sessionDetailReduxdata?._id;

    const isJoinee = useMemo(() => {
        if (!isLive || isHost || !sessionDetailReduxdata?.users) return false;
        return sessionDetailReduxdata.users.some(
            user => user._id === userProfileResp?._id
        );
    }, [isLive, isHost, sessionDetailReduxdata?.users, userProfileResp?._id]);

    const positionRef = useRef(0);
    const [currentSyncStatus, setCurrentSyncStatus] = useState(null);
    const lastSyncedIndex = useRef(-1);

    // Determine if we are using Apple Music or Preview/Spotify
    const isAppleRegisterType = userTokenData?.registerType === 'apple';

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
    }, [userTokenData?.token]);

    // PROACTIVE RESET when joining a session
    useEffect(() => {
        if (isJoinee && sessionId) {
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
    }, [isJoinee, sessionId, isAppleActive, resetPlaybackQueue]);

    // JOINEE SYNC LOGIC
    useEffect(() => {
        if (!isJoinee || !sessionId) {
            lastSyncedIndex.current = -1;
            return;
        }

        const handleStatusUpdate = async (status) => {
            try {
                const songs = sessionDetailReduxdata?.session_songs || [];
                setCurrentSyncStatus(status);
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
                    if (lastSyncedIndex.current !== currentIndex) {
                        console.log('🔄 [Joinee Sync] Changing Apple Music track to index:', currentIndex);
                        await resetPlaybackQueue();
                        await setPlaybackQueue(targetSong.apple_song_id);
                        lastSyncedIndex.current = currentIndex;
                    }

                    // Sync Play/Pause
                    if (status.startAudioMixing && !appleFullSongPlaying) {
                        Player.play();
                    } else if (!status.startAudioMixing && appleFullSongPlaying) {
                        Player.pause();
                    }

                    // Sync seeking if significantly different (diff > 5s)
                    const timeDiff = Math.abs((progress || 0) - (status.currentTime || 0));
                    if (timeDiff > 5 && status.startAudioMixing) {
                        // MusicKit.seekToTime(status.currentTime); // If available, else just rely on play state
                    }
                } else {
                    // TrackPlayer (Preview/Spotify) Sync
                    const isTrackPlayerPlaying = playerState?.state === 'playing';

                    if (lastSyncedIndex.current !== currentIndex) {
                        console.log('🔄 [Joinee Sync] Changing TrackPlayer track to index:', currentIndex);
                        await TrackPlayer.reset();
                        const track = {
                            id: targetSong._id,
                            url: targetSong.song_uri,
                            title: targetSong.song_name,
                            artist: targetSong.artist_name,
                            artwork: targetSong.song_image,
                        };
                        await TrackPlayer.add([track]);
                        if (status.currentTime) {
                            await TrackPlayer.seekTo(status.currentTime);
                        }
                        lastSyncedIndex.current = currentIndex;
                    }

                    // Sync Play/Pause
                    if (status.startAudioMixing && !isTrackPlayerPlaying) {
                        await TrackPlayer.play();
                    } else if (!status.startAudioMixing && isTrackPlayerPlaying) {
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

        socketService.on('session_play_status', handleStatusUpdate);
        return () => {
            socketService.off('session_play_status', handleStatusUpdate);
        };
    }, [
        isJoinee,
        sessionId,
        isAppleActive,
        sessionDetailReduxdata?.session_songs,
        appleFullSongPlaying,
        playerState?.state,
        progress,
        position,
        resetPlaybackQueue,
        setPlaybackQueue,
    ]);

    // Session status interval (Emitting only if live and host)
    useEffect(() => {
        let intervalId;

        if (isLive && isHost && sessionId) {
            console.log('🚀 Starting global session sync for session:', sessionId);

            intervalId = setInterval(() => {
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
                setCurrentSyncStatus(emitObjData);
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
        isJoinee,
        sessionId,
        sessionDetailReduxdata,
        currentSyncStatus
    };
};
