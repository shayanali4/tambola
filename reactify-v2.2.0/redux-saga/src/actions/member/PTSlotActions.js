/**
 * Redux App Settings Actions
 */
import {
    SAVE_MEMBER_PTSLOT,
    SAVE_MEMBER_PTSLOT_SUCCESS,
    DELETE_MEMBER_PT_SLOT,
    DELETE_MEMBER_PT_SLOT_SUCCESS,
    SAVE_MEMBER_ONLINEATTENDANCE,
} from '../types';


/**
 * Redux Action SAVE Member PT Slot
 */
export const saveMemberPTSlot = (data) => ({
    type: SAVE_MEMBER_PTSLOT,
    payload : data
});
/**
 * Redux Action SAVE Member PT Slot SUCCESS
 */
export const saveMemberPTSlotSuccess = () => ({
    type: SAVE_MEMBER_PTSLOT_SUCCESS,
});

/**
 * Redux Action Delete pt
 */
export const deleteMemberPTSlot = (data) => ({
    type: DELETE_MEMBER_PT_SLOT,
    payload:data
});
/**
 * Redux Action Delete PT SLOT SUCCESS
 */
export const deleteMemberPTSuccess = () => ({
    type: DELETE_MEMBER_PT_SLOT_SUCCESS,
});


export const saveMemberOnlineAttendance = (requestData) => ({
    type: SAVE_MEMBER_ONLINEATTENDANCE,
    payload : requestData
});
