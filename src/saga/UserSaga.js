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
    EDIT_PROFILE_FAILURE,

    USER_SEARCH_REQUEST,
    USER_SEARCH_SUCCESS,
    USER_SEARCH_FAILURE,

    USER_FOLLOW_UNFOLLOW_REQUEST,
    USER_FOLLOW_UNFOLLOW_SUCCESS,
    USER_FOLLOW_UNFOLLOW_FAILURE,

    OTHERS_PROFILE_REQUEST,
    OTHERS_PROFILE_SUCCESS,
    OTHERS_PROFILE_FAILURE,

    HOME_PAGE_REQUEST,
    HOME_PAGE_SUCCESS,
    HOME_PAGE_FAILURE

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

            yield call(AsyncStorage.setItem, constants.CHOONACREDS, JSON.stringify({
                "token": response.data.token,
                "registerType": response.data.data.register_type
            }))

            yield put({ type: USER_LOGIN_SUCCESS, data: response.data.data });
            yield put({ type: ASYNC_STORAGE_SUCCESS, token: response.data.token, registerType: response.data.data.register_type })


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

        yield call(AsyncStorage.setItem, constants.CHOONACREDS, JSON.stringify({
            "token": response.data.token,
            "registerType": response.data.data.register_type
        }))

        yield put({ type: USER_SIGNUP_SUCCESS, data: response.data.data });
        yield put({ type: ASYNC_STORAGE_SUCCESS, token: response.data.token, registerType: response.data.data.register_type })

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

        const response = yield call(getApi, 'user/profile', Header);
        yield put({ type: USER_PROFILE_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: USER_PROFILE_FAILURE, error: error })
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

        const response = yield call(postApi, 'user/profile/update', action.payload, Header);
        yield put({ type: EDIT_PROFILE_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: EDIT_PROFILE_FAILURE, error: error })
    }
};


export function* userSearchAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call(postApi, 'user/search', action.payload, Header)
        yield put({ type: USER_SEARCH_SUCCESS, data: response.data.data })

    } catch (error) {
        yield put({ type: USER_SEARCH_FAILURE, error: error })
    }
};


export function* userFollowOrUnfollowAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call(postApi, 'follower/user/store', action.payload, Header);
        yield put({ type: USER_FOLLOW_UNFOLLOW_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: USER_FOLLOW_UNFOLLOW_FAILURE, error: error })
    }
};


export function* othersProfileAction(action) {
    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call(getApi, `user/profile/${action.id}`, Header);
        yield put({ type: OTHERS_PROFILE_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: OTHERS_PROFILE_FAILURE, error: error })
    }
};


export function* homePageAction(action) {
    try {
        const items = yield select(getItems);
        
        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call (getApi, 'post/list', Header);
        yield put ({type: HOME_PAGE_SUCCESS, data: response.data.data})

    } catch (error) {
        yield put({ type: HOME_PAGE_FAILURE, error: error })
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

export function* watchuserSearchAction() {
    yield takeLatest(USER_SEARCH_REQUEST, userSearchAction)
};

export function* watchuserFollowOrUnfollowAction() {
    yield takeLatest(USER_FOLLOW_UNFOLLOW_REQUEST, userFollowOrUnfollowAction)
};

export function* watchothersProfileAction() {
    yield takeLatest(OTHERS_PROFILE_REQUEST, othersProfileAction)
};

export function* watchhomePageAction() {
    yield takeLatest(HOME_PAGE_REQUEST, homePageAction)
};