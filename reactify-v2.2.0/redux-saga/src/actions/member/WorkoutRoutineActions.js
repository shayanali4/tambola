/**
* Member Management Actions
*/
import {
   GET_MEMBER_WORKOUT_ROUTINE,
   GET_MEMBER_WORKOUT_ROUTINE_SUCCESS,
   OPEN_MEMBER_ADD_NEW_WORKOUT_ROUTINE_MODEL,
   CLOSE_MEMBER_ADD_NEW_WORKOUT_ROUTINE_MODEL,
   SAVE_MEMBER_WORKOUT_ROUTINE,
   SAVE_MEMBER_WORKOUT_ROUTINE_SUCCESS,
   OPEN_MEMBER_EDIT_WORKOUT_ROUTINE_MODEL,
   OPEN_MEMBER_EDIT_WORKOUT_ROUTINE_MODEL_SUCCESS,
   OPEN_MEMBER_VIEW_WORKOUT_ROUTINE_MODEL,
   OPEN_MEMBER_VIEW_WORKOUT_ROUTINE_MODEL_SUCCESS,
   CLOSE_MEMBER_VIEW_WORKOUT_ROUTINE_MODEL,
   DELETE_MEMBER_WORKOUT_ROUTINE,
   OPEN_MEMBER_ADD_NEW_WORKOUT_ROUTINE_DAY_MODEL,
   CLOSE_MEMBER_ADD_NEW_WORKOUT_ROUTINE_DAY_MODEL,
   SAVE_MEMBER_WORKOUT_ROUTINE_DAY,
   SAVE_MEMBER_WORKOUT_ROUTINE_DAY_SUCCESS,
   OPEN_MEMBER_EDIT_WORKOUT_ROUTINE_DAY_MODEL,
   DELETE_MEMBER_WORKOUT_ROUTINE_DAY,
   SAVE_MEMBER_WORKOUTEXERCISE,
   SAVE_MEMBER_WORKOUTEXERCISE_SUCCESS,
   SAVE_MEMBER_WORKOUT_ROUTINE_ACTIVE,
   SAVE_MEMBER_WORKOUT_ROUTINE_ACTIVE_SUCCESS
 } from '../types';


 /**
  * Redux Action Get routines
  */
 export const getMemberWorkoutRoutine = (data) => ({
     type: GET_MEMBER_WORKOUT_ROUTINE,
     payload : data
 });


 /**
  * Redux Action Get routines Success
  */
 export const getMemberWorkoutRoutinesSuccess = (response) => ({
     type: GET_MEMBER_WORKOUT_ROUTINE_SUCCESS,
     payload: response
 });

 /**
  * Redux Action open New routine Model
  */

 export const opnMemberAddNewWorkoutRoutinerModel = () => ({
     type: OPEN_MEMBER_ADD_NEW_WORKOUT_ROUTINE_MODEL
 });

 /**
  * Redux Action close New routine Model
  */
 export const clsMemberAddNewWorkoutRoutineModel = () => ({
     type: CLOSE_MEMBER_ADD_NEW_WORKOUT_ROUTINE_MODEL
 });

 /**
  * Redux Action SAVE routines
  */

 export const saveMemberWorkoutRoutine = (data) => ({
     type: SAVE_MEMBER_WORKOUT_ROUTINE,
     payload : data
 });
 /**
  * Redux Action SAVE routines SUCCESS
  */

 export const saveMemberWorkoutRoutineSuccess = () => ({
     type: SAVE_MEMBER_WORKOUT_ROUTINE_SUCCESS,
 });

 export const opnMemberEditWorkoutRoutineModel = (requestData) => ({
     type: OPEN_MEMBER_EDIT_WORKOUT_ROUTINE_MODEL,
     payload:requestData
 });
 /**
  * Redux Action Get WorkoutRoutine Success
  */
 export const editMemberWorkoutRoutineSuccess = (response) => ({
     type: OPEN_MEMBER_EDIT_WORKOUT_ROUTINE_MODEL_SUCCESS,
     payload: response
 });

 export const opnMemberViewWorkoutRoutineModel = (requestData) => ({
     type: OPEN_MEMBER_VIEW_WORKOUT_ROUTINE_MODEL,
     payload: requestData
 });
 /**
  * Redux Action Get WorkoutRoutine Success
  */
 export const viewMemberWorkoutRoutineSuccess = (response) => ({
     type: OPEN_MEMBER_VIEW_WORKOUT_ROUTINE_MODEL_SUCCESS,
     payload: response
 });
 /**
  * Redux Action CLOSE VIEW MODEL
  */
 export const clsMemberViewWorkoutRoutineModel = () => ({
     type: CLOSE_MEMBER_VIEW_WORKOUT_ROUTINE_MODEL
 });

 export const deleteMemberWorkoutRoutine = (data) => ({
     type: DELETE_MEMBER_WORKOUT_ROUTINE,
     payload:data
 });

 export const opnMemberAddNewWorkoutRoutineDayModel = () => ({
     type: OPEN_MEMBER_ADD_NEW_WORKOUT_ROUTINE_DAY_MODEL
 });

 export const clsMemberAddNewWorkoutRoutineDayModel = () => ({
     type: CLOSE_MEMBER_ADD_NEW_WORKOUT_ROUTINE_DAY_MODEL
 });

 export const saveMemberWorkoutRoutineDay = (data) => ({
     type: SAVE_MEMBER_WORKOUT_ROUTINE_DAY,
     payload : data
 });

 export const saveMemberWorkoutRoutineDaySuccess = () => ({
     type: SAVE_MEMBER_WORKOUT_ROUTINE_DAY_SUCCESS,
 });

 export const opnMemberEditWorkoutRoutineDayModel = (requestData) => ({
     type: OPEN_MEMBER_EDIT_WORKOUT_ROUTINE_DAY_MODEL,
     payload:requestData
 });

 export const deleteMemberWorkoutRoutineDay = (data) => ({
     type: DELETE_MEMBER_WORKOUT_ROUTINE_DAY,
     payload:data
 });

 export const saveMemberWorkoutExercise = (data) => ({
     type: SAVE_MEMBER_WORKOUTEXERCISE,
     payload : data
 });

 export const saveMemberWorkoutExerciseSuccess = () => ({
     type: SAVE_MEMBER_WORKOUTEXERCISE_SUCCESS,
 });
 export const saveMemberWorkoutRoutineActive = (data) => ({
     type: SAVE_MEMBER_WORKOUT_ROUTINE_ACTIVE,
     payload : data
 });

 export const saveMemberWorkoutRoutineActiveSuccess = () => ({
     type: SAVE_MEMBER_WORKOUT_ROUTINE_ACTIVE_SUCCESS,
 });
