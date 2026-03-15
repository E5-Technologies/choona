import {
  Auth,
  MusicKit,
  Player,
  CatalogSearchType,
} from '@lomray/react-native-apple-music';
import { Alert, Platform } from 'react-native';
import toast from '../utils/helpers/ShowErrorAlert';
import { useCallback, useEffect, useState } from 'react';

export const usePlayFullAppleMusic = () => {
  // const {isPlaying} = useIsPlaying();
  // const {song: currentSongData} = useCurrentSong();
  const [isAuthorizeToAccessAppleMusic, setIsAuthorizeToAccessAppleMusic] =
    useState(false);
  const [haveAppleMusicSubscription, setHaveAppleMusicSubscription] =
    useState(false);
  // console.log(currentSongData, isPlaying, 'thesa rerf');
  useEffect(() => {
    if (Platform.OS == 'ios') {
      onAuth();
      // checkPlaybackState()
    }
  }, []);

  // const onAuth = () => {
  //   Auth.authorize()
  //     .then(status => {
  //       Alert.alert('hey')
  //       if (status == 'authorized') {
  //         setIsAuthorizeToAccessAppleMusic(true);
  //         onCheckSubs();
  //       }
  //       console.log('Authorize:', status);
  //     })
  //     .catch(error => {
  //       toast('Error', "You don't have permission to access apple music");
  //       console.log(error, 'its error , whil asking permiesion');
  //     });
  // };

  // const onCheckSubs = () => {
  //   Auth.checkSubscription()
  //     .then(result => {
  //       console.log('CheckSubscription: ', result);
  //     })
  //     .catch(error => {
  //       Alert.alert(
  //         'Subscription Required',
  //         'You need an Apple Music subscription to use this feature',
  //       );
  //       console.log(error, 'this is errro when check user Subscription');
  //       return;
  //     });
  // };

  const onAuth = useCallback(async () => {
    try {
      const status = await Auth.authorize();
      // Alert.alert('Authorization Status', `Status: ${status}`);

      if (status === 'authorized') {
        setIsAuthorizeToAccessAppleMusic(true);
        await onCheckSubs();
      } else {
        toast('Error', "You don't have permission to access Apple Music");
      }
    } catch (error) {
      console.error('Authorization error:', error);
      toast('Error', 'Failed to access Apple Music');
    }
  }, []);

  const onCheckSubs = useCallback(async () => {
    try {
      const subscriptionInfo = await Auth.checkSubscription();
      console.log('Subscription Info:', subscriptionInfo);

      // Key checks for active subscription
      if (subscriptionInfo.canPlayCatalogContent) {
        // User has an active Apple Music subscription
        console.log('User has Apple Music subscription');
        setHaveAppleMusicSubscription(true);
        // return true;
      }
      else {
        // User is not eligible (might be in unsupported region)
        setHaveAppleMusicSubscription(false);
        // return false;
      }
    } catch (error) {
      console.error('Subscription check error:', error);
      Alert.alert('Error', 'Could not verify Apple Music subscription status');
      // return false;
    }
  }, []);

  // const onToggle = () => void Player.togglePlayerState();
  const onToggle = useCallback(async () => {
    try {
      await Player.togglePlayerState();
    } catch (error) {
      console.log(error, 'its errro while playing');
    }
  }, []);

  const onFetch = useCallback(() => {
    MusicKit.catalogSearch('Taylor Swift', [CatalogSearchType.SONGS], {
      limit: 1,
      offset: 0,
    })
      .then(results => {
        // console.log('Search Results:', results);
      })
      .catch(error => {
        console.error('Failed to perform catalog search:', error);
      });
  }, []);

  const onSkip = useCallback(() => void Player.skipToNextEntry(), []);

  const setPlaybackQueue = useCallback(async (itemId) => {
    console.log('usePlayFullAppleMusic: setPlaybackQueue called with:', itemId);
    try {
      if (!itemId) {
        console.error('usePlayFullAppleMusic: itemId is empty');
        return;
      }
      // The patched library uses setPlaybackQueueList instead of setPlaybackQueue
      await MusicKit.setPlaybackQueueList([itemId.toString()], 'song');
      // await MusicKit.setPlaybackQueue(itemId.toString(), 'song');
      console.log('usePlayFullAppleMusic: Successfully set playback queue for:', itemId);
    } catch (error) {
      console.error('usePlayFullAppleMusic: Error setting playback queue:', error);
    }
  }, []);

  const resetPlaybackQueue = useCallback(async () => {
    try {
      // Attempt to pause playback first to clear native state
      try {
        await Player.pause();
      } catch (pauseError) {
        // Silently skip if already paused or idle
        console.log('Apple Music Player.pause (soft catch):', pauseError?.message);
      }

      // Clear the queue
      const res = await MusicKit.resetPlaybackQueue();
      console.log('Apple Music Queue Reset result:', res);
    } catch (error) {
      // Gracefully handle "context not found" errors which are expected when idle
      if (error?.message?.includes('Playback context not found')) {
        console.log('Apple Music Queue Reset: Context already idle/cleared.');
      } else {
        console.log('Error resetting queue:', error);
      }
    }
  }, []);

  const checkPlaybackState = useCallback(async () => {
    try {
      const state = await Player.getCurrentState();
      return state;
    } catch (error) {
      console.error('Error getting playback state:', {
        error: error.message,
        code: error.code || 'UNKNOWN',
        stack: error.stack,
      });

      Alert.alert(
        'Playback Error',
        'Could not check current playback status. Please try again.',
      );

      throw error; // Re-throw if you want calling code to handle it
    }
  }, []);

  // // Usage example:
  // const handleCheckState = async () => {
  //   try {
  //     const currentState = await checkPlaybackState();
  //     // Do something with the state...
  //   } catch (error) {
  //     // Handle error if needed
  //   }
  // };
  //   useEffect(() => {
  //     console.log(songList, 'this is first song');

  //     setPlaybackQueue(songList?.id);
  //   }, [songList]);

  return {
    onAuth,
    onToggle,
    onSkip,
    setPlaybackQueue,
    isAuthorizeToAccessAppleMusic,
    haveAppleMusicSubscription,
    resetPlaybackQueue,
    checkPlaybackState,
  };
};
