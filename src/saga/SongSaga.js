import {call, put, takeLatest, select} from 'redux-saga/effects';
import {
  SAVE_SONGS_REQUEST,
  SAVE_SONGS_SUCCESS,
  SAVE_SONGS_FAILURE,
  SAVED_SONGS_LIST_REQUEST,
  SAVED_SONGS_LIST_SUCCESS,
  SAVED_SONGS_LIST_FAILURE,
  UNSAVE_SONG_REQUEST,
  UNSAVE_SONG_SUCCESS,
  UNSAVE_SONG_FAILURE,
  SAVE_SONG_REFERENCE_REQUEST,
  SAVE_SONG_REFERENCE_SUCCESS,
  SAVE_SONG_REFERENCE_FAILURE,
  TOP_50_SONGS_REQUEST,
  TOP_50_SONGS_SUCCESS,
  TOP_50_SONGS_FAILURE,
} from '../action/TypeConstants';
import {
  getApi,
  getAppleDevelopersToken,
  postApi,
} from '../utils/helpers/ApiRequest';
import {getSpotifyToken} from '../utils/helpers/SpotifyLogin';
import {getAppleDevToken} from '../utils/helpers/AppleDevToken';

const getItems = state => state.TokenReducer;

export function* saveSongAction(action) {
  try {
    const items = yield select(getItems);

    const Header = {
      Accept: 'application/json',
      contenttype: 'application/json',
      accesstoken: items.token,
    };

    const response = yield call(postApi, 'song/store', action.payload, Header);

    yield put({type: SAVE_SONGS_SUCCESS, data: response.data});
  } catch (error) {
    yield put({type: SAVE_SONGS_FAILURE, error: error});
  }
}

export function* savedSongListAction(action) {
  try {
    const items = yield select(getItems);

    const Header = {
      Accept: 'application/json',
      contenttype: 'application/json',
      accesstoken: items.token,
    };

    const response = yield call(
      postApi,
      'song/search',
      {keyword: action.search},
      Header,
    );

    yield put({type: SAVED_SONGS_LIST_SUCCESS, data: response.data.data});
  } catch (error) {
    yield put({type: SAVED_SONGS_LIST_FAILURE, error: error});
  }
}

export function* unsaveSongAction(action) {
  try {
    const items = yield select(getItems);

    const Header = {
      Accept: 'application/json',
      contenttype: 'application/json',
      accesstoken: items.token,
    };

    const response = yield call(getApi, `song/remove/${action.id}`, Header);

    yield put({type: UNSAVE_SONG_SUCCESS, data: response.data});
  } catch (error) {
    yield put({type: UNSAVE_SONG_FAILURE, error: error});
  }
}

export function* saveSongRefAction(action) {
  try {
    yield put({type: SAVE_SONG_REFERENCE_SUCCESS, data: action.object});
  } catch (error) {
    yield put({type: SAVE_SONG_REFERENCE_FAILURE, error: error});
  }
}

export function* getTop50Song() {
  const items = yield select(getItems);
  const spotifyToken = yield call(getSpotifyToken);
  const AppleToken = yield call(getAppleDevToken);

  let spotifyHeader = {
    Authorization:
      items.registerType === 'spotify' ? `${spotifyToken}` : `${AppleToken}`,
  };

  const Header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.token,
  };

  try {
    if (items.registerType === 'spotify') {
      const response = yield call(
        getAppleDevelopersToken,
        // `https://api.spotify.com/v1/browse/featured-playlists`,
        "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF",
        spotifyHeader,
      );
      const jsonResponse = JSON.parse(response?.request?._response);
      // console.log(jsonResponse,'kdjfhd')
      // const songsArray = jsonResponse?.playlists?.items ?? [];
      const songsArray = jsonResponse?.tracks?.items ?? [];

      // console.log(
      //   JSON.stringify(jsonResponse?.playlists?.items),
      //   'jdhfjksdhfds',
      // );
      // return;
      yield put({
        type: TOP_50_SONGS_SUCCESS,
        data: songsArray,
      });
    } else {
      // let response = yield call(getApi, 'post/topfifty', Header);
      // yield put({ type: TOP_50_SONGS_SUCCESS, data: response.data.data });

      const response = yield call(
        getAppleDevelopersToken,
        `https://api.music.apple.com/v1/catalog/us/charts?types=songs&limit=20`,
        spotifyHeader,
      );
      const jsonResponse = JSON.parse(response?.request?._response);
      const songsArray = jsonResponse?.results?.songs?.[0]?.data ?? [];
      // return;
      yield put({
        type: TOP_50_SONGS_SUCCESS,
        data: songsArray,
      });
    }
  } catch (error) {
    yield put({type: TOP_50_SONGS_FAILURE, error: error});
  }
}

//WATCH FUNCTIONS

export function* watchsaveSongAction() {
  yield takeLatest(SAVE_SONGS_REQUEST, saveSongAction);
}

export function* watchsavedSongListAction() {
  yield takeLatest(SAVED_SONGS_LIST_REQUEST, savedSongListAction);
}

export function* watchunsaveSongAction() {
  yield takeLatest(UNSAVE_SONG_REQUEST, unsaveSongAction);
}

export function* watchsaveSongRefAction() {
  yield takeLatest(SAVE_SONG_REFERENCE_REQUEST, saveSongRefAction);
}

export function* watchTop50SongsAction() {
  yield takeLatest(TOP_50_SONGS_REQUEST, getTop50Song);
}
