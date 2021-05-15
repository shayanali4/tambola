/**
 * changeSale Actions
 */
import {
  GET_CHANGESUBSCRIPTIONSALES,
  GET_CHANGESUBSCRIPTIONSALES_SUCCESS,
  CHANGE_SALE,
  CHANGE_SALE_SUCCESS,
  OPEN_CHANGESALE_MODEL,
  OPEN_CHANGESALE_MODEL_SUCCESS,
  CLOSE_CHANGESALE_MODEL,
  ON_CHANGE

  } from './types';

   /**
    * Redux Action Get changesubscriptionsale
    */
   export const getChangeSubscriptionsales = (requestData) => ({
       type: GET_CHANGESUBSCRIPTIONSALES,
       payload : requestData
   });

   /**
    * Redux Action Get changesubscriptionsale Success
    */
   export const getChangeSubscriptionsalesSuccess = (response) => ({
       type: GET_CHANGESUBSCRIPTIONSALES_SUCCESS,
       payload: response
   });

   /**
    * Redux Action Delete sale
    */
   export const changeSale = (data) => ({
       type: CHANGE_SALE,
       payload:data
   });
   /**
   * Redux Action Delete sale success
    */
   export const changeSaleSuccess = (response) => ({
       type: CHANGE_SALE_SUCCESS,
       payload: response
   });
   /**
    * Redux Action Open Model for edit changeSale
    */
   export const opnChangeSaleModel = (data) => ({
       type: OPEN_CHANGESALE_MODEL,
       payload:data
   });
   export const opnChangeSaleModelSuccess = (response) => ({
       type: OPEN_CHANGESALE_MODEL_SUCCESS,
       payload:response
   });
   /**
    * Redux Action close edit changeSale Model
    */
   export const clsChangeSaleModel = () => ({
       type: CLOSE_CHANGESALE_MODEL
   });
   export const onChange = (type) => ({
      type: ON_CHANGE,
      payload: { type }
   })
