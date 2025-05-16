import {
  CREATE_SESSION_REQUEST,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAILURE,
  CREATE_SESSION_REQUEST_LODING,
  CREATE_SESSION_STATUS_IDLE,
  CREATE_SESSION_LIST_REQUEST,
  CREATE_SESSION_LIST_SUCCESS,
  CREATE_SESSION_LIST_FAILURE,
  CREATE_SESSION_LIST_STATUS_IDLE,
  CREATE_SESSION_DETAIL_REQUEST,
  CREATE_SESSION_DETAIL_STATUS_IDLE,
  START_SESSION_JOINEE_REQUEST,
  START_SESSION_JOINEE_STATUS_IDLE,
  START_SESSION_LEFT_REQUEST,
  START_SESSION_LEFT_STATUS_IDLE,
  START_SESSION_REQUEST,
  START_SESSION_STATUS_IDLE,
  START_SESSION_LEFT_SUCCESS,
  My_SESSION_LIST_REQUEST,
} from './TypeConstants';

export const createSessionRequest = payload => ({
  type: CREATE_SESSION_REQUEST,
  payload,
});

export const crateSessionRequestStatusIdle = payload => ({
  type: CREATE_SESSION_STATUS_IDLE,
  payload,
});

export const createSessionListRequest = () => ({
  type: CREATE_SESSION_LIST_REQUEST,
});

export const fetchSessionListRequestStatusIdle = payload => ({
  type: CREATE_SESSION_LIST_STATUS_IDLE,
  payload,
});

export const getSessionDetailRequest = payload => ({
  type: CREATE_SESSION_DETAIL_REQUEST,
  payload,
});

export const getSessionDetailRequestStatusIdle = payload => ({
  type: CREATE_SESSION_DETAIL_STATUS_IDLE,
  payload,
});

export const startSessionRequest = payload => ({
  type: START_SESSION_REQUEST,
  payload,
});

export const startSessionRequestStatusIdle = payload => ({
  type: START_SESSION_STATUS_IDLE,
  payload,
});

export const startSessionJoinRequest = payload => ({
  type: START_SESSION_JOINEE_REQUEST,
  payload,
});

export const startSessionJoinRequestStatusIdle = payload => ({
  type: START_SESSION_JOINEE_STATUS_IDLE,
  payload,
});

export const startSessionLeftRequest = payload => ({
  type: START_SESSION_LEFT_REQUEST,
  payload,
});

// export const startSessionLeftSuccess = payload => ({
//   type: START_SESSION_LEFT_SUCCESS,
//   payload,
// });

export const startSessionLeftRequestStatusIdle = payload => ({
  type: START_SESSION_LEFT_STATUS_IDLE,
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

export const mySessionListRequest = (payload = null) => ({
  type: My_SESSION_LIST_REQUEST,
  payload,
});
