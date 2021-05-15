import { all, call, fork, put, takeEvery ,select} from 'redux-saga/effects';

import api from 'Api';
import {memberattendanceReducer,settings} from './states';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
  SAVE_MEMBERATTENDANCE,
  GET_MEMBERATTENDANCE_LIST,
  DELETE_ATTENDANCE,
  SAVE_MEMBER_PT_ATTENDANCE,
  GET_MEMBER_PT_ATTENDANCE_LIST,
  SAVE_PT_SESSIONTIMEWEIGHT,
  DELETE_PT_ATTENDANCE,
} from 'Actions/types';

import {
savememberattendanceSuccess,
getMemberAttendanceListSuccess,
saveMemberPtAttendanceSuccess,
getMemberPtAttendanceListSuccess,
savePtSessionTimeWeightSuccess,
requestSuccess,
requestFailure,
showLoader,
hideLoader
} from 'Actions';


/**
 * Send member attendance Save Request To Server
 */
const saveMemberAttendanceRequest = function* (data)
{
    data = cloneDeep(data);
    data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
    data.intime = setDateTime(data.intime);
    data.outtime  = setDateTime(data.outtime );

    let response = yield api.post('member-attendance', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save member attendance From Server
 */
function* saveMemberAttendanceFromServer(action) {
    try {
      const state = yield select(settings);

       action.payload.branchid = state.userProfileDetail.defaultbranchid;


        const response = yield call(saveMemberAttendanceRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          if(action.payload.id)
          {
            yield put(requestSuccess("Data updated successfully."));
          }
          else {
            yield put(requestSuccess("Attendance saved successfully."));
          }
         yield  put(savememberattendanceSuccess({data : response[0]}));

         yield call(getMemberAttendenceListFromServer);

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
export function* savememberattendance() {
    yield takeEvery(SAVE_MEMBERATTENDANCE, saveMemberAttendanceFromServer);
}

const getMemberAttendenceRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.startDate = setLocalDate(data.startDate);
  data.endDate = setLocalDate(data.endDate);
  if(data.filtered && data.filtered.length > 0)
   {
     data.filtered.map(x => {
      if(x.id == "createdbydate" || x.id == "modifiedbydate" || x.id == "intime" || x.id == "outtime")
      {
        x.value = setLocalDate(x.value);
      }
     });
   }
  let response = yield  api.post('member-attendancelist', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getMemberAttendenceListFromServer(action ,data) {
    try {
        const state = yield select(memberattendanceReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getMemberAttendenceRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getMemberAttendanceListSuccess({data : response[0] , pages : response[1]}));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* getMemberAttendanceList() {
    yield takeEvery(GET_MEMBERATTENDANCE_LIST, getMemberAttendenceListFromServer);
}

const deleteAttendanceRequest = function* (data)
{  let response = yield api.post('delete-member-attendancelist', data)
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
          yield put(requestSuccess("Attendance deleted successfully."));
           yield call(getMemberAttendenceListFromServer);
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
export function* deleteAttendance() {
    yield takeEvery(DELETE_ATTENDANCE, deleteAttendenceFromServer);

}

const saveMemberPtAttendanceRequest = function* (data)
{
    data = cloneDeep(data);
    data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
    data.attendencedate = setDateTime(data.attendencedate);
    let response = yield api.post('member-pt-attendance', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save member attendance From Server
 */
function* saveMemberPtAttendanceFromServer(action) {
    try {
      const state1 = yield select(settings);

      action.payload.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(saveMemberPtAttendanceRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          let attendance = response[0];
          if(attendance[0].IsClassActive > 0)
          {
            yield put(requestSuccess("Attendance saved successfully."));
          }
          yield  put(saveMemberPtAttendanceSuccess({data : attendance}));
          yield call(getMemberPtAttendenceListFromServer);
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
export function* saveMemberPtAttendance() {
    yield takeEvery(SAVE_MEMBER_PT_ATTENDANCE, saveMemberPtAttendanceFromServer);
}

const getMemberPtAttendenceRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.startDate = setLocalDate(data.startDate);
  data.endDate = setLocalDate(data.endDate);
  data.filtered.map(x => {
    if(x.id == "attendancedate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('member-pt-attendancelist', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getMemberPtAttendenceListFromServer(action ,data) {
    try {
        const state = yield select(memberattendanceReducer);
        const state1 = yield select(settings);

        state.tableInfoPT.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getMemberPtAttendenceRequest, state.tableInfoPT);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getMemberPtAttendanceListSuccess({data : response[0] , pages : response[1]}));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* getMemberPtAttendanceList() {
    yield takeEvery(GET_MEMBER_PT_ATTENDANCE_LIST, getMemberPtAttendenceListFromServer);
}

const savePtSessionTimeWeightRequest = function* (data)
{
    data = cloneDeep(data);
    data.starttime = setDateTime(data.starttime);
    data.endtime = setDateTime(data.endtime);
    let response = yield api.post('member-pt-session-timeweight', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save class attendance From Server
 */
function* savePtSessionTimeWeightFromServer(action) {
    try {
        const response = yield call(savePtSessionTimeWeightRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
         yield  put(savePtSessionTimeWeightSuccess({data : response[0]}));
         yield call(getMemberPtAttendenceListFromServer);
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
export function* savePtSessionTimeWeight() {
    yield takeEvery(SAVE_PT_SESSIONTIMEWEIGHT, savePtSessionTimeWeightFromServer);
}

const deletePtAttendanceRequest = function* (data)
{  let response = yield api.post('delete-member-pt-attendancelist', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete class From Server
 */
function* deletePtAttendenceFromServer(action) {
    try {
        const response = yield call(deletePtAttendanceRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Attendance deleted successfully."));
           yield call(getMemberPtAttendenceListFromServer);
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
export function* deletePtAttendance() {
    yield takeEvery(DELETE_PT_ATTENDANCE, deletePtAttendenceFromServer);

}


/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(savememberattendance),
      fork(getMemberAttendanceList),
      fork(deleteAttendance),
      fork(saveMemberPtAttendance),
      fork(getMemberPtAttendanceList),
      fork(savePtSessionTimeWeight),
      fork(deletePtAttendance)
        ]);
}
