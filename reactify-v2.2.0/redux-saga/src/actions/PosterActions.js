/**
 * Todo App Actions
 */
import {
OPEN_ADD_NEW_POSTER_MODEL,
CLOSE_ADD_NEW_POSTER_MODEL,

GET_POSTER,
GET_POSTER_SUCCESS,

DELETE_POSTER,

SAVE_POSTER,
SAVE_POSTER_SUCCESS,

}from './types';

export const opnAddNewPosterModel = () => ({
  type: OPEN_ADD_NEW_POSTER_MODEL,
});

export const clsAddNewPosterModel = () => ({
    type: CLOSE_ADD_NEW_POSTER_MODEL,
});

export const getPoster = (data) => ({
    type: GET_POSTER,
    payload : data
});

export const getPosterSuccess = (response) => ({
    type: GET_POSTER_SUCCESS,
    payload: response
});

export const savePoster = (data) => ({
    type: SAVE_POSTER,
    payload : data
});

export const savePosterSuccess = () => ({
    type: SAVE_POSTER_SUCCESS,
});

export const deletePoster = (data) => ({
    type: DELETE_POSTER,
    payload:data
});
