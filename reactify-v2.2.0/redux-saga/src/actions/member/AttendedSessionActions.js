/**
 * ENQUIRY Actions
 */

import {
GET_MEMBER_ATTENDED_SESSION,
GET_MEMBER_ATTENDED_SESSION_SUCCESS,
CONFIRM_MEMBER_ATTENDED_SESSION,
SAVE_MEMBER_ATTENDED_PT_SESSION_FEEDBACK,
SAVE_MEMBER_ATTENDED_PT_SESSION_FEEDBACK_SUCCESS,
SAVE_MEMBER_ATTENDED_GS_SESSION_FEEDBACK,
SAVE_MEMBER_ATTENDED_GS_SESSION_FEEDBACK_SUCCESS,
GET_USER_RATING,
GET_USER_RATING_SUCCESS,
SAVE_USERRATING_FEEDBACK,
SAVE_USERRATING_FEEDBACK_SUCCESS,
} from '../types';

export const getMemberAttendedSession = (data) => ({
    type: GET_MEMBER_ATTENDED_SESSION,
    payload : data
});

export const getMemberAttendedSessionSuccess = (response) => ({
    type: GET_MEMBER_ATTENDED_SESSION_SUCCESS,
    payload: response
});

export const confirmMemberAttendedSession = (data) => ({
    type: CONFIRM_MEMBER_ATTENDED_SESSION,
    payload : data
});

export const saveMemberAttendedPtSessionFeedback = (data) => ({
    type: SAVE_MEMBER_ATTENDED_PT_SESSION_FEEDBACK,
    payload : data
});

export const saveMemberAttendedPtSessionFeedbackSuccess = (response) => ({
    type: SAVE_MEMBER_ATTENDED_PT_SESSION_FEEDBACK_SUCCESS,
    payload: response
});

export const saveMemberAttendedGsSessionFeedback = (data) => ({
    type: SAVE_MEMBER_ATTENDED_GS_SESSION_FEEDBACK,
    payload : data
});

export const saveMemberAttendedGsSessionFeedbackSuccess = () => ({
    type: SAVE_MEMBER_ATTENDED_GS_SESSION_FEEDBACK_SUCCESS,
});


export const getUserRating = (data) => ({
    type: GET_USER_RATING,
    payload : data
});

export const getUserRatingSuccess = (response) => ({
    type: GET_USER_RATING_SUCCESS,
    payload: response
});

export const saveUserRatingFeedback = (data) => ({
    type: SAVE_USERRATING_FEEDBACK,
    payload : data
});

export const saveUserRatingFeedbackSuccess = (response) => ({
    type: SAVE_USERRATING_FEEDBACK_SUCCESS,
    payload: response
});
