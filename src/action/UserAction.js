import {
    USER_LOGIN_REQUEST
}
    from './TypeConstants';

export const loginRequest = (payload) => ({
    type: USER_LOGIN_REQUEST,
    payload
});
