/**
 * Product Actions
 */
import {
    OPEN_ADD_NEW_EQUIPMENT_MODEL,
    CLOSE_ADD_NEW_EQUIPMENT_MODEL,
    SAVE_EQUIPMENT,
    SAVE_EQUIPMENT_SUCCESS,
    GET_EQUIPMENT,
    GET_EQUIPMENT_SUCCESS,
    OPEN_VIEW_EQUIPMENT_MODEL,
    OPEN_VIEW_EQUIPMENT_MODEL_SUCCESS,
    CLOSE_VIEW_EQUIPMENT_MODEL,
    OPEN_EDIT_EQUIPMENT_MODEL,
    OPEN_EDIT_EQUIPMENT_MODEL_SUCCESS,
    DELETE_EQUIPMENT,

    SAVE_EQUIPMENT_PURCHASED,
    SAVE_EQUIPMENT_PURCHASED_SUCCESS,
    GET_EQUIPMENT_INSTOCK,
    GET_EQUIPMENT_INSTOCK_SUCCESS,
    OPEN_VIEW_EQUIPMENT_INSTOCK_MODEL,
    OPEN_VIEW_EQUIPMENT_INSTOCK_MODEL_SUCCESS,
    CLOSE_VIEW_EQUIPMENT_INSTOCK_MODEL,

    OPEN_VIEW_EQUIPMENT_INSTOCK_MAINTENANCE_MODEL,
    OPEN_VIEW_EQUIPMENT_INSTOCK_MAINTENANCE_MODEL_SUCCESS,
    CLOSE_VIEW_EQUIPMENT_INSTOCK_MAINTENANCE_MODEL,
    SAVE_EQUIPMENT_INSTOCK_MAINTENANCE,
    SAVE_EQUIPMENT_INSTOCK_MAINTENANCE_SUCCESS,

    GET_EQUIPMENT_PURCHASED,
    GET_EQUIPMENT_PURCHASED_SUCCESS,
    OPEN_VIEW_EQUIPMENT_PURCHASED_MODEL,
    OPEN_VIEW_EQUIPMENT_PURCHASED_MODEL_SUCCESS,
    CLOSE_VIEW_EQUIPMENT_PURCHASED_MODEL,
    OPEN_EDIT_EQUIPMENT_PURCHASED_MODEL,
    OPEN_EDIT_EQUIPMENT_PURCHASED_MODEL_SUCCESS,
    OPEN_ADD_NEW_EQUIPMENT_PURCHASED_MODEL,
    CLOSE_ADD_NEW_EQUIPMENT_PURCHASED_MODEL,
    DELETE_EQUIPMENT_PURCHASED,


    OPEN_ADD_NEW_EQUIPMENT_BRAND_MODEL,
    CLOSE_ADD_NEW_EQUIPMENT_BRAND_MODEL,
    SAVE_EQUIPMENT_BRAND,
    SAVE_EQUIPMENT_BRAND_SUCCESS,
    GET_EQUIPMENT_BRAND,
    GET_EQUIPMENT_BRAND_SUCCESS,
    OPEN_EDIT_EQUIPMENT_BRAND_MODEL,
    DELETE_EQUIPMENT_BRAND,
  } from './types';

export const opnAddNewEquipmentModel = () => ({
    type: OPEN_ADD_NEW_EQUIPMENT_MODEL
});

export const clsAddNewEquipmentModel = () => ({
    type: CLOSE_ADD_NEW_EQUIPMENT_MODEL
});

export const saveEquipment = (data) => ({
    type: SAVE_EQUIPMENT,
    payload : data
});

export const saveEquipmentSuccess = () => ({
    type: SAVE_EQUIPMENT_SUCCESS,
});

export const getEquipment = (data) => ({
    type: GET_EQUIPMENT,
    payload : data
});

export const getEquipmentSuccess = (response) => ({
    type: GET_EQUIPMENT_SUCCESS,
    payload: response
});

export const opnViewEquipmentModel = (requestData) => ({
    type: OPEN_VIEW_EQUIPMENT_MODEL,
    payload: requestData
});

export const viewEquipmentSuccess = (response) => ({
    type: OPEN_VIEW_EQUIPMENT_MODEL_SUCCESS,
    payload: response
});

export const clsViewEquipmentModel = () => ({
    type: CLOSE_VIEW_EQUIPMENT_MODEL
});

export const opnEditEquipmentModel = (requestData) => ({
    type: OPEN_EDIT_EQUIPMENT_MODEL,
    payload:requestData
});

export const editEquipmentSuccess = (response) => ({
    type: OPEN_EDIT_EQUIPMENT_MODEL_SUCCESS,
    payload: response
});

export const deleteEquipment = (data) => ({
    type: DELETE_EQUIPMENT,
    payload:data
});

export const getEquipmentInstock = (data) => ({
    type: GET_EQUIPMENT_INSTOCK,
    payload : data
});

export const getEquipmentInstockSuccess = (response) => ({
    type: GET_EQUIPMENT_INSTOCK_SUCCESS,
    payload: response
});

export const opnViewEquipmentInstockModel = (requestData) => ({
    type: OPEN_VIEW_EQUIPMENT_INSTOCK_MODEL,
    payload: requestData
});

export const viewEquipmentInstockSuccess = (response) => ({
    type: OPEN_VIEW_EQUIPMENT_INSTOCK_MODEL_SUCCESS,
    payload: response
});

export const clsViewEquipmentInstockModel = () => ({
    type: CLOSE_VIEW_EQUIPMENT_INSTOCK_MODEL
});


export const opnAddNewEquipmentBrandModel = () => ({
    type: OPEN_ADD_NEW_EQUIPMENT_BRAND_MODEL
});

export const clsAddNewEquipmentBrandModel = () => ({
    type: CLOSE_ADD_NEW_EQUIPMENT_BRAND_MODEL
});

export const saveEquipmentBrand = (data) => ({
    type: SAVE_EQUIPMENT_BRAND,
    payload : data
});

export const saveEquipmentBrandSuccess = () => ({
    type: SAVE_EQUIPMENT_BRAND_SUCCESS,
});

export const getEquipmentBrand = (data) => ({
    type: GET_EQUIPMENT_BRAND,
    payload : data
});

export const getEquipmentBrandSuccess = (response) => ({
    type: GET_EQUIPMENT_BRAND_SUCCESS,
    payload: response
});

export const opnEditEquipmentBrandModel = (requestData) => ({
    type: OPEN_EDIT_EQUIPMENT_BRAND_MODEL,
    payload:requestData
});

export const deleteEquipmentBrand = (data) => ({
    type: DELETE_EQUIPMENT_BRAND,
    payload:data
});


export const getEquipmentPurchased = (data) => ({
    type: GET_EQUIPMENT_PURCHASED,
    payload : data
});

export const getEquipmentPurchasedSuccess = (response) => ({
    type: GET_EQUIPMENT_PURCHASED_SUCCESS,
    payload: response
});


export const opnViewEquipmentPurchasedModel = (requestData) => ({
    type: OPEN_VIEW_EQUIPMENT_PURCHASED_MODEL,
    payload: requestData
});

export const viewEquipmentPurchasedSuccess = (response) => ({
    type: OPEN_VIEW_EQUIPMENT_PURCHASED_MODEL_SUCCESS,
    payload: response
});

export const clsViewEquipmentPurchasedModel = () => ({
    type: CLOSE_VIEW_EQUIPMENT_PURCHASED_MODEL
});


export const opnEditEquipmentPurchasedModel = (requestData) => ({
    type: OPEN_EDIT_EQUIPMENT_PURCHASED_MODEL,
    payload:requestData
});

export const editEquipmentPurchasedSuccess = (response) => ({
    type: OPEN_EDIT_EQUIPMENT_PURCHASED_MODEL_SUCCESS,
    payload: response
});


export const opnAddNewEquipmentPurchasedModel = () => ({
    type: OPEN_ADD_NEW_EQUIPMENT_PURCHASED_MODEL
});

export const clsAddNewEquipmentPurchasedModel = () => ({
    type: CLOSE_ADD_NEW_EQUIPMENT_PURCHASED_MODEL
});

export const saveEquipmentPurchased = (data) => ({
    type: SAVE_EQUIPMENT_PURCHASED,
    payload : data
});

export const saveEquipmentPurchasedSuccess = () => ({
    type: SAVE_EQUIPMENT_PURCHASED_SUCCESS,
});


export const deleteEquipmentPurchased = (data) => ({
    type: DELETE_EQUIPMENT_PURCHASED,
    payload:data
});



export const opnViewEquipmentinstockMaintenanceModel = (requestData) => ({
    type: OPEN_VIEW_EQUIPMENT_INSTOCK_MAINTENANCE_MODEL,
      payload:requestData
});

export const viewEquipmentinstockMaintenanceSuccess = (response) => ({
    type: OPEN_VIEW_EQUIPMENT_INSTOCK_MAINTENANCE_MODEL_SUCCESS,
    payload: response
});

export const clsViewEquipmentinstockMaintenanceModel = () => ({
    type: CLOSE_VIEW_EQUIPMENT_INSTOCK_MAINTENANCE_MODEL
});

export const saveEquipmentinstockMaintenance = (data) => ({
    type: SAVE_EQUIPMENT_INSTOCK_MAINTENANCE,
    payload : data
});

export const saveEquipmentinstockMaintenanceSuccess = () => ({
    type: SAVE_EQUIPMENT_INSTOCK_MAINTENANCE_SUCCESS,
});
