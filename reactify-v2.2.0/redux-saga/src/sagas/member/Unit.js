/**
 * Employee Management Sagas
 */
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import FormData from 'form-data';
import {settings} from '../states';
import {getMemberProfileFromServer} from './Membership';

// api
import api, {fileUploadConfig} from 'Api';
import {delay} from "Helpers/helpers";

import {
  SAVE_MEMBER_UNIT
} from 'Actions/types';

import {
      requestSuccess,
    requestFailure,
    showLoader,
    hideLoader
} from 'Actions';

const saveMemberUnitRequest = function* (data)
{
 let response = yield  api.post('save-member-unit', data)
     .then(response => response.data)
     .catch(error => error.response.data )
     return response;
}

function* saveMemberUnitToServer() {
   try {
       yield delay(1500);
       const state = yield select(settings);

       let weightunit = state.weightunit == 0 ? "kg" : "lbs";
      let distanceunit = state.distanceunit == 0 ? "km" : "mile";
      let lengthunit = state.lengthunit == 0 ? "cm" : "inch";


       yield call(saveMemberUnitRequest,{weightunit,distanceunit,lengthunit});
       yield call(getMemberProfileFromServer);

   } catch (error) {
       console.log(error);
   }
}


/**
* Get Employees
*/
export function* saveMemberUnit() {
   yield takeEvery(SAVE_MEMBER_UNIT, saveMemberUnitToServer);
}
export default function* rootSaga() {
    yield all([
        fork(saveMemberUnit),

    ]);
}
