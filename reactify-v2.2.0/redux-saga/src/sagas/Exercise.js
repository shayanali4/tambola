import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import FormData from 'form-data';
import {exerciseReducer} from './states';
import { push } from 'connected-react-router';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api, {fileUploadConfig} from 'Api';

import {
GET_EXERCISES,
SAVE_EXERCISE,
DELETE_EXERCISES,
OPEN_VIEW_EXERCISES_MODEL,
OPEN_EDIT_EXERCISES_MODEL,
SAVE_FAVORITE_EXERCISE,
} from 'Actions/types';

import {
    getExercisesSuccess,
    saveExerciseSuccess,
    viewExerciseSuccess,
    editExerciseSuccess,
    saveFavoriteExerciseSuccess,
    saveFavoriteExerciseFailure,
    requestSuccess,
    requestFailure,
    showLoader,
    hideLoader
} from 'Actions';
/**
 * Send exercises Request To Server
 */
const getExercisesRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "createdbydate" || x.id == "modifiedbydate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-exercises', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}
/**
 * Get exercises From Server
 */

function* getExercisesFromServer() {
    try {

        const state = yield select(exerciseReducer);
        const response = yield call(getExercisesRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getExercisesSuccess({data : response[0] , pages : response[1]}));
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
 * Get exercises
 */
export function* getExercises() {
    yield takeEvery(GET_EXERCISES, getExercisesFromServer);
}
/**
 * Send exercise Save Request To Server
 */
const saveExerciseRequest = function* (data)
{
    var formData = new FormData();
    for ( var key in data ) {
        formData.append(key, JSON.stringify(data[key]));
    }

      data.exercise.imageFiles.map((files) =>
      formData.append("files", files));

      let response = yield api.post('save-exercise', formData, fileUploadConfig)
          .then(response => response.data)
          .catch(error => error.response.data)

      return response;
  }


/**
 * save exercise From Server
 */
function* saveExerciseFromServer(action) {
    try {
        const response = yield call(saveExerciseRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {exercise} = action.payload;
          if(exercise.id  != 0)
          {
            yield put(requestSuccess("Exercise updated successfully."));
          }
         else {
           yield put(requestSuccess("Exercise created successfully."));
         }
         yield  put(saveExerciseSuccess());
             if(exercise.activeTab == 0){
                yield call(getExercisesFromServer);
                yield put(push('/app/workouts/exercise/0'));
             }
             else {
               yield put(push('/app/workouts/exercise/1'));
             }
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
export function* saveExercise() {
    yield takeEvery(SAVE_EXERCISE, saveExerciseFromServer);
}
/**
 * Send exercise Delete Request To Server
 */
const deleteExcerciseRequest = function* (data)
{  let response = yield api.post('delete-exercise', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete exercise From Server
 */
 function* deleteExcerciseFromServer(action) {
     try {

       const response = yield call(deleteExcerciseRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Exercise deleted successfully."));
             yield call(getExercisesFromServer);
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
 * Get Employees
 */
export function* deleteExercise() {
    yield takeEvery(DELETE_EXERCISES, deleteExcerciseFromServer);
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewExcerciseRequest = function* (data)
 {  let response = yield api.post('view-exercise', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }
/**
 * VIEW Employee From Server
 */
function* viewExcerciseFromServer(action) {
    try {
        const response = yield call(viewExcerciseRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewExerciseSuccess({data : response[0]}));
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
 * VIEW Employees
 */
export function* opnViewExerciseModel() {
    yield takeEvery(OPEN_VIEW_EXERCISES_MODEL, viewExcerciseFromServer);
}


/**
 * Edit Employee From Server
 */
function* editExerciseFromServer(action) {
    try {

        const response = yield call(viewExcerciseRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(editExerciseSuccess({data : response[0]}));
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
 * Edit Employees
 */
export function* opnEditExerciseModel() {
    yield takeEvery(OPEN_EDIT_EXERCISES_MODEL, editExerciseFromServer);
}

/**
 * Send favoritexercise Save Request To Server
 */

 const saveFavoriteExerciseRequest = function* (data)
 {
     let response = yield api.post('save-favorite-exercise', data)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }
/**
 * save favorite exercise From Server
 */
function* saveFavoriteExerciseFromServer(action) {
    try {
        const response = yield call(saveFavoriteExerciseRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const isFavoritexercise = action.payload;
          if(isFavoritexercise.isFavorite)
              {
              yield put(requestSuccess("Exercise is added to the Favorites list."));
            }
            else{
              yield put(requestSuccess("Exercise is removed from the Favorites list."));
            }
            yield put(saveFavoriteExerciseSuccess());
       }
      else {
          yield put(requestFailure(response.errorMessage));
          yield put(saveFavoriteExerciseFailure());
        }
        } catch (error) {
        console.debug(error);
        }
  }

/**
 * Get favorite exercise
 */
export function* saveFavoriteExercise() {
    yield takeEvery(SAVE_FAVORITE_EXERCISE, saveFavoriteExerciseFromServer);
}



/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getExercises),
        fork(saveExercise),
        fork(deleteExercise),
        fork(opnViewExerciseModel),
        fork(opnEditExerciseModel),
        fork(saveFavoriteExercise),
    ]);
}
