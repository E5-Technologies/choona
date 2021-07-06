import { API_HOST } from '../../config';

export default {
  CHOONACREDS: 'CHOONACREDS',
  SPOTIFY: 'SPOTIFY',
  spotify_client_id: '6858d6fea7c54e7d94d57146f3d8812a',
  spotify_client_secret: '2502d00edc2d4c618d843fae71ee1753',
  spotify_redirect_uri: 'com.choona:/oauthredirect',
  spotify_authorize_uri: 'https://accounts.spotify.com/authorize',
  spotify_token_uri: 'https://accounts.spotify.com/api/token',
  spotify_profile_uri: 'https://api.spotify.com/v1/me',
  // profile_picture_base_url: 'http://localhost:1431/uploads/user/thumb/',
  profile_picture_base_url: API_HOST + '/uploads/user/thumb/',
  // BASE_URL: 'http://localhost:1431/api',
  BASE_URL: API_HOST + '/api',
  APPLE: 'APPLETOKEN',
  // appleGetTokenApi: 'http://localhost:1431/api/applemusic/token',
  appleGetTokenApi: API_HOST + '/api/applemusic/token',
  spotifyPlayerBaseUrl: 'https://api.spotify.com/v1/me/player/',
};
