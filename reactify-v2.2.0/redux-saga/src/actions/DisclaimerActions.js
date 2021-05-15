/**
 * Product Actions
 */
import {
    OPEN_ADD_NEW_RULE_MODEL,
    CLOSE_ADD_NEW_RULE_MODEL,
    SAVE_RULE,
    SAVE_RULE_SUCCESS,
    GET_RULES,
    GET_RULES_SUCCESS,
    OPEN_EDIT_RULE_MODEL,
    DELETE_RULE,

    OPEN_ADD_NEW_QUESTION_MODEL,
    CLOSE_ADD_NEW_QUESTION_MODEL,
    SAVE_QUESTION,
    SAVE_QUESTION_SUCCESS,
    GET_QUESTIONS,
    GET_QUESTIONS_SUCCESS,
    OPEN_EDIT_QUESTION_MODEL,
    DELETE_QUESTION,

    OPEN_STAFFDISCLAIMER_MODEL,
    OPEN_STAFFDISCLAIMER_MODEL_SUCCESS,
    CLOSE_STAFFDISCLAIMER_MODEL,
    SAVE_STAFFDISCLAIMER,
    SAVE_STAFFDISCLAIMER_SUCCESS,
    GET_STAFFDISCLAIMER_SAVED_FORM,
    GET_STAFFDISCLAIMER_SAVED_FORM_SUCCESS,

    VIEW_DISCLAIMER,
    VIEW_DISCLAIMER_SUCCESS,
    SAVE_DISCLAIMER,

    VIEW_COVID19_DISCLAIMER,
    VIEW_COVID19_DISCLAIMER_SUCCESS,
    SAVE_COVID19_DISCLAIMER,

    GET_MEMBER_COVID19DISCLAIMERFORM,
    GET_MEMBER_COVID19DISCLAIMERFORM_SUCCESS,
    GET_STAFF_COVID19DISCLAIMERFORM,
    GET_STAFF_COVID19DISCLAIMERFORM_SUCCESS,

    OPEN_STAFF_COVID19DISCLAIMER_MODEL,
    OPEN_STAFF_COVID19DISCLAIMER_MODEL_SUCCESS,
    CLOSE_STAFF_COVID19DISCLAIMER_MODEL,
    SAVE_STAFF_COVID19DISCLAIMER,
    SAVE_STAFF_COVID19DISCLAIMER_SUCCESS,

  } from './types';

export const opnAddNewRuleModel = () => ({
    type: OPEN_ADD_NEW_RULE_MODEL
});

export const clsAddNewRuleModel = () => ({
    type: CLOSE_ADD_NEW_RULE_MODEL
});
export const saveRule = (data) => ({
    type: SAVE_RULE,
    payload : data
});

export const saveRuleSuccess = () => ({
    type: SAVE_RULE_SUCCESS,
});
export const getRules = (data) => ({
    type: GET_RULES,
    payload : data
});

export const getRulesSuccess = (response) => ({
    type: GET_RULES_SUCCESS,
    payload: response
});
export const opnEditRuleModel = (requestData) => ({
    type: OPEN_EDIT_RULE_MODEL,
    payload:requestData
});

export const deleteRule = (data) => ({
    type: DELETE_RULE,
    payload:data
});

export const opnAddNewQuestionModel = () => ({
    type: OPEN_ADD_NEW_QUESTION_MODEL
});

export const clsAddNewQuestionModel = () => ({
    type: CLOSE_ADD_NEW_QUESTION_MODEL
});
export const saveQuestion = (data) => ({
    type: SAVE_QUESTION,
    payload : data
});

export const saveQuestionSuccess = () => ({
    type: SAVE_QUESTION_SUCCESS,
});
export const getQuestions = (data) => ({
    type: GET_QUESTIONS,
    payload : data
});

export const getQuestionsSuccess = (response) => ({
    type: GET_QUESTIONS_SUCCESS,
    payload: response
});
export const opnEditQuestionModel = (requestData) => ({
    type: OPEN_EDIT_QUESTION_MODEL,
    payload:requestData
});

export const deleteQuestion = (data) => ({
    type: DELETE_QUESTION,
    payload:data
});


export const opnDisclaimerModel = (data) => ({
  type: OPEN_STAFFDISCLAIMER_MODEL,
  payload : data
});

export const opnDisclaimerModelSuccess = (response) => ({
    type: OPEN_STAFFDISCLAIMER_MODEL_SUCCESS,
    payload: response
});

export const clsDisclaimerModel = () => ({
    type: CLOSE_STAFFDISCLAIMER_MODEL
});

export const saveStaffDisclaimer = (data) => ({
    type: SAVE_STAFFDISCLAIMER,
    payload : data
});

export const saveStaffDisclaimerSuccess = () => ({
    type: SAVE_STAFFDISCLAIMER_SUCCESS,
});


export const viewDisclaimer = () => ({
    type: VIEW_DISCLAIMER,
});
export const viewDisclaimerSuccess = (data) => ({
    type: VIEW_DISCLAIMER_SUCCESS,
    payload : data
});

export const saveDisclaimer = (data) => ({
    type: SAVE_DISCLAIMER,
    payload : data
});

export const getStaffDisclaimerSavedForm = (data) => ({
    type: GET_STAFFDISCLAIMER_SAVED_FORM,
    payload : data
});

export const getStaffDisclaimerSavedFormSuccess = (response) => ({
    type: GET_STAFFDISCLAIMER_SAVED_FORM_SUCCESS,
    payload: response
});


export const viewCovid19Disclaimer = () => ({
    type: VIEW_COVID19_DISCLAIMER,
});

export const viewCovid19DisclaimerSuccess = (data) => ({
    type: VIEW_COVID19_DISCLAIMER_SUCCESS,
    payload : data
});

export const saveCovid19Disclaimer = (data) => ({
    type: SAVE_COVID19_DISCLAIMER,
    payload : data
});

export const getMemberCovid19DisclaimerForm = (data) => ({
    type: GET_MEMBER_COVID19DISCLAIMERFORM,
    payload : data
});

export const getMemberCovid19DisclaimerFormSuccess = (response) => ({
    type: GET_MEMBER_COVID19DISCLAIMERFORM_SUCCESS,
    payload: response
});

export const opnStaffCovid19DisclaimerModel = () => ({
  type: OPEN_STAFF_COVID19DISCLAIMER_MODEL,
});

export const opnStaffCovid19DisclaimerModelSuccess = (response) => ({
    type: OPEN_STAFF_COVID19DISCLAIMER_MODEL_SUCCESS,
    payload: response
});

export const clsStaffCovid19DisclaimerModel = () => ({
  type: CLOSE_STAFF_COVID19DISCLAIMER_MODEL,
});

export const saveStaffCovid19Disclaimer = (data) => ({
    type: SAVE_STAFF_COVID19DISCLAIMER,
    payload : data
});

export const saveStaffCovid19DisclaimerSuccess = () => ({
    type: SAVE_STAFF_COVID19DISCLAIMER_SUCCESS,
});

export const getStaffCovid19DisclaimerForm = (data) => ({
    type: GET_STAFF_COVID19DISCLAIMERFORM,
    payload : data
});

export const getStaffCovid19DisclaimerFormSuccess = (response) => ({
    type: GET_STAFF_COVID19DISCLAIMERFORM_SUCCESS,
    payload: response
});
