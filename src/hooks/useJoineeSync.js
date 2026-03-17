import { useEffect, useRef } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Player } from '@lomray/react-native-apple-music';

export const useJoineeSync = ({
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
}) => {
    const lastSyncedIndex = useRef(-1);

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

    // PLAYBACK SYNC: Only for Joinees with enablePlaybackSync = true
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
                    try {
                        const tpState = await TrackPlayer.getState();
                        if (tpState === 'playing' || tpState === 3) { // 3 is State.Playing
                            console.log('🛑 [Joinee Sync] Stopping TrackPlayer because Apple Music is active');
                            await TrackPlayer.reset();
                        }
                    } catch (e) { }

                    if (lastSyncedIndex.current !== currentIndex) {
                        console.log('🔄 [Joinee Sync] Switching Apple Music track to:', targetSong.apple_song_id || targetSong._id, 'at index:', currentIndex);
                        await resetPlaybackQueue();
                        await setPlaybackQueue(targetSong.apple_song_id || targetSong._id);
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
                    if (appleFullSongPlaying) {
                        console.log('🛑 [Joinee Sync] Stopping Apple Music because TrackPlayer is active');
                        try {
                            await Player.pause();
                        } catch (e) { }
                    }

                    const tpState = playerState?.state ?? playerState;
                    const isTrackPlayerPlaying = tpState === 'playing' || tpState === 3;

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
};
