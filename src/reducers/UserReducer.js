import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,

    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,
    USER_SIGNUP_FAILURE,

    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAILURE,

    EDIT_PROFILE_REQUEST,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAILURE
}
    from '../action/TypeConstants';

const initialState = {
    status: "",
    error: {},
    loginResponse: {},
    signupResponse: {},
    userProfileResp: {},
    editProfileResp: {}
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

        case USER_PROFILE_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case USER_PROFILE_SUCCESS:
            return {
                ...state,
                status: action.type,
                userProfileResp: action.data
            };

        case USER_PROFILE_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case EDIT_PROFILE_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case EDIT_PROFILE_SUCCESS:
            return {
                ...state,
                status: action.type,
                editProfileResp: action.data
            };

        case EDIT_PROFILE_FAILURE:
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