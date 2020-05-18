import {
    USER_LOGIN_REQUEST,
    USER_SIGNUP_REQUEST
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
