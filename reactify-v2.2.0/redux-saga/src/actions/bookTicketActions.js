/**
 * BookTicket Actions
 */

import {
  GET_BOOKTICKETS,
  GET_BOOKTICKETS_SUCCESS,

  OPEN_ADD_NEW_BOOKTICKET_MODEL,
  CLOSE_ADD_NEW_BOOKTICKET_MODEL,
  OPEN_ADD_NEW_BOOKTICKET_MODEL_SUCCESS,

  OPEN_EDIT_BOOKTICKET_MODEL,
  OPEN_EDIT_BOOKTICKET_MODEL_SUCCESS,

  OPEN_VIEW_BOOKTICKET_MODEL,
  OPEN_VIEW_BOOKTICKET_MODEL_SUCCESS,
  CLOSE_VIEW_BOOKTICKET_MODEL,

  SAVE_BOOKTICKET,
  SAVE_BOOKTICKET_SUCCESS,

  DELETE_BOOKTICKET,
  DELETE_BOOKTICKET_SUCCESS,

  } from './types';
  /**
   * Redux Action Get BookTickets
   */
  export const getBookTickets = (requestData) => ({
      type: GET_BOOKTICKETS,
      payload : requestData
  });
  /**
   * Redux Action Get BookTickets Success
   */
  export const getBookTicketsSuccess = (response) => ({
      type: GET_BOOKTICKETS_SUCCESS,
      payload: response
  });

  /**
   * Redux Action OPEN View BookTicket Model
   */
export const opnAddNewBookTicketModel = (requestData) => ({
    type: OPEN_ADD_NEW_BOOKTICKET_MODEL,
      payload:requestData
});
/**
 * Redux Action Open Model for new Member
 */
export const opnAddNewBookTicketModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_BOOKTICKET_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View BookTicket Model
 */
export const clsAddNewBookTicketModel = () => ({
    type: CLOSE_ADD_NEW_BOOKTICKET_MODEL,
});
/**
 * Redux Action Open Model to view BookTicket
 */
export const opnViewBookTicketModel = (requestData) => ({
    type: OPEN_VIEW_BOOKTICKET_MODEL,
      payload:requestData
});
/**
 * Redux Action view BookTickets model
 */
export const viewBookTicketSuccess = (response) => ({
    type: OPEN_VIEW_BOOKTICKET_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View BookTicket Model
 */
export const clsViewBookTicketModel = () => ({
    type: CLOSE_VIEW_BOOKTICKET_MODEL
});
/**
 * Redux Action edit BookTickets model
 */
export const opnEditBookTicketModel = (requestData) => ({
    type: OPEN_EDIT_BOOKTICKET_MODEL,
      payload:requestData
});
/**
 * Redux Action edit BookTickets Success
 */
export const editBookTicketSuccess = (response) => ({
    type: OPEN_EDIT_BOOKTICKET_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE PRODUCT
 */
export const saveBookTicket = (data) => ({
    type: SAVE_BOOKTICKET,
    payload : data
});
/**
 * Redux Action SAVE PRODUCT SUCCESS
 */
export const saveBookTicketSuccess = () => ({
    type: SAVE_BOOKTICKET_SUCCESS,
});

/**
 * Redux Action SAVE PRODUCT
 */
export const deleteBookTicket = (data) => ({
    type: DELETE_BOOKTICKET,
    payload : data
});
/**
 * Redux Action SAVE PRODUCT SUCCESS
 */
export const deleteBookTicketSuccess = () => ({
    type: DELETE_BOOKTICKET_SUCCESS,
});
