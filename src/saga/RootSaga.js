import { put, call, fork, takeLatest, all } from 'redux-saga/effects';
import { watchtokenAction, watchgetTokenAction } from './TokenSaga';
import { watchLoginRequest, watchUserSignUpAction, watchuserProfileAction, watcheditProfileAction,
watchuserSearchAction, watchuserFollowOrUnfollowAction, watchothersProfileAction } from './UserSaga'



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
        watchothersProfileAction()
    ])
}

export default RootSaga;