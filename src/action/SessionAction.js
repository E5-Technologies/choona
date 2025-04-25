import {
  CREATE_SESSION_REQUEST,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAILURE,
  CREATE_SESSION_REQUEST_LODING,
  CREATE_SESSION_STATUS_IDLE,
} from './TypeConstants';

export const createSessionRequest = payload => ({
  type: CREATE_SESSION_REQUEST,
  payload,
});

export const crateSessionRequestStatusIdle = payload => ({
  type: CREATE_SESSION_STATUS_IDLE,
  payload,
});
// export const deletePostReq = payload => ({
//   type: DELETE_POST_REQUEST,
//   payload,
// });

// export const searchPostReq = (text, flag) => ({
//   type: flag ? SEARCH_POST_REQUEST : GET_POST_FROM_TOP_50_REQUEST,
//   flag,
//   text,
// });
