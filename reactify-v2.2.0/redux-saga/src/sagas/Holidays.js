/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {holidaysReducer,settings} from './states';
import { push } from 'connected-react-router';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api from 'Api';

import {
  SAVE_HOLIDAYS,
  GET_HOLIDAYS,
  OPEN_VIEW_HOLIDAYS_MODEL,
  DELETE_HOLIDAYS,
  OPEN_EDIT_HOLIDAYS_MODEL
} from 'Actions/types';

import {
    saveHolidaysSuccess,
    getHolidaysSuccess,
    viewHolidaysSuccess,
    editHolidaysSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';


/**
 * Send Holidays Save Request To Server
 */
const saveHolidaysRequest = function* (data)
{
    data = cloneDeep(data);
    data.holidays.holidaydate = setLocalDate(data.holidays.holidaydate);
    let response = yield api.post('save-holidays', data)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveHolidaysFromServer(action) {
    try {

        const state = yield select(settings);
        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveHolidaysRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
          const {holidays} = action.payload;
          if(holidays.id && holidays.id != 0)
          {
            yield put(requestSuccess("Holidays updated successfully."));
          }
          else {
            yield put(requestSuccess("Holidays created successfully."));
          }
            yield put(saveHolidaysSuccess());
            yield call(getHolidaysFromServer);
            yield put(push('/app/setting/organization/4' ));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveHolidays() {
    yield takeEvery(SAVE_HOLIDAYS, saveHolidaysFromServer);
}

/**
 * Send Holidays List Request To Server
 */
const getHolidaysRequest = function* (data)
{
  data = cloneDeep(data);
  data.filtered.map(x => {
    if(x.id == "holidaydate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-holidays', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getHolidaysFromServer(action) {
    try {
        const state = yield select(holidaysReducer);
        const response = yield call(getHolidaysRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getHolidaysSuccess({data : response[0] , pages : response[1]}));
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
 * Get holidays
 */
export function* getHolidays() {
    yield takeEvery(GET_HOLIDAYS, getHolidaysFromServer);
}

/**
 * Send Holidays VIEW Request To Server
 */
 const viewHolidaysRequest = function* (data)
 {  let response = yield api.post('view-holidays', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }

function* viewHolidaysFromServer(action) {
    try {
        const response = yield call(viewHolidaysRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewHolidaysSuccess({data : response[0]}));
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

export function* opnViewHolidaysModel() {
    yield takeEvery(OPEN_VIEW_HOLIDAYS_MODEL, viewHolidaysFromServer);
}

const deleteHolidaysRequest = function* (data)
{  let response = yield api.post('delete-holidays', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete Employee From Server
 */
 function* deleteHolidaysFromServer(action) {
     try {

       const response = yield call(deleteHolidaysRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Holidays deleted successfully."));
             yield call(getHolidaysFromServer);
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
export function* deleteHolidays() {
    yield takeEvery(DELETE_HOLIDAYS, deleteHolidaysFromServer);
}


/**
 * edit HOLIDAYS From Server
 */
function* editHolidaysFromServer(action) {
    try {
        const response = yield call(viewHolidaysRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
           yield put(editHolidaysSuccess({data : response[0]}));
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
 * Edit holidays
 */
export function* opnEditHolidaysModel() {
    yield takeEvery(OPEN_EDIT_HOLIDAYS_MODEL, editHolidaysFromServer);
}

/**
 * holidays Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveHolidays),
        fork(getHolidays),
        fork(opnViewHolidaysModel),
        fork(deleteHolidays),
        fork(opnEditHolidaysModel)
    ]);
}
