/**
 * Product Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import api, {fileUploadConfig} from 'Api';
import {dealReducer,settings} from './states';
import { push } from 'connected-react-router';
import FormData from 'form-data';
import { cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
   GET_DEALS,
   SAVE_DEAL,
   DELETE_DEAL,
  OPEN_VIEW_DEAL_MODEL,
  OPEN_EDIT_DEAL_MODEL,
  OPEN_ADD_NEW_DEAL_MODEL
} from 'Actions/types';

import {
  getDealsSuccess,
  saveDealSuccess,
  viewDealSuccess,
  editDealSuccess,
  opnAddNewDealModelSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';
/**
 * Send products Request To Server
 */
const getDealsRequest = function* (data)
{let response = yield  api.post('get-deals', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get products From Server
 */

function* getDealsFromServer(action) {
    try {

        const state = yield select(dealReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

        const response = yield call(getDealsRequest,state.tableInfo );
        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getDealsSuccess({data : response[0],pages : response[1]}));
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
export function* getDeals() {
    yield takeEvery(GET_DEALS, getDealsFromServer);
}
/**
 * Get Change Page size of Employees
 */


/**
 * Send product Save Request To Server
 */
const saveDealRequest = function* (data)
{
  data = cloneDeep(data);
  
  data.deal.launchdate = setLocalDate(data.deal.launchdate);
  data.deal.expirydate  = setLocalDate(data.deal.expirydate );
  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

    let response = yield api.post('save-deal', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* saveDealFromServer(action) {
    try {


        const response = yield call(saveDealRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {deal} = action.payload;

            if(deal.id != 0)
             {
              yield put(requestSuccess("Deal updated successfully."));
              }
            else{
              yield put(requestSuccess("Deal created successfully."));
            }
            yield  put(saveDealSuccess());
            yield call(getDealsFromServer);
            yield put(push('/app/deal'));
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
export function* saveDeal() {
    yield takeEvery(SAVE_DEAL, saveDealFromServer);
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewDealRequest = function* (data)
 {
   let response = yield api.post('view-deal', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW Employee From Server
 */
function* viewDealFromServer(action) {
    try {
        const response = yield call(viewDealRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT) )
        {
           yield put(viewDealSuccess({data : response[0]}));
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
export function* opnViewDealModel() {
    yield takeEvery(OPEN_VIEW_DEAL_MODEL, viewDealFromServer);
}
/**
 * edit Employee From Server
 */
function* editDealFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(viewDealRequest,action.payload);
        const response1 = yield call(getDealTypesRequest,action.payload);
        const response2 = yield call(getStoreRequest,action.payload);


        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage && !response2.errorMessage)
        {
        yield put(editDealSuccess({data : response[0],dealtypelist : response1[0] , storelist : response2[0]}));
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
export function* opnEditDealModel() {
    yield takeEvery(OPEN_EDIT_DEAL_MODEL, editDealFromServer);
}

/**
 * Send Employee Delete Request To Server
 */
const deleteDealRequest = function* (data)
{  let response = yield api.post('delete-deal', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete Employee From Server
 */
function* deleteDealFromServer(action) {
    try {
        const response = yield call(deleteDealRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Deal deleted successfully."));
          yield call(getDealsFromServer);
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
export function* deleteDeal() {
    yield takeEvery(DELETE_DEAL, deleteDealFromServer);

}

const getDealTypesRequest = function* (data)
{

  let response = yield  api.post('dealtype-list', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}


const getStoreRequest = function* (data)
{

  let response = yield  api.post('store-list', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

/**
* VIEW Subscription From Server
*/
function* addDealFromServer(action) {
   try {
       const state = yield select(settings);

       action.payload.branchid = state.userProfileDetail.defaultbranchid;

       const response = yield call(getDealTypesRequest,action.payload);
       const response1 = yield call(getStoreRequest,action.payload);


       if(!(response.errorMessage  || response.ORAT)  && !response1.errorMessage)
       {
       yield put(opnAddNewDealModelSuccess({dealtypelist : response[0]  , storelist : response1[0]}));
      }
      else {
        yield put(requestFailure(response.errorMessage || response1.errorMessage ));
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
export function* opnAddNewDealModel() {
   yield takeEvery(OPEN_ADD_NEW_DEAL_MODEL, addDealFromServer);
}




/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getDeals),
        fork(saveDeal),
        fork(deleteDeal),
      fork(opnViewDealModel),
      fork(opnEditDealModel),
      fork(opnAddNewDealModel),
    ]);
}
