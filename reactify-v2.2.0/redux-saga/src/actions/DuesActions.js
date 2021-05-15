/**
 * Dues Actions
 */

import {
GET_DUES,
GET_DUES_SUCCESS,
SAVE_PAYMENT,
SAVE_PAYMENT_SUCCESS,
OPEN_ADD_NEW_PAYMENT_MODEL,
OPEN_ADD_NEW_PAYMENT_MODEL_SUCCESS,
CLOSE_ADD_NEW_PAYMENT_MODEL,
GET_PENDING_CHEQUE_LIST,
GET_PENDING_CHEQUE_LIST_SUCCESS,
CHANGE_CHEQUE_PAYMENT_STATUS,
CHANGE_CHEQUE_PAYMENT_STATUS_SUCCESS,
} from './types';
/**
 * Redux Action Get DUES
 */
export const getdues = (data) => ({
    type: GET_DUES,
    payload : data
});

/**
 * Redux Action Get DUES Success
 */
export const getDuesSuccess = (response) => ({
    type: GET_DUES_SUCCESS,
    payload: response
});
/**
 * Redux Action Get DUES
 */
export const savepayments = (data) => ({
    type: SAVE_PAYMENT,
    payload : data
});

/**
 * Redux Action Get DUES Success
 */
export const savePaymentsSuccess = (data) => ({
    type: SAVE_PAYMENT_SUCCESS,
    payload : data
});
/**
 * Redux Action OPEN View payment Model
 */
export const opnAddNewPaymentModel = () => ({
  type: OPEN_ADD_NEW_PAYMENT_MODEL,
});
/**
 * Redux Action Open Model for new payment
 */
export const opnAddNewPaymentModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_PAYMENT_MODEL_SUCCESS,
    payload: response
});
/**
* Redux Action close View payment Model
*/
export const clsAddNewPaymentModel = () => ({
  type: CLOSE_ADD_NEW_PAYMENT_MODEL,
});

export const getPendingChequeList = (data) => ({
    type: GET_PENDING_CHEQUE_LIST,
    payload : data
});

/**
 * Redux Action Get Pending Cheque Success
 */
export const getPendingChequeListSuccess = (response) => ({
    type: GET_PENDING_CHEQUE_LIST_SUCCESS,
    payload: response
});

export const changeChequePaymentStatus = (data) => ({
    type: CHANGE_CHEQUE_PAYMENT_STATUS,
    payload : data
});

export const changeChequePaymentStatusSuccess = () => ({
    type: CHANGE_CHEQUE_PAYMENT_STATUS_SUCCESS,
});
