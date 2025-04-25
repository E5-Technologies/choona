import {action} from '../../node_modules/react-native-reanimated/lib/typescript/hook/index.d';
import {data} from '../../node_modules/tslib/modules/index.d';
import {error} from '../../node_modules/undici-types/index.d';
import {status} from '../../node_modules/@react-native-community/cli-server-api/build/index.d';
import {type} from '../../node_modules/@typescript-eslint/typescript-estree/dist/index.d';

import {
  CREATE_SESSION_REQUEST,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAILURE,
  CREATE_SESSION_REQUEST_LODING,
  ASYNC_STORAGE_CLEAR,
  CREATE_SESSION_STATUS_IDLE,
} from '../action/TypeConstants';

const initialState = {
  status: '',
  loading: false,
  error: {},
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
    case ASYNC_STORAGE_CLEAR:
      return initialState;

    default:
      return state;
  }
};

export default SessionReducer;
