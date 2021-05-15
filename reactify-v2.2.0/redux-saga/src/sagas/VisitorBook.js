import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import api, {fileUploadConfig} from 'Api';
import {visitorBookReducer,settings} from './states';
import { push } from 'connected-react-router';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
  OPEN_ADD_NEW_VISITOR_MODEL,
  SAVE_VISITOR,
  GET_VISITORS,
  SAVE_VISITOR_OUTTIME,
  OPEN_VIEW_VISITOR_MODEL,
  BOOK_GYM_ACCESSSLOT_MEMBER_VISITOR,
  GET_MEMBER_GYM_ACCESSSLOT,
  OPEN_EDIT_VISITOR_MODEL,
} from 'Actions/types';

import {
  opnAddNewVisitorModelSuccess,
  saveVisitorSuccess,
  getVisitorsSuccess,
  viewVisitorSuccess,
  bookGymAccessSlotMemberVisitorSuccess,
  getMemberGymAccessSlotSuccess,
  editVisitorSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';

 const getEmployeeRequest = function* (data)
 {
    let response = yield api.post('employee-list',data)
         .then(response => response.data)
         .catch(error => error.data);

     return response;
 }

function* opnAddNewVisitorModelFromServer(action) {
    try {
        const state1 = yield select(settings);

        let branchid = state1.userProfileDetail.defaultbranchid;

        const response1 = yield call(getEmployeeRequest,{branchid});

        if(!response1.errorMessage)
        {
        yield put(opnAddNewVisitorModelSuccess({employeeList : response1[0]}));
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

export function* opnAddNewVisitorModel() {
    yield takeEvery(OPEN_ADD_NEW_VISITOR_MODEL, opnAddNewVisitorModelFromServer);
}

const saveVisitorRequest = function* (data)
{
  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

  if(data.visitordetail.imageFiles.length > 0)
    formData.append("files", data.visitordetail.imageFiles[0]);

    let response = yield api.post('save-visitor', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveVisitorFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.visitordetail.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        action.payload.visitordetail.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveVisitorRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {visitordetail} = action.payload;

            if(visitordetail.id != 0)
             {
               yield put(requestSuccess("Visitor updated successfully."));
              }
            else{
               yield put(requestSuccess("Visitor added successfully."));
            }


            yield  put(saveVisitorSuccess());
            yield call(getVisitorFromServer);
             yield put(push('/app/visitorbook'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveVisitor() {
    yield takeEvery(SAVE_VISITOR, saveVisitorFromServer);
}


const getVisitorRequest = function* (data)
{

  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {if(x.id == "indatetime" || x.id == "outdatetime"){x.value = setLocalDate(x.value) }});

  let response = yield  api.post('get-visitor', data)
        .then(response => response.data)
        .catch(error => error.response.data);
      return response;
}

function* getVisitorFromServer(action) {
    try {
        const state = yield select(visitorBookReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getVisitorRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getVisitorsSuccess({data : response[0] , pages : response[1]}));
        }
        else {
            yield put(requestFailure(response.errorMessage ));
        }

    } catch (error) {
        console.log(error);
    }
    finally {
    }
}

export function* getVisitors() {
    yield takeEvery(GET_VISITORS, getVisitorFromServer);
}


const saveVisitorOuttimeRequest = function* (data)
{  let response = yield api.post('save-visitor-outtime', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}


 function* saveVisitorOuttimeFromServer(action) {
     try {

       const response = yield call(saveVisitorOuttimeRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Outtime added successfully."));
             yield call(getVisitorFromServer);
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

export function* saveVisitorOuttime() {
    yield takeEvery(SAVE_VISITOR_OUTTIME, saveVisitorOuttimeFromServer);
}



const viewVisitorRequest = function* (data)
{  let response = yield api.post('view-visitor', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

function* viewVisitorFromServer(action) {
   try {
       const response = yield call(viewVisitorRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT) )
       {
           yield put(viewVisitorSuccess({data : response[0]}));
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

export function* opnViewVisitorModel() {
   yield takeEvery(OPEN_VIEW_VISITOR_MODEL, viewVisitorFromServer);
}

const bookGymAccessSlotMemberVisitorRequest = function* (data)
{
  data = cloneDeep(data);
  data.data.startdatetime = setDateTime(data.data.starttime);
  data.data.enddatetime = setDateTime(data.data.endtime);
  let response = yield api.post('save-member-gymaccessslot', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

 function* bookGymAccessSlotMemberVisitorFromServer(action) {
     try {
       const state = yield select(settings);

       action.payload.data.branchid = state.userProfileDetail.defaultbranchid;
       const response = yield call(bookGymAccessSlotMemberVisitorRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess("Slot assigned successfully."));
            yield put(bookGymAccessSlotMemberVisitorSuccess());
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

export function* bookGymAccessSlotMemberVisitor() {
    yield takeEvery(BOOK_GYM_ACCESSSLOT_MEMBER_VISITOR, bookGymAccessSlotMemberVisitorFromServer);
}


const getMemberGymAccessSlotRequest = function* (data)
{
   let response = yield api.post('get-accessslot',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}

function* getMemberGymAccessSlotFromServer(action) {
   try {
       const state = yield select(settings);

       action.payload.branchid = state.userProfileDetail.defaultbranchid;
       action.payload.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

       const response = yield call(getMemberGymAccessSlotRequest,action.payload);

       if(!response.errorMessage)
       {
       yield put(getMemberGymAccessSlotSuccess({data : response[0]}));
      }
      else {
        yield put(requestFailure(response.errorMessage ));
      }
    }catch (error) {
         console.log(error);
    }
    finally
    {
        yield put(hideLoader());
    }
}

export function* getMemberGymAccessSlot() {
   yield takeEvery(GET_MEMBER_GYM_ACCESSSLOT, getMemberGymAccessSlotFromServer);
}


function* editVisitorFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(viewVisitorRequest,action.payload);
        const response1 = yield call(getEmployeeRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage )
        {
        yield put(editVisitorSuccess({data : response[0],employeeList : response1[0]}));
      }
      else {
        yield put(requestFailure(response.errorMessage || response1.errorMessage ));
      }
    } catch (error) {
      console.log(error);
    }
    finally
    {
    }
}

export function* opnEditVisitorModel() {
    yield takeEvery(OPEN_EDIT_VISITOR_MODEL, editVisitorFromServer);
}



/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(opnAddNewVisitorModel),
      fork(saveVisitor),
      fork(getVisitors),
      fork(saveVisitorOuttime),
      fork(opnViewVisitorModel),
      fork(bookGymAccessSlotMemberVisitor),
      fork(getMemberGymAccessSlot),
      fork(opnEditVisitorModel),
    ]);
}
