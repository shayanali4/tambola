/**
 * ResultAndTestimonial Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {resultAndTestimonialReducer,settings} from './states';
import { push } from 'connected-react-router';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api,{fileUploadConfig} from 'Api';

import {
  OPEN_ADD_NEW_RESULTANDTESTIMONIAL_MODEL,
  SAVE_RESULTANDTESTIMONIAL,
  GET_RESULTANDTESTIMONIAL,
  OPEN_VIEW_RESULTANDTESTIMONIAL_MODEL,
  DELETE_RESULTANDTESTIMONIAL,
  OPEN_EDIT_RESULTANDTESTIMONIAL_MODEL,
  SAVE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL,
} from 'Actions/types';

import {
    opnAddNewResultAndTestimonialModelSuccess,
    saveResultAndTestimonialSuccess,
    getResultAndTestimonialSuccess,
    viewResultAndTestimonialSuccess,
    editResultAndTestimonialSuccess,
    saveEnablePublishingStatusResultAndTestimonialSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';


const getEmployeeRequest = function* (data)
{
   let response = yield api.post('employee-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}

function* opnAddNewResultAndTestimonialModelFromServer(action) {
   try {
       const state1 = yield select(settings);

       let branchid = state1.userProfileDetail.defaultbranchid;

       const response1 = yield call(getEmployeeRequest,{branchid});

       if(!response1.errorMessage)
       {
       yield put(opnAddNewResultAndTestimonialModelSuccess({employeeList : response1[0]}));
      }
      else {
        yield put(requestFailure(response1.errorMessage ));
      }
    }catch (error) {
         console.log(error);
    }
    finally
    {
        yield put(hideLoader());
    }
}

export function* opnAddNewResultAndTestimonialModel() {
   yield takeEvery(OPEN_ADD_NEW_RESULTANDTESTIMONIAL_MODEL, opnAddNewResultAndTestimonialModelFromServer);
}


const saveResultAndTestimonialRequest = function* (data)
{
    data = cloneDeep(data);
    data.resultandtestimonialdetail.publishstartdate = setLocalDate(data.resultandtestimonialdetail.publishstartdate);
    data.resultandtestimonialdetail.publishenddate = setLocalDate(data.resultandtestimonialdetail.publishenddate);
    var formData = new FormData();
    for ( var key in data ) {
        formData.append(key, JSON.stringify(data[key]));
    }

    if(data.resultandtestimonialdetail.beforeimageFiles.length > 0)
    {
      formData.append("beforeimagefiles", data.resultandtestimonialdetail.beforeimageFiles[0]);
    }
    if(data.resultandtestimonialdetail.afterimageFiles.length > 0)
    {
      formData.append("afterimagefiles", data.resultandtestimonialdetail.afterimageFiles[0]);
    }

      let response = yield api.post('save-resultandtestimonial', formData, fileUploadConfig)
          .then(response => response.data)
          .catch(error => error.response.data)

      return response;
}

function* saveResultAndTestimonialFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.resultandtestimonialdetail.branchid = state.userProfileDetail.defaultbranchid;

        const response = yield call(saveResultAndTestimonialRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            const {resultandtestimonialdetail} = action.payload;
            if(resultandtestimonialdetail.id && resultandtestimonialdetail.id != 0)
            {
              yield put(requestSuccess("Result/Testimonial updated successfully."));
            }
            else {
              yield put(requestSuccess("Result/Testimonial created successfully."));
            }
            yield  put(saveResultAndTestimonialSuccess());
            yield call(getResultAndTestimonialFromServer);
            yield put(push('/app/setting/resultandtestimonial'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveResultAndTestimonial() {
    yield takeEvery(SAVE_RESULTANDTESTIMONIAL, saveResultAndTestimonialFromServer);
}

const getResultAndTestimonialRequest = function* (data)
{
  data = cloneDeep(data);
  data.filtered.map(x => {
    if(x.id == "publishstartdate" || x.id == "publishenddate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-resultandtestimonial', data)
        .then(response => response.data)
        .catch(error => error.response.data);
      return response;
}

function* getResultAndTestimonialFromServer(action) {
    try {
        const state = yield select(resultAndTestimonialReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;

        const response = yield call(getResultAndTestimonialRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getResultAndTestimonialSuccess({data : response[0] , pages : response[1]}));
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

export function* getResultAndTestimonial() {
    yield takeEvery(GET_RESULTANDTESTIMONIAL, getResultAndTestimonialFromServer);
}


const viewResultAndTestimonialRequest = function* (data)
{  let response = yield api.post('view-resultandtestimonial', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

function* viewResultAndTestimonialFromServer(action) {
   try {
       const response = yield call(viewResultAndTestimonialRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(viewResultAndTestimonialSuccess({data : response[0]}));
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

export function* opnViewResultAndTestimonialModel() {
   yield takeEvery(OPEN_VIEW_RESULTANDTESTIMONIAL_MODEL, viewResultAndTestimonialFromServer);
}



const deleteResultAndTestimonialRequest = function* (data)
{  let response = yield api.post('delete-resultandtestimonial', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

 function* deleteResultAndTestimonialFromServer(action) {
     try {

       const response = yield call(deleteResultAndTestimonialRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Result/Testimonial deleted successfully."));
             yield call(getResultAndTestimonialFromServer);
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

export function* deleteResultAndTestimonial() {
    yield takeEvery(DELETE_RESULTANDTESTIMONIAL, deleteResultAndTestimonialFromServer);
}



function* editResultAndTestimonialFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(viewResultAndTestimonialRequest,action.payload);
        const response1 = yield call(getEmployeeRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT)  && !response1.errorMessage )
        {

           yield put(editResultAndTestimonialSuccess({data : response[0],employeeList : response1[0]}));
        }
        else {
          yield put(requestFailure(response.errorMessage  || response1.errorMessage ));
        }
    } catch (error) {
      console.log(error);
    }
    finally
    {
    }
}

export function* opnEditResultAndTestimonialModel() {
    yield takeEvery(OPEN_EDIT_RESULTANDTESTIMONIAL_MODEL, editResultAndTestimonialFromServer);
}



const saveEnablePublishingStatusResultAndTestimonialRequest = function* (data)
{
    let response = yield api.post('save-bulkenablepublishingstatus-resultandtestimonial', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveEnablePublishingStatusResultAndTestimonialFromServer(action) {
    try {
      const response = yield call(saveEnablePublishingStatusResultAndTestimonialRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
        const data = action.payload.requestData;

          if(data.isEnable == 1)
           {
             yield put(requestSuccess("Result/Testimonial enabled for publishing successfully."));
            }
          else{
            yield put(requestSuccess("Result/Testimonial disabled for publishing successfully."));
          }
              yield  put(saveEnablePublishingStatusResultAndTestimonialSuccess());
              yield call(getResultAndTestimonialFromServer);
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }


export function* saveEnablePublishingStatusResultAndTestimonial() {
    yield takeEvery(SAVE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL, saveEnablePublishingStatusResultAndTestimonialFromServer);
}




/**
 * Result And Testimonial Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(opnAddNewResultAndTestimonialModel),
        fork(saveResultAndTestimonial),
        fork(getResultAndTestimonial),
        fork(opnViewResultAndTestimonialModel),
        fork(deleteResultAndTestimonial),
        fork(opnEditResultAndTestimonialModel),
        fork(saveEnablePublishingStatusResultAndTestimonial),
    ]);
}
