import { all, call, fork, put, takeEvery ,select} from 'redux-saga/effects';
import {classReducer,settings} from './states';
import api, {fileUploadConfig} from 'Api';

import { push } from 'connected-react-router';
import FormData from 'form-data';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
  GET_CLASSES,
  SAVE_CLASS,
  OPEN_EDIT_CLASS_MODEL,
  OPEN_VIEW_CLASS_MODEL,
  OPEN_ADD_NEW_CLASS_MODEL,
  DELETE_CLASS,
  GET_CLASS_BOOKED_AND_INTERESTED_LIST,
  STAFF_SAVE_MEMBER_CLASS_BOOKING,
  DELETE_CLASS_BOOKED,
  SAVE_CLASS_ONLINEACCESSURL,
  CLASS_CANCEL,
} from 'Actions/types';

import {
getClassesSuccess,
opnAddNewClassModelSuccess,
saveClassSuccess,
editClassSuccess,
viewClassSuccess,
getClassBookedAndInterestedListSuccess,
staffSaveMemberClassBookingSuccess,
saveClassOnlineAccessUrlSuccess,
classCancelSuccess,
requestSuccess,
requestFailure,
showLoader,
hideLoader
} from 'Actions';
/**
 * Send products Request To Server
 */
const getClassesRequest = function* (data)
{let response = yield  api.post('get-classes', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get enquiry From Server
 */

function* getClassesFromServer(action) {
    try {
        const state = yield select(classReducer);
        const state1 = yield select(settings);
        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getClassesRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getClassesSuccess({data : response[0], pages : response[1]}));
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
export function* getClasses() {
    yield takeEvery(GET_CLASSES, getClassesFromServer);
}
/**
 * Send product Save Request To Server
 */

const saveClassRequest = function* (data)
{
  data = cloneDeep(data);
  data.classes.starttime = setDateTime(data.classes.starttime);
  data.classes.endtime = setDateTime(data.classes.endtime);
  data.classes.startdate = setLocalDate(data.classes.startdate);
  data.classes.enddate = setLocalDate(data.classes.enddate);

  data.classes.schedule.map(x => {
    x.starttime = setDateTime(x.starttime);
    x.endtime = setDateTime(x.endtime);
   });

  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

    data.classes.imageFiles.map((files) =>
    formData.append("files", files));

    let response = yield api.post('save-class', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

/**
 * save product From Server
 */
function* saveClassFromServer(action) {
    try {
        const state = yield select(settings);
        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveClassRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {classes} = action.payload;
          if(classes.id && classes.id != 0)
          {
            yield put(requestSuccess("Class updated successfully."));
          }
             else {
           yield put(requestSuccess("Class created successfully."));
         }
         yield  put(saveClassSuccess());
         yield call(getClassesFromServer);
         yield put(push('/app/classes/manage-class'));
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
export function* saveClass() {
    yield takeEvery(SAVE_CLASS, saveClassFromServer);
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewClassRequest = function* (data)
 {
   let response = yield api.post('view-class', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW Employee From Server
 */
function* viewClassFromServer(action) {
    try {
      const response = yield call(viewClassRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
           yield put(viewClassSuccess({data : response[0]}));
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
export function* opnViewClassModel() {
    yield takeEvery(OPEN_VIEW_CLASS_MODEL, viewClassFromServer);
}

/**
 * edit Employee From Server
 */
function* editClassFromServer(action) {
    try {
        const state = yield select(settings);
        const state1 = yield select(classReducer);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(viewClassRequest,action.payload);
        const response1 = yield call(getEmployeeRequest,state1.tableInfo);

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage )
        {
           yield put(editClassSuccess({data : response[0]  , employeeList : response1[0]}));
        }
        else {
          yield put(requestFailure(response.errorMessage || response1.errorMessage));
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
export function* opnEditClassModel() {
    yield takeEvery(OPEN_EDIT_CLASS_MODEL, editClassFromServer);
}
/**
 * Send class Delete Request To Server
 */
const deleteClassRequest = function* (data)
{  let response = yield api.post('delete-class', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete class From Server
 */
function* deleteClassFromServer(action) {
    try {
        const response = yield call(deleteClassRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Class deleted successfully."));
          yield call(getClassesFromServer);
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
export function* deleteClass() {
    yield takeEvery(DELETE_CLASS, deleteClassFromServer);

}


const getEmployeeRequest = function* (data)
{
   let response = yield api.post('employee-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}


function* addClassFromServer(action) {
    try {
      const state = yield select(settings);
      const state1 = yield select(classReducer);

      let branchid = state.userProfileDetail.defaultbranchid;
      const response = yield call(getEmployeeRequest,state1.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(opnAddNewClassModelSuccess({ employeeList : response[0]}));
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
 * VIEW Subscriptions
 */
export function* opnAddNewClassModel() {
    yield takeEvery(OPEN_ADD_NEW_CLASS_MODEL, addClassFromServer);
}


const getClassBookedAndInterestedListRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
  data.classdate = setLocalDate(data.classdate);
  data.filtered.map(x => {
    if(x.id == "last_covid19submitdate" || x.id == "createdbydate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield api.post('get-class-bookandinterestedlist', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

function* getClassBookedAndInterestedListFromServer(action) {
   try {
        const state = yield select(classReducer);
        const state1 = yield select(settings);

        state.tableInfoBookedAndInterested.branchid = state1.userProfileDetail.defaultbranchid;

       const response = yield call(getClassBookedAndInterestedListRequest,state.tableInfoBookedAndInterested);

       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(getClassBookedAndInterestedListSuccess({data : response[0], pages : response[1]}));
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

export function* getClassBookedAndInterestedList() {
   yield takeEvery(GET_CLASS_BOOKED_AND_INTERESTED_LIST, getClassBookedAndInterestedListFromServer);
}



const deleteClassBookedRequest = function* (data)
{  let response = yield api.post('delete-class-booked', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete class From Server
 */
function* deleteClassBookedFromServer(action) {
    try {
        const state1 = yield select(settings);

        action.payload.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(deleteClassBookedRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Booked class cancelled successfully."));
          yield call(getClassBookedAndInterestedListFromServer);
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
export function* deleteClassBooked() {
    yield takeEvery(DELETE_CLASS_BOOKED, deleteClassBookedFromServer);
}


const staffSaveMemberClassBookingRequest = function* (data)
{
    data = cloneDeep(data);
    data.data.notificationdatetime = cloneDeep(data.data.startdatetime);
    data.data.startdatetime = setDateTime(data.data.startdatetime);
    data.data.enddatetime = setDateTime(data.data.enddatetime);

    let response = yield api.post('save-member-classbooking',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* staffSaveMemberClassBookingFromServer(action) {
    try {
            const response = yield call(staffSaveMemberClassBookingRequest,action.payload);

              if(!(response.errorMessage  || response.ORAT))
              {

                    yield put(requestSuccess("Class booked successfully."));
                    yield  put(staffSaveMemberClassBookingSuccess());
                    yield call(getClassBookedAndInterestedListFromServer);

              }
              else {
                yield put(requestFailure(response.errorMessage));
              }
    } catch (error) {
        console.log(error);
    }
}

export function* staffSaveMemberClassBooking() {
    yield takeEvery(STAFF_SAVE_MEMBER_CLASS_BOOKING, staffSaveMemberClassBookingFromServer);
}


const saveClassOnlineAccessUrlRequest = function* (data)
{
   data = cloneDeep(data);
   data.classdate = setDateTime(data.classdate);
    let response = yield api.post('save-class-onlineaccessurl', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveClassOnlineAccessUrlFromServer(action) {
    try {
      const state1 = yield select(settings);

      action.payload.branchid = state1.userProfileDetail.defaultbranchid;

      const response = yield call(saveClassOnlineAccessUrlRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
        const {onlineclassurlid} = action.payload;
        if(onlineclassurlid && onlineclassurlid != 0)
        {
          yield put(requestSuccess("Online access URL updated successfully"));
        }
           else {
        yield put(requestSuccess("Online access URL added successfully"));
       }


              yield  put(saveClassOnlineAccessUrlSuccess());
    }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }

export function* saveClassOnlineAccessUrl() {
    yield takeEvery(SAVE_CLASS_ONLINEACCESSURL, saveClassOnlineAccessUrlFromServer);
}


const classCancelRequest = function* (data)
{
    data = cloneDeep(data);
    data.classdate = setDateTime(data.classdate);

    let response = yield api.post('class-cancel', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* classCancelFromServer(action) {
    try {

      const state1 = yield select(settings);

      action.payload.branchid = state1.userProfileDetail.defaultbranchid;

      const response = yield call(classCancelRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
        const {classcancelid,activitytype} = action.payload;
        let label = activitytype == 1 ? 'Class ' : 'PT ';
        if(classcancelid && classcancelid != 0)
        {
          yield put(requestSuccess(label + "rescheduled successfully"));
        }
        else {
          yield put(requestSuccess(label + "cancelled successfully"));
        }

          yield  put(classCancelSuccess());
      }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }

export function* classCancel() {
    yield takeEvery(CLASS_CANCEL, classCancelFromServer);
}


/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getClasses),
      fork(saveClass),
      fork(opnEditClassModel),
      fork(opnViewClassModel),
      fork(opnAddNewClassModel),
      fork(deleteClass),
      fork(getClassBookedAndInterestedList),
      fork(deleteClassBooked),
      fork(staffSaveMemberClassBooking),
      fork(saveClassOnlineAccessUrl),
      fork(classCancel),
    ]);
}
