/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {advertisementReducer,settings} from './states';
import { push } from 'connected-react-router';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api,{fileUploadConfig} from 'Api';

import {
  SAVE_ADVERTISEMENT,
  GET_ADVERTISEMENTS,
  OPEN_VIEW_ADVERTISEMENT_MODEL,
  DELETE_ADVERTISEMENT,
  OPEN_EDIT_ADVERTISEMENT_MODEL,
  SAVE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT,
} from 'Actions/types';

import {
    saveAdvertisementSuccess,
    getadvertisementsSuccess,
    viewAdvertisementSuccess,
    editAdvertisementSuccess,
    saveEnablePublishingStatusAdvertisementSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

/**
 * Send advertisement Save Request To Server
 */
const saveAdvertisementRequest = function* (data)
{
    data = cloneDeep(data);
    data.advertisementdetail.publishstartdate = setLocalDate(data.advertisementdetail.publishstartdate);
    data.advertisementdetail.publishenddate = setLocalDate(data.advertisementdetail.publishenddate);
    var formData = new FormData();
    for ( var key in data ) {
        formData.append(key, JSON.stringify(data[key]));
    }

    if(data.advertisementdetail.imageFiles.length > 0)
      formData.append("files", data.advertisementdetail.imageFiles[0]);

      let response = yield api.post('save-advertisement', formData, fileUploadConfig)
          .then(response => response.data)
          .catch(error => error.response.data)

      return response;
}

function* saveAdvertisementFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.advertisementdetail.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveAdvertisementRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            const {advertisementdetail} = action.payload;
            if(advertisementdetail.id && advertisementdetail.id != 0)
            {
              yield put(requestSuccess("Advertisement updated successfully."));
            }
            else {
              yield put(requestSuccess("Advertisement created successfully."));
            }
            yield  put(saveAdvertisementSuccess());
            yield call(getAdvertisementsFromServer);
            yield put(push('/app/setting/advertisement'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveAdvertisement() {
    yield takeEvery(SAVE_ADVERTISEMENT, saveAdvertisementFromServer);
}

/**
 * Send advertisement List Request To Server
 */
const getAdvertisementsRequest = function* (data)
{
  data = cloneDeep(data);
  data.filtered.map(x => {
    if(x.id == "publishstartdate" || x.id == "publishenddate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-advertisement', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getAdvertisementsFromServer(action) {
    try {
        const state = yield select(advertisementReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getAdvertisementsRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getadvertisementsSuccess({data : response[0] , pages : response[1]}));
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
 * Get advertisement
 */
export function* getAdvertisements() {
    yield takeEvery(GET_ADVERTISEMENTS, getAdvertisementsFromServer);
}

/**
 * Send Budget VIEW Request To Server
 */
 const viewAdvertisementRequest = function* (data)
 {  let response = yield api.post('view-advertisement', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }

function* viewAdvertisementFromServer(action) {
    try {
        const response = yield call(viewAdvertisementRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewAdvertisementSuccess({data : response[0]}));
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

export function* opnViewAdvertisementModel() {
    yield takeEvery(OPEN_VIEW_ADVERTISEMENT_MODEL, viewAdvertisementFromServer);
}

const deleteAdvertisementRequest = function* (data)
{  let response = yield api.post('delete-advertisement', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete advertisement From Server
 */
 function* deleteAdvertisementFromServer(action) {
     try {

       const response = yield call(deleteAdvertisementRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Advertisement deleted successfully."));
             yield call(getAdvertisementsFromServer);
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
 * delete advertisement
 */
export function* deleteAdvertisement() {
    yield takeEvery(DELETE_ADVERTISEMENT, deleteAdvertisementFromServer);
}


/**
 * edit advertisement From Server
 */
function* editAdvertisementFromServer(action) {
    try {
        const response = yield call(viewAdvertisementRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {

           yield put(editAdvertisementSuccess({data : response[0]}));
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
 * Edit advertisement
 */
export function* opnEditAdvertisementModel() {
    yield takeEvery(OPEN_EDIT_ADVERTISEMENT_MODEL, editAdvertisementFromServer);
}


const saveEnablePublishingStatusAdvertisementRequest = function* (data)
{
    let response = yield api.post('save-bulkenablepublishingstatus-advertisement', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveEnablePublishingStatusAdvertisementFromServer(action) {
    try {
      const response = yield call(saveEnablePublishingStatusAdvertisementRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
        const data = action.payload.requestData;

          if(data.isEnable == 1)
           {
             yield put(requestSuccess("Advertisement enabled for publishing successfully."));
            }
          else{
            yield put(requestSuccess("Advertisement disabled for publishing successfully."));
          }
              yield  put(saveEnablePublishingStatusAdvertisementSuccess());
              yield call(getAdvertisementsFromServer);
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }


export function* saveEnablePublishingStatusAdvertisement() {
    yield takeEvery(SAVE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT, saveEnablePublishingStatusAdvertisementFromServer);
}

/**
 * budget Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveAdvertisement),
        fork(getAdvertisements),
        fork(opnViewAdvertisementModel),
        fork(deleteAdvertisement),
        fork(opnEditAdvertisementModel),
        fork(saveEnablePublishingStatusAdvertisement)
    ]);
}
