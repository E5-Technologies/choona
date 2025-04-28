
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
} from '../action/TypeConstants';

const initialState = {
  status: '',
  loading: false,
  error: {},
  sessionListData: {},
  sessionDetailData:{},
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
    case ASYNC_STORAGE_CLEAR:
      return initialState;
    default:
      return state;
  }
};

export default SessionReducer;
