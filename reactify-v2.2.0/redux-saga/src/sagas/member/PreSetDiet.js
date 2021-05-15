import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';
import {memberPreSetDietReducer} from '../states';
import { push } from 'connected-react-router';


import {
GET_MEMBER_ALLOCATEDIETS,
SAVE_MEMBER_DIET_PHASE,
OPEN_MEMBER_VIEW_ALLOCATEDIETS_MODEL
} from 'Actions/types';

import {
  getMemberAllocateDietSuccess,
  saveMemberDietPhaseSuccess,
  viewMemberAllocateSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';



/**
 * Send allocate diet Request To Server
 */
const getAllocateDietRequest = function* (data)
{
  let response = yield  api.post('get-member-allocatediets', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}
/**
 * Get allocatediet From Server
 */

function* getAllocateDietFromServer() {
    try {
        const state = yield select(memberPreSetDietReducer);

        state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        const response = yield call(getAllocateDietRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getMemberAllocateDietSuccess({data : response[0] , pages : response[1]}));
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
 * Get workout schedules
 */
export function* getMemberAllocateDiets() {
    yield takeEvery(GET_MEMBER_ALLOCATEDIETS, getAllocateDietFromServer);
}

/**
 * Send diet Save Request To Server
 */
const saveDietRequest = function* (data)
{
    let response = yield api.post('save-member-phase', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save allocate diet  From Server
 */
function* saveDietFromServer(action) {
    try {
      if(action.payload){
        action.payload.phases = action.payload.phases.map(x => {return {"routineid" :x.routineid,"noofweeks":x.noofweeks,"Isactive":x.Isactive}})
      }
      const response = yield call(saveDietRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
              yield  put(saveMemberDietPhaseSuccess());
              yield call(getAllocateDietFromServer);
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }


/**
 * Get workout routines
 */
export function* saveMemberDietPhase() {
    yield takeEvery(SAVE_MEMBER_DIET_PHASE, saveDietFromServer);
}


const viewMemberAllocateDietRequest = function* (data)
{
  let response = yield api.post('view-member-allocate-diet', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

function* viewMemberAllocateScheduleFromServer(action) {
   try {

       yield put(showLoader());
       const response = yield call(viewMemberAllocateDietRequest,action.payload);
       if(!(response.errorMessage  || response.ORAT))
       {
          yield put(viewMemberAllocateSuccess({data : response[0]}));
      }
     else {
       yield put(requestFailure(response.errorMessage ));
     }
   } catch (error) {
     console.log(error);
   }
   finally
   {
       yield put(hideLoader());
   }
}
/**
* VIEW allocate diet
*/
export function* opnMemberViewAllocateModel() {
   yield takeEvery(OPEN_MEMBER_VIEW_ALLOCATEDIETS_MODEL, viewMemberAllocateScheduleFromServer);
}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getMemberAllocateDiets),
      fork(saveMemberDietPhase),
      fork(opnMemberViewAllocateModel)
    ]);
}
