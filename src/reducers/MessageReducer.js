import {

    CREATE_CHAT_TOKEN_REQUEST,
    CREATE_CHAT_TOKEN_SUCCESS,
    CREATE_CHAT_TOKEN_FAILURE,

    SEND_CHAT_MESSAGE_REQUEST,
    SEND_CHAT_MESSAGE_SUCCESS,
    SEND_CHAT_MESSAGE_FAILURE,

} from '../action/TypeConstants';

const initialState = {
    status: "",
    error: "",
    chatTokenList: [],
    sendChatResponse: {},
};

const MessageReducer = (state = initialState, action) => {
    switch (action.type) {

        case CREATE_CHAT_TOKEN_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case CREATE_CHAT_TOKEN_SUCCESS:
            return {
                ...state,
                status: action.type,
                chatTokenList: action.data
            };

        case CREATE_CHAT_TOKEN_FAILURE:
            return {
                ...state,
                status: action.type,
                chatTokenList: [],
                error: action.error
            };

        case SEND_CHAT_MESSAGE_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case SEND_CHAT_MESSAGE_SUCCESS:
            return {
                ...state,
                status: action.type,
                sendChatResponse: action.data
            };

        case SEND_CHAT_MESSAGE_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        default:
            return state;

    }
};

export default MessageReducer;