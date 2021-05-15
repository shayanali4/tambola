/**
 * Todo App Actions
 */
import {
GET_MEMBER_DISCLAIMER_LIST,
GET_MEMBER_DISCLAIMER_LIST_SUCCESS,
OPEN_ADD_MEMBER_CONSULTATIONNOTE_MODEL,
CLOSE_ADD_MEMBER_CONSULTATIONNOTE_MODEL,
SAVE_MEMBER_CONSULTATIONNOTE,
SAVE_MEMBER_CONSULTATIONNOTE_SUCCESS,
RESET_MEMBER_DISCLAIMER,

}from './types';

export const getMemberDisclaimerList = (data) => ({
    type: GET_MEMBER_DISCLAIMER_LIST,
    payload : data
});

export const getMemberDisclaimerListSuccess = (response) => ({
    type: GET_MEMBER_DISCLAIMER_LIST_SUCCESS,
    payload: response
});



export const opnAddMemberConsultationnoteModel = (requestData) => ({
    type: OPEN_ADD_MEMBER_CONSULTATIONNOTE_MODEL,
      payload:requestData
});

export const clsAddMemberConsultationnoteModel = () => ({
    type: CLOSE_ADD_MEMBER_CONSULTATIONNOTE_MODEL
});

export const saveMemberConsultationNote = (data) => ({
    type: SAVE_MEMBER_CONSULTATIONNOTE,
    payload : data
});

export const saveMemberConsultationNoteSuccess = () => ({
    type: SAVE_MEMBER_CONSULTATIONNOTE_SUCCESS,
});


export const resetMemberDisclaimer = (data) => ({
    type: RESET_MEMBER_DISCLAIMER,
    payload : data
});
