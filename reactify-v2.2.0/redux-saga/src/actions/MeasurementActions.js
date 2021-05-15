/**
 * measurement Actions
 */
import {
OPEN_ADD_NEW_MEASUREMENT_MODEL,
OPEN_ADD_NEW_MEASUREMENT_MODEL_SUCCESS,
CLOSE_ADD_NEW_MEASUREMENT_MODEL,

GET_MEASUREMENTS,
GET_MEASUREMENTS_SUCCESS,

SAVE_MEASUREMENT,
SAVE_MEASUREMENT_SUCCESS,

OPEN_VIEW_MEASUREMENT_MODEL,
OPEN_VIEW_MEASUREMENT_MODEL_SUCCESS,
CLOSE_VIEW_MEASUREMENT_MODEL,


OPEN_EDIT_MEASUREMENT_MODEL,
OPEN_EDIT_MEASUREMENTMODEL_SUCCESS,

GET_BODY_MEASUREMENT_DETAILS,
GET_BODY_MEASUREMENT_DETAILS_SUCCESS,


OPEN_ADD_NEW_NOT_TAKEN_MEASUREMENT_MEMBER_MODEL,
CLOSE_ADD_NEW_NOT_TAKEN_MEASUREMENT_MEMBER_MODEL,


OPEN_VIEW_MEASUREMENT_INBODY_MODEL,
OPEN_VIEW_MEASUREMENT_INBODY_MODEL_SUCCESS,
CLOSE_VIEW_MEASUREMENT_INBODY_MODEL,

OPEN_VIEW_INBODY_MEASUREMENT_MODEL,
OPEN_VIEW_INBODY_MEASUREMENT_MODEL_SUCCESS,
CLOSE_VIEW_INBODY_MEASUREMENT_MODEL,

OPEN_VIEW_MEASUREMENT_PDF_MODEL,
CLOSE_VIEW_MEASUREMENT_PDF_MODEL

  } from './types';
  /**
   * Redux Action OPEN View Measurement Model
   */
  export const opnAddNewMeasurementModel = (data) => ({
    type: OPEN_ADD_NEW_MEASUREMENT_MODEL,
    payload: data
  });
  /**
   * Redux Action Open Model for new Measurement
   */
  export const opnAddNewMeasurementModelSuccess = (response) => ({
      type: OPEN_ADD_NEW_MEASUREMENT_MODEL_SUCCESS,
      payload: response
  });
  /**
  * Redux Action close View Measurement Model
  */
  export const clsAddNewMeasurementModel = () => ({
    type: CLOSE_ADD_NEW_MEASUREMENT_MODEL,
  });
  /**
   * Redux Action Get Measurement
   */
  export const getMeasurements = (requestData) => ({
      type: GET_MEASUREMENTS,
      payload : requestData
  });

  /**
   * Redux Action Get Measurement Success
   */
  export const getMeasurementsSuccess = (response) => ({
      type: GET_MEASUREMENTS_SUCCESS,
      payload: response
  });
  /**
   * Redux Action SAVE Measurement
   */
  export const saveMeasurement = (data) => ({
      type: SAVE_MEASUREMENT,
      payload : data
  });
  /**
   * Redux Action SAVE Measurement SUCCESS
   */
  export const saveMeasurementSuccess = () => ({
      type: SAVE_MEASUREMENT_SUCCESS,
  });
  /**
   * Redux Action Measurement   model
   */
  export const opnEditMeasurementModel = (requestData) => ({
      type: OPEN_EDIT_MEASUREMENT_MODEL,
        payload:requestData
  });
  /**
   * Redux Action Measurement  Success
   */
  export const editMeasurementSuccess = (response) => ({
      type: OPEN_EDIT_MEASUREMENTMODEL_SUCCESS,
      payload: response
  });
  /**
   * Redux Action Open Model to view Measurement
   */
  export const opnViewMeasurementModel = (requestData) => ({
      type: OPEN_VIEW_MEASUREMENT_MODEL,
        payload:requestData
  });
  /**
   * Redux Action Get Measurement Success
   */
  export const viewMeasurementSuccess = (response) => ({
      type: OPEN_VIEW_MEASUREMENT_MODEL_SUCCESS,
      payload: response
  });
  /**
   * Redux Action close View Measurement Model
   */
  export const clsViewMeasurementModel = () => ({
      type: CLOSE_VIEW_MEASUREMENT_MODEL
  });
  export const getbodymeasuremetDetail = (requestData) => ({
      type: GET_BODY_MEASUREMENT_DETAILS,
      payload : requestData
  });
  /**
   * Redux Action Get services Success
   */
  export const getbodymeasurementDetailSuccess = (response) => ({
      type: GET_BODY_MEASUREMENT_DETAILS_SUCCESS,
      payload: response
  });
  /**
   * Redux Action OPEN ADD NEW ALLOCATED Member MODEL
   */
  export const opnAddNewNottakenmeasurementMemberModel = (data) => ({
    type: OPEN_ADD_NEW_NOT_TAKEN_MEASUREMENT_MEMBER_MODEL,
    payload : data
  });
  /**
   * Redux Action close ADD NEW ALLOCATED Member MODEL
   */
  export const clsAddNewNottakenmeasurementMemberModel = () => ({
      type: CLOSE_ADD_NEW_NOT_TAKEN_MEASUREMENT_MEMBER_MODEL,
  });


  /**
   * Redux Action Open Model to view Enquiry
   */
  export const opnViewMeasurementInbodymodel = (data) => ({
      type: OPEN_VIEW_MEASUREMENT_INBODY_MODEL,
      payload : data
  });
  /**
   * Redux Action Open Model to view Enquiry
   */
  export const opnViewMeasurementInbodymodelSuccess = (data) => ({
      type: OPEN_VIEW_MEASUREMENT_INBODY_MODEL_SUCCESS,
      payload : data
  });
  /**
   * Redux Action close View Enquiry Model
   */
  export const clsViewMeasurementInbodyModel = () => ({
      type: CLOSE_VIEW_MEASUREMENT_INBODY_MODEL
  });


  /**
   * Redux Action Open Model to view Measurement
   */
  export const opnViewInBodyMeasurementModel = (requestData) => ({
      type: OPEN_VIEW_INBODY_MEASUREMENT_MODEL,
        payload:requestData
  });
  /**
   * Redux Action Get Measurement Success
   */
  export const viewInBodyMeasurementSuccess = (response) => ({
      type: OPEN_VIEW_INBODY_MEASUREMENT_MODEL_SUCCESS,
      payload: response
  });
  /**
   * Redux Action close View Measurement Model
   */
  export const clsViewInBodyMeasurementModel = () => ({
      type: CLOSE_VIEW_INBODY_MEASUREMENT_MODEL
  });
  /**
   * Redux Action Open Model to view Measurement
   */
  export const opnViewMeasurementPdfModel = (data) => ({
      type: OPEN_VIEW_MEASUREMENT_PDF_MODEL,
      payload:data
  });
  /**
   * Redux Action Open Model to view Measurement
   */
  export const clsViewMeasurementPdfModel = () => ({
      type: CLOSE_VIEW_MEASUREMENT_PDF_MODEL,
  });
