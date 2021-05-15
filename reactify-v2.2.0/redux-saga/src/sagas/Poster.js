import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import api,{fileUploadConfig} from 'Api';
import {posterReducer,settings} from './states';
import { push } from 'connected-react-router';

import {
  GET_POSTER,
  SAVE_POSTER,
  DELETE_POSTER,
} from 'Actions/types';

import {
  getPosterSuccess,
  savePosterSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';

const getPosterRequest = function* (data)
{let response = yield  api.post('get-poster', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}


function* getPosterFromServer(action) {
    try {
        const state = yield select(posterReducer);

        const response = yield call(getPosterRequest, {id : state.posterid});

        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getPosterSuccess({data : response[0]}));
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

export function* getPoster() {
    yield takeEvery(GET_POSTER, getPosterFromServer);
}

const savePosterRequest = function* (data)
{

    var formData = new FormData();
    for ( var key in data ) {
        formData.append(key, JSON.stringify(data[key]));
    }

    if(data.posterdetail.posterimageFiles.length > 0)
      formData.append("files", data.posterdetail.posterimageFiles[0]);

      let response = yield api.post('save-poster', formData, fileUploadConfig)
          .then(response => response.data)
          .catch(error => error.response.data)

      return response;
}

function* savePosterFromServer(action) {
    try {
        const response = yield call(savePosterRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
           yield put(requestSuccess("Poster created successfully."));

         yield  put(savePosterSuccess());
         yield call(getPosterFromServer);
         yield put(push('/app/setting/poster'));
       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

export function* savePoster() {
    yield takeEvery(SAVE_POSTER, savePosterFromServer);
}

const deletePosterRequest = function* (data)
{  let response = yield api.post('delete-poster', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

function* deletePosterFromServer(action) {
    try {
        const response = yield call(deletePosterRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Poster deleted successfully."));
          yield call(getPosterFromServer);
    } else {
       yield put(requestFailure(response.errorMessage));
    }
  } catch (error) {
      console.log(error);
  }
  finally{
  }
}


export function* deletePoster() {
    yield takeEvery(DELETE_POSTER, deletePosterFromServer);

}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getPoster),
      fork(savePoster),
      fork(deletePoster),
    ]);
}
