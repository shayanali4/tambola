/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import {memberDietRoutineReducer} from '../states';
import { push } from 'connected-react-router';
import FormData from 'form-data';
import { cloneDeep} from 'Helpers/helpers';
// api
import api, {fileUploadConfig} from 'Api';

import {
  GET_MEMBER_DIET_ROUTINE,
  SAVE_MEMBER_DIET_ROUTINE,
  OPEN_MEMBER_EDIT_DIET_ROUTINE_MODEL,
  OPEN_MEMBER_VIEW_DIET_ROUTINE_MODEL,
  DELETE_MEMBER_DIET_ROUTINE,
  SAVE_MEMBER_DIET_ROUTINE_ACTIVE,
} from 'Actions/types';

import {
    getMemberDietRoutineSuccess,
    saveMemberDietRoutineSuccess,
    viewMemberDietRoutineSuccess,
    editMemberDietRoutineSuccess,
    saveMemberDietRoutineActiveSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

/**
 * Send diet routine Save Request To Server
 */
 const saveMemberDietRoutineRequest = function* (data)
 {
   var formData = new FormData();
   for ( var key in data ) {
       formData.append(key, JSON.stringify(data[key]));
   }
     data.dietroutine.routinemealpdf.map((files) =>
     formData.append("files", files));

     let response = yield api.post('save-member-dietroutine', formData, fileUploadConfig)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }

function* saveMemberDietRoutineFromServer(action) {
    try {

      let newdietroutine = cloneDeep(action.payload);
            if(newdietroutine.dietroutine.routineDays.length > 0){
              newdietroutine.dietroutine.routineDays.map(x =>
                x.meals.forEach(
                  y => {
                    {
                       if (y.routinerecipe)
                      {
                       y.routinerecipe =   y.routinerecipe.map(x =>
                          {return {"id" :x.id,"totalcalories":x.totalcalories,
                          "quantity" : x.quantity,"unit" : x.unit,
                           }}
                         )
                      }
                    }
                   }));
            }
              const response = yield call(saveMemberDietRoutineRequest,newdietroutine);

        if(!(response.errorMessage  || response.ORAT))
        {

            const {dietroutine} = action.payload;
            if(dietroutine.id != 0)
            {
              yield put(requestSuccess("Routine updated successfully."));
            }
            else {
              yield put(requestSuccess("Routine created successfully."));
            }
            yield put(saveMemberDietRoutineSuccess());
            yield call(getMemberDietRoutinesFromServer);

        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveMemberDietRoutine() {
    yield takeEvery(SAVE_MEMBER_DIET_ROUTINE, saveMemberDietRoutineFromServer);
}

/**
 * Send diet routine List Request To Server
 */
const getMemberDietRoutinesRequest = function* (data)
{let response = yield  api.post('get-member-dietroutine', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getMemberDietRoutinesFromServer(action) {
    try {
        const state = yield select(memberDietRoutineReducer);
        const response = yield call(getMemberDietRoutinesRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getMemberDietRoutineSuccess({data : response[0] , pages : response[1]}));
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

export function* getMemberDietRoutine() {
    yield takeEvery(GET_MEMBER_DIET_ROUTINE, getMemberDietRoutinesFromServer);
}


const viewMemberDietRoutineRequest = function* (data)
{  let response = yield api.post('view-member-dietroutine', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}
/**
* VIEW dietroutine From Server
*/
function* viewMemberDietRoutineFromServer(action) {
   try {
       const response = yield call(viewMemberDietRoutineRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(viewMemberDietRoutineSuccess({data : response[0]}));
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
* VIEW dietroutine
*/
export function* opnMemberViewDietRoutineModel() {
   yield takeEvery(OPEN_MEMBER_VIEW_DIET_ROUTINE_MODEL, viewMemberDietRoutineFromServer);
}


/**
* Edit WorkoutRoutine From Server
*/
function* editMemberDietRoutineFromServer(action) {
   try {
       const response = yield call(viewMemberDietRoutineRequest,action.payload);
       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(editMemberDietRoutineSuccess({data : response[0]}));
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
* Edit dietroutine
*/
export function* opnMemberEditDietRoutineModel() {
   yield takeEvery(OPEN_MEMBER_EDIT_DIET_ROUTINE_MODEL, editMemberDietRoutineFromServer);
}

/**
 * Send diet routine Delete Request To Server
 */
const deleteMemberDietRoutineRequest = function* (data)
{  let response = yield api.post('delete-member-dietroutine', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete diet routine From Server
 */
function* deleteMemberDietRoutineFromServer(action) {
    try {
        yield put(showLoader());
        const response = yield call(deleteMemberDietRoutineRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Diet Routine deleted successfully."));
          yield call(getMemberDietRoutinesFromServer);
    } else {
       yield put(requestFailure(response.errorMessage));
    }
  } catch (error) {
      console.log(error);
  }
  finally{

  }
}

export function* deleteMemberDietRoutine() {
    yield takeEvery(DELETE_MEMBER_DIET_ROUTINE, deleteMemberDietRoutineFromServer);

}
const saveDietRoutineActiveRequest = function* (data)
{
    let response = yield api.post('save-member-diet-routine-active',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveDietRoutineActiveFromServer(action) {
    try {
        const response = yield call(saveDietRoutineActiveRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {Isactive} = action.payload;
          if(Isactive == 1 )
          {
              yield put(requestSuccess(" Diet Routine Active successfully."));
           }
            else {
              yield put(requestSuccess(" Diet Routine Inactive successfully."));
            }
              yield  put(saveMemberDietRoutineActiveSuccess());
              yield call(getMemberDietRoutinesFromServer);
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveMemberDietRoutineActive() {
    yield takeEvery(SAVE_MEMBER_DIET_ROUTINE_ACTIVE, saveDietRoutineActiveFromServer);
}

/**
 *  Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveMemberDietRoutine),
        fork(getMemberDietRoutine),
        fork(opnMemberViewDietRoutineModel),
        fork(opnMemberEditDietRoutineModel),
        fork(deleteMemberDietRoutine),
        fork(saveMemberDietRoutineActive)
    ]);
}
