/**
 * Feedback Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import {feedback,settings} from './states';
import FormData from 'form-data';

// api
import api , {fileUploadConfig} from 'Api';

import {
    GET_FEEDBACKS,
    SAVE_FEEDBACK,
    ON_COMMENT_FEEDBACK,
    VIEW_COMMENTS_DETAILS,
    SAVE_FEEDBACK_STATUS
} from 'Actions/types';

import {
    getFeedbacksSuccess,
    getFeedbacksFailure,
    saveFeedbackSuccess,
    onCommentActionSuccess,
    viewCommentsDetailsSuccess,
    saveFeedbackStatusSuccess,
    requestFailure,
    requestSuccess,

} from 'Actions';

const getFeedbacksRequest = function* (data)
{
   let response = yield api.post('list-feedback', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}
const getClientRequest = function* (data)
{

   let response = yield api.post('client-list', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * const getFeedbacksRequest = async () =>
     await api.get('list-feedback')
         .then(response => response)
         .catch(error => error);
 */


function* getFeedbacksFromServer(action) {
    try {
      const state = yield select(feedback);
      const state1 = yield select(settings);

      state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
      state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getFeedbacksRequest, state.tableInfo);
        let response1 = '';
        if(!(state.clientList && state.clientList.length > 0))
        {
            response1 = yield call(getClientRequest, state.tableInfo);
        }

        if(!response.errorMessage  && !response1.errorMessage)
        {
          yield put(getFeedbacksSuccess({data : response[0], pages : response[1],clientList : response1 ? response1[0] : state.clientList }));
        }
        else {
          yield put(requestFailure(response.errorMessage || response1.errorMessage));
        }


    } catch (error) {
        yield put(getFeedbacksFailure(error));
    }
}

/**
 * Ger Emails
 */
export function* getFeedbacks() {
    yield takeEvery(GET_FEEDBACKS, getFeedbacksFromServer);
}

const saveFeedbackRequest = function* (data)
{
  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

    data.feedback.imageFiles.map((files) =>
    formData.append("files", files));

    let response = yield api.post('save-feedback', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;

}
/**
 * save product From Server
 */
function* saveFeedbackFromServer(action) {
    try {
        const state1 = yield select(settings);

        action.payload.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(saveFeedbackRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess("New Feedback Added!"));
            yield  put(saveFeedbackSuccess());
         }
          else {
          yield put(requestFailure(response.errorMessage));
              }

        } catch (error) {
        console.log(error);
        }
  }

export function* saveFeedback() {
    yield takeEvery(SAVE_FEEDBACK, saveFeedbackFromServer);
}


const savecommentsFeedbackRequest = function* (data)
{
    let response = yield api.post('savecomments-feedback', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* savecommentsFeedbackFromServer(action) {
    try {
        const response = yield call(savecommentsFeedbackRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess("New comment added!"));
            yield  put(onCommentActionSuccess());
            yield call(getFeedbacksFromServer);
         }
          else {
          yield put(requestFailure(response.errorMessage));
              }

        } catch (error) {
        console.log(error);
        }
  }

export function* onCommentAction() {
    yield takeEvery(ON_COMMENT_FEEDBACK, savecommentsFeedbackFromServer);
}

/**
 * Send comment VIEW Request To Server
 */
 const viewCommentsRequest = function* (data)
 {  let response = yield api.post('view-comments', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }
/**
 * VIEW comment From Server
 */
function* viewCommentFromServer(action) {
    try {
        const state = yield select(feedback);
        action.payload.clientid = state.tableInfo.clientid;

        const response = yield call(viewCommentsRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewCommentsDetailsSuccess({data : response[0][0]}));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally
    {

    }
}
/**
 * VIEW comment
 */
export function* viewCommentsDetails() {
    yield takeEvery(VIEW_COMMENTS_DETAILS, viewCommentFromServer);
}


const saveFeedbackStatusRequest = function* (data)
{
    let response = yield api.post('save-feedbackstatus', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* saveFeedbackStatusFromServer(action) {
    try {
        const response = yield call(saveFeedbackStatusRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess("Feedback Status Save!"));
            yield  put(saveFeedbackStatusSuccess());
            yield call(getFeedbacksFromServer);
         }
          else {
          yield put(requestFailure(response.errorMessage));
              }

        } catch (error) {
        console.log(error);
        }
  }

export function* saveFeedbackStatus() {
    yield takeEvery(SAVE_FEEDBACK_STATUS, saveFeedbackStatusFromServer);
}


/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getFeedbacks),
        fork(saveFeedback),
        fork(onCommentAction),
        fork(viewCommentsDetails),
        fork(saveFeedbackStatus)
    ]);
}
