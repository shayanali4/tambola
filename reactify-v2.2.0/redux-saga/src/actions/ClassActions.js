/**
 * class Actions
 */
import {
  GET_CLASSES,
  GET_CLASSES_SUCCESS,

  OPEN_ADD_NEW_CLASS_MODEL,
  OPEN_ADD_NEW_CLASS_MODEL_SUCCESS,
  CLOSE_ADD_NEW_CLASS_MODEL,

  SAVE_CLASS,
  SAVE_CLASS_SUCCESS,

  OPEN_EDIT_CLASS_MODEL,
  OPEN_EDIT_CLASS_MODEL_SUCCESS,

  OPEN_VIEW_CLASS_MODEL,
  OPEN_VIEW_CLASS_MODEL_SUCCESS,
  CLOSE_VIEW_CLASS_MODEL,

  DELETE_CLASS,

  GET_CLASS_BOOKED_AND_INTERESTED_LIST,
  GET_CLASS_BOOKED_AND_INTERESTED_LIST_SUCCESS,
  DELETE_CLASS_BOOKED,
  STAFF_SAVE_MEMBER_CLASS_BOOKING,
  STAFF_SAVE_MEMBER_CLASS_BOOKING_SUCCESS,

  SAVE_CLASS_ONLINEACCESSURL,
  SAVE_CLASS_ONLINEACCESSURL_SUCCESS,
  OPEN_ADD_CLASS_ONLINEACCESSURL_MODEL,
  CLOSE_ADD_CLASS_ONLINEACCESSURL_MODEL,

  CLASS_CANCEL,
  CLASS_CANCEL_SUCCESS,

  } from './types';
   /**
    * Redux Action OPEN View class Model
    */
   export const opnAddNewClassModel = () => ({
     type: OPEN_ADD_NEW_CLASS_MODEL,
   });
   /**
    * Redux Action Open Model for new Member
    */
   export const opnAddNewClassModelSuccess = (response) => ({
       type: OPEN_ADD_NEW_CLASS_MODEL_SUCCESS,
       payload: response
   });
   /**
   * Redux Action close View class Model
   */
   export const clsAddNewClassModel = () => ({
     type: CLOSE_ADD_NEW_CLASS_MODEL,
   });
   /**
    * Redux Action Get ENQUIRY
    */
   export const getClasses = (requestData) => ({
       type: GET_CLASSES,
       payload : requestData
   });

   /**
    * Redux Action Get ENQUIRY Success
    */
   export const getClassesSuccess = (response) => ({
       type: GET_CLASSES_SUCCESS,
       payload: response
   });
   /**
    * Redux Action SAVE PRODUCT
    */
   export const saveClass = (data) => ({
       type: SAVE_CLASS,
       payload : data
   });
   /**
    * Redux Action SAVE PRODUCT SUCCESS
    */
   export const saveClassSuccess = () => ({
       type: SAVE_CLASS_SUCCESS,
   });
   /**
    * Redux Action edit class  model
    */
   export const opnEditClassModel = (requestData) => ({
       type: OPEN_EDIT_CLASS_MODEL,
         payload:requestData
   });
   /**
    * Redux Action edit class Success
    */
   export const editClassSuccess = (response) => ({
       type: OPEN_EDIT_CLASS_MODEL_SUCCESS,
       payload: response
   });
   /**
    * Redux Action Open Model to view Enquiry
    */
   export const opnViewClassModel = (requestData) => ({
       type: OPEN_VIEW_CLASS_MODEL,
         payload:requestData
   });
   /**
    * Redux Action Get Enquiry Success
    */
   export const viewClassSuccess = (response) => ({
       type: OPEN_VIEW_CLASS_MODEL_SUCCESS,
       payload: response
   });
   /**
    * Redux Action close View Enquiry Model
    */
   export const clsViewClassModel = () => ({
       type: CLOSE_VIEW_CLASS_MODEL
   });
   /**
    * Redux Action Delete Employee
    */
   export const deleteClass = (data) => ({
       type: DELETE_CLASS,
       payload:data
   });


   export const getClassBookedAndInterestedList = (requestData) => ({
       type: GET_CLASS_BOOKED_AND_INTERESTED_LIST,
       payload : requestData
   });

   export const getClassBookedAndInterestedListSuccess = (response) => ({
       type: GET_CLASS_BOOKED_AND_INTERESTED_LIST_SUCCESS,
       payload: response
   });

   export const deleteClassBooked = (data) => ({
       type: DELETE_CLASS_BOOKED,
       payload:data
   });


   export const staffSaveMemberClassBooking = (data) => ({
       type: STAFF_SAVE_MEMBER_CLASS_BOOKING,
       payload : data
   });

    export const staffSaveMemberClassBookingSuccess = (data) => ({
        type: STAFF_SAVE_MEMBER_CLASS_BOOKING_SUCCESS,
        payload : data
    });


    export const saveClassOnlineAccessUrl = (data) => ({
         type: SAVE_CLASS_ONLINEACCESSURL,
         payload : data
     });

     export const saveClassOnlineAccessUrlSuccess = (response) => ({
         type: SAVE_CLASS_ONLINEACCESSURL_SUCCESS,
         payload: response
     });


     export const opnAddClassOnlineAccessUrlModel = (data) => ({
       type: OPEN_ADD_CLASS_ONLINEACCESSURL_MODEL,
         payload : data
     });

     export const clsAddClassOnlineAccessUrlModel = () => ({
       type: CLOSE_ADD_CLASS_ONLINEACCESSURL_MODEL,
     });

     export const classCancel = (data) => ({
         type: CLASS_CANCEL,
         payload : data
     });

     export const classCancelSuccess = () => ({
         type: CLASS_CANCEL_SUCCESS,
     });
