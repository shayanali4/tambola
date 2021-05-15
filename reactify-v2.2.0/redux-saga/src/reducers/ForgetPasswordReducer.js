
import {
      REQUEST_FAILURE,
      FORGET_WEBADDRESS,
      REQUEST_SUCCESS,
      FORGET_PASSWORD
} from 'Actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    loading: false,
    flag:0,
    disable:false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
                case REQUEST_FAILURE:
                    return { ...state , loading : false,disable:false  };
                case FORGET_WEBADDRESS :
                    return { ...state ,loading : true ,disable:true};
                case FORGET_PASSWORD :
                    return { ...state ,loading : true ,disable:true};
                case REQUEST_SUCCESS:
                    return { ...state,flag:1,loading : false,disable:false};
        default: return { ...state };
    }
}
