import { put, call, take, fork, takeLatest, select, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga'

import {

    CREATE_CHAT_TOKEN_REQUEST,
    CREATE_CHAT_TOKEN_SUCCESS,
    CREATE_CHAT_TOKEN_FAILURE,

    SEND_CHAT_MESSAGE_REQUEST,
    SEND_CHAT_MESSAGE_SUCCESS,
    SEND_CHAT_MESSAGE_FAILURE,

    GET_CHAT_LIST_REQUEST,
    GET_CHAT_LIST_SUCCESS,
    GET_CHAT_LIST_FAILURE


} from '../action/TypeConstants'
import { postApi, getApi } from '../utils/helpers/ApiRequest'

import database from '@react-native-firebase/database';

const FIREBASE_REF_MESSAGES = database().ref('chatMessages')

const getItems = state => state.TokenReducer;

/**
 * This function is used getting the chat token of the user.
 * @param {Object} action  provide payload for the chat token.
 */

export function* getChatTokenAction(action) {

    try {
        const items = yield select(getItems);

        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token,
        }
        let chatTokenResponse = yield call(postApi, 'chat/create', { "receiver_id": action.payload }, Header);

        if (chatTokenResponse.data.status === 200)
            yield put({ type: CREATE_CHAT_TOKEN_SUCCESS, data: chatTokenResponse.data.data });
        else
            yield put({ type: CREATE_CHAT_TOKEN_FAILURE, error: chatTokenResponse.data });

    } catch (error) {

        yield put({ type: CREATE_CHAT_TOKEN_FAILURE, error: error });


    }

}


/**
 * This function is used for sending chat message
 * @param {Object} action  provide payload for chat
 */
export function* sendChatMessageAction(action) {

    console.log("SEND_CHAT_REQ", action.payload);

    try {
        action.payload.chatTokens.map((chatToken, index) => {

            FIREBASE_REF_MESSAGES.child(chatToken._id).push(action.payload.chatBody[index])

        })

        yield put({ type: SEND_CHAT_MESSAGE_SUCCESS, data: 'Message sent successfully' })
    }
    catch (error) {

        yield put({ type: SEND_CHAT_MESSAGE_FAILURE, error: error })
    }
};


export function* getChatListAction(params) {
    try {
        const items = yield select(getItems);
        
        const Header = {
            Accept: 'application/json',
            contenttype: 'application/json',
            accesstoken: items.token
        };

        const response = yield call(getApi, 'chat/list', Header)
        yield put({ type: GET_CHAT_LIST_SUCCESS, data: response.data.data });

    } catch (error) {
        yield put({ type: GET_CHAT_LIST_FAILURE, error: error })
    }
};


export function* watchGetChatTokenRequest() {
    yield takeLatest(CREATE_CHAT_TOKEN_REQUEST, getChatTokenAction)
}

export function* watchSendChatMessageRequest() {
    yield takeLatest(SEND_CHAT_MESSAGE_REQUEST, sendChatMessageAction)
}

export function* watchgetChatListAction() {
    yield takeLatest (GET_CHAT_LIST_REQUEST, getChatListAction)
}


