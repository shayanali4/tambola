import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import api,{fileUploadConfig} from 'Api';
import {employeeShiftReducer,settings} from './states';
import { push } from 'connected-react-router';

import {
  SAVE_SHIFT_CONFIGURATION,
  GET_SHIFT,
  DELETE_SHIFT,
  OPEN_EDIT_SHIFT_MODEL,


  SAVE_ASSIGNSHIFT,
  GET_ASSIGNSHIFT,
  OPEN_EDIT_ASSIGNSHIFT_MODEL,
  DELETE_ASSIGNSHIFT,
  OPEN_ADD_NEW_ASSIGNSHIFT_MODEL,
} from 'Actions/types';

import {
  saveShiftConfigurationSuccess,
  getShiftSuccess,
  opnEditShiftModelSuccess,

  saveAssignShiftSuccess,
  getAssignShiftSuccess,
  opnEditAssignShiftModelSuccess,
  opnAddNewAssignShiftModelSuccess,

  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';


const saveEmployeeShiftRequest = function* (data)
{let response = yield  api.post('save-shift-configuration', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

function* saveEmployeeShiftFromServer(action) {
    try {
      const state = yield select(settings);

      action.payload.shiftdetail.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveEmployeeShiftRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {shiftdetail} = action.payload;
          if(shiftdetail.id && shiftdetail.id != 0)
          {
            yield put(requestSuccess("Shift updated successfully."));
          }
          else {
            yield put(requestSuccess("Shift created successfully."));
          }
          yield  put(saveShiftConfigurationSuccess());
          yield call(getShiftFromServer);
          yield put(push('/app/users/manageshift'));

       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

export function* saveShiftConfiguration() {
    yield takeEvery(SAVE_SHIFT_CONFIGURATION, saveEmployeeShiftFromServer);
}



const getShiftRequest = function* (data)
{let response = yield  api.post('get-shift', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getShiftFromServer(action) {
    try {
        const state = yield select(employeeShiftReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getShiftRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getShiftSuccess({data : response[0] , pages : response[1]}));
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


export function* getShift() {
    yield takeEvery(GET_SHIFT, getShiftFromServer);
}

const viewShiftRequest = function* (data)
{  let response = yield api.post('view-shift', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}


export function* editShiftFromServer(action)
    {
      try {
          let response = yield call(viewShiftRequest,action.payload);

          if(!(response.errorMessage  || response.ORAT))
          {
              yield put(opnEditShiftModelSuccess({data : response[0]}));
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

export function* opnEditShiftModel() {
   yield takeEvery(OPEN_EDIT_SHIFT_MODEL, editShiftFromServer);
}


const deleteShiftRequest = function* (data)
{  let response = yield api.post('delete-shift', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

 function* deleteShiftFromServer(action) {
     try {

       const response = yield call(deleteShiftRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Shift deleted successfully."));
             yield call(getShiftFromServer);
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

export function* deleteShift() {
    yield takeEvery(DELETE_SHIFT, deleteShiftFromServer);
}



const saveAssignShiftRequest = function* (data)
{let response = yield  api.post('save-assignshift', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

function* saveAssignShiftFromServer(action) {
    try {
      const state = yield select(settings);

      action.payload.shiftdetail.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveAssignShiftRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {shiftdetail} = action.payload;
          if(shiftdetail.id && shiftdetail.id != 0)
          {
            yield put(requestSuccess("Shift updated successfully."));
          }
          else {
            yield put(requestSuccess("Shift assigned successfully."));
          }
          yield  put(saveAssignShiftSuccess());
          yield call(getAssignShiftFromServer);
          yield put(push('/app/users/assignshift'));

       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

export function* saveAssignShift() {
    yield takeEvery(SAVE_ASSIGNSHIFT, saveAssignShiftFromServer);
}

const getEmployeeRequest = function* (data)
{
   let response = yield api.post('employee-list',data)
        .then(response => response.data)
        .catch(error => error.data);
    return response;
}

const getAssignShiftRequest = function* (data)
{let response = yield  api.post('get-assignshift', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getAssignShiftFromServer(action) {
    try {
        const state = yield select(employeeShiftReducer);
        const state1 = yield select(settings);

        state.assignShifTableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getAssignShiftRequest, state.assignShifTableInfo);

        let response1 = '';
        if(!(state.employeeList && state.employeeList.length > 0))
        {
            response1 = yield call(getEmployeeRequest, state.assignShifTableInfo);
        }

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
        {
            yield put(getAssignShiftSuccess({data : response[0] , pages : response[1],employeeList : response1 ? response1[0] : state.employeeList}));
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


export function* getAssignShift() {
    yield takeEvery(GET_ASSIGNSHIFT, getAssignShiftFromServer);
}



const deleteAssignShiftRequest = function* (data)
{  let response = yield api.post('delete-assignshift', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

 function* deleteAssignShiftFromServer(action) {
     try {

       const response = yield call(deleteAssignShiftRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Assigned shift deleted successfully."));
             yield call(getAssignShiftFromServer);
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

export function* deleteAssignShift() {
    yield takeEvery(DELETE_ASSIGNSHIFT, deleteAssignShiftFromServer);
}


const getShiftListRequest = function* (data)
{
   let response = yield api.post('shift-list',data)
        .then(response => response.data)
        .catch(error => error.data);
    return response;
}

function* opnAddNewAssignShiftModelFromServer(action) {
    try {
            const state = yield select(employeeShiftReducer);
            const state1 = yield select(settings);

            let branchid = state1.userProfileDetail.defaultbranchid;
            let response = yield call(getEmployeeRequest,{branchid});

            let response1 = yield call(getShiftListRequest,{branchid});

           if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
           {
               yield put(opnAddNewAssignShiftModelSuccess({employeeList : response[0] , shiftList : response1[0] }));
           }
           else {
             yield put(requestFailure(response.errorMessage || response1.errorMessage));
           }
     }catch (error) {
          console.log(error);
     }
     finally
     {
         yield put(hideLoader());
     }
}

export function* opnAddNewAssignShiftModel() {
    yield takeEvery(OPEN_ADD_NEW_ASSIGNSHIFT_MODEL, opnAddNewAssignShiftModelFromServer);
}



export function* editAssignShiftFromServer(action)
    {
      try {
        let editassignshift = action.payload.data;
        const state = yield select(employeeShiftReducer);
        const state1 = yield select(settings);

         let branchid = state1.userProfileDetail.defaultbranchid;
         let response = yield call(getEmployeeRequest,{branchid});

          let response1 = yield call(getShiftListRequest,{branchid});

          if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
          {
              yield put(opnEditAssignShiftModelSuccess({data : editassignshift,employeeList : response[0] , shiftList : response1[0] }));
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

export function* opnEditAssignShiftModel() {
   yield takeEvery(OPEN_EDIT_ASSIGNSHIFT_MODEL, editAssignShiftFromServer);
}




/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(saveShiftConfiguration),
      fork(getShift),
      fork(opnEditShiftModel),
      fork(deleteShift),
      fork(saveAssignShift),
      fork(getAssignShift),
      fork(deleteAssignShift),
      fork(opnAddNewAssignShiftModel),
      fork(opnEditAssignShiftModel),
    ]);
}
