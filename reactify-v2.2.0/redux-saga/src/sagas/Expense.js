/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {expenseReducer,settings} from './states';
import { push } from 'connected-react-router';
import api, {fileUploadConfig} from 'Api';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
  SAVE_EXPENSE,
  GET_EXPENSE,
  OPEN_VIEW_EXPENSE_MODEL,
  OPEN_EDIT_EXPENSE_MODEL,
  DELETE_EXPENSE,
  OPEN_CLAIM_EXPENSE_MODEL,
  SAVE_CLAIM_EXPENSE,
  EXPENSE_SETTLEMENT,
  OPEN_ADD_NEW_EXPENSE_MODEL,
  IMPORT_EXPENSE,
  IMPORT_EXPENSE_LIST,
} from 'Actions/types';

import {
    saveExpenseSuccess,
    getExpensesSuccess,
    viewExpenseSuccess,
    editExpenseSuccess,
    claimExpenseSuccess,
    saveClaimExpenseSuccess,
    opnAddNewExpenseModelSuccess,
    importExpenseSuccess,
    importExpenseListSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

/**
 * Send Expense Save Request To Server
 */
const saveExpenseRequest = function* (data)
{
    data = cloneDeep(data);
    data.expensedetail.expensedate = setLocalDate(data.expensedetail.expensedate);
    data.expensedetail.chequeDate = setLocalDate(data.expensedetail.chequeDate);
    let response = yield api.post('save-expense', data)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveExpenseFromServer(action) {
    try {
      const state = yield select(settings);

      action.payload.expensedetail.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveExpenseRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {

            yield put(requestSuccess("Expense created successfully."));
            yield put(saveExpenseSuccess());
            yield call(getExpensesFromServer);
            //  yield put(push('/app/expense-management/expenses' ));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveExpense() {
    yield takeEvery(SAVE_EXPENSE, saveExpenseFromServer);
}

/**
 * Send Expense List Request To Server
 */
const getExpensesRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "settlementdate" || x.id == "claimeddate" || x.id == "expensedate" ) {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-expense', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getExpensesFromServer(action) {
    try {
        const state = yield select(expenseReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getExpensesRequest, state.tableInfo);

        let response1 = '';
        if(!(state.employeeList && state.employeeList.length > 0))
        {
            response1 = yield call(getEmployeeRequest, state.tableInfo);
        }

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
        {
            yield put(getExpensesSuccess({data : response[0] , pages : response[1],employeeList : response1 ? response1[0] : state.employeeList}));
        }
        else {
            yield put(requestFailure(response.errorMessage || response1.errorMessage));
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
export function* getExpenses() {
    yield takeEvery(GET_EXPENSE, getExpensesFromServer);
}

/**
 * Send Expense VIEW Request To Server
 */
 const viewExpenseRequest = function* (data)
 {  let response = yield api.post('view-expense', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }

function* viewExpenseFromServer(action) {
    try {
        const response = yield call(viewExpenseRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewExpenseSuccess({data : response[0]}));
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

export function* opnViewExpenseModel() {
    yield takeEvery(OPEN_VIEW_EXPENSE_MODEL, viewExpenseFromServer);
}

const deleteExpenseRequest = function* (data)
{  let response = yield api.post('delete-expense', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete Employee From Server
 */
 function* deleteExpenseFromServer(action) {
     try {

       const response = yield call(deleteExpenseRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Expense deleted successfully."));
             yield call(getExpensesFromServer);
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
export function* deleteExpense() {
    yield takeEvery(DELETE_EXPENSE, deleteExpenseFromServer);
}

/**
 * Edit Expense
 */
 export function* editExpenseFromServer(action)
     {
       try {

           const response = yield call(viewExpenseRequest,action.payload);

           const state = yield select(expenseReducer);
           const state1 = yield select(settings);

           let response1 = '';
           if(!(state.employeeList && state.employeeList.length > 0))
           {
               let branchid = state1.userProfileDetail.defaultbranchid;
                response1 = yield call(getEmployeeRequest,{branchid});
           }

           if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
           {
               yield put(editExpenseSuccess({data : response[0],employeeList : response1 ? response1[0] : state.employeeList}));
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

export function* opnEditExpenseModel() {
    yield takeEvery(OPEN_EDIT_EXPENSE_MODEL, editExpenseFromServer);
}



const getEmployeeRequest = function* (data)
{
   let response = yield api.post('employee-list',data)
        .then(response => response.data)
        .catch(error => error.data);
    return response;
}

function* opnClaimExpenseFromServer(action) {
   try {
          const state = yield select(expenseReducer);
          const state1 = yield select(settings);

          let response = '';
          if(!(state.employeeList && state.employeeList.length > 0))
          {
              let branchid = state1.userProfileDetail.defaultbranchid;
               response = yield call(getEmployeeRequest,{branchid});
          }

         if(!(response.errorMessage  || response.ORAT))
         {
             yield put(claimExpenseSuccess({employeeList : response ? response[0] : state.employeeList}));
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

export function* opnClaimExpenseModel() {
   yield takeEvery(OPEN_CLAIM_EXPENSE_MODEL, opnClaimExpenseFromServer);
}


const saveClaimExpenseRequest = function* (data)
{
    let response = yield api.post('save-expenseclaim', data)
        .then(response => response.data)
        .catch(error => error.response.data)
    return response;
}

function* saveClaimExpenseFromServer(action) {
    try {
        const response = yield call(saveClaimExpenseRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {

            yield put(requestSuccess("Expense claimed added successfully."));
            yield put(saveClaimExpenseSuccess());
            yield call(getExpensesFromServer);
              yield put(push('/app/expense-management/expenses' ));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveClaimExpense() {
    yield takeEvery(SAVE_CLAIM_EXPENSE, saveClaimExpenseFromServer);
}


const expenseSettlementRequest = function* (data)
{  let response = yield api.post('save-expensesettlement', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

 function* expenseSettlementFromServer(action) {
     try {

       const response = yield call(expenseSettlementRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Expense settled successfully."));
             yield call(getExpensesFromServer);
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

export function* expenseSettlement() {
    yield takeEvery(EXPENSE_SETTLEMENT, expenseSettlementFromServer);
}


function* opnAddNewExpenseModelFromServer(action) {
    try {
            const state = yield select(expenseReducer);
            const state1 = yield select(settings);

            let response = '';
            if(!(state.employeeList && state.employeeList.length > 0))
            {
                let branchid = state1.userProfileDetail.defaultbranchid;
                 response = yield call(getEmployeeRequest,{branchid});
            }

           if(!(response.errorMessage  || response.ORAT))
           {
               yield put(opnAddNewExpenseModelSuccess({employeeList : response ? response[0] : state.employeeList}));
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

export function* opnAddNewExpenseModel() {
    yield takeEvery(OPEN_ADD_NEW_EXPENSE_MODEL, opnAddNewExpenseModelFromServer);
}


const expenseImportRequest = function* (data)
{
  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

  if(data.importfile.length > 0)
    formData.append("files", data.importfile[0]);

    let response = yield api.post('expense-import', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* expenseImportFromServer(action) {
    try {
          if(action.payload.importfile.length == 0)
          {
              yield put(requestFailure('Please import file.'));
          }
          else {
              const state = yield select(settings);

              action.payload.branchid = state.userProfileDetail.defaultbranchid;
              const response = yield call(expenseImportRequest,action.payload);
              if(!(response.errorMessage  || response.ORAT))
              {
                  yield put(requestSuccess("Excel file imported successfully.Please check your file status below."));
                  yield  put(importExpenseSuccess());
                  yield call(expenseImportListFromServer);
                  yield call(getExpensesFromServer);
              }
              else {
                yield put(requestFailure(response.errorMessage));
                  yield call(expenseImportListFromServer);
              }
          }
    } catch (error) {
        console.log(error);
    }
}

export function* importExpense() {
    yield takeEvery(IMPORT_EXPENSE, expenseImportFromServer);
}

const expenseImportListRequest = function* (data)
{let response = yield  api.post('get-expense-bulkupload', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

function* expenseImportListFromServer(action) {
    try {
        const state = yield select(expenseReducer);
        const response = yield call(expenseImportListRequest, state.tableInfoImport);

        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(importExpenseListSuccess({data : response[0], pages : response[1]}));
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


export function* importExpenseList() {
    yield takeEvery(IMPORT_EXPENSE_LIST, expenseImportListFromServer);
}

/**
 * Member Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveExpense),
        fork(getExpenses),
        fork(opnViewExpenseModel),
        fork(opnEditExpenseModel),
        fork(deleteExpense),
        fork(opnClaimExpenseModel),
        fork(saveClaimExpense),
        fork(expenseSettlement),
        fork(opnAddNewExpenseModel),
        fork(importExpense),
        fork(importExpenseList),
    ]);
}
