/**
 * Common Actions
 */

 import {
     ON_HIDE_LOADER,
     ON_SHOW_LOADER,
     REQUEST_FAILURE,
     REQUEST_SUCCESS
   } from './types';


   /**
    * Redux Action To Update Failure Message
    */
   export const  requestFailure = (error) => ({
       type: REQUEST_FAILURE,
       payload : error
   });
   /**
    * Redux Action To Update Success Message
    */
   export const  requestSuccess = (message) => ({
       type: REQUEST_SUCCESS,
       payload : message
   });

   /**
   * Redux Action To Hide The Loding Indicator
   */
  export const hideLoader = () => ({
      type: ON_HIDE_LOADER
  });

  /**
   * Redux Action To Show Loader
   */
  export const showLoader = () => ({
      type: ON_SHOW_LOADER
  });
