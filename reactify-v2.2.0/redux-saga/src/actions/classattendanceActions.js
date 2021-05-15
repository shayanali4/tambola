/**
 * attendance Actions
 */
import {
SAVE_CLASSATTENDANCE,
SAVE_CLASSATTENDANCE_SUCCESS,

GET_CLASSATTENDANCE_LIST,
GET_CLASSATTENDANCE_LIST_SUCCESS,

DELETE_CLASS_ATTENDANCE,
DELETE_CLASS_LAST_ATTENDANCE,

SAVE_SESSIONWEIGHT,
SAVE_SESSIONWEIGHT_SUCCESS,
  } from './types';
  /**
   * Redux Action SAVE class attendance
   */
  export const saveClassattendance = (data) => ({
      type: SAVE_CLASSATTENDANCE,
      payload : data
  });
  /**
   * Redux Action SAVE class attendance SUCCESS
   */
  export const saveClassattendanceSuccess = (data) => ({
      type: SAVE_CLASSATTENDANCE_SUCCESS,
      payload : data
  });

  export const getClassAttendanceList = (data) => ({
      type: GET_CLASSATTENDANCE_LIST,
      payload : data
  });

  export const getClassAttendanceListSuccess = (response) => ({
      type: GET_CLASSATTENDANCE_LIST_SUCCESS,
      payload: response
  });

    export const deleteClassAttendance = (data) => ({
        type: DELETE_CLASS_ATTENDANCE,
        payload:data
    });

    export const deleteClasLastAttendance = () => ({
        type: DELETE_CLASS_LAST_ATTENDANCE
    });
    /**
     * Redux Action SAVE class attendance
     */
    export const saveSessionWeight = (data) => ({
        type: SAVE_SESSIONWEIGHT,
        payload : data
    });
    /**
     * Redux Action SAVE class attendance SUCCESS
     */
    export const saveSessionWeightSuccess = (data) => ({
        type: SAVE_SESSIONWEIGHT_SUCCESS,
        payload : data
    });
