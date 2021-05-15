// action types
import {
  OPEN_ADD_NEW_TEMPLTECONFIGURATION_MODEL,
  CLOSE_ADD_NEW_TEMPLTECONFIGURATION_MODEL,

  GET_TEMPLTECONFIGURATIONS,
  GET_TEMPLTECONFIGURATION_SUCCESS,

  SAVE_TEMPLTECONFIGURATION,
  SAVE_TEMPLTECONFIGURATION_SUCCESS,

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

  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
  templates:'',
  loading : false,
  disabled : false,
  dialogLoading : false,
  addNewTemplateModal : false,
  viewTemplateDialog : false,
  selectedTemplate : null,
  editMode :false,
  editTemplate : null,
  selectedNotification : null,
  selectedGatewayInformation : null,

  tableInfo : {
    pageSize : 10,
    pageIndex : 0,
    pages : 1,
    totalrecord :0,
  }
};
export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case OPEN_ADD_NEW_TEMPLTECONFIGURATION_MODEL :
           return { ...state, addNewTemplateModal : true};
      case CLOSE_ADD_NEW_TEMPLTECONFIGURATION_MODEL:
                   return { ...state, addNewTemplateModal : false,editTemplate : null,  editMode : false};
     // get templates
      case GET_TEMPLTECONFIGURATIONS:
         let tableInfo = state.tableInfo;
              if(action.payload)
                   {
                     if(action.payload.state)
                     {
                       tableInfo.pageIndex  = action.payload.state.page;
                       tableInfo.pageSize  = action.payload.state.pageSize;
                       tableInfo.sorted  = action.payload.state.sorted;
                       tableInfo.filtered = action.payload.state.filtered;
                       tableInfo.activeTab = action.payload.state.activeTab;
                     }
                     else {

                         tableInfo.activeTab = action.payload.activeTab;
                     }
                   }
                         return { ...state , tableInfo : tableInfo};
        // get templtes success
        case GET_TEMPLTECONFIGURATION_SUCCESS:
                 return { ...state, templates: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

       // save template
         case SAVE_TEMPLTECONFIGURATION:
                         return { ...state, dialogLoading : true, disabled : true };
       // save employees success
         case SAVE_TEMPLTECONFIGURATION_SUCCESS:
                         return { ...state,addNewTemplateModal : false, dialogLoading : false, editMode : false, editTemplate : null, disabled : false};


     // open view template model
        case OPEN_VIEW_TEMPLTECONFIGURATION_MODEL:
                          return { ...state,selectedTemplate: null,viewTemplateDialog : true};
       // open view template model success
        case OPEN_VIEW_TEMPLTECONFIGURATION_MODEL_SUCCESS:
                          return { ...state,selectedTemplate:action.payload.data[0]};
       // close view template model
        case CLOSE_VIEW_TEMPLTECONFIGURATION_MODEL:
                          return { ...state, viewTemplateDialog : false };
        // open edit template model
        case  OPEN_EDIT_TEMPLTECONFIGURATION_MODEL:
                          return { ...state, addNewTemplateModal : true, editMode : true, editTemplate: null };
        // open edit template model  success
        case OPEN_EDIT_TEMPLTECONFIGURATION_MODEL_SUCCESS :
                          return { ...state,editTemplate:action.payload.data[0]};

        case SAVE_NOTIFICATION_CONFIGURATION:
                          return { ...state, dialogLoading : true, disabled : true,editMode : true };
        case SAVE_NOTIFICATION_CONFIGURATION_SUCCESS:
                          return { ...state,dialogLoading : false,disabled : false,editMode : true };
        case VIEW_NOTIFICATION_CONFIGURATION:
                          return { ...state,selectedNotification: null,editMode : true };
        case VIEW_NOTIFICATION_CONFIGURATION_SUCCESS:
                          return { ...state,selectedNotification:action.payload.data,editMode : false};
        case SAVE_NOTIFICATION_EMAIL_GATEWAY:
                          return { ...state, dialogLoading : true, disabled : true ,selectedGatewayInformation: null };
        case SAVE_NOTIFICATION_EMAIL_GATEWAY_SUCCESS:
                          return { ...state,dialogLoading : false,disabled : false};
        case VIEW_NOTIFICATION_GATEWAY_INFORMATION:
                          return { ...state,selectedGatewayInformation: null};
        case VIEW_NOTIFICATION_GATEWAY_INFORMATION_SUCCESS:
                      let selectedGatewayInformation = action.payload.data;
                      if(selectedGatewayInformation)
                      {
                        selectedGatewayInformation.emailgateway =  selectedGatewayInformation.emailgateway ?  selectedGatewayInformation.emailgateway : null ;
                        selectedGatewayInformation.smsgateway =  selectedGatewayInformation.smsgateway ?  selectedGatewayInformation.smsgateway : null ;
                      }
                          return { ...state,selectedGatewayInformation:selectedGatewayInformation};

      case REQUEST_FAILURE:
                   return { ...state , loading : false, dialogLoading : false, disabled : false};
      case REQUEST_SUCCESS:
                   return { ...state};
       case ON_SHOW_LOADER:
                     return { ...state, loading : true, disabled : true};
       case ON_HIDE_LOADER:
                    return { ...state, loading : false, dialogLoading : false, disabled : false};
      break;
        default: return { ...state};
                      }
                    }
