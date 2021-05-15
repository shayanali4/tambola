import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import {packageReducer,settings} from './states';

import api from 'Api';
import { NotificationManager } from 'react-notifications';
import { push } from 'connected-react-router';
import { cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
  OPEN_ADD_NEW_PACKAGE_MODEL,
  SAVE_PACKAGE,
  GET_PACKAGES,
  OPEN_VIEW_PACKAGE_MODEL,
  OPEN_EDIT_PACKAGE_MODEL,
  DELETE_PACKAGE
} from 'Actions/types';

import {
  opnAddNewPackageModelSuccess,
  savePackageSuccess,
  getPackagesSuccess,
  editPackageSuccess,
  viewPackageSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';

/**
 * Send Subscription VIEW Request To Server
 */
 const getServiceRequest = function* (data)
 {
    let response = yield api.post('get-servicehit',data)
         .then(response => response.data)
         .catch(error => error.data);

     return response;
 }

 const getBranchRequest = function* (data)
 {
    let response = yield api.post('branch-list',data)
         .then(response => response.data)
         .catch(error => error.data);

     return response;
 }
/**
 * VIEW Subscription From Server
 */
function* addServiceFromServer(action) {
    try {
      const state1 = yield select(settings);
      let tableInfo = {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        isExpressSale : true,
        branchid : state1.userProfileDetail.defaultbranchid,
        enablecomplimentarysale :state1.userProfileDetail.enablecomplimentarysale,
        client_timezoneoffsetvalue : (localStorage.getItem('client_timezoneoffsetvalue') || 330)
      };

        const response1 = yield call(getServiceRequest,tableInfo);

        const response3 = yield call(getBranchRequest,action.payload);
        if(!response1.errorMessage  && !response3.errorMessage )
        {
        yield put(opnAddNewPackageModelSuccess({servicePlanList : response1[0],branchlist : response3[0]}));
       }
       else {
         yield put(requestFailure(response1.errorMessage || response3.errorMessage ));
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
export function* opnAddNewPackageModel() {
    yield takeEvery(OPEN_ADD_NEW_PACKAGE_MODEL, addServiceFromServer);
}

/**
 * Send package Request To Server
 */
const getPackagesRequest = function* (data)
{let response = yield  api.post('get-packages', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get package From Server
 */

function* getPackagesFromServer(action) {
    try {
        const state = yield select(packageReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
          state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

        const response = yield call(getPackagesRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getPackagesSuccess({data : response[0], pages : response[1]}));
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
 * Get enquiry
 */
export function* getPackages() {
    yield takeEvery(GET_PACKAGES, getPackagesFromServer);
}
/**
 * Send package Save Request To Server
 */
const savepackageRequest = function* (data)

{
  data = cloneDeep(data);
  data.packagedetail.launchdate = setLocalDate(data.packagedetail.launchdate);
  data.packagedetail.expirydate  = setLocalDate(data.packagedetail.expirydate );
    let response = yield api.post('save-package', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save package From Server
 */
function* savePackageFromServer(action) {
    try {
        const response = yield call(savepackageRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {packagedetail} = action.payload;
          if(packagedetail.id && packagedetail.id != 0)
          {
            yield put(requestSuccess("Package updated successfully."));
          }
             else {
           yield put(requestSuccess("Package created successfully."));
         }
         yield  put(savePackageSuccess());
         yield call(getPackagesFromServer);
         yield put(push('/app/package'));
       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

/**
 * save package
 */
export function* savePackage() {
    yield takeEvery(SAVE_PACKAGE, savePackageFromServer);
}
/**
 * Send package VIEW Request To Server
 */
 const viewPackageRequest = function* (data)
 {
   let response = yield api.post('view-package', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW package From Server
 */
function* viewPackageFromServer(action) {
    try {
      const response = yield call(viewPackageRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT) )
        {
           yield put(viewPackageSuccess({data : response[0]}));
       }
      else {
        yield put(requestFailure(response.errorMessage ));
      }
    } catch (error) {
      console.log(error);
    }
    finally
    {
    }
}
/**
 * VIEW Employees
 */
export function* opnViewPackageModel() {
    yield takeEvery(OPEN_VIEW_PACKAGE_MODEL, viewPackageFromServer);
}

/**
 * edit package From Server
 */
function* editPackageFromServer(action) { 
    try {
      const state1 = yield select(settings);
      let tableInfo = {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        isExpressSale : true,
        branchid : state1.userProfileDetail.defaultbranchid,
        enablecomplimentarysale :state1.userProfileDetail.enablecomplimentarysale,
        client_timezoneoffsetvalue : (localStorage.getItem('client_timezoneoffsetvalue') || 330)
      };

        const response = yield call(viewPackageRequest,action.payload);
        const response1 = yield call(getServiceRequest,tableInfo);
        const response3 = yield call(getBranchRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage && !response3.errorMessage)
        {
           yield put(editPackageSuccess({data : response[0]  ,servicePlanList : response1[0],branchlist : response3[0]}));
        }
        else {
          yield put(requestFailure(response.errorMessage || response1.errorMessage || response3.errorMessage));
        }
    } catch (error) {
      console.log(error);
    }
    finally
    {
    }
}
/**
 * Edit Employees
 */
export function* opnEditPackageModel() {
    yield takeEvery(OPEN_EDIT_PACKAGE_MODEL, editPackageFromServer);
}
/**
 * Send package Delete Request To Server
 */
const deletePackageRequest = function* (data)
{  let response = yield api.post('delete-package', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete package From Server
 */
function* deletePackageFromServer(action) {
    try {
        const response = yield call(deletePackageRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Package deleted successfully."));
          yield call(getPackagesFromServer);
    } else {
       yield put(requestFailure(response.errorMessage));
    }
  } catch (error) {
      console.log(error);
  }
  finally{
  }
}

/**
 * delete package
 */
export function* deletePackage() {
    yield takeEvery(DELETE_PACKAGE, deletePackageFromServer);

}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(opnAddNewPackageModel),
        fork(getPackages),
        fork(savePackage),
        fork(opnViewPackageModel),
        fork(opnEditPackageModel),
        fork(deletePackage)
    ]);
}
