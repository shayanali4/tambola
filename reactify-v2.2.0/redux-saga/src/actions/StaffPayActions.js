
import {
    OPEN_ADD_NEW_STAFFPAY_MODEL,
    OPEN_ADD_NEW_STAFFPAY_MODEL_SUCCESS,
    CLOSE_ADD_NEW_STAFFPAY_MODEL,
    SAVE_STAFFPAY,
    SAVE_STAFFPAY_SUCCESS,
    GET_STAFFPAY,
    GET_STAFFPAY_SUCCESS,
    OPEN_VIEW_STAFFPAY_MODEL,
    OPEN_VIEW_STAFFPAY_MODEL_SUCCESS,
    CLOSE_VIEW_STAFFPAY_MODEL,
    DELETE_STAFFPAY,
  } from './types';


//Staff pay

export const opnAddNewStaffPayModel = () => ({
    type: OPEN_ADD_NEW_STAFFPAY_MODEL
});

export const opnAddNewStaffPayModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_STAFFPAY_MODEL_SUCCESS,
    payload: response
});

export const clsAddNewStaffPayModel = () => ({
    type: CLOSE_ADD_NEW_STAFFPAY_MODEL
});

export const saveStaffPay = (data) => ({
    type: SAVE_STAFFPAY,
    payload : data
});

export const saveStaffPaySuccess = () => ({
    type: SAVE_STAFFPAY_SUCCESS,
});

export const getStaffPay = (data) => ({
    type: GET_STAFFPAY,
    payload : data
});

export const getStaffPaySuccess = (response) => ({
    type: GET_STAFFPAY_SUCCESS,
    payload: response
});


export const opnViewStaffPayModel = (requestData) => ({
    type: OPEN_VIEW_STAFFPAY_MODEL,
    payload: requestData
});

export const viewStaffPaySuccess = (response) => ({
    type: OPEN_VIEW_STAFFPAY_MODEL_SUCCESS,
    payload: response
});

export const clsViewStaffPayModel = () => ({
    type: CLOSE_VIEW_STAFFPAY_MODEL
});

export const deleteStaffPay = (data) => ({
    type: DELETE_STAFFPAY,
    payload:data
});
