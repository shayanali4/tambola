import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import api, {fileUploadConfig} from 'Api';
import {enquiryReducer,settings} from './states';
import { push } from 'connected-react-router';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';
import {getFollowupDashboardOntrialEnquiriesFromServer,getFollowupDashboardRecentEnquiriesFromServer,
getFollowupDashboardMissedEnquiryFollowupFromServer,getMasterDashboardTodayEnquiryReminderFromServer} from './FollowupDashboard';

import {
  GET_ENQUIRY,
  SAVE_ENQUIRY,
  OPEN_VIEW_ENQUIRY_MODEL,
  DELETE_ENQUIRY,
  OPEN_EDIT_ENQUIRY_MODEL,
  OPEN_ADD_NEW_ENQUIRY_MODEL,
  SAVE_ENQUIRY_STATUS,
  IMPORT_ENQUIRY,
  IMPORT_ENQUIRY_LIST,
  SAVE_TRANSFER_ENQUIRY
} from 'Actions/types';

import {
  getEnquirySuccess,
  saveEnquirySuccess,
  viewEnquirySuccess,
  editEnquirySuccess,
  opnAddNewEnquiryModelSuccess,
  saveEnquiryStatusSuccess,
  importEnquirySuccess,
  importEnquiryListSuccess,
  saveTransferEnquirySuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';
/**
 * Send products Request To Server
 */
const getEnquiryRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "followupdate" || x.id == "createdbydate") {
      x.value = setLocalDate(x.value)
    }
  });

  let response = yield  api.post('get-enquiry', data)
      .then(response => response.data)
      .catch(error => { return error.response.data;} )

      return response;
}
/**
 * Get enquiry From Server
 */

function* getEnquiryFromServer(action) {
    try {
        const state = yield select(enquiryReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getEnquiryRequest, state.tableInfo);


        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(getEnquirySuccess({data : response[0], pages : response[1]}));
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
export function* getEnquiry() {
    yield takeEvery(GET_ENQUIRY, getEnquiryFromServer);
}

/**
 * Send product Save Request To Server
 */
const saveEnquiryRequest = function* (data)
{

  data = cloneDeep(data);
  data.enquiry.followupdate = setDateTime(data.enquiry.followupdate);
  data.enquiry.startdate = setLocalDate(data.enquiry.startdate);
  data.enquiry.enddate = setLocalDate(data.enquiry.enddate);
  data.enquiry.joineddate = setLocalDate(data.enquiry.joineddate);
  data.enquiry.dateofbirth = setLocalDate(data.enquiry.dateofbirth);

    let response = yield api.post('save-enquiry', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* saveEnquiryFromServer(action) {
    try {
      const state = yield select(settings);

      action.payload.defaultbranchid = state.userProfileDetail.defaultbranchid;
      const response = yield call(saveEnquiryRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
          const {enquiry} = action.payload;
          if(enquiry.id && enquiry.id != 0)
          {
            yield put(requestSuccess("Enquiry updated successfully."));
          }
          else{
            yield put(requestSuccess("Enquiry created successfully."));
        }
              yield  put(saveEnquirySuccess());
              yield put(push('/app/enquiry/0'));
              yield call(getEnquiryFromServer);
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }


/**
 * Get Employees
 */
export function* saveEnquiry() {
    yield takeEvery(SAVE_ENQUIRY, saveEnquiryFromServer);
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewEnquiryRequest = function* (data)
 {
   let response = yield api.post('view-enquiry', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW Employee From Server
 */
function* viewEnquiryFromServer(action) {
    try {
        const response = yield call(viewEnquiryRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(viewEnquirySuccess({data : response[0][0]}));
    }
    else {
      yield put(requestFailure(response.errorMessage));
    }
   }catch (error) {
     console.log(error);
    }
    finally
    {

    }
}
/**
 * VIEW Employees
 */
export function* opnViewEnquiryModel() {
    yield takeEvery(OPEN_VIEW_ENQUIRY_MODEL, viewEnquiryFromServer);
}
/**
 * Send enquiry Delete Request To Server
 */
const deleteEnquiryRequest = function* (data)
{  let response = yield api.post('delete-enquiry', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete Employee From Server
 */
function* deleteEnquiryFromServer(action) {
    try {
        yield put(showLoader());
        const response = yield call(deleteEnquiryRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Enquiry deleted successfully."));
          yield call(getEnquiryFromServer);
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
export function* deleteEnquiry() {
    yield takeEvery(DELETE_ENQUIRY, deleteEnquiryFromServer);

}

/**
 * edit Employee From Server
 */
function* editEnquiryFromServer(action) {
    try {
        yield put(showLoader());
        const state = yield select(enquiryReducer);
        const state1 = yield select(settings);

        let tableInfo = state.tableInfo;
        tableInfo.filtered = [];
  			tableInfo.isExpressSale = true ;
        tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

        let branchid = state1.userProfileDetail.defaultbranchid;

        const response = yield call(viewEnquiryRequest,action.payload);
        const response1 = yield call(getServiceRequest,tableInfo);

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage )
        {
             yield put(editEnquirySuccess({data : response[0],servicePlanList : response1[0]}));
        }
        else {
               yield put(requestFailure(response.errorMessage || response1.errorMessage));
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
 * Edit Employees
 */
export function* opnEditEnquiryModel() {
    yield takeEvery(OPEN_EDIT_ENQUIRY_MODEL, editEnquiryFromServer);
}

/**
 * Send Subscription VIEW Request To Server
 */
 const getServiceRequest = function* (data)
 {
    let response = yield api.post('get-servicehit',data)
         .then(response => response.data)
         .catch(error => error.data);

     return response;
 }

/**
 * VIEW Subscription From Server
 */
function* addServiceFromServer(action) {
    try {
        const state = yield select(enquiryReducer);
        const state1 = yield select(settings);

        let tableInfo = state.tableInfo;
        tableInfo.filtered = [];
  			tableInfo.isExpressSale = true ;
         tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
         tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

        let branchid = state1.userProfileDetail.defaultbranchid;

        const response1 = yield call(getServiceRequest,tableInfo);

        if(!response1.errorMessage )
        {
        yield put(opnAddNewEnquiryModelSuccess({servicePlanList : response1[0]}));
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
/**
 * VIEW Subscriptions
 */
export function* opnAddNewEnquiryModel() {
    yield takeEvery(OPEN_ADD_NEW_ENQUIRY_MODEL, addServiceFromServer);
}

const saveEnquiryStatusRequest = function* (data)
{
  data = cloneDeep(data);
  data.enquiry.startdate = setLocalDate(data.enquiry.startdate);
  data.enquiry.enddate = setLocalDate(data.enquiry.enddate);
  data.enquiry.joineddate = setLocalDate(data.enquiry.joineddate);
  data.enquiry.followupdate = setDateTime(data.enquiry.followupdate);

    let response = yield api.post('save-enquirystatus', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* saveEnquiryStatusFromServer(action) {
    try {
      const state = yield select(settings);
      let enquirylistId = action.payload.enquiry.enquirylistId;
      action.payload.defaultbranchid = state.userProfileDetail.defaultbranchid;
      const response = yield call(saveEnquiryStatusRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
            yield put(requestSuccess("Enquiry updated successfully."));
              yield  put(saveEnquiryStatusSuccess());

              switch (enquirylistId) {
                case 0:
                  // Enquiry Module
                  yield call(getEnquiryFromServer);
                  break;
                case 1:
                  // Followup Dashboard Ontrial Enquiries
                  yield call(getFollowupDashboardOntrialEnquiriesFromServer);
                  break;
                case 2:
                  // Followup Dashboard Recent Enquiries
                  yield call(getFollowupDashboardRecentEnquiriesFromServer);
                  break;
                case 3:
                  // Followup Dashboard Missed Enquiry Followup
                  yield call(getFollowupDashboardMissedEnquiryFollowupFromServer);
                  break;
                case 4:
                  // Today Enquiry Reminder
                  yield call(getMasterDashboardTodayEnquiryReminderFromServer);
                  break;
              }
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }


/**
 * Get Employees
 */
export function* saveEnquiryStatus() {
    yield takeEvery(SAVE_ENQUIRY_STATUS, saveEnquiryStatusFromServer);
}


const enquiryImportRequest = function* (data)
{
  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

  if(data.importfile.length > 0)
    formData.append("files", data.importfile[0]);

    let response = yield api.post('enquiry-import', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* enquiryImportFromServer(action) {
    try {
          if(action.payload.importfile.length == 0)
          {
              yield put(requestFailure('Please import file.'));
          }
          else {
              const state = yield select(settings);

              action.payload.branchid = state.userProfileDetail.defaultbranchid;
              const response = yield call(enquiryImportRequest,action.payload);
              if(!(response.errorMessage  || response.ORAT))
              {
                  yield put(requestSuccess("Excel file imported successfully.Please check your file status below."));
                  yield  put(importEnquirySuccess());
                  yield call(enquiryImportListFromServer);
                  yield call(getEnquiryFromServer);
              }
              else {
                yield put(requestFailure(response.errorMessage));
                  yield call(enquiryImportListFromServer);
              }
          }
    } catch (error) {
        console.log(error);
    }
}

export function* importEnquiry() {
    yield takeEvery(IMPORT_ENQUIRY, enquiryImportFromServer);
}

const enquiryImportListRequest = function* (data)
{let response = yield  api.post('get-enquiry-bulkupload', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

function* enquiryImportListFromServer(action) {
    try {
        const state = yield select(enquiryReducer);
        const response = yield call(enquiryImportListRequest, state.tableInfoImport);

        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(importEnquiryListSuccess({data : response[0], pages : response[1]}));
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


export function* importEnquiryList() {
    yield takeEvery(IMPORT_ENQUIRY_LIST, enquiryImportListFromServer);
}

/**
 * Send transfer enquiry Save Request To Server
 */
const saveTransferEnquiryRequest = function* (data)
{
    let response = yield api.post('save-transferenquiry', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save transfer enquiry From Server
 */
function* saveTransferEnquiryFromServer(action) {
    try {
      const response = yield call(saveTransferEnquiryRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
              yield put(requestSuccess("Enquiry transfered successfully."));
              yield  put(saveTransferEnquirySuccess());
              yield put(push('/app/enquiry/4'));
              yield call(getEnquiryFromServer);
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }


/**
 * Get Enquiry
 */
export function* saveTransferEnquiry() {
    yield takeEvery(SAVE_TRANSFER_ENQUIRY, saveTransferEnquiryFromServer);
}


/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getEnquiry),
      fork(saveEnquiry),
      fork(opnViewEnquiryModel),
      fork(deleteEnquiry),
      fork(opnEditEnquiryModel),
      fork(opnAddNewEnquiryModel),
      fork(saveEnquiryStatus),
      fork(importEnquiry),
      fork(importEnquiryList),
      fork(saveTransferEnquiry)
    ]);
}
