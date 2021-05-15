/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import {dietroutineReducer} from './states';
import { push } from 'connected-react-router';
import FormData from 'form-data';
import { cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api, {fileUploadConfig} from 'Api';

import {
  SAVE_DIET_ROUTINE,
  GET_DIET_ROUTINES,
  OPEN_EDIT_DIET_ROUTINE_MODEL,
  OPEN_VIEW_DIET_ROUTINE_MODEL,
  DELETE_DIET_ROUTINE,
} from 'Actions/types';

import {
    saveDietRoutineSuccess,
    getDietRoutinesSuccess,
    viewDietRoutineSuccess,
    editDietRoutineSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

/**
 * Send diet routine Save Request To Server
 */
 const saveDietRoutineRequest = function* (data)
 {

   var formData = new FormData();
   for ( var key in data ) {
       formData.append(key, JSON.stringify(data[key]));
   }
     data.dietroutine.routinemealpdf.map((files) =>
     formData.append("files", files));

     let response = yield api.post('save-dietroutine', formData, fileUploadConfig)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }

function* saveDietRoutineFromServer(action) {
    try {
      const state = yield select(dietroutineReducer);

      if(state.clone == true){
            action.payload.dietroutine.id = 0;
            action.payload.dietroutine.routineDays = state.editdietroutine.routinedays;
      }
      let newdietroutine = cloneDeep(action.payload);

      if(newdietroutine.dietroutine.mealplan == 2)
      {
        newdietroutine.dietroutine.routineDays = null;
      }

      if(newdietroutine.dietroutine.routineDays && newdietroutine.dietroutine.routineDays.length > 0){
        newdietroutine.dietroutine.routineDays.map(x =>
          x.meals.forEach(
            y => {
              {
                 if (y.routinerecipe)
                {
                 y.routinerecipe =   y.routinerecipe.map(x =>
                    {return {"id" :x.id,
					"totalcalories":x.totalcalories,
					"totalprotein":x.totalprotein,
					"totalfat":x.totalfat,
					"totalcarbs":x.totalcarbs,
					"totalfiber":x.totalfiber,
					"totalwater":x.totalwater,
                    "quantity" : x.quantity,"unit" : x.unit,
                     }}
                   )
                }
              }
             }));
      }
        const response = yield call(saveDietRoutineRequest,newdietroutine);

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
            yield put(saveDietRoutineSuccess());
            yield call(getDietRoutinesFromServer);

            if(!(dietroutine.id != 0 && state.clone == false))
            {
                  yield put(push('/app/diets/diet-routine'));
            }

        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveDietRoutine() {
    yield takeEvery(SAVE_DIET_ROUTINE, saveDietRoutineFromServer);
}

/**
 * Send diet routine List Request To Server
 */
const getDietRoutinesRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "createdbydate" || x.id == "modifiedbydate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-dietroutine', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getDietRoutinesFromServer(action) {
    try {
        const state = yield select(dietroutineReducer);
        const response = yield call(getDietRoutinesRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getDietRoutinesSuccess({data : response[0] , pages : response[1]}));
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
 * Get Members
 */
export function* getDietRoutines() {
    yield takeEvery(GET_DIET_ROUTINES, getDietRoutinesFromServer);
}

/**
 * Send dietroutine VIEW Request To Server
 */
 const viewDietRoutineRequest = function* (data)
 {  let response = yield api.post('view-dietroutine', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }
/**
 * VIEW dietroutine From Server
 */
function* viewDietRoutineFromServer(action) {
    try {
        const response = yield call(viewDietRoutineRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewDietRoutineSuccess({data : response[0]}));
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
export function* opnViewDietRoutineModel() {
    yield takeEvery(OPEN_VIEW_DIET_ROUTINE_MODEL, viewDietRoutineFromServer);
}


/**
 * Edit WorkoutRoutine From Server
 */
function* editDietRoutineFromServer(action) {
    try {
        const response = yield call(viewDietRoutineRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(editDietRoutineSuccess({data : response[0]}));
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
export function* opnEditDietRoutineModel() {
    yield takeEvery(OPEN_EDIT_DIET_ROUTINE_MODEL, editDietRoutineFromServer);
}

/**
 * Send diet routine Delete Request To Server
 */
const deleteDietRoutineRequest = function* (data)
{  let response = yield api.post('delete-dietroutine', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete diet routine From Server
 */
function* deleteDietRoutineFromServer(action) {
    try {
        yield put(showLoader());
        const response = yield call(deleteDietRoutineRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Diet Routine deleted successfully."));
          yield call(getDietRoutinesFromServer);
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
export function* deleteDietRoutine() {
    yield takeEvery(DELETE_DIET_ROUTINE, deleteDietRoutineFromServer);

}

/**
 * Member Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveDietRoutine),
        fork(getDietRoutines),
        fork(opnViewDietRoutineModel),
        fork(opnEditDietRoutineModel),
        fork(deleteDietRoutine)
    ]);
}
