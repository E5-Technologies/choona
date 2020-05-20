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
    EDIT_PROFILE_FAILURE,

    USER_SEARCH_REQUEST,
    USER_SEARCH_SUCCESS,
    USER_SEARCH_FAILURE,

    USER_FOLLOW_UNFOLLOW_REQUEST,
    USER_FOLLOW_UNFOLLOW_SUCCESS,
    USER_FOLLOW_UNFOLLOW_FAILURE,

    OTHERS_PROFILE_REQUEST,
    OTHERS_PROFILE_SUCCESS,
    OTHERS_PROFILE_FAILURE
}
    from '../action/TypeConstants';

const initialState = {
    status: "",
    error: {},
    loginResponse: {},
    signupResponse: {},
    userProfileResp: {},
    editProfileResp: {},
    userSearch: [],
    followUnfollowResp: {},
    othersProfileresp: {}
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

        case USER_SEARCH_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case USER_SEARCH_SUCCESS:
            return {
                ...state,
                status: action.type,
                userSearch: action.data
            };

        case USER_SIGNUP_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case USER_FOLLOW_UNFOLLOW_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case USER_FOLLOW_UNFOLLOW_SUCCESS:
            return {
                ...state,
                status: action.type,
                followUnfollowResp: action.data
            };

        case USER_FOLLOW_UNFOLLOW_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case OTHERS_PROFILE_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case OTHERS_PROFILE_SUCCESS:
            return {
                ...state,
                status: action.type,
                othersProfileresp: action.data
            };

        case OTHERS_PROFILE_FAILURE:
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