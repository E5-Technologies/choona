import {
    CREATE_CHAT_TOKEN_REQUEST,
    SEND_CHAT_MESSAGE_REQUEST,

} from '../action/TypeConstants';


export const createChatTokenRequest = (payload) => ({
    type: CREATE_CHAT_TOKEN_REQUEST,
    payload
});

export const sendChatMessageRequest = (payload) => ({
    type: SEND_CHAT_MESSAGE_REQUEST,
    payload
});

