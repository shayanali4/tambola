import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';
import {roleReducer} from './states';
import { push } from 'connected-react-router';
import { cloneDeep } from 'Helpers/helpers';

import {
  SAVE_ROLE,
  GET_ROLES,
  DELETE_ROLE
} from 'Actions/types';

import {
  saveRoleSuccess,
  getRolessSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';


/**
 * Send role  Request To Server
 */
const getRoleRequest = function* (data)
{
  let response = yield  api.post('get-roles', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}
/**
 * Get role From Server
 */

function* getrolesFromServer() {
    try {
        const state = yield select(roleReducer);
        const response = yield call(getRoleRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getRolessSuccess({data : response[0] , pages : response[1]}));
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
 * Get roles
 */
export function* getRoles() {
    yield takeEvery(GET_ROLES, getrolesFromServer);
}
/**
 * Send role  Save Request To Server
 */
const saveRoleRequest = function* (data)
{
    let response = yield api.post('save-role',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save role From Server
 */
function* saveRoleFromServer(action) {
    try {
      let role = cloneDeep(action.payload.role);
      role.modules = role.modules.map(function (x) {
        if(x.child_routes){
              {
                return {"alias" : x.alias,
                "child_routes" : x.child_routes.map(y => {return{
                  "alias" : y.alias,"add" : y.add,"update" : y.update,"delete" : y.delete,"export" : y.export,"view" :y.view,"all" :y.all
                }})
              }
            }
        }
        else{
          {return {"alias" : x.alias,"child_routes" : x.child_routes,"add" : x.add,"update" : x.update,"delete" : x.delete,"export" : x.export,"view" :x.view,"all" :x.all}}

        }
      });
        const response = yield call(saveRoleRequest,role);
        if(!(response.errorMessage  || response.ORAT))
        {
            const {role} = action.payload;
            if(role.id  != 0)
            {
              yield put(requestSuccess("Role updated successfully."));
            }
            else {
              yield put(requestSuccess("Role created successfully."));
            }
            yield  put(saveRoleSuccess());
            yield call(getrolesFromServer);
             yield put(push('/app/setting/role'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 * Get roles
 */
export function* saveRole() {
    yield takeEvery(SAVE_ROLE, saveRoleFromServer);
}

/**
 * Send role Delete Request To Server
 */
const deleteRoleRequest = function* (data)
{  let response = yield api.post('delete-role', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete role From Server
 */
function* deleteRoleFromServer(action) {
    try {
        const response = yield call(deleteRoleRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Role deleted successfully."));
          yield call(getrolesFromServer);
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
export function* deleteRole() {
    yield takeEvery(DELETE_ROLE, deleteRoleFromServer);

}


/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getRoles),
      fork(saveRole),
      fork(deleteRole)

    ]);
}
