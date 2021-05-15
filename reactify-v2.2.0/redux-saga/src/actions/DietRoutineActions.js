/**
 * Product Actions
 */
import {
    OPEN_ADD_NEW_DIET_ROUTINE_MODEL,
    CLOSE_ADD_NEW_DIET_ROUTINE_MODEL,
    SAVE_DIET_ROUTINE,
    SAVE_DIET_ROUTINE_SUCCESS,
    GET_DIET_ROUTINES,
    GET_DIET_ROUTINES_SUCCESS,
    OPEN_EDIT_DIET_ROUTINE_MODEL,
    OPEN_EDIT_DIET_ROUTINE_MODEL_SUCCESS,
    OPEN_VIEW_DIET_ROUTINE_MODEL,
    OPEN_VIEW_DIET_ROUTINE_MODEL_SUCCESS,
    CLOSE_VIEW_DIET_ROUTINE_MODEL,
    DELETE_DIET_ROUTINE
  } from './types';

export const opnAddNewDietRoutineModel = () => ({
    type: OPEN_ADD_NEW_DIET_ROUTINE_MODEL
});

export const clsAddNewDietRoutineModel = () => ({
    type: CLOSE_ADD_NEW_DIET_ROUTINE_MODEL
});
export const saveDietRoutine = (data) => ({
    type: SAVE_DIET_ROUTINE,
    payload : data
});

export const saveDietRoutineSuccess = () => ({
    type: SAVE_DIET_ROUTINE_SUCCESS,
});
export const getDietRoutines = (data) => ({
    type: GET_DIET_ROUTINES,
    payload : data
});

export const getDietRoutinesSuccess = (response) => ({
    type: GET_DIET_ROUTINES_SUCCESS,
    payload: response
});
export const opnEditDietRoutineModel = (requestData) => ({
    type: OPEN_EDIT_DIET_ROUTINE_MODEL,
    payload:requestData
});

export const editDietRoutineSuccess = (response) => ({
    type: OPEN_EDIT_DIET_ROUTINE_MODEL_SUCCESS,
    payload: response
});

export const opnViewDietRoutineModel = (requestData) => ({
    type: OPEN_VIEW_DIET_ROUTINE_MODEL,
    payload: requestData
});

export const viewDietRoutineSuccess = (response) => ({
    type: OPEN_VIEW_DIET_ROUTINE_MODEL_SUCCESS,
    payload: response
});

export const clsViewDietRoutineModel = () => ({
    type: CLOSE_VIEW_DIET_ROUTINE_MODEL
});
export const deleteDietRoutine = (data) => ({
    type: DELETE_DIET_ROUTINE,
    payload:data
});
