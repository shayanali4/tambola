/**
 * Auth User Reducers
 */
import { NotificationManager } from 'react-notifications';
import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGOUT_USER,
    SIGNUP_USER,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAILURE,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAILURE,
      SIGNUP_URL,
      SIGNUP_URL_SUCCESS,
      SIGNUP_URL_FAILURE,
      CLIENT_SIGNIN_REQUEST,
      CLIENT_SIGNIN_REQUEST_SUCCESS,
      REQUEST_FAILURE,
} from 'Actions/types';

/**
 * initial auth user
 */

const INIT_STATE = {
    user: localStorage.getItem('user_id'),
    logintype : localStorage.getItem('login_type'),
    url: localStorage.getItem('url_id'),
    loading: false,
    disabled : false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case LOGIN_USER:
            return { ...state, loading: true };

        case LOGIN_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload, logintype : localStorage.getItem('login_type')};

        case LOGIN_USER_FAILURE:
          if(!state.user)
          {
            NotificationManager.error(action.payload);
           }
            return { ...state, loading: false };
        case LOGOUT_USER:
            return { ...state };

        case LOGOUT_USER_SUCCESS:
            return { ...state, user: null };

        case LOGOUT_USER_FAILURE:
            return { ...state };

        case SIGNUP_USER:
            return { ...state, loading: true };

        case SIGNUP_USER_SUCCESS:
            NotificationManager.success('Account Created');
            return { ...state, loading: false, user: action.payload.uid };

        case SIGNUP_USER_FAILURE:
            NotificationManager.error(action.payload);
            return { ...state, loading: false };

        case SIGNUP_URL:
            return{ ...state,loading:true};

            case SIGNUP_URL_SUCCESS:
                NotificationManager.success('Account Created');
                return { ...state, loading: false, url:action.payload.urlid };

            case SIGNUP_URL_FAILURE:
                NotificationManager.error(action.payload);
                return { ...state, loading: false };

                case CLIENT_SIGNIN_REQUEST :
                  return { ...state , loading : true ,disabled:true };
                case CLIENT_SIGNIN_REQUEST_SUCCESS :
                    return { ...state , loading : false, disabled:false};
                case REQUEST_FAILURE:
                    return { ...state , loading : false ,disabled:false };
        default: return { ...state };
    }
}
