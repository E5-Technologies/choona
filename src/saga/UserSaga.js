import { put, call, fork, takeLatest, all, select } from 'redux-saga/effects';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,

    ASYNC_STORAGE_SUCCESS,

    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,
    USER_SIGNUP_FAILURE,

    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAILURE,

    EDIT_PROFILE_REQUEST,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAILURE

} from '../action/TypeConstants';
import { postApi, getApi } from "../utils/helpers/ApiRequest"

import AsyncStorage from '@react-native-community/async-storage';
import constants from '../utils/helpers/constants';

const getItems = (state) => state.TokenReducer

export function* loginAction(action) {

    const header = {
        Accept: 'application/json',
        contenttype: 'application/json',
    }

    try {

        const response = yield call(postApi, `user/signin`, action.payload, header)

        if (response.data.status === 200) {

            yield call(AsyncStorage.setItem, constants.CHOONACREDS, JSON.stringify({ "token": response.data.token,
            "registerType": response.data.data.register_type  }))

            yield put({ type: USER_LOGIN_SUCCESS, data: response.data.data });
            yield put({ type: ASYNC_STORAGE_SUCCESS, token: response.data.token, registerType:response.data.data.register_type  })


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
            contenttype: 'multipart/formdata',
        };

        const response = yield call(postApi, 'user/signup', action.payload, header)

        yield call(AsyncStorage.setItem, constants.CHOONACREDS, JSON.stringify({ "token": response.data.token,
        "registerType": response.data.data.register_type }))

        yield put({ type: USER_SIGNUP_SUCCESS, data: response.data.data });
        yield put({ type: ASYNC_STORAGE_SUCCESS, token: response.data.token, registerType:response.data.data.register_type  })

    } catch (error) {
        yield put({ type: USER_SIGNUP_FAILURE, error: error })
    }
};


export function* userProfileAction(action) {
    try {
        const items = yield select(getItems)

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call (getApi, 'user/profile', Header);
        yield put ({type: USER_PROFILE_SUCCESS, data:response.data.data});

    } catch (error) {
        yield put ({type: USER_PROFILE_FAILURE, error: error})
    }
};


export function* editProfileAction(action) {
    try {
        const items = yield select(getItems)

        const Header = {
            Accept: 'application/json',
            contenttype: 'multipart/formdata',
            accesstoken: items.token
        };

        const response = yield call (postApi, 'user/profile/update', action.payload,  Header);
        yield put ({type: EDIT_PROFILE_SUCCESS, data:response.data.data});

    } catch (error) {
        yield put ({type: EDIT_PROFILE_FAILURE, error: error})
    }
};



export function* watchLoginRequest() {
    yield takeLatest(USER_LOGIN_REQUEST, loginAction);
};

export function* watchUserSignUpAction() {
    yield takeLatest(USER_SIGNUP_REQUEST, UserSignUpAction);
};

export function* watchuserProfileAction() {
    yield takeLatest(USER_PROFILE_REQUEST, userProfileAction)
};

export function* watcheditProfileAction() {
    yield takeLatest(EDIT_PROFILE_REQUEST, editProfileAction)
};