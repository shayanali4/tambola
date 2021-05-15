/**
 * Employee Management Sagas
 */
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import FormData from 'form-data';
import {workoutroutineReducer} from './states';
import { push } from 'connected-react-router';
import { cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api, {fileUploadConfig} from 'Api';

import {
  GET_WORKOUTROUTINES,
  SAVE_WORKOUTROUTINE,
  OPEN_EDIT_WORKOUTROUTINE_MODEL,
  OPEN_VIEW_WORKOUTROUTINE_MODEL,
  DELETE_WORKOUTROUTINE,

  // workout routine day
  SAVE_WORKOUTROUTINEDAY,
  DELETE_WORKOUTROUTINEDAY,

  //workout exercise
  SAVE_WORKOUEXERCISE
} from 'Actions/types';

import {
    getWorkoutRoutinesSuccess,
    saveWorkoutRoutineSuccess,
    viewWorkoutRoutineSuccess,
    editWorkoutRoutineSuccess,


    //workout routine days
    saveWorkoutRoutineDaySuccess,

  //workout exercise
    saveWorkoutExerciseSuccess,

    requestSuccess,
    requestFailure,
    showLoader,
    hideLoader
} from 'Actions';

/**
 * Send workoutroutine  Request To Server
 */
const getWorkoutRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "createdbydate" || x.id == "modifiedbydate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-workoutroutines', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}
/**
 * Get workoutroutines From Server
 */

function* getWorkoutsFromServer() {
    try {
        const state = yield select(workoutroutineReducer);
        const response = yield call(getWorkoutRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getWorkoutRoutinesSuccess({data : response[0] , pages : response[1]}));
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
 * Get workoutroutine
 */
export function* getWorkoutRoutines() {
    yield takeEvery(GET_WORKOUTROUTINES, getWorkoutsFromServer);
}
/**
 * Send workoutroutine Save Request To Server
 */
const saveWorkoutRoutineRequest = function* (data)
{
    let response = yield api.post('save-workoutroutine',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save workoutroutine From Server
 */
function* saveWorkoutRoutineFromServer(action) {
    try {
      const state = yield select(workoutroutineReducer);
      if(state.clone == true){
            action.payload.workoutroutine.id = 0;
            action.payload.workoutroutine.workoutroutinedetail = state.editworkoutroutine.workoutroutinedetail;
          }
        const response = yield call(saveWorkoutRoutineRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            const {workoutroutine} = action.payload;
            if(workoutroutine.id  != 0)
            {
              yield put(requestSuccess("Workout Routine updated successfully."));
            }
            else {
              yield put(requestSuccess("Workout Routine created successfully."));
            }
            yield  put(saveWorkoutRoutineSuccess());
            yield call(getWorkoutsFromServer);
             yield put(push('/app/workouts/workout-routine'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 * Get Employees
 */
export function* saveWorkoutRoutine() {
    yield takeEvery(SAVE_WORKOUTROUTINE, saveWorkoutRoutineFromServer);
}
/**
 * Send workoutroutine VIEW Request To Server
 */
 const viewWorkoutRoutineRequest = function* (data)
 {  let response = yield api.post('view-workoutroutine', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }
/**
 * VIEW WorkoutRoutine From Server
 */
function* viewWorkoutRoutineFromServer(action) {
    try {
        const response = yield call(viewWorkoutRoutineRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewWorkoutRoutineSuccess({data : response[0]}));
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
 * VIEW WorkoutRoutine
 */
export function* opnViewWorkoutRoutineModel() {
    yield takeEvery(OPEN_VIEW_WORKOUTROUTINE_MODEL, viewWorkoutRoutineFromServer);
}


/**
 * Edit WorkoutRoutine From Server
 */
function* editWorkoutRoutineFromServer(action) {
    try {

        const response = yield call(viewWorkoutRoutineRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(editWorkoutRoutineSuccess({data : response[0]}));
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
 * Edit workoutroutines
 */
export function* opnEditWorkoutRoutineModel() {
    yield takeEvery(OPEN_EDIT_WORKOUTROUTINE_MODEL, editWorkoutRoutineFromServer);
}

/**
 * Send Employee Delete Request To Server
 */
const deleteWorkoutRoutineRequest = function* (data)
{  let response = yield api.post('delete-workoutroutine', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete Employee From Server
 */
 function* deleteWorkoutRoutineFromServer(action) {
     try {

       const response = yield call(deleteWorkoutRoutineRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Workout Routine deleted successfully."));
             yield call(getWorkoutsFromServer);
        }
        else {
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
export function* deleteWorkoutRoutine() {
    yield takeEvery(DELETE_WORKOUTROUTINE, deleteWorkoutRoutineFromServer);
}


// workout routine days

/**
 * Send workoutroutine day Save Request To Server
 */
const saveWorkoutRoutineDayRequest = function* (data)
{
    let response = yield api.post('save-workoutdetail',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save workoutroutine day From Server
 */
function* saveWorkoutRoutineDayFromServer(action) {
    try {

        const {workoutroutineday} = action.payload;
        const state = yield select(workoutroutineReducer);
        let  selectedworkoutroutine = state.selectedworkoutroutine;
        let  {id, workoutroutinedetail} = selectedworkoutroutine;
        workoutroutinedetail = workoutroutinedetail || [];

        let workoutroutineday_id;

        if(workoutroutineday.id  > 0 && workoutroutinedetail.filter(x => x.id == workoutroutineday.id).length > 0)
        {
              let objIndex = workoutroutinedetail.findIndex(x => x.id == workoutroutineday.id);
              workoutroutinedetail[objIndex].workoutdayname = workoutroutineday.workoutdayname;
              workoutroutinedetail[objIndex].workoutdays = workoutroutineday.workoutdays;
                workoutroutinedetail[objIndex].description = workoutroutineday.description;
        }
        else {
          workoutroutineday_id = workoutroutinedetail.length
            workoutroutinedetail.filter(x => x.id > workoutroutineday_id).map(x => {if(x.id > workoutroutineday_id) { workoutroutineday_id = x.id;  } });
            workoutroutineday.id = workoutroutineday_id + 1;
          workoutroutinedetail.push(workoutroutineday);
        }
        let  newworkoutroutinedetail = workoutroutinedetail;
        const response = yield call(saveWorkoutRoutineDayRequest, {id, newworkoutroutinedetail});
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(saveWorkoutRoutineDaySuccess());

            if(!workoutroutineday_id)
            {
              yield put(requestSuccess("Workout Routine Day updated successfully."));
            }
            else {
              yield put(requestSuccess("Workout Routine Day created successfully."));
            }
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 * save workoutroutineday
 */
export function* saveWorkoutRoutineDay() {
    yield takeEvery(SAVE_WORKOUTROUTINEDAY, saveWorkoutRoutineDayFromServer);
}
/**
 * save workoutroutine exercise  From Server
 */
function* saveWorkoutExerciseFromServer(action) {
    try {
        const {workoutroutineday} = action.payload;
        const state = yield select(workoutroutineReducer);
        let  selectedworkoutroutine = state.selectedworkoutroutine;
        let  {id, workoutroutinedetail} = selectedworkoutroutine;
        let  newworkoutroutinedetail = cloneDeep(workoutroutinedetail || []);
       if(newworkoutroutinedetail.length > 0){
         newworkoutroutinedetail.forEach(x => {x.exerciselist ? x.exerciselist.forEach(y => {y.exercisename = "",y.recordtype = "",y.recordtypeId = "",y.workoutcategory = ""}) : null});
       }
        const response = yield call(saveWorkoutRoutineDayRequest, {id, newworkoutroutinedetail});
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(saveWorkoutExerciseSuccess());

              yield put(requestSuccess("Workout Routine Exercise updated successfully."));
       }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 * save workoutroutine exercise
 */
export function* saveWorkoutExercise() {
    yield takeEvery(SAVE_WORKOUEXERCISE, saveWorkoutExerciseFromServer);
}

/**
 * save workoutroutine day From Server
 */
function* deleteWorkoutRoutineDayFromServer(action) {
    try {
        const workoutroutineday = action.payload;
        const state = yield select(workoutroutineReducer);
        let  selectedworkoutroutine = state.selectedworkoutroutine;
        let  {id, workoutroutinedetail} = selectedworkoutroutine;
        workoutroutinedetail = workoutroutinedetail || [];


        const Workoutroutine = workoutroutinedetail.indexOf(workoutroutineday);
        if(Workoutroutine !=-1){

               workoutroutinedetail.splice(Workoutroutine, 1);
           }
           let  newworkoutroutinedetail = workoutroutinedetail;
        const response = yield call(saveWorkoutRoutineDayRequest, {id, newworkoutroutinedetail});
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Workout Routine Day deleted successfully."));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 * save workoutroutineday
 */
export function* deleteWorkoutRoutineDay() {
    yield takeEvery(DELETE_WORKOUTROUTINEDAY, deleteWorkoutRoutineDayFromServer);
}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getWorkoutRoutines),
        fork(saveWorkoutRoutine),
        fork(opnViewWorkoutRoutineModel),
        fork(opnEditWorkoutRoutineModel),
        fork(deleteWorkoutRoutine),

        // workout routine days
        fork(saveWorkoutRoutineDay),
        fork(deleteWorkoutRoutineDay),

        //workout exercise
        fork(saveWorkoutExercise)
    ]);
}
