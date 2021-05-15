/**
 * store Actions
 */

import {
  GET_STORES,
  GET_STORES_SUCCESS,

  OPEN_ADD_NEW_STORE_MODEL,
  CLOSE_ADD_NEW_STORE_MODEL,
  OPEN_ADD_NEW_STORE_MODEL_SUCCESS,

  OPEN_EDIT_STORE_MODEL,
  OPEN_EDIT_STORE_MODEL_SUCCESS,

  OPEN_VIEW_STORE_MODEL,
  OPEN_VIEW_STORE_MODEL_SUCCESS,
  CLOSE_VIEW_STORE_MODEL,

  SAVE_STORE,
  SAVE_STORE_SUCCESS,

  DELETE_STORE,
  } from './types';
  /**
   * Redux Action Get stores
   */
  export const getStores = (requestData) => ({
      type: GET_STORES,
      payload : requestData
  });
  /**
   * Redux Action Get stores Success
   */
  export const getStoresSuccess = (response) => ({
      type: GET_STORES_SUCCESS,
      payload: response
  });

  /**
   * Redux Action OPEN View store Model
   */
export const opnAddNewStoreModel = (requestData) => ({
    type: OPEN_ADD_NEW_STORE_MODEL,
      payload:requestData
});
/**
 * Redux Action Open Model for new Member
 */
export const opnAddNewStoreModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_STORE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View store Model
 */
export const clsAddNewStoreModel = () => ({
    type: CLOSE_ADD_NEW_STORE_MODEL,
});
/**
 * Redux Action Open Model to view store
 */
export const opnViewStoreModel = (requestData) => ({
    type: OPEN_VIEW_STORE_MODEL,
      payload:requestData
});
/**
 * Redux Action view stores model
 */
export const viewStoreSuccess = (response) => ({
    type: OPEN_VIEW_STORE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View store Model
 */
export const clsViewStoreModel = () => ({
    type: CLOSE_VIEW_STORE_MODEL
});
/**
 * Redux Action edit stores model
 */
export const opnEditStoreModel = (requestData) => ({
    type: OPEN_EDIT_STORE_MODEL,
      payload:requestData
});
/**
 * Redux Action edit stores Success
 */
export const editStoreSuccess = (response) => ({
    type: OPEN_EDIT_STORE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE PRODUCT
 */
export const saveStore = (data) => ({
    type: SAVE_STORE,
    payload : data
});
/**
 * Redux Action SAVE PRODUCT SUCCESS
 */
export const saveStoreSuccess = () => ({
    type: SAVE_STORE_SUCCESS,
});
/**
 * Redux Action Delete Employee
 */
export const deleteStore = (data) => ({
    type: DELETE_STORE,
    payload:data
});
