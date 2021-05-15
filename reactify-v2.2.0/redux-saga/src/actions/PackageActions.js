/**
 * service Actions
 */

import {
  OPEN_ADD_NEW_PACKAGE_MODEL,
  CLOSE_ADD_NEW_PACKAGE_MODEL,
  OPEN_ADD_NEW_PACKAGE_MODEL_SUCCESS,

  SAVE_PACKAGE,
  SAVE_PACKAGE_SUCCESS,

  GET_PACKAGES_SUCCESS,
  GET_PACKAGES,

  OPEN_VIEW_PACKAGE_MODEL,
  OPEN_VIEW_PACKAGE_MODEL_SUCCESS,
  CLOSE_VIEW_PACKAGE_MODEL,

  OPEN_EDIT_PACKAGE_MODEL,
  OPEN_EDIT_PACKAGE_MODEL_SUCCESS,

  DELETE_PACKAGE
} from './types';

  /**
   * Redux Action OPEN View service Model
   */
export const opnAddNewPackageModel = (request) => ({
    type: OPEN_ADD_NEW_PACKAGE_MODEL,
    payload:request
});
/**
 * Redux Action close View service Model
 */
export const clsAddNewPackageModel = () => ({
    type: CLOSE_ADD_NEW_PACKAGE_MODEL,
});
/**
 * Redux Action Open Model for new Member
 */
export const opnAddNewPackageModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_PACKAGE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action Get package
 */
export const getPackages = (data) => ({
    type: GET_PACKAGES,
    payload : data
});

/**
 * Redux Action Get package Success
 */
export const getPackagesSuccess = (response) => ({
    type: GET_PACKAGES_SUCCESS,
    payload: response
});

/**
 * Redux Action SAVE Package
 */
export const savePackage = (data) => ({
    type: SAVE_PACKAGE,
    payload : data
});
/**
 * Redux Action SAVE Package SUCCESS
 */
export const savePackageSuccess = () => ({
    type: SAVE_PACKAGE_SUCCESS,
});
/**
 * Redux Action Open Model to view package
 */
export const opnViewPackageModel = (requestData) => ({
    type: OPEN_VIEW_PACKAGE_MODEL,
      payload:requestData
});
/**
 * Redux Action Get package  Success
 */
export const viewPackageSuccess = (response) => ({
    type: OPEN_VIEW_PACKAGE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View package Model
 */
export const clsViewPackageModel = () => ({
    type: CLOSE_VIEW_PACKAGE_MODEL
});


/**
 * Redux Action edit package  model
 */
export const opnEditPackageModel = (requestData) => ({
    type: OPEN_EDIT_PACKAGE_MODEL,
      payload:requestData
});
/**
 * Redux Action edit package Success
 */
export const editPackageSuccess = (response) => ({
    type: OPEN_EDIT_PACKAGE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action Delete Employee
 */
export const deletePackage = (data) => ({
    type: DELETE_PACKAGE,
    payload:data
});
