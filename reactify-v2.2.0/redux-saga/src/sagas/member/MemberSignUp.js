/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
// api
import api from 'Api';

import {
  SAVE_MEMBER_SIGNUPDETAIL,
  OPEN_ADD_NEW_EMAILVERIFICATION_MODEL
} from 'Actions/types';

import {
    saveMemberSignUpDetailSuccess,
    opnAddNewEmailVerificationSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

/**
 * Send Member signup detail Save Request To Server
 */
const saveMemberSignUpDetailRequest = function* (data)
{
  let response = yield api.post('save-membersignup', data)
      .then(response => response.data)
      .catch(error => error.response.data )

  return response;
}
/**
 * save Member signup detail From Server
 */
function* saveMemberSignUpDetailFromServer(action) {
    try {

        const response = yield call(saveMemberSignUpDetailRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
              yield put(requestSuccess("Thank you for registering with us. Kindly login with registered email-id as username and mobile-no as password." ));
              yield  put(saveMemberSignUpDetailSuccess());
              localStorage.removeItem('membersignupdetail_state');
              localStorage.removeItem('membersignupdetail_props');
             yield put(push('/signin'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 * save member sign up detail
 */
export function* saveMemberSignUpDetail() {
    yield takeEvery(SAVE_MEMBER_SIGNUPDETAIL, saveMemberSignUpDetailFromServer);
}


const getEmailVerificationCodeRequest = function* (data)
{
   let response = yield api.post('get-verificationcode',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* getEmailVerificationCodeFromServer(action) {
   try {
       const response = yield call(getEmailVerificationCodeRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
       yield put(opnAddNewEmailVerificationSuccess({verificationCode : response[0][0].verificationCode}));
      }
      else {
        yield put(requestFailure(response.errorMessage));
      }
    }catch (error) {
         console.log(error);
    }
    finally
    {
    }
}

export function* opnAddNewEmailVerificationModel() {
   yield takeEvery(OPEN_ADD_NEW_EMAILVERIFICATION_MODEL, getEmailVerificationCodeFromServer);
}


/**
 * Member Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveMemberSignUpDetail),
        fork(opnAddNewEmailVerificationModel)
    ]);
}
