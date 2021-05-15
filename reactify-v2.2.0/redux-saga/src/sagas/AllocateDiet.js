import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';
import {allocateDietReducer,settings} from './states';
import { cloneDeep,setLocalDate} from 'Helpers/helpers';
import { push } from 'connected-react-router';


import {
GET_ALLOCATEDIETS,
SAVE_ALLOCATEDIET,
OPEN_VIEW_ALLOCATEDIET_MODEL,
OPEN_EDIT_ALLOCATEDIET_MODEL,
DELETE_ALLOCATEDIET,
} from 'Actions/types';

import {
  getAllocateDietSuccess,
  saveAllocateDietSuccess,
  editAllocateDietSuccess,
  viewAllocateDietSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';



/**
 * Send allocate diet Request To Server
 */
const getAllocateDietRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "createdbydate" || x.id == "modifiedbydate" || x.id == "dateonWards" || x.id == "enddate" || x.id == "tilltodate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-allocatediets', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}
/**
 * Get allocatediet From Server
 */

export function* getAllocateDietFromServer() {
    try {
        const state = yield select(allocateDietReducer);
          const state1 = yield select(settings);
          state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getAllocateDietRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getAllocateDietSuccess({data : response[0] , pages : response[1]}));
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
 * Get workout schedules
 */
export function* getAllocateDiets() {
    yield takeEvery(GET_ALLOCATEDIETS, getAllocateDietFromServer);
}

/**
 * Send diet Save Request To Server
 */
const saveDietRequest = function* (data)
{
  data = cloneDeep(data);
  data.dateonWards = setLocalDate(data.dateonWards);
  data.tilltodate  = setLocalDate(data.tilltodate);
    let response = yield api.post('save-dietSchedule', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save allocate diet  From Server
 */
function* saveDietFromServer(action) {
    try {
      let {allocatediet} = action.payload;
      let newallocatediet = cloneDeep(allocatediet);
      if(newallocatediet){
        newallocatediet.phases = newallocatediet.phases.map(x => {return {"routineid" :x.routineid,"noofweeks":x.noofweeks}});
		newallocatediet.phases[0].Isactive = 1;
      }
	  
      const response = yield call(saveDietRequest,newallocatediet);


      if(!(response.errorMessage  || response.ORAT))
      {

              if(allocatediet.id && allocatediet.id != 0)
              {
                yield put(requestSuccess("Diet updated successfully."));
              }
              else{
                yield put(requestSuccess("Diet allocated successfully."));
             }
              yield  put(saveAllocateDietSuccess());
              yield call(getAllocateDietFromServer);
              yield put(push('/app/diets/allocate-diet'));

          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }


/**
 * Get workout routines
 */
export function* saveAllocateDiet() {
    yield takeEvery(SAVE_ALLOCATEDIET, saveDietFromServer);
}
/**
 * Send allocate diet VIEW Request To Server
 */
 const viewAllocateDietRequest = function* (data)
 {
   let response = yield api.post('view-allocatediet', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW allocate diet From Server
 */
function* viewAllocateDietFromServer(action) {
    try {
        const response = yield call(viewAllocateDietRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
           yield put(viewAllocateDietSuccess({data : response[0]}));
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
export function* opnViewAllocateDietModel() {
    yield takeEvery(OPEN_VIEW_ALLOCATEDIET_MODEL, viewAllocateDietFromServer);
}

/**
 * edit allocatediet From Server
 */
function* editAllocateDietFromServer(action) {
    try {
        const response = yield call(viewAllocateDietRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(editAllocateDietSuccess({data : response[0]}));
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
 * Edit allocatediet
 */
export function* opnEditAllocateDietModel() {
    yield takeEvery(OPEN_EDIT_ALLOCATEDIET_MODEL, editAllocateDietFromServer);
}
/**
 * Send allocatediet Delete Request To Server
 */
const deleteAllocateDietRequest = function* (data)
{  let response = yield api.post('delete-allocatediet', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete allocate diet From Server
 */
function* deleteAllocateDietFromServer(action) {
    try {
        const response = yield call(deleteAllocateDietRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Diet Schedule deleted successfully."));
          yield call(getAllocateDietFromServer);
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
export function* deleteAllocateDiet() {
    yield takeEvery(DELETE_ALLOCATEDIET, deleteAllocateDietFromServer);

}



/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getAllocateDiets),
      fork(saveAllocateDiet),
      fork(opnViewAllocateDietModel),
      fork(opnEditAllocateDietModel),
      fork(deleteAllocateDiet)
    ]);
}
