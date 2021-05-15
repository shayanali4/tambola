/**
 * service Actions
 */

import {
  GET_SERVICES,
  GET_SERVICES_SUCCESS,

  OPEN_ADD_NEW_SERVICE_MODEL,
  CLOSE_ADD_NEW_SERVICE_MODEL,
  OPEN_ADD_NEW_SERVICE_MODEL_SUCCESS,

  OPEN_EDIT_SERVICE_MODEL,
  OPEN_EDIT_SERVICE_MODEL_SUCCESS,

  OPEN_VIEW_SERVICE_MODEL,
  OPEN_VIEW_SERVICE_MODEL_SUCCESS,
  CLOSE_VIEW_SERVICE_MODEL,

  SAVE_SERVICE,
  SAVE_SERVICE_SUCCESS,

  DELETE_SERVICE,

  SERVICE_HANDLE_CHANGE_SELECT_ALL,
  SERVICE_HANDLE_SINGLE_CHECKBOX_CHANGE,

  OPEN_ENABLEONLINESALE_SERVICE_MODEL,
  CLOSE_ENABLEONLINESALE_SERVICE_MODEL,

  OPEN_DISABLEONLINESALE_SERVICE_MODEL,
  CLOSE_DISABLEONLINESALE_SERVICE_MODEL,

  SAVE_ENABLEONLINESALE_SERVICE,
  SAVE_ENABLEONLINESALE_SERVICE_SUCCESS,
  GET_SERVICES_PARALLELLIST,
  GET_SERVICES_PARALLELLIST_SUCCESS,

  } from './types';
  /**
   * Redux Action Get services
   */
  export const getServices = (requestData) => ({
      type: GET_SERVICES,
      payload : requestData
  });
  /**
   * Redux Action Get services Success
   */
  export const getServicesSuccess = (response) => ({
      type: GET_SERVICES_SUCCESS,
      payload: response
  });

  /**
   * Redux Action OPEN View service Model
   */
export const opnAddNewServiceModel = (requestData) => ({
    type: OPEN_ADD_NEW_SERVICE_MODEL,
      payload:requestData
});
/**
 * Redux Action Open Model for new Member
 */
export const opnAddNewServiceModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_SERVICE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View service Model
 */
export const clsAddNewServiceModel = () => ({
    type: CLOSE_ADD_NEW_SERVICE_MODEL,
});
/**
 * Redux Action Open Model to view service
 */
export const opnViewServiceModel = (requestData) => ({
    type: OPEN_VIEW_SERVICE_MODEL,
      payload:requestData
});
/**
 * Redux Action view services model
 */
export const viewServiceSuccess = (response) => ({
    type: OPEN_VIEW_SERVICE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View service Model
 */
export const clsViewServiceModel = () => ({
    type: CLOSE_VIEW_SERVICE_MODEL
});
/**
 * Redux Action edit services model
 */
export const opnEditServiceModel = (requestData) => ({
    type: OPEN_EDIT_SERVICE_MODEL,
      payload:requestData
});
/**
 * Redux Action edit services Success
 */
export const editServiceSuccess = (response) => ({
    type: OPEN_EDIT_SERVICE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE PRODUCT
 */
export const saveService = (data) => ({
    type: SAVE_SERVICE,
    payload : data
});
/**
 * Redux Action SAVE PRODUCT SUCCESS
 */
export const saveServiceSuccess = () => ({
    type: SAVE_SERVICE_SUCCESS,
});
/**
 * Redux Action Delete Employee
 */
export const deleteService = (data) => ({
    type: DELETE_SERVICE,
    payload:data
});
export const servicehandlechangeSelectAll = (value) => ({
   type: SERVICE_HANDLE_CHANGE_SELECT_ALL,
   payload: {value }
})
export const servicehandleSingleCheckboxChange = (value,data, id) => ({
   type: SERVICE_HANDLE_SINGLE_CHECKBOX_CHANGE,
   payload: {value, data, id }
});

/**
 * Redux Action OPEN  Transfer Enquiry Model
 */
export const opnEnableOnlineSaleServiceModel = (data) => ({
  type: OPEN_ENABLEONLINESALE_SERVICE_MODEL,
  payload : data
});
/**
 * Redux Action close Transfer Enquiry Model
 */
export const clsEnableOnlineSaleServiceModel = () => ({
    type: CLOSE_ENABLEONLINESALE_SERVICE_MODEL,
});
/**
 * Redux Action OPEN  Transfer Enquiry Model
 */
export const opnDisableOnlineSaleServiceModel = (data) => ({
  type: OPEN_DISABLEONLINESALE_SERVICE_MODEL,
  payload : data
});
/**
 * Redux Action close Transfer Enquiry Model
 */
export const clsDisableOnlineSaleServiceModel = () => ({
    type: CLOSE_DISABLEONLINESALE_SERVICE_MODEL,
});

/**
 * Redux Action SAVE Transfer enquiry
 */
export const saveEnableOnlineSaleService = (data) => ({
    type: SAVE_ENABLEONLINESALE_SERVICE,
    payload : data
});
/**
 * Redux Action SAVE Transfer enquiry SUCCESS
 */
export const saveEnableOnlineSaleServiceSuccess = () => ({
    type: SAVE_ENABLEONLINESALE_SERVICE_SUCCESS,
});


export const getServicesParallellist = (requestData) => ({
    type: GET_SERVICES_PARALLELLIST,
    payload : requestData
});

export const getServicesParallellistSuccess = (response) => ({
    type: GET_SERVICES_PARALLELLIST_SUCCESS,
    payload: response
});
