/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {followupDashboardReducer,settings} from './states';
import { push } from 'connected-react-router';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api,{fileUploadConfig} from 'Api';

import {
  GET_FOLLOWUPDASHBOARD_ONTRIALENQUIRIES,
  GET_FOLLOWUPDASHBOARD_RECENTENQUIRIES,
  GET_FOLLOWUPDASHBOARD_RECENTEXPIREDMEMBER,
  GET_FOLLOWUPDASHBOARD_MEMBERSHIPTOBEEXPIRED,
  GET_FOLLOWUPDASHBOARD_PAYMENTDUES,
  GET_FOLLOWUPDASHBOARD_RECENTPTEXPIRED,
  GET_FOLLOWUPDASHBOARD_PTTOBEEXPIRED,
  GET_FOLLOWUPDASHBOARD_MISSEDENQUIRYFOLLOWUP,
  GET_FOLLOWUPDASHBOARD_MISSEDMEMBERFOLLOWUP,
  GET_MASTERDASHBOARD_TODAYENQUIRYREMINDER,
  GET_MASTERDASHBOARD_TODAYMEMBERREMINDER,
  GET_FOLLOWUPDASHBOARD_RECENTMEMBER,
  GET_FOLLOWUPDASHBOARD_TODAY_BIRTHDAY,
  GET_FOLLOWUPDASHBOARD_TODAY_ANNIVERSARY,
} from 'Actions/types';

import {
    getFollowupDashboardOntrialEnquiriesSuccess,
    getFollowupDashboardRecentEnquiriesSuccess,
    getFollowupDashboardRecentExpiredMemberSuccess,
    getFollowupDashboardMembershiptobeExpiredSuccess,
    getFollowupDashboardPaymentDuesSuccess,
    getFollowupDashboardRecentPTExpiredSuccess,
    getFollowupDashboardPTTobeExpiredSuccess,
    getFollowupDashboardMissedEnquiryFollowupSuccess,
    getFollowupDashboardMissedMemberFollowupSuccess,
    getMasterDashboardTodayEnquiryReminderSuccess,
    getMasterDashboardTodayMemberReminderSuccess,
    getFollowupDashboardRecentMemberSuccess,
    getFollowupDashboardTodayBirthdaySuccess,
    getFollowupDashboardTodayAnniversarySuccess,
    requestFailure,
} from 'Actions';


const getFollowupDashboardOntrialEnquiriesRequest = function* (data)
{
  data = cloneDeep(data);
  if(data.filtered && data.filtered.length > 0)
  {
    data.filtered.map(x => {
      if(x.id == "startdate" || x.id == "enddate") {
        x.value = setLocalDate(x.value)
      }
    });
  }

  let response = yield  api.post('dashboard-ontrial-enquiry', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getFollowupDashboardOntrialEnquiriesFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoOnTrialEnquiries.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoOnTrialEnquiries.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFollowupDashboardOntrialEnquiriesRequest, state.tableInfoOnTrialEnquiries);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getFollowupDashboardOntrialEnquiriesSuccess({data : response[0] , pages : response[1]}));
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

export function* getFollowupDashboardOntrialEnquiries() {
    yield takeEvery(GET_FOLLOWUPDASHBOARD_ONTRIALENQUIRIES, getFollowupDashboardOntrialEnquiriesFromServer);
}



const getFollowupDashboardRecentEnquiriesRequest = function* (data)
{
  data = cloneDeep(data);

  if(data.filtered && data.filtered.length > 0)
  {
    data.filtered.map(x => {
      if(x.id == "followupdate") {
        x.value = setLocalDate(x.value)
      }
    });
  }

  let response = yield  api.post('dashboard-recent-enquiry', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getFollowupDashboardRecentEnquiriesFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoRecentEnquiries.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoRecentEnquiries.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFollowupDashboardRecentEnquiriesRequest, state.tableInfoRecentEnquiries);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getFollowupDashboardRecentEnquiriesSuccess({data : response[0] , pages : response[1]}));
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

export function* getFollowupDashboardRecentEnquiries() {
    yield takeEvery(GET_FOLLOWUPDASHBOARD_RECENTENQUIRIES, getFollowupDashboardRecentEnquiriesFromServer);
}




const getFollowupDashboardRecentExpiredMemberRequest = function* (data)
{
  data = cloneDeep(data);

  if(data.filtered && data.filtered.length > 0)
  {
    data.filtered.map(x => {
      if(x.id == "expirydatesubscription") {
        x.value = setLocalDate(x.value)
      }
    });
  }

  let response = yield  api.post('dashboard-recent-expired-member', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getFollowupDashboardRecentExpiredMemberFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoRecentExpiredMember.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoRecentExpiredMember.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFollowupDashboardRecentExpiredMemberRequest, state.tableInfoRecentExpiredMember);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getFollowupDashboardRecentExpiredMemberSuccess({data : response[0] , pages : response[1]}));
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

export function* getFollowupDashboardRecentExpiredMember() {
    yield takeEvery(GET_FOLLOWUPDASHBOARD_RECENTEXPIREDMEMBER, getFollowupDashboardRecentExpiredMemberFromServer);
}



const getFollowupDashboardMembershiptobeExpiredRequest = function* (data)
{
  data = cloneDeep(data);

  if(data.filtered && data.filtered.length > 0)
  {
    data.filtered.map(x => {
      if(x.id == "expirydatesubscription") {
        x.value = setLocalDate(x.value)
      }
    });
  }

  let response = yield  api.post('dashboard-member-to-be-expire', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getFollowupDashboardMembershiptobeExpiredFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoMembershipToBeExpired.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoMembershipToBeExpired.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFollowupDashboardMembershiptobeExpiredRequest, state.tableInfoMembershipToBeExpired);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getFollowupDashboardMembershiptobeExpiredSuccess({data : response[0] , pages : response[1]}));
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

export function* getFollowupDashboardMembershiptobeExpired() {
    yield takeEvery(GET_FOLLOWUPDASHBOARD_MEMBERSHIPTOBEEXPIRED, getFollowupDashboardMembershiptobeExpiredFromServer);
}


const getFollowupDashboardPaymentDuesRequest = function* (data)
{
  data = cloneDeep(data);

  if(data.filtered && data.filtered.length > 0)
  {
    data.filtered.map(x => {
      if(x.id == "date") {
        x.value = setLocalDate(x.value)
      }
    });
  }

  let response = yield  api.post('dashboard-payment-to-be-dues', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getFollowupDashboardPaymentDuesFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoPaymentDues.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoPaymentDues.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFollowupDashboardPaymentDuesRequest, state.tableInfoPaymentDues);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getFollowupDashboardPaymentDuesSuccess({data : response[0] , pages : response[1]}));
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

export function* getFollowupDashboardPaymentDues() {
    yield takeEvery(GET_FOLLOWUPDASHBOARD_PAYMENTDUES, getFollowupDashboardPaymentDuesFromServer);
}



const getFollowupDashboardRecentPTExpiredRequest = function* (data)
{
  data = cloneDeep(data);

  if(data.filtered && data.filtered.length > 0)
  {
    data.filtered.map(x => {
      if(x.id == "expirydatesubscription") {
        x.value = setLocalDate(x.value)
      }
    });
  }

  let response = yield  api.post('dashboard-recent-expired-pt', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getFollowupDashboardRecentPTExpiredFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoRecentPTExpired.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoRecentPTExpired.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFollowupDashboardRecentPTExpiredRequest, state.tableInfoRecentPTExpired);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getFollowupDashboardRecentPTExpiredSuccess({data : response[0] , pages : response[1]}));
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

export function* getFollowupDashboardRecentPTExpired() {
    yield takeEvery(GET_FOLLOWUPDASHBOARD_RECENTPTEXPIRED, getFollowupDashboardRecentPTExpiredFromServer);
}




const getFollowupDashboardPTTobeExpiredRequest = function* (data)
{
  data = cloneDeep(data);

  if(data.filtered && data.filtered.length > 0)
  {
    data.filtered.map(x => {
      if(x.id == "expirydatesubscription") {
        x.value = setLocalDate(x.value)
      }
    });
  }

  let response = yield  api.post('dashboard-pt-to-be-expire', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getFollowupDashboardPTTobeExpiredFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoPtToBeExpired.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoPtToBeExpired.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFollowupDashboardPTTobeExpiredRequest, state.tableInfoPtToBeExpired);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getFollowupDashboardPTTobeExpiredSuccess({data : response[0] , pages : response[1]}));
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

export function* getFollowupDashboardPTTobeExpired() {
    yield takeEvery(GET_FOLLOWUPDASHBOARD_PTTOBEEXPIRED, getFollowupDashboardPTTobeExpiredFromServer);
}



const getFollowupDashboardMissedEnquiryFollowupRequest = function* (data)
{
  data = cloneDeep(data);

  if(data.filtered && data.filtered.length > 0)
  {
    data.filtered.map(x => {
      if(x.id == "followupdate") {
        x.value = setLocalDate(x.value)
      }
    });
  }

  let response = yield  api.post('dashboard-missed-enquiry-followup', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getFollowupDashboardMissedEnquiryFollowupFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoMissedEnquiryFollowup.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoMissedEnquiryFollowup.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFollowupDashboardMissedEnquiryFollowupRequest, state.tableInfoMissedEnquiryFollowup);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getFollowupDashboardMissedEnquiryFollowupSuccess({data : response[0] , pages : response[1]}));
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

export function* getFollowupDashboardMissedEnquiryFollowup() {
    yield takeEvery(GET_FOLLOWUPDASHBOARD_MISSEDENQUIRYFOLLOWUP, getFollowupDashboardMissedEnquiryFollowupFromServer);
}



const getFollowupDashboardMissedMemberFollowupRequest = function* (data)
{
  data = cloneDeep(data);

  if(data.filtered && data.filtered.length > 0)
  {
    data.filtered.map(x => {
      if(x.id == "followupdate") {
        x.value = setLocalDate(x.value)
      }
    });
  }

  let response = yield  api.post('dashboard-missed-member-followup', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getFollowupDashboardMissedMemberFollowupFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoMissedMemberFollowup.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoMissedMemberFollowup.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFollowupDashboardMissedMemberFollowupRequest, state.tableInfoMissedMemberFollowup);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getFollowupDashboardMissedMemberFollowupSuccess({data : response[0] , pages : response[1]}));
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

export function* getFollowupDashboardMissedMemberFollowup() {
    yield takeEvery(GET_FOLLOWUPDASHBOARD_MISSEDMEMBERFOLLOWUP, getFollowupDashboardMissedMemberFollowupFromServer);
}


const getMasterDashboardTodayEnquiryReminderRequest = function* (data)
{
  let response = yield  api.post('dashboard-reminder-enquiry', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getMasterDashboardTodayEnquiryReminderFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoTodayEnquiryReminder.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoTodayEnquiryReminder.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        state.tableInfoTodayEnquiryReminder.staffid = state1.userProfileDetail.id;

        const response = yield call(getMasterDashboardTodayEnquiryReminderRequest, state.tableInfoTodayEnquiryReminder);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getMasterDashboardTodayEnquiryReminderSuccess({data : response[0],tableInfoTodayEnquiryReminder : state.tableInfoTodayEnquiryReminder}));
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

export function* getMasterDashboardTodayEnquiryReminder() {
    yield takeEvery(GET_MASTERDASHBOARD_TODAYENQUIRYREMINDER, getMasterDashboardTodayEnquiryReminderFromServer);
}



const getMasterDashboardTodayMemberReminderRequest = function* (data)
{
  let response = yield  api.post('dashboard-reminder-member', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getMasterDashboardTodayMemberReminderFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoTodayMemberReminder.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoTodayMemberReminder.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        state.tableInfoTodayMemberReminder.staffid = state1.userProfileDetail.id;
        const response = yield call(getMasterDashboardTodayMemberReminderRequest, state.tableInfoTodayMemberReminder);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getMasterDashboardTodayMemberReminderSuccess({data : response[0]}));
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

export function* getMasterDashboardTodayMemberReminder() {
    yield takeEvery(GET_MASTERDASHBOARD_TODAYMEMBERREMINDER, getMasterDashboardTodayMemberReminderFromServer);
}



const getFollowupDashboardRecentMemberRequest = function* (data)
{
  data = cloneDeep(data);

  if(data.filtered && data.filtered.length > 0)
  {
    data.filtered.map(x => {
      if(x.id == "followupdate") {
        x.value = setLocalDate(x.value)
      }
    });
  }

  let response = yield  api.post('dashboard-recent-member', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getFollowupDashboardRecentMemberFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoRecentMember.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoRecentMember.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFollowupDashboardRecentMemberRequest, state.tableInfoRecentMember);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getFollowupDashboardRecentMemberSuccess({data : response[0] , pages : response[1]}));
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

export function* getFollowupDashboardRecentMember() {
    yield takeEvery(GET_FOLLOWUPDASHBOARD_RECENTMEMBER, getFollowupDashboardRecentMemberFromServer);
}



const getFollowupDashboardTodayBirthdayRequest = function* (data)
{
  let response = yield  api.post('followupdashboard-today-birthday', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getFollowupDashboardTodayBirthdayFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoTodayBirthday.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoTodayBirthday.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFollowupDashboardTodayBirthdayRequest, state.tableInfoTodayBirthday);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getFollowupDashboardTodayBirthdaySuccess({data : response[0] , pages : response[1]}));
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

export function* getFollowupDashboardTodayBirthday() {
    yield takeEvery(GET_FOLLOWUPDASHBOARD_TODAY_BIRTHDAY, getFollowupDashboardTodayBirthdayFromServer);
}



const getFollowupDashboardTodayAnniversaryRequest = function* (data)
{
  let response = yield  api.post('dashboard-today-anniversary', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

export function* getFollowupDashboardTodayAnniversaryFromServer(action) {
    try {
        const state = yield select(followupDashboardReducer);
        const state1 = yield select(settings);

        state.tableInfoTodayAnniversary.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfoTodayAnniversary.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFollowupDashboardTodayAnniversaryRequest, state.tableInfoTodayAnniversary);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getFollowupDashboardTodayAnniversarySuccess({data : response[0] , pages : response[1]}));
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

export function* getFollowupDashboardTodayAnniversary() {
    yield takeEvery(GET_FOLLOWUPDASHBOARD_TODAY_ANNIVERSARY, getFollowupDashboardTodayAnniversaryFromServer);
}



export default function* rootSaga() {
    yield all([
        fork(getFollowupDashboardOntrialEnquiries),
        fork(getFollowupDashboardRecentEnquiries),
        fork(getFollowupDashboardRecentExpiredMember),
        fork(getFollowupDashboardMembershiptobeExpired),
        fork(getFollowupDashboardPaymentDues),
        fork(getFollowupDashboardRecentPTExpired),
        fork(getFollowupDashboardPTTobeExpired),
        fork(getFollowupDashboardMissedEnquiryFollowup),
        fork(getFollowupDashboardMissedMemberFollowup),
        fork(getMasterDashboardTodayEnquiryReminder),
        fork(getMasterDashboardTodayMemberReminder),
        fork(getFollowupDashboardRecentMember),
        fork(getFollowupDashboardTodayBirthday),
        fork(getFollowupDashboardTodayAnniversary),
    ]);
}
