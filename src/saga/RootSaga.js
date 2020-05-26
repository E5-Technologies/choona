import { put, call, fork, takeLatest, all } from 'redux-saga/effects';
import { watchtokenAction, watchgetTokenAction } from './TokenSaga';
import {
    watchLoginRequest, watchUserSignUpAction, watchuserProfileAction, watcheditProfileAction,
    watchuserSearchAction, watchuserFollowOrUnfollowAction, watchothersProfileAction,
    watchhomePageAction
} from './UserSaga'

import { watchSearchSongsForPostRequest, watchCreatePostRequest } from './PostSaga'
import {watchsaveSongAction} from './SongSaga';


function* RootSaga() {

    yield all([
        watchtokenAction(),
        watchgetTokenAction(),
        watchLoginRequest(),
        watchUserSignUpAction(),
        watchuserProfileAction(),
        watcheditProfileAction(),
        watchuserSearchAction(),
        watchuserFollowOrUnfollowAction(),
        watchSearchSongsForPostRequest(),
        watchCreatePostRequest(),
        watchothersProfileAction(),
        watchhomePageAction(),
        watchsaveSongAction()
    ])
}

export default RootSaga;