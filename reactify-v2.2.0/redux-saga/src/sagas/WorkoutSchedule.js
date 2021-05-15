import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';
import {workoutscheduleReducer,settings} from './states';
import { push } from 'connected-react-router';
import { cloneDeep,setLocalDate} from 'Helpers/helpers';


import {
GET_WORKOUTSCHEDULES,
SAVE_WORKOUTSCHEDULE,
OPEN_VIEW_WORKOUTSCHEDULE_MODEL,
OPEN_EDIT_WORKOUTSCHEDULE_MODEL,
DELETE_WORKOUTSCHEDULE,
SAVE_PHASE,
} from 'Actions/types';

import {
  getWorkoutSchedulesSuccess,
  saveWorkoutScheduleSuccess,
  savePhaseSuccess,
  viewWorkoutScheduleSuccess,
  editWorkoutScheduleSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';



/**
 * Send workout Schedule Request To Server
 */
const getWorkoutSchedulesRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "createdbydate" || x.id == "modifiedbydate" || x.id == "dateonWards" || x.id == "enddate" || x.id == "tilltodate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-schedules', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}
/**
 * Get workout schedule From Server
 */

export function* getWorkoutSchedulesFromServer() {
    try {
        const state = yield select(workoutscheduleReducer);
        const state1 = yield select(settings);
        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getWorkoutSchedulesRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getWorkoutSchedulesSuccess({data : response[0] , pages : response[1]}));
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
export function* getWorkoutSchedules() {
    yield takeEvery(GET_WORKOUTSCHEDULES, getWorkoutSchedulesFromServer);
}

/**
 * Send workout routine Save Request To Server
 */
const saveWorkoutRoutineRequest = function* (data)
{
  data = cloneDeep(data);
  data.workoutschedule.dateonWards = setLocalDate(data.workoutschedule.dateonWards);
  data.workoutschedule.tilltodate  = setLocalDate(data.workoutschedule.tilltodate );

    let response = yield api.post('save-schedule', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save workout routine From Server
 */
function* saveWorkoutRoutineFromServer(action) {
    try {
      let workoutschedule = cloneDeep(action.payload.workoutschedule);


      if(workoutschedule){
        workoutschedule.phases = workoutschedule.phases.map(x => {return {"routineid" :x.routineid,"noofweeks":x.noofweeks}});
		workoutschedule.phases[0].Isactive = 1;
      }
      const response = yield call(saveWorkoutRoutineRequest,{workoutschedule});
      if(!(response.errorMessage  || response.ORAT))
      {
          const {workoutschedule} = action.payload;
          if(workoutschedule.id && workoutschedule.id != 0)
          {
            yield put(requestSuccess("Workout Schedule updated successfully."));
          }
          else{
            yield put(requestSuccess("Workout Schedule created successfully."));
          }
              yield  put(saveWorkoutScheduleSuccess());
              yield call(getWorkoutSchedulesFromServer);

              yield put(push('/app/workouts/workout-schedule'));

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
export function* saveWorkoutSchedule() {
    yield takeEvery(SAVE_WORKOUTSCHEDULE, saveWorkoutRoutineFromServer);
}


/**
 * Send workout schedule VIEW Request To Server
 */
 const viewWorkoutScheduleRequest = function* (data)
 {
   let response = yield api.post('view-schedule', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW workout schedule From Server
 */
function* viewWorkoutScheduleFromServer(action) {
    try {
        const response = yield call(viewWorkoutScheduleRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {

           yield put(viewWorkoutScheduleSuccess({data : response[0]}));
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
/**
 * VIEW measurement
 */
export function* opnViewWorkoutScheduleModel() {
    yield takeEvery(OPEN_VIEW_WORKOUTSCHEDULE_MODEL, viewWorkoutScheduleFromServer);
}

/**
 * edit workoutschedule From Server
 */
function* editWorkoutScheduleFromServer(action) {
    try {
        const response = yield call(viewWorkoutScheduleRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(editWorkoutScheduleSuccess({data : response[0]}));
        }
        else {
               yield put(requestFailure(response.errorMessage  ));
             }
      } catch (error) {
          console.log(error);
      }
      finally
      {
      }
}
/**
 * Edit workoutschedule
 */
export function* opnEditWorkoutScheduleModel() {
    yield takeEvery(OPEN_EDIT_WORKOUTSCHEDULE_MODEL, editWorkoutScheduleFromServer);
}
/**
 * Send WorkoutSchedule Delete Request To Server
 */
const deleteWorkoutScheduleRequest = function* (data)
{  let response = yield api.post('delete-schedule', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete workout schedule From Server
 */
function* deleteWorkoutScheduleFromServer(action) {
    try {
        const response = yield call(deleteWorkoutScheduleRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Workout Schedule deleted successfully."));
          yield call(getWorkoutSchedulesFromServer);
    } else {
       yield put(requestFailure(response.errorMessage));
    }
  } catch (error) {
      console.log(error);
  }
  finally{
  }
}

/**
 * Get Employees
 */
export function* deleteWorkoutSchedule() {
    yield takeEvery(DELETE_WORKOUTSCHEDULE, deleteWorkoutScheduleFromServer);

}


/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getWorkoutSchedules),
      fork(saveWorkoutSchedule),
      fork(opnViewWorkoutScheduleModel),
      fork(opnEditWorkoutScheduleModel),
      fork(deleteWorkoutSchedule),
    ]);
}
