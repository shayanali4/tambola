/**
 * Employee Management Sagas
 */
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import FormData from 'form-data';

import Auth from '../../Auth/Auth';
const authObject = new Auth();
import { push } from 'connected-react-router';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api, {fileUploadConfig} from 'Api';

import {
GET_BODY_PROGRESS,
SAVE_BODY_MEASUREMENT
} from 'Actions/types';

import {

    getbodyprogressSuccess,
    saveBodyMeasurementSuccess,
    requestFailure,
    showLoader,
    hideLoader,
    requestSuccess,

} from 'Actions';

const getBodyProgressRequest = function* (data)
{
  let response = yield api.post('get-body-measurement', data)
     .then(response => response.data)
     .catch(error => error.response.data )

   return response;
}
/**
* VIEW Employee From Server
*/
function* getBodyProgressFromServer() {
  try {
      yield put(showLoader());
      const response = yield call(getBodyProgressRequest, null);

      if(!(response.errorMessage  || response.ORAT))
      {
          yield put(getbodyprogressSuccess({data : response[0],goal:response[1]}));
      }
      else {
        yield put(requestFailure(response.errorMessage));
      }

  } catch (error) {
      console.log(error);
  }
  finally
  {
      yield put(hideLoader());
  }
}
/**
* VIEW Employees
*/
export function* getbodyprogress() {
  yield takeEvery(GET_BODY_PROGRESS, getBodyProgressFromServer);
}

/**
 * Send measurement Save Request To Server
 */
const saveBodyMeasurementRequest = function* (data)
{
  data = cloneDeep(data);
  data.measurements.measurementdate = setLocalDate(data.measurements.measurementdate);

    let response = yield api.post('save-body-measurement', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save measurement From Server
 */

function* saveBodyMeasurementFromServer(action) {
    try {

        const response = yield call(saveBodyMeasurementRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {Isgoal} = action.payload;
          if(Isgoal ==  0)
          {
            yield put(requestSuccess("Body Measurement updated successfully."));
          }
             else {
           yield put(requestSuccess("Body Measurement Goal Set successfully."));
         }
         yield  put(saveBodyMeasurementSuccess());
         yield call(getBodyProgressFromServer);
           yield put(push('/member-app/body-progress'));
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
export function* saveBodyMeasurement() {
    yield takeEvery(SAVE_BODY_MEASUREMENT, saveBodyMeasurementFromServer);
}


export default function* rootSaga() {
    yield all([
        fork(getbodyprogress),
        fork(saveBodyMeasurement)

    ]);
}
