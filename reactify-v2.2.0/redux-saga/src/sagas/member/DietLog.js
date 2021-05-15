
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';

import {
  SAVE_MEMBER_DIET_LOG,
  DELETE_MEMBER_DIET_LOG,
  MEMBER_ACTIVE_DIET_ROUTINE,
  VIEW_MEMBER_DIET_LOG
} from 'Actions/types';

import {
  saveMemberDietLogSuccess,
  memberActiveDietRoutineSuccess,
  viewMemberDietLogSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';

/**
 * Send diet routine List Request To Server
 */
const memberActiveDietLogRequest = function* (data)
{let response = yield  api.post('member-active-diet-routine', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* memberActiveDietLogFromServer(action) {
    try {
        const response = yield call(memberActiveDietLogRequest);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(memberActiveDietRoutineSuccess({dietroutine : response[0][0],allocatediet : response[1][0]}));
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

export function* memberActiveDietRoutine() {
    yield takeEvery(MEMBER_ACTIVE_DIET_ROUTINE, memberActiveDietLogFromServer);
}


const saveDietLogRequest = function* (data)
{

    let response = yield api.post('save-member-dietlog',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveDietLogFromServer(action) {
    try {
            const response = yield call(saveDietLogRequest,action.payload);

              if(!(response.errorMessage  || response.ORAT))
              {
                    yield put(requestSuccess("Log created successfully."));
                  yield  put(saveMemberDietLogSuccess());
              }
              else {
                yield put(requestFailure(response.errorMessage));
              }
    } catch (error) {
        console.log(error);
    }
}

export function* saveMemberDietLog() {
    yield takeEvery(SAVE_MEMBER_DIET_LOG, saveDietLogFromServer);
}

/**
 * Send diet routine Delete Request To Server
 */
const deleteMemberDietLogRequest = function* (data)
{  let response = yield api.post('delete-member-dietlog', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete diet routine From Server
 */
function* deleteMemberDietLogFromServer(action) {
    try {
        yield put(showLoader());
        const response = yield call(deleteMemberDietLogRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Diet log deleted successfully."));

      } else {
         yield put(requestFailure(response.errorMessage));
      }
  } catch (error) {
      console.log(error);
  }
  finally{

  }
}

export function* deleteMemberDietLog() {
    yield takeEvery(DELETE_MEMBER_DIET_LOG, deleteMemberDietLogFromServer);

}


const viewMemberDietLogRequest = function* (data)
{
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
   let response = yield api.post('view-member-dietlog', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}
/**
* VIEW dietroutine From Server
*/
function* viewMemberDietLogFromServer(action) {
   try {

       const response = yield call(viewMemberDietLogRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(viewMemberDietLogSuccess({data : response[0]}));
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
/**
* VIEW dietroutine
*/
export function* viewMemberDietLog() {
   yield takeEvery(VIEW_MEMBER_DIET_LOG, viewMemberDietLogFromServer);
}

export default function* rootSaga() {
    yield all([
      fork(saveMemberDietLog),
      fork(deleteMemberDietLog),
      fork(memberActiveDietRoutine),
      fork(viewMemberDietLog)
    ]);
}
