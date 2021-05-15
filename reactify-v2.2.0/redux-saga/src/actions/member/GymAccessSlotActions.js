/**
 * Redux App Settings Actions
 */
import {
    SAVE_MEMBER_GYMACCESSSLOT,
    SAVE_MEMBER_GYMACCESSSLOT_SUCCESS,
    DELETE_MEMBER_GYM_ACCESS_SLOT,
    DELETE_MEMBER_GYM_ACCESS_SLOT_SUCCESS,
} from '../types';


/**
 * Redux Action SAVE Member Gym Access Slot
 */
export const saveMemberGymAccessSlot = (data) => ({
    type: SAVE_MEMBER_GYMACCESSSLOT,
    payload : data
});
/**
 * Redux Action SAVE Member Gym Access Slot SUCCESS
 */
export const saveMemberGymAccessSlotSuccess = () => ({
    type: SAVE_MEMBER_GYMACCESSSLOT_SUCCESS,
});
/**
 * Redux Action Delete gym access slot
 */
export const deleteMemberGymAccessSlot = (data) => ({
    type: DELETE_MEMBER_GYM_ACCESS_SLOT,
    payload:data
});
/**
 * Redux Action Delete gym access slot SUCCESS
 */
export const deleteMemberGymAccessSlotSuccess = () => ({
    type: DELETE_MEMBER_GYM_ACCESS_SLOT_SUCCESS,
});
