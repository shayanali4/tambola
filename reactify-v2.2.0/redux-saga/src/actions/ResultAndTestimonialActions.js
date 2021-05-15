/**
 * Budget Actions
 */
import {
    OPEN_ADD_NEW_RESULTANDTESTIMONIAL_MODEL,
    OPEN_ADD_NEW_RESULTANDTESTIMONIAL_MODEL_SUCCESS,
    CLOSE_ADD_NEW_RESULTANDTESTIMONIAL_MODEL,
    SAVE_RESULTANDTESTIMONIAL,
    SAVE_RESULTANDTESTIMONIAL_SUCCESS,
    GET_RESULTANDTESTIMONIAL,
    GET_RESULTANDTESTIMONIAL_SUCCESS,
    OPEN_VIEW_RESULTANDTESTIMONIAL_MODEL,
    OPEN_VIEW_RESULTANDTESTIMONIAL_MODEL_SUCCESS,
    CLOSE_VIEW_RESULTANDTESTIMONIAL_MODEL,
    DELETE_RESULTANDTESTIMONIAL,
    OPEN_EDIT_RESULTANDTESTIMONIAL_MODEL,
    OPEN_EDIT_RESULTANDTESTIMONIAL_MODEL_SUCCESS,
    RESULTANDTESTIMONIAL_HANDLE_CHANGE_SELECT_ALL,
    RESULTANDTESTIMONIAL_HANDLE_SINGLE_CHECKBOX_CHANGE,
    OPEN_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL,
    CLOSE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL,
    OPEN_DISABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL,
    CLOSE_DISABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL,
    SAVE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL,
    SAVE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_SUCCESS,
  } from './types';

export const opnAddNewResultAndTestimonialModel = () => ({
    type: OPEN_ADD_NEW_RESULTANDTESTIMONIAL_MODEL
});

export const opnAddNewResultAndTestimonialModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_RESULTANDTESTIMONIAL_MODEL_SUCCESS,
    payload: response
});

export const clsAddNewResultAndTestimonialModel = () => ({
    type: CLOSE_ADD_NEW_RESULTANDTESTIMONIAL_MODEL
});

export const saveResultAndTestimonial = (data) => ({
    type: SAVE_RESULTANDTESTIMONIAL,
    payload : data
});

export const saveResultAndTestimonialSuccess = () => ({
    type: SAVE_RESULTANDTESTIMONIAL_SUCCESS,
});

export const getResultAndTestimonial = (data) => ({
    type: GET_RESULTANDTESTIMONIAL,
    payload : data
});

export const getResultAndTestimonialSuccess = (response) => ({
    type: GET_RESULTANDTESTIMONIAL_SUCCESS,
    payload: response
});


export const opnViewResultAndTestimonialModel = (requestData) => ({
    type: OPEN_VIEW_RESULTANDTESTIMONIAL_MODEL,
    payload: requestData
});

export const viewResultAndTestimonialSuccess = (response) => ({
    type: OPEN_VIEW_RESULTANDTESTIMONIAL_MODEL_SUCCESS,
    payload: response
});

export const clsViewResultAndTestimonialModel = () => ({
    type: CLOSE_VIEW_RESULTANDTESTIMONIAL_MODEL
});

export const deleteResultAndTestimonial = (data) => ({
    type: DELETE_RESULTANDTESTIMONIAL,
    payload:data
});

export const opnEditResultAndTestimonialModel = (requestData) => ({
    type: OPEN_EDIT_RESULTANDTESTIMONIAL_MODEL,
      payload:requestData
});

export const editResultAndTestimonialSuccess = (response) => ({
    type: OPEN_EDIT_RESULTANDTESTIMONIAL_MODEL_SUCCESS,
    payload: response
});



export const resultAndTestimonialHandlechangeSelectAll = (value) => ({
   type: RESULTANDTESTIMONIAL_HANDLE_CHANGE_SELECT_ALL,
   payload: {value }
});

export const resultAndTestimonialHandleSingleCheckboxChange = (value,data, id) => ({
   type: RESULTANDTESTIMONIAL_HANDLE_SINGLE_CHECKBOX_CHANGE,
   payload: {value, data, id }
});


export const opnEnablePublishingStatusResultAndTestimonialModel = (data) => ({
  type: OPEN_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL,
  payload : data
});

export const clsEnablePublishingStatusResultAndTestimonialModel = () => ({
    type: CLOSE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL,
});

export const opnDisablePublishingStatusResultAndTestimonialModel = (data) => ({
  type: OPEN_DISABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL,
  payload : data
});

export const clsDisablePublishingStatusResultAndTestimonialModel = () => ({
    type: CLOSE_DISABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL,
});


export const saveEnablePublishingStatusResultAndTestimonial = (data) => ({
    type: SAVE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL,
    payload : data
});

export const saveEnablePublishingStatusResultAndTestimonialSuccess = () => ({
    type: SAVE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_SUCCESS,
});
