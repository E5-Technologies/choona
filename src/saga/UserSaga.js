import { put, call, fork, takeLatest, all } from 'redux-saga/effects';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE
} from '../action/TypeConstants';
import { postApi } from "../utils/helpers/ApiRequest"
import AsyncStorage from '@react-native-community/async-storage';


export function* loginAction(action) {

    const header = {
        Accept: 'application/json',
        contenttype: 'application/json',
    }


    try {

        const response = yield call(postApi, `user/signin`, action.payload, header)

        if (response.data.status === 200) {
            yield put({ type: USER_LOGIN_SUCCESS, data: response.data.data });
        } else {
            yield put({ type: USER_LOGIN_FAILURE, error: response.data })
        }

    } catch (error) {

        yield put({ type: USER_LOGIN_FAILURE, error: error })

    }
};


export function* watchLoginRequest() {
    yield takeLatest(USER_LOGIN_REQUEST, loginAction)
};