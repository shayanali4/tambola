import { all, call, fork, put, takeEvery ,select} from 'redux-saga/effects';

import api from 'Api';
import {classattendanceReducer,settings} from './states';
import {cloneDeep} from 'Helpers/helpers';

import {
  SAVE_CLASSATTENDANCE,
  GET_CLASSATTENDANCE_LIST,
  DELETE_CLASS_ATTENDANCE,
  SAVE_SESSIONWEIGHT
} from 'Actions/types';

import {
saveClassattendanceSuccess,
getClassAttendanceListSuccess,
saveSessionWeightSuccess,
requestSuccess,
requestFailure,
showLoader,
hideLoader
} from 'Actions';


/**
 * Send class attendance Save Request To Server
 */
const saveClassAttendanceRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

    let response = yield api.post('class-attendance', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save class attendance From Server
 */
function* saveClassAttendanceFromServer(action) {
    try {
        const state = yield select(settings);
        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveClassAttendanceRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield  put(saveClassattendanceSuccess({data : response[0]}));
           yield call(getClassAttendenceListFromServer);
           yield put(requestSuccess("Attendance saved successfully."));
       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

/**
 * Get class attendance
 */
export function* saveClassattendance() {
    yield takeEvery(SAVE_CLASSATTENDANCE, saveClassAttendanceFromServer);
}

const getClassAttendenceRequest = function* (data)
{
  let response = yield  api.post('class-attendancelist', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getClassAttendenceListFromServer(action ,data) {
    try {
        const state = yield select(classattendanceReducer);
        const state1 = yield select(settings);
        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getClassAttendenceRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getClassAttendanceListSuccess({data : response[0] , pages : response[1]}));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* getClassAttendanceList() {
    yield takeEvery(GET_CLASSATTENDANCE_LIST, getClassAttendenceListFromServer);
}

const deleteClassAttendanceRequest = function* (data)
{  let response = yield api.post('delete-class-attendancelist', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete class From Server
 */
function* deleteClassAttendenceFromServer(action) {
    try {
        const response = yield call(deleteClassAttendanceRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Attendence deleted successfully."));
           yield call(getClassAttendenceListFromServer);
    } else {
       yield put(requestFailure(response.errorMessage));
    }
  } catch (error) {
      console.log(error);
  }
}

/**
 * delete class attendance
 */
export function* deleteClassAttendance() {
    yield takeEvery(DELETE_CLASS_ATTENDANCE, deleteClassAttendenceFromServer);

}

/**
 * Send class attendance Save Request To Server
 */
const saveSessionWeightRequest = function* (data)
{
    let response = yield api.post('session-weight', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save class attendance From Server
 */
function* saveSessionWeightFromServer(action) {
    try {
        const response = yield call(saveSessionWeightRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
         yield  put(saveSessionWeightSuccess({data : response[0]}));
         yield call(getClassAttendenceListFromServer);
         yield put(requestSuccess("Data updated successfully."));
       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

/**
 * Get class attendance
 */
export function* saveSessionWeight() {
    yield takeEvery(SAVE_SESSIONWEIGHT, saveSessionWeightFromServer);
}
/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(saveClassattendance),
      fork(getClassAttendanceList),
      fork(deleteClassAttendance),
      fork(saveSessionWeight)
        ]);
}
