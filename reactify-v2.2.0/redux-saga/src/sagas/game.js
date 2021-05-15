/**
 * Product Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import api, {fileUploadConfig} from 'Api';
import {gameReducer,settings} from './states';
import { push } from 'connected-react-router';
import FormData from 'form-data';
import { cloneDeep,setDateTime} from 'Helpers/helpers';

import {
   GET_GAMES,
   SAVE_GAME,
   DELETE_GAME,
  OPEN_VIEW_GAME_MODEL,
  OPEN_EDIT_GAME_MODEL,
  OPEN_ADD_NEW_GAME_MODEL
} from 'Actions/types';

import {
  getGamesSuccess,
  saveGameSuccess,
  viewGameSuccess,
  editGameSuccess,
  opnAddNewGameModelSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';
/**
 * Send products Request To Server
 */
const getGamesRequest = function* (data)
{let response = yield  api.post('get-games', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Get products From Server
 */

function* getGamesFromServer(action) {
    try {

        const state = yield select(gameReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

        const response = yield call(getGamesRequest,state.tableInfo );
        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getGamesSuccess({data : response[0],pages : response[1]}));
    }
    else {
        yield put(requestFailure(response.errorMessage));
    }

  }catch (error) {
        console.log(error);
    }
    finally {
    }
}

/**
 * Get Employees
 */
export function* getGames() {
    yield takeEvery(GET_GAMES, getGamesFromServer);
}
/**
 * Get Change Page size of Employees
 */


/**
 * Send product Save Request To Server
 */
const saveGameRequest = function* (data)
{
  data = cloneDeep(data);

  data.game.launchdate = setDateTime(data.game.launchdate);
  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

    let response = yield api.post('save-game', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save product From Server
 */
function* saveGameFromServer(action) {
    try {


        const response = yield call(saveGameRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          const {game} = action.payload;

            if(game.id != 0)
             {
              yield put(requestSuccess("Game updated successfully."));
              }
            else{
              yield put(requestSuccess("Game created successfully."));
            }
            yield  put(saveGameSuccess());
            yield call(getGamesFromServer);
            yield put(push('/app/game'));
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
export function* saveGame() {
    yield takeEvery(SAVE_GAME, saveGameFromServer);
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewGameRequest = function* (data)
 {
   let response = yield api.post('view-game', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW Employee From Server
 */
function* viewGameFromServer(action) {
    try {
        const response = yield call(viewGameRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT) )
        {
           yield put(viewGameSuccess({data : response[0] , tickets : response[1]}));
        }
        else {
          console.log(error);
        }
    } catch (error) {
        yield put(requestFailure(error));
    }
    finally
    {
    }
}
/**
 * VIEW Employees
 */
export function* opnViewGameModel() {
    yield takeEvery(OPEN_VIEW_GAME_MODEL, viewGameFromServer);
}
/**
 * edit Employee From Server
 */
function* editGameFromServer(action) {
    try {
        const state = yield select(settings);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(viewGameRequest,action.payload);


        if(!(response.errorMessage  || response.ORAT) )
        {
        yield put(editGameSuccess({data : response[0], tickets : response[1] }));
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
 * Edit Employees
 */
export function* opnEditGameModel() {
    yield takeEvery(OPEN_EDIT_GAME_MODEL, editGameFromServer);
}

/**
 * Send Employee Delete Request To Server
 */
const deleteGameRequest = function* (data)
{  let response = yield api.post('delete-game', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

/**
 * Delete Employee From Server
 */
function* deleteGameFromServer(action) {
    try {
        const response = yield call(deleteGameRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Game deleted successfully."));
          yield call(getGamesFromServer);
       }
    else {
       yield put(requestFailure(response.errorMessage));
    }
  }catch (error) {
      console.log(error);
    }
    finally{

    }
}

/**
 * Get Employees
 */
export function* deleteGame() {
    yield takeEvery(DELETE_GAME, deleteGameFromServer);

}

const getGameTypesRequest = function* (data)
{

  let response = yield  api.post('gametype-list', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}


const getStoreRequest = function* (data)
{

  let response = yield  api.post('store-list', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

/**
* VIEW Subscription From Server
*/
function* addGameFromServer(action) {
   try {
       const state = yield select(settings);

       action.payload.branchid = state.userProfileDetail.defaultbranchid;

       const response = yield call(getGameTypesRequest,action.payload);
       const response1 = yield call(getStoreRequest,action.payload);


       if(!(response.errorMessage  || response.ORAT)  && !response1.errorMessage)
       {
       yield put(opnAddNewGameModelSuccess({gametypelist : response[0]  , storelist : response1[0]}));
      }
      else {
        yield put(requestFailure(response.errorMessage || response1.errorMessage ));
      }
    }catch (error) {
         console.log(error);
    }
    finally
    {
        yield put(hideLoader());
    }
}
/**
* VIEW Subscriptions
*/
export function* opnAddNewGameModel() {
   yield takeEvery(OPEN_ADD_NEW_GAME_MODEL, addGameFromServer);
}




/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getGames),
        fork(saveGame),
        fork(deleteGame),
      fork(opnEditGameModel)
    ]);
}
