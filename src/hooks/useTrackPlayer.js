import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import TrackPlayer, { Capability, Event, State } from 'react-native-track-player';

const useTrackPlayer = () => {
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState({ position: 0, duration: 0 });

    //   useEffect(() => {
    //     async function setupPlayer() {
    //       await TrackPlayer.setupPlayer();
    //     //   await TrackPlayer.add({
    //     //     id: 'trackId1',
    //     //     url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3', // Example track URL
    //     //     title: 'Sample Track',
    //     //     artist: 'Sample Artist',
    //     //     artwork: 'https://www.example.com/track-image.jpg', // You can put your own artwork image URL
    //     //   });

    //     //   // Optional: Adding event listeners for tracking player events
    //     //   TrackPlayer.addEventListener(Event.PlaybackState, (state) => {
    //     //     console.log('Player state:', state);
    //     //   });
    //     }

    //     setupPlayer();
    //     // Cleanup the player on unmount
    //     return () => {
    //       TrackPlayer.destroy();
    //     };
    //   }, []);

    // const startSessionAndPlay = async (trackData) => {
    //     console.log(trackData, 'yes data')
    //     await TrackPlayer.setupPlayer();
    //     await TrackPlayer.add(trackData);
    //     // Mark player as ready to play when setup is done
    //     setIsPlayerReady(true);

    //     // Start playing it
    //     await TrackPlayer.play();
    //     setIsPlaying(true)

    //     // // Optional: Adding event listeners for tracking player events
    //     // TrackPlayer.addEventListener(Event.PlaybackState, (state) => {
    //     //     console.log('Player state:', state);
    //     // });
    // }


    const startSessionAndPlay = async (trackData) => {
        console.log(trackData, 'yes data');
    
        try {
            await TrackPlayer.setupPlayer();
    
            await TrackPlayer.add(trackData);
    
            setIsPlayerReady(true);
    
            // Wait until TrackPlayer is ready before playing
            let retries = 5;
            let state = await TrackPlayer.getState();
    
            // Retry a few times if not ready
            while (state !== State.Ready && retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, 300)); // wait 300ms
                state = await TrackPlayer.getState();
                retries--;
            }
    
            if (state === State.Ready || state === State.Playing || state === State.Buffering) {
                await TrackPlayer.play();
                setIsPlaying(true);
            } else {
                Alert.alert("Player is not ready", "Could not start playback.");
            }
        } catch (error) {
            console.log("Failed to start session:", error);
            Alert.alert("Error", "Could not start session.");
        }
    };
    

    // Play the track
    const playTrack = async () => {
        await TrackPlayer.play();
        setIsPlaying(true)
    };

    // Pause the track
    const pauseTrack = async () => {
        await TrackPlayer.pause();
        setIsPlaying(false)
    };

    // Skip to the next track
    const skipToNext = async () => {
        await TrackPlayer.skipToNext();
    };

    // Skip to the previous track
    const skipToPrevious = async () => {
        await TrackPlayer.skipToPrevious();
    };

    return (
        { startSessionAndPlay, playTrack, pauseTrack, skipToNext, skipToPrevious, isPlaying, setIsPlaying, isPlayerReady }
    )


};

export default useTrackPlayer;



export async function addTracks(trackList) {
    await TrackPlayer.add(trackList ?? []);
  }
