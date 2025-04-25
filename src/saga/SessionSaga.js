import {put, call, takeLatest, select} from 'redux-saga/effects';
import {
  CREATE_SESSION_REQUEST,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAILURE,
  CREATE_SESSION_REQUEST_LODING,
} from '../action/TypeConstants';
import {postApi, getApi} from '../utils/helpers/ApiRequest';
import {getSpotifyToken} from '../utils/helpers/SpotifyLogin';
import {getAppleDevToken} from '../utils/helpers/AppleDevToken';

const getItems = state => state.TokenReducer;

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

    yield put({type: CREATE_SESSION_SUCCESS, data: response.data});
  } catch (error) {
    console.log(error, 'simple error');
    console.log(JSON.stringify(error), 'simple error1');
    yield put({type: CREATE_SESSION_FAILURE, data: error});
  }
}

//WATCH FUNCTIONS

export function* watchCreateSessionRequest() {
  yield takeLatest(CREATE_SESSION_REQUEST, createSessionAction);
}
