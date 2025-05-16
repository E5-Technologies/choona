import {put, call, takeLatest, select} from 'redux-saga/effects';
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
  START_SESSION_REQUEST,
  START_SESSION_SUCCESS,
  START_SESSION_FAILURE,
  START_SESSION_JOINEE_REQUEST,
  START_SESSION_JOINEE_SUCCESS,
  START_SESSION_JOINEE_FAILURE,
  START_SESSION_LEFT_REQUEST,
  START_SESSION_LEFT_SUCCESS,
  START_SESSION_LEFT_FAILURE,
  START_SESSION_JOINEE_STATUS_IDLE,
  My_SESSION_LIST_REQUEST,
  My_SESSION_LIST_SUCCESS,
  My_SESSION_LIST_FAILURE,
  My_SESSION_DELETE_REQUEST,
  My_SESSION_DELETE_FAILURE,
  My_SESSION_DELETE_SUCCESS,
} from '../action/TypeConstants';
import {postApi, getApi, putApi} from '../utils/helpers/ApiRequest';
import {getSpotifyToken} from '../utils/helpers/SpotifyLogin';
import {getAppleDevToken} from '../utils/helpers/AppleDevToken';
import {Alert} from 'react-native';
import toast from '../utils/helpers/ShowErrorAlert';
import {act} from 'react';
import {mySessionListRequest} from '../action/SessionAction';

const getItems = state => state.TokenReducer;
const getMySesssinoInfo = state => state.SessionReducer.mySessionListData;

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

    yield put({type: CREATE_SESSION_SUCCESS, data: response.data});
  } catch (error) {
    console.log(error, 'simple error');
    console.log(JSON.stringify(error?.message, error?.status), 'simple error1');
    yield put({type: CREATE_SESSION_FAILURE, data: error});
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
    const response = yield call(getApi, 'session/list', header);
    // console.log(response?.data, 'its response after api hit session LIST');
    yield put({type: CREATE_SESSION_LIST_SUCCESS, data: response.data});
  } catch (error) {
    console.log(JSON.stringify(error?.message), 'simple error1 in list get');
    yield put({type: CREATE_SESSION_LIST_FAILURE, data: error});
  }
}

//FUNCTION TO DETAIL OF A SESSIONS
export function* getSessionDetail(action) {
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
    // console.log(response?.data, 'its response after api hit session LIST');
    yield put({type: CREATE_SESSION_DETAIL_SUCCESS, data: response.data});
  } catch (error) {
    console.log(JSON.stringify(error?.message), 'simple error1 in list get');
    yield put({type: CREATE_SESSION_DETAIL_FAILURE, data: error});
  }
}

//FUNCTION TO START SESSIONS ONCE
export function* startSessionOnce(action) {
  console.log(action.payload, 'action huuuu');
  const items = yield select(getItems);
  const header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.token,
  };

  console.log(header, 'its header hh');
  const objectData = {};
  if (action.payload.isLive != null) {
    {
      objectData['isLive'] = action.payload.isLive;
    }
  }
  if (action.payload.isPrivate != null) {
    objectData['isPrivate'] = action.payload.isPrivate;
  }
  console.log(objectData, 'its object data');

  try {
    const response = yield call(
      putApi,
      `session/update/${action.payload.sessionId}`,
      // { isLive: action.payload.isLive },
      // JSON.stringify(objectData),
      objectData,
      header,
    );
    console.log(response?.data, 'its response start session');
    yield put({type: START_SESSION_SUCCESS, data: response?.data});
  } catch (error) {
    console.log(JSON.stringify(error), 'simple error1 in list get');
    toast('Error', 'Please Connect To Internet');
    yield put({type: START_SESSION_FAILURE, data: error});
  }
}

//FUNCTION TO  JOIN  SESSION ONCE
export function* joinSessionRequest(action) {
  const items = yield select(getItems);
  // console.log(action.payload,'its pauload data')
  const header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.token,
  };

  try {
    const response = yield call(
      postApi,
      'session/join',
      action.payload,
      header,
    );
    // console.log(JSON.stringify(response?.data), 'its response joinee Joined');
    if (response?.data?.status == 200) {
      yield put({type: START_SESSION_JOINEE_SUCCESS, data: response?.data});
    } else {
      // toast(response?.data?.message);
      // yield put({type: START_SESSION_JOINEE_STATUS_IDLE});
      yield put({
        type: START_SESSION_JOINEE_FAILURE,
        error: response?.data,
      });
    }
  } catch (error) {
    console.log(JSON.stringify(error?.message), 'simple error1 in list get');
    yield put({type: START_SESSION_JOINEE_FAILURE, error: error?.message});
  }
}

//FUNCTION TO  JOIN  SESSION ONCE
export function* leftSessionRequest(action) {
  const items = yield select(getItems);
  const header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.token,
  };

  try {
    const response = yield call(
      postApi,
      `session/removeuser`,
      action.payload,
      header,
    );
    console.log(response?.data, 'response when user Left the session');
    yield put({type: START_SESSION_LEFT_SUCCESS, data: response.data});
  } catch (error) {
    console.log(JSON.stringify(error?.message), 'when user left error');
    yield put({type: START_SESSION_LEFT_FAILURE, data: error});
  }
}

//FUNCTION TO GET LIST OF MY SESSION
export function* fetchMySessionListRequest(action) {
  // console.log(action, 'this isaction');
  let currentPage = action?.payload?.page ?? 1;
  // console.log(currentPage, 'this is current page');
  const items = yield select(getItems);
  const getMySesssinoInfoData = yield select(getMySesssinoInfo);
  // console.log(getMySesssinoInfoData, 'this imy info from redux');
  const header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.token,
  };
  try {
    const response = yield call(
      getApi,
      `session/me?page=${currentPage}&limit=20`,
      header,
    );
    // console.log(response?.data, 'My sessin list api response');
    if (response?.data?.status == 200) {
      const newData = response?.data?.data ?? [];
      const totalPages = response?.data?.totalPages ?? 1;
      const currentPageNo = response?.data?.page;
      if (currentPage == 1) {
        yield put({type: My_SESSION_LIST_SUCCESS, data: response.data});
      } else {
        const modifiedData = {
          ...getMySesssinoInfoData,
          data: [...getMySesssinoInfoData?.data, ...newData],
          totalPages: totalPages,
          page: currentPageNo,
          status: response?.data?.status,
        };
        // console.log(modifiedData, 'its modfies data');
        yield put({type: My_SESSION_LIST_SUCCESS, data: modifiedData});
      }
    } else {
      yield put({type: My_SESSION_LIST_FAILURE, error: response.data});
    }
  } catch (error) {
    // console.log(JSON.stringify(error?.message), 'simple error1 in list get');
    yield put({type: My_SESSION_LIST_FAILURE, error: error});
  }
}

//FUNCTION TO DELETE MY SESSION
export function* mySessionDeleteRequestRequest(action) {
  const items = yield select(getItems);
  const header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items.token,
  };
  try {
    const response = yield call(
      getApi,
      `session/remove/${action.payload.sessionId}`,
      header,
    );
    console.log(response?.data, 'its response delete my session');
    yield put({
      type: My_SESSION_DELETE_SUCCESS,
      // data: response.data
    });
    yield put({
      type: My_SESSION_LIST_REQUEST,
    });
  } catch (error) {
    console.log(JSON.stringify(error?.message), 'simple error1 in list get');
    yield put({type: My_SESSION_DELETE_FAILURE, error: error});
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

//TO WATCH THE START SESSION FUNCTION
export function* watchSessionStartRequest() {
  yield takeLatest(START_SESSION_REQUEST, startSessionOnce);
}

//TO WATCH THE START JOIN REQUEST
export function* watchSessionJoinRequest() {
  yield takeLatest(START_SESSION_JOINEE_REQUEST, joinSessionRequest);
}

//TO WATCH THE LEFT SESSION REQUEST
export function* watchSessionLeftRequest() {
  yield takeLatest(START_SESSION_LEFT_REQUEST, leftSessionRequest);
}

//TO WATCH TO MY SESSION LIST REQUEST
export function* watchMySessionListRequest() {
  yield takeLatest(My_SESSION_LIST_REQUEST, fetchMySessionListRequest);
}
//TO WATCH TO MY SESSION DELETE REQUEST
export function* watchMySessionDeleteRequest() {
  yield takeLatest(My_SESSION_DELETE_REQUEST, mySessionDeleteRequestRequest);
}
