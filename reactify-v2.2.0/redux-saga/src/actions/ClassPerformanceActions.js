
/**
 * class performance Actions
 */
import {
GET_CLASS_PERFORMANCE_SUCCESS,
GET_CLASS_PERFORMANCE,

OPEN_VIEW_CLASS_PERFORMANCE_MODEL,
OPEN_VIEW_CLASS_PERFORMANCE_MODEL_SUCCESS,
CLOSE_VIEW_CLASS_PERFORMANCE_MODEL,

CONFIRMED_CLASS_COMMSSION,
  } from './types';
  /**
   * Redux Action Get class performance
   */

  export const getClassPerformances = (requestData) => ({
      type: GET_CLASS_PERFORMANCE,
      payload : requestData
  });

  /**
   * Redux Action Get class performance Success
   */
  export const getClassPerformancesSuccess = (response) => ({
      type: GET_CLASS_PERFORMANCE_SUCCESS,
      payload: response
  });
  /**
   * Redux Action Open Model to view class performance
   */
  export const opnViewClassPerformanceModel = (requestData) => ({
      type: OPEN_VIEW_CLASS_PERFORMANCE_MODEL,
        payload:requestData
  });
  /**
   * Redux Action view class performance Success
   */
  export const viewClassPerformanceSuccess = (response) => ({
      type: OPEN_VIEW_CLASS_PERFORMANCE_MODEL_SUCCESS,
      payload: response
  });
  /**
   * Redux Action close View class performance Model
   */
  export const clsViewClassPerformanceModel = () => ({
      type: CLOSE_VIEW_CLASS_PERFORMANCE_MODEL
  });
  export const confirmedClassCommission = (data) => ({
      type: CONFIRMED_CLASS_COMMSSION,
      payload:data
  });
