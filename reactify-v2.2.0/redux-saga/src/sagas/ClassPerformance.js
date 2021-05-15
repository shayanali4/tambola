import { all, call, fork, put, takeEvery ,select} from 'redux-saga/effects';
import {classPerformanceReducer,settings} from './states';
import {setDateTime,cloneDeep,setLocalDate,getFormtedDate} from 'Helpers/helpers';

import api from 'Api';

import {
  GET_CLASS_PERFORMANCE,
  OPEN_VIEW_CLASS_PERFORMANCE_MODEL,
  CONFIRMED_CLASS_COMMSSION
} from 'Actions/types';

import {
getClassPerformancesSuccess,
viewClassPerformanceSuccess,
requestSuccess,
requestFailure,
showLoader,
hideLoader
} from 'Actions';
/**
 * Send products Request To Server
 */
const getPerformancesRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "date") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-classperformances', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get enquiry From Server
 */

function* getPerformancesFromServer(action) {
    try {
        const state = yield select(classPerformanceReducer);
        const state1 = yield select(settings);
        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getPerformancesRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getClassPerformancesSuccess({data : response[0], pages : response[1]}));
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
 * Get enquiry
 */
export function* getClassPerformances() {
    yield takeEvery(GET_CLASS_PERFORMANCE, getPerformancesFromServer);
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewClassPerformanceRequest = function* (data)
 {
   data = cloneDeep(data);
   data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
   data.date = setLocalDate(data.date);

   let response = yield api.post('view-classperformance', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW Employee From Server
 */
function* viewClassPerformanceFromServer(action) {
    try {

        const state = yield select(classPerformanceReducer);
        const response = yield call(viewClassPerformanceRequest, state.tableInfoView);
        if(!(response.errorMessage  || response.ORAT))
        {
           yield put(viewClassPerformanceSuccess({data : response[0], pages : response[1]}));
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
export function* opnViewClassPerformanceModel() {
    yield takeEvery(OPEN_VIEW_CLASS_PERFORMANCE_MODEL, viewClassPerformanceFromServer);
}


/**
 * Send class confirmed Request To Server
 */
const confirmedClassCommissionRequest = function* (data)
{  let response = yield api.post('confirmed-class-commission', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * confirmed class commission From Server
 */
function* confirmedClassCommissionFromServer(action) {
    try {
        const state = yield select(settings);
        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(confirmedClassCommissionRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Commission Added successfully."));
          yield call(getPerformancesFromServer);

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
 * confirmed class
 */
export function* confirmedClassCommission() {
    yield takeEvery(CONFIRMED_CLASS_COMMSSION, confirmedClassCommissionFromServer);
}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getClassPerformances),
      fork(opnViewClassPerformanceModel),
      fork(confirmedClassCommission)
    ]);
}
