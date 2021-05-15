import{
SAVE_LOGIN_ENQUIRY_FORM,
SAVE_LOGIN_ENQUIRY_FORM_SUCCESS,

OPEN_LOGIN_ENQUIRY_FORM,

CLOSE_LOGIN_ENQUIRY_FORM,

TOGGLE_THEME_PANEL
} from './types';




export const saveLoginEnquiryForm = (data) => ({
    type: SAVE_LOGIN_ENQUIRY_FORM,
    payload : data
});

export const saveLoginEnquiryFormSuccess = () => ({
    type: SAVE_LOGIN_ENQUIRY_FORM_SUCCESS,
});


export const opnLoginEnquiryForm = () => ({
  type: OPEN_LOGIN_ENQUIRY_FORM,
});


export const clsLoginEnquiryForm = () => ({
    type: CLOSE_LOGIN_ENQUIRY_FORM,
});

export const toggleThemePanelAction = () => ({
  type: TOGGLE_THEME_PANEL,
});
