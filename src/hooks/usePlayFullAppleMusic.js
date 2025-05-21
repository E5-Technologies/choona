import {
  Auth,
  MusicKit,
  Player,
  useCurrentSong,
  useIsPlaying,
  CatalogSearchType,
} from '@lomray/react-native-apple-music';
import {Alert, Platform} from 'react-native';
import useSWR from 'swr';
import toast from '../utils/helpers/ShowErrorAlert';
import {useEffect, useState} from 'react';

export const usePlayFullAppleMusic = () => {
  const {isPlaying} = useIsPlaying();
  const {song: currentSongData} = useCurrentSong();
  const [isAuthorizeToAccessAppleMusic, setIsAuthorizeToAccessAppleMusic] =
    useState(false);
  const [haveAppleMusicSubscription, setHaveAppleMusicSubscription] =
    useState(false);
  console.log(currentSongData, isPlaying, 'thesa rerf');
  useEffect(() => {
     if (Platform.OS == 'ios') {
      onAuth();
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

  const onAuth = async () => {
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
  };

  const onCheckSubs = async () => {
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
      // else if (subscriptionInfo.isMusicCatalogSubscriptionEligible) {
      //   // User is eligible but not currently subscribed
      //   Alert.alert(
      //     'Subscription Required',
      //     'You need to activate your Apple Music subscription to play full songs',
      //     [
      //       { text: 'Cancel' },
      //       { text: 'Subscribe', onPress: () => Linking.openURL('https://music.apple.com') }
      //     ]
      //   );
      //   return false;
      // }
      else {
        // User is not eligible (might be in unsupported region)
        Alert.alert(
          'Not Available',
          'Apple Music subscription is not available for your account',
        );
        setHaveAppleMusicSubscription(false);
        // return false;
      }
    } catch (error) {
      console.error('Subscription check error:', error);
      Alert.alert('Error', 'Could not verify Apple Music subscription status');
      // return false;
    }
  };

  // const onToggle = () => void Player.togglePlayerState();
  const onToggle = async () => {
    try {
      await Player.togglePlayerState();
    } catch (error) {
      console.log(error, 'its errro while playing');
    }
  };

  const onFetch = () => {
    MusicKit.catalogSearch('Taylor Swift', [CatalogSearchType.SONGS], {
      limit: 1,
      offset: 0,
    })
      .then(results => {
        // console.log('Search Results:', results);
        setSongList(results?.songs[0]);
      })
      .catch(error => {
        console.error('Failed to perform catalog search:', error);
      });
  };

  const onSkip = () => void Player.skipToNextEntry();

  async function setPlaybackQueue(itemId) {
    console.log(itemId, 'its item id');
    try {
      await MusicKit.setPlaybackQueue(itemId, 'song');
    } catch (error) {
      console.error('Setting playback queue:', error);
    }
  }

  //   useEffect(() => {
  //     console.log(songList, 'this is first song');

  //     setPlaybackQueue(songList?.id);
  //   }, [songList]);

  return {
    isPlaying,
    currentSongData,
    onAuth,
    onToggle,
    onSkip,
    setPlaybackQueue,
    isAuthorizeToAccessAppleMusic,
    haveAppleMusicSubscription,
  };
};
