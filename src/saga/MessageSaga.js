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
    GET_CHAT_LIST_FAILURE,

    CHAT_LOAD_REQUEST,
    CHAT_LOAD_SUCCESS,
    CHAT_LOAD_FAILURE,


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


export function* getChatListAction(action) {
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


/**
 * This function is used for listening to any change in firebase realtime database, and 
 * read the chat message
 * @param {Object} action provide the chat token of a particular channel
 */
export function* getChatMessages(action) {

    // Creates an eventChannel and starts the listener;
    const channel = eventChannel(emiter => {
        const listener = FIREBASE_REF_MESSAGES.child(action.payload.chatToken).on(
            'value',
            dataSnapshot => {
                var items = []
                dataSnapshot.forEach(child => {
                    
                    items.push(child.val())

                    // if (action.payload.userId == child.val().receiver_id) {
                    //     child.child("read").ref.set(true)
                    // }

                })


                console.log("CHATS", items.reverse())

                var chatResponse = {
                    data: items.reverse(),
                }

                emiter(chatResponse || {})

                //emiter({ data: items.reverse() || {} })
            }
        )

        // Return the shutdown method;
        return () => {
            FIREBASE_REF_MESSAGES.child(action.payload.chatToken).off()
        }
    })

    if (action.payload.isMount) {
        while (true) {
            const chatResponse = yield take(channel)
            // Pause the task until the channel emits a signal and dispatch an action in the store;
            yield put({ type: CHAT_LOAD_SUCCESS, chatResponse })
        }
    } else {
        var chatResponse = {
            data: [],
        }
        yield put({ type: CHAT_LOAD_SUCCESS, chatResponse })
        channel.close()
    }

}


export function* watchGetChatTokenRequest() {
    yield takeLatest(CREATE_CHAT_TOKEN_REQUEST, getChatTokenAction)
}

export function* watchSendChatMessageRequest() {
    yield takeLatest(SEND_CHAT_MESSAGE_REQUEST, sendChatMessageAction)
}

export function* watchgetChatListAction() {
    yield takeLatest(GET_CHAT_LIST_REQUEST, getChatListAction)
}

export function* watchLoadMessages() {
    yield takeLatest(CHAT_LOAD_REQUEST, getChatMessages)
}


