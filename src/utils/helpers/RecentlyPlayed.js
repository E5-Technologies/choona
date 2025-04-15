import {useCallback, useEffect, useState} from 'react';
import {Alert, NativeModules} from 'react-native';
import axios from 'axios';

import {getSpotifyToken} from './SpotifyLogin';
import {getAppleDevToken} from './AppleDevToken';
import toast from './ShowErrorAlert';

export function useRecentlyPlayed(registerType) {
  const [loading, setLoading] = useState(false);
  const [musicToken, setMusicToken] = useState('');
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  // Alert.alert('apple');
  // console.log(registerType, 'its register rype');
  const getRecentlyPlayed = useCallback(async () => {
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

    setLoading(true);
    try {
      const res = await getRecentlyPlayedApi();
      setLoading(false);
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
      setLoading(false);
      console.log(error, 'its error h >>>');
    }
  }, [musicToken, registerType]);

  useEffect(() => {
    if (registerType === 'spotify') {
      getRecentlyPlayed();
    } else {
      const fetchMusicToken = async () => {
        const AppleToken = await getAppleDevToken();

        if (AppleToken !== '') {
          let newtoken = AppleToken.split(' ');
          // console.log(newtoken, 'its register rype');
          let finalToken = newtoken.pop();

          if (!finalToken || finalToken.trim() === '') {
            toast('Error', 'Invalid Apple Music token received.');
            return;
          }
          // console.log(finalToken, 'token');
          // return;
          NativeModules.Print.printValue(finalToken)
            .then(res => {
              console.log(res, 'its res');
              return;
              if (res === '') {
                console.log('hi');
                toast(
                  'Error',
                  'This feature is available for users with Apple Music Subcription. You need to subscribe to Apple Music to use this feature.',
                );
              } else {
                return;
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
          toast('Oops', 'Something Went Wrong!');
        }
      };
      fetchMusicToken();
    }
  }, [getRecentlyPlayed, musicToken, registerType]);

  const data = {
    recentlyPlayed: recentlyPlayed,
    loading: loading,
    refetch: () => getRecentlyPlayed(),
  };

  return data;
}
