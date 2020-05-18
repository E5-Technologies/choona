import { put, call, fork, takeLatest, all } from 'redux-saga/effects';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,

    ASYNC_STORAGE_SUCCESS,

    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,
    USER_SIGNUP_FAILURE
} from '../action/TypeConstants';
import { postApi } from "../utils/helpers/ApiRequest"

import AsyncStorage from '@react-native-community/async-storage';
import constants from '../utils/helpers/constants';


export function* loginAction(action) {

    const header = {
        Accept: 'application/json',
        contenttype: 'application/json',
    }


    try {

        const response = yield call(postApi, `user/signin`, action.payload, header)

        if (response.data.status === 200) {

            yield call(AsyncStorage.setItem, constants.CHOONACREDS, JSON.stringify({ "token": response.data.token }))

            yield put({ type: USER_LOGIN_SUCCESS, data: response.data.data });
            yield put({ type: ASYNC_STORAGE_SUCCESS, token: response.data.token })


        } else {
            yield put({ type: USER_LOGIN_FAILURE, error: response.data })
        }

    } catch (error) {

        yield put({ type: USER_LOGIN_FAILURE, error: error })

    }
};

export function* UserSignUpAction(action) {
    try {

        const header = {
            Accept: 'application/json',
            contenttype: 'application/json',
        };

        const response = yield call(postApi, 'user/signup', action.payload, header)

        yield call(AsyncStorage.setItem, constants.CHOONACREDS, JSON.stringify({ "token": response.data.token }))

        yield put({ type: USER_SIGNUP_SUCCESS, data: response.data.data });
        yield put({ type: ASYNC_STORAGE_SUCCESS, token: response.data.token })

    } catch (error) {
        yield put({ type: USER_SIGNUP_FAILURE, error: error })
    }
}


export function* watchLoginRequest() {
    yield takeLatest(USER_LOGIN_REQUEST, loginAction);
};

export function* watchUserSignUpAction() {
    yield takeLatest(USER_SIGNUP_REQUEST, UserSignUpAction);
}