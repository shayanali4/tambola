/**
* Member Management Actions
*/
import {
  GET_MEMBER_WORKOUT_SCHEDULE,
  GET_MEMBER_WORKOUT_SCHEDULE_SUCCESS,
  OPEN_MEMBER_VIEW_WORKOUT_SCHEDULE_MODEL,
  OPEN_MEMBER_VIEW_WORKOUT_SCHEDULE_MODEL_SUCCESS,
  CLOSE_MEMBER_VIEW_WORKOUT_SCHEDULE_MODEL,
  SAVE_MEMBER_PHASE,
  SAVE_MEMBER_PHASE_SUCCESS
} from '../types';

 export const getMemberWorkoutSchedule = (data) => ({
     type: GET_MEMBER_WORKOUT_SCHEDULE,
     payload : data
 });


 export const getMemberWorkoutScheduleSuccess = (response) => ({
     type: GET_MEMBER_WORKOUT_SCHEDULE_SUCCESS,
     payload: response
 });

 export const opnMemberViewWorkoutScheduleModel = (requestData) => ({
     type: OPEN_MEMBER_VIEW_WORKOUT_SCHEDULE_MODEL,
       payload:requestData
 });

 export const viewMemberWorkoutScheduleSuccess = (response) => ({
     type: OPEN_MEMBER_VIEW_WORKOUT_SCHEDULE_MODEL_SUCCESS,
     payload: response
 });

 export const clsMemberViewWorkoutScheduleModel = () => ({
     type: CLOSE_MEMBER_VIEW_WORKOUT_SCHEDULE_MODEL
 });
 /**
  * Redux Action SAVE phase
  */
 export const savememberPhase = (data) => ({
     type: SAVE_MEMBER_PHASE,
     payload : data
 });
 /**
  * Redux Action SAVE phase SUCCESS
  */
 export const savememberPhaseSuccess = () => ({
     type: SAVE_MEMBER_PHASE_SUCCESS,
 });
