/**
 * Product Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import api, {fileUploadConfig} from 'Api';
import {dealTypeReducer,settings} from './states';
import { push } from 'connected-react-router';
import FormData from 'form-data';
import { cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
   GET_DEALTYPES,
   SAVE_DEALTYPE,
   DELETE_DEALTYPE,
  OPEN_VIEW_DEALTYPE_MODEL,
  OPEN_EDIT_DEALTYPE_MODEL
} from 'Actions/types';

import {
  getDealTypesSuccess,
  saveDealTypeSuccess,
  viewDealTypeSuccess,
  editDealTypeSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';
/**
 * Send products Request To Server
 */
const getDealTypesRequest = function* (data)
{

  let response = yield  api.post('get-dealtypes', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get products From Server
 */

function* getDealTypesFromServer(action) {
    try {
        const state = yield select(dealTypeReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

        const response = yield call(getDealTypesRequest,state.tableInfo );
        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getDealTypesSuccess({data : response[0],pages : response[1]}));
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
export function* getDealTypes() {
    yield takeEvery(GET_DEALTYPES, getDealTypesFromServer);
}
/**
 * Get Change Page size of Employees
 */


/**
 * Send product Save Request To Server
 */
const saveDealTypeRequest = function* (data)
{
  data = cloneDeep(data);
  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

    data.dealtype.imageFiles.map((files) =>
    formData.append("files", files));

    let response = yield api.post('save-dealtype', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* saveDealTypeFromServer(action) {
    try {
        const response = yield call(saveDealTypeRequest,action.payload);
        
        if(!(response.errorMessage  || response.ORAT))
        {
          const {dealtype} = action.payload;

            if(dealtype.id != 0)
             {
              yield put(requestSuccess("Deal Type updated successfully."));
              }
            else{
              yield put(requestSuccess("Deal Type created successfully."));
            }
            yield  put(saveDealTypeSuccess());
            yield call(getDealTypesFromServer);
            yield put(push('/app/deal-type'));
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
export function* saveDealType() {
    yield takeEvery(SAVE_DEALTYPE, saveDealTypeFromServer);
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewDealTypeRequest = function* (data)
 {
   let response = yield api.post('view-dealtype', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW Employee From Server
 */
function* viewDealTypeFromServer(action) {
    try {
        const response = yield call(viewDealTypeRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {

           yield put(viewDealTypeSuccess({data : response[0]}));
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
export function* opnViewDealTypeModel() {
    yield takeEvery(OPEN_VIEW_DEALTYPE_MODEL, viewDealTypeFromServer);
}
/**
 * edit Employee From Server
 */
function* editDealTypeFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(viewDealTypeRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT)  )
        {
        yield put(editDealTypeSuccess({data : response[0]}));
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
export function* opnEditDealTypeModel() {
    yield takeEvery(OPEN_EDIT_DEALTYPE_MODEL, editDealTypeFromServer);
}

/**
 * Send Employee Delete Request To Server
 */
const deleteDealTypeRequest = function* (data)
{  let response = yield api.post('delete-dealtype', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete Employee From Server
 */
function* deleteDealTypeFromServer(action) {
    try {
        const response = yield call(deleteDealTypeRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("DealType deleted successfully."));
          yield call(getDealTypesFromServer);
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
export function* deleteDealType() {
    yield takeEvery(DELETE_DEALTYPE, deleteDealTypeFromServer);

}




/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getDealTypes),
        fork(saveDealType),
        fork(deleteDealType),
      fork(opnViewDealTypeModel),
      fork(opnEditDealTypeModel)
    ]);
}
