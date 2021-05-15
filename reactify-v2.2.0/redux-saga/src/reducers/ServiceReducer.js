import  Status from 'Assets/data/status';
import  ServiceValidity from 'Assets/data/servicevalidity';
import  Serviceunit from 'Assets/data/measurementunit';
import ServiceType from 'Assets/data/servicetype';
import update from 'react-addons-update';

// action types
import {
GET_SERVICES,
GET_SERVICES_SUCCESS,
OPEN_ADD_NEW_SERVICE_MODEL,
OPEN_ADD_NEW_SERVICE_MODEL_SUCCESS,
CLOSE_ADD_NEW_SERVICE_MODEL,
OPEN_EDIT_SERVICE_MODEL,
OPEN_EDIT_SERVICE_MODEL_SUCCESS,
OPEN_VIEW_SERVICE_MODEL,
OPEN_VIEW_SERVICE_MODEL_SUCCESS,
CLOSE_VIEW_SERVICE_MODEL,
DELETE_SERVICE,
SAVE_SERVICE,
SAVE_SERVICE_SUCCESS,
SERVICE_HANDLE_CHANGE_SELECT_ALL,
SERVICE_HANDLE_SINGLE_CHECKBOX_CHANGE,
OPEN_ENABLEONLINESALE_SERVICE_MODEL,
CLOSE_ENABLEONLINESALE_SERVICE_MODEL,
SAVE_ENABLEONLINESALE_SERVICE,
SAVE_ENABLEONLINESALE_SERVICE_SUCCESS,
OPEN_DISABLEONLINESALE_SERVICE_MODEL,
CLOSE_DISABLEONLINESALE_SERVICE_MODEL,
GET_SERVICES_PARALLELLIST,
GET_SERVICES_PARALLELLIST_SUCCESS,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      services: null, // initial service data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewServiceModal : false,
      viewServiceDialog:false,
      selectedService: null,
      editservice : null,
      editMode : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      taxcodecategorylist : null,
      branchlist : null,
      selectAll: false,
      opnEnableOnlineSaleServiceDialog : false,
      opnDisableOnlineSaleServiceDialog : false,
      enableOnlineSaleServicedata : null,
      parallelplanlist : null,
    };

export default (state = INIT_STATE, action) => {

    switch (action.type) {
      // get services
      case GET_SERVICES:

      let tableInfo = state.tableInfo;
        if(action.payload)
        {
          tableInfo.pageIndex  = action.payload.state.page;
          tableInfo.pageSize  = action.payload.state.pageSize;
          tableInfo.sorted  = action.payload.state.sorted;
          tableInfo.filtered = action.payload.state.filtered;
        }
      return { ...state , tableInfo : tableInfo};
      // get service success
      case GET_SERVICES_SUCCESS:
      {
         let services = action.payload.data;

         return { ...state, services: services,selectAll : false,  tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
     }
     case OPEN_ADD_NEW_SERVICE_MODEL :
              return { ...state, addNewServiceModal : true ,editMode : false ,editservice : null};
      case OPEN_ADD_NEW_SERVICE_MODEL_SUCCESS:
               return { ...state,addNewServiceModal : true, editMode : false ,editservice : null,taxcodecategorylist : action.payload.taxcodecategorylist,
                 branchlist:action.payload.branchlist , parallelplanlist : action.payload.parallelplanlist };
    case CLOSE_ADD_NEW_SERVICE_MODEL:
              return { ...state, addNewServiceModal : false ,editMode : false,editservice : null};
    case OPEN_EDIT_SERVICE_MODEL:
        return { ...state, addNewServiceModal : true, editMode : true, editservice: null };
    case OPEN_EDIT_SERVICE_MODEL_SUCCESS:
            let editservice = action.payload.data[0];
            if(editservice)
            {
               editservice.images =  JSON.parse(editservice.images);
               editservice.images = editservice.images || [];

               editservice.statusId =  editservice.statusId ? editservice.statusId.toString() : '';
          		 editservice.measurementunitId = editservice.measurementunitId ? editservice.measurementunitId.toString() : '';
          		 editservice.servicetypeId = editservice.servicetypeId ? editservice.servicetypeId.toString() : '';
          		 editservice.servicevalidityId = editservice.servicevalidityId ?  editservice.servicevalidityId.toString() : '';
               editservice.activityId = editservice.activityId ?  editservice.activityId.toString() : '';
               editservice.applicableforId = editservice.applicableforId ?  editservice.applicableforId.toString() : '';
               editservice.durationId = editservice.durationId ?  editservice.durationId.toString() : '';
               editservice.sessiontypeId = editservice.sessiontypeId ?  editservice.sessiontypeId.toString() : '';
            }
              return { ...state,editservice:editservice,taxcodecategorylist : action.payload.taxcodecategorylist,
                branchlist:action.payload.branchlist, parallelplanlist : action.payload.parallelplanlist };
     case OPEN_VIEW_SERVICE_MODEL :
         return { ...state, viewServiceDialog : true , selectedService : null};

      case OPEN_VIEW_SERVICE_MODEL_SUCCESS:
        let selectedService = action.payload.data[0];
        if(selectedService)
        {
          selectedService.images = JSON.parse(selectedService.images);
           selectedService.images = selectedService.images || [];

           selectedService.branchlist = selectedService.branchlist ? JSON.parse(selectedService.branchlist) : [];

           selectedService.statusId =  selectedService.statusId ? selectedService.statusId.toString() : '';
      		 selectedService.measurementunitId = selectedService.measurementunitId ? selectedService.measurementunitId.toString() : '';
      		 selectedService.servicetypeId = selectedService.servicetypeId ? selectedService.servicetypeId.toString() : '';
      		 selectedService.servicevalidityId = selectedService.servicevalidityId ?  selectedService.servicevalidityId.toString() : '';

        }
              return { ...state,selectedService:selectedService,taxcodecategorylist : action.payload.taxcodecategorylist };
      case CLOSE_VIEW_SERVICE_MODEL:
          return { ...state, viewServiceDialog : false ,selectedService :null};
     case SAVE_SERVICE:
                  return { ...state, dialogLoading : true, disabled : true };
      case SAVE_SERVICE_SUCCESS:
                  return { ...state, dialogLoading : false,addNewServiceModal : false , editMode : false, editservice : null, disabled : false};

      case SERVICE_HANDLE_CHANGE_SELECT_ALL:

              var selectAll = !state.selectAll;
              state.services.forEach(x => x.checked = action.payload.value);
              return update(state, {
                    selectAll: { $set:selectAll },
              });

      case SERVICE_HANDLE_SINGLE_CHECKBOX_CHANGE:

              let serviceIndex = state.services.indexOf(action.payload.data);
              return update(state, {
                 services: {
                 [serviceIndex]: {
                      checked: { $set: action.payload.value },
                      }
                    }
            });
      case OPEN_ENABLEONLINESALE_SERVICE_MODEL :
                         return { ...state, opnEnableOnlineSaleServiceDialog : true,editMode : false , editservice : null,enableOnlineSaleServicedata : action.payload};
      case CLOSE_ENABLEONLINESALE_SERVICE_MODEL:
                         return { ...state, opnEnableOnlineSaleServiceDialog : false, editMode : false , editservice : null ,enableOnlineSaleServicedata : null};
      case OPEN_DISABLEONLINESALE_SERVICE_MODEL :
                         return { ...state, opnDisableOnlineSaleServiceDialog : true,editMode : false , editservice : null,enableOnlineSaleServicedata : action.payload};
      case CLOSE_DISABLEONLINESALE_SERVICE_MODEL:
                         return { ...state, opnDisableOnlineSaleServiceDialog : false, editMode : false , editservice : null ,enableOnlineSaleServicedata : null};

      case SAVE_ENABLEONLINESALE_SERVICE:
                         return { ...state,dialogLoading : true, disabled : true};
      case SAVE_ENABLEONLINESALE_SERVICE_SUCCESS:
                          return { ...state,opnEnableOnlineSaleServiceDialog : false,opnDisableOnlineSaleServiceDialog :false,dialogLoading : false,enableOnlineSaleServicedata : null,editMode : false, editservice : null, disabled : false};

       case GET_SERVICES_PARALLELLIST_SUCCESS:
                return { ...state,parallelplanlist : action.payload.data };

       case REQUEST_FAILURE:
            return { ...state , dialogLoading : false, disabled : false};
        case REQUEST_SUCCESS:
                  return { ...state};
        case ON_SHOW_LOADER:
                return { ...state, loading : true};
         case ON_HIDE_LOADER:
              return { ...state, loading : false};
        break;
        default: return { ...state};
          }
          }
