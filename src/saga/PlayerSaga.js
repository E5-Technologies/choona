import { put, call, fork, takeLatest, all, select } from 'redux-saga/effects';
import {
    GET_CURRENT_PLAYER_POSITION_REQUEST,
    GET_CURRENT_PLAYER_POSITION_SUCCESS,
    GET_CURRENT_PLAYER_POSITION_FAILURE,

    RESUME_PLAYER_REQUEST,
    RESUME_PLAYER_SUCCESS,
    RESUME_PLAYER_FAILURE,

    PAUSE_PLAYER_REQUEST,
    PAUSE_PLAYER_SUCCESS,
    PAUSE_PLAYER_FAILURE,

    PLAYER_SEEK_TO_REQUEST,
    PLAYER_SEEK_TO_SUCCESS,
    PLAYER_SEEK_TO_FAILURE,

    GET_SONG_FROM_ISRC_REQUEST,
    GET_SONG_FROM_ISRC_SUCCESS,
    GET_SONG_FROM_ISRC_FAILURE

} from '../action/TypeConstants';
import { getSpotifyApi, putSpotifyApi, getAppleDevelopersToken } from "../utils/helpers/ApiRequest"
import constants from '../utils/helpers/constants';
import { getSpotifyToken } from '../utils/helpers/SpotifyLogin'
import { getAppleDevToken } from '../utils/helpers/AppleDevToken';
import { getSongFromisrc } from '../action/PlayerAction';

const getItems = (state) => state.TokenReducer

export function* getCurrentPlayerPostion(action) {

    const spotifyToken = yield call(getSpotifyToken);
    const items = yield select(getItems);
    const AppleToken = yield call(getAppleDevToken);

    let spotifyHeader = {
        "Authorization": items.registerType === "spotify" ? `${spotifyToken}` : `${AppleToken}`,
    };

    try {

        if (items.registerType === "spotify") {
            const response = yield call(getSpotifyApi, `${constants.spotifyPlayerBaseUrl}currently-playing`, spotifyHeader)

            yield put({ type: GET_CURRENT_PLAYER_POSITION_SUCCESS, data: response.data });
        }
        else {
            const response = yield call(getAppleDevelopersToken, `https://itunes.apple.com/search?term=${action.text}&entity=song&limit=20`, spotifyHeader)
            yield put({ type: SEARCH_SONG_REQUEST_FOR_POST_SUCCESS, data: response.data.results, post: action.post });
        }

    } catch (error) {

        yield put({ type: GET_CURRENT_PLAYER_POSITION_FAILURE, error: error });
    }
};

export function* resumePlayerAction(action) {

    const spotifyToken = yield call(getSpotifyToken);
    const items = yield select(getItems);
    const AppleToken = yield call(getAppleDevToken);

    let spotifyHeader = {
        "Authorization": items.registerType === "spotify" ? `${spotifyToken}` : `${AppleToken}`,
    };

    try {

        if (items.registerType === "spotify") {
            const response = yield call(putSpotifyApi, `${constants.spotifyPlayerBaseUrl}play`, {}, spotifyHeader)

            yield put({ type: GET_CURRENT_PLAYER_POSITION_SUCCESS, data: response.data });
        }
        else {
            const response = yield call(getAppleDevelopersToken, `https://itunes.apple.com/search?term=${action.text}&entity=song&limit=20`, spotifyHeader)
            yield put({ type: RESUME_PLAYER_SUCCESS, data: response.data });
        }

    } catch (error) {

        yield put({ type: RESUME_PLAYER_FAILURE, error: error.response.data.error.status });
    }
};

export function* pausePlayerAction(action) {

    const spotifyToken = yield call(getSpotifyToken);
    const items = yield select(getItems);
    const AppleToken = yield call(getAppleDevToken);

    let spotifyHeader = {
        "Authorization": items.registerType === "spotify" ? `${spotifyToken}` : `${AppleToken}`,
    };

    try {

        if (items.registerType === "spotify") {
            const response = yield call(putSpotifyApi, `${constants.spotifyPlayerBaseUrl}pause`, {}, spotifyHeader)

            yield put({ type: PAUSE_PLAYER_SUCCESS, data: response.data });
        }
        else {
            const response = yield call(getAppleDevelopersToken, `https://itunes.apple.com/search?term=${action.text}&entity=song&limit=20`, spotifyHeader)
            yield put({ type: PAUSE_PLAYER_SUCCESS, data: response.data });
        }

    } catch (error) {

        yield put({ type: PAUSE_PLAYER_FAILURE, error: error.response.data.error.status });
    }
};

export function* seekToPlayerAction(action) {

    const spotifyToken = yield call(getSpotifyToken);
    const items = yield select(getItems);
    const AppleToken = yield call(getAppleDevToken);

    let spotifyHeader = {
        "Authorization": items.registerType === "spotify" ? `${spotifyToken}` : `${AppleToken}`,
    };

    try {

        if (items.registerType === "spotify") {
            const response = yield call(putSpotifyApi, `${constants.spotifyPlayerBaseUrl}seek`, { position_ms: action.seekTo }, spotifyHeader)

            yield put({ type: PLAYER_SEEK_TO_SUCCESS, data: response.data });
        }
        else {
            const response = yield call(getAppleDevelopersToken, `https://itunes.apple.com/search?term=${action.text}&entity=song&limit=20`, spotifyHeader)
            yield put({ type: PLAYER_SEEK_TO_SUCCESS, data: response.data });
        }

    } catch (error) {

        yield put({ type: PLAYER_SEEK_TO_FAILURE, error: error.response.data.error.status });
    }
};

export function* getSongFromIsrcAction(action) {
    try {
        const spotifyToken = yield call(getSpotifyToken);
        const AppleToken = yield call(getAppleDevToken);

        let spotifyHeader = {
            "Authorization": action.regType === "spotify" ? `${spotifyToken}` : `${AppleToken}`,
        };

        if (action.regType === 'spotify') {
            const response = yield call(getSpotifyApi, `https://api.spotify.com/v1/search?q=isrc:${action.isrc}&type=track`, spotifyHeader);
            yield put({ type: GET_SONG_FROM_ISRC_SUCCESS, data: response.data.tracks.items });
        }
        else {
            const response = yield call(getAppleDevelopersToken, `https://api.music.apple.com/v1/catalog/us/songs?filter[isrc]=${action.isrc}`, spotifyHeader);
            yield put({ type: GET_SONG_FROM_ISRC_SUCCESS, data: response.data.data });
        }

    } catch (error) {
        yield put({ type: GET_SONG_FROM_ISRC_FAILURE, error: error })
    }
};


//WATCH FUNCTIONS
export function* watchGetCurrentPlayerPostionRequest() {
    yield takeLatest(GET_CURRENT_PLAYER_POSITION_REQUEST, getCurrentPlayerPostion)
};

export function* watchResumePlayerRequest() {
    yield takeLatest(RESUME_PLAYER_REQUEST, resumePlayerAction)
};

export function* watchPlayPlayerRequest() {
    yield takeLatest(PAUSE_PLAYER_REQUEST, pausePlayerAction)
};

export function* watchSeekToPlayerRequest() {
    yield takeLatest(PLAYER_SEEK_TO_REQUEST, seekToPlayerAction)
};

export function* watchgetSongFromIsrc() {
    yield takeLatest(GET_SONG_FROM_ISRC_REQUEST, getSongFromIsrcAction)
};
