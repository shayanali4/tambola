import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import api, {fileUploadConfig} from 'Api';
import {loginEnquiryFormReducer,settings} from './states';
import { push } from 'connected-react-router';
import {cloneDeep} from 'Helpers/helpers';
import {
  SAVE_LOGIN_ENQUIRY_FORM,
  OPEN_LOGIN_ENQUIRY_FORM
} from 'Actions/types';

import {
saveLoginEnquiryFormSuccess,
requestSuccess,
requestFailure,



} from 'Actions';


/**
 * Send product Save Request To Server
 */

const saveEnquiryRequest = function* (data)
{
  data = cloneDeep(data);
    let response = yield api.post('save-login-enquiry', data)
        .then(response => response.data)
        .catch(error => error.response.data )
    return response;
}
/**
 * save product From Server
 */
function* saveLoginEnquiryFromServer(action) {
    try {
      const state = yield select(settings);
      const response = yield call(saveEnquiryRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
            yield put(requestSuccess("Thank you for showing your interest in our gym. We will get in touch with you shortly."));
              yield put(saveLoginEnquiryFormSuccess());
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }




export function* saveLoginEnquiryForm() {
    yield takeEvery(SAVE_LOGIN_ENQUIRY_FORM, saveLoginEnquiryFromServer);
}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([

      fork(saveLoginEnquiryForm),

    ]);
}
