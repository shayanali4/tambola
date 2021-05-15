import { all, call, fork, put, takeEvery ,select} from 'redux-saga/effects';
import {duesReducer,settings} from './states';

import api from 'Api';
import { push } from 'connected-react-router';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';


import {
GET_DUES,
SAVE_PAYMENT,
GET_PENDING_CHEQUE_LIST,
CHANGE_CHEQUE_PAYMENT_STATUS,
} from 'Actions/types';

import {
getDuesSuccess,
savePaymentsSuccess,
getPendingChequeListSuccess,
changeChequePaymentStatusSuccess,
requestSuccess,
requestFailure,
showLoader,
hideLoader
} from 'Actions';

/**
 * Send dues Request To Server
 */
const getDuesRequest = function* (data)
{
    data = cloneDeep(data);
    data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

    data.filtered && data.filtered.map(x => {
      if(x.id == "date")
      {
        x.value = setLocalDate(x.value);
      }
      if (x.id == "followupdate") {
        x.value = setLocalDate(x.value)
      }
      if (x.id == "lastcheckin") {
        x.value = setLocalDate(x.value)
      }
    });
  let response = yield  api.post('get-dues', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get dues From Server
 */

export function* getduesFromServer(action) {
    try {
        const state = yield select(duesReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getDuesRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getDuesSuccess({data : response[0], pages : response[1]}));
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
 * Get dues
 */
export function* getdues() {
    yield takeEvery(GET_DUES, getduesFromServer);
}
const savePaymentDetailRequest = function* (data)
{
    data = cloneDeep(data);
    data.paymentdetails.chequeDate = setLocalDate(data.paymentdetails.chequeDate);
    data.paymentdetails.paymentDate = setLocalDate(data.paymentdetails.paymentDate);

    let response = yield api.post('save-payment', data)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}
/**
 * save Member From Server
 */
function* savePaymentDetailToServer(action) {
    try {
            const state = yield select(duesReducer);
            const state1 = yield select(settings);

            action.payload.branchid = state1.userProfileDetail.defaultbranchid;
            const response = yield call(savePaymentDetailRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
              yield put(requestSuccess("Payment Done successfully."));
              yield  put(savePaymentsSuccess({paymentid : response[1][0].paymentid}));
              yield call(getduesFromServer);
             yield put(push('/app/members/dues'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 * Get Members
 */
export function* savepayments() {
    yield takeEvery(SAVE_PAYMENT, savePaymentDetailToServer);
}

const getPendingChequeListRequest = function* (data)
{
  data = cloneDeep(data);

  data.filtered && data.filtered.map(x => {
    if(x.id == "chequedate")
    {
      x.value = setLocalDate(x.value);
    }
    if (x.id == "paymentdate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-pendingchequelist', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get dues From Server
 */

function* getPendingChequeListFromServer(action) {
    try {
        const state = yield select(duesReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getPendingChequeListRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getPendingChequeListSuccess({data : response[0], pages : response[1]}));
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
 * Get pending cheque list
 */
export function* getPendingChequeList() {
    yield takeEvery(GET_PENDING_CHEQUE_LIST, getPendingChequeListFromServer);
}

const changeChequePaymentStatusRequest = function* (data)
{
    data = cloneDeep(data);
    data.paymentdetails.dueDate = setLocalDate(data.paymentdetails.dueDate);
    let response = yield api.post('change-paymentstatus', data)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}
/**
 * save Member From Server
 */
function*  changeChequePaymentStatusToServer(action) {
    try {
            const state = yield select(duesReducer);
            const state1 = yield select(settings);

            action.payload.branchid = state1.userProfileDetail.defaultbranchid;
            const response = yield call(changeChequePaymentStatusRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
              yield put(requestSuccess("Updated successfully."));
              yield  put(changeChequePaymentStatusSuccess());
               yield call(getPendingChequeListFromServer);
                yield put(push('/app/members/pending-cheque'));

        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 * Get Members
 */
export function* changeChequePaymentStatus() {
    yield takeEvery(CHANGE_CHEQUE_PAYMENT_STATUS, changeChequePaymentStatusToServer);
}



/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getdues),
      fork(savepayments),
      fork(getPendingChequeList),
      fork(changeChequePaymentStatus),
    ]);
}
