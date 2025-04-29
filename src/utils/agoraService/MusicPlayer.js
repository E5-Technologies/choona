import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AgoraMusicService from './AgoraService';

const MusicPlayer = ({ isHost, channelName, track }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const init = async () => {
      await AgoraMusicService.initialize(e47e797a5dcf4bd19769cc4e09f86703);
      await AgoraMusicService.joinChannel(channelName, isHost);
      
      if (isHost && track) {
        await AgoraMusicService.playSong(track.url, {
          id: track.id,
          title: track.name,
          artist: track.artist,
          artwork: track.album.images[0]?.url
        });
        setIsPlaying(true);
      }
    };

    init();

    return () => {
      AgoraMusicService.leaveChannel();
    };
  }, [channelName, isHost, track]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await AgoraMusicService.pauseSong();
    } else {
      await AgoraMusicService.playSong(track.url, {
        id: track.id,
        title: track.name,
        artist: track.artist,
        artwork: track.album.images[0]?.url
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{track?.name || 'No track selected'}</Text>
      <Text style={styles.artist}>{track?.artist || ''}</Text>
      
      {isHost ? (
        <View style={styles.controls}>
          <Button
            title={isPlaying ? 'Pause' : 'Play'}
            onPress={handlePlayPause}
          />
        </View>
      ) : (
        <Text>Listening to host's stream...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  artist: {
    fontSize: 18,
    marginBottom: 20,
  },
  controls: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default MusicPlayer;