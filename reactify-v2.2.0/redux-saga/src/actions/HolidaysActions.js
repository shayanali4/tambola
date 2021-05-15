/**
 * Holidays Actions
 */
import {
    OPEN_ADD_NEW_HOLIDAYS_MODEL,
    CLOSE_ADD_NEW_HOLIDAYS_MODEL,
    SAVE_HOLIDAYS,
    SAVE_HOLIDAYS_SUCCESS,
    GET_HOLIDAYS,
    GET_HOLIDAYS_SUCCESS,
    OPEN_VIEW_HOLIDAYS_MODEL,
    OPEN_VIEW_HOLIDAYS_MODEL_SUCCESS,
    CLOSE_VIEW_HOLIDAYS_MODEL,
    DELETE_HOLIDAYS,
    OPEN_EDIT_HOLIDAYS_MODEL,
    OPEN_EDIT_HOLIDAYS_MODEL_SUCCESS
  } from './types';

export const opnAddNewHolidaysModel = () => ({
    type: OPEN_ADD_NEW_HOLIDAYS_MODEL
});

export const clsAddNewHolidaysModel = () => ({
    type: CLOSE_ADD_NEW_HOLIDAYS_MODEL
});

export const saveHolidays = (data) => ({
    type: SAVE_HOLIDAYS,
    payload : data
});

export const saveHolidaysSuccess = () => ({
    type: SAVE_HOLIDAYS_SUCCESS,
});

export const getHolidays = (data) => ({
    type: GET_HOLIDAYS,
    payload : data
});

export const getHolidaysSuccess = (response) => ({
    type: GET_HOLIDAYS_SUCCESS,
    payload: response
});


export const opnViewHolidaysModel = (requestData) => ({
    type: OPEN_VIEW_HOLIDAYS_MODEL,
    payload: requestData
});

export const viewHolidaysSuccess = (response) => ({
    type: OPEN_VIEW_HOLIDAYS_MODEL_SUCCESS,
    payload: response
});

export const clsViewHolidaysModel = () => ({
    type: CLOSE_VIEW_HOLIDAYS_MODEL
});

export const deleteHolidays = (data) => ({
    type: DELETE_HOLIDAYS,
    payload:data
});
/**
 * Redux Action edit Holidays  model
 */
export const opnEditHolidaysModel = (requestData) => ({
    type: OPEN_EDIT_HOLIDAYS_MODEL,
      payload:requestData
});
/**
 * Redux Action edit Holidays Success
 */
export const editHolidaysSuccess = (response) => ({
    type: OPEN_EDIT_HOLIDAYS_MODEL_SUCCESS,
    payload: response
});
