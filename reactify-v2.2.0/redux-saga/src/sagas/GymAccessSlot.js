
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import {gymAccessSlotReducer,settings} from './states';
import {getClientProfileFromServer} from './EmployeeManagement';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

import api from 'Api';

import {
  OPEN_VIEW_GYM_ACCESS_SLOT_MODEL,
  DELETE_GYM_ACCESS_SLOT,
  CHANGE_SAVE_MEMBER_GYMACCESSSLOT
} from 'Actions/types';

import {
  viewGymAccessSlotSuccess,
  changeSaveMemberGymAccessSlotSuccess,
  changeSaveMemberGymAccessSlotFailure,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';


/**
 * Send Expense VIEW Request To Server
 */
 const viewGymAccessSlotRequest = function* (data)
 {
   data = cloneDeep(data);
   data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
   data.date = setLocalDate(data.date);
   data.startTime = setLocalDate(data.startTime,'HH:mm:ss');

   let response = yield api.post('view-gymaccessslot', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }

function* viewGymAccessSlotFromServer(action) {
    try {
         const state = yield select(gymAccessSlotReducer);
         const state1 = yield select(settings);

         state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;

        const response = yield call(viewGymAccessSlotRequest,state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewGymAccessSlotSuccess({data : response[0], pages : response[1]}));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally
    {

    }
}

export function* opnViewGymAccessSlotmodel() {
    yield takeEvery(OPEN_VIEW_GYM_ACCESS_SLOT_MODEL, viewGymAccessSlotFromServer);
}


const deleteGymAccessSlotRequest = function* (data)
{  let response = yield api.post('delete-gymaccessslot', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete Employee From Server
 */
 function* deleteGymAccessSlotFromServer(action) {
     try {
       const state1 = yield select(settings);

        action.payload.branchid = state1.userProfileDetail.defaultbranchid;
       const response = yield call(deleteGymAccessSlotRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Slot cancelled successfully."));
             yield call(viewGymAccessSlotFromServer);
             yield call(getClientProfileFromServer);
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
export function* deleteGymAccessSlot() {
    yield takeEvery(DELETE_GYM_ACCESS_SLOT, deleteGymAccessSlotFromServer);
}


const changeSaveMemberGymAccessSlotRequest = function* (data)
{
    data = cloneDeep(data);
    data.data.notificationdatetime = data.data.starttime;
    data.data.startdatetime = setDateTime(data.data.starttime);
    data.data.enddatetime = setDateTime(data.data.endtime);

    let response = yield api.post('change-save-member-gymaccessslot',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* changeSaveMemberGymAccessSlotFromServer(action) {
    try {
          const state = yield select(settings);

          action.payload.branchid = state.userProfileDetail.defaultbranchid;
            const response = yield call(changeSaveMemberGymAccessSlotRequest,action.payload);

              if(!(response.errorMessage  || response.ORAT))
              {
                const {data} = action.payload;
                if(data.id && data.id != 0)
                {
                  yield put(requestSuccess("Slot changed successfully."));
                }
                else {
                  yield put(requestSuccess("Member added successfully."));
                }

                    yield  put(changeSaveMemberGymAccessSlotSuccess());
                     yield call(viewGymAccessSlotFromServer);
                     yield call(getClientProfileFromServer);
              }
              else {
                yield  put(changeSaveMemberGymAccessSlotFailure());
                yield put(requestFailure(response.errorMessage));
              }
    } catch (error) {
        console.log(error);
    }
}

export function* changeSaveMemberGymAccessSlot() {
    yield takeEvery(CHANGE_SAVE_MEMBER_GYMACCESSSLOT, changeSaveMemberGymAccessSlotFromServer);
}

export default function* rootSaga() {
    yield all([
      fork(opnViewGymAccessSlotmodel),
      fork(deleteGymAccessSlot),
      fork(changeSaveMemberGymAccessSlot)
    ]);
}
