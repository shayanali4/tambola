/**
 * service Actions
 */

import {
  GET_STORECATEGORYS,
  GET_STORECATEGORYS_SUCCESS,

  OPEN_ADD_NEW_STORECATEGORY_MODEL,
  CLOSE_ADD_NEW_STORECATEGORY_MODEL,
  OPEN_ADD_NEW_STORECATEGORY_MODEL_SUCCESS,

  OPEN_EDIT_STORECATEGORY_MODEL,
  OPEN_EDIT_STORECATEGORY_MODEL_SUCCESS,

  OPEN_VIEW_STORECATEGORY_MODEL,
  OPEN_VIEW_STORECATEGORY_MODEL_SUCCESS,
  CLOSE_VIEW_STORECATEGORY_MODEL,

  SAVE_STORECATEGORY,
  SAVE_STORECATEGORY_SUCCESS,

  DELETE_STORECATEGORY,
  } from './types';
  /**
   * Redux Action Get services
   */
  export const getStoreCategorys = (requestData) => ({
      type: GET_STORECATEGORYS,
      payload : requestData
  });
  /**
   * Redux Action Get services Success
   */
  export const getStoreCategorysSuccess = (response) => ({
      type: GET_STORECATEGORYS_SUCCESS,
      payload: response
  });

  /**
   * Redux Action OPEN View service Model
   */
export const opnAddNewStoreCategoryModel = (requestData) => ({
    type: OPEN_ADD_NEW_STORECATEGORY_MODEL,
      payload:requestData
});
/**
 * Redux Action Open Model for new Member
 */
export const opnAddNewStoreCategoryModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_STORECATEGORY_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View service Model
 */
export const clsAddNewStoreCategoryModel = () => ({
    type: CLOSE_ADD_NEW_STORECATEGORY_MODEL,
});
/**
 * Redux Action Open Model to view service
 */
export const opnViewStoreCategoryModel = (requestData) => ({
    type: OPEN_VIEW_STORECATEGORY_MODEL,
      payload:requestData
});
/**
 * Redux Action view services model
 */
export const viewStoreCategorySuccess = (response) => ({
    type: OPEN_VIEW_STORECATEGORY_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View service Model
 */
export const clsViewStoreCategoryModel = () => ({
    type: CLOSE_VIEW_STORECATEGORY_MODEL
});
/**
 * Redux Action edit services model
 */
export const opnEditStoreCategoryModel = (requestData) => ({
    type: OPEN_EDIT_STORECATEGORY_MODEL,
      payload:requestData
});
/**
 * Redux Action edit services Success
 */
export const editStoreCategorySuccess = (response) => ({
    type: OPEN_EDIT_STORECATEGORY_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE PRODUCT
 */
export const saveStoreCategory = (data) => ({
    type: SAVE_STORECATEGORY,
    payload : data
});
/**
 * Redux Action SAVE PRODUCT SUCCESS
 */
export const saveStoreCategorySuccess = () => ({
    type: SAVE_STORECATEGORY_SUCCESS,
});
/**
 * Redux Action Delete Employee
 */
export const deleteStoreCategory = (data) => ({
    type: DELETE_STORECATEGORY,
    payload:data
});
