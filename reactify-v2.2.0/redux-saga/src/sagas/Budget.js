/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {budgetReducer,settings} from './states';
import { push } from 'connected-react-router';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api from 'Api';

import {
  SAVE_BUDGET,
  GET_BUDGET,
  OPEN_VIEW_BUDGET_MODEL,
  DELETE_BUDGET,
  OPEN_EDIT_BUDGET_MODEL
} from 'Actions/types';

import {
    saveBudgetSuccess,
    getBudgetsSuccess,
    viewBudgetSuccess,
    editBudgetSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

/**
 * Send Budget Save Request To Server
 */
const saveBudgetRequest = function* (data)
{
  data = cloneDeep(data);
  data.budgetdetail.startDate = setLocalDate(data.budgetdetail.startDate);
  data.budgetdetail.endDate = setLocalDate(data.budgetdetail.endDate);
  data.budgetdetail.month = setLocalDate(data.budgetdetail.month);
    let response = yield api.post('save-budget', data)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveBudgetFromServer(action) {
    try {

        const state = yield select(settings);
        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveBudgetRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {

            yield put(requestSuccess("Budget created successfully."));
            yield put(saveBudgetSuccess());
            yield call(getBudgetsFromServer);
            yield put(push('/app/setting/budget' ));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveBudget() {
    yield takeEvery(SAVE_BUDGET, saveBudgetFromServer);
}

/**
 * Send Budget List Request To Server
 */
const getBudgetsRequest = function* (data)
{
  data = cloneDeep(data);
  data.filtered.map(x => {
    if(x.id == "startDate" || x.id == "endDate" || x.id == "month") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-budget', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getBudgetsFromServer(action) {
    try {
        const state = yield select(budgetReducer);
        const response = yield call(getBudgetsRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getBudgetsSuccess({data : response[0] , pages : response[1]}));
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
 * Get budget
 */
export function* getBudgets() {
    yield takeEvery(GET_BUDGET, getBudgetsFromServer);
}

/**
 * Send Budget VIEW Request To Server
 */
 const viewBudgetRequest = function* (data)
 {  let response = yield api.post('view-budget', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }

function* viewBudgetFromServer(action) {
    try {
        const response = yield call(viewBudgetRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewBudgetSuccess({data : response[0]}));
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

export function* opnViewBudgetModel() {
    yield takeEvery(OPEN_VIEW_BUDGET_MODEL, viewBudgetFromServer);
}

const deleteBudgetRequest = function* (data)
{  let response = yield api.post('delete-budget', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete Employee From Server
 */
 function* deleteBudgetFromServer(action) {
     try {

       const response = yield call(deleteBudgetRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Budget deleted successfully."));
             yield call(getBudgetsFromServer);
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
export function* deleteBudget() {
    yield takeEvery(DELETE_BUDGET, deleteBudgetFromServer);
}


/**
 * edit BUDGET From Server
 */
function* editBudgetFromServer(action) {
    try {
        const response = yield call(viewBudgetRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
           yield put(editBudgetSuccess({data : response[0]}));
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
 * Edit budget
 */
export function* opnEditBudgetModel() {
    yield takeEvery(OPEN_EDIT_BUDGET_MODEL, editBudgetFromServer);
}

/**
 * budget Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveBudget),
        fork(getBudgets),
        fork(opnViewBudgetModel),
        fork(deleteBudget),
        fork(opnEditBudgetModel)
    ]);
}
