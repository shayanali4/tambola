/**
 * Product Actions
 */
import {
    OPEN_ADD_NEW_BROADCAST_MODEL,
    CLOSE_ADD_NEW_BROADCAST_MODEL,
    OPEN_ADD_NEW_BROADCAST_MODEL_SUCCESS,
    SAVE_BROADCAST,
    SAVE_BROADCAST_SUCCESS,
    GET_BROADCAST,
    GET_BROADCAST_SUCCESS,
    OPEN_VIEW_BROADCAST_MODEL,
    OPEN_VIEW_BROADCAST_MODEL_SUCCESS,
    CLOSE_VIEW_BROADCAST_MODEL,
  } from './types';

export const opnAddNewBroadcastModel = () => ({
    type: OPEN_ADD_NEW_BROADCAST_MODEL
});
/**
 * Redux Action for sdd new product model success
 */
export const opnAddNewBroadcastModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_BROADCAST_MODEL_SUCCESS,
    payload: response
});
export const clsAddNewBroadcastModel = () => ({
    type: CLOSE_ADD_NEW_BROADCAST_MODEL
});

export const saveBroadcast = (data) => ({
    type: SAVE_BROADCAST,
    payload : data
});

export const saveBroadcastSuccess = () => ({
    type: SAVE_BROADCAST_SUCCESS,
});

export const getBroadcast = (data) => ({
    type: GET_BROADCAST,
    payload : data
});

export const getBroadcastSuccess = (response) => ({
    type: GET_BROADCAST_SUCCESS,
    payload: response
});

export const opnViewBroadcastModel = (requestData) => ({
    type: OPEN_VIEW_BROADCAST_MODEL,
      payload:requestData
});

export const viewBroadcastSuccess = (response) => ({
    type: OPEN_VIEW_BROADCAST_MODEL_SUCCESS,
    payload: response
});

export const clsViewBroadcastModel = () => ({
    type: CLOSE_VIEW_BROADCAST_MODEL
});
