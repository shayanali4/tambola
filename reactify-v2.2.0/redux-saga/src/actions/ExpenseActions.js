/**
 * Expense Actions
 */
import {
    OPEN_ADD_NEW_EXPENSE_MODEL,
    OPEN_ADD_NEW_EXPENSE_MODEL_SUCCESS,
    CLOSE_ADD_NEW_EXPENSE_MODEL,
    SAVE_EXPENSE,
    SAVE_EXPENSE_SUCCESS,
    GET_EXPENSE,
    GET_EXPENSE_SUCCESS,
    OPEN_VIEW_EXPENSE_MODEL,
    OPEN_VIEW_EXPENSE_MODEL_SUCCESS,
    CLOSE_VIEW_EXPENSE_MODEL,
    OPEN_EDIT_EXPENSE_MODEL,
    OPEN_EDIT_EXPENSE_MODEL_SUCCESS,
    DELETE_EXPENSE,
    OPEN_CLAIM_EXPENSE_MODEL,
    OPEN_CLAIM_EXPENSE_MODEL_SUCCESS,
    CLOSE_CLAIM_EXPENSE_MODEL,
    SAVE_CLAIM_EXPENSE,
    SAVE_CLAIM_EXPENSE_SUCCESS,
    EXPENSE_SETTLEMENT,
    IMPORT_EXPENSE,
    IMPORT_EXPENSE_SUCCESS,
    IMPORT_EXPENSE_LIST,
    IMPORT_EXPENSE_LIST_SUCCESS,
  } from './types';

export const opnAddNewExpenseModel = (requestData) => ({
    type: OPEN_ADD_NEW_EXPENSE_MODEL,
    payload: requestData
});

export const opnAddNewExpenseModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_EXPENSE_MODEL_SUCCESS,
    payload: response
});

export const clsAddNewExpenseModel = () => ({
    type: CLOSE_ADD_NEW_EXPENSE_MODEL
});

export const saveExpense = (data) => ({
    type: SAVE_EXPENSE,
    payload : data
});

export const saveExpenseSuccess = () => ({
    type: SAVE_EXPENSE_SUCCESS,
});

export const getExpenses = (data) => ({
    type: GET_EXPENSE,
    payload : data
});

export const getExpensesSuccess = (response) => ({
    type: GET_EXPENSE_SUCCESS,
    payload: response
});


export const opnViewExpenseModel = (requestData) => ({
    type: OPEN_VIEW_EXPENSE_MODEL,
    payload: requestData
});

export const viewExpenseSuccess = (response) => ({
    type: OPEN_VIEW_EXPENSE_MODEL_SUCCESS,
    payload: response
});

export const clsViewExpenseModel = () => ({
    type: CLOSE_VIEW_EXPENSE_MODEL
});

export const opnEditExpenseModel = (requestData) => ({
    type: OPEN_EDIT_EXPENSE_MODEL,
    payload:requestData
});
/**
 * Redux Action Get expense Success
 */
export const editExpenseSuccess = (response) => ({
    type: OPEN_EDIT_EXPENSE_MODEL_SUCCESS,
    payload: response
});

export const deleteExpense = (data) => ({
    type: DELETE_EXPENSE,
    payload:data
});


export const opnClaimExpenseModel = (requestData) => ({
    type: OPEN_CLAIM_EXPENSE_MODEL,
    payload: requestData
});

export const claimExpenseSuccess = (response) => ({
    type: OPEN_CLAIM_EXPENSE_MODEL_SUCCESS,
    payload: response
});

export const clsClaimExpenseModel = () => ({
    type: CLOSE_CLAIM_EXPENSE_MODEL
});

export const saveClaimExpense = (data) => ({
    type: SAVE_CLAIM_EXPENSE,
    payload : data
});

export const saveClaimExpenseSuccess = () => ({
    type: SAVE_CLAIM_EXPENSE_SUCCESS,
});


export const expenseSettlement = (data) => ({
    type: EXPENSE_SETTLEMENT,
    payload:data
});


export const importExpense = (data) => ({
    type: IMPORT_EXPENSE,
    payload : data
});

export const importExpenseSuccess = (response) => ({
    type: IMPORT_EXPENSE_SUCCESS,
    payload: response
});

export const importExpenseList = (data) => ({
    type: IMPORT_EXPENSE_LIST,
    payload : data
});

export const importExpenseListSuccess = (response) => ({
    type: IMPORT_EXPENSE_LIST_SUCCESS,
    payload: response
});
