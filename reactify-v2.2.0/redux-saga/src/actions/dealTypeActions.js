/**
 * service Actions
 */

import {
  GET_DEALTYPES,
  GET_DEALTYPES_SUCCESS,

  OPEN_ADD_NEW_DEALTYPE_MODEL,
  CLOSE_ADD_NEW_DEALTYPE_MODEL,
  OPEN_ADD_NEW_DEALTYPE_MODEL_SUCCESS,

  OPEN_EDIT_DEALTYPE_MODEL,
  OPEN_EDIT_DEALTYPE_MODEL_SUCCESS,

  OPEN_VIEW_DEALTYPE_MODEL,
  OPEN_VIEW_DEALTYPE_MODEL_SUCCESS,
  CLOSE_VIEW_DEALTYPE_MODEL,

  SAVE_DEALTYPE,
  SAVE_DEALTYPE_SUCCESS,

  DELETE_DEALTYPE,
  } from './types';
  /**
   * Redux Action Get services
   */
  export const getDealTypes = (requestData) => ({
      type: GET_DEALTYPES,
      payload : requestData
  });
  /**
   * Redux Action Get services Success
   */
  export const getDealTypesSuccess = (response) => ({
      type: GET_DEALTYPES_SUCCESS,
      payload: response
  });

  /**
   * Redux Action OPEN View service Model
   */
export const opnAddNewDealTypeModel = (requestData) => ({
    type: OPEN_ADD_NEW_DEALTYPE_MODEL,
      payload:requestData
});
/**
 * Redux Action Open Model for new Member
 */
export const opnAddNewDealTypeModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_DEALTYPE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View service Model
 */
export const clsAddNewDealTypeModel = () => ({
    type: CLOSE_ADD_NEW_DEALTYPE_MODEL,
});
/**
 * Redux Action Open Model to view service
 */
export const opnViewDealTypeModel = (requestData) => ({
    type: OPEN_VIEW_DEALTYPE_MODEL,
      payload:requestData
});
/**
 * Redux Action view services model
 */
export const viewDealTypeSuccess = (response) => ({
    type: OPEN_VIEW_DEALTYPE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View service Model
 */
export const clsViewDealTypeModel = () => ({
    type: CLOSE_VIEW_DEALTYPE_MODEL
});
/**
 * Redux Action edit services model
 */
export const opnEditDealTypeModel = (requestData) => ({
    type: OPEN_EDIT_DEALTYPE_MODEL,
      payload:requestData
});
/**
 * Redux Action edit services Success
 */
export const editDealTypeSuccess = (response) => ({
    type: OPEN_EDIT_DEALTYPE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE PRODUCT
 */
export const saveDealType = (data) => ({
    type: SAVE_DEALTYPE,
    payload : data
});
/**
 * Redux Action SAVE PRODUCT SUCCESS
 */
export const saveDealTypeSuccess = () => ({
    type: SAVE_DEALTYPE_SUCCESS,
});
/**
 * Redux Action Delete Employee
 */
export const deleteDealType = (data) => ({
    type: DELETE_DEALTYPE,
    payload:data
});
