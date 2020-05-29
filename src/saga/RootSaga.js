import { put, call, fork, takeLatest, all } from 'redux-saga/effects';
import { watchtokenAction, watchgetTokenAction } from './TokenSaga';
import {
    watchLoginRequest, watchUserSignUpAction, watchuserProfileAction, watcheditProfileAction,
    watchuserSearchAction, watchuserFollowOrUnfollowAction, watchothersProfileAction,
    watchhomePageAction, watchcommentOnPostAction, watchfollowerListAction,
    watchfollowingListAction, watchReactionOnPostAction, watchactivityListAction
} from './UserSaga'

import { watchSearchSongsForPostRequest, watchCreatePostRequest } from './PostSaga'

import {watchsaveSongAction, watchsavedSongListAction, watchunsaveSongAction} from './SongSaga';


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
        watchsaveSongAction(),
        watchsavedSongListAction(),
        watchunsaveSongAction(),
        watchcommentOnPostAction(),
        watchfollowerListAction(),
        watchfollowingListAction(),
        watchReactionOnPostAction(),
        watchactivityListAction()

    ])
}

export default RootSaga;