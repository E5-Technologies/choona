import {
  Auth,
  MusicKit,
  Player,
  useCurrentSong,
  useIsPlaying,
  CatalogSearchType,
} from '@lomray/react-native-apple-music';
import {Alert} from 'react-native';
import useSWR from 'swr';
import toast from '../utils/helpers/ShowErrorAlert';
import {useEffect, useState} from 'react';

export const usePlayFullAppleMusic = () => {
  const {isPlaying} = useIsPlaying();
  const {currentSong} = useCurrentSong();
  const [isAuthorizeToAccessAppleMusic, setIsAuthorizeToAccessAppleMusic] =
    useState(false);
  console.log(currentSong, isPlaying, 'thesa rerf');

  const onAuth = () => {
    Auth.authorize()
      .then(status => {
        if (status == 'authorized') {
          setIsAuthorizeToAccessAppleMusic(true);
          onCheckSubs();
        }
        console.log('Authorize:', status);
      })
      .catch(error => {
        toast('Error', "You don't have permission to access apple music");
        console.log(error, 'its error , whil asking permiesion');
      });
  };

  const onCheckSubs = () => {
    Auth.checkSubscription()
      .then(result => {
        console.log('CheckSubscription: ', result);
      })
      .catch(error => {
        Alert.alert(
          'Subscription Required',
          'You need an Apple Music subscription to use this feature',
        );
        console.log(error, 'this is errro when check user Subscription');
        return;
      });
  };

  const onToggle = () => void Player.togglePlayerState();

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
    currentSong,
    onAuth,
    onToggle,
    onSkip,
    setPlaybackQueue,
    isAuthorizeToAccessAppleMusic,
  };
};
