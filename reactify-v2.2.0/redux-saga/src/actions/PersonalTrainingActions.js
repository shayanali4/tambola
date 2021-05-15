
import {

    GET_MEMBER_PERSONALTRAINING_LIST,
    GET_MEMBER_PERSONALTRAINING_LIST_SUCCESS,
    OPEN_ADD_ASSIGNTRAINER_MODEL,
    OPEN_ADD_ASSIGNTRAINER_MODEL_SUCCESS,
    CLOSE_ADD_ASSIGNTRAINER_MODEL,
    SAVE_ASSIGNTRAINER,
    SAVE_ASSIGNTRAINER_SUCCESS,
    SAVE_NOTE_NEXTSESSION,
    SAVE_NOTE_NEXTSESSION_SUCCESS,
    SAVE_PTSLOT,
    SAVE_PTSLOT_SUCCESS,
    SAVE_PTSLOT_FAILURE,
    OPEN_VIEW_PT_SLOT_MODEL,
    OPEN_VIEW_PT_SLOT_MODEL_SUCCESS,
    CLOSE_VIEW_PT_SLOT_MODEL,
    DELETE_PT_SLOT,
    DELETE_PT_SLOT_SUCCESS,
    GET_MEMBER_PTSLOT_DETAIL,
    GET_MEMBER_PTSLOT_DETAIL_SUCCESS,
    ADD_ROOM,
    SET_VIDEO,
    SET_AUDIO,
    SAVE_ONLINEACCESSURL,
    SAVE_ONLINEACCESSURL_SUCCESS
  } from './types';

export const getMemberPersonalTrainingList = (requestData) => ({
    type: GET_MEMBER_PERSONALTRAINING_LIST,
    payload : requestData
});

export const getMemberPersonalTrainingListSuccess = (response) => ({
    type: GET_MEMBER_PERSONALTRAINING_LIST_SUCCESS,
    payload: response
});
/**
 * Redux Action Open Model to add assign tariner
 */
export const opnAddAssignTrainerModel = (requestData) => ({
    type: OPEN_ADD_ASSIGNTRAINER_MODEL,
      payload:requestData
});
export const opnAddAssignTrainerModelSuccess = (response) => ({
    type: OPEN_ADD_ASSIGNTRAINER_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close add assign tariner Model
 */
export const clsAddAssignTrainerModel = () => ({
    type: CLOSE_ADD_ASSIGNTRAINER_MODEL
});
/**
 * Redux Action SAVE PRODUCT
 */
export const saveAssignTrainer = (data) => ({
    type: SAVE_ASSIGNTRAINER,
    payload : data
});
/**
 * Redux Action SAVE PRODUCT SUCCESS
 */
export const saveAssignTrainerSuccess = () => ({
    type: SAVE_ASSIGNTRAINER_SUCCESS,
});
/**
 * Redux Action SAVE NOTE FOR NEXT SESSION
 */
export const saveNoteforNextSession = (data) => ({
    type: SAVE_NOTE_NEXTSESSION,
    payload : data
});
/**
 * Redux Action SAVE NOTE FOR NEXT SESSION SUCCESS
 */
export const saveNoteforNextSessionSuccess = (response) => ({
    type: SAVE_NOTE_NEXTSESSION_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE PT Slot
 */
export const savePTSlot = (data) => ({
    type: SAVE_PTSLOT,
    payload : data
});
/**
 * Redux Action SAVE PT Slot SUCCESS
 */
export const savePTSlotSuccess = () => ({
    type: SAVE_PTSLOT_SUCCESS,
});

/**
 * Redux Action SAVE PT Slot Failure
 */
export const savePTSlotFailure = () => ({
    type: SAVE_PTSLOT_FAILURE,
});

/**
 * Redux Action opn view PT model
 */
export const opnViewPTSlotmodel = (requestData) => ({
    type: OPEN_VIEW_PT_SLOT_MODEL,
    payload: requestData
});
/**
* Redux Action opn view  PT  slot model success
 */

export const viewPTSlotSuccess = (response) => ({
    type: OPEN_VIEW_PT_SLOT_MODEL_SUCCESS,
    payload: response
});
/**
* Redux Action cls view  PT slot model
 */
export const clsPTSlotModel = () => ({
    type: CLOSE_VIEW_PT_SLOT_MODEL,
});
/**
 * Redux Action Delete PT slot
 */
export const deletePTSlot = (data) => ({
    type: DELETE_PT_SLOT,
    payload:data
});
/**
 * Redux Action Delete PT slot success
 */
export const deletePTSlotSuccess = () => ({
    type: DELETE_PT_SLOT_SUCCESS,
});

export const getMemberPtSlotDetail = (requestData) => ({
    type: GET_MEMBER_PTSLOT_DETAIL,
    payload : requestData
});

export const getMemberPtSlotDetailSuccess = (response) => ({
    type: GET_MEMBER_PTSLOT_DETAIL_SUCCESS,
    payload: response
});
export const addRoom = (requestData) => ({
  type: ADD_ROOM,
  payload : requestData

});

export const setVideo = (requestData) => ({
  type: SET_VIDEO,
  payload : requestData

});
export const setAudio = (requestData) => ({
  type: SET_AUDIO,
  payload : requestData

});

/**
 * Redux Action SAVE ONLINE ACCESS URL
 */
export const saveOnlineAccessUrl = (data) => ({
    type: SAVE_ONLINEACCESSURL,
    payload : data
});
/**
 * Redux Action SAVE ONLINE ACCESS URL SUCCESS
 */
export const saveOnlineAccessUrlSuccess = (response) => ({
    type: SAVE_ONLINEACCESSURL_SUCCESS,
    payload: response
});
