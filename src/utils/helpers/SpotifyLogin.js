import constants from './constants';
import AsyncStorage from '@react-native-community/async-storage';
import { authorize, refresh } from 'react-native-app-auth';
import { getSpotifyApi } from './ApiRequest';
import moment from 'moment';
import { songMessageReadRequest } from '../../action/MessageAction';


const config = {
  clientId: constants.spotify_client_id,
  clientSecret: constants.spotify_client_secret,
  // clientId: "6858d6fea7c54e7d94d57146f3d8812a",
  // clientSecret: "2502d00edc2d4c618d843fae71ee1753",
  redirectUrl: constants.spotify_redirect_uri,
  scopes: [
    'user-read-email',
    'user-read-private',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-recently-played',
  ],
  serviceConfiguration: {
    authorizationEndpoint: constants.spotify_authorize_uri,
    tokenEndpoint: constants.spotify_token_uri,
  },
};
console.log(config)
// console.log(constants, 'its onctstnt')



export const loginWithSpotify = async () => {
  try {
    const result = await authorize(config);
    // console.log(result, 'its result')
    // return
    await AsyncStorage.setItem(
      constants.SPOTIFY,
      JSON.stringify({
        accessToken: result.accessToken,
        accessTokenExpirationDate: result.accessTokenExpirationDate,
        refreshToken: result.refreshToken,
      }),
    );

    let header = {
      Authorization: `Bearer ${result.accessToken}`,
    };

    const spotifyUserResponse = await getSpotifyApi(
      constants.spotify_profile_uri,
      header,
    );
    console.log(spotifyUserResponse, 'its spotify hit')

    if (spotifyUserResponse.status === 200) {
      return spotifyUserResponse.data;
    }
    return {};
  } catch (error) {
    console.log(JSON.stringify(error), 'this is error')
    return {};
  }
};

export const getSpotifyToken = async () => {
  try {
    const value = await AsyncStorage.getItem(constants.SPOTIFY);

    let accessToken = JSON.parse(value).accessToken;
    let accessTokenExpirationDate = JSON.parse(value).accessTokenExpirationDate;
    let refreshToken = JSON.parse(value).refreshToken;
    let currentTime = moment().utc().format('YYYY-MM-DDTHH:mm:ssZ');

    if (accessTokenExpirationDate > currentTime) {
      return `Bearer ${accessToken}`;
    } else {
      const result = await refresh(config, { refreshToken: refreshToken });

      await AsyncStorage.setItem(
        constants.SPOTIFY,
        JSON.stringify({
          accessToken: result.accessToken,
          accessTokenExpirationDate: result.accessTokenExpirationDate,
          refreshToken: result.refreshToken,
        }),
      );

      return `Bearer ${result.accessToken}`;
    }
  } catch (error) {
    return '';
  }
};
