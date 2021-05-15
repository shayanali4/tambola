/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {recipeReducer} from './states';
import { push } from 'connected-react-router';
import { cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api, {fileUploadConfig} from 'Api';

import {
  SAVE_RECIPE,
  GET_RECIPES,
  OPEN_EDIT_RECIPES_MODEL,
  OPEN_VIEW_RECIPES_MODEL,
  DELETE_RECIPE
} from 'Actions/types';

import {
    saveRecipeSuccess,
    getRecipesSuccess,
    viewRecipeSuccess,
    editRecipeSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

/**
 * Send Product Save Request To Server
 */
const saveRecipeRequest = function* (data)
{

  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

  if(data.recipedetail.imageFiles.length > 0)
    formData.append("files", data.recipedetail.imageFiles[0]);

    let response = yield api.post('save-recipe', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveRecipeFromServer(action) {
    try {
		 const state = yield select(recipeReducer);

		if(state.clone == true){
            action.payload.recipedetail.id = 0;
		}
		let newrecipe = cloneDeep(action.payload);

        const response = yield call(saveRecipeRequest,newrecipe);

        if(!(response.errorMessage  || response.ORAT))
        {

            const {recipedetail} = action.payload;
            if(recipedetail.id != 0)
            {
              yield put(requestSuccess("Food updated successfully."));
            }
            else {
              yield put(requestSuccess("Food created successfully."));
            }
            yield put(saveRecipeSuccess());
            yield call(getRecipesFromServer);
            yield put(push('/app/diets/recipe/0'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveRecipe() {
    yield takeEvery(SAVE_RECIPE, saveRecipeFromServer);
}

/**
 * Send Product List Request To Server
 */
const getRecipesRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "createdbydate" || x.id == "modifiedbydate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-recipe', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getRecipesFromServer(action) {
    try {
        const state = yield select(recipeReducer);
        const response = yield call(getRecipesRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getRecipesSuccess({data : response[0] , pages : response[1]}));
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
export function* getRecipes() {
    yield takeEvery(GET_RECIPES, getRecipesFromServer);
}
/**
 * Send Member VIEW Request To Server
 */
 const viewRecipeRequest = function* (data)
 {  let response = yield api.post('view-recipe', data)
         .then(response => response.data)
         .catch(error => error.response.data);

     return response;
 }
/**
 * VIEW Member From Server
 */
function* viewRecipeFromServer(action) {
    try {
        const response = yield call(viewRecipeRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewRecipeSuccess({data : response[0]}));
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
 * VIEW Members
 */
export function* opnViewRecipeModel() {
    yield takeEvery(OPEN_VIEW_RECIPES_MODEL, viewRecipeFromServer);
}



/**
 * Edit Member From Server
 */
function* editRecipeFromServer(action) {
    try {
        const response = yield call(viewRecipeRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(editRecipeSuccess({data : response[0]}));
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
export function* opnEditRecipeModel() {
    yield takeEvery(OPEN_EDIT_RECIPES_MODEL, editRecipeFromServer);
}

const deleteRecipeRequest = function* (data)
{  let response = yield api.post('delete-recipe', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete Employee From Server
 */
 function* deleterecipeFromServer(action) {
     try {

       const response = yield call(deleteRecipeRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Food deleted successfully."));
             yield call(getRecipesFromServer);
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
export function* deleteRecipe() {
    yield takeEvery(DELETE_RECIPE, deleterecipeFromServer);
}


/**
 * Member Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveRecipe),
        fork(getRecipes),
        fork(opnViewRecipeModel),
        fork(opnEditRecipeModel),
        fork(deleteRecipe)
    ]);
}
