import {
    USER_LOGIN_REQUEST,
    USER_SIGNUP_REQUEST,
    USER_PROFILE_REQUEST,
    EDIT_PROFILE_REQUEST,
    USER_SEARCH_REQUEST,
    USER_FOLLOW_UNFOLLOW_REQUEST,
    OTHERS_PROFILE_REQUEST,
    HOME_PAGE_REQUEST,
    COMMENT_ON_POST_REQUEST
}
    from './TypeConstants';

export const loginRequest = (payload) => ({
    type: USER_LOGIN_REQUEST,
    payload
});

export const signupRequest = (payload) => ({
    type: USER_SIGNUP_REQUEST,
    payload
});

export const getProfileRequest = () => ({
    type: USER_PROFILE_REQUEST,
});

export const editProfileRequest = (payload) => ({
    type: EDIT_PROFILE_REQUEST,
    payload
});

export const userSearchRequest = (payload) => ({
    type: USER_SEARCH_REQUEST,
    payload
});

export const userFollowUnfollowRequest = (payload) => ({
    type: USER_FOLLOW_UNFOLLOW_REQUEST,
    payload
});

export const othersProfileRequest = (id) => ({
    type: OTHERS_PROFILE_REQUEST,
    id
});

export const homePageReq = () => ({
    type: HOME_PAGE_REQUEST
});

export const commentOnPostReq = (payload) => ({
    type: COMMENT_ON_POST_REQUEST,
    payload
});




