import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';
import {
    SAVE_SONGS_REQUEST,
    SAVE_SONGS_SUCCESS,
    SAVE_SONGS_FAILURE,

    SAVED_SONGS_LIST_REQUEST,
    SAVED_SONGS_LIST_SUCCESS,
    SAVED_SONGS_LIST_FAILURE,

    UNSAVE_SONG_REQUEST,
    UNSAVE_SONG_SUCCESS,
    UNSAVE_SONG_FAILURE
} from '../action/TypeConstants';
import { getApi, postApi } from '../utils/helpers/ApiRequest';

const getItems = (state) =>  state.TokenReducer 

export function* saveSongAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token

        };

    const response = yield call(postApi, `song/store`, action.payload, Header)

        yield put({ type: SAVE_SONGS_SUCCESS, data: response.data });

    } catch (error) {
        yield put({ type: SAVE_SONGS_FAILURE, error: error })
    }
};



//WATCH FUNCTIONS

export function* watchsaveSongAction() {
    yield takeLatest( SAVE_SONGS_REQUEST, saveSongAction)
};