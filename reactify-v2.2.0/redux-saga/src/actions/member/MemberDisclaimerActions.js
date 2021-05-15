/**
 * Redux App Settings Actions
 */
import {
    OPEN_MEMBER_DISCLAIMER_MODEL,
    OPEN_MEMBER_DISCLAIMER_MODEL_SUCCESS,
    CLOSE_MEMBER_DISCLAIMER_MODEL,
    SAVE_MEMBER_DISCLAIMER,
    SAVE_MEMBER_DISCLAIMER_SUCCESS,
    GET_MEMBER_DISCLAIMER_SAVED_FORM,
    GET_MEMBER_DISCLAIMER_SAVED_FORM_SUCCESS,
} from '../types';

export const opnMemberDisclaimerModel = () => ({
  type: OPEN_MEMBER_DISCLAIMER_MODEL,
});

export const opnMemberDisclaimerModelSuccess = (response) => ({
    type: OPEN_MEMBER_DISCLAIMER_MODEL_SUCCESS,
    payload: response
});

export const clsMemberDisclaimerModel = () => ({
  type: CLOSE_MEMBER_DISCLAIMER_MODEL,
});

export const saveMemberDisclaimer = (data) => ({
    type: SAVE_MEMBER_DISCLAIMER,
    payload : data
});

export const saveMemberDisclaimerSuccess = () => ({
    type: SAVE_MEMBER_DISCLAIMER_SUCCESS,
});

export const getMemberDisclaimerSavedForm = (data) => ({
    type: GET_MEMBER_DISCLAIMER_SAVED_FORM,
	payload : data
});

export const getMemberDisclaimerSavedFormSuccess = (response) => ({
    type: GET_MEMBER_DISCLAIMER_SAVED_FORM_SUCCESS,
    payload: response
});
