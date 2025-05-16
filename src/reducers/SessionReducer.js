import {
  CREATE_SESSION_REQUEST,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAILURE,
  CREATE_SESSION_REQUEST_LODING,
  ASYNC_STORAGE_CLEAR,
  CREATE_SESSION_STATUS_IDLE,
  CREATE_SESSION_LIST_SUCCESS,
  CREATE_SESSION_LIST_FAILURE,
  CREATE_SESSION_LIST_STATUS_IDLE,
  CREATE_SESSION_LIST_REQUEST,
  CREATE_SESSION_DETAIL_REQUEST,
  CREATE_SESSION_DETAIL_FAILURE,
  CREATE_SESSION_DETAIL_SUCCESS,
  CREATE_SESSION_DETAIL_STATUS_IDLE,
  START_SESSION_REQUEST,
  START_SESSION_FAILURE,
  START_SESSION_SUCCESS,
  START_SESSION_STATUS_IDLE,
  START_SESSION_JOINEE_REQUEST,
  START_SESSION_JOINEE_SUCCESS,
  START_SESSION_JOINEE_FAILURE,
  START_SESSION_JOINEE_STATUS_IDLE,
  START_SESSION_LEFT_FAILURE,
  START_SESSION_LEFT_STATUS_IDLE,
  START_SESSION_LEFT_SUCCESS,
  START_SESSION_LEFT_REQUEST,
  START_SESSION_JOINEE_STOP_HOST,
  My_SESSION_LIST_REQUEST,
  My_SESSION_LIST_SUCCESS,
  My_SESSION_LIST_FAILURE,
  My_SESSION_LIST_STATUS_IDLE,
  My_SESSION_DELETE_REQUEST,
  My_SESSION_DELETE_SUCCESS,
  My_SESSION_DELETE_FAILURE,
  My_SESSION_DELETE_STATUS_IDLE,
} from '../action/TypeConstants';

const initialState = {
  status: '',
  loading: false,
  startSessionLoading: false,
  isRequestLoader: false,
  error: {},
  sessionListData: {},
  sessionDetailData: {},
  currentSessionSong: {},
  CurrentSessionJoineeInfo: {},
  hasLeftSession: null,
  mySessionListData: {},
};

const SessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SESSION_REQUEST:
      return {
        ...state,
        status: action.type,
        loading: true,
      };

    case CREATE_SESSION_SUCCESS:
      return {
        ...state,
        status: action.type,
        loading: false,
        // deletePostResp: action.data,
      };

    case CREATE_SESSION_FAILURE:
      return {
        ...state,
        status: action.type,
        loading: false,
        error: action.error,
      };

    case CREATE_SESSION_STATUS_IDLE:
      return {
        ...state,
        status: action.status,
      };

    // SESSION LIST HANDLING
    case CREATE_SESSION_LIST_REQUEST:
      return {
        ...state,
        status: action.type,
        loading: true,
      };

    case CREATE_SESSION_LIST_SUCCESS:
      return {
        ...state,
        status: action.type,
        loading: false,
        sessionListData: action.data,
      };

    case CREATE_SESSION_LIST_FAILURE:
      return {
        ...state,
        status: action.type,
        loading: false,
        error: action.error,
      };

    case CREATE_SESSION_LIST_STATUS_IDLE:
      return {
        ...state,
        status: action.status,
      };

    // SESSION DETAIL HANDLING
    case CREATE_SESSION_DETAIL_REQUEST:
      return {
        ...state,
        status: action.type,
        loading: true,
      };

    case CREATE_SESSION_DETAIL_SUCCESS:
      return {
        ...state,
        status: action.type,
        loading: false,
        sessionDetailData: action.data,
      };

    case CREATE_SESSION_DETAIL_FAILURE:
      return {
        ...state,
        status: action.type,
        loading: false,
        error: action.error,
      };

    case CREATE_SESSION_DETAIL_STATUS_IDLE:
      return {
        ...state,
        status: action.status,
      };

    // START SESSION  HANDLING
    case START_SESSION_REQUEST:
      return {
        ...state,
        status: action.type,
        startSessionLoading: true,
      };

    case START_SESSION_SUCCESS:
      return {
        ...state,
        status: action.type,
        startSessionLoading: false,
        sessionDetailData: action.data,
        currentSessionSong: action.data,
      };

    case START_SESSION_FAILURE:
      return {
        ...state,
        status: action.type,
        startSessionLoading: false,
        error: action.error,
      };

    case START_SESSION_STATUS_IDLE:
      return {
        ...state,
        status: action.status,
      };

    // START SESSION JOINEE REQUEST  HANDLING
    case START_SESSION_JOINEE_REQUEST:
      return {
        ...state,
        status: action.type,
        isRequestLoader: true,
      };

    case START_SESSION_JOINEE_SUCCESS:
      return {
        ...state,
        status: action.type,
        isRequestLoader: false,
        sessionDetailData: action.data,
        CurrentSessionJoineeInfo: action.data,
      };

    case START_SESSION_JOINEE_FAILURE:
      return {
        ...state,
        status: action.type,
        isRequestLoader: false,
        error: action.error,
      };

    case START_SESSION_JOINEE_STATUS_IDLE:
      return {
        ...state,
        status: action.status,
        isRequestLoader: false,
      };

    // START SESSION LEFT REQUEST  HANDLING
    case START_SESSION_LEFT_REQUEST:
      return {
        ...state,
        status: action.type,
        isRequestLoader: true,
      };

    case START_SESSION_LEFT_SUCCESS:
      return {
        ...state,
        status: action.type,
        isRequestLoader: false,
        CurrentSessionJoineeInfo: action.data,
        hasLeftSession: true,
        sessionDetailData: action.data,
      };

    case START_SESSION_JOINEE_STOP_HOST:
      return {
        ...state,
        status: action.type,
        isRequestLoader: false,
        CurrentSessionJoineeInfo: action.data,
        hasLeftSession: true,
        sessionDetailData: action.data,
      };

    case START_SESSION_LEFT_FAILURE:
      return {
        ...state,
        status: action.type,
        isRequestLoader: false,
        error: action.error,
      };

    case START_SESSION_LEFT_STATUS_IDLE:
      return {
        ...state,
        status: action.status,
        hasLeftSession: null,
      };

    // MY SESSION LIST HANDLING
    case My_SESSION_LIST_REQUEST:
      return {
        ...state,
        status: action.type,
        isRequestLoader: true,
      };

    case My_SESSION_LIST_SUCCESS:
      return {
        ...state,
        status: action.type,
        isRequestLoader: false,
        mySessionListData: action.data,
      };

    case My_SESSION_LIST_FAILURE:
      return {
        ...state,
        status: action.type,
        isRequestLoader: false,
        error: action.error,
      };

    case My_SESSION_LIST_STATUS_IDLE:
      return {
        ...state,
        status: action.status,
        isRequestLoader: false,
      };

    // MY SESSION DELETE HANDLING
    case My_SESSION_DELETE_REQUEST:
      return {
        ...state,
        status: action.type,
        isRequestLoader: true,
      };

    case My_SESSION_DELETE_SUCCESS:
      return {
        ...state,
        status: action.type,
        isRequestLoader: false,
        // mySessionLisDELETEa: action.data,
      };

    case My_SESSION_DELETE_FAILURE:
      return {
        ...state,
        status: action.type,
        isRequestLoader: false,
        error: action.error,
      };

    case My_SESSION_DELETE_STATUS_IDLE:
      return {
        ...state,
        status: action.status,
        isRequestLoader: false,
      };
    case ASYNC_STORAGE_CLEAR:
      return initialState;
    default:
      return state;
  }
};

export default SessionReducer;
