/**
 * attendance Actions
 */
import {
SAVE_EMPLOYEEATTENDANCE,
SAVE_EMPLOYEEATTENDANCE_SUCCESS,
GET_EMPLOYEEATTENDANCE_LIST,
GET_EMPLOYEEATTENDANCE_LIST_SUCCESS,
DELETE_EMPLOYEE_ATTENDANCE,
DELETE_EMPLOYEE_LAST_ATTENDANCE,
  } from './types';
  /**
   * Redux Action SAVE user attendance
   */
  export const saveEmployeeattendance = (data) => ({
      type: SAVE_EMPLOYEEATTENDANCE,
      payload : data
  });
  /**
   * Redux Action SAVE user attendance SUCCESS
   */
  export const saveEmployeeattendanceSuccess = (data) => ({
      type: SAVE_EMPLOYEEATTENDANCE_SUCCESS,
      payload : data
  });
  /**
   * Redux Action list user attendance
   */
  export const getEmployeeAttendanceList = (data) => ({
      type: GET_EMPLOYEEATTENDANCE_LIST,
      payload : data
  });
  /**
   * Redux Action list user attendance SUCCESS
   */
  export const getEmployeeAttendanceListSuccess = (response) => ({
      type: GET_EMPLOYEEATTENDANCE_LIST_SUCCESS,
      payload: response
  });
  /**
   * Redux Action delete user attendance
   */
  export const deleteEmployeeAttendance = (data) => ({
      type: DELETE_EMPLOYEE_ATTENDANCE,
      payload:data
  });
  /**
   * Redux Action delete user lastattendance
   */
  export const deleteEmployeeLastAttendance = () => ({
      type: DELETE_EMPLOYEE_LAST_ATTENDANCE
  });
