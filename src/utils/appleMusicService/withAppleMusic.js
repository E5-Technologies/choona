// withAppleMusic.js
import React from 'react';
import { Auth, MusicKit, Player } from '@lomray/react-native-apple-music';
import { Alert, Platform } from 'react-native';
import toast from '../utils/helpers/ShowErrorAlert';

const withAppleMusic = (WrappedComponent) => {
  return function WithAppleMusic(props) {
    const [isAuthorized, setIsAuthorized] = React.useState(false);
    const [hasSubscription, setHasSubscription] = React.useState(false);

    React.useEffect(() => {
      if (Platform.OS === 'ios') {
        handleAuth();
      }
    }, []);

    const handleAuth = async () => {
      try {
        const status = await Auth.authorize();
        if (status === 'authorized') {
          setIsAuthorized(true);
          await checkSubscription();
        } else {
          toast('Error', "You don't have permission to access Apple Music");
        }
      } catch (error) {
        console.error('Authorization error:', error);
        toast('Error', 'Failed to access Apple Music');
      }
    };

    const checkSubscription = async () => {
      try {
        const subscriptionInfo = await Auth.checkSubscription();
        if (subscriptionInfo.canPlayCatalogContent) {
          setHasSubscription(true);
        } else {
          Alert.alert(
            'Not Available',
            'Apple Music subscription is not available for your account'
          );
          setHasSubscription(false);
        }
      } catch (error) {
        console.error('Subscription check error:', error);
        Alert.alert('Error', 'Could not verify Apple Music subscription status');
      }
    };

    const togglePlayback = async () => {
      try {
        await Player.togglePlayerState();
      } catch (error) {
        console.log('Error while playing:', error);
      }
    };

    const skipToNext = () => Player.skipToNextEntry();

    const playSong = async (songId) => {
      try {
        await MusicKit.setPlaybackQueue(songId, 'song');
      } catch (error) {
        console.error('Error setting playback queue:', error);
      }
    };

    const resetQueue = async () => {
      try {
        await MusicKit.resetPlaybackQueue();
      } catch (error) {
        console.log('Error resetting queue:', error);
      }
    };

    const getPlaybackState = async () => {
      try {
        return await Player.getCurrentState();
      } catch (error) {
        console.error('Error getting playback state:', error);
        Alert.alert(
          'Playback Error',
          'Could not check current playback status. Please try again.'
        );
        throw error;
      }
    };

    return (
      <WrappedComponent
        {...props}
        isAppleMusicAuthorized={isAuthorized}
        hasAppleMusicSubscription={hasSubscription}
        authorizeAppleMusic={handleAuth}
        toggleAppleMusicPlayback={togglePlayback}
        skipAppleMusicToNext={skipToNext}
        playAppleMusicSong={playSong}
        resetAppleMusicQueue={resetQueue}
        getAppleMusicPlaybackState={getPlaybackState}
      />
    );
  };
};

export default withAppleMusic;