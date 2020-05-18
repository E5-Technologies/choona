import {
    USER_LOGIN_REQUEST,
    USER_SIGNUP_REQUEST,
    USER_PROFILE_REQUEST,
    EDIT_PROFILE_REQUEST
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


