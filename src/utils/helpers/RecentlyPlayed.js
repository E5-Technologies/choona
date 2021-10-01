import { useState, useEffect } from 'react';
import { NativeModules } from 'react-native';
import axios from 'axios';

import { getSpotifyToken } from './SpotifyLogin';
import { getAppleDevToken } from './AppleDevToken';
import toast from './ShowErrorAlert';

export function useRecentlyPlayed(registerType, isFetching, setIsFetching) {
  const [musicToken, setMusicToken] = useState('');
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    const getRecentlyPlayedApi = async () => {
      if (registerType === 'spotify') {
        const spotifyToken = await getSpotifyToken();
        return await axios.get(
          'https://api.spotify.com/v1/me/player/recently-played',
          {
            headers: {
              Authorization: spotifyToken,
            },
          },
        );
      } else {
        const AppleToken = await getAppleDevToken();
        return await axios.get(
          'https://api.music.apple.com/v1/me/recent/played/tracks',
          {
            headers: {
              'Music-User-Token': musicToken,
              Authorization: AppleToken,
            },
          },
        );
      }
    };

    const getRecentlyPlayed = async () => {
      try {
        const res = await getRecentlyPlayedApi();
        setIsFetching(false);
        if (res.status === 200) {
          const array = [];
          if (registerType === 'spotify') {
            res.data.items.map(item => array.push(item.track));
          } else {
            res.data.data.map(item => array.push(item));
          }
          setRecentlyPlayed(array);
        } else {
          toast('Oops', 'Something Went Wrong');
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (registerType === 'spotify') {
      getRecentlyPlayed();
    } else {
      const fetchMusicToken = async () => {
        const AppleToken = await getAppleDevToken();
        if (AppleToken !== '') {
          let newtoken = AppleToken.split(' ');
          NativeModules.Print.printValue(newtoken.pop())
            .then(res => {
              if (res === '') {
                toast(
                  'Error',
                  'This feature is available for users with Apple Music Subcription. You need to subscribe to Apple Music to use this feature.',
                );
              } else {
                setMusicToken(res);
                getRecentlyPlayed();
              }
            })
            .catch(() => {
              toast(
                'Error',
                'There was an error getting your recently played tracks.',
              );
            });
        } else {
          toast('Oops', 'Something Went Wrong');
        }
      };
      fetchMusicToken();
    }
  }, [musicToken, registerType, setIsFetching, isFetching]);

  const data = recentlyPlayed;
  return data;
}
