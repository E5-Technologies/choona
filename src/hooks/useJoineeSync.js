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
    setPlaybackQueue,
    isLive
}) => {
    const lastSyncedIndex = useRef(-1);
    const syncingTrackRef = useRef(false);

    // 1. TRACK SYNC: Handles track switching (reset/add/setQueue)
    // Only depends on the current track index and session data.
    useEffect(() => {
        if (!enablePlaybackSync || !isJoinee || !sessionId || !currentSyncStatus) {
            return;
        }

        const songs = sessionDetailReduxdata?.session_songs || [];
        const currentIndex = currentSyncStatus.playIndex;

        if (currentIndex === -1 || currentIndex === null || currentIndex === undefined || currentIndex >= songs.length) {
            return;
        }
        if (lastSyncedIndex.current === currentIndex || syncingTrackRef.current) {
            return;
        }

        const syncTrack = async () => {
            syncingTrackRef.current = true;
            try {
                const targetSong = songs[currentIndex];
                if (isAppleActive) {
                    console.log('🔄 [Joinee Sync] Switching Apple Music track to:', targetSong.apple_song_id || targetSong._id);
                    await resetPlaybackQueue();
                    await setPlaybackQueue(targetSong.apple_song_id || targetSong._id);
                } else {
                    console.log('🔄 [Joinee Sync] Switching TrackPlayer track to preview:', targetSong.song_uri);
                    await TrackPlayer.reset();
                    await TrackPlayer.add([{
                        id: targetSong._id,
                        url: targetSong.song_uri,
                        title: targetSong.song_name,
                        artist: targetSong.artist_name,
                        artwork: targetSong.song_image,
                    }]);
                }
                lastSyncedIndex.current = currentIndex;
            } catch (error) {
                console.error('❌ [Joinee Sync] Track sync error:', error);
            } finally {
                syncingTrackRef.current = false;
            }
        };

        syncTrack();
    }, [
        currentSyncStatus?.playIndex,
        sessionId,
        isAppleActive,
        sessionDetailReduxdata?.session_songs,
        enablePlaybackSync,
        isJoinee,
        resetPlaybackQueue,
        setPlaybackQueue,
        currentSyncStatus,
    ]);

    // 2. PLAYBACK & SEEKING: Handles play/pause and time sync
    // Depends on position and status updates.
    useEffect(() => {
        if (!enablePlaybackSync || !isJoinee || !sessionId || !currentSyncStatus || syncingTrackRef.current) {
            return;
        }
        if (lastSyncedIndex.current === -1) {
            return; // Wait for track sync
        }

        const syncPlayback = async () => {
            const status = currentSyncStatus;

            if (isAppleActive) {
                if (status.startAudioMixing && !appleFullSongPlaying) {
                    Player.play();
                } else if (!status.startAudioMixing && appleFullSongPlaying) {
                    Player.pause();
                }
            } else {
                const tpState = playerState?.state ?? playerState;
                const isTrackPlayerPlaying = tpState === 'playing' || tpState === 3;

                // Play/Pause sync
                if (status.startAudioMixing && !isTrackPlayerPlaying) {
                    await TrackPlayer.play();
                } else if (!status.startAudioMixing && isTrackPlayerPlaying) {
                    await TrackPlayer.pause();
                }

                // Seeking sync (only if playing to avoid stutter during load)
                if (status.startAudioMixing) {
                    const timeDiff = Math.abs((position || 0) - (status.currentTime || 0));
                    if (timeDiff > 3) {
                        await TrackPlayer.seekTo(status.currentTime);
                    }
                }
            }
        };

        syncPlayback();
    }, [
        currentSyncStatus,
        appleFullSongPlaying,
        playerState,
        position,
        isAppleActive,
        enablePlaybackSync,
        isJoinee,
        sessionId,
    ]);

    // 3. SESSION TERMINATION: Stop music when session is no longer live
    useEffect(() => {
        if (!isLive && lastSyncedIndex.current !== -1) {
            console.log('🛑 [Joinee Sync] Stopping music because session is no longer live');
            const stopMusic = async () => {
                try {
                    if (isAppleActive) {
                        await resetPlaybackQueue();
                    } else {
                        await TrackPlayer.reset();
                    }
                    lastSyncedIndex.current = -1;
                } catch (error) {
                    console.error('❌ [Joinee Sync] Error stopping music on session end:', error);
                }
            };
            stopMusic();
        }
    }, [isLive, isAppleActive, resetPlaybackQueue]);
};
