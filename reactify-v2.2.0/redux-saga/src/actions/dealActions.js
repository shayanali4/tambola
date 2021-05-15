/**
 * deal Actions
 */

import {
  GET_DEALS,
  GET_DEALS_SUCCESS,

  OPEN_ADD_NEW_DEAL_MODEL,
  CLOSE_ADD_NEW_DEAL_MODEL,
  OPEN_ADD_NEW_DEAL_MODEL_SUCCESS,

  OPEN_EDIT_DEAL_MODEL,
  OPEN_EDIT_DEAL_MODEL_SUCCESS,

  OPEN_VIEW_DEAL_MODEL,
  OPEN_VIEW_DEAL_MODEL_SUCCESS,
  CLOSE_VIEW_DEAL_MODEL,

  SAVE_DEAL,
  SAVE_DEAL_SUCCESS,

  DELETE_DEAL,
  } from './types';
  /**
   * Redux Action Get deals
   */
  export const getDeals = (requestData) => ({
      type: GET_DEALS,
      payload : requestData
  });
  /**
   * Redux Action Get deals Success
   */
  export const getDealsSuccess = (response) => ({
      type: GET_DEALS_SUCCESS,
      payload: response
  });

  /**
   * Redux Action OPEN View deal Model
   */
export const opnAddNewDealModel = (requestData) => ({
    type: OPEN_ADD_NEW_DEAL_MODEL,
      payload:requestData
});
/**
 * Redux Action Open Model for new Member
 */
export const opnAddNewDealModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_DEAL_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View deal Model
 */
export const clsAddNewDealModel = () => ({
    type: CLOSE_ADD_NEW_DEAL_MODEL,
});
/**
 * Redux Action Open Model to view deal
 */
export const opnViewDealModel = (requestData) => ({
    type: OPEN_VIEW_DEAL_MODEL,
      payload:requestData
});
/**
 * Redux Action view deals model
 */
export const viewDealSuccess = (response) => ({
    type: OPEN_VIEW_DEAL_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View deal Model
 */
export const clsViewDealModel = () => ({
    type: CLOSE_VIEW_DEAL_MODEL
});
/**
 * Redux Action edit deals model
 */
export const opnEditDealModel = (requestData) => ({
    type: OPEN_EDIT_DEAL_MODEL,
      payload:requestData
});
/**
 * Redux Action edit deals Success
 */
export const editDealSuccess = (response) => ({
    type: OPEN_EDIT_DEAL_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE PRODUCT
 */
export const saveDeal = (data) => ({
    type: SAVE_DEAL,
    payload : data
});
/**
 * Redux Action SAVE PRODUCT SUCCESS
 */
export const saveDealSuccess = () => ({
    type: SAVE_DEAL_SUCCESS,
});
/**
 * Redux Action Delete Employee
 */
export const deleteDeal = (data) => ({
    type: DELETE_DEAL,
    payload:data
});
