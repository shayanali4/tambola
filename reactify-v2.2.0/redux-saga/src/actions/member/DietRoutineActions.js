/**
 * Product Actions
 */
import {
    GET_MEMBER_DIET_ROUTINE,
    GET_MEMBER_DIET_ROUTINE_SUCCESS,
    OPEN_MEMBER_ADD_NEW_DIET_ROUTINE_MODEL,
    CLOSE_MEMBER_ADD_NEW_DIET_ROUTINE_MODEL,
    SAVE_MEMBER_DIET_ROUTINE,
    SAVE_MEMBER_DIET_ROUTINE_SUCCESS,
    OPEN_MEMBER_EDIT_DIET_ROUTINE_MODEL,
    OPEN_MEMBER_EDIT_DIET_ROUTINE_MODEL_SUCCESS,
    OPEN_MEMBER_VIEW_DIET_ROUTINE_MODEL,
    OPEN_MEMBER_VIEW_DIET_ROUTINE_MODEL_SUCCESS,
    CLOSE_MEMBER_VIEW_DIET_ROUTINE_MODEL,
    DELETE_MEMBER_DIET_ROUTINE,
    SAVE_MEMBER_DIET_ROUTINE_ACTIVE,
    SAVE_MEMBER_DIET_ROUTINE_ACTIVE_SUCCESS,
  } from '../types';


export const getMemberDietRoutine = (data) => ({
    type: GET_MEMBER_DIET_ROUTINE,
    payload : data
});

export const getMemberDietRoutineSuccess = (response) => ({
    type: GET_MEMBER_DIET_ROUTINE_SUCCESS,
    payload: response
});

export const opnMemberAddNewDietRoutineModel = () => ({
    type: OPEN_MEMBER_ADD_NEW_DIET_ROUTINE_MODEL
});

export const clsMemberAddNewDietRoutineModel = () => ({
    type: CLOSE_MEMBER_ADD_NEW_DIET_ROUTINE_MODEL
});

export const saveMemberDietRoutine = (data) => ({
    type: SAVE_MEMBER_DIET_ROUTINE,
    payload : data
});

export const saveMemberDietRoutineSuccess = () => ({
    type: SAVE_MEMBER_DIET_ROUTINE_SUCCESS,
});

export const opnMemberEditDietRoutineModel = (requestData) => ({
    type: OPEN_MEMBER_EDIT_DIET_ROUTINE_MODEL,
    payload:requestData
});

export const editMemberDietRoutineSuccess = (response) => ({
    type: OPEN_MEMBER_EDIT_DIET_ROUTINE_MODEL_SUCCESS,
    payload: response
});

export const opnMemberViewDietRoutineModel = (requestData) => ({
    type: OPEN_MEMBER_VIEW_DIET_ROUTINE_MODEL,
    payload: requestData
});

export const viewMemberDietRoutineSuccess = (response) => ({
    type: OPEN_MEMBER_VIEW_DIET_ROUTINE_MODEL_SUCCESS,
    payload: response
});

export const clsMemberViewDietRoutineModel = () => ({
    type: CLOSE_MEMBER_VIEW_DIET_ROUTINE_MODEL
});

export const deleteMemberDietRoutine = (data) => ({
    type: DELETE_MEMBER_DIET_ROUTINE,
    payload:data
});
export const saveMemberDietRoutineActive = (data) => ({
    type: SAVE_MEMBER_DIET_ROUTINE_ACTIVE,
    payload : data
});

export const saveMemberDietRoutineActiveSuccess = () => ({
    type: SAVE_MEMBER_DIET_ROUTINE_ACTIVE_SUCCESS,
});
