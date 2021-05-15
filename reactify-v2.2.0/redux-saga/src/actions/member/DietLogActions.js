/**
 * Redux App Settings Actions
 */
import {
    MEMBER_ACTIVE_DIET_ROUTINE,
    MEMBER_ACTIVE_DIET_ROUTINE_SUCCESS,
    SAVE_MEMBER_DIET_LOG,
    SAVE_MEMBER_DIET_LOG_SUCCESS,
    DELETE_MEMBER_DIET_LOG,
    OPEN_MEMBER_DIET_LOG_MODEL,
    CLOSE_MEMBER_DIET_LOG_MODEL,
    VIEW_MEMBER_DIET_LOG,
    VIEW_MEMBER_DIET_LOG_SUCCESS,
} from '../types';

export const memberActiveDietRoutine = (data) => ({
    type: MEMBER_ACTIVE_DIET_ROUTINE,
    payload : data
});

export const memberActiveDietRoutineSuccess = (response) => ({
    type: MEMBER_ACTIVE_DIET_ROUTINE_SUCCESS,
    payload: response
});
export const saveMemberDietLog = (data) => ({
    type: SAVE_MEMBER_DIET_LOG,
    payload : data
});

export const saveMemberDietLogSuccess = () => ({
    type: SAVE_MEMBER_DIET_LOG_SUCCESS,
});
export const deleteMemberDietLog = (data) => ({
    type: DELETE_MEMBER_DIET_LOG,
    payload:data
});
/**
 * Redux Action OPEN dietlog Model
 */
export const opnAddNewMemberDietLogModel = () => ({
  type: OPEN_MEMBER_DIET_LOG_MODEL,
});
/**
* Redux Action close dietlog Model
*/
export const clsAddNewMemberDietLogModel = () => ({
  type: CLOSE_MEMBER_DIET_LOG_MODEL,
});
export const viewMemberDietLog = (requestData) => ({
    type: VIEW_MEMBER_DIET_LOG,
    payload: requestData
});

export const viewMemberDietLogSuccess = (response) => ({
    type: VIEW_MEMBER_DIET_LOG_SUCCESS,
    payload: response
});
