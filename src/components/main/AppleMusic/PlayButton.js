import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Player} from '@lomray/react-native-apple-music';
import ImagePath from '../../../assests/ImagePath';

const PlayButton = ({songId, size = 40, color = '#000'}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check authorization status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const status = await Player.getAuthorizationStatus();
        setIsAuthorized(status === Player.AUTHORIZED);
      } catch (error) {
        console.error('Authorization check failed:', error);
      }
    };

    checkAuth();
  }, []);

  const requestAuthorization = async () => {
    try {
      const status = await Player.requestAuthorization();
      setIsAuthorized(status === Player.AUTHORIZED);
      return status === Player.AUTHORIZED;
    } catch (error) {
      console.error('Authorization failed:', error);
      return false;
    }
  };

  const togglePlayback = async () => {
    if (!isAuthorized) {
      const authorized = await requestAuthorization();
      if (!authorized) return;
    }

    if (isLoading) return;
    console.log('this is loading');

    setIsLoading(true);
    try {
      if (isPlaying) {
        await Player.stop();
      } else {
        console.log('Playingf');
        await Player.playSong(songId);
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Playback error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={togglePlayback}
      style={[styles.button, {width: size, height: size}]}
      disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        // <Icon
        //   name={isPlaying ? 'pause' : 'play-arrow'}
        //   size={size * 0.6}
        //   color={color}
        // />
        <Image
          source={isPlaying ? ImagePath.play : ImagePath.pause}
          style={{height: 20, width: 20}}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default PlayButton;
