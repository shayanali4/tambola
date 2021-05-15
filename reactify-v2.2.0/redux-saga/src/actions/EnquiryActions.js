/**
 * ENQUIRY Actions
 */

import {
GET_ENQUIRY,
GET_ENQUIRY_SUCCESS,

OPEN_ADD_NEW_ENQUIRY_MODEL,
OPEN_ADD_NEW_ENQUIRY_MODEL_SUCCESS,
CLOSE_ADD_NEW_ENQUIRY_MODEL,

OPEN_EDIT_ENQUIRY_MODEL,
OPEN_EDIT_ENQUIRY_MODEL_SUCCESS,

OPEN_VIEW_ENQUIRY_MODEL,
OPEN_VIEW_ENQUIRY_MODEL_SUCCESS,
CLOSE_VIEW_ENQUIRY_MODEL,

SAVE_ENQUIRY,
SAVE_ENQUIRY_SUCCESS,

DELETE_ENQUIRY,

SERVICE_LIST_IN_ENQUIRY,
SERVICE_LIST_IN_ENQUIRY_SUCCESS,

OPEN_VIEW_ENQUIRY_STATUS_MODEL,
OPEN_VIEW_ENQUIRY_STATUS_MODEL_SUCCESS,
CLOSE_VIEW_ENQUIRY_STATUS_MODEL,

SAVE_ENQUIRY_STATUS,
SAVE_ENQUIRY_STATUS_SUCCESS,

IMPORT_ENQUIRY,
IMPORT_ENQUIRY_SUCCESS,
IMPORT_ENQUIRY_LIST,
IMPORT_ENQUIRY_LIST_SUCCESS,

HANDLE_CHANGE_SELECT_ALL,
HANDLE_SINGLE_CHECKBOX_CHANGE,

OPEN_TRANSFER_ENQUIRY_MODEL,
CLOSE_TRANSFER_ENQUIRY_MODEL,

SAVE_TRANSFER_ENQUIRY,
SAVE_TRANSFER_ENQUIRY_SUCCESS
} from './types';
/**
 * Redux Action Get ENQUIRY
 */
export const getEnquiry = (data) => ({
    type: GET_ENQUIRY,
    payload : data
});

/**
 * Redux Action Get ENQUIRY Success
 */
export const getEnquirySuccess = (response) => ({
    type: GET_ENQUIRY_SUCCESS,
    payload: response
});
/**
 * Redux Action OPEN View service Model
 */
export const opnAddNewEnquiryModel = () => ({
  type: OPEN_ADD_NEW_ENQUIRY_MODEL,
});
/**
 * Redux Action Open Model for new Member
 */
export const opnAddNewEnquiryModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_ENQUIRY_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View service Model
 */
export const clsAddNewEnquiryModel = () => ({
    type: CLOSE_ADD_NEW_ENQUIRY_MODEL,
});
/**
 * Redux Action SAVE PRODUCT
 */
export const saveEnquiry = (data) => ({
    type: SAVE_ENQUIRY,
    payload : data
});
/**
 * Redux Action SAVE PRODUCT SUCCESS
 */
export const saveEnquirySuccess = () => ({
    type: SAVE_ENQUIRY_SUCCESS,
});
/**
 * Redux Action Open Model to view Enquiry
 */
export const opnViewEnquiryModel = (requestData) => ({
    type: OPEN_VIEW_ENQUIRY_MODEL,
      payload:requestData
});
/**
 * Redux Action Get Enquiry Success
 */
export const viewEnquirySuccess = (response) => ({
    type: OPEN_VIEW_ENQUIRY_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View Enquiry Model
 */
export const clsViewEnquiryModel = () => ({
    type: CLOSE_VIEW_ENQUIRY_MODEL
});

/**
 * Redux Action Delete Employee
 */
export const deleteEnquiry = (data) => ({
    type: DELETE_ENQUIRY,
    payload:data
});
/**
 * Redux Action edit enquiry  model
 */
export const opnEditEnquiryModel = (requestData) => ({
    type: OPEN_EDIT_ENQUIRY_MODEL,
      payload:requestData
});
/**
 * Redux Action edit enquiry Success
 */
export const editEnquirySuccess = (response) => ({
    type: OPEN_EDIT_ENQUIRY_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action Open Model for new Member
 */
export const serviceListInEnquiry = (data) => ({
    type: SERVICE_LIST_IN_ENQUIRY,
    payload: data
});


/**
 * Redux Action Open Model for new Member
 */
export const serviceListInEnquirySuccess = (response) => ({
    type: SERVICE_LIST_IN_ENQUIRY_SUCCESS,
    payload: response
});

export const opnViewEnquiryStatusModel = (requestData) => ({
    type: OPEN_VIEW_ENQUIRY_STATUS_MODEL,
      payload:requestData
});

export const viewEnquiryStatusSuccess = (response) => ({
    type: OPEN_VIEW_ENQUIRY_STATUS_MODEL_SUCCESS,
    payload: response
});

export const clsViewEnquiryStatusModel = () => ({
    type: CLOSE_VIEW_ENQUIRY_STATUS_MODEL
});

export const saveEnquiryStatus = (data) => ({
    type: SAVE_ENQUIRY_STATUS,
    payload : data
});

export const saveEnquiryStatusSuccess = () => ({
    type: SAVE_ENQUIRY_STATUS_SUCCESS,
});

export const importEnquiry = (data) => ({
    type: IMPORT_ENQUIRY,
    payload : data
});

export const importEnquirySuccess = (response) => ({
    type: IMPORT_ENQUIRY_SUCCESS,
    payload: response
});

export const importEnquiryList = (data) => ({
    type: IMPORT_ENQUIRY_LIST,
    payload : data
});

export const importEnquiryListSuccess = (response) => ({
    type: IMPORT_ENQUIRY_LIST_SUCCESS,
    payload: response
});

export const handleChangeSelectAll = (value) => ({
   type: HANDLE_CHANGE_SELECT_ALL,
   payload: {value }
})
export const handleSingleCheckboxChange = (value,data, id) => ({
   type: HANDLE_SINGLE_CHECKBOX_CHANGE,
   payload: {value, data, id }
});


/**
 * Redux Action OPEN  Transfer Enquiry Model
 */
export const opnTransferEnquiryModel = (data) => ({
  type: OPEN_TRANSFER_ENQUIRY_MODEL,
  payload : data
});
/**
 * Redux Action close Transfer Enquiry Model
 */
export const clsTransferEnquiryModel = () => ({
    type: CLOSE_TRANSFER_ENQUIRY_MODEL,
});
/**
 * Redux Action SAVE Transfer enquiry
 */
export const saveTransferEnquiry = (data) => ({
    type: SAVE_TRANSFER_ENQUIRY,
    payload : data
});
/**
 * Redux Action SAVE Transfer enquiry SUCCESS
 */
export const saveTransferEnquirySuccess = () => ({
    type: SAVE_TRANSFER_ENQUIRY_SUCCESS,
});
