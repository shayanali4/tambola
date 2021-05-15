/**
* Member Management Actions
*/
import {
  OPEN_ADD_NEW_WORKOUTSCHEDULE_MODEL,
  OPEN_ADD_NEW_WORKOUTSCHEDULE_MODEL_SUCCESS,
  CLOSE_ADD_NEW_WORKOUTSCHEDULE_MODEL,

  GET_WORKOUTSCHEDULES,
  GET_WORKOUTSCHEDULE_SUCCESS,

  SAVE_WORKOUTSCHEDULE,
  SAVE_WORKOUTSCHEDULE_SUCCESS,

  OPEN_VIEW_WORKOUTSCHEDULE_MODEL,
  OPEN_VIEW_WORKOUTSCHEDULE_MODEL_SUCCESS,
  CLOSE_VIEW_WORKOUTSCHEDULE_MODEL,

  OPEN_EDIT_WORKOUTSCHEDULE_MODEL,
  OPEN_EDIT_WORKOUTSCHEDULE_MODEL_SUCCESS,

  DELETE_WORKOUTSCHEDULE,

  SAVE_PHASE,
  SAVE_PHASE_SUCCESS,

  OPEN_ADD_NEW_ALLOCATED_MEMBER_MODEL,
  CLOSE_ADD_NEW_ALLOCATED_MEMBER_MODEL,

  ON_NOTALLOCATEDMEMBERFILTER_CHANGE,

  OPEN_FILTER_WITH_WORKOUTENDDATE_MEMBER_MODEL,
  CLOSE_FILTER_WITH_WORKOUTENDDATE_MEMBER_MODEL
 } from './types';

 /**
  * Redux Action OPEN View WORKOUT SCHEDULE Model
  */
 export const opnAddNewWorkoutScheduleModel = (data) => ({
   type: OPEN_ADD_NEW_WORKOUTSCHEDULE_MODEL,
   payload: data
 });
 /**
  * Redux Action Open Model for new SCHEDULE
  */
 export const opnAddNewWorkoutScheduleModelSuccess = (response) => ({
     type: OPEN_ADD_NEW_WORKOUTSCHEDULE_MODEL_SUCCESS,
     payload: response
 });
 /**
  * Redux Action close View SCHEDULE Model
  */
 export const clsAddNewWorkoutScheduleModel = () => ({
     type: CLOSE_ADD_NEW_WORKOUTSCHEDULE_MODEL,
 });

 /**
  * Redux Action Get Employees
  */
 export const getWorkoutSchedules = (data) => ({
     type: GET_WORKOUTSCHEDULES,
     payload : data
 });

 /**
  * Redux Action Get Employees Success
  */
 export const getWorkoutSchedulesSuccess = (response) => ({
     type: GET_WORKOUTSCHEDULE_SUCCESS,
     payload: response
 });
 /**
  * Redux Action SAVE workoutschedule
  */
 export const saveWorkoutSchedule = (data) => ({
     type: SAVE_WORKOUTSCHEDULE,
     payload : data
 });
 /**
  * Redux Action SAVE workoutschedule SUCCESS
  */
 export const saveWorkoutScheduleSuccess = () => ({
     type: SAVE_WORKOUTSCHEDULE_SUCCESS,
 });
 /**
  * Redux Action Open Model to view WorkoutSchedule
  */
 export const opnViewWorkoutScheduleModel = (requestData) => ({
     type: OPEN_VIEW_WORKOUTSCHEDULE_MODEL,
       payload:requestData
 });
 /**
  * Redux Action Get WorkoutSchedule Success
  */
 export const viewWorkoutScheduleSuccess = (response) => ({
     type: OPEN_VIEW_WORKOUTSCHEDULE_MODEL_SUCCESS,
     payload: response
 });
 /**
  * Redux Action close View WorkoutSchedule Model
  */
 export const clsViewWorkoutScheduleModel = () => ({
     type: CLOSE_VIEW_WORKOUTSCHEDULE_MODEL
 });
 /**
  * Redux Action edit WorkoutSchedule  model
  */
 export const opnEditWorkoutScheduleModel = (requestData) => ({
     type: OPEN_EDIT_WORKOUTSCHEDULE_MODEL,
       payload:requestData
 });
 /**
  * Redux Action edit WorkoutSchedule Success
  */
 export const editWorkoutScheduleSuccess = (response) => ({
     type: OPEN_EDIT_WORKOUTSCHEDULE_MODEL_SUCCESS,
     payload: response
 });
 /**
  * Redux Action delete WorkoutSchedule
  */
 export const deleteWorkoutSchedule = (data) => ({
     type: DELETE_WORKOUTSCHEDULE,
     payload:data
 });
 /**
  * Redux Action SAVE phase
  */
 export const savePhase = (data) => ({
     type: SAVE_PHASE,
     payload : data
 });
 /**
  * Redux Action SAVE phase SUCCESS
  */
 export const savePhaseSuccess = () => ({
     type: SAVE_PHASE_SUCCESS,
 });

 /**
  * Redux Action OPEN ADD NEW ALLOCATED Member MODEL
  */
 export const opnAddNewAllocatedMemberModel = (data) => ({
   type: OPEN_ADD_NEW_ALLOCATED_MEMBER_MODEL,
   payload : data
 });
 /**
  * Redux Action close ADD NEW ALLOCATED Member MODEL
  */
 export const clsAddNewAllocatedMemberModel = () => ({
     type: CLOSE_ADD_NEW_ALLOCATED_MEMBER_MODEL,
 });
 /**
  * Redux Action ON NOT ALLOCATED MEMBER Filter CHANGE
  */
 export const onNotAllocatedMemberfilterChange = (key,value) => ({
    type: ON_NOTALLOCATEDMEMBERFILTER_CHANGE,
    payload: { key,value }
 });


 /**
  * Redux Action OPEN ADD NEW ALLOCATED Member MODEL
  */
 export const opnFilterWithWorkoutEndDateMemberModel = (data) => ({
   type: OPEN_FILTER_WITH_WORKOUTENDDATE_MEMBER_MODEL,
   payload : data
 });
 /**
  * Redux Action close ADD NEW ALLOCATED Member MODEL
  */
 export const clsFilterWithWorkoutEndDateMemberModel = () => ({
     type: CLOSE_FILTER_WITH_WORKOUTENDDATE_MEMBER_MODEL,
 });
