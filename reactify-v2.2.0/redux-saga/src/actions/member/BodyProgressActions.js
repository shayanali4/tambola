/**
* Member Management Actions
*/
import {
  OPEN_MEMBER_ADD_NEW_BODY_PROGRESS_MODEL,
  CLOSE_MEMBER_ADD_NEW_BODY_PROGRESS_MODEL,

  GET_BODY_PROGRESS,
  GET_BODY_PROGRESS_SUCCESS,

  SAVE_BODY_MEASUREMENT,
  SAVE_BODY_MEASUREMENT_SUCCESS,

  OPEN_MEMBER_VIEW_BODY_PROGRESS_CHART_MODEL,
  CLOSE_MEMBER_VIEW_BODY_PROGRESS_CHART_MODEL,

  OPEN_MEMBER_VIEW_INBODY_PROGRESS_CHART_MODEL,
  CLOSE_MEMBER_VIEW_INBODY_PROGRESS_CHART_MODEL
 } from '../types';

 /**
  * Redux Action OPEN member  body progress Model
  */
 export const opnmemberAddNewBodyProgressModel = (data) => ({
   type: OPEN_MEMBER_ADD_NEW_BODY_PROGRESS_MODEL,
   payload:data
 });

 /**
  * Redux Action close View service Model
  */
 export const clsmemberAddNewBodyProgressModel = () => ({
     type: CLOSE_MEMBER_ADD_NEW_BODY_PROGRESS_MODEL,
 });

 export const getbodyprogress = (requestData) => ({
     type: GET_BODY_PROGRESS,
     payload:requestData
 });


 export const getbodyprogressSuccess = (response) => ({
     type: GET_BODY_PROGRESS_SUCCESS,
     payload:response
 });

 /**
  * Redux Action SAVE BODY MEASUREMENT
  */
 export const saveBodyMeasurement = (data) => ({
     type: SAVE_BODY_MEASUREMENT,
     payload : data
 });
 /**
  * Redux Action SAVE BODY MEASUREMENT SUCCESS
  */
 export const saveBodyMeasurementSuccess = () => ({
     type: SAVE_BODY_MEASUREMENT_SUCCESS,
 });

 export const opnmemberViewBodyProgressChartModel = () => ({
   type: OPEN_MEMBER_VIEW_BODY_PROGRESS_CHART_MODEL,
 });

 export const clsmemberViewBodyProgressChartModel = () => ({
     type: CLOSE_MEMBER_VIEW_BODY_PROGRESS_CHART_MODEL,
 });

 export const opnmemberViewInBodyProgressChartModel = () => ({
   type: OPEN_MEMBER_VIEW_INBODY_PROGRESS_CHART_MODEL,
 });

 export const clsmemberViewInBodyProgressChartModel = () => ({
     type: CLOSE_MEMBER_VIEW_INBODY_PROGRESS_CHART_MODEL,
 });
