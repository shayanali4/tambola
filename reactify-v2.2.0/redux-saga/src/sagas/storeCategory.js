/**
 * Product Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import api, {fileUploadConfig} from 'Api';
import {storeCategoryReducer,settings} from './states';
import { push } from 'connected-react-router';
import FormData from 'form-data';
import { cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
   GET_STORECATEGORYS,
   SAVE_STORECATEGORY,
   DELETE_STORECATEGORY,
  OPEN_VIEW_STORECATEGORY_MODEL,
  OPEN_EDIT_STORECATEGORY_MODEL
} from 'Actions/types';

import {
  getStoreCategorysSuccess,
  saveStoreCategorySuccess,
  viewStoreCategorySuccess,
  editStoreCategorySuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';
/**
 * Send products Request To Server
 */
const getStoreCategorysRequest = function* (data)
{

  let response = yield  api.post('get-storecategorys', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get products From Server
 */

function* getStoreCategorysFromServer(action) {
    try {
        const state = yield select(storeCategoryReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

        const response = yield call(getStoreCategorysRequest,state.tableInfo );
        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getStoreCategorysSuccess({data : response[0],pages : response[1]}));
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
export function* getStoreCategorys() {
    yield takeEvery(GET_STORECATEGORYS, getStoreCategorysFromServer);
}
/**
 * Get Change Page size of Employees
 */


/**
 * Send product Save Request To Server
 */
const saveStoreCategoryRequest = function* (data)
{
  data = cloneDeep(data);
  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

    data.storecategory.imageFiles.map((files) =>
    formData.append("files", files));

    let response = yield api.post('save-storecategory', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* saveStoreCategoryFromServer(action) {
    try {
        const response = yield call(saveStoreCategoryRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {storecategory} = action.payload;

            if(storecategory.id != 0)
             {
              yield put(requestSuccess("Store Category updated successfully."));
              }
            else{
              yield put(requestSuccess("Store Category created successfully."));
            }
            yield  put(saveStoreCategorySuccess());
            yield call(getStoreCategorysFromServer);
            yield put(push('/app/store-category'));
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
export function* saveStoreCategory() {
    yield takeEvery(SAVE_STORECATEGORY, saveStoreCategoryFromServer);
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewStoreCategoryRequest = function* (data)
 {
   let response = yield api.post('view-storecategory', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW Employee From Server
 */
function* viewStoreCategoryFromServer(action) {
    try {
        const response = yield call(viewStoreCategoryRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          
           yield put(viewStoreCategorySuccess({data : response[0]}));
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
export function* opnViewStoreCategoryModel() {
    yield takeEvery(OPEN_VIEW_STORECATEGORY_MODEL, viewStoreCategoryFromServer);
}
/**
 * edit Employee From Server
 */
function* editStoreCategoryFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(viewStoreCategoryRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT)  )
        {
        yield put(editStoreCategorySuccess({data : response[0]}));
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
 * Edit Employees
 */
export function* opnEditStoreCategoryModel() {
    yield takeEvery(OPEN_EDIT_STORECATEGORY_MODEL, editStoreCategoryFromServer);
}

/**
 * Send Employee Delete Request To Server
 */
const deleteStoreCategoryRequest = function* (data)
{  let response = yield api.post('delete-storecategory', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete Employee From Server
 */
function* deleteStoreCategoryFromServer(action) {
    try {
        const response = yield call(deleteStoreCategoryRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("StoreCategory deleted successfully."));
          yield call(getStoreCategorysFromServer);
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
export function* deleteStoreCategory() {
    yield takeEvery(DELETE_STORECATEGORY, deleteStoreCategoryFromServer);

}




/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getStoreCategorys),
        fork(saveStoreCategory),
        fork(deleteStoreCategory),
      fork(opnViewStoreCategoryModel),
      fork(opnEditStoreCategoryModel)
    ]);
}
