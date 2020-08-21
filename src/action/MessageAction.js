import {
    CREATE_CHAT_TOKEN_REQUEST,
    SEND_CHAT_MESSAGE_REQUEST,
    GET_CHAT_LIST_REQUEST,
    CHAT_LOAD_REQUEST,
    SEARCH_MESSAGE_REQUEST,
    UPDATE_MESSEAGE_COMMENTS_REQUEST

} from '../action/TypeConstants';


export const createChatTokenRequest = (payload) => ({
    type: CREATE_CHAT_TOKEN_REQUEST,
    payload
});

export const sendChatMessageRequest = (payload) => ({
    type: SEND_CHAT_MESSAGE_REQUEST,
    payload
});

export const getChatListRequest = () => ({
    type: GET_CHAT_LIST_REQUEST
});

export const loadChatMessageRequest = payload => ({
    type: CHAT_LOAD_REQUEST,
    payload: payload
});

export const searchMessageRequest = payload => ({
    type: SEARCH_MESSAGE_REQUEST,
    payload: payload
});

export const updateMessageCommentRequest = payload => ({
    type: UPDATE_MESSEAGE_COMMENTS_REQUEST,
    payload: payload
});
