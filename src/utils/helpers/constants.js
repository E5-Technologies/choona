import env from 'react-native-config';
import { API_HOST } from '../../config';

export default {
  CHOONACREDS: 'CHOONACREDS',
  SPOTIFY: 'SPOTIFY',
  spotify_client_id: env.SPOTIFY_CLIENT_ID,
  spotify_client_secret: env.SPOTIFY_CLIENT_SECRET,
  spotify_redirect_uri: 'com.choona:/oauthredirect',
  spotify_authorize_uri: 'https://accounts.spotify.com/authorize',
  spotify_token_uri: 'https://accounts.spotify.com/api/token',
  spotify_profile_uri: 'https://api.spotify.com/v1/me',
  profile_picture_base_url: API_HOST + '/uploads/user/thumb/',
  BASE_URL: API_HOST + '/api',
  APPLE: 'APPLETOKEN',
  appleGetTokenApi: API_HOST + '/api/applemusic/token',
  spotifyPlayerBaseUrl: 'https://api.spotify.com/v1/me/player/',
  website_url: env.WEBSITE_URL,
};
