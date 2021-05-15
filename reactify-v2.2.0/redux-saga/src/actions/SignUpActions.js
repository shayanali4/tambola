
/**
 * SIGNUP Actions
 */
import {

  CLIENT_SIGNUP_REQUEST,
  CLIENT_SIGNUP_REQUEST_SUCCESS,
  ON_CLIENT_SIGNUP_VERIFICATION,
  SAVE_CLIENT_ESTABLISHMENT_INFO,
  SAVE_CLIENT_ORGANIZATION_INFO,
  SAVE_CLIENT_URL,
  SAVE_CLIENT_URL_SUCCESS,
  CLIENT_SIGNUP_HANDLE_BACK_BUTTON,

  } from './types';

/**
 * Redux Action on change of signup form element change
 */
export const clientSignUpRequest = (data) => ({
    type: CLIENT_SIGNUP_REQUEST,
    payload : data
});

/**
 * Redux Action Register Client Success
 */
export const clientSignUpRequestSuccess = (response) => ({
    type: CLIENT_SIGNUP_REQUEST_SUCCESS,
    payload: response
});

/**
 * Redux Action To Verify Client Code
 */
export const onClientSignupVerification = (data) => ({
    type: ON_CLIENT_SIGNUP_VERIFICATION,
    payload: data
});

/**
 * Redux Action To Save Establishment Info
 */
export const onSaveClientEstablishmentInfo = (data) => ({
    type: SAVE_CLIENT_ESTABLISHMENT_INFO,
    payload: data
});

/**
 * Redux Action To Save Organization Info
 */
export const onSaveClientOrganizationInfo = (data) => ({
    type: SAVE_CLIENT_ORGANIZATION_INFO,
    payload: data
});



/**
 * Redux Action To Save URL
 */
export const onSaveClientURL = (data) => ({
    type: SAVE_CLIENT_URL,
    payload: data
});


/**
 * Redux Action To Save URL
 */
export const onSaveClientURLSuccess = (response) => ({
    type: SAVE_CLIENT_URL_SUCCESS,
    payload: response
});


/**
 * Redux Action For Back Button
 */
export const onClientSignupBack = (response) => ({
    type: CLIENT_SIGNUP_HANDLE_BACK_BUTTON,
    payload: response
});
