/**
 * game Actions
 */

import {
  GET_GAMES,
  GET_GAMES_SUCCESS,

  OPEN_ADD_NEW_GAME_MODEL,
  CLOSE_ADD_NEW_GAME_MODEL,
  OPEN_ADD_NEW_GAME_MODEL_SUCCESS,

  OPEN_EDIT_GAME_MODEL,
  OPEN_EDIT_GAME_MODEL_SUCCESS,

  OPEN_VIEW_GAME_MODEL,
  OPEN_VIEW_GAME_MODEL_SUCCESS,
  CLOSE_VIEW_GAME_MODEL,

  SAVE_GAME,
  SAVE_GAME_SUCCESS,

  DELETE_GAME,
  } from './types';
  /**
   * Redux Action Get games
   */
  export const getGames = (requestData) => ({
      type: GET_GAMES,
      payload : requestData
  });
  /**
   * Redux Action Get games Success
   */
  export const getGamesSuccess = (response) => ({
      type: GET_GAMES_SUCCESS,
      payload: response
  });

  /**
   * Redux Action OPEN View game Model
   */
export const opnAddNewGameModel = (requestData) => ({
    type: OPEN_ADD_NEW_GAME_MODEL,
      payload:requestData
});
/**
 * Redux Action Open Model for new Member
 */
export const opnAddNewGameModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_GAME_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View game Model
 */
export const clsAddNewGameModel = () => ({
    type: CLOSE_ADD_NEW_GAME_MODEL,
});
/**
 * Redux Action Open Model to view game
 */
export const opnViewGameModel = (requestData) => ({
    type: OPEN_VIEW_GAME_MODEL,
      payload:requestData
});
/**
 * Redux Action view games model
 */
export const viewGameSuccess = (response) => ({
    type: OPEN_VIEW_GAME_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View game Model
 */
export const clsViewGameModel = () => ({
    type: CLOSE_VIEW_GAME_MODEL
});
/**
 * Redux Action edit games model
 */
export const opnEditGameModel = (requestData) => ({
    type: OPEN_EDIT_GAME_MODEL,
      payload:requestData
});
/**
 * Redux Action edit games Success
 */
export const editGameSuccess = (response) => ({
    type: OPEN_EDIT_GAME_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE PRODUCT
 */
export const saveGame = (data) => ({
    type: SAVE_GAME,
    payload : data
});
/**
 * Redux Action SAVE PRODUCT SUCCESS
 */
export const saveGameSuccess = () => ({
    type: SAVE_GAME_SUCCESS,
});
/**
 * Redux Action Delete Employee
 */
export const deleteGame = (data) => ({
    type: DELETE_GAME,
    payload:data
});
