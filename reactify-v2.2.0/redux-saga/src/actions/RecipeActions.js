/**
 * Product Actions
 */
import {
    OPEN_ADD_NEW_RECIPE_MODEL,
    CLOSE_ADD_NEW_RECIPE_MODEL,
    SAVE_RECIPE,
    SAVE_RECIPE_SUCCESS,
    GET_RECIPES,
    GET_RECIPES_SUCCESS,
    OPEN_EDIT_RECIPES_MODEL,
    OPEN_EDIT_RECIPES_MODEL_SUCCESS,
    OPEN_VIEW_RECIPES_MODEL,
    OPEN_VIEW_RECIPES_MODEL_SUCCESS,
    CLOSE_VIEW_RECIPES_MODEL,
    DELETE_RECIPE
  } from './types';

export const opnAddNewRecipeModel = () => ({
    type: OPEN_ADD_NEW_RECIPE_MODEL
});

export const clsAddNewRecipeModel = () => ({
    type: CLOSE_ADD_NEW_RECIPE_MODEL
});
export const saveRecipe = (data) => ({
    type: SAVE_RECIPE,
    payload : data
});

export const saveRecipeSuccess = () => ({
    type: SAVE_RECIPE_SUCCESS,
});
export const getRecipes = (data) => ({
    type: GET_RECIPES,
    payload : data
});

export const getRecipesSuccess = (response) => ({
    type: GET_RECIPES_SUCCESS,
    payload: response
});
export const opnEditRecipeModel = (requestData) => ({
    type: OPEN_EDIT_RECIPES_MODEL,
    payload:requestData
});

export const editRecipeSuccess = (response) => ({
    type: OPEN_EDIT_RECIPES_MODEL_SUCCESS,
    payload: response
});

export const opnViewRecipeModel = (requestData) => ({
    type: OPEN_VIEW_RECIPES_MODEL,
    payload: requestData
});

export const viewRecipeSuccess = (response) => ({
    type: OPEN_VIEW_RECIPES_MODEL_SUCCESS,
    payload: response
});

export const clsViewRecipeModel = () => ({
    type: CLOSE_VIEW_RECIPES_MODEL
});
export const deleteRecipe = (data) => ({
    type: DELETE_RECIPE,
    payload:data
});
