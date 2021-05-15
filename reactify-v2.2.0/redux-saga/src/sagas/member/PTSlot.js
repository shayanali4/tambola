
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';

import {getMemberProfileFromServer} from './Membership';
import {settings} from '../states';
import {cloneDeep,setLocalDate,setDateTime,setLocalTime} from 'Helpers/helpers';

import {
  SAVE_MEMBER_PTSLOT,
  DELETE_MEMBER_PT_SLOT,
  SAVE_MEMBER_ONLINEATTENDANCE
} from 'Actions/types';

import {
  saveMemberPTSlotSuccess,
  deleteMemberPTSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';

const saveMemberPTSlotRequest = function* (data)
{
  data = cloneDeep(data);
  data.data.notificationdatetime = cloneDeep(data.data.starttime);
  data.data.startdatetime = setDateTime(data.data.starttime);
  data.data.enddatetime = setDateTime(data.data.endtime);
    let response = yield api.post('save-member-ptslot',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveMemberPTSlotFromServer(action) {
    try {
          const state = yield select(settings);

            const response = yield call(saveMemberPTSlotRequest,action.payload);

              if(!(response.errorMessage  || response.ORAT))
              {
                    yield put(requestSuccess("PT Slot assigned successfully."));
                    yield  put(saveMemberPTSlotSuccess());
                     yield call(getMemberProfileFromServer);
              }
              else {
                yield put(requestFailure(response.errorMessage));
              }
    } catch (error) {
        console.log(error);
    }
}

export function* saveMemberPTSlot() {
    yield takeEvery(SAVE_MEMBER_PTSLOT, saveMemberPTSlotFromServer);
}


/**
 * Delete pt slot request
 */
const deletePTSlotRequest = function* (data)
{
  data = cloneDeep(data);
  data.notificationdatetime = cloneDeep(data.starttime);
  data.startdatetime = setDateTime(data.starttime);
  let response = yield api.post('delete-ptslot', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete pt Slot From Server
 */
 function* deletePTFromServer(action) {
     try {
       const state = yield select(settings);
       action.payload.branchid = state.memberProfileDetail && state.memberProfileDetail.defaultbranchid;
       const response = yield call(deletePTSlotRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("PT Slot cancelled successfully."));
             yield  put(deleteMemberPTSuccess());
        }
        else {
           yield put(requestFailure(response.errorMessage));
        }

     } catch (error) {
         console.log(error);
     }
     finally{
     }
 }

/**
 * delete pt slot
 */
export function* deleteMemberPTSlot() {
    yield takeEvery(DELETE_MEMBER_PT_SLOT, deletePTFromServer);
}


const saveMemberOnlineAttendanceRequest = function* (data)
{
    let response = yield api.post('save-member-onlineattendance',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveMemberOnlineAttendanceFromServer(action) {
    try {
          const state = yield select(settings);
          action.payload.branchid = state.memberProfileDetail && state.memberProfileDetail.defaultbranchid;

            const response = yield call(saveMemberOnlineAttendanceRequest,action.payload);

              if(!(response.errorMessage  || response.ORAT))
              {
                    //yield put(requestSuccess("PT Slot assigned successfully."));

              }
              else {
                yield put(requestFailure(response.errorMessage));
              }
    } catch (error) {
        console.log(error);
    }
}

export function* saveMemberOnlineAttendance() {
    yield takeEvery(SAVE_MEMBER_ONLINEATTENDANCE, saveMemberOnlineAttendanceFromServer);
}


export default function* rootSaga() {
    yield all([
      fork(saveMemberPTSlot),
      fork(deleteMemberPTSlot),
      fork(saveMemberOnlineAttendance)
    ]);
}
