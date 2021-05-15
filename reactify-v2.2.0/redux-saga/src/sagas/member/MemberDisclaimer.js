import { all, call, fork, put, takeEvery ,select} from 'redux-saga/effects';
import {memberDisclaimerReducer} from '../states';
import {getMemberProfileFromServer} from './Membership';
import api from 'Api';
import { push } from 'connected-react-router';

import {
  OPEN_MEMBER_DISCLAIMER_MODEL,
  SAVE_MEMBER_DISCLAIMER,
  GET_MEMBER_DISCLAIMER_SAVED_FORM,
} from 'Actions/types';

import {
opnMemberDisclaimerModelSuccess,
saveMemberDisclaimerSuccess,
getMemberDisclaimerSavedFormSuccess,
requestSuccess,
requestFailure,
showLoader,
hideLoader
} from 'Actions';


const viewDisclaimerRequest = function* (data)
{  let response = yield api.post('view-disclaimer', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}


function* opnDisclaimerFromServer(action) {
    try {
      const response = yield call(viewDisclaimerRequest,{});
      if(!(response.errorMessage  || response.ORAT))
      {
          yield put(opnMemberDisclaimerModelSuccess({configuration : response[0],  questions : response[1],  rules : response[2] }));
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

export function* opnMemberDisclaimerModel() {
    yield takeEvery(OPEN_MEMBER_DISCLAIMER_MODEL, opnDisclaimerFromServer);
}

const saveMemberDisclaimerRequest = function* (data)
{
    let response = yield api.post('save-member-disclaimer', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveMemberDisclaimerFromServer(action) {
    try {
        const response = yield call(saveMemberDisclaimerRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess("Saved successfully."));

         yield  put(saveMemberDisclaimerSuccess());
         //yield call(opnDisclaimerFromServer);
         yield call(getMemberProfileFromServer);
         yield put(push('/member-app/membership'));
       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

export function* saveMemberDisclaimer() {
    yield takeEvery(SAVE_MEMBER_DISCLAIMER, saveMemberDisclaimerFromServer);
}


const getMemberDisclaimerSavedFormRequest = function* (data)
{
    let response = yield api.post('get-member-saved-disclaimer',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* getMemberDisclaimerSavedFormFromServer(action) {
    try {
        const response = yield call(getMemberDisclaimerSavedFormRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          let disclaimerform = JSON.parse(response[0][0].disclaimerform);
          let emergencydetail = JSON.parse(response[0][0].emergencydetail);

          yield put(getMemberDisclaimerSavedFormSuccess({basicList : disclaimerform.basicList,
          workoutHistory : disclaimerform.workoutHistory,medicalHistory : disclaimerform.medicalHistory ,
          ruleList : disclaimerform.ruleList , declaration : disclaimerform.declaration,
          emergencydetail : emergencydetail}));
       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

export function* getMemberDisclaimerSavedForm() {
    yield takeEvery(GET_MEMBER_DISCLAIMER_SAVED_FORM, getMemberDisclaimerSavedFormFromServer);
}


/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(opnMemberDisclaimerModel),
      fork(saveMemberDisclaimer),
      fork(getMemberDisclaimerSavedForm),
    ]);
}
