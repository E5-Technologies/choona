import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import useTrackPlayer from '../../hooks/useTrackPlayer';
import TrackPlayer, { State } from 'react-native-track-player';

const TrackPlayerComponent = ({currentTrack}) => {
  const { startSessionAndPlay, playTrack, pauseTrack, skipToNext, skipToPrevious, isPlaying } = useTrackPlayer();

  return (
    <View style={styles.container}>
      <Button title="Start Session" onPress={()=>startSessionAndPlay(currentTrack)} />
      <Button title={isPlaying ? "Pause": 'Play' } onPress={ isPlaying ? pauseTrack: playTrack} />
      {/* <Button title="Pause" onPress={pauseTrack} /> */}
      <Button title="Next" onPress={skipToNext} />
      <Button title="Previous" onPress={skipToPrevious} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default TrackPlayerComponent;
