import {
    ASYNC_STORAGE_REQUEST,
    ASYNC_STORAGE_SUCCESS,
    ASYNC_STORAGE_FAILURE,

    GET_TOKEN_REQUEST,
    GET_TOKEN_SUCCESS,
    GET_TOKEN_FAILURE
}
    from '../action/TypeConstants';

const initialState = {
    status: "",
    error: {},
    loading: true,
    token: "",
}

const TokenReducer = (state = initialState, action) => {
    switch (action.type) {

        case ASYNC_STORAGE_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case ASYNC_STORAGE_SUCCESS:
            return {
                ...state,
                status: action.type,
                loading: false,
                token: action.token,
            };

        case ASYNC_STORAGE_FAILURE:
            return {
                ...state,
                status: action.type
            };

        case GET_TOKEN_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case GET_TOKEN_SUCCESS:
            return {
                ...state,
                status: action.type,
                loading: false,
                token: action.token
            }

        case GET_TOKEN_FAILURE:
            return {
                ...state,
                status: action.type
            }

        default:
            return state;

    }
}

export default TokenReducer;