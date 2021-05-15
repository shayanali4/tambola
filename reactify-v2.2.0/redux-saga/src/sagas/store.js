/**
 * Product Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import api, {fileUploadConfig} from 'Api';
import {storeReducer,settings} from './states';
import { push } from 'connected-react-router';
import FormData from 'form-data';
import { cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
   GET_STORES,
   SAVE_STORE,
   DELETE_STORE,
  OPEN_VIEW_STORE_MODEL,
  OPEN_EDIT_STORE_MODEL,
  OPEN_ADD_NEW_STORE_MODEL
} from 'Actions/types';

import {
  getStoresSuccess,
  saveStoreSuccess,
  viewStoreSuccess,
  editStoreSuccess,
  opnAddNewStoreModelSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';
/**
 * Send products Request To Server
 */
const getStoresRequest = function* (data)
{let response = yield  api.post('get-stores', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get products From Server
 */

function* getStoresFromServer(action) {
    try {

        const state = yield select(storeReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

        const response = yield call(getStoresRequest,state.tableInfo );
        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getStoresSuccess({data : response[0],pages : response[1]}));
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
export function* getStores() {
    yield takeEvery(GET_STORES, getStoresFromServer);
}
/**
 * Get Change Page size of Employees
 */


/**
 * Send product Save Request To Server
 */
const saveStoreRequest = function* (data)
{
  data = cloneDeep(data);

  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

    data.store.imageFiles.map((files) =>
    formData.append("files", files));

    let response = yield api.post('save-store', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* saveStoreFromServer(action) {
    try {

      
        const response = yield call(saveStoreRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {store} = action.payload;

            if(store.id != 0)
             {
              yield put(requestSuccess("Store updated successfully."));
              }
            else{
              yield put(requestSuccess("Store created successfully."));
            }
            yield  put(saveStoreSuccess());
            yield call(getStoresFromServer);
            yield put(push('/app/store'));
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
export function* saveStore() {
    yield takeEvery(SAVE_STORE, saveStoreFromServer);
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewStoreRequest = function* (data)
 {
   let response = yield api.post('view-store', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW Employee From Server
 */
function* viewStoreFromServer(action) {
    try {
        const response = yield call(viewStoreRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT) )
        {
           yield put(viewStoreSuccess({data : response[0]}));
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
export function* opnViewStoreModel() {
    yield takeEvery(OPEN_VIEW_STORE_MODEL, viewStoreFromServer);
}
/**
 * edit Employee From Server
 */
function* editStoreFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(viewStoreRequest,action.payload);
        const response1 = yield call(getStoreCategorysRequest,action.payload);


        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
        {
        yield put(editStoreSuccess({data : response[0],storecodecategorylist : response1[0]}));
        }
        else {
          yield put(requestFailure(response.errorMessage || response1.errorMessage ));
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
export function* opnEditStoreModel() {
    yield takeEvery(OPEN_EDIT_STORE_MODEL, editStoreFromServer);
}

/**
 * Send Employee Delete Request To Server
 */
const deleteStoreRequest = function* (data)
{  let response = yield api.post('delete-store', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete Employee From Server
 */
function* deleteStoreFromServer(action) {
    try {
        const response = yield call(deleteStoreRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Store deleted successfully."));
          yield call(getStoresFromServer);
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
export function* deleteStore() {
    yield takeEvery(DELETE_STORE, deleteStoreFromServer);

}

const getStoreCategorysRequest = function* (data)
{

  let response = yield  api.post('storecategory-list', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

/**
* VIEW Subscription From Server
*/
function* addStoreFromServer(action) {
   try {
       const state = yield select(settings);

       action.payload.branchid = state.userProfileDetail.defaultbranchid;

       const response = yield call(getStoreCategorysRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
       yield put(opnAddNewStoreModelSuccess({storecodecategorylist : response[0]}));
      }
      else {
        yield put(requestFailure(response.errorMessage ));
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
export function* opnAddNewStoreModel() {
   yield takeEvery(OPEN_ADD_NEW_STORE_MODEL, addStoreFromServer);
}




/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getStores),
        fork(saveStore),
        fork(deleteStore),
      fork(opnViewStoreModel),
      fork(opnEditStoreModel),
      fork(opnAddNewStoreModel),
    ]);
}
