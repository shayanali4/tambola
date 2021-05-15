/**
 * Member Subscription Actions
 */
import {

    GET_SUBSCRIPTION_LIST,
    GET_SUBSCRIPTION_LIST_SUCCESS,

    SAVE_SUBSCRIPTION_FOLLOWUP,
    SAVE_SUBSCRIPTION_FOLLOWUP_SUCCESS,
    ON_CHANGE_SUBSCRIPTION,

    OPEN_VIEW_MEMBER_FOLLOWUP_MODEL,
    CLOSE_VIEW_MEMBER_FOLLOWUP_MODEL,
  } from './types';



/**
 * Redux Action Get Members
 */
export const getSubscriptionList = (requestData) => ({
    type: GET_SUBSCRIPTION_LIST,
    payload : requestData
});

export const onChangeSubscription = (subscriptiontype) => ({
   type: ON_CHANGE_SUBSCRIPTION,
   payload: { subscriptiontype }
})
/**
 * Redux Action Get Members Success
 */
export const getSubscriptionListSuccess = (response) => ({
    type: GET_SUBSCRIPTION_LIST_SUCCESS,
    payload: response
});

export const saveSubcriptionFollowup = (data) => ({
    type: SAVE_SUBSCRIPTION_FOLLOWUP,
    payload : data
});

export const saveSubcriptionFollowupSuccess = () => ({
    type: SAVE_SUBSCRIPTION_FOLLOWUP_SUCCESS,
});


export const opnViewMemberFollowupModel = (requestData) => ({
    type: OPEN_VIEW_MEMBER_FOLLOWUP_MODEL,
      payload:requestData
});

export const clsViewMemberFollowupModel = () => ({
    type: CLOSE_VIEW_MEMBER_FOLLOWUP_MODEL
});
