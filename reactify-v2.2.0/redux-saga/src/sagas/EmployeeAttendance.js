import { all, call, fork, put, takeEvery ,select} from 'redux-saga/effects';

import api from 'Api';
import {employeeattendanceReducer,settings} from './states';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
  SAVE_EMPLOYEEATTENDANCE,
  GET_EMPLOYEEATTENDANCE_LIST,
  DELETE_EMPLOYEE_ATTENDANCE,
} from 'Actions/types';

import {
saveEmployeeattendanceSuccess,
getEmployeeAttendanceListSuccess,
requestSuccess,
requestFailure,
showLoader,
hideLoader
} from 'Actions';


/**
 * Send user attendance Save Request To Server
 */
const saveEmployeeAttendanceRequest = function* (data)
{
    data = cloneDeep(data);
    data.intime = setDateTime(data.intime);
    data.attendenceDate = setDateTime(data.attendenceDate);
    data.outtime = setDateTime(data.outtime);
    let response = yield api.post('save-employeeattendance', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save user attendance From Server
 */
function* saveEmployeeAttendanceFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveEmployeeAttendanceRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          if(action.payload.id)
          {
            yield put(requestSuccess("Data updated successfully."));
          }
          else {
            yield put(requestSuccess("Attendance saved successfully."));
          }
          yield  put(saveEmployeeattendanceSuccess({data : response[0]}));
          yield call(getEmployeeAttendenceListFromServer);
       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

/**
 * Get member attendance
 */
export function* saveEmployeeattendance() {
    yield takeEvery(SAVE_EMPLOYEEATTENDANCE, saveEmployeeAttendanceFromServer);
}

const getEmployeeAttendenceRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
  data.startDate = setLocalDate(data.startDate);
  data.endDate = setLocalDate(data.endDate);
  data.filtered.map(x => {
    if(x.id == "createdbydate" || x.id == "intime" || x.id == "outtime" || x.id == "modifiedbydate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-employeeattendance', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getEmployeeAttendenceListFromServer(action ,data) {
    try {
        const state = yield select(employeeattendanceReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;

        const response = yield call(getEmployeeAttendenceRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getEmployeeAttendanceListSuccess({data : response[0] , pages : response[1]}));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* getEmployeeAttendanceList() {
    yield takeEvery(GET_EMPLOYEEATTENDANCE_LIST, getEmployeeAttendenceListFromServer);
}

const deleteAttendanceRequest = function* (data)
{  let response = yield api.post('delete-employeeattendance', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete class From Server
 */
function* deleteAttendenceFromServer(action) {
    try {
        const response = yield call(deleteAttendanceRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Attendence deleted successfully."));
           yield call(getEmployeeAttendenceListFromServer);
    } else {
       yield put(requestFailure(response.errorMessage));
    }
  } catch (error) {
      console.log(error);
  }
}

/**
 * Get Employees
 */
export function* deleteEmployeeAttendance() {
    yield takeEvery(DELETE_EMPLOYEE_ATTENDANCE, deleteAttendenceFromServer);

}


/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(saveEmployeeattendance),
      fork(getEmployeeAttendanceList),
      fork(deleteEmployeeAttendance),

        ]);
}
