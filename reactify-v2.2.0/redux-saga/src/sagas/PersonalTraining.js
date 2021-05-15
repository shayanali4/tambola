/**
 * Member Subscription Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {personaltrainingReducer,settings} from './states';
import { push } from 'connected-react-router';
import {cloneDeep,setLocalDate,setDateTime,setLocalTime} from 'Helpers/helpers';

// api
import api from 'Api';

import {
  GET_MEMBER_PERSONALTRAINING_LIST,
  OPEN_ADD_ASSIGNTRAINER_MODEL,
  SAVE_ASSIGNTRAINER,
  OPEN_VIEW_ASSIGNTRAINER_MODEL,
  SAVE_NOTE_NEXTSESSION,
  SAVE_PTSLOT,
  OPEN_VIEW_PT_SLOT_MODEL,
  DELETE_PT_SLOT,
  SAVE_ONLINEACCESSURL
} from 'Actions/types';

import {
    getMemberPersonalTrainingListSuccess,
    opnAddAssignTrainerModelSuccess,
    saveAssignTrainerSuccess,
    viewAssignTrainerSuccess,
    savePTSlotSuccess,
    savePTSlotFailure,
    viewPTSlotSuccess,
    saveOnlineAccessUrlSuccess,
    saveNoteforNextSessionSuccess,
    deletePTSlotSuccess,
    requestSuccess,
    requestFailure,
    showLoader,
    hideLoader,
} from 'Actions';

  /**
   * Send Subscription List Request To Server
   */
  const getMemberPersonalTrainingListRequest = function* (data)
  {
    data = cloneDeep(data);
    data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

    data.filtered.map(x => {
      if(x.id == "startdate" || x.id == "expirydatesubscription") {
        x.value = setLocalDate(x.value)
      }
    });
    let response = yield  api.post('get-personaltraininglist', data)
          .then(response => response.data)
          .catch(error => error.response.data);

        return response;
  }
  /**
   * Get Subscribers List From Server
   */

  function* getMemberPersonalTrainingListFromServer(action) {
      try {

          const state = yield select(personaltrainingReducer);
          const state1 = yield select(settings);

          state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
          const response = yield call(getMemberPersonalTrainingListRequest, state.tableInfo);

          if(!(response.errorMessage  || response.ORAT))
          {
              yield put(getMemberPersonalTrainingListSuccess({data : response[0] , pages : response[1]}));
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
   * Get Subscription List
   */
  export function* getMemberPersonalTrainingList() {
      yield takeEvery(GET_MEMBER_PERSONALTRAINING_LIST, getMemberPersonalTrainingListFromServer);
  }

  const getEmployeeRequest = function* (data)
  {
     let response = yield api.post('employee-list',data)
          .then(response => response.data)
          .catch(error => error.data);

      return response;
  }

 /**
  * VIEW Subscription From Server
  */
 function* addPersonalTrainingFromServer(action) {
     try {
           const state = yield select(settings);
           let branchid = state.userProfileDetail.defaultbranchid;
           const response = yield call(getEmployeeRequest,{branchid});
           if(!(response.errorMessage  || response.ORAT))
              {
               yield put(opnAddAssignTrainerModelSuccess({employeeList : response[0]}));
              }
              else {
                yield put(requestFailure(response.errorMessage));
              }
          }catch (error) {
               console.log(error);
          }
          finally
          {
              yield put(hideLoader());
          }
 }
 /**
  * VIEW Subscriptions
  */
 export function* opnAddAssignTrainerModel() {
     yield takeEvery(OPEN_ADD_ASSIGNTRAINER_MODEL, addPersonalTrainingFromServer);
 }

 /**
  * Send product Save Request To Server
  */
 const saveAssignTrainerRequest = function* (data)
 {
   data = cloneDeep(data);
   data.trainerdetail.schedule.map(x => {
     if(x.checked )
     {
         x.starttime = setDateTime(x.starttime);
         x.endtime = setDateTime(x.endtime);
     }
    });
     let response = yield api.post('save-assigntrainer', data)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }
 /**
  * save product From Server
  */
 function* saveAssignTrainerFromServer(action) {
     try {
       const response = yield call(saveAssignTrainerRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
             yield put(requestSuccess("Trainer Assigned successfully."));
               yield  put(saveAssignTrainerSuccess());
               yield call(getMemberPersonalTrainingListFromServer);
               yield put(push('/app/personal-training/pt'));
     }
           else {
             yield put(requestFailure(response.errorMessage));
           }

       } catch (error) {
           console.log(error);
       }
       }


 /**
  * Get Employees
  */
 export function* saveAssignTrainer() {
     yield takeEvery(SAVE_ASSIGNTRAINER, saveAssignTrainerFromServer);
 }
 /**
  * Send Product VIEW Request To Server
  */
  const viewTrainerequest = function* (data)
  {  let response = yield api.post('view-assigntrainer', data)
        .then(response => response.data)
        .catch(error => error.response.data )

      return response;
  }

  const saveNoteforNextSessionRequest = function* (data)
  {
      let response = yield api.post('save-notefor-nextsession', data)
          .then(response => response.data)
          .catch(error => error.response.data )

      return response;
  }

  function* saveNoteforNextSessionFromServer(action) {
      try {
        const response = yield call(saveNoteforNextSessionRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
              yield put(requestSuccess("Note Added Successfully!!"));
                // yield call(getMemberPersonalTrainingListFromServer);
                // yield put(push('/app/personal-training/pt'));
                yield  put(saveNoteforNextSessionSuccess());
      }
            else {
              yield put(requestFailure(response.errorMessage));
            }

        } catch (error) {
            console.log(error);
        }
        }

  export function* saveNoteforNextSession() {
      yield takeEvery(SAVE_NOTE_NEXTSESSION, saveNoteforNextSessionFromServer);
  }

  const savePTSlotRequest = function* (data)
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

  function* savePTSlotFromServer(action) {
      try {
            const state = yield select(settings);

              const response = yield call(savePTSlotRequest,action.payload);

                if(!(response.errorMessage  || response.ORAT))
                {
                      yield put(requestSuccess("PT Slot assigned successfully."));
                      yield  put(savePTSlotSuccess());
                }
                else {
                      yield  put(savePTSlotFailure());
                      yield put(requestFailure(response.errorMessage));
                }
      } catch (error) {
          console.log(error);
      }
  }

  export function* savePTSlot() {
      yield takeEvery(SAVE_PTSLOT, savePTSlotFromServer);
  }
  /**
   * Send Expense VIEW Request To Server
   */
   const viewPTSlotRequest = function* (data)
   {
     data = cloneDeep(data);
     data.date = setLocalDate(data.date);
      data.startTime = setLocalTime(data.startTime,'HH:mm:ss');
       data.endDate = setLocalDate(data.endDate);
     data.filtered && data.filtered.map(x => {
       if(x.id == "startdatetime" || x.id == "lastcheckin" || x.id == "last_covid19submitdate" ) {
         x.value = setLocalDate(x.value);
       }
       else if (x.id == "starttime") {
         x.value = setLocalTime(x.value,'HH:mm:ss');
       }
     });
     let response = yield api.post('view-ptslot', data)
         .then(response => response.data)
         .catch(error => error.response.data )

       return response;
   }

  function* viewPTSlotFromServer(action) {
      try {

           const state = yield select(personaltrainingReducer);
           const state1 = yield select(settings);

          state.tableInfoPTSlot.branchid = state1.userProfileDetail.defaultbranchid;
          state.tableInfoPTSlot.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

          const response = yield call(viewPTSlotRequest,state.tableInfoPTSlot);

          if(!(response.errorMessage  || response.ORAT))
          {
              yield put(viewPTSlotSuccess({data : response[0], pages : response[1]}));
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

  export function* opnViewPTSlotmodel() {
      yield takeEvery(OPEN_VIEW_PT_SLOT_MODEL, viewPTSlotFromServer);
  }
  const deletePTSlotRequest = function* (data)
{
  data = cloneDeep(data);
  data.notificationdatetime = cloneDeep(data.startdatetime);
  data.startdatetime = setDateTime(data.startdatetime);

  let response = yield api.post('delete-ptslot', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete pt From Server
 */
 function* deletePTSlotFromServer(action) {
     try {
       const state1 = yield select(settings);

       action.payload.branchid = state1.userProfileDetail.defaultbranchid;
       const response = yield call(deletePTSlotRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("PT Slot cancelled successfully."));
             yield put(deletePTSlotSuccess());
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
export function* deletePTSlot() {
    yield takeEvery(DELETE_PT_SLOT, deletePTSlotFromServer);
}


const saveOnlineAccessUrlRequest = function* (data)
{
    let response = yield api.post('save-onlineaccessurl', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveOnlineAccessUrlFromServer(action) {
    try {
      const response = yield call(saveOnlineAccessUrlRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
            yield put(requestSuccess("Online Access Url Added Successfully!!"));
              // yield call(getMemberPersonalTrainingListFromServer);
              // yield put(push('/app/personal-training/pt'));
              yield  put(saveOnlineAccessUrlSuccess());
    }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }

export function* saveOnlineAccessUrl() {
    yield takeEvery(SAVE_ONLINEACCESSURL, saveOnlineAccessUrlFromServer);
}


/**
 * Subscription Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getMemberPersonalTrainingList),
        fork(opnAddAssignTrainerModel),
        fork(saveAssignTrainer),
        fork(saveNoteforNextSession),
        fork(savePTSlot),
        fork(opnViewPTSlotmodel),
        fork(deletePTSlot),
        fork(saveOnlineAccessUrl)
    ]);
}
