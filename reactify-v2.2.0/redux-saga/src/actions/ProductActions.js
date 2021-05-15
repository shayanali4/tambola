/**
 * Product Actions
 */
import {
    OPEN_ADD_NEW_PRODUCT_MODEL,
    CLOSE_ADD_NEW_PRODUCT_MODEL,
    OPEN_ADD_NEW_PRODUCT_MODEL_SUCCESS,
    SAVE_PRODUCT,
    SAVE_PRODUCT_SUCCESS,
    GET_PRODUCTS,
    GET_PRODUCTS_SUCCESS,
    OPEN_EDIT_PRODUCT_MODEL,
    OPEN_EDIT_PRODUCT_MODEL_SUCCESS,
    OPEN_VIEW_PRODUCT_MODEL,
    OPEN_VIEW_PRODUCT_MODEL_SUCCESS,
    CLOSE_VIEW_PRODUCT_MODEL,
    DELETE_PRODUCT,
    ADD_PRODUCT_QUANTITY,
    OPEN_ENABLEONLINESALE_PRODUCT_MODEL,
    CLOSE_ENABLEONLINESALE_PRODUCT_MODEL,

    OPEN_DISABLEONLINESALE_PRODUCT_MODEL,
    CLOSE_DISABLEONLINESALE_PRODUCT_MODEL,

    SAVE_ENABLEONLINESALE_PRODUCT,
    SAVE_ENABLEONLINESALE_PRODUCT_SUCCESS,

    PRODUCT_HANDLE_CHANGE_SELECT_ALL,
    PRODUCT_HANDLE_SINGLE_CHECKBOX_CHANGE,
  } from './types';

export const opnAddNewProductModel = () => ({
    type: OPEN_ADD_NEW_PRODUCT_MODEL
});
/**
 * Redux Action for sdd new product model success
 */
export const opnAddNewProductModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_PRODUCT_MODEL_SUCCESS,
    payload: response
});
export const clsAddNewProductModel = () => ({
    type: CLOSE_ADD_NEW_PRODUCT_MODEL
});

export const saveProduct = (data) => ({
    type: SAVE_PRODUCT,
    payload : data
});

export const saveProductSuccess = () => ({
    type: SAVE_PRODUCT_SUCCESS,
});

export const getProducts = (data) => ({
    type: GET_PRODUCTS,
    payload : data
});

export const getProductsSuccess = (response) => ({
    type: GET_PRODUCTS_SUCCESS,
    payload: response
});

export const opnEditProductModel = (requestData) => ({
    type: OPEN_EDIT_PRODUCT_MODEL,
    payload:requestData
});

export const editProductSuccess = (response) => ({
    type: OPEN_EDIT_PRODUCT_MODEL_SUCCESS,
    payload: response
});

export const opnViewProductModel = (requestData) => ({
    type: OPEN_VIEW_PRODUCT_MODEL,
    payload: requestData
});

export const viewProductSuccess = (response) => ({
    type: OPEN_VIEW_PRODUCT_MODEL_SUCCESS,
    payload: response
});

export const clsViewProductModel = () => ({
    type: CLOSE_VIEW_PRODUCT_MODEL
});

export const deleteProduct = (data) => ({
    type: DELETE_PRODUCT,
    payload:data
});

export const addProductQuantity = (data) => ({
    type: ADD_PRODUCT_QUANTITY,
    payload : data
});

export const opnEnableOnlineSaleProductModel = (data) => ({
  type: OPEN_ENABLEONLINESALE_PRODUCT_MODEL,
  payload : data
});
/**
 * Redux Action close Transfer Enquiry Model
 */
export const clsEnableOnlineSaleProductModel = () => ({
    type: CLOSE_ENABLEONLINESALE_PRODUCT_MODEL,
});
/**
 * Redux Action OPEN  Transfer Enquiry Model
 */
export const opnDisableOnlineSaleProductModel = (data) => ({
  type: OPEN_DISABLEONLINESALE_PRODUCT_MODEL,
  payload : data
});
/**
 * Redux Action close Transfer Enquiry Model
 */
export const clsDisableOnlineSaleProductModel = () => ({
    type: CLOSE_DISABLEONLINESALE_PRODUCT_MODEL,
});

/**
 * Redux Action SAVE Transfer enquiry
 */
export const saveEnableOnlineSaleProduct = (data) => ({
    type: SAVE_ENABLEONLINESALE_PRODUCT,
    payload : data
});
/**
 * Redux Action SAVE Transfer enquiry SUCCESS
 */
export const saveEnableOnlineSaleProductSuccess = () => ({
    type: SAVE_ENABLEONLINESALE_PRODUCT_SUCCESS,
});


export const producthandlechangeSelectAll = (value) => ({
   type: PRODUCT_HANDLE_CHANGE_SELECT_ALL,
   payload: {value }
})
export const producthandleSingleCheckboxChange = (value,data, id) => ({
   type: PRODUCT_HANDLE_SINGLE_CHECKBOX_CHANGE,
   payload: {value, data, id }
});
