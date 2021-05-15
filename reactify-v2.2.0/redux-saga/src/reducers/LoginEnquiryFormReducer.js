import {
  SAVE_LOGIN_ENQUIRY_FORM,
  SAVE_LOGIN_ENQUIRY_FORM_SUCCESS,
  OPEN_LOGIN_ENQUIRY_FORM,
  OPEN_LOGIN_ENQUIRY_FORM_SUCCESS,

  CLOSE_LOGIN_ENQUIRY_FORM,
  TOGGLE_THEME_PANEL,

} from 'Actions/types';


// initial state

const INIT_STATE = {

       loading : false,
       disabled : false,
       dialogLoading : false,
       newenquirymodal : false,
       servicePlanList:null,


};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

      case OPEN_LOGIN_ENQUIRY_FORM:
              return { ...state,dialogLoading: false, newenquirymodal : true ,servicePlanList:action.payload.servicePlanList,};
      case SAVE_LOGIN_ENQUIRY_FORM:
            return { ...state,dialogLoading : true, disabled : true };
      case SAVE_LOGIN_ENQUIRY_FORM_SUCCESS:
            return { ...state,dialogLoading : false ,newenquirymodal:false, disabled : false};
      case TOGGLE_THEME_PANEL:
            return{...state,  newenquirymodal: !state.newenquirymodal};


      case CLOSE_LOGIN_ENQUIRY_FORM:
               return { ...state, newenquirymodal:false };
               default: return { ...state};
               }
                   }
