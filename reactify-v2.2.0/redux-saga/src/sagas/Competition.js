/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {competitionReducer} from './states';
import { push } from 'connected-react-router';

// api
import api, {fileUploadConfig}  from 'Api';

import {
  SAVE_COMPETITION,
  GET_COMPETITION,
  OPEN_VIEW_COMPETITION_MODEL,
  OPEN_EDIT_COMPETITION_MODEL,
  DELETE_COMPETITION,
  SAVE_PARTICIPANT,
  SAVE_PARTICIPANT_MEASUREMENT,
  OPEN_EDIT_PARTICIPANT_MODEL,
  DELETE_PARTICIPANT,
  GET_PARTICIPANT
} from 'Actions/types';

import {
    saveCompetitionSuccess,
    getCompetitionSuccess,
    viewCompetitionSuccess,
    editCompetitionSuccess,
    saveParticipantSuccess,
    saveParticipantMeasurementSuccess,
    editParticipantSuccess,
    getParticipantSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';


const saveCompetitionRequest = function* (data)
{

    let response = yield api.post('save-competition', data)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveCompetitionFromServer(action) {
    try {
        const response = yield call(saveCompetitionRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
          const {competition} = action.payload;

            if(competition.id != 0)
             {
              yield put(requestSuccess("Competition updated successfully."));
              }
            else{
              yield put(requestSuccess("Competition created successfully."));
            }

            yield put(saveCompetitionSuccess());
            yield call(getCompetitionFromServer);
              yield put(push('/app/competition' ));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveCompetition() {
    yield takeEvery(SAVE_COMPETITION, saveCompetitionFromServer);
}


const getCompetitionRequest = function* (data)
{let response = yield  api.post('get-competition', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getCompetitionFromServer(action) {
    try {
        const state = yield select(competitionReducer);

        const response = yield call(getCompetitionRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getCompetitionSuccess({data : response[0] , pages : response[1]}));
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
export function* getCompetition() {
    yield takeEvery(GET_COMPETITION, getCompetitionFromServer);
}


 const viewCompetitionRequest = function* (data)
 {  let response = yield api.post('view-competition', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }

function* viewCompetitionFromServer(action) {
    try {
        const response = yield call(viewCompetitionRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewCompetitionSuccess({data : response[0]}));
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

export function* opnViewCompetitionModel() {
    yield takeEvery(OPEN_VIEW_COMPETITION_MODEL, viewCompetitionFromServer);
}

const deleteCompetitionRequest = function* (data)
{  let response = yield api.post('delete-competition', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete Employee From Server
 */
 function* deleteCompetitionFromServer(action) {
     try {

       const response = yield call(deleteCompetitionRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Competition deleted successfully."));
             yield call(getCompetitionFromServer);
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
export function* deleteCompetition() {
    yield takeEvery(DELETE_COMPETITION, deleteCompetitionFromServer);
}


 export function* editCompetitionFromServer(action)
     {
       try {

           const response = yield call(viewCompetitionRequest,action.payload);


           if(!response.errorMessage )
           {
               yield put(editCompetitionSuccess({data : response[0]}));
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

export function* opnEditCompetitionModel() {
    yield takeEvery(OPEN_EDIT_COMPETITION_MODEL, editCompetitionFromServer);
}



const saveParticipantRequest = function* (data)
{

  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

  if(data.participant.imageFiles.length > 0)
      formData.append("files", data.participant.imageFiles[0]);


    let response = yield api.post('save-participant', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveParticipantFromServer(action) {
    try {
      const state = yield select(competitionReducer);
      const {participant} = action.payload;
      participant.competitionid = state.selectedCompetition.id;
        const response = yield call(saveParticipantRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(saveParticipantSuccess());
          yield call(getParticipantFromServer);
            if(participant.id != 0)
             {
              yield put(requestSuccess("Participant updated successfully."));
              }
            else{
              yield put(requestSuccess("Participant created successfully."));
            }
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveParticipant() {
    yield takeEvery(SAVE_PARTICIPANT, saveParticipantFromServer);
}

const saveParticipantMeasurementRequest = function* (data)
{

    let response = yield api.post('save-participantmeasurement', data)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveParticipantMeasurementFromServer(action) {
    try {
        const response = yield call(saveParticipantMeasurementRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
          const {measurement} = action.payload;

          yield put(requestSuccess("Measurement updated successfully."));
          yield put(saveParticipantMeasurementSuccess());
           yield call(getParticipantFromServer);
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

      export function* saveParticipantMeasurement() {
          yield takeEvery(SAVE_PARTICIPANT_MEASUREMENT, saveParticipantMeasurementFromServer);
      }
const viewParticipantRequest = function* (data)
{
    let response = yield api.post('view-participant', data)
        .then(response => response.data)
        .catch(error => error.response.data)
    return response;
}

export function* editParticipantFromServer(action)
    {
      try {

          const response = yield call(viewParticipantRequest,action.payload);


          if(!response.errorMessage )
          {
              yield put(editParticipantSuccess({data : response[0]}));
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

export function* opnEditParticipantModel() {
   yield takeEvery(OPEN_EDIT_PARTICIPANT_MODEL, editParticipantFromServer);
}



const deleteParticipantRequest = function* (data)
{  let response = yield api.post('delete-participant', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete Employee From Server
 */
 function* deleteParticipantFromServer(action) {
     try {

       const response = yield call(deleteParticipantRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Participant deleted successfully."));
             yield call(getParticipantFromServer);
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
export function* deleteParticipant() {
    yield takeEvery(DELETE_PARTICIPANT, deleteParticipantFromServer);
}


const getParticipantRequest = function* (data)
{let response = yield  api.post('get-participant', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getParticipantFromServer(action) {
    try {
        const state = yield select(competitionReducer);

        let requestObj = state.tableInfoParticipant;
        requestObj.competitionid =  state.selectedCompetition.id;
        const response = yield call(getParticipantRequest, state.tableInfoParticipant);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getParticipantSuccess({data : response[0] , pages : response[1]}));
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
export function* getParticipant() {
    yield takeEvery(GET_PARTICIPANT, getParticipantFromServer);
}




/**
 * Member Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveCompetition),
        fork(getCompetition),
        fork(opnViewCompetitionModel),
        fork(opnEditCompetitionModel),
        fork(deleteCompetition),
        fork(saveParticipant),
        fork(saveParticipantMeasurement),
        fork(opnEditParticipantModel),
        fork(deleteParticipant),
        fork(getParticipant),
    ]);
}
