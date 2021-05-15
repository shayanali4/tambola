/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import {biomaxReducer,settings} from './states';
import { push } from 'connected-react-router';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api, {fileUploadConfig} from 'Api';

import {
  GET_BIOMAX_MEMBERS,
  GET_BIOMAX_MEMBERS_LOGS,

  GET_BIOMAX_USERS,
  GET_BIOMAX_USERS_LOGS,

  GET_BIOMAX_UNAUTHORISED_LOGS

} from 'Actions/types';

import {
  getBiomaxMembersLogsSuccess,
    getBiomaxMembersSuccess,
    getBiomaxUsersLogsSuccess,
    getBiomaxUsersSuccess,
    getBiomaxUnauthorisedLogsSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

const getBiometricDeviceRequest = function* (data)
{
   let response = yield api.post('biometric-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}
/**
 * Send Member Management Request To Server
 */
const getMembersRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered && data.filtered.map(x => {
    if(x.id == "lastcheckin")
    {
      x.value = setLocalDate(x.value);
    }
  });

  let response = yield  api.post('get-biomaxmembers', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}
/**
 * Get Members From Server
 */

function* getMembersFromServer(action) {
    try {
        const state = yield select(biomaxReducer);
        const state1 = yield select(settings);
        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getMembersRequest, state.tableInfo);
        let response1 = '';
        if(!(state.biometricdevicelist && state.biometricdevicelist.length > 0))
        {
           response1 = yield call(getBiometricDeviceRequest,state.tableInfo);
        }

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
        {
            yield put(getBiomaxMembersSuccess({data : response[0] , pages : response[1],biometricdevicelist : response1 ? response1[0] : state.biometricdevicelist}));
        }
        else {
            yield put(requestFailure(response.errorMessage || response1.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally {
    }
}

/**
 * Get Members
 */
export function* getBiomaxMembers() {
    yield takeEvery(GET_BIOMAX_MEMBERS, getMembersFromServer);
}



/**
 * Send Member Management logs Request To Server
 */
const getMembersLogsRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered && data.filtered.map(x => {
    if(x.id == "intime" || x.id == "outtime")
    {
      x.value = setLocalDate(x.value);
    }
  });
  let response = yield  api.post('get-biomaxmemberslogs', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}
/**
 * Get Members logs From Server
 */

function* getMembersLogsFromServer(action) {
    try {
        const state = yield select(biomaxReducer);
        const state1 = yield select(settings);
        state.tableInfoLogs.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getMembersLogsRequest, state.tableInfoLogs);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getBiomaxMembersLogsSuccess({data : response[0] || [] , pages : response[1] }));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally {
    }
}

/**
 * Get Members
 */
export function* getBiomaxMembersLogs() {
    yield takeEvery(GET_BIOMAX_MEMBERS_LOGS, getMembersLogsFromServer);
}







/**
 * Send user Management Request To Server
 */
const getUsersRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "lastcheckin") {
      x.value = setLocalDate(x.value)
    }
  });

  let response = yield  api.post('get-biomaxusers', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}
/**
 * Get users From Server
 */

function* getUsersFromServer(action) {
    try {
        const state = yield select(biomaxReducer);
        const state1 = yield select(settings);
        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getUsersRequest, state.tableInfo);
        const response1 = yield call(getBiometricDeviceRequest,state.tableInfo);

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
        {
            yield put(getBiomaxUsersSuccess({data : response[0] , pages : response[1],biometricdevicelist : response1[0]}));
        }
        else {
            yield put(requestFailure(response.errorMessage || response1.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally {
    }
}

/**
 * Get users
 */
export function* getBiomaxUsers() {
    yield takeEvery(GET_BIOMAX_USERS, getUsersFromServer);
}



/**
 * Send user  logs Request To Server
 */
const getusersLogsRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
  data.filtered.map(x => {
    if(x.id == "intime" || x.id == "outtime") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-biomaxuserslogs', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}
/**
 * Get users logs From Server
 */

function* getUsersLogsFromServer(action) {
    try {
        const state = yield select(biomaxReducer);
        const state1 = yield select(settings);
        state.tableInfoLogs.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getusersLogsRequest, state.tableInfoLogs);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getBiomaxUsersLogsSuccess({data : response[0] || [] , pages : response[1] }));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally {
    }
}

/**
 * Get Members
 */
export function* getBiomaxUsersLogs() {
    yield takeEvery(GET_BIOMAX_USERS_LOGS, getUsersLogsFromServer);
}




/**
 * Send unauthorisedlogs  Request To Server
 */
const getunauthrisedLogsRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered && data.filtered.map(x => {
    if(x.id == "intime" || x.id == "outtime")
    {
      x.value = setLocalDate(x.value);
    }
  });
  let response = yield  api.post('get-biomaxunauthrisedlogs', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}
/**
 * Get unauthorisedlogs From Server
 */

function* getUnauthrisedLogsFromServer(action) {
    try {
        const state = yield select(biomaxReducer);
        const state1 = yield select(settings);
        state.tableInfoUnauthorisedLogs.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getunauthrisedLogsRequest, state.tableInfoUnauthorisedLogs);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getBiomaxUnauthorisedLogsSuccess({data : response[0] || [] , pages : response[1] }));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally {
    }
}

/**
 * Get unauthorisedlogs
 */
export function* getBiomaxUnauthorisedLogs() {
    yield takeEvery(GET_BIOMAX_UNAUTHORISED_LOGS, getUnauthrisedLogsFromServer);
}




/**
 * Member Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getBiomaxMembers),
        fork(getBiomaxMembersLogs),
        fork(getBiomaxUsers),
        fork(getBiomaxUsersLogs),
        fork(getBiomaxUnauthorisedLogs)
    ]);
}
