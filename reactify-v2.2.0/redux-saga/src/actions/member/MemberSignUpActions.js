/**
 * Member Sign UP Actions
 */
import {
    SAVE_MEMBER_SIGNUPDETAIL,
    SAVE_MEMBER_SIGNUPDETAIL_SUCCESS,

    OPEN_ADD_NEW_EMAILVERIFICATION_MODEL,
    OPEN_ADD_NEW_EMAILVERIFICATION_MODEL_SUCCESS,
    CLOSE_ADD_NEW_EMAILVERIFICATION_MODEL,

    SAVE_VERIFICATIONCODE,

  } from '../types';



/**
 * Redux Action SAVE Members SignUp Detail
 */
export const saveMemberSignUpDetail = (data) => ({
    type: SAVE_MEMBER_SIGNUPDETAIL,
    payload : data
});
/**
 * Redux Action SAVE Members SignUp Detail  SUCCESS
 */

export const saveMemberSignUpDetailSuccess = () => ({
    type: SAVE_MEMBER_SIGNUPDETAIL_SUCCESS,
});
/**
 * Redux Action Open Add New Emailverification Model
 */
export const opnAddNewEmailVerificationModel = (request) => ({
    type: OPEN_ADD_NEW_EMAILVERIFICATION_MODEL,
    payload: request

});
/**
 * Redux Action Open Add New Emailverification Model SUCCESS
 */
export const opnAddNewEmailVerificationSuccess = (response) => ({
    type: OPEN_ADD_NEW_EMAILVERIFICATION_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action Close Add New Emailverification Model
 */
export const clsAddNewEmailVerificationModel = () => ({
    type: CLOSE_ADD_NEW_EMAILVERIFICATION_MODEL
});
/**
 * Redux Action SAVE VerificationCode
 */
export const saveVerificationCode = (data) => ({
    type: SAVE_VERIFICATIONCODE,
    payload : data
});
