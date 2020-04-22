import { put, call, fork, takeLatest, all } from 'redux-saga/effects';
import {watchtokenAction, watchgetTokenAction} from './TokenSaga';


function* RootSaga() {
    
    yield all ([
        watchtokenAction(),
        watchgetTokenAction()
    ])
}

export default RootSaga;