/**
 * service Actions
 */

import {
  OPEN_ADD_NEW_COMPETITION_MODEL,
  OPEN_ADD_NEW_COMPETITION_MODEL_SUCCESS,
  CLOSE_ADD_NEW_COMPETITION_MODEL,
  GET_COMPETITION,
  GET_COMPETITION_SUCCESS,
  SAVE_COMPETITION,
  SAVE_COMPETITION_SUCCESS,
  OPEN_VIEW_COMPETITION_MODEL,
  OPEN_VIEW_COMPETITION_MODEL_SUCCESS,
  CLOSE_VIEW_COMPETITION_MODEL,
  DELETE_COMPETITION,
  OPEN_EDIT_COMPETITION_MODEL,
  OPEN_EDIT_COMPETITION_MODEL_SUCCESS,

 //Participants
  OPEN_ADD_NEW_PARTICIPANT_MODEL,
  CLOSE_ADD_NEW_PARTICIPANT_MODEL,
  SAVE_PARTICIPANT,
  SAVE_PARTICIPANT_SUCCESS,
  OPEN_EDIT_PARTICIPANT_MODEL,
  OPEN_EDIT_PARTICIPANT_MODEL_SUCCESS,
  DELETE_PARTICIPANT,
  OPEN_ADD_NEW_PARTICIPANT_MEASUREMENT_MODEL,
  OPEN_ADD_NEW_PARTICIPANT_MEASUREMENT_MODEL_SUCCESS,
  CLOSE_ADD_NEW_PARTICIPANT_MEASUREMENT_MODEL,
  SAVE_PARTICIPANT_MEASUREMENT,
  SAVE_PARTICIPANT_MEASUREMENT_SUCCESS,
  GET_PARTICIPANT,
  GET_PARTICIPANT_SUCCESS,
  } from './types';

export const opnAddNewCompetitionModel = () => ({
    type: OPEN_ADD_NEW_COMPETITION_MODEL,
});

export const opnAddNewCompetitionModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_COMPETITION_MODEL_SUCCESS,
    payload: response
});

export const clsAddNewCompetitionModel = () => ({
    type: CLOSE_ADD_NEW_COMPETITION_MODEL,
});

export const getCompetition = (requestData) => ({
    type: GET_COMPETITION,
    payload : requestData
});

export const getCompetitionSuccess = (response) => ({
    type: GET_COMPETITION_SUCCESS,
    payload: response
});

export const opnViewCompetitionModel = (requestData) => ({
    type: OPEN_VIEW_COMPETITION_MODEL,
      payload:requestData
});

export const viewCompetitionSuccess = (response) => ({
    type: OPEN_VIEW_COMPETITION_MODEL_SUCCESS,
    payload: response
});

export const clsViewCompetitionModel = () => ({
    type: CLOSE_VIEW_COMPETITION_MODEL
});

export const opnEditCompetitionModel = (requestData) => ({
    type: OPEN_EDIT_COMPETITION_MODEL,
      payload:requestData
});

export const editCompetitionSuccess = (response) => ({
    type: OPEN_EDIT_COMPETITION_MODEL_SUCCESS,
    payload: response
});

export const saveCompetition = (data) => ({
    type: SAVE_COMPETITION,
    payload : data
});

export const saveCompetitionSuccess = () => ({
    type: SAVE_COMPETITION_SUCCESS,
});

export const deleteCompetition = (data) => ({
    type: DELETE_COMPETITION,
    payload:data
});


export const opnAddNewParticipantModel = () => ({
    type: OPEN_ADD_NEW_PARTICIPANT_MODEL,
});

export const clsAddNewParticipantModel = () => ({
    type: CLOSE_ADD_NEW_PARTICIPANT_MODEL,
});


export const saveParticipant = (data) => ({
    type: SAVE_PARTICIPANT,
    payload : data
});

export const saveParticipantSuccess = () => ({
    type: SAVE_PARTICIPANT_SUCCESS,
});

export const opnEditParticipantModel = (requestData) => ({
    type: OPEN_EDIT_PARTICIPANT_MODEL,
      payload:requestData
});

export const editParticipantSuccess = (response) => ({
    type: OPEN_EDIT_PARTICIPANT_MODEL_SUCCESS,
    payload: response
});


export const deleteParticipant = (data) => ({
    type: DELETE_PARTICIPANT,
    payload:data
});

export const opnAddNewParticipantMeasurementModel = (data) => ({
    type: OPEN_ADD_NEW_PARTICIPANT_MEASUREMENT_MODEL,
    payload:data
});

export const opnAddNewParticipantMeasurementModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_PARTICIPANT_MEASUREMENT_MODEL_SUCCESS,
    payload: response
});

export const clsAddNewParticipantMeasurementModel = () => ({
    type: CLOSE_ADD_NEW_PARTICIPANT_MEASUREMENT_MODEL,
});

export const saveParticipantMeasurement = (data) => ({
    type: SAVE_PARTICIPANT_MEASUREMENT,
    payload : data
});

export const saveParticipantMeasurementSuccess = () => ({
    type: SAVE_PARTICIPANT_MEASUREMENT_SUCCESS,
});

export const getParticipant = (requestData) => ({
    type: GET_PARTICIPANT,
    payload : requestData
});

export const getParticipantSuccess = (response) => ({
    type: GET_PARTICIPANT_SUCCESS,
    payload: response
});
