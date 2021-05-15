import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';
import {branchReducer,settings} from './states';
import { push } from 'connected-react-router';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
  GET_BRANCHES,
  SAVE_BRANCH,
  OPEN_ADD_NEW_BRANCH_MODEL,
  OPEN_VIEW_BRANCH_MODEL,
  DELETE_BRANCH,
  OPEN_EDIT_BRANCH_MODEL,
} from 'Actions/types';

import {
  getBranchesSuccess,
  saveBranchSuccess,
  opnAddNewBranchModelSuccess,
  viewBranchSuccess,
  editBranchSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';
/**
 * Send branches Request To Server
 */
const getBranchRequest = function* (data)
{let response = yield  api.post('get-branches', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get branches From Server
 */

function* getBranchesFromServer(action) {
    try {
        const state = yield select(branchReducer);

        const response = yield call(getBranchRequest,state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getBranchesSuccess({data : response[0], pages : response[1]}));
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
 * Get branches
 */
export function* getBranches() {
    yield takeEvery(GET_BRANCHES, getBranchesFromServer);
}
/**
 * Send branch Save Request To Server
 */
const saveBranchRequest = function* (data)
{

    data = cloneDeep(data);
    data.branch.starttime = setDateTime(data.branch.starttime);
    data.branch.endtime = setDateTime(data.branch.endtime);
    data.branch.starttime1 = setDateTime(data.branch.starttime1);
    data.branch.endtime1 = setDateTime(data.branch.endtime1);

    data.branch.schedule.map(x => {
      x.starttime = setDateTime(x.starttime);
      x.endtime = setDateTime(x.endtime);
      x.starttime1 = setDateTime(x.starttime1);
      x.endtime1 = setDateTime(x.endtime1);
      x.duration.map(y => {
        y.starttime = setDateTime(y.starttime);
        y.endtime = setDateTime(y.endtime);
      })
     });

    let response = yield api.post('save-branch', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* saveBranchFromServer(action) {
    try {
        const response = yield call(saveBranchRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {branch} = action.payload;
          if(branch.id && branch.id != 0)
          {
            yield put(requestSuccess("Branch updated successfully."));
          }
             else {
           yield put(requestSuccess("Branch created successfully."));
         }
         yield  put(saveBranchSuccess());
         yield call(getBranchesFromServer);
         yield put(push('/app/setting/branch'));
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
export function* saveBranch() {
    yield takeEvery(SAVE_BRANCH, saveBranchFromServer);
}
const getEmployeeRequest = function* (data)
{
   let response = yield api.post('employee-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}

function* addBranchFromServer(action) {
    try {
      const state = yield select(settings);
      let branchid = state.userProfileDetail.defaultbranchid;
      const response = yield call(getEmployeeRequest,{branchid});

        if(!(response.errorMessage  || response.ORAT)  )
        {
        yield put(opnAddNewBranchModelSuccess({employeeList : response[0]}));
       }
       else {
         yield put(requestFailure(response.errorMessage  ));
       }
     }catch (error) {
          console.log(error);
     }
     finally
     {

     }
}
/**
 * VIEW Subscriptions
 */
export function* opnAddNewBranchModel() {
    yield takeEvery(OPEN_ADD_NEW_BRANCH_MODEL, addBranchFromServer);
}
/**
 * Send branch VIEW Request To Server
 */
 const viewBranchRequest = function* (data)
 {
   let response = yield api.post('view-branch', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW branch From Server
 */
function* viewBranchFromServer(action) {
    try {
        const response = yield call(viewBranchRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
           yield put(viewBranchSuccess({data : response[0],selectedSchedule : response[1]}));
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
 * VIEW Employees
 */
export function* opnViewBranchModel() {
    yield takeEvery(OPEN_VIEW_BRANCH_MODEL, viewBranchFromServer);
}
/**
 * Send branch Delete Request To Server
 */
const deleteBranchRequest = function* (data)
{  let response = yield api.post('delete-branch', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete class From Server
 */
function* deleteBranchFromServer(action) {
    try {
        const response = yield call(deleteBranchRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Branch deleted successfully."));
          yield call(getBranchesFromServer);
    } else {
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
export function* deleteBranch() {
    yield takeEvery(DELETE_BRANCH, deleteBranchFromServer);

}
/**
 * edit Branch From Server
 */
function* editBranchFromServer(action) {
    try {
        const state = yield select(settings);
        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        let branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(viewBranchRequest,action.payload);
        const response1 = yield call(getEmployeeRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage )
        {
           yield put(editBranchSuccess({data : response[0],employeeList : response1[0]}));
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
export function* opnEditBranchModel() {
    yield takeEvery(OPEN_EDIT_BRANCH_MODEL, editBranchFromServer);
}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getBranches),
      fork(saveBranch),
      fork(opnAddNewBranchModel),
      fork(opnViewBranchModel),
      fork(deleteBranch),
      fork(opnEditBranchModel),
    ]);
}
