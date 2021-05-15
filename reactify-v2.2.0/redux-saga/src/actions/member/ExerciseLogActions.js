/**
 * Redux App Settings Actions
 */
import {
    OPEN_MEMBER_ADD_EXERCISE_LOG_MODEL,
    SAVE_MEMBER_WORKOUT_SESSION_SUCCESS,
    CLOSE_MEMBER_ADD_EXERCISE_LOG_MODEL,
    SAVE_MEMBER_EXERCISE_LOG,
    SAVE_MEMBER_EXERCISE_LOG_SUCCESS,
    SAVE_MEMBER_EXERCISE_LOG_COPY,
    SAVE_MEMBER_EXERCISE_LOG_COPY_SUCCESS,
    ON_ADD_EXERCISE_TO_SESSION,
    END_MEMBER_WORKOUT_SESSION,
    END_MEMBER_WORKOUT_SESSION_SUCCESS,
    OPEN_MEMBER_ADD_NEW_EXERCISE_FEEDBACK_MODEL,
    CLOSE_MEMBER_ADD_NEW_EXERCISE_FEEDBACK_MODEL,
    CHANGE_VOICE_FEEDBACK,
    CHANGE_INTERVAL_VIBRATION,
    SAVE_MEMBER_EXERCISE_FEEDBACK
} from '../types';

export const opnMemberAddExerciseLogModel = (data) => ({
    type: OPEN_MEMBER_ADD_EXERCISE_LOG_MODEL,
    payload : data
});
export const saveMemberWorkoutSessionSuccess = () => ({
    type: SAVE_MEMBER_WORKOUT_SESSION_SUCCESS,
});

export const clsMemberAddExerciseLogModel = () => ({
    type: CLOSE_MEMBER_ADD_EXERCISE_LOG_MODEL
});

export const saveMemberExerciseLog = (data) => ({
    type: SAVE_MEMBER_EXERCISE_LOG,
    payload : data
});

export const saveMemberExerciseLogSuccess = () => ({
    type: SAVE_MEMBER_EXERCISE_LOG_SUCCESS,
});

export const endMemberWorkoutSession = (data) => ({
    type: END_MEMBER_WORKOUT_SESSION,
    payload:data,
});

export const endMemberWorkoutSessionSuccess = () => ({
    type: END_MEMBER_WORKOUT_SESSION_SUCCESS,
});

export const opnMemberAddExerciseFeedbackModel = (data) => ({
    type: OPEN_MEMBER_ADD_NEW_EXERCISE_FEEDBACK_MODEL,
    payload : data
});

export const clsMemberAddExerciseFeedbackModel = () => ({
    type: CLOSE_MEMBER_ADD_NEW_EXERCISE_FEEDBACK_MODEL
});
export const changeVoiceFeedback = (data) => ({
    type: CHANGE_VOICE_FEEDBACK,
    payload : data
});
export const changeIntervalVibration = (data) => ({
    type: CHANGE_INTERVAL_VIBRATION,
    payload : data
});
export const saveMemberExerciseFeedback = (data) => ({
    type: SAVE_MEMBER_EXERCISE_FEEDBACK,
    payload : data
});

export const saveMemberExerciseLogCopy = () => ({
    type: SAVE_MEMBER_EXERCISE_LOG_COPY,
});

export const saveMemberExerciseLogCopySuccess = () => ({
    type: SAVE_MEMBER_EXERCISE_LOG_COPY_SUCCESS,
});
