/**
 * Redux App Settings Actions
 */
import {
    SAVE_MEMBER_WATER_GOAL,
    SAVE_MEMBER_WATER_LOG,
    OPEN_MEMBER_VIEW_WATER_LOG_MODEL,
    OPEN_MEMBER_VIEW_WATER_LOG_MODEL_SUCCESS,
    CLOSE_MEMBER_VIEW_WATER_LOG_MODEL,
    DELETE_MEMBER_WATER_LOG,
    GET_MEMBER_TODAYCONSUMEDWATER,
    GET_MEMBER_TODAYCONSUMEDWATER_SUCCESS
} from '../types';


export const saveMemberWaterGoal = (data) => ({
    type: SAVE_MEMBER_WATER_GOAL,
    payload : data
});

export const saveMemberWaterLog = (data) => ({
    type: SAVE_MEMBER_WATER_LOG,
    payload : data
});
/**
 * Redux Action Open Model to view Enquiry
 */
export const opnMemberViewWaterLogModel = (requestData) => ({
    type: OPEN_MEMBER_VIEW_WATER_LOG_MODEL,
      payload:requestData
});
/**
 * Redux Action Get Enquiry Success
 */
export const opnMemberViewWaterLogModelSuccess = (response) => ({
    type: OPEN_MEMBER_VIEW_WATER_LOG_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View Enquiry Model
 */
export const clsnMemberViewWaterLogModel = () => ({
    type: CLOSE_MEMBER_VIEW_WATER_LOG_MODEL
});
export const deleteMemberWaterLog = (data) => ({
    type: DELETE_MEMBER_WATER_LOG,
    payload:data
});
export const getMemberTodayConsumedWater = (data) => ({
    type: GET_MEMBER_TODAYCONSUMEDWATER,
    payload : data
});

export const getMemberTodayConsumedWaterSuccess = (response) => ({
    type: GET_MEMBER_TODAYCONSUMEDWATER_SUCCESS,
    payload: response
});
