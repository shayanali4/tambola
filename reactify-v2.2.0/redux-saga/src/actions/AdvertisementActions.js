/**
 * Budget Actions
 */
import {
    OPEN_ADD_NEW_ADVERTISEMENT_MODEL,
    CLOSE_ADD_NEW_ADVERTISEMENT_MODEL,
    SAVE_ADVERTISEMENT,
    SAVE_ADVERTISEMENT_SUCCESS,
    GET_ADVERTISEMENTS,
    GET_ADVERTISEMENTS_SUCCESS,
    OPEN_VIEW_ADVERTISEMENT_MODEL,
    OPEN_VIEW_ADVERTISEMENT_MODEL_SUCCESS,
    CLOSE_VIEW_ADVERTISEMENT_MODEL,
    DELETE_ADVERTISEMENT,
    OPEN_EDIT_ADVERTISEMENT_MODEL,
    OPEN_EDIT_ADVERTISEMENT_MODEL_SUCCESS,
    ADVERTISEMENT_HANDLE_CHANGE_SELECT_ALL,
    ADVERTISEMENT_HANDLE_SINGLE_CHECKBOX_CHANGE,
    OPEN_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL,
    CLOSE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL,
    OPEN_DISABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL,
    CLOSE_DISABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL,
    SAVE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT,
    SAVE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT_SUCCESS,
  } from './types';

export const opnAddNewAdvertisementModel = () => ({
    type: OPEN_ADD_NEW_ADVERTISEMENT_MODEL
});

export const clsAddNewAdvertisementModel = () => ({
    type: CLOSE_ADD_NEW_ADVERTISEMENT_MODEL
});

export const saveAdvertisement = (data) => ({
    type: SAVE_ADVERTISEMENT,
    payload : data
});

export const saveAdvertisementSuccess = () => ({
    type: SAVE_ADVERTISEMENT_SUCCESS,
});

export const getAdvertisements = (data) => ({
    type: GET_ADVERTISEMENTS,
    payload : data
});

export const getadvertisementsSuccess = (response) => ({
    type: GET_ADVERTISEMENTS_SUCCESS,
    payload: response
});


export const opnViewAdvertisementModel = (requestData) => ({
    type: OPEN_VIEW_ADVERTISEMENT_MODEL,
    payload: requestData
});

export const viewAdvertisementSuccess = (response) => ({
    type: OPEN_VIEW_ADVERTISEMENT_MODEL_SUCCESS,
    payload: response
});

export const clsViewAdvertisementModel = () => ({
    type: CLOSE_VIEW_ADVERTISEMENT_MODEL
});

export const deleteAdvertisement = (data) => ({
    type: DELETE_ADVERTISEMENT,
    payload:data
});
/**
 * Redux Action edit advertisement  model
 */
export const opnEditAdvertisementModel = (requestData) => ({
    type: OPEN_EDIT_ADVERTISEMENT_MODEL,
      payload:requestData
});
/**
 * Redux Action edit advertisement Success
 */
export const editAdvertisementSuccess = (response) => ({
    type: OPEN_EDIT_ADVERTISEMENT_MODEL_SUCCESS,
    payload: response
});



export const advertisementHandlechangeSelectAll = (value) => ({
   type: ADVERTISEMENT_HANDLE_CHANGE_SELECT_ALL,
   payload: {value }
});

export const advertisementHandleSingleCheckboxChange = (value,data, id) => ({
   type: ADVERTISEMENT_HANDLE_SINGLE_CHECKBOX_CHANGE,
   payload: {value, data, id }
});


export const opnEnablePublishingStatusAdvertisementModel = (data) => ({
  type: OPEN_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL,
  payload : data
});

export const clsEnablePublishingStatusAdvertisementModel = () => ({
    type: CLOSE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL,
});

export const opnDisablePublishingStatusAdvertisementModel = (data) => ({
  type: OPEN_DISABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL,
  payload : data
});

export const clsDisablePublishingStatusAdvertisementModel = () => ({
    type: CLOSE_DISABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL,
});


export const saveEnablePublishingStatusAdvertisement = (data) => ({
    type: SAVE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT,
    payload : data
});

export const saveEnablePublishingStatusAdvertisementSuccess = () => ({
    type: SAVE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT_SUCCESS,
});
