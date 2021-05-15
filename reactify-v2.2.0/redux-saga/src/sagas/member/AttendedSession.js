import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';
import {memberattendedSessionReducer,settings } from '../states';
import { push } from 'connected-react-router';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
  GET_MEMBER_ATTENDED_SESSION,
  CONFIRM_MEMBER_ATTENDED_SESSION,
  SAVE_MEMBER_ATTENDED_PT_SESSION_FEEDBACK,
  SAVE_MEMBER_ATTENDED_GS_SESSION_FEEDBACK,
  GET_USER_RATING,
  SAVE_USERRATING_FEEDBACK,
} from 'Actions/types';

import {
  getMemberAttendedSessionSuccess,
  saveMemberAttendedPtSessionFeedbackSuccess,
  saveMemberAttendedGsSessionFeedbackSuccess,
  getUserRatingSuccess,
  saveUserRatingFeedbackSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';
/**
 * Send products Request To Server
 */
const getMemberAttendedSessionRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
  data.filtered.map(x => {
    if(x.id == "createdbydate" || x.id == "attendancedate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-member-attended-session', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

function* getMemberAttendedSessionFromServer(action) {
    try {
        const state = yield select(memberattendedSessionReducer);
        const response = yield call(getMemberAttendedSessionRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getMemberAttendedSessionSuccess({data : response[0], pages : response[1]}));
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
 * Get enquiry
 */
export function* getMemberAttendedSession() {
    yield takeEvery(GET_MEMBER_ATTENDED_SESSION, getMemberAttendedSessionFromServer);
}


const confirmMemberAttendedSessionRequest = function* (data)
{let response = yield  api.post('confirm-member-attended-session', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

function* confirmMemberAttendedSessionFromServer(action) {
    try {
        const response = yield call(confirmMemberAttendedSessionRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess("Thanks for confirming your attendence!!"));
            yield call(getMemberAttendedSessionFromServer);
            if(!action.payload.rating)
            {
              yield put(push('?id='+action.payload.id+'#feedback'));
            }
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

export function* confirmMemberAttendedSession() {
    yield takeEvery(CONFIRM_MEMBER_ATTENDED_SESSION, confirmMemberAttendedSessionFromServer);
}

const saveMemberAttendedPtSessionFeedbackRequest = function* (data)
{
    let response = yield api.post('save-member-attended-ptsession-feedback', data)
        .then(response => response.data)
        .catch(error => error.response.data)
    return response;
}

function* saveMemberAttendedPtSessionFeedbackToServer(action) {
    try {
            const response = yield call(saveMemberAttendedPtSessionFeedbackRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
              yield put(requestSuccess("Thanks for feedback!!"));
             yield  put(saveMemberAttendedPtSessionFeedbackSuccess());
              yield call(getMemberAttendedSessionFromServer);
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveMemberAttendedPtSessionFeedback() {
    yield takeEvery(SAVE_MEMBER_ATTENDED_PT_SESSION_FEEDBACK, saveMemberAttendedPtSessionFeedbackToServer);
}


const saveMemberAttendedGsSessionFeedbackRequest = function* (data)
{
    let response = yield api.post('save-member-attended-gssession-feedback', data)
        .then(response => response.data)
        .catch(error => error.response.data)
    return response;
}

function* saveMemberAttendedGsSessionFeedbackToServer(action) {
    try {
            const response = yield call(saveMemberAttendedGsSessionFeedbackRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
              yield put(requestSuccess("Thanks for feedback!!"));
              yield  put(saveMemberAttendedGsSessionFeedbackSuccess());
              yield call(getMemberAttendedSessionFromServer);
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveMemberAttendedGsSessionFeedback() {
    yield takeEvery(SAVE_MEMBER_ATTENDED_GS_SESSION_FEEDBACK, saveMemberAttendedGsSessionFeedbackToServer);
}



const getUserRatingRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
  let response = yield  api.post('get-user-rating', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

function* getUserRatingFromServer(action) {
    try {
        const state = yield select(memberattendedSessionReducer);
        const state1 = yield select(settings);

        state.tableInfoUserRating.branchid = state1.memberProfileDetail && state1.memberProfileDetail.defaultbranchid;
        const response = yield call(getUserRatingRequest, state.tableInfoUserRating);

        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getUserRatingSuccess({data : response[0], pages : response[1]}));
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


export function* getUserRating() {
    yield takeEvery(GET_USER_RATING, getUserRatingFromServer);
}


const saveUserRatingFeedbackRequest = function* (data)
{
    let response = yield api.post('save-userrating-feedback', data)
        .then(response => response.data)
        .catch(error => error.response.data)
    return response;
}

function* saveUserRatingFeedbackToServer(action) {
    try {

            const response = yield call(saveUserRatingFeedbackRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
              yield put(requestSuccess("Thanks for feedback!!"));
             yield  put(saveUserRatingFeedbackSuccess());
              yield call(getUserRatingFromServer);
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveUserRatingFeedback() {
    yield takeEvery(SAVE_USERRATING_FEEDBACK, saveUserRatingFeedbackToServer);
}



export default function* rootSaga() {
    yield all([
      fork(getMemberAttendedSession),
      fork(confirmMemberAttendedSession),
      fork(saveMemberAttendedPtSessionFeedback),
      fork(saveMemberAttendedGsSessionFeedback),
      fork(getUserRating),
      fork(saveUserRatingFeedback),
    ]);
}
