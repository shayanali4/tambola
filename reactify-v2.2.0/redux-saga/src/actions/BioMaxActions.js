/**
 * class Actions
 */
import {

  OPEN_VIEW_BIOMAX_MODEL,
  CLOSE_VIEW_BIOMAX_MODEL,
  GET_BIOMAX_MEMBERS,
  GET_BIOMAX_MEMBERS_SUCCESS,
  GET_BIOMAX_MEMBERS_LOGS,
  GET_BIOMAX_MEMBERS_LOGS_SUCCESS,

  GET_BIOMAX_USERS,
  GET_BIOMAX_USERS_SUCCESS,
  GET_BIOMAX_USERS_LOGS,
  GET_BIOMAX_USERS_LOGS_SUCCESS,

  GET_BIOMAX_UNAUTHORISED_LOGS,
  GET_BIOMAX_UNAUTHORISED_LOGS_SUCCESS,

  BIOMAX_HANDLE_CHANGE_SELECT_ALL,
  BIOMAX_HANDLE_SINGLE_CHECKBOX_CHANGE,

  USER_BIOMAX_HANDLE_CHANGE_SELECT_ALL,
  USER_BIOMAX_HANDLE_SINGLE_CHECKBOX_CHANGE


  } from './types';

   /**
    * Redux Action Open Model to view Enquiry
    */
   export const opnViewBioMaxmodel = (data) => ({
       type: OPEN_VIEW_BIOMAX_MODEL,
         payload:data
   });
   /**
    * Redux Action close View Enquiry Model
    */
   export const clsViewBioMaxModel = () => ({
       type: CLOSE_VIEW_BIOMAX_MODEL
   });
   /**
    * Redux Action Get branches
    */
   export const getBiomaxMembers = (data) => ({
       type: GET_BIOMAX_MEMBERS,
       payload : data
   });

   /**
    * Redux Action Get branches Success
    */
   export const getBiomaxMembersSuccess = (response) => ({
       type: GET_BIOMAX_MEMBERS_SUCCESS,
       payload: response
   });


   /**
    * Redux Action Get branches
    */
   export const getBiomaxMembersLogs = (data) => ({
       type: GET_BIOMAX_MEMBERS_LOGS,
       payload : data
   });

   /**
    * Redux Action Get branches Success
    */
   export const getBiomaxMembersLogsSuccess = (response) => ({
       type: GET_BIOMAX_MEMBERS_LOGS_SUCCESS,
       payload: response
   });



   /**
    * Redux Action Get BIOMAX USERS
    */
   export const getBiomaxUsers = (data) => ({
       type: GET_BIOMAX_USERS,
       payload : data
   });

   /**
    * Redux Action BIOMAX USERS Success
    */
   export const getBiomaxUsersSuccess = (response) => ({
       type: GET_BIOMAX_USERS_SUCCESS,
       payload: response
   });


   /**
    * Redux Action BIOMAX USERS LOGS
    */
   export const getBiomaxUsersLogs = (data) => ({
       type: GET_BIOMAX_USERS_LOGS,
       payload : data
   });

   /**
    * Redux Action Get BIOMAX USERS LOGS Success
    */
   export const getBiomaxUsersLogsSuccess = (response) => ({
       type: GET_BIOMAX_USERS_LOGS_SUCCESS,
       payload: response
   });


   /**
    * Redux Action BIOMAX Unauthorised LOGS
    */
   export const getBiomaxUnauthorisedLogs = (data) => ({
       type: GET_BIOMAX_UNAUTHORISED_LOGS,
       payload : data
   });

   /**
    * Redux Action Get BIOMAX Unauthorised LOGS Success
    */
   export const getBiomaxUnauthorisedLogsSuccess = (response) => ({
       type: GET_BIOMAX_UNAUTHORISED_LOGS_SUCCESS,
       payload: response
   });
   export const biomaxhandleChangeSelectAll = (value) => ({
      type: BIOMAX_HANDLE_CHANGE_SELECT_ALL,
      payload: {value }
   })
   export const biomaxhandleSingleCheckboxChange = (value,data, id) => ({
      type: BIOMAX_HANDLE_SINGLE_CHECKBOX_CHANGE,
      payload: {value, data, id }
   });

   export const userbiomaxhandleChangeSelectAll = (value) => ({
      type: USER_BIOMAX_HANDLE_CHANGE_SELECT_ALL,
      payload: {value }
   })
   export const userbiomaxhandleSingleCheckboxChange = (value,data, id) => ({
      type: USER_BIOMAX_HANDLE_SINGLE_CHECKBOX_CHANGE,
      payload: {value, data, id }
   });
