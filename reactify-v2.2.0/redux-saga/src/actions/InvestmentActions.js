/**
 * investment Actions
 */
import {
    OPEN_ADD_NEW_INVESTMENT_MODEL,
    CLOSE_ADD_NEW_INVESTMENT_MODEL,
    SAVE_INVESTMENT,
    SAVE_INVESTMENT_SUCCESS,
    GET_INVESTMENTS,
    GET_INVESTMENTS_SUCCESS,
    OPEN_VIEW_INVESTMENT_MODEL,
    OPEN_VIEW_INVESTMENT_MODEL_SUCCESS,
    CLOSE_VIEW_INVESTMENT_MODEL,
    DELETE_INVESTMENT,
  } from './types';

export const opnAddNewInvestmentModel = (data) => ({
    type: OPEN_ADD_NEW_INVESTMENT_MODEL,
    payload : data

});

export const clsAddNewInvestmentModel = () => ({
    type: CLOSE_ADD_NEW_INVESTMENT_MODEL
});

export const saveInvestment = (data) => ({
    type: SAVE_INVESTMENT,
    payload : data
});

export const saveInvestmentSuccess = () => ({
    type: SAVE_INVESTMENT_SUCCESS,
});

export const getInvestments = (data) => ({
    type: GET_INVESTMENTS,
    payload : data
});

export const getInvestmentsSuccess = (response) => ({
    type: GET_INVESTMENTS_SUCCESS,
    payload: response
});


export const opnViewInvestmentModel = (requestData) => ({
    type: OPEN_VIEW_INVESTMENT_MODEL,
    payload: requestData
});

export const viewInvestmentSuccess = (response) => ({
    type: OPEN_VIEW_INVESTMENT_MODEL_SUCCESS,
    payload: response
});

export const clsViewInvestmentModel = () => ({
    type: CLOSE_VIEW_INVESTMENT_MODEL
});

export const deleteInvestment = (data) => ({
    type: DELETE_INVESTMENT,
    payload:data
});
