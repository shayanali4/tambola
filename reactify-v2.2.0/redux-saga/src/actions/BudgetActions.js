/**
 * Budget Actions
 */
import {
    OPEN_ADD_NEW_BUDGET_MODEL,
    CLOSE_ADD_NEW_BUDGET_MODEL,
    SAVE_BUDGET,
    SAVE_BUDGET_SUCCESS,
    GET_BUDGET,
    GET_BUDGET_SUCCESS,
    OPEN_VIEW_BUDGET_MODEL,
    OPEN_VIEW_BUDGET_MODEL_SUCCESS,
    CLOSE_VIEW_BUDGET_MODEL,
    DELETE_BUDGET,
    OPEN_EDIT_BUDGET_MODEL,
    OPEN_EDIT_BUDGET_MODEL_SUCCESS
  } from './types';

export const opnAddNewBudgetModel = () => ({
    type: OPEN_ADD_NEW_BUDGET_MODEL
});

export const clsAddNewBudgetModel = () => ({
    type: CLOSE_ADD_NEW_BUDGET_MODEL
});

export const saveBudget = (data) => ({
    type: SAVE_BUDGET,
    payload : data
});

export const saveBudgetSuccess = () => ({
    type: SAVE_BUDGET_SUCCESS,
});

export const getBudgets = (data) => ({
    type: GET_BUDGET,
    payload : data
});

export const getBudgetsSuccess = (response) => ({
    type: GET_BUDGET_SUCCESS,
    payload: response
});


export const opnViewBudgetModel = (requestData) => ({
    type: OPEN_VIEW_BUDGET_MODEL,
    payload: requestData
});

export const viewBudgetSuccess = (response) => ({
    type: OPEN_VIEW_BUDGET_MODEL_SUCCESS,
    payload: response
});

export const clsViewBudgetModel = () => ({
    type: CLOSE_VIEW_BUDGET_MODEL
});

export const deleteBudget = (data) => ({
    type: DELETE_BUDGET,
    payload:data
});
/**
 * Redux Action edit Budget  model
 */
export const opnEditBudgetModel = (requestData) => ({
    type: OPEN_EDIT_BUDGET_MODEL,
      payload:requestData
});
/**
 * Redux Action edit Budget Success
 */
export const editBudgetSuccess = (response) => ({
    type: OPEN_EDIT_BUDGET_MODEL_SUCCESS,
    payload: response
});
