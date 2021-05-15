import { NotificationManager } from 'react-notifications';
import {cloneDeep} from 'Helpers/helpers';
/**
 * Signup Reducer
 */

// action types
import {
  CLIENT_SIGNUP_HANDLE_BACK_BUTTON,
  SAVE_CLIENT_URL_SUCCESS,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';

// initial state
const INIT_STATE = {
      activeStep: 0,
      loading : false,
      disabled : false
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {

        case CLIENT_SIGNUP_HANDLE_BACK_BUTTON :
              let backStep = state.activeStep - 1;
              let copystate = cloneDeep(state);
              copystate.activeStep = backStep;
              localStorage.setItem('signupdetail_props',  JSON.stringify(copystate));
              return { ...state,activeStep: backStep };
        case REQUEST_FAILURE:
              action.payload && NotificationManager.error(action.payload);
              return { ...state , loading : false, disabled : false};
        case REQUEST_SUCCESS:
              action.payload && NotificationManager.success(action.payload);
              let nextStep  = state.activeStep + 1;
              let copystatenext = cloneDeep(state);
              copystatenext.activeStep = nextStep;
              localStorage.setItem('signupdetail_props',  JSON.stringify(copystatenext));
              return { ...state, activeStep: nextStep};
        case ON_SHOW_LOADER:
              return { ...state, loading : true, disabled : true};
        case ON_HIDE_LOADER:
              return { ...state, loading : false, disabled : false};
        case SAVE_CLIENT_URL_SUCCESS:
              return { ...state,activeStep: 0};

        default: {
            let signupdetail = localStorage.getItem('signupdetail_props');
            signupdetail = JSON.parse(signupdetail);
            if(action.type.indexOf('@@redux/INIT') > -1 && signupdetail && signupdetail.activeStep != state.activeStep)
            {
              return { ...state , activeStep: signupdetail.activeStep };
            }
            else {
                  return { ...state};
            }
          }
    }
}
