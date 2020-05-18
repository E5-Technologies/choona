import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,

    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,
    USER_SIGNUP_FAILURE
}
    from '../action/TypeConstants';

const initialState = {
    status: "",
    error: {},
    loginResponse: {},
    signupResponse: {}
}

const UserReducer = (state = initialState, action) => {
    switch (action.type) {

        case USER_LOGIN_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                status: action.type,
                loginResponse: action.data,
            };

        case USER_LOGIN_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case USER_SIGNUP_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case USER_SIGNUP_SUCCESS:
            return {
                ...state,
                status: action.type,
                signupResponse: action.data
            };

        case USER_SIGNUP_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        default:
            return state;

    }
}

export default UserReducer;