/**
 * Redux App gym access slot Actions
 */
import {
    OPEN_VIEW_GYM_ACCESS_SLOT_MODEL,
    OPEN_VIEW_GYM_ACCESS_SLOT_MODEL_SUCCESS,
    CLOSE_VIEW_GYM_ACCESS_SLOT_MODEL,
    DELETE_GYM_ACCESS_SLOT,
    CHANGE_GYM_ACCESS_SLOT,
    CHANGE_SAVE_MEMBER_GYMACCESSSLOT,
    CHANGE_SAVE_MEMBER_GYMACCESSSLOT_SUCCESS,
    CHANGE_SAVE_MEMBER_GYMACCESSSLOT_FAILURE
} from './types';

/**
 * Redux Action opn view  gym access slot model
 */
export const opnViewGymAccessSlotmodel = (requestData) => ({
    type: OPEN_VIEW_GYM_ACCESS_SLOT_MODEL,
    payload: requestData
});
/**
* Redux Action opn view  gym access slot model success
 */

export const viewGymAccessSlotSuccess = (response) => ({
    type: OPEN_VIEW_GYM_ACCESS_SLOT_MODEL_SUCCESS,
    payload: response
});
/**
* Redux Action cls view  gym access slot model
 */
export const clsGymAccessSlotModel = () => ({
    type: CLOSE_VIEW_GYM_ACCESS_SLOT_MODEL,
});

/**
 * Redux Action Delete gym access slot
 */
export const deleteGymAccessSlot = (data) => ({
    type: DELETE_GYM_ACCESS_SLOT,
    payload:data
});
/**
 * Redux Action change gym access slot
 */
export const changeGymAccessSlot = (data) => ({
    type: CHANGE_GYM_ACCESS_SLOT,
    payload:data
});
/**
 * Redux Action SAVE Member Gym Access Slot
 */
export const changeSaveMemberGymAccessSlot = (data) => ({
    type: CHANGE_SAVE_MEMBER_GYMACCESSSLOT,
    payload : data
});
/**
 * Redux Action SAVE Member Gym Access Slot SUCCESS
 */
export const changeSaveMemberGymAccessSlotSuccess = () => ({
    type: CHANGE_SAVE_MEMBER_GYMACCESSSLOT_SUCCESS,
});


export const changeSaveMemberGymAccessSlotFailure = () => ({
    type: CHANGE_SAVE_MEMBER_GYMACCESSSLOT_FAILURE,
});
