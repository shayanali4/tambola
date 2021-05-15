/**
 * Product Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import api, {fileUploadConfig} from 'Api';
import {serviceReducer,settings} from './states';
import { push } from 'connected-react-router';
import FormData from 'form-data';
import { cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
   GET_SERVICES,
   SAVE_SERVICE,
   DELETE_SERVICE,
  OPEN_VIEW_SERVICE_MODEL,
  OPEN_EDIT_SERVICE_MODEL,
  OPEN_ADD_NEW_SERVICE_MODEL,
  SAVE_ENABLEONLINESALE_SERVICE,
  GET_SERVICES_PARALLELLIST,
} from 'Actions/types';

import {
  getServicesSuccess,
  saveServiceSuccess,
  viewServiceSuccess,
  editServiceSuccess,
  opnAddNewServiceModelSuccess,
  saveEnableOnlineSaleServiceSuccess,
  getServicesParallellistSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';
/**
 * Send products Request To Server
 */
const getServicesRequest = function* (data)
{
  
  let response = yield  api.post('get-services', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get products From Server
 */

function* getServicesFromServer(action) {
    try {

        const state = yield select(serviceReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

        const response = yield call(getServicesRequest,state.tableInfo );
        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getServicesSuccess({data : response[0],pages : response[1]}));
    }
    else {
        yield put(requestFailure(response.errorMessage));
    }

  }catch (error) {
        console.log(error);
    }
    finally {
    }
}

/**
 * Get Employees
 */
export function* getServices() {
    yield takeEvery(GET_SERVICES, getServicesFromServer);
}
/**
 * Get Change Page size of Employees
 */


/**
 * Send product Save Request To Server
 */
const saveServiceRequest = function* (data)
{
  data = cloneDeep(data);
  data.service.launchdate = setLocalDate(data.service.launchdate);
  data.service.expirydate  = setLocalDate(data.service.expirydate );
  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

    data.service.imageFiles.map((files) =>
    formData.append("files", files));

    let response = yield api.post('save-service', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* saveServiceFromServer(action) {
    try {
        const response = yield call(saveServiceRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {service} = action.payload;

            if(service.id != 0)
             {
              yield put(requestSuccess("Service updated successfully."));
              }
            else{
              yield put(requestSuccess("Service created successfully."));
            }
            yield  put(saveServiceSuccess());
            yield call(getServicesFromServer);
            yield put(push('/app/service'));
         }
          else {
          yield put(requestFailure(response.errorMessage));
              }

        } catch (error) {
        console.debug(error);
        }
  }

/**
 * Get Employees
 */
export function* saveService() {
    yield takeEvery(SAVE_SERVICE, saveServiceFromServer);
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewServiceRequest = function* (data)
 {
   let response = yield api.post('view-service', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW Employee From Server
 */
function* viewServiceFromServer(action) {
    try {
        const response = yield call(viewServiceRequest,action.payload);
        const response1 = yield call(getTaxCodeCategoryRequest,{isService : 1});
        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
        {
           yield put(viewServiceSuccess({data : response[0],taxcodecategorylist : response1[0]}));
        }
        else {
          console.log(error);
        }
    } catch (error) {
        yield put(requestFailure(error));
    }
    finally
    {
    }
}
/**
 * VIEW Employees
 */
export function* opnViewServiceModel() {
    yield takeEvery(OPEN_VIEW_SERVICE_MODEL, viewServiceFromServer);
}
/**
 * edit Employee From Server
 */
function* editServiceFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(viewServiceRequest,action.payload);
        const response1 = yield call(getTaxCodeCategoryRequest,{isService : 1});
        const response2 = yield call(getBranchRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage && !response2.errorMessage )
        {
        yield put(editServiceSuccess({data : response[0],taxcodecategorylist : response1[0],branchlist : response2[0]}));
      }
      else {
        yield put(requestFailure(response.errorMessage || response1.errorMessage || response2.errorMessage ));
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
export function* opnEditServiceModel() {
    yield takeEvery(OPEN_EDIT_SERVICE_MODEL, editServiceFromServer);
}

/**
 * Send Employee Delete Request To Server
 */
const deleteServiceRequest = function* (data)
{  let response = yield api.post('delete-service', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete Employee From Server
 */
function* deleteServiceFromServer(action) {
    try {
        const response = yield call(deleteServiceRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Service deleted successfully."));
          yield call(getServicesFromServer);
       }
    else {
       yield put(requestFailure(response.errorMessage));
    }
  }catch (error) {
      console.log(error);
    }
    finally{

    }
}

/**
 * Get Employees
 */
export function* deleteService() {
    yield takeEvery(DELETE_SERVICE, deleteServiceFromServer);

}
const getTaxCodeCategoryRequest = function* (data)
{
   let response = yield api.post('taxcodecategory-list',data)
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

const getParallelPlanRequest = function* (data)
{
   let response = yield api.post('serviceparallelplan-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}

/**
* VIEW Subscription From Server
*/
function* addServiceFromServer(action) {
   try {
       const state = yield select(settings);

       action.payload.branchid = state.userProfileDetail.defaultbranchid;
       const response = yield call(getTaxCodeCategoryRequest,{isService : 1});
       const response1 = yield call(getBranchRequest,action.payload);
       const response2 = yield call(getParallelPlanRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage && !response2.errorMessage)
       {
       yield put(opnAddNewServiceModelSuccess({taxcodecategorylist : response[0],branchlist : response1[0],parallelplanlist : response2[0]}));
      }
      else {
        yield put(requestFailure(response.errorMessage || response1.errorMessage || response2.errorMessage));
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
export function* opnAddNewServiceModel() {
   yield takeEvery(OPEN_ADD_NEW_SERVICE_MODEL, addServiceFromServer);
}

/**
 * Send EnableOnlineSaleService Request To Server
 */
const saveEnableOnlineSaleServiceRequest = function* (data)
{
    let response = yield api.post('save-bulkenablesaleonline-service', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save transfer enquiry From Server
 */
function* saveEnableOnlineSaleServiceFromServer(action) {
    try {
      const response = yield call(saveEnableOnlineSaleServiceRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
        const data = action.payload.requestData;

          if(data.isEnable == 1)
           {
             yield put(requestSuccess("Services enabled for sale online successfully."));
            }
          else{
            yield put(requestSuccess("Services disabled for sale online successfully."));
          }
              yield  put(saveEnableOnlineSaleServiceSuccess());
              yield call(getServicesFromServer);
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }


/**
 * Get EnableOnlineSaleService
 */
export function* saveEnableOnlineSaleService() {
    yield takeEvery(SAVE_ENABLEONLINESALE_SERVICE, saveEnableOnlineSaleServiceFromServer);
}


function* getServiceParallellistFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;

        const response = yield call(getParallelPlanRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT) )
        {
        yield put(getServicesParallellistSuccess({data : response[0]}));
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
 * Edit Employees
 */
export function* getServicesParallellist() {
    yield takeEvery(GET_SERVICES_PARALLELLIST, getServiceParallellistFromServer);
}


/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getServices),
        fork(saveService),
        fork(deleteService),
      fork(opnViewServiceModel),
      fork(opnEditServiceModel),
      fork(opnAddNewServiceModel),
      fork(saveEnableOnlineSaleService),
      fork(getServicesParallellist)
    ]);
}
