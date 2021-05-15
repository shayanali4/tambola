
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';
import {memberExerciseLogReducer} from '../states';
import {delay} from "Helpers/helpers";
import { push } from 'connected-react-router';

import {
  SAVE_MEMBER_EXERCISE_LOG,
  END_MEMBER_WORKOUT_SESSION,
  OPEN_MEMBER_ADD_EXERCISE_LOG_MODEL,
  SAVE_MEMBER_EXERCISE_FEEDBACK,
  SAVE_MEMBER_EXERCISE_LOG_COPY,
} from 'Actions/types';

import {
  saveMemberExerciseLogSuccess,
  saveMemberWorkoutSessionSuccess,
  endMemberWorkoutSessionSuccess,
  saveMemberExerciseLogCopySuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';


const saveExerciseLogRequest = function* (data)
{

    let response = yield api.post('save-member-exerciselog',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

const saveWorkoutSessionRequest = function* (data)
{
    let response = yield api.post('save-member-workoutsession',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveExerciseLogFromServer(action) {
    try {

        const state = yield select(memberExerciseLogReducer);
        action.payload.exerciseLog.map(x => {x.sessionid = state.exerciseSession.sessionId;
        x.workoutname =  state.workoutdayname});
        // action.payload.exerciseLog.sessionid = state.exerciseSession.sessionId;
        // action.payload.workoutname = state.workoutdayname;

              const response = yield call(saveExerciseLogRequest,action.payload);

              if(!(response.errorMessage  || response.ORAT))
              {
                    yield put(requestSuccess("Log created successfully."));
                  yield  put(saveMemberExerciseLogSuccess());
                   yield put(push('/member-app/timeline'));
              }
              else {
                yield put(requestFailure(response.errorMessage));
              }
    } catch (error) {
        console.log(error);
    }
}

export function* saveMemberExerciseLog() {
    yield takeEvery(SAVE_MEMBER_EXERCISE_LOG, saveExerciseLogFromServer);
}

function* saveWorkoutSessionFromServer(action) {
    try {

        const state = yield select(memberExerciseLogReducer);

        if(state.exerciseSession.newSession && state.exerciseSession.sessionId != null)
        {
             let response = yield call(saveWorkoutSessionRequest,state.exerciseSession);

             if(!(response.errorMessage  || response.ORAT) && state.exerciseSession.newSession && state.exerciseSession.sessionId != null)
             {

                 yield put(requestSuccess("Your workout session has started."));
                 yield  put(saveMemberWorkoutSessionSuccess());
             }

             else {
               yield put(requestFailure(response.errorMessage));
             }
        }
    } catch (error) {
        console.log(error);
    }
}

export function* opnMemberAddExerciseLogModel() {
    yield takeEvery(OPEN_MEMBER_ADD_EXERCISE_LOG_MODEL, saveWorkoutSessionFromServer);
}


const endWorkoutSessionRequest = function* (data)
{
    let response = yield api.post('end-member-workoutsession',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* endWorkoutSessionFromServer(action) {
    try {
        const state = yield select(memberExerciseLogReducer);

            let response = yield call(endWorkoutSessionRequest,{"sessionId" : state.exerciseSession.sessionId , "sessionDate" : state.exerciseSession.sessionStartTime, "exerciselog" : action.payload.exerciseLog});

              if(!(response.errorMessage  || response.ORAT))
              {
                  yield put(requestSuccess("Your workout session has ended."));
                  yield  put(endMemberWorkoutSessionSuccess());
              }
              else {
                yield put(requestFailure(response.errorMessage));
              }

    } catch (error) {
        console.log(error);
    }
}

export function* endMemberWorkoutSession() {
    yield takeEvery(END_MEMBER_WORKOUT_SESSION, endWorkoutSessionFromServer);
}

const saveMemberExerciseFeedbackRequest = function* (data)
{
 let response = yield  api.post('save-member-exercise-feedback', data)
     .then(response => response.data)
     .catch(error => error.response.data )
     return response;
}

function* saveMemberExerciseFeedbackToServer() {
   try {
       yield delay(1000);
       const state = yield select(memberExerciseLogReducer);

       let voicefeedback = state.voicefeedback ;
      let vibration = state.vibration;


       const response = yield call(saveMemberExerciseFeedbackRequest,{voicefeedback,vibration});

   } catch (error) {
       console.log(error);
   }
}


/**
* Get Employees
*/
export function* saveMemberExerciseFeedback() {
   yield takeEvery(SAVE_MEMBER_EXERCISE_FEEDBACK, saveMemberExerciseFeedbackToServer);
}


function* saveExerciseLogCopyFromServer(action) {
    try {
            yield delay(2000);
                  yield  put(saveMemberExerciseLogCopySuccess());
    } catch (error) {
        console.log(error);
    }
}

export function* saveMemberExerciseLogCopy() {
    yield takeEvery(SAVE_MEMBER_EXERCISE_LOG_COPY, saveExerciseLogCopyFromServer);
}



export default function* rootSaga() {
    yield all([
      fork(saveMemberExerciseLog),
        fork(endMemberWorkoutSession),
          fork(opnMemberAddExerciseLogModel),
          fork(saveMemberExerciseFeedback),
            fork(saveMemberExerciseLogCopy)
    ]);
}
