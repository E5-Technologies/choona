import { put, call, fork, takeLatest, all } from 'redux-saga/effects';
import { watchtokenAction, watchgetTokenAction } from './TokenSaga';
import {
    watchLoginRequest, watchUserSignUpAction, watchuserProfileAction, watcheditProfileAction,
    watchuserSearchAction, watchuserFollowOrUnfollowAction, watchothersProfileAction,
    watchhomePageAction, watchcommentOnPostAction, watchfollowerListAction,
    watchfollowingListAction, watchReactionOnPostAction, watchactivityListAction,
    watchfeaturedTrackSearchAction, watchUserLogoutAction
} from './UserSaga'

import { watchSearchSongsForPostRequest, watchCreatePostRequest, watchdeletePostAction,
watchSearchPostAction } from './PostSaga'

import {
    watchsaveSongAction, watchsavedSongListAction, watchunsaveSongAction,
    watchsaveSongRefAction
} from './SongSaga';

import {
    watchGetChatTokenRequest, watchSendChatMessageRequest,
    watchgetChatListAction, watchLoadMessages
} from './MessageSaga';


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
        watchactivityListAction(),
        watchGetChatTokenRequest(),
        watchSendChatMessageRequest(),
        watchsaveSongRefAction(),
        watchgetChatListAction(),
        watchLoadMessages(),
        watchdeletePostAction(),
        watchfeaturedTrackSearchAction(),
        watchUserLogoutAction(),
        watchSearchPostAction(),

    ])
}

export default RootSaga;