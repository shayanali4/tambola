
/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {templateconfigurationReducer,settings} from './states';
import { push } from 'connected-react-router';
import {cloneDeep} from 'Helpers/helpers';

// api
import api, {fileUploadConfig} from 'Api';

import {
  GET_TEMPLTECONFIGURATIONS,
  SAVE_TEMPLTECONFIGURATION,
  OPEN_EDIT_TEMPLTECONFIGURATION_MODEL,
  OPEN_VIEW_TEMPLTECONFIGURATION_MODEL,
  DELETE_TEMPLTECONFIGURATION,
  SAVE_NOTIFICATION_CONFIGURATION,
  VIEW_NOTIFICATION_CONFIGURATION,
  SAVE_NOTIFICATION_EMAIL_GATEWAY,
  VIEW_NOTIFICATION_GATEWAY_INFORMATION,
} from 'Actions/types';

import {
    getTemplateConfigurationsSuccess,
    saveTemplateConfigurationSuccess,
    editTemplateConfigurationSuccess,
    viewTemplateConfigurationSuccess,
    saveNotificationConfigurationSuccess,
    viewNotificationConfigurationSuccess,
    saveNotificationEmailGatewaySuccess,
    viewNotificationGatewayInformationSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

/**
 * Send templtes  Request To Server
 */
const getTemplateConfigurationRequest = function* (data)
{
  let response = yield  api.post('get-templates', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}
/**
 * Get templtes From Server
 */

function* getTemplateConfigurationsFromServer() {
    try {
        const state = yield select(templateconfigurationReducer);
        const state1 = yield select(settings);

        state.tableInfo.packtypeId = state1.clientProfileDetail.packtypeId;

        const response = yield call(getTemplateConfigurationRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getTemplateConfigurationsSuccess({data : response[0] , pages : response[1]}));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally {
      }
}


/**
 * Get templtes
 */
export function* getTemplateConfigurations() {
    yield takeEvery(GET_TEMPLTECONFIGURATIONS, getTemplateConfigurationsFromServer);
}
/**
 * Send twmplate  Save Request To Server
 */
const saveTemplateConfigurationRequest = function* (data)
{
    let response = yield api.post('save-template',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save template From Server
 */
function* saveTemplateConfigurationFromServer(action) {
    try {
        const response = yield call(saveTemplateConfigurationRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            const {template} = action.payload;
            if(template.id  != 0)
            {
              yield put(requestSuccess("Template updated successfully."));
            }
            else {
              yield put(requestSuccess("Template created successfully."));
            }
            yield  put(saveTemplateConfigurationSuccess());
            yield call(getTemplateConfigurationsFromServer);
            yield put(push('/app/setting/template-configuration/0'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 * Get Employees
 */
export function* saveTemplateConfiguration() {
    yield takeEvery(SAVE_TEMPLTECONFIGURATION, saveTemplateConfigurationFromServer);
}

/**
 * Send template VIEW Request To Server
 */
 const viewTemplateConfigurationRequest = function* (data)
 {
   let response = yield api.post('view-template', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }
/**
 * VIEW template From Server
 */
function* viewTemplateConfigurationFromServer(action) {
    try {
        const response = yield call(viewTemplateConfigurationRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
           yield put(viewTemplateConfigurationSuccess({data : response[0]}));
       }
      else {
        yield put(requestFailure(response.errorMessage ));
      }
    } catch (error) {
      console.log(error);
    }
    finally
    {
    }
}
/**
 * VIEW measurement
 */
export function* opnViewTemplateConfigurationModel() {
    yield takeEvery(OPEN_VIEW_TEMPLTECONFIGURATION_MODEL, viewTemplateConfigurationFromServer);
}

/**
 * edit template From Server
 */
function* editTemplateConfigurationFromServer(action) {
    try {
        const response = yield call(viewTemplateConfigurationRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(editTemplateConfigurationSuccess({data : response[0]}));
        }
        else {
               yield put(requestFailure(response.errorMessage  ));
             }
      } catch (error) {
          console.log(error);
      }
      finally
      {
      }
}
/**
 * Edit workoutschedule
 */
export function* opnEditTemplateConfigurationModel() {
    yield takeEvery(OPEN_EDIT_TEMPLTECONFIGURATION_MODEL, editTemplateConfigurationFromServer);
}

/**
 * Send template Delete Request To Server
 */
const deleteTemplateConfigurationRequest = function* (data)
{  let response = yield api.post('delete-template', data)
        .then(response => response.data)
        .catch(error => error.response.data);

    return response;
}

/**
 * Delete template From Server
 */
function* deleteTemplateConfigurationFromServer(action) {
    try {
             const response = yield call(deleteTemplateConfigurationRequest, action.payload);

              if(!(response.errorMessage  || response.ORAT))
              {
                   yield put(requestSuccess("Template deleted successfully."));
                   yield call(getTemplateConfigurationsFromServer);
              }
              else {
                 yield put(requestFailure(response.errorMessage));
              }

           } catch (error) {
               console.log(error);
           }
           finally{
           }

}

/**
 * delete template
 */
export function* deleteTemplateConfiguration() {
    yield takeEvery(DELETE_TEMPLTECONFIGURATION, deleteTemplateConfigurationFromServer);
}

const saveNotificationConfigurationRequest = function* (data)
{
    let response = yield api.post('save-notification-configuration',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveNotificationConfigurationFromServer(action) {
    try {
        let requestData = cloneDeep(action.payload);
        requestData.NotificationConfiguration.forEach(x => {if(x.days) {x.days =  x.days.filter( y => y.checked).map(y => y.value.toString())  } })
        const response = yield call(saveNotificationConfigurationRequest,requestData);
        if(!(response.errorMessage  || response.ORAT))
        {
              yield put(requestSuccess("Notification Configuration saved successfully."));
            yield  put(saveNotificationConfigurationSuccess());
            yield call(viewNotificationConfigurationFromServer);
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveNotificationConfiguration() {
    yield takeEvery(SAVE_NOTIFICATION_CONFIGURATION, saveNotificationConfigurationFromServer);
}

const viewNotificationConfigurationRequest = function* (data)
{
  let response = yield api.post('view-notification-configuration', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}
/**
* VIEW template From Server
*/
function* viewNotificationConfigurationFromServer(action) {
   try {
       const response = yield call(viewNotificationConfigurationRequest);
       if(!(response.errorMessage  || response.ORAT))
       {

          yield put(viewNotificationConfigurationSuccess({data : response[0]}));
      }
     else {
       yield put(requestFailure(response.errorMessage ));
     }
   } catch (error) {
     console.log(error);
   }
   finally
   {
   }
}
/**
* VIEW measurement
*/
export function* viewNotificationConfiguration() {
   yield takeEvery(VIEW_NOTIFICATION_CONFIGURATION, viewNotificationConfigurationFromServer);
}

const saveNotificationEmailGatewayRequest = function* (data)
{
    let response = yield api.post('save-notification-email-gateway',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveNotificationEmailGatewayFromServer(action) {
    try {
        const response = yield call(saveNotificationEmailGatewayRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
              yield put(requestSuccess("Notification Configuration saved successfully."));
            yield  put(saveNotificationEmailGatewaySuccess());
              yield call(viewNotificationGatewayInformationFromServer);
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveNotificationEmailGateway() {
    yield takeEvery(SAVE_NOTIFICATION_EMAIL_GATEWAY, saveNotificationEmailGatewayFromServer);
}


const viewNotificationGatewayInformationRequest = function* (data)
{
  let response = yield api.post('view-gateway-information', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}
/**
* VIEW template From Server
*/
function* viewNotificationGatewayInformationFromServer() {
   try {
       const response = yield call(viewNotificationGatewayInformationRequest);
       if(!(response.errorMessage  || response.ORAT))
       {
          yield put(viewNotificationGatewayInformationSuccess({data : response[0][0]}));

      }
     else {
       yield put(requestFailure(response.errorMessage ));
     }
   } catch (error) {
     console.log(error);
   }
   finally
   {
   }
}
/**
* VIEW measurement
*/
export function* viewNotificationGatewayInformation() {
   yield takeEvery(VIEW_NOTIFICATION_GATEWAY_INFORMATION, viewNotificationGatewayInformationFromServer);
}



/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getTemplateConfigurations),
        fork(saveTemplateConfiguration),
        fork(opnViewTemplateConfigurationModel),
        fork(opnEditTemplateConfigurationModel),
        fork(deleteTemplateConfiguration),
        fork(saveNotificationConfiguration),
        fork(viewNotificationConfiguration),
        fork(saveNotificationEmailGateway),
        fork(viewNotificationGatewayInformation),
    ]);
}
