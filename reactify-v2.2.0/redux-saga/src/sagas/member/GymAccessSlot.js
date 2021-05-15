
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';

import {getMemberProfileFromServer} from './Membership';
import {settings} from '../states';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
  SAVE_MEMBER_GYMACCESSSLOT,
  DELETE_MEMBER_GYM_ACCESS_SLOT
} from 'Actions/types';

import {
  saveMemberGymAccessSlotSuccess,
  deleteMemberGymAccessSlotSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';

const saveMemberGymAccessSlotRequest = function* (data)
{
  data = cloneDeep(data);
  data.data.notificationdatetime = data.data.starttime;
  data.data.startdatetime = setDateTime(data.data.starttime);
  data.data.enddatetime = setDateTime(data.data.endtime);
    let response = yield api.post('save-member-gymaccessslot',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveMemberGymAccessSlotFromServer(action) {
    try {
          const state = yield select(settings);

            const response = yield call(saveMemberGymAccessSlotRequest,action.payload);

              if(!(response.errorMessage  || response.ORAT))
              {
                    yield put(requestSuccess("Slot assigned successfully."));
                    yield  put(saveMemberGymAccessSlotSuccess());
              }
              else {
                yield put(requestFailure(response.errorMessage));
              }
    } catch (error) {
        console.log(error);
    }
}

export function* saveMemberGymAccessSlot() {
    yield takeEvery(SAVE_MEMBER_GYMACCESSSLOT, saveMemberGymAccessSlotFromServer);
}
/**
 * Delete gym access request
 */
const deleteGymAccessSlotRequest = function* (data)
{  let response = yield api.post('delete-gymaccessslot', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete gym access From Server
 */
 function* deleteGymAccessSlotFromServer(action) {
     try {
       const state = yield select(settings);
       action.payload.branchid = state.memberProfileDetail && state.memberProfileDetail.defaultbranchid;
       const response = yield call(deleteGymAccessSlotRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Slot cancelled successfully."));
             yield  put(deleteMemberGymAccessSlotSuccess());
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
 * delete gym access slot
 */
export function* deleteMemberGymAccessSlot() {
    yield takeEvery(DELETE_MEMBER_GYM_ACCESS_SLOT, deleteGymAccessSlotFromServer);
}


export default function* rootSaga() {
    yield all([
      fork(saveMemberGymAccessSlot),
      fork(deleteMemberGymAccessSlot)
    ]);
}
