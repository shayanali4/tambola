/**
 * exercise Actions
 */

import {
OPEN_ADD_NEW_EXERCISE_MODEL,
CLOSE_ADD_NEW_EXERCISE_MODEL,

SAVE_EXERCISE,
SAVE_EXERCISE_SUCCESS,

GET_EXERCISES,
GET_EXERCISES_SUCCESS,

OPEN_EDIT_EXERCISES_MODEL,
OPEN_EDIT_EXERCISES_MODEL_SUCCESS,

OPEN_VIEW_EXERCISES_MODEL,
OPEN_VIEW_EXERCISES_MODEL_SUCCESS,
CLOSE_VIEW_EXERCISES_MODEL,

DELETE_EXERCISES,

SAVE_FAVORITE_EXERCISE,
SAVE_FAVORITE_EXERCISE_SUCCESS,
SAVE_FAVORITE_EXERCISE_FAILURE
} from './types';
/**
 * Redux Action Get Exercises
 */
export const getExercises = (data) => ({
    type: GET_EXERCISES,
    payload : data
});

/**
 * Redux Action Get Exercises Success
 */
export const getExercisesSuccess = (response) => ({
    type: GET_EXERCISES_SUCCESS,
    payload: response
});
/**
 * Redux Action OPEN View Exercises Model
 */
export const opnAddNewExerciseModel = () => ({
  type: OPEN_ADD_NEW_EXERCISE_MODEL,
});
/**
 * Redux Action close View Exercises Model
 */
export const clsAddNewExerciseModel = () => ({
    type: CLOSE_ADD_NEW_EXERCISE_MODEL,
});
/**
 * Redux Action SAVE Exercise
 */
export const saveExercise= (data) => ({
    type: SAVE_EXERCISE,
    payload : data
});
/**
 * Redux Action SAVE Exercise SUCCESS
 */
export const saveExerciseSuccess = () => ({
    type: SAVE_EXERCISE_SUCCESS,
});
/**
 * Redux Action Open Model to edit exercise
 */
export const opnEditExerciseModel = (requestData) => ({
    type: OPEN_EDIT_EXERCISES_MODEL,
    payload:requestData
});
/**
 * Redux Action Get exercise Success
 */
export const editExerciseSuccess = (response) => ({
    type: OPEN_EDIT_EXERCISES_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action Open Model to view employee
 */
export const opnViewExerciseModel = (requestData) => ({
    type: OPEN_VIEW_EXERCISES_MODEL,
    payload: requestData
});
/**
 * Redux Action Get Employees Success
 */
export const viewExerciseSuccess = (response) => ({
    type: OPEN_VIEW_EXERCISES_MODEL_SUCCESS,
    payload: response
});

export const clsViewExerciseModel = () => ({
    type: CLOSE_VIEW_EXERCISES_MODEL
});
/**
 * Redux Action Delete Exercise
 */
export const deleteExercise = (data) => ({
    type: DELETE_EXERCISES,
    payload:data
});
/**
 * Redux Action  SAVE Favorite Exercise
 */
export const saveFavoriteExercise= (data) => ({
    type: SAVE_FAVORITE_EXERCISE,
    payload : data
});
/**
 * Redux Action SAVE Favorite Exercise SUCCESS
 */
export const saveFavoriteExerciseSuccess = () => ({
    type: SAVE_FAVORITE_EXERCISE_SUCCESS,
});

export const saveFavoriteExerciseFailure = () => ({
    type: SAVE_FAVORITE_EXERCISE_FAILURE,
});
