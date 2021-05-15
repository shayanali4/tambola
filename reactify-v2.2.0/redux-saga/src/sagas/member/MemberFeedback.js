/**
 * Feedback Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import {memberFeedbackReducer} from '../states';
import FormData from 'form-data';

// api
import api , {fileUploadConfig} from 'Api';


import {
  GET_MEMBER_FEEDBACKS,
  SAVE_MEMBER_FEEDBACK,
  ON_COMMENT_MEMBER_FEEDBACK,
  VIEW_MEMBER_COMMENTS_DETAILS,
} from 'Actions/types';

import {
    getMemberFeedbacksSuccess,
    saveMemberFeedbackSuccess,
    onCommentMemberFeedbackSuccess,
    viewMemberCommentsDetailsSuccess,
    requestFailure,
    requestSuccess,
} from 'Actions';

const getFeedbacksRequest = function* (data)
{

   let response = yield api.post('member-list-feedback', data)
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
        const state = yield select(memberFeedbackReducer);
        const response = yield call(getFeedbacksRequest,state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(getMemberFeedbacksSuccess({data : response[0], pages : response[1]}));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }


    } catch (error) {
        yield put(requestFailure(error));
    }
}


export function* getMemberFeedbacks() {
    yield takeEvery(GET_MEMBER_FEEDBACKS, getFeedbacksFromServer);
}

const saveFeedbackRequest = function* (data)
{
  var formData = new FormData();
 for ( var key in data ) {
     formData.append(key, JSON.stringify(data[key]));
 }

   data.feedback.imageFiles.map((files) =>
   formData.append("files", files));

    let response = yield api.post('member-save-feedback', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveFeedbackFromServer(action) {
    try {
        const response = yield call(saveFeedbackRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess("New Feedback Added!"));
            yield  put(saveMemberFeedbackSuccess());
         }
          else {
          yield put(requestFailure(response.errorMessage));
              }

        } catch (error) {
        console.log(error);
        }
  }

export function* saveMemberFeedback() {
    yield takeEvery(SAVE_MEMBER_FEEDBACK, saveFeedbackFromServer);
}

const savemembercommentsFeedbackRequest = function* (data)
{
    let response = yield api.post('member-savecomments-feedback', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* savemembercommentsFeedbackFromServer(action) {
    try {
        const response = yield call(savemembercommentsFeedbackRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess("New comments Added!"));
            yield  put(onCommentMemberFeedbackSuccess());
            yield call(getFeedbacksFromServer);
         }
          else {
          yield put(requestFailure(response.errorMessage));
              }

        } catch (error) {
        console.log(error);
        }
  }

export function* onCommentMemberFeedback() {
    yield takeEvery(ON_COMMENT_MEMBER_FEEDBACK, savemembercommentsFeedbackFromServer);
}
/**
 * Send comment VIEW Request To Server
 */
 const viewCommentsRequest = function* (data)
 {  let response = yield api.post('member-view-comments', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }
/**
 * VIEW comment From Server
 */
function* viewCommentFromServer(action) {
    try {
        const response = yield call(viewCommentsRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewMemberCommentsDetailsSuccess({data : response[0][0]}));
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
export function* viewMemberCommentsDetails() {
    yield takeEvery(VIEW_MEMBER_COMMENTS_DETAILS, viewCommentFromServer);
}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getMemberFeedbacks),
        fork(saveMemberFeedback),
        fork(onCommentMemberFeedback),
        fork(viewMemberCommentsDetails)
    ]);
}
