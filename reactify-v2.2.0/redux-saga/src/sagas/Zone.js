import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';
import {zoneReducer} from './states';
import { push } from 'connected-react-router';

import {
  GET_ZONES,
  SAVE_ZONE,
  OPEN_VIEW_ZONE_MODEL,
  OPEN_EDIT_ZONE_MODEL,
  DELETE_ZONE,
  OPEN_ADD_NEW_ZONE_MODEL,
} from 'Actions/types';

import {
  getZonesSuccess,
  saveZoneSuccess,
  opnAddNewZoneModelSuccess,
  viewZoneSuccess,
  editZoneSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';
/**
 * Send zones Request To Server
 */
const getZoneRequest = function* (data)
{let response = yield  api.post('get-zones', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get zones From Server
 */

function* getZoneFromServer(action) {
    try {
        yield put(showLoader());
        const state = yield select(zoneReducer);
        const response = yield call(getZoneRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getZonesSuccess({data : response[0], pages : response[1]}));
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

/**
 * Get zone
 */
export function* getZones() {
    yield takeEvery(GET_ZONES, getZoneFromServer);
}


const getBranchRequest = function* (data)
{
   let response = yield api.post('branch-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}

function* getBranchlistFromServer(action) {
   try {

       const response = yield call(getBranchRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
       yield put(opnAddNewZoneModelSuccess({branchList : response[0]}));
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

export function* opnAddNewZoneModel() {
   yield takeEvery(OPEN_ADD_NEW_ZONE_MODEL, getBranchlistFromServer);
}

/**
 * Send zone Save Request To Server
 */
const saveZoneRequest = function* (data)
{
    let response = yield api.post('save-zone', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save zone From Server
 */
function* saveZoneFromServer(action) {
    try {
      const response = yield call(saveZoneRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
          const {zone} = action.payload;
          if(zone.id != 0)
          {
            yield put(requestSuccess("Zone updated successfully."));
          }
          else{
            yield put(requestSuccess("Zone created successfully."));
        }
              yield  put(saveZoneSuccess());
              yield call(getZoneFromServer);
               yield put(push('/app/setting/zone'));
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
export function* saveZone() {
    yield takeEvery(SAVE_ZONE, saveZoneFromServer);
}
/**
 * Send zone VIEW Request To Server
 */
 const viewZoneRequest = function* (data)
 {
   let response = yield api.post('view-zone', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW zone From Server
 */
function* viewZoneFromServer(action) {
    try {
         yield put(showLoader());
        const response = yield call(viewZoneRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(viewZoneSuccess({data : response[0]}));
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
 * VIEW zone
 */
export function*  opnViewZoneModel() {
    yield takeEvery(OPEN_VIEW_ZONE_MODEL, viewZoneFromServer);
}

/**
 * edit zone From Server
 */
function* editZoneFromServer(action) {
    try {
        yield put(showLoader());
        const response = yield call(viewZoneRequest,action.payload);
        const response1 = yield call(getBranchRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
        {
             yield put(editZoneSuccess({data : response[0],branchList : response1[0]}));
        }
        else {
               yield put(requestFailure(response.errorMessage || response1.errorMessage));
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
 * Edit zone
 */
export function* opnEditZoneModel() {
    yield takeEvery(OPEN_EDIT_ZONE_MODEL, editZoneFromServer);
}

/**
 * Send zone Delete Request To Server
 */
const deleteZoneRequest = function* (data)
{  let response = yield api.post('delete-zone', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete zone From Server
 */
function* deleteZoneFromServer(action) {
    try {
        yield put(showLoader());
        const response = yield call(deleteZoneRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Zone deleted successfully."));
          yield call(getZoneFromServer);
    } else {
       yield put(requestFailure(response.errorMessage));
    }
  } catch (error) {
      console.log(error);
  }
  finally{
       yield put(hideLoader());
  }
}

/**
 * Get Employees
 */
export function* deleteZone() {
    yield takeEvery(DELETE_ZONE, deleteZoneFromServer);

}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getZones),
      fork(saveZone),
      fork(opnViewZoneModel),
      fork(opnEditZoneModel),
      fork(deleteZone),
      fork(opnAddNewZoneModel),
    ]);
}
