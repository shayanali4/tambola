/**
 * Redux App Settings Actions
 */
import {
    GET_MEMBER_PROFILE,
    GET_MEMBER_PROFILE_SUCCESS,
    MEMBER_SAVE_CHANGE_PASSWORD,
    MEMBER_SAVE_CHANGE_PASSWORD_SUCCESS,
    SAVE_MEMBER_THEME,
    SAVE_MEMBER_THEME_SUCCESS
} from '../types';

export const getMemberProfile = (requestData) => ({
    type: GET_MEMBER_PROFILE,
    payload:requestData
});


export const getMemberProfileSuccess = (response) => ({
    type: GET_MEMBER_PROFILE_SUCCESS,
    payload:response
});

export const memberSaveChangePassword = (data) => ({
    type: MEMBER_SAVE_CHANGE_PASSWORD,
    payload : data
});

export const memberSaveChagePasswordSuccess = () => ({
    type: MEMBER_SAVE_CHANGE_PASSWORD_SUCCESS,
});

export const saveMemberTheme = (data) => ({
    type: SAVE_MEMBER_THEME,
    payload : data
});
export const saveMemberThemeSuccess = () => ({
    type: SAVE_MEMBER_THEME_SUCCESS,
});
