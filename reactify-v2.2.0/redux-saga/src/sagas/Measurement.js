import { all, call, fork, put, takeEvery ,select} from 'redux-saga/effects';
import {measurementReducer,settings} from './states';

import api from 'Api';
import { push } from 'connected-react-router';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
  GET_MEASUREMENTS,
  SAVE_MEASUREMENT,
  OPEN_ADD_NEW_MEASUREMENT_MODEL,
  OPEN_VIEW_MEASUREMENT_MODEL,
  OPEN_EDIT_MEASUREMENT_MODEL,
  GET_BODY_MEASUREMENT_DETAILS,
  OPEN_VIEW_MEASUREMENT_INBODY_MODEL,
  OPEN_VIEW_INBODY_MEASUREMENT_MODEL
} from 'Actions/types';

import {
  opnAddNewMeasurementModelSuccess,
  getbodymeasurementDetailSuccess,
  getMeasurementsSuccess,
  saveMeasurementSuccess,
  viewMeasurementSuccess,
  editMeasurementSuccess,
  viewMeasurementGraphSuccess,
  opnViewMeasurementInbodymodelSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';
/**
 * Send measurement Request To Server
 */
const getMeasurementsRequest = function* (data)
{
   data = cloneDeep(data);
   data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
   data.filterbydate = setLocalDate(data.filterbydate);

   data.filtered.map(x => {
    if(x.id == "measurementdate")
    {
      x.value = setLocalDate(x.value);
    }
    if (x.id == "measurementgoaldate") {
      x.value = setLocalDate(x.value)
    }
   });

  let response = yield  api.post('get-measurements', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get measurement From Server
 */

export function* getMeasurementsFromServer(action) {
    try {
        const state = yield select(measurementReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getMeasurementsRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getMeasurementsSuccess({data : response[0], pages : response[1]}));
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
 * Get measurement
 */
export function* getMeasurements() {
    yield takeEvery(GET_MEASUREMENTS, getMeasurementsFromServer);
}
/**
 * Send measurement Save Request To Server
 */
const saveMeasurementRequest = function* (data)
{
    data = cloneDeep(data);
    data.measurements.measurementdate = setLocalDate(data.measurements.measurementdate);

    let response = yield api.post('save-measurement', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save measurement From Server
 */
function* saveMeasurementFromServer(action) {
    try {
        const response = yield call(saveMeasurementRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {measurements} = action.payload;
          if(measurements.id && measurements.id != 0)
          {
            yield put(requestSuccess("Measurement updated successfully."));
          }
             else {
           yield put(requestSuccess("Measurement created successfully."));
         }
         yield  put(saveMeasurementSuccess());
         yield call(getMeasurementsFromServer);
          yield put(push('/app/members/measurement'));
       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

/**
 * Get measurement
 */
export function* saveMeasurement() {
    yield takeEvery(SAVE_MEASUREMENT, saveMeasurementFromServer);
}
/**
 * Send measurement VIEW Request To Server
 */
 const viewMeasurementRequest = function* (data)
 {
   let response = yield api.post('view-measurement', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW measurement From Server
 */
function* viewMeasurementFromServer(action) {
    try {
        const response = yield call(viewMeasurementRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
           yield put(viewMeasurementSuccess({data : response[0]}));
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
 * VIEW measurement
 */
export function* opnViewMeasurementModel() {
    yield takeEvery(OPEN_VIEW_MEASUREMENT_MODEL, viewMeasurementFromServer);
}


/**
 * VIEW measurement Inbody From Server
 */
function* viewMeasurementInBodyFromServer(action) {
    try {
        const response = yield call(viewMeasurementRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
           yield put(opnViewMeasurementInbodymodelSuccess({data : response[0]}));
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
 * VIEW Inbody measurement
 */
export function* opnViewMeasurementInbodymodel() {
    yield takeEvery(OPEN_VIEW_MEASUREMENT_INBODY_MODEL, viewMeasurementInBodyFromServer);
}

/**
 * edit measurement From Server
 */
function* editMeasurementFromServer(action) {
    try {
        const response = yield call(viewMeasurementRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(editMeasurementSuccess({data : response[0]}));
        }
        else {
               yield put(requestFailure(response.errorMessage  ));
             }
      } catch (error) {
          console.log(error);
      }
      finally
      {
      }
}
/**
 * Edit MEASUREMENT
 */
export function* opnEditMeasurementModel() {
    yield takeEvery(OPEN_EDIT_MEASUREMENT_MODEL, editMeasurementFromServer);
}


/**
* VIEW Employee From Server
*/
function* getMeasurementFromServer(action) {
  try {
      const response = yield call(viewMeasurementRequest, action.payload);

      if(!(response.errorMessage  || response.ORAT))
      {
          yield put(getbodymeasurementDetailSuccess({data : response[0]}));
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
* VIEW Employees
*/
export function* getbodymeasuremetDetail() {
  yield takeEvery(GET_BODY_MEASUREMENT_DETAILS, getMeasurementFromServer);
}


/**
 * VIEW measurement From Server
 */
function* viewInBodyMeasurementFromServer(action) {
    try {
        const response = yield call(viewMeasurementRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
           yield put(viewMeasurementSuccess({data : response[0]}));
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
 * VIEW measurement
 */
export function* viewInBodyMeasurementSuccess() {
    yield takeEvery(OPEN_VIEW_INBODY_MEASUREMENT_MODEL, viewInBodyMeasurementFromServer);
}


/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getMeasurements),
      fork(saveMeasurement),
      fork(opnViewMeasurementModel),
      fork(opnEditMeasurementModel),
      fork(getbodymeasuremetDetail),
      fork(opnViewMeasurementInbodymodel),
      fork(viewInBodyMeasurementSuccess)
  ]);
}
