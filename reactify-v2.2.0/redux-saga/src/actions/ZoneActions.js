/**
 * Todo App Actions
 */
import {
OPEN_ADD_NEW_ZONE_MODEL,
OPEN_ADD_NEW_ZONE_MODEL_SUCCESS,
CLOSE_ADD_NEW_ZONE_MODEL,

GET_ZONES,
GET_ZONES_SUCCESS,

SAVE_ZONE,
SAVE_ZONE_SUCCESS,

OPEN_VIEW_ZONE_MODEL,
OPEN_VIEW_ZONE_MODEL_SUCCESS,
CLOSE_VIEW_ZONE_MODEL,

OPEN_EDIT_ZONE_MODEL,
OPEN_EDIT_ZONE_MODEL_SUCCESS,

DELETE_ZONE,
}from './types';
/**
 * Redux Action OPEN View zone Model
 */
export const opnAddNewZoneModel = () => ({
  type: OPEN_ADD_NEW_ZONE_MODEL,
});
/**
 * Redux Action Open Model for new zone
 */
export const opnAddNewZoneModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_ZONE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View zone Model
 */
export const clsAddNewZoneModel = () => ({
    type: CLOSE_ADD_NEW_ZONE_MODEL,
});

/**
 * Redux Action Get ZONES
 */
export const getZones = (data) => ({
    type: GET_ZONES,
    payload : data
});

/**
 * Redux Action Get ZONES Success
 */
export const getZonesSuccess = (response) => ({
    type: GET_ZONES_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE zone
 */
export const saveZone = (data) => ({
    type: SAVE_ZONE,
    payload : data
});
/**
 * Redux Action SAVE zone SUCCESS
 */
export const saveZoneSuccess = () => ({
    type: SAVE_ZONE_SUCCESS,
});

/**
 * Redux Action Open Model to view Zone
 */
export const opnViewZoneModel = (requestData) => ({
    type: OPEN_VIEW_ZONE_MODEL,
      payload:requestData
});
/**
 * Redux Action Get zone Success
 */
export const viewZoneSuccess = (response) => ({
    type: OPEN_VIEW_ZONE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View zone Model
 */
export const clsViewZoneModel = () => ({
    type: CLOSE_VIEW_ZONE_MODEL
});
/**
 * Redux Action edit zone  model
 */
export const opnEditZoneModel = (requestData) => ({
    type: OPEN_EDIT_ZONE_MODEL,
      payload:requestData
});
/**
 * Redux Action edit zone Success
 */
export const editZoneSuccess = (response) => ({
    type: OPEN_EDIT_ZONE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action Delete zone
 */
export const deleteZone = (data) => ({
    type: DELETE_ZONE,
    payload:data
});
