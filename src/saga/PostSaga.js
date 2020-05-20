import { put, call, fork, takeLatest, all, select } from 'redux-saga/effects';
import {
    SEARCH_SONG_REQUEST_FOR_POST_REQUEST,
    SEARCH_SONG_REQUEST_FOR_POST_SUCCESS,
    SEARCH_SONG_REQUEST_FOR_POST_FAILURE,

    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    CREATE_POST_FAILURE



} from '../action/TypeConstants';
import { postApi, getApi, getSpotifyApi } from "../utils/helpers/ApiRequest"
import AsyncStorage from '@react-native-community/async-storage';
import constants from '../utils/helpers/constants';
import { getSpotifyToken } from '../utils/helpers/SpotifyLogin'

const getItems = (state) => state.TokenReducer


export function* searchSongsForPostAction(action) {

    const spotifyToken = yield call(getSpotifyToken);
    const items = yield select(getItems);

    let spotifyHeader = {
        "Authorization": `${spotifyToken}`,
    }

    try {

        if (items.registerType === "spotify") {
            const response = yield call(getSpotifyApi, `https://api.spotify.com/v1/search?q=${encodeURI(action.payload)}&type=track`, spotifyHeader)

            yield put({ type: SEARCH_SONG_REQUEST_FOR_POST_SUCCESS, data: response.data.tracks.items });
        }

    } catch (error) {

        yield put({ type: SEARCH_SONG_REQUEST_FOR_POST_FAILURE, data: error });
    }
};


export function* createPostAction(action) {

    const items = yield select(getItems);

    const header = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: items.token
    }

    try {

        const response = yield call(postApi, `post/store`, action.payload, header)

        yield put({ type: CREATE_POST_SUCCESS, data: response.data });


    } catch (error) {

        yield put({ type: CREATE_POST_FAILURE, data: error });
    }
};

export function* watchSearchSongsForPostRequest() {
    yield takeLatest(SEARCH_SONG_REQUEST_FOR_POST_REQUEST, searchSongsForPostAction)
}

export function* watchCreatePostRequest() {
    yield takeLatest(CREATE_POST_REQUEST, createPostAction)
}