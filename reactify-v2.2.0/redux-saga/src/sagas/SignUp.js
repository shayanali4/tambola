/**
 * SignUp Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';
// api
import api from 'Api';

import {
    CLIENT_SIGNUP_REQUEST,
    ON_CLIENT_SIGNUP_VERIFICATION,
    SAVE_CLIENT_ESTABLISHMENT_INFO,
    SAVE_CLIENT_ORGANIZATION_INFO,
    SAVE_CLIENT_URL,
} from 'Actions/types';

import {
    requestSuccess,
    requestFailure,
    onSaveClientURLSuccess,
    showLoader,
    hideLoader
} from 'Actions';

import Auth from '../Auth/Auth';

const authObject = new Auth();

/**
 * Send SignUp Request To Server
 */

const clientSignUpRequestServer = function* (data)
{
    let response = yield api.post('client-signup', data)
        .then(response => response.data)
        .catch(error => error.response.data);
        return response;
}
/**
 * save Client To Server
 */
function* saveClientToServer(action) {
    try {
        yield put(showLoader());
        const response= yield call(clientSignUpRequestServer ,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess());
        }
        else {

          yield put(requestFailure(response.errorMessage));
        }
    } catch (error) {
        console.log(error);
    }
    finally {
        yield put(hideLoader());
    }
}


export function* clientSignUpRequest() {
    yield takeEvery(CLIENT_SIGNUP_REQUEST, saveClientToServer);
}



/**
 * Send Verification Request To Server
 */

const clientVerificationRequestServer = function* (data)
{
    let response = yield api.post('verify-client-signup', data)
        .then(response => response.data)
        .catch(error => error.response.data);
    return response;
}

/**
 * verify Client Code From Server
 */
function* verifyClientCodeFromServer(action) {
    try {

        yield put(showLoader());
        const response = yield call(clientVerificationRequestServer, action.payload);

            if(!(response.errorMessage  || response.ORAT))
            {
                yield put(requestSuccess("You are verifed successfully!!"));
            }
            else {
                yield put(requestFailure(response.errorMessage));
            }

      } catch (error) {
              console.log(error);
      }
      finally {
              yield put(hideLoader());
      }

}

export function* onClientSignupVerification() {
    yield takeEvery(ON_CLIENT_SIGNUP_VERIFICATION, verifyClientCodeFromServer);
}


/**
 * Save Establishment Info To Server
 */

const clientEstablishmentInfoRequestServer = function* (data)
{
    let response = yield api.post('save-establishmentinfo', data)
        .then(response => response.data)
        .catch(error => error.response.data);
    return response;
}

/**
 * save Establishment Info To Server
 */
function* saveEstablishmentInfoToServer(action) {
    try {

        yield put(showLoader());
        const response = yield call(clientEstablishmentInfoRequestServer, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess());
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }
      } catch (error) {
              console.log(error);
      }
      finally {
              yield put(hideLoader());
      }

}


export function* onSaveClientEstablishmentInfo() {
    yield takeEvery(SAVE_CLIENT_ESTABLISHMENT_INFO, saveEstablishmentInfoToServer);
}


/**
 * Save Organization Info To Server
 */

const clientOrganizationInfoRequestServer = function* (data)
{
    let response = yield api.post('save-organizationinfo', data)
        .then(response => response.data)
        .catch(error => error.response.data);

    return response;
}

/**
 * save Organization Info To Server
 */
function* saveOrganizationInfoToServer(action) {
    try {

        yield put(showLoader());
        const response = yield call(clientOrganizationInfoRequestServer, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess());
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }
      } catch (error) {
              console.log(error);
      }
      finally {
              yield put(hideLoader());
      }
}

export function* onSaveClientOrganizationInfo() {
    yield takeEvery(SAVE_CLIENT_ORGANIZATION_INFO, saveOrganizationInfoToServer);
}


/**
 * Save URL To Server
 */

const clientCustomURLRequestServer = function* (data)
{
    let response = yield api.post('save-url', data)
        .then(response => response.data)
        .catch(error => error.response.data);

    return response;
}

/**
 * save Organization Info To Server
 */
function* saveCustomURLToServer(action) {
    try {
        yield put(showLoader());
        const response = yield call(clientCustomURLRequestServer, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
          localStorage.removeItem('signupdetail_state');
          localStorage.removeItem('signupdetail_props');
          yield put(push('/registrationcompleted'));
          yield put(onSaveClientURLSuccess());

          {/*
            authObject.login({clientId : action.payload.customUrl.url, clientType : action.payload.clientType });
           */}
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }
      } catch (error) {
            console.log(error);
      }
      finally {
            yield put(hideLoader());
      }
}

export function* onSaveClientURL() {
    yield takeEvery(SAVE_CLIENT_URL, saveCustomURLToServer);
}


/**
 * Signup Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(clientSignUpRequest),
          fork(onClientSignupVerification),
          fork(onSaveClientEstablishmentInfo),
          fork(onSaveClientOrganizationInfo),
          fork(onSaveClientURL)
    ]);
}
