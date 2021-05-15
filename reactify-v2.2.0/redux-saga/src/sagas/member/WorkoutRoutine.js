/**
 * Employee Management Sagas
 */
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import FormData from 'form-data';
import {memberWorkoutRoutineReducer} from '../states';
import { push } from 'connected-react-router';
import { cloneDeep} from 'Helpers/helpers';

// api
import api, {fileUploadConfig} from 'Api';

import {
  GET_MEMBER_WORKOUT_ROUTINE,
  SAVE_MEMBER_WORKOUT_ROUTINE,
  OPEN_MEMBER_EDIT_WORKOUT_ROUTINE_MODEL,
  OPEN_MEMBER_VIEW_WORKOUT_ROUTINE_MODEL,
  DELETE_MEMBER_WORKOUT_ROUTINE,
  SAVE_MEMBER_WORKOUT_ROUTINE_DAY,
  DELETE_MEMBER_WORKOUT_ROUTINE_DAY,
  SAVE_MEMBER_WORKOUTEXERCISE,
  SAVE_MEMBER_WORKOUT_ROUTINE_ACTIVE
} from 'Actions/types';

import {
    getMemberWorkoutRoutinesSuccess,
    saveMemberWorkoutRoutineSuccess,
    editMemberWorkoutRoutineSuccess,
    viewMemberWorkoutRoutineSuccess,
    saveMemberWorkoutRoutineDaySuccess,
    saveMemberWorkoutExerciseSuccess,
    saveMemberWorkoutRoutineActiveSuccess,
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
  let response = yield  api.post('get-member-workoutroutine', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}
/**
 * Get workoutroutines From Server
 */

function* getWorkoutsFromServer() {
    try {
        const state = yield select(memberWorkoutRoutineReducer);
        const response = yield call(getWorkoutRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getMemberWorkoutRoutinesSuccess({data : response[0] , pages : response[1]}));
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
export function* getMemberWorkoutRoutine() {
    yield takeEvery(GET_MEMBER_WORKOUT_ROUTINE, getWorkoutsFromServer);
}


 const saveWorkoutRoutineRequest = function* (data)
 {
     let response = yield api.post('save-member-workoutroutine',data)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }

 function* saveWorkoutRoutineFromServer(action) {
     try {

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
             yield  put(saveMemberWorkoutRoutineSuccess());
             yield call(getWorkoutsFromServer);
               yield put(push('/member-app/workout-routine'));
         }
         else {
           yield put(requestFailure(response.errorMessage));
         }

     } catch (error) {
         console.log(error);
     }
 }

 export function* saveMemberWorkoutRoutine() {
     yield takeEvery(SAVE_MEMBER_WORKOUT_ROUTINE, saveWorkoutRoutineFromServer);
 }

 function* editWorkoutRoutineFromServer(action) {
     try {

         const response = yield call(viewWorkoutRoutineRequest,action.payload);
         if(!(response.errorMessage  || response.ORAT))
         {
             yield put(editMemberWorkoutRoutineSuccess({data : response[0]}));
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
 export function* opnMemberEditWorkoutRoutineModel() {
     yield takeEvery(OPEN_MEMBER_EDIT_WORKOUT_ROUTINE_MODEL, editWorkoutRoutineFromServer);
 }

 const viewWorkoutRoutineRequest = function* (data)
 {  let response = yield api.post('view-member-workoutroutine', data)
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
            yield put(viewMemberWorkoutRoutineSuccess({data : response[0]}));
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
 export function* opnMemberViewWorkoutRoutineModel() {
    yield takeEvery(OPEN_MEMBER_VIEW_WORKOUT_ROUTINE_MODEL, viewWorkoutRoutineFromServer);
 }

 const deleteWorkoutRoutineRequest = function* (data)
 {  let response = yield api.post('delete-member-workoutroutine', data)
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
 export function* deleteMemberWorkoutRoutine() {
     yield takeEvery(DELETE_MEMBER_WORKOUT_ROUTINE, deleteWorkoutRoutineFromServer);
 }

 const saveWorkoutRoutineDayRequest = function* (data)
 {
     let response = yield api.post('save-member-workoutdetail',data)
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
         const state = yield select(memberWorkoutRoutineReducer);
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
             yield put(saveMemberWorkoutRoutineDaySuccess());

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
 export function* saveMemberWorkoutRoutineDay() {
     yield takeEvery(SAVE_MEMBER_WORKOUT_ROUTINE_DAY, saveWorkoutRoutineDayFromServer);
 }

 function* deleteWorkoutRoutineDayFromServer(action) {
     try {
         const workoutroutineday = action.payload;
         const state = yield select(memberWorkoutRoutineReducer);
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
 export function* deleteMemberWorkoutRoutineDay() {
     yield takeEvery(DELETE_MEMBER_WORKOUT_ROUTINE_DAY, deleteWorkoutRoutineDayFromServer);
 }

 function* saveWorkoutExerciseFromServer(action) {
     try {
         const {workoutroutineday} = action.payload;
         const state = yield select(memberWorkoutRoutineReducer);
         let  selectedworkoutroutine = state.selectedworkoutroutine;
         let  {id, workoutroutinedetail} = selectedworkoutroutine;
         workoutroutinedetail = workoutroutinedetail || [];
         workoutroutinedetail &&  workoutroutinedetail.forEach((x,key) =>
             {
                 x.workoutStarted = false;
             });
             let  newworkoutroutinedetail = cloneDeep(workoutroutinedetail || []);
            if(newworkoutroutinedetail.length > 0){
              newworkoutroutinedetail.forEach(x => {x.exerciselist ? x.exerciselist.forEach(y => {y.exercisename = "",y.recordtype = "",y.recordtypeId = "",y.workoutcategory = ""}) : null});
            }
         const response = yield call(saveWorkoutRoutineDayRequest, {id, newworkoutroutinedetail});
         if(!(response.errorMessage  || response.ORAT))
         {
             yield put(saveMemberWorkoutExerciseSuccess());

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
 export function* saveMemberWorkoutExercise() {
     yield takeEvery(SAVE_MEMBER_WORKOUTEXERCISE, saveWorkoutExerciseFromServer);
 }

 const saveWorkoutRoutineActiveRequest = function* (data)
 {
     let response = yield api.post('save-member-workout-routine-active',data)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }

 function* saveWorkoutRoutineActiveFromServer(action) {
     try {
         const response = yield call(saveWorkoutRoutineActiveRequest,action.payload);
         if(!(response.errorMessage  || response.ORAT))
         {
           const {Isactive} = action.payload;
           if(Isactive == 1 )
           {
               yield put(requestSuccess(" Workout Routine Active successfully."));
            }
             else {
               yield put(requestSuccess(" Workout Routine Inactive successfully."));
             }
               yield  put(saveMemberWorkoutRoutineActiveSuccess());
               yield call(getWorkoutsFromServer);
         }
         else {
           yield put(requestFailure(response.errorMessage));
         }

     } catch (error) {
         console.log(error);
     }
 }

 export function* saveMemberWorkoutRoutineActive() {
     yield takeEvery(SAVE_MEMBER_WORKOUT_ROUTINE_ACTIVE, saveWorkoutRoutineActiveFromServer);
 }

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getMemberWorkoutRoutine),
        fork(saveMemberWorkoutRoutine),
        fork(opnMemberEditWorkoutRoutineModel),
        fork(opnMemberViewWorkoutRoutineModel),
        fork(deleteMemberWorkoutRoutine),
        fork(saveMemberWorkoutRoutineDay),
        fork(deleteMemberWorkoutRoutineDay),
        fork(saveMemberWorkoutExercise),
        fork(saveMemberWorkoutRoutineActive)
    ]);
}
