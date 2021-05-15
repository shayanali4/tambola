/**
 * Feedback Actions
 */
import {
    GET_MEMBER_FEEDBACKS,
    GET_MEMBER_FEEDBACKS_SUCCESS,
    SAVE_MEMBER_FEEDBACK,
    SAVE_MEMBER_FEEDBACK_SUCCESS,
    ON_CHANGE_MEMBER_FEEDBACK_PAGE_TABS,
    VIEW_MEMBER_FEEDBACK_DETAILS,
    ON_COMMENT_MEMBER_FEEDBACK,
    ON_COMMENT_MEMBER_FEEDBACK_SUCCESS,
    REPLY_MEMBER_FEEDBACK,
    VIEW_MEMBER_COMMENTS_DETAILS,
    VIEW_MEMBER_COMMENTS_DETAILS_SUCCESS
} from '../types';

/**
 * Redux Action To Get Feedbacks
 */
export const getMemberFeedbacks = (data) => ({
    type: GET_MEMBER_FEEDBACKS,
    payload: data

});

export const getMemberFeedbacksSuccess = (response) => ({
    type: GET_MEMBER_FEEDBACKS_SUCCESS,
    payload: response
});

export const saveMemberFeedback = (data) => ({
    type: SAVE_MEMBER_FEEDBACK,
    payload : data
});

export const saveMemberFeedbackSuccess = () => ({
    type: SAVE_MEMBER_FEEDBACK_SUCCESS,
});

export const onChangeMemberFeedbackPageTabs = (value) => ({
    type: ON_CHANGE_MEMBER_FEEDBACK_PAGE_TABS,
    payload: value
});

export const viewMemberFeedbackDetails = (feedback) => ({
    type: VIEW_MEMBER_FEEDBACK_DETAILS,
    payload: feedback
});

export const onCommentMemberFeedback = (data) => ({
    type: ON_COMMENT_MEMBER_FEEDBACK,
    payload: data
});

export const onCommentMemberFeedbackSuccess = () => ({
    type: ON_COMMENT_MEMBER_FEEDBACK_SUCCESS,
});

export const replyMemberFeedback = (feedback) => ({
    type: REPLY_MEMBER_FEEDBACK,
    payload: feedback
});
/**
 * Redux Action To View Comment Details
 */
export const viewMemberCommentsDetails = (requestData) => ({
    type: VIEW_MEMBER_COMMENTS_DETAILS,
    payload: requestData
});
/**
 * Redux Action To View Comment Details
 */
export const viewMemberCommentsDetailsSuccess = (response) => ({
    type: VIEW_MEMBER_COMMENTS_DETAILS_SUCCESS,
    payload: response
});
