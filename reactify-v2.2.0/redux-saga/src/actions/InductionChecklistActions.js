/**
 * Member Management Actions
 */
import {
    GET_INDUCTION_CHECKLIST_MEMBERS,
    GET_INDUCTION_CHECKLIST_MEMBERS_SUCCESS,

  } from './types';

/**
 * Redux Action Get Members
 */
export const getInductionChecklistMembers = (data) => ({
    type: GET_INDUCTION_CHECKLIST_MEMBERS,
    payload : data
});


/**
 * Redux Action Get Members Success
 */
export const getInductionChecklistMembersSuccess = (response) => ({
    type: GET_INDUCTION_CHECKLIST_MEMBERS_SUCCESS,
    payload: response
});
