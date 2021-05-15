/**
 * SIGNUP Actions
 */
import {

  OPEN_ADD_NEW_TEMPLTECONFIGURATION_MODEL,
  CLOSE_ADD_NEW_TEMPLTECONFIGURATION_MODEL,

  GET_TEMPLTECONFIGURATIONS,
  GET_TEMPLTECONFIGURATION_SUCCESS,

  SAVE_TEMPLTECONFIGURATION,
  SAVE_TEMPLTECONFIGURATION_SUCCESS,

  DELETE_TEMPLTECONFIGURATION,

  OPEN_EDIT_TEMPLTECONFIGURATION_MODEL,
  OPEN_EDIT_TEMPLTECONFIGURATION_MODEL_SUCCESS,

  OPEN_VIEW_TEMPLTECONFIGURATION_MODEL,
  OPEN_VIEW_TEMPLTECONFIGURATION_MODEL_SUCCESS,
  CLOSE_VIEW_TEMPLTECONFIGURATION_MODEL,

  SAVE_NOTIFICATION_CONFIGURATION,
  SAVE_NOTIFICATION_CONFIGURATION_SUCCESS,

  VIEW_NOTIFICATION_CONFIGURATION,
  VIEW_NOTIFICATION_CONFIGURATION_SUCCESS,

  SAVE_NOTIFICATION_EMAIL_GATEWAY,
  SAVE_NOTIFICATION_EMAIL_GATEWAY_SUCCESS,

  VIEW_NOTIFICATION_GATEWAY_INFORMATION,
  VIEW_NOTIFICATION_GATEWAY_INFORMATION_SUCCESS,
  } from './types';

  /**
   * Redux Action OPEN Template Configuration Model
   */
  export const opnAddNewTemplateConfigurationModel = () => ({
    type: OPEN_ADD_NEW_TEMPLTECONFIGURATION_MODEL,
  });

  /**
  * Redux Action close Template Model
  */
  export const clsAddNewTemplateConfigurationModel = () => ({
    type: CLOSE_ADD_NEW_TEMPLTECONFIGURATION_MODEL,
  });
  /**
   * Redux Action Get Templates
   */
  export const getTemplateConfigurations = (data) => ({
      type: GET_TEMPLTECONFIGURATIONS,
      payload : data
  });


  /**
   * Redux Action Get templtes Success
   */
  export const getTemplateConfigurationsSuccess = (response) => ({
      type: GET_TEMPLTECONFIGURATION_SUCCESS,
      payload: response
  });


  /**
   * Redux Action SAVE templtes
   */
  export const saveTemplateConfiguration = (data) => ({
      type: SAVE_TEMPLTECONFIGURATION,
      payload : data
  });
  /**
   * Redux Action SAVE templtes SUCCESS
   */

  export const saveTemplateConfigurationSuccess = () => ({
      type: SAVE_TEMPLTECONFIGURATION_SUCCESS,
  });
  /**
   * Redux Action Open Model to view templates
   */
  export const opnViewTemplateConfigurationModel = (requestData) => ({
      type: OPEN_VIEW_TEMPLTECONFIGURATION_MODEL,
        payload:requestData
  });
  /**
   * Redux Action view templtes model
   */
  export const viewTemplateConfigurationSuccess = (response) => ({
      type: OPEN_VIEW_TEMPLTECONFIGURATION_MODEL_SUCCESS,
      payload: response
  });
  /**
   * Redux Action close View templtes Model
   */
  export const clsViewTemplateConfigurationModel = () => ({
      type: CLOSE_VIEW_TEMPLTECONFIGURATION_MODEL
  });
  /**
   * Redux Action edit templtes model
   */
  export const opnEditTemplateConfigurationModel = (requestData) => ({
      type: OPEN_EDIT_TEMPLTECONFIGURATION_MODEL,
        payload:requestData
  });
  /**
   * Redux Action edit templtes Success
   */
  export const editTemplateConfigurationSuccess = (response) => ({
      type: OPEN_EDIT_TEMPLTECONFIGURATION_MODEL_SUCCESS,
      payload: response
  });
  /**
   * Redux Action Delete templates
   */
  export const deleteTemplateConfiguration = (data) => ({
      type: DELETE_TEMPLTECONFIGURATION,
      payload:data
  });


  export const saveNotificationConfiguration = (data) => ({
      type: SAVE_NOTIFICATION_CONFIGURATION,
      payload : data
  });

  export const saveNotificationConfigurationSuccess = () => ({
      type: SAVE_NOTIFICATION_CONFIGURATION_SUCCESS,
  });

  export const viewNotificationConfiguration = () => ({
      type: VIEW_NOTIFICATION_CONFIGURATION,
  });

  export const viewNotificationConfigurationSuccess = (response) => ({
      type: VIEW_NOTIFICATION_CONFIGURATION_SUCCESS,
      payload: response
  });

  export const saveNotificationEmailGateway = (data) => ({
      type: SAVE_NOTIFICATION_EMAIL_GATEWAY,
      payload : data
  });

  export const saveNotificationEmailGatewaySuccess = () => ({
      type: SAVE_NOTIFICATION_EMAIL_GATEWAY_SUCCESS,
  });

  export const viewNotificationGatewayInformation = (requestData) => ({
      type: VIEW_NOTIFICATION_GATEWAY_INFORMATION,
        payload:requestData
  });

  export const viewNotificationGatewayInformationSuccess = (response) => ({
      type: VIEW_NOTIFICATION_GATEWAY_INFORMATION_SUCCESS,
      payload: response
  });
