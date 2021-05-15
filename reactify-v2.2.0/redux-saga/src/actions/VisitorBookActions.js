/**
 * Product Actions
 */
import {
    OPEN_ADD_NEW_VISITOR_MODEL,
    OPEN_ADD_NEW_VISITOR_MODEL_SUCCESS,
    CLOSE_ADD_NEW_VISITOR_MODEL,
    SAVE_VISITOR,
    SAVE_VISITOR_SUCCESS,
    GET_VISITORS,
    GET_VISITORS_SUCCESS,
    SAVE_VISITOR_OUTTIME,
    OPEN_VIEW_VISITOR_MODEL,
    OPEN_VIEW_VISITOR_MODEL_SUCCESS,
    CLOSE_VIEW_VISITOR_MODEL,
    BOOK_GYM_ACCESSSLOT_MEMBER_VISITOR,
    BOOK_GYM_ACCESSSLOT_MEMBER_VISITOR_SUCCESS,
    GET_MEMBER_GYM_ACCESSSLOT,
    GET_MEMBER_GYM_ACCESSSLOT_SUCCESS,
    OPEN_EDIT_VISITOR_MODEL,
    OPEN_EDIT_VISITOR_MODEL_SUCCESS,
  } from './types';

export const opnAddNewVisitorModel = (data) => ({
    type: OPEN_ADD_NEW_VISITOR_MODEL,
    payload : data
});

export const opnAddNewVisitorModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_VISITOR_MODEL_SUCCESS,
    payload: response
});

export const clsAddNewVisitorModel = () => ({
    type: CLOSE_ADD_NEW_VISITOR_MODEL
});

export const saveVisitor = (data) => ({
    type: SAVE_VISITOR,
    payload : data
});

export const saveVisitorSuccess = () => ({
    type: SAVE_VISITOR_SUCCESS,
});

export const getVisitors = (data) => ({
    type: GET_VISITORS,
    payload : data
});

export const getVisitorsSuccess = (response) => ({
    type: GET_VISITORS_SUCCESS,
    payload: response
});

export const saveVisitorOuttime = (data) => ({
    type: SAVE_VISITOR_OUTTIME,
    payload:data
});

export const opnViewVisitorModel = (requestData) => ({
    type: OPEN_VIEW_VISITOR_MODEL,
    payload: requestData
});

export const viewVisitorSuccess = (response) => ({
    type: OPEN_VIEW_VISITOR_MODEL_SUCCESS,
    payload: response
});

export const clsViewVisitorModel = () => ({
    type: CLOSE_VIEW_VISITOR_MODEL
});

export const bookGymAccessSlotMemberVisitor = (data) => ({
    type: BOOK_GYM_ACCESSSLOT_MEMBER_VISITOR,
    payload : data
});


export const bookGymAccessSlotMemberVisitorSuccess = (response) => ({
    type: BOOK_GYM_ACCESSSLOT_MEMBER_VISITOR_SUCCESS,
    payload: response
});


export const getMemberGymAccessSlot = (requestData) => ({
    type: GET_MEMBER_GYM_ACCESSSLOT,
    payload:requestData
});

export const getMemberGymAccessSlotSuccess = (response) => ({
    type: GET_MEMBER_GYM_ACCESSSLOT_SUCCESS,
    payload: response
});


export const opnEditVisitorModel = (requestData) => ({
    type: OPEN_EDIT_VISITOR_MODEL,
      payload:requestData
});

export const editVisitorSuccess = (response) => ({
    type: OPEN_EDIT_VISITOR_MODEL_SUCCESS,
    payload: response
});
