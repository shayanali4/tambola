/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {staffpayReducer,settings} from './states';
import { push } from 'connected-react-router';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api from 'Api';

import {
  SAVE_STAFFPAY,
  GET_STAFFPAY,
  OPEN_VIEW_STAFFPAY_MODEL,
  DELETE_STAFFPAY,
  OPEN_ADD_NEW_STAFFPAY_MODEL,
} from 'Actions/types';

import {
    saveStaffPaySuccess,
    opnAddNewStaffPayModelSuccess,
    getStaffPaySuccess,
    viewStaffPaySuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

/**
 * Send Expense Save Request To Server
 */
const saveStaffPayRequest = function* (data)
{
    data = cloneDeep(data);
    data.staffpaydetail.paymentdate = setLocalDate(data.staffpaydetail.paymentdate);
    data.staffpaydetail.chequeDate = setLocalDate(data.staffpaydetail.chequeDate);
    data.staffpaydetail.month = setLocalDate(data.staffpaydetail.month);
    let response = yield api.post('save-staffpay', data)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveStaffPayFromServer(action) {
    try {
      const state1 = yield select(settings);

      action.payload.branchid = state1.userProfileDetail.defaultbranchid;

        const response = yield call(saveStaffPayRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {

            yield put(requestSuccess("Staff Pay added successfully."));
            yield put(saveStaffPaySuccess());
            yield call(getStaffPayFromServer);
             yield put(push('/app/expense-management/staff-pay'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveStaffPay() {
    yield takeEvery(SAVE_STAFFPAY, saveStaffPayFromServer);
}

/**
 * Send Expense List Request To Server
 */
const getStaffPayRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "paymentdate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-staffpay', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getStaffPayFromServer(action) {
    try {
        const state = yield select(staffpayReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getStaffPayRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getStaffPaySuccess({data : response[0] , pages : response[1]}));
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
 * Get Members
 */
export function* getStaffPay() {
    yield takeEvery(GET_STAFFPAY, getStaffPayFromServer);
}

/**
 * Send Expense VIEW Request To Server
 */
 const viewStaffPayRequest = function* (data)
 {  let response = yield api.post('view-staffpay', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }

function* viewStaffPayFromServer(action) {
    try {
        const response = yield call(viewStaffPayRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewStaffPaySuccess({data : response[0]}));
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

export function* opnViewStaffPayModel() {
    yield takeEvery(OPEN_VIEW_STAFFPAY_MODEL, viewStaffPayFromServer);
}

const deleteStaffPayRequest = function* (data)
{  let response = yield api.post('delete-staffpay', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete Employee From Server
 */
 function* deleteStaffPayFromServer(action) {
     try {

       const response = yield call(deleteStaffPayRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Staff Paid deleted successfully."));
             yield call(getStaffPayFromServer);
        }
        else {
           yield put(requestFailure(response.errorMessage));
        }

     } catch (error) {
         console.log(error);
     }
     finally{
     }
 }

/**
 * Get Employees
 */
export function* deleteStaffPay() {
    yield takeEvery(DELETE_STAFFPAY, deleteStaffPayFromServer);
}


const getEmployeeRequest = function* (data)
{
   let response = yield api.post('employee-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}
function* getEmployeeListStaffPayFromServer(action) {
    try {
      const state = yield select(settings);
      let branchid = state.userProfileDetail.defaultbranchid;
      const response = yield call(getEmployeeRequest,{branchid});

        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(opnAddNewStaffPayModelSuccess({employeeList : response[0]}));
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
 * VIEW Subscriptions
 */
export function* opnAddNewStaffPayModel() {
    yield takeEvery(OPEN_ADD_NEW_STAFFPAY_MODEL, getEmployeeListStaffPayFromServer);
}



/**
 * Member Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveStaffPay),
        fork(getStaffPay),
        fork(opnViewStaffPayModel),
        fork(deleteStaffPay),
        fork(opnAddNewStaffPayModel),
    ]);
}
