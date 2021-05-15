/**
* Member Management Actions
*/
import {
   OPEN_ADD_NEW_WORKOUTROUTINE_MODEL,
   CLOSE_ADD_NEW_WORKOUTROUTINE_MODEL,

   GET_WORKOUTROUTINES,
   GET_WORKOUTROUTINE_SUCCESS,

   SAVE_WORKOUTROUTINE,
   SAVE_WORKOUTROUTINE_SUCCESS,

   DELETE_WORKOUTROUTINE,

   OPEN_EDIT_WORKOUTROUTINE_MODEL,
   OPEN_EDIT_WORKOUTROUTINE_MODEL_SUCCESS,

   OPEN_VIEW_WORKOUTROUTINE_MODEL,
   OPEN_VIEW_WORKOUTROUTINE_MODEL_SUCCESS,
   CLOSE_VIEW_WORKOUTROUTINE_MODEL,

   // routine day

   OPEN_ADD_NEW_WORKOUTROUTINEDAY_MODEL,
   CLOSE_ADD_NEW_WORKOUTROUTINEDAY_MODEL,

   SAVE_WORKOUTROUTINEDAY,
   SAVE_WORKOUTROUTINEDAY_SUCCESS,

   OPEN_EDIT_WORKOUTROUTINEDAY_MODEL,
   OPEN_EDIT_WORKOUTROUTINEDAY_MODEL_SUCCESS,

   DELETE_WORKOUTROUTINEDAY,

   SAVE_WORKOUEXERCISE,
   SAVE_WORKOUTEXERCISE_SUCCESS
 } from './types';

 /**
  * Redux Action Open Model for new routine
  */
 export const opnAddNewWorkoutRoutinerModel = () => ({
     type: OPEN_ADD_NEW_WORKOUTROUTINE_MODEL
 });

 /**
  * Redux Action close New routine Model
  */
 export const clsAddNewWorkoutRoutineModel = () => ({
     type: CLOSE_ADD_NEW_WORKOUTROUTINE_MODEL
 });
 /**
  * Redux Action Get routines
  */
 export const getWorkoutRoutines = (data) => ({
     type: GET_WORKOUTROUTINES,
     payload : data
 });


 /**
  * Redux Action Get routines Success
  */
 export const getWorkoutRoutinesSuccess = (response) => ({
     type: GET_WORKOUTROUTINE_SUCCESS,
     payload: response
 });


 /**
  * Redux Action SAVE routines
  */
 export const saveWorkoutRoutine = (data) => ({
     type: SAVE_WORKOUTROUTINE,
     payload : data
 });
 /**
  * Redux Action SAVE routines SUCCESS
  */

 export const saveWorkoutRoutineSuccess = () => ({
     type: SAVE_WORKOUTROUTINE_SUCCESS,
 });
 /**
  * Redux Action Open Model to view WorkoutRoutine
  */
 export const opnViewWorkoutRoutineModel = (requestData) => ({
     type: OPEN_VIEW_WORKOUTROUTINE_MODEL,
     payload: requestData
 });
 /**
  * Redux Action Get WorkoutRoutine Success
  */
 export const viewWorkoutRoutineSuccess = (response) => ({
     type: OPEN_VIEW_WORKOUTROUTINE_MODEL_SUCCESS,
     payload: response
 });
 /**
  * Redux Action CLOSE VIEW MODEL
  */
 export const clsViewWorkoutRoutineModel = () => ({
     type: CLOSE_VIEW_WORKOUTROUTINE_MODEL
 });

 /**
  * Redux Action Open Model to edit WorkoutRoutine
  */
 export const opnEditWorkoutRoutineModel = (requestData) => ({
     type: OPEN_EDIT_WORKOUTROUTINE_MODEL,
     payload:requestData
 });
 /**
  * Redux Action Get WorkoutRoutine Success
  */
 export const editWorkoutRoutineSuccess = (response) => ({
     type: OPEN_EDIT_WORKOUTROUTINE_MODEL_SUCCESS,
     payload: response
 });

 /**
  * Redux Action Delete WorkoutRoutine
  */
 export const deleteWorkoutRoutine = (data) => ({
     type: DELETE_WORKOUTROUTINE,
     payload:data
 });

// workout routine days
/**
 * Redux Action Open Model for new workout routine day
 */
export const opnAddNewWorkoutRoutineDayModel = () => ({
    type: OPEN_ADD_NEW_WORKOUTROUTINEDAY_MODEL
});

/**
 * Redux Action close New Member Model
 */
export const clsAddNewWorkoutRoutineDayModel = () => ({
    type: CLOSE_ADD_NEW_WORKOUTROUTINEDAY_MODEL
});
/**
 * Redux Action SAVE routineday
 */
export const saveWorkoutRoutineDay = (data) => ({
    type: SAVE_WORKOUTROUTINEDAY,
    payload : data
});
/**
 * Redux Action SAVE routineday SUCCESS
 */

export const saveWorkoutRoutineDaySuccess = () => ({
    type: SAVE_WORKOUTROUTINEDAY_SUCCESS,
});
/**
 * Redux Action Open Model to edit WorkoutRoutine
 */
export const opnEditWorkoutRoutineDayModel = (requestData) => ({
    type: OPEN_EDIT_WORKOUTROUTINEDAY_MODEL,
    payload:requestData
});

/**
 * Redux Action Delete WorkoutRoutine
 */
export const deleteWorkoutRoutineDay = (data) => ({
    type: DELETE_WORKOUTROUTINEDAY,
    payload:data
});
/**
 * Redux Action SAVE workout exercise
 */
export const saveWorkoutExercise = (data) => ({
    type: SAVE_WORKOUEXERCISE,
    payload : data
});
/**
 * Redux Action SAVE workout exercise SUCCESS
 */

export const saveWorkoutExerciseSuccess = () => ({
    type: SAVE_WORKOUTEXERCISE_SUCCESS,
});
