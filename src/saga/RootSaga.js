import { put, call, fork, takeLatest, all } from 'redux-saga/effects';
import { watchtokenAction, watchgetTokenAction } from './TokenSaga';
import { watchLoginRequest } from './UserSaga'



function* RootSaga() {

    yield all([
        watchtokenAction(),
        watchgetTokenAction(),
        watchLoginRequest()
    ])
}

export default RootSaga;