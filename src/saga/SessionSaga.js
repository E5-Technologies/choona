import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
  CREATE_SESSION_REQUEST,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAILURE,
  CREATE_SESSION_REQUEST_LODING,
  CREATE_SESSION_LIST_REQUEST,
  CREATE_SESSION_LIST_SUCCESS,
  CREATE_SESSION_LIST_FAILURE,
  CREATE_SESSION_DETAIL_FAILURE,
  CREATE_SESSION_DETAIL_SUCCESS,
  CREATE_SESSION_DETAIL_REQUEST,
} from '../action/TypeConstants';
import { postApi, getApi } from '../utils/helpers/ApiRequest';
import { getSpotifyToken } from '../utils/helpers/SpotifyLogin';
import { getAppleDevToken } from '../utils/helpers/AppleDevToken';
import { Alert } from 'react-native';

const getItems = state => state.TokenReducer;

//FUNCTION TO  CREATE FRESH NEW SESSION
export function* createSessionAction(action) {
  const items = yield select(getItems);

  const header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.token,
  };
  console.log(header, 'this is header');
  try {
    const response = yield call(
      postApi,
      'session/store',
      action.payload,
      header,
    );
    console.log(response?.data, 'its response after api hit session post');

    yield put({ type: CREATE_SESSION_SUCCESS, data: response.data });
  } catch (error) {
    console.log(error, 'simple error');
    console.log(JSON.stringify(error?.message, error?.status), 'simple error1');
    yield put({ type: CREATE_SESSION_FAILURE, data: error });
  }
}

//FUNCTION TO GET LIST OF SESSIONS
export function* getSessionList(action) {
  const items = yield select(getItems);
  const header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.token,
  };
  try {
    const response = yield call(
      getApi,
      'session/list',
      header,
    );
    console.log(response?.data, 'its response after api hit session LIST');
    yield put({ type: CREATE_SESSION_LIST_SUCCESS, data: response.data });
  } catch (error) {
    console.log(JSON.stringify(error?.message), 'simple error1 in list get');
    yield put({ type: CREATE_SESSION_LIST_FAILURE, data: error });
  }
}

//FUNCTION TO DETAIL OF A SESSIONS
export function* getSessionDetail(action) {
  console.log(action, 'action h')
  const items = yield select(getItems);
  const header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.token,
  };
  try {
    const response = yield call(
      getApi,
      `session/get?id=${action.payload.sessionId}`,
      header,
    );
    console.log(response?.data, 'its response after api hit session LIST');
    yield put({ type: CREATE_SESSION_DETAIL_SUCCESS, data: response.data });
  } catch (error) {
    console.log(JSON.stringify(error?.message), 'simple error1 in list get');
    yield put({ type: CREATE_SESSION_DETAIL_FAILURE, data: error });
  }
}
//WATCH FUNCTIONS

export function* watchCreateSessionRequest() {
  yield takeLatest(CREATE_SESSION_REQUEST, createSessionAction);
}

export function* watchCreateSessionListRequest() {
  yield takeLatest(CREATE_SESSION_LIST_REQUEST, getSessionList);
}

export function* watchSessionDetailRequest() {
  yield takeLatest(CREATE_SESSION_DETAIL_REQUEST, getSessionDetail);
}

