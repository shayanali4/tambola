/**
 * attendance Actions
 */
import {
SAVE_MEMBERATTENDANCE,
SAVE_MEMBERATTENDANCE_SUCCESS,
GET_MEMBERATTENDANCE_LIST,
GET_MEMBERATTENDANCE_LIST_SUCCESS,
DELETE_ATTENDANCE,
DELETE_LAST_ATTENDANCE,
SAVE_MEMBER_PT_ATTENDANCE,
SAVE_MEMBER_PT_ATTENDANCE_SUCCESS,
GET_MEMBER_PT_ATTENDANCE_LIST,
GET_MEMBER_PT_ATTENDANCE_LIST_SUCCESS,
DELETE_PT_ATTENDANCE,
DELETE_LAST_PT_ATTENDANCE,
SAVE_PT_SESSIONTIMEWEIGHT,
SAVE_PT_SESSIONTIMEWEIGHT_SUCCESS,
  } from './types';
  /**
   * Redux Action SAVE member attendance
   */
  export const savememberattendance = (data) => ({
      type: SAVE_MEMBERATTENDANCE,
      payload : data
  });
  /**
   * Redux Action SAVE member attendance SUCCESS
   */
  export const savememberattendanceSuccess = (data) => ({
      type: SAVE_MEMBERATTENDANCE_SUCCESS,
      payload : data
  });

  export const getMemberAttendanceList = (data) => ({
      type: GET_MEMBERATTENDANCE_LIST,
      payload : data
  });

  export const getMemberAttendanceListSuccess = (response) => ({
      type: GET_MEMBERATTENDANCE_LIST_SUCCESS,
      payload: response
  });

  export const deleteAttendance = (data) => ({
      type: DELETE_ATTENDANCE,
      payload:data
  });

  export const deleteLastAttendance = () => ({
      type: DELETE_LAST_ATTENDANCE
  });

  export const saveMemberPtAttendance = (data) => ({
      type: SAVE_MEMBER_PT_ATTENDANCE,
      payload : data
  });

  export const saveMemberPtAttendanceSuccess = (data) => ({
      type: SAVE_MEMBER_PT_ATTENDANCE_SUCCESS,
      payload : data
  });

  export const getMemberPtAttendanceList = (data) => ({
      type: GET_MEMBER_PT_ATTENDANCE_LIST,
      payload : data
  });

  export const getMemberPtAttendanceListSuccess = (response) => ({
      type: GET_MEMBER_PT_ATTENDANCE_LIST_SUCCESS,
      payload: response
  });

  export const savePtSessionTimeWeight = (data) => ({
      type: SAVE_PT_SESSIONTIMEWEIGHT,
      payload : data
  });

  export const savePtSessionTimeWeightSuccess = (data) => ({
      type: SAVE_PT_SESSIONTIMEWEIGHT_SUCCESS,
      payload : data
  });

  export const deletePtAttendance = (data) => ({
      type: DELETE_PT_ATTENDANCE,
      payload:data
  });

  export const deleteLastPtAttendance = () => ({
      type: DELETE_LAST_PT_ATTENDANCE
  });
