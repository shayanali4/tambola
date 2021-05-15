/**
 * Todo App Actions
 */
import {

SAVE_SHIFT_CONFIGURATION,
SAVE_SHIFT_CONFIGURATION_SUCCESS,
OPEN_ADD_NEW_SHIFT_MODEL,
CLOSE_ADD_NEW_SHIFT_MODEL,
GET_SHIFT,
GET_SHIFT_SUCCESS,
OPEN_EDIT_SHIFT_MODEL,
OPEN_EDIT_SHIFT_MODEL_SUCCESS,
DELETE_SHIFT,


OPEN_ADD_NEW_ASSIGNSHIFT_MODEL,
OPEN_ADD_NEW_ASSIGNSHIFT_MODEL_SUCCESS,
CLOSE_ADD_NEW_ASSIGNSHIFT_MODEL,
GET_ASSIGNSHIFT,
GET_ASSIGNSHIFT_SUCCESS,
OPEN_EDIT_ASSIGNSHIFT_MODEL,
OPEN_EDIT_ASSIGNSHIFT_MODEL_SUCCESS,
DELETE_ASSIGNSHIFT,
SAVE_ASSIGNSHIFT,
SAVE_ASSIGNSHIFT_SUCCESS,
}from './types';

export const saveShiftConfiguration = (data) => ({
    type: SAVE_SHIFT_CONFIGURATION,
    payload : data
});

export const saveShiftConfigurationSuccess = () => ({
    type: SAVE_SHIFT_CONFIGURATION_SUCCESS,
});

export const opnAddNewShiftModel = () => ({
    type: OPEN_ADD_NEW_SHIFT_MODEL
});

export const clsAddNewShiftModel = () => ({
    type: CLOSE_ADD_NEW_SHIFT_MODEL
});

export const getShift = (data) => ({
    type: GET_SHIFT,
    payload : data
});

export const getShiftSuccess = (response) => ({
    type: GET_SHIFT_SUCCESS,
    payload: response
});

export const deleteShift = (data) => ({
    type: DELETE_SHIFT,
    payload:data
});

export const opnEditShiftModel = (requestData) => ({
    type: OPEN_EDIT_SHIFT_MODEL,
      payload:requestData
});

export const opnEditShiftModelSuccess = (response) => ({
    type: OPEN_EDIT_SHIFT_MODEL_SUCCESS,
      payload:response
});



export const saveAssignShift = (data) => ({
    type: SAVE_ASSIGNSHIFT,
    payload : data
});

export const saveAssignShiftSuccess = () => ({
    type: SAVE_ASSIGNSHIFT_SUCCESS,
});

export const opnAddNewAssignShiftModel = () => ({
    type: OPEN_ADD_NEW_ASSIGNSHIFT_MODEL
});

export const opnAddNewAssignShiftModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_ASSIGNSHIFT_MODEL_SUCCESS,
    payload : response
});

export const clsAddNewAssignShiftModel = () => ({
    type: CLOSE_ADD_NEW_ASSIGNSHIFT_MODEL
});

export const getAssignShift = (data) => ({
    type: GET_ASSIGNSHIFT,
    payload : data
});

export const getAssignShiftSuccess = (response) => ({
    type: GET_ASSIGNSHIFT_SUCCESS,
    payload: response
});

export const deleteAssignShift = (data) => ({
    type: DELETE_ASSIGNSHIFT,
    payload:data
});

export const opnEditAssignShiftModel = (requestData) => ({
    type: OPEN_EDIT_ASSIGNSHIFT_MODEL,
      payload:requestData
});

export const opnEditAssignShiftModelSuccess = (response) => ({
    type: OPEN_EDIT_ASSIGNSHIFT_MODEL_SUCCESS,
      payload:response
});
