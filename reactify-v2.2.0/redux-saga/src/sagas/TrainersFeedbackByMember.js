import { all, call, fork, put, takeEvery ,select} from 'redux-saga/effects';
import {trainersFeedbackByMemberReducer,settings} from './states';

import api from 'Api';
import { push } from 'connected-react-router';

import {
  GET_TRAINERS_FEEDBACK_BYMEMBER,
  OPEN_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL,
  GET_TRAINERS_GS_FEEDBACK_BYMEMBER,
  OPEN_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL,
  GET_TRAINERS_GENERALRATING_BYMEMBER,
  OPEN_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL,
} from 'Actions/types';

import {
  getTrainersFeedbackByMemberSuccess,
  viewTrainersFeedbackByMemberSuccess,
  getTrainersGSfeedbackByMemberSuccess,
  viewTrainersGSfeedbackByMemberSuccess,
  getTrainersGeneralRatingByMemberSuccess,
  viewTrainersGeneralRatingByMemberSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';

const getTrainersFeedbackByMemberRequest = function* (data)
{
  let response = yield  api.post('get-trainersfeedbackbymember', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}

function* getTrainersFeedbackByMemberFromServer(action) {
    try {
        const state = yield select(trainersFeedbackByMemberReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getTrainersFeedbackByMemberRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getTrainersFeedbackByMemberSuccess({data : response[0], pages : response[1]}));
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

export function* getTrainersFeedbackByMember() {
    yield takeEvery(GET_TRAINERS_FEEDBACK_BYMEMBER, getTrainersFeedbackByMemberFromServer);
}

const viewTrainersFeedbackByMemberRequest = function* (data)
{
  let response = yield api.post('view-trainersfeedbackbymember', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

function* viewTrainersFeedbackByMemberFromServer(action) {
   try {
     const state1 = yield select(settings);

       action.payload.branchid = state1.userProfileDetail.defaultbranchid;
       const response = yield call(viewTrainersFeedbackByMemberRequest,action.payload);
       if(!(response.errorMessage  || response.ORAT))
       {
          yield put(viewTrainersFeedbackByMemberSuccess({data : response[0]}));
      }
     else {
       yield put(requestFailure(response.errorMessage ));
     }
   } catch (error) {
     console.log(error);
   }
   finally
   {
   }
}

export function* opnViewTrainersFeedbackByMemberModel() {
   yield takeEvery(OPEN_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL, viewTrainersFeedbackByMemberFromServer);
}


const getTrainersGSFeedbackByMemberRequest = function* (data)
{
  let response = yield  api.post('get-trainersgsfeedbackbymember', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}

function* getTrainersGSFeedbackByMemberFromServer(action) {
    try {
        const state = yield select(trainersFeedbackByMemberReducer);
        const state1 = yield select(settings);

        state.tableInfoGS.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getTrainersGSFeedbackByMemberRequest, state.tableInfoGS);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getTrainersGSfeedbackByMemberSuccess({data : response[0], pages : response[1]}));
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

export function* getTrainersGSfeedbackByMember() {
    yield takeEvery(GET_TRAINERS_GS_FEEDBACK_BYMEMBER, getTrainersGSFeedbackByMemberFromServer);
}

const viewTrainersGSFeedbackByMemberRequest = function* (data)
{
  let response = yield api.post('view-trainersgsfeedbackbymember', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

function* viewTrainersGSFeedbackByMemberFromServer(action) {
   try {
     const state1 = yield select(settings);

        action.payload.branchid = state1.userProfileDetail.defaultbranchid;
       const response = yield call(viewTrainersGSFeedbackByMemberRequest,action.payload);
       if(!(response.errorMessage  || response.ORAT))
       {
          yield put(viewTrainersGSfeedbackByMemberSuccess({data : response[0]}));
      }
     else {
       yield put(requestFailure(response.errorMessage ));
     }
   } catch (error) {
     console.log(error);
   }
   finally
   {
   }
}

export function* opnViewTrainersGSfeedbackByMemberModel() {
   yield takeEvery(OPEN_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL, viewTrainersGSFeedbackByMemberFromServer);
}


const getTrainersGeneralRatingByMemberRequest = function* (data)
{
  let response = yield  api.post('get-trainers-generalrating-bymember', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}

function* getTrainersGeneralRatingByMemberFromServer(action) {
    try {
        const state = yield select(trainersFeedbackByMemberReducer);
        const state1 = yield select(settings);

        state.tableInfoRating.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getTrainersGeneralRatingByMemberRequest, state.tableInfoRating);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getTrainersGeneralRatingByMemberSuccess({data : response[0], pages : response[1]}));
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

export function* getTrainersGeneralRatingByMember() {
    yield takeEvery(GET_TRAINERS_GENERALRATING_BYMEMBER, getTrainersGeneralRatingByMemberFromServer);
}


const viewTrainersGeneralRatingByMemberRequest = function* (data)
{
  let response = yield api.post('view-trainers-generalrating-bymember', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

function* viewTrainersGeneralRatingByMemberFromServer(action) {
   try {
     const state1 = yield select(settings);

        action.payload.branchid = state1.userProfileDetail.defaultbranchid;
       const response = yield call(viewTrainersGeneralRatingByMemberRequest,action.payload);
       if(!(response.errorMessage  || response.ORAT))
       {
          yield put(viewTrainersGeneralRatingByMemberSuccess({data : response[0]}));
      }
     else {
       yield put(requestFailure(response.errorMessage ));
     }
   } catch (error) {
     console.log(error);
   }
   finally
   {
   }
}

export function* opnViewTrainersGeneralRatingByMemberModel() {
   yield takeEvery(OPEN_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL, viewTrainersGeneralRatingByMemberFromServer);
}

export default function* rootSaga() {
    yield all([
      fork(getTrainersFeedbackByMember),
      fork(opnViewTrainersFeedbackByMemberModel),
      fork(getTrainersGSfeedbackByMember),
      fork(opnViewTrainersGSfeedbackByMemberModel),
      fork(getTrainersGeneralRatingByMember),
      fork(opnViewTrainersGeneralRatingByMemberModel),
        ]);
}
