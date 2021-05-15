/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {inductionChecklistReducer,settings} from './states';
import { push } from 'connected-react-router';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api, {fileUploadConfig} from 'Api';

import {
  GET_INDUCTION_CHECKLIST_MEMBERS,
} from 'Actions/types';

import {
    getInductionChecklistMembersSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';


/**
 * Send Member Management Request To Server
 */
const getInductionChecklistMembersRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
  data.filtered && data.filtered.map(x => {
    if (x.id == "createdbydate") {
      x.value = setLocalDate(x.value)
    }
  });
  data.startDate = data.startDate ?  setLocalDate(data.startDate ) : null;
  data.endDate = data.endDate ?  setLocalDate(data.endDate ) : null;

  let response = yield  api.post('get-induction-checklist-members', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}
/**
 * Get Members From Server
 */

export function* getInductionChecklistMembersFromServer(action) {
    try {
        const state = yield select(inductionChecklistReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getInductionChecklistMembersRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT) )
        {
            yield put(getInductionChecklistMembersSuccess({data : response[0] , pages : response[1]}));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally {
    }
}

/**
 * Get Members
 */
export function* getMembers() {
    yield takeEvery(GET_INDUCTION_CHECKLIST_MEMBERS, getInductionChecklistMembersFromServer);
}


/**
 * Member Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getMembers)
    ]);
}
