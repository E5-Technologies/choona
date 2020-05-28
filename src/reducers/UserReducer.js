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
    OTHERS_PROFILE_FAILURE,

    HOME_PAGE_REQUEST,
    HOME_PAGE_SUCCESS,
    HOME_PAGE_FAILURE,

    COMMENT_ON_POST_REQUEST,
    COMMENT_ON_POST_SUCCESS,
    COMMENT_ON_POST_FAILURE,

    FOLLOWER_LIST_REQUEST,
    FOLLOWER_LIST_SUCCESS,
    FOLLOWER_LIST_FAILURE,

    FOLLOWING_LIST_REQUEST,
    FOLLOWING_LIST_SUCCESS,
    FOLLOWING_LIST_FAILURE
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
    othersProfileresp: {},
    postData: [],
    commentResp: {},
    followerData: [],
    followingData: []
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

        case HOME_PAGE_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case HOME_PAGE_SUCCESS:
            return {
                ...state,
                status: action.type,
                postData: action.data
            };

        case HOME_PAGE_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case COMMENT_ON_POST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case COMMENT_ON_POST_SUCCESS:
            return {
                ...state,
                status: action.type,
                commentResp: action.data,
            };

        case COMMENT_ON_POST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case FOLLOWER_LIST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case FOLLOWER_LIST_SUCCESS:
            return {
                ...state,
                status: action.type,
                followerData: action.data,
            };

        case FOLLOWER_LIST_FAILURE:
            return {
                ...state,
                status: action.type,
                error: action.error
            };

        case FOLLOWING_LIST_REQUEST:
            return {
                ...state,
                status: action.type
            };

        case FOLLOWING_LIST_SUCCESS:
            return {
                ...state,
                status: action.type,
                followingData: action.data,
            };

        case FOLLOWING_LIST_FAILURE:
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