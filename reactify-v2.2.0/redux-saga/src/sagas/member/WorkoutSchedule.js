import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';
import {memberWorkoutScheduleReducer} from '../states';
import {cloneDeep} from 'Helpers/helpers';

import {
  GET_MEMBER_WORKOUT_SCHEDULE,
  OPEN_MEMBER_VIEW_WORKOUT_SCHEDULE_MODEL,
  SAVE_MEMBER_PHASE,
} from 'Actions/types';

import {
  getMemberWorkoutScheduleSuccess,
  viewMemberWorkoutScheduleSuccess,
  savememberPhaseSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';



/**
 * Send workout Schedule Request To Server
 */
const getWorkoutScheduleRequest = function* (data)
{
  let response = yield  api.post('member-workout-schedule', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}
/**
 * Get workout schedule From Server
 */

function* getWorkoutScheduleFromServer() {
    try {
        const state = yield select(memberWorkoutScheduleReducer);
        state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getWorkoutScheduleRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getMemberWorkoutScheduleSuccess({data : response[0] , pages : response[1]}));
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
 * Get workout schedules
 */
export function* getMemberWorkoutSchedule() {
    yield takeEvery(GET_MEMBER_WORKOUT_SCHEDULE, getWorkoutScheduleFromServer);
}

const viewMemberWorkoutScheduleRequest = function* (data)
{
  let response = yield api.post('view-member-workout-schedule', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

function* viewMemberWorkoutScheduleFromServer(action) {
   try {


       yield put(showLoader());
       const response = yield call(viewMemberWorkoutScheduleRequest,action.payload);
       if(!(response.errorMessage  || response.ORAT))
       {
          yield put(viewMemberWorkoutScheduleSuccess({data : response[0]}));
      }
     else {
       yield put(requestFailure(response.errorMessage ));
     }
   } catch (error) {
     console.log(error);
   }
   finally
   {
       yield put(hideLoader());
   }
}
/**
* VIEW measurement
*/
export function* opnMemberViewWorkoutScheduleModel() {
   yield takeEvery(OPEN_MEMBER_VIEW_WORKOUT_SCHEDULE_MODEL, viewMemberWorkoutScheduleFromServer);
}

const saveWorkoutRoutineRequest = function* (data)
{

    let response = yield api.post('save-phase', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save workout routine From Server
 */
function* saveWorkoutRoutineFromServer(action) {
    try {
      if(action.payload){
        action.payload.phases = action.payload.phases.map(x => {return {"routineid" :x.routineid,"noofweeks":x.noofweeks,"Isactive":x.Isactive}})
      }
      const response = yield call(saveWorkoutRoutineRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
          //
          // if(action.payload.Isactive == 1)
          // {
          //   yield put(requestSuccess("Workout Phase is activate successfully."));
          // }
          //


            yield call(viewMemberWorkoutScheduleFromServer,{payload : {id : action.payload.id}});
            yield  put(savememberPhaseSuccess());
            yield  call(getWorkoutScheduleFromServer);
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }


/**
 * Get workout routines
 */
export function* savememberPhase() {
    yield takeEvery(SAVE_MEMBER_PHASE, saveWorkoutRoutineFromServer);
}

export default function* rootSaga() {
    yield all([
      fork(getMemberWorkoutSchedule),
      fork(opnMemberViewWorkoutScheduleModel),
      fork(savememberPhase)
    ]);
}
