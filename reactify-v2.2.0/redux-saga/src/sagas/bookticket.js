/**
 * Product Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import api, {fileUploadConfig} from 'Api';
import {bookticketReducer,settings} from './states';
import { push } from 'connected-react-router';
import FormData from 'form-data';
import { cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
   GET_BOOKTICKETS,
   SAVE_BOOKTICKET,
   DELETE_BOOKTICKET,
  OPEN_VIEW_BOOKTICKET_MODEL,
  OPEN_EDIT_BOOKTICKET_MODEL,
  OPEN_ADD_NEW_BOOKTICKET_MODEL
} from 'Actions/types';

import {
  getBookTicketsSuccess,
  saveBookTicketSuccess,
  deleteBookTicketSuccess,
  viewBookTicketSuccess,
  editBookTicketSuccess,
  opnAddNewBookTicketModelSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';
/**
 * Send products Request To Server
 */
const getBookTicketsRequest = function* (data)
{let response = yield  api.post('get-booktickets', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get products From Server
 */

function* getBookTicketsFromServer(action) {
    try {

        const state = yield select(bookticketReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

        const response = yield call(getBookTicketsRequest,state.tableInfo );
        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getBookTicketsSuccess({data : response[0],pages : response[1]}));
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
export function* getBookTickets() {
    yield takeEvery(GET_BOOKTICKETS, getBookTicketsFromServer);
}
/**
 * Get Change Page size of Employees
 */


/**
 * Send product Save Request To Server
 */
const saveBookTicketRequest = function* (data)
{
  data = cloneDeep(data);

  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

    let response = yield api.post('save-bookticket', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* saveBookTicketFromServer(action) {
    try {


        const response = yield call(saveBookTicketRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {bookticket} = action.payload;


              yield put(requestSuccess("Ticket booked successfully."));

            yield  put(saveBookTicketSuccess());
            yield call(getBookTicketsFromServer);
            yield put(push('/app/book-ticket'));
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
export function* saveBookTicket() {
    yield takeEvery(SAVE_BOOKTICKET, saveBookTicketFromServer);
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewBookTicketRequest = function* (data)
 {
   let response = yield api.post('view-bookticket', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW Employee From Server
 */
function* viewBookTicketFromServer(action) {
    try {
        const response = yield call(viewBookTicketRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT) )
        {
           yield put(viewBookTicketSuccess({data : response[0]}));
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
export function* opnViewBookTicketModel() {
    yield takeEvery(OPEN_VIEW_BOOKTICKET_MODEL, viewBookTicketFromServer);
}
/**
 * edit Employee From Server
 */
function* editBookTicketFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(viewBookTicketRequest,action.payload);


        if(!(response.errorMessage  || response.ORAT) )
        {
        yield put(editBookTicketSuccess({data : response[0], tickets : response[1] }));
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
export function* opnEditBookTicketModel() {
    yield takeEvery(OPEN_EDIT_BOOKTICKET_MODEL, editBookTicketFromServer);
}

/**
 * Send Employee Delete Request To Server
 */
const deleteBookTicketRequest = function* (data)
{  let response = yield api.post('delete-bookticket', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete Employee From Server
 */
function* deleteBookTicketFromServer(action) {
    try {
        const response = yield call(deleteBookTicketRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Booked Ticket cancelled successfully."));
          yield  put(saveBookTicketSuccess());
          yield call(getBookTicketsFromServer);
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
export function* deleteBookTicket() {
    yield takeEvery(DELETE_BOOKTICKET, deleteBookTicketFromServer);

}

const getBookTicketTypesRequest = function* (data)
{

  let response = yield  api.post('booktickettype-list', data)
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
function* addBookTicketFromServer(action) {
   try {
       const state = yield select(settings);

       action.payload.branchid = state.userProfileDetail.defaultbranchid;

       const response = yield call(getBookTicketTypesRequest,action.payload);
       const response1 = yield call(getStoreRequest,action.payload);


       if(!(response.errorMessage  || response.ORAT)  && !response1.errorMessage)
       {
       yield put(opnAddNewBookTicketModelSuccess({booktickettypelist : response[0]  , storelist : response1[0]}));
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
export function* opnAddNewBookTicketModel() {
   yield takeEvery(OPEN_ADD_NEW_BOOKTICKET_MODEL, addBookTicketFromServer);
}




/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getBookTickets),
        fork(saveBookTicket),
        fork(deleteBookTicket),
      fork(opnViewBookTicketModel),
      fork(opnEditBookTicketModel)
    ]);
}
