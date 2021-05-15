/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {investmentReducer,settings} from './states';
import { push } from 'connected-react-router';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api from 'Api';

import {
  SAVE_INVESTMENT,
  GET_INVESTMENTS,
  OPEN_VIEW_INVESTMENT_MODEL,
  DELETE_INVESTMENT,
} from 'Actions/types';

import {
    saveInvestmentSuccess,
    getInvestmentsSuccess,
    viewInvestmentSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

/**
 * Send investment Save Request To Server
 */
const saveInvestmentRequest = function* (data)
{
  data = cloneDeep(data);
  data.investmentdetail.paymentdate = setLocalDate(data.investmentdetail.paymentdate);
  data.investmentdetail.chequeDate = setLocalDate(data.investmentdetail.chequeDate);
    let response = yield api.post('save-investment', data)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveInvestmentFromServer(action) {
    try {
      const state = yield select(investmentReducer);
      const state1 = yield select(settings);

      action.payload.investmentdetail.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(saveInvestmentRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {

            yield put(requestSuccess("Investment created successfully."));
            yield put(saveInvestmentSuccess());
            yield call(getInvestmentsFromServer);
            //  yield put(push('/app/expense-management/investment' ));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveInvestment() {
    yield takeEvery(SAVE_INVESTMENT, saveInvestmentFromServer);
}

/**
 * Send investment List Request To Server
 */
const getInvestmentsRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "paymentdate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-investment', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getInvestmentsFromServer(action) {
    try {
        const state = yield select(investmentReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getInvestmentsRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getInvestmentsSuccess({data : response[0] , pages : response[1]}));
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
 * Get investment
 */
export function* getInvestments() {
    yield takeEvery(GET_INVESTMENTS, getInvestmentsFromServer);
}

/**
 * Send investment VIEW Request To Server
 */
 const viewInvestmentRequest = function* (data)
 {  let response = yield api.post('view-investment', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }

function* viewInvestmentFromServer(action) {
    try {

        const response = yield call(viewInvestmentRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewInvestmentSuccess({data : response[0]}));
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

export function* opnViewInvestmentModel() {
    yield takeEvery(OPEN_VIEW_INVESTMENT_MODEL, viewInvestmentFromServer);
}

const deleteInvestmentRequest = function* (data)
{  let response = yield api.post('delete-investment', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete investment From Server
 */
 function* deleteInvestmentFromServer(action) {
     try {

       const response = yield call(deleteInvestmentRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Investment deleted successfully."));
             yield call(getInvestmentsFromServer);
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
 * delete investment
 */
export function* deleteInvestment() {
    yield takeEvery(DELETE_INVESTMENT, deleteInvestmentFromServer);
}



/**
 * Member Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveInvestment),
        fork(getInvestments),
        fork(opnViewInvestmentModel),
        fork(deleteInvestment),
    ]);
}
