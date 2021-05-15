/**
 * measurement Actions
 */
import {
GET_TRAINERS_FEEDBACK_BYMEMBER,
GET_TRAINERS_FEEDBACK_BYMEMBER_SUCCESS,
OPEN_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL,
OPEN_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL_SUCCESS,
CLOSE_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL,

GET_TRAINERS_GS_FEEDBACK_BYMEMBER,
GET_TRAINERS_GS_FEEDBACK_BYMEMBER_SUCCESS,
OPEN_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL,
OPEN_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL_SUCCESS,
CLOSE_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL,

GET_TRAINERS_GENERALRATING_BYMEMBER,
GET_TRAINERS_GENERALRATING_BYMEMBER_SUCCESS,
OPEN_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL,
OPEN_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL_SUCCESS,
CLOSE_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL,

} from './types';

  export const getTrainersFeedbackByMember = (requestData) => ({
      type: GET_TRAINERS_FEEDBACK_BYMEMBER,
      payload : requestData
  });

  export const getTrainersFeedbackByMemberSuccess = (response) => ({
      type: GET_TRAINERS_FEEDBACK_BYMEMBER_SUCCESS,
      payload: response
  });

  export const opnViewTrainersFeedbackByMemberModel = (requestData) => ({
      type: OPEN_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL,
        payload:requestData
  });

  export const viewTrainersFeedbackByMemberSuccess = (response) => ({
      type: OPEN_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL_SUCCESS,
      payload: response
  });

  export const clsViewTrainersFeedbackByMemberModel = () => ({
      type: CLOSE_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL
  });

  export const getTrainersGSfeedbackByMember = (requestData) => ({
      type: GET_TRAINERS_GS_FEEDBACK_BYMEMBER,
      payload : requestData
  });

  export const getTrainersGSfeedbackByMemberSuccess = (response) => ({
      type: GET_TRAINERS_GS_FEEDBACK_BYMEMBER_SUCCESS,
      payload: response
  });

  export const opnViewTrainersGSfeedbackByMemberModel = (requestData) => ({
      type: OPEN_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL,
        payload:requestData
  });

  export const viewTrainersGSfeedbackByMemberSuccess = (response) => ({
      type: OPEN_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL_SUCCESS,
      payload: response
  });

  export const clsViewTrainersGSfeedbackByMemberModel = () => ({
      type: CLOSE_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL
  });


  export const getTrainersGeneralRatingByMember = (requestData) => ({
      type: GET_TRAINERS_GENERALRATING_BYMEMBER,
      payload : requestData
  });

  export const getTrainersGeneralRatingByMemberSuccess = (response) => ({
      type: GET_TRAINERS_GENERALRATING_BYMEMBER_SUCCESS,
      payload: response
  });

  export const opnViewTrainersGeneralRatingByMemberModel = (requestData) => ({
      type: OPEN_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL,
        payload:requestData
  });

  export const viewTrainersGeneralRatingByMemberSuccess = (response) => ({
      type: OPEN_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL_SUCCESS,
      payload: response
  });

  export const clsViewTrainersGeneralRatingByMemberModel = () => ({
      type: CLOSE_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL
  });
