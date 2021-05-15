/**
 * Product Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import api, {fileUploadConfig} from 'Api';
import {broadcastReducer,settings} from './states';
import { push } from 'connected-react-router';
import FormData from 'form-data';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
   GET_BROADCAST,
   SAVE_BROADCAST,
   OPEN_ADD_NEW_BROADCAST_MODEL,
   OPEN_VIEW_BROADCAST_MODEL,
} from 'Actions/types';

import {
  getBroadcastSuccess,
  saveBroadcastSuccess,
  opnAddNewBroadcastModelSuccess,
  viewBroadcastSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';

const getBroadcastRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "createdbydate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-broadcast', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

function* getBroadcastFromServer(action) {
    try {

        const state = yield select(broadcastReducer);
        const state1 = yield select(settings);
        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getBroadcastRequest,state.tableInfo );
        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getBroadcastSuccess({data : response[0],pages : response[1]}));
    }
    else {
        yield put(requestFailure(response.errorMessage));
    }

  }catch (error) {
        console.log(error);
    }
    finally {
    }
}

export function* getBroadcast() {
    yield takeEvery(GET_BROADCAST, getBroadcastFromServer);
}


const saveBroadcastRequest = function* (data)
{

    let response = yield api.post('save-broadcast', data)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveBroadcastFromServer(action) {
    try {
        const response = yield call(saveBroadcastRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {

            yield put(requestSuccess("Broadcasted successfully."));
            yield put(saveBroadcastSuccess());
            yield call(getBroadcastFromServer);
            yield put(push('/app/broadcast' ));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveBroadcast() {
    yield takeEvery(SAVE_BROADCAST, saveBroadcastFromServer);
}


const viewBroadcastRequest = function* (data)
{
  let response = yield api.post('view-broadcast', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

function* viewBroadcastFromServer(action) {
   try {
     const response = yield call(viewBroadcastRequest,action.payload);
       if(!(response.errorMessage  || response.ORAT))
       {
          yield put(viewBroadcastSuccess({data : response[0]}));
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

export function* opnViewBroadcastModel() {
   yield takeEvery(OPEN_VIEW_BROADCAST_MODEL, viewBroadcastFromServer);
}


export default function* rootSaga() {
    yield all([
      fork(getBroadcast),
        fork(saveBroadcast),
          fork(opnViewBroadcastModel),
    ]);
}
