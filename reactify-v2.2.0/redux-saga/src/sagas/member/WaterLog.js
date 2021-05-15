/**
 * Employee Management Sagas
 */
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';

// api
import api  from 'Api';

import {
  SAVE_MEMBER_WATER_GOAL,
  SAVE_MEMBER_WATER_LOG,
  OPEN_MEMBER_VIEW_WATER_LOG_MODEL,
  DELETE_MEMBER_WATER_LOG,
  GET_MEMBER_TODAYCONSUMEDWATER,
} from 'Actions/types';

import {
  opnMemberViewWaterLogModelSuccess,
  getMemberTodayConsumedWaterSuccess,
    requestFailure,
    showLoader,
    hideLoader,
    requestSuccess,
} from 'Actions';



const saveMemberWaterGoalRequest = function* (data)
{
   let response = yield api.post('save-member-watergoal', data)
       .then(response => response.data)
       .catch(error => error.response.data)
   return response;
}

function* saveMemberWaterGoalFromServer(action) {
   try {
     const response = yield call(saveMemberWaterGoalRequest,action.payload);
     if(!(response.errorMessage  || response.ORAT))
     {
        yield put(requestSuccess("Setting saved successfully."));
    }
   else {
       yield put(requestFailure(response.errorMessage));
     }
     } catch (error) {
     console.debug(error);
     }
}

export function* saveMemberWaterGoal() {
   yield takeEvery(SAVE_MEMBER_WATER_GOAL, saveMemberWaterGoalFromServer);
}


const saveMemberWaterLogRequest = function* (data)
{
   let response = yield api.post('save-member-waterlog', data)
       .then(response => response.data)
       .catch(error => error.response.data)
   return response;
}

function* saveMemberWaterLogFromServer(action) {
   try {
     const response = yield call(saveMemberWaterLogRequest,action.payload);
     if(!(response.errorMessage  || response.ORAT))
     {
        yield put(requestSuccess("Get your next glass in 60 minutes."));
        yield call(getMemberTodayConsumedWaterFromServer);

    }
   else {
       yield put(requestFailure(response.errorMessage));
     }
     } catch (error) {
     console.debug(error);
     }
}

export function* saveMemberWaterLog() {
   yield takeEvery(SAVE_MEMBER_WATER_LOG, saveMemberWaterLogFromServer);
}
const viewMemberWaterLogRequest = function* (data)
{
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
   let response = yield api.post('view-member-waterlog', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}
/**
* VIEW dietroutine From Server
*/
function* viewMemberWaterLogFromServer(action) {
   try {
       const response = yield call(viewMemberWaterLogRequest, action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(opnMemberViewWaterLogModelSuccess({data : response[0]}));
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
* VIEW dietroutine
*/
export function* opnMemberViewWaterLogModel() {
   yield takeEvery(OPEN_MEMBER_VIEW_WATER_LOG_MODEL, viewMemberWaterLogFromServer);
}

/**
 * Send diet routine Delete Request To Server
 */
const deleteMemberWaterLogRequest = function* (data)
{  let response = yield api.post('delete-member-waterlog', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete diet routine From Server
 */
function* deleteMemberWaterLogFromServer(action) {
    try {
        yield put(showLoader());
        const response = yield call(deleteMemberWaterLogRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Water log deleted successfully."));
          yield call(getMemberTodayConsumedWaterFromServer);


      } else {
         yield put(requestFailure(response.errorMessage));
      }
  } catch (error) {
      console.log(error);
  }
  finally{

  }
}

export function* deleteMemberWaterLog() {
    yield takeEvery(DELETE_MEMBER_WATER_LOG, deleteMemberWaterLogFromServer);

}
const getMemberTodayConsumedWaterRequest = function* (data)
{
   data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
  let response = yield api.post('get-member-todayconsumedwater', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}
/**
* VIEW dietroutine From Server
*/
function* getMemberTodayConsumedWaterFromServer(action) {
   try {

       const response = yield call(getMemberTodayConsumedWaterRequest, action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(getMemberTodayConsumedWaterSuccess({data : response}));
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
* VIEW dietroutine
*/
export function* getMemberTodayConsumedWater() {
   yield takeEvery(GET_MEMBER_TODAYCONSUMEDWATER, getMemberTodayConsumedWaterFromServer);
}


export default function* rootSaga() {
    yield all([
        fork(saveMemberWaterGoal),
        fork(saveMemberWaterLog),
        fork(opnMemberViewWaterLogModel),
        fork(deleteMemberWaterLog),
        fork(getMemberTodayConsumedWater)
    ]);
}
