import update from 'react-addons-update';
import Auth from '../Auth/Auth';
const authObject = new Auth();

// action types
import {
  GET_ENQUIRY,
  GET_ENQUIRY_SUCCESS,
  OPEN_ADD_NEW_ENQUIRY_MODEL,
  OPEN_ADD_NEW_ENQUIRY_MODEL_SUCCESS,
  CLOSE_ADD_NEW_ENQUIRY_MODEL,
  SAVE_ENQUIRY,
  SAVE_ENQUIRY_SUCCESS,
  OPEN_VIEW_ENQUIRY_MODEL,
  OPEN_VIEW_ENQUIRY_MODEL_SUCCESS,
  CLOSE_VIEW_ENQUIRY_MODEL,
  DELETE_ENQUIRY,
  OPEN_EDIT_ENQUIRY_MODEL,
  OPEN_EDIT_ENQUIRY_MODEL_SUCCESS,
  OPEN_VIEW_ENQUIRY_STATUS_MODEL,
  OPEN_VIEW_ENQUIRY_STATUS_MODEL_SUCCESS,
  CLOSE_VIEW_ENQUIRY_STATUS_MODEL,
  SAVE_ENQUIRY_STATUS,
  SAVE_ENQUIRY_STATUS_SUCCESS,
  IMPORT_ENQUIRY,
  IMPORT_ENQUIRY_SUCCESS,
  IMPORT_ENQUIRY_LIST,
  IMPORT_ENQUIRY_LIST_SUCCESS,
  HANDLE_CHANGE_SELECT_ALL,
  HANDLE_SINGLE_CHECKBOX_CHANGE,
  OPEN_TRANSFER_ENQUIRY_MODEL,
  CLOSE_TRANSFER_ENQUIRY_MODEL,
  SAVE_TRANSFER_ENQUIRY,
  SAVE_TRANSFER_ENQUIRY_SUCCESS,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      enquiries: null, // initial service data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewEnquiryModal : false,
      viewEnquiryDialog:false,
      selectedEnquiry: null,
      servicePlanList:null,
      editenquiry : null,
      editMode : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },

      viewEnquiryStatus: null,
      viewEnquiryStatusDialog:false,

      importloading:false,
      importfilelist : null,
      tableInfoImport : {
        pageSize : 5,
        pageIndex : 0,
        pages : 1,
      },

      isEnquiryFollowupsave : false,
      selectAll: false,
      checked: [],
      enquiryid : [],
      opntransferenquiryDialog : false,
      transferenquirydata : null
};

    export default (state = INIT_STATE, action) => {
        switch (action.type) {
          // get enquiries
          case GET_ENQUIRY:
          let profileDetail = authObject.getProfile();
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
              else if(action.payload.activeTab) {
                  tableInfo.activeTab = action.payload.activeTab;
              }
              else if(action.payload.attendedbyfilter != null) {
                tableInfo.filtered = tableInfo.filtered.filter(x => x.id != "attendedby");
                if(action.payload.attendedbyfilter == 1)
                {
                  tableInfo.filtered.push({id: "attendedby",value: profileDetail.id});
                }
              }
              else if(action.payload.followupbyfilter != null) {
                tableInfo.filtered = tableInfo.filtered.filter(x => x.id != "followupby");
                if(action.payload.followupbyfilter == 1)
                {
                  tableInfo.filtered.push({id: "followupby",value: profileDetail.id});
                }
              }

            }
              return { ...state ,tableInfo : tableInfo,dialogLoading : false};
          // get enquiry success
          case GET_ENQUIRY_SUCCESS:
              return { ...state, enquiries: action.payload.data ? action.payload.data : state.enquiries , tableInfo : {...state.tableInfo ,
                pages : action.payload.pages[0].pages,
                totalrecord : action.payload.pages[0].count,
                expected :  action.payload.pages[0].expected
              },
              dialogLoading : false,selectAll : false};
          case OPEN_ADD_NEW_ENQUIRY_MODEL :
                       return { ...state, addNewEnquiryModal : true,editMode : false , editenquiry : null};
          case OPEN_ADD_NEW_ENQUIRY_MODEL_SUCCESS:
                       return { ...state,servicePlanList:action.payload.servicePlanList,
                         addNewEnquiryModal : true, loading : false };
           case CLOSE_ADD_NEW_ENQUIRY_MODEL:
                       return { ...state, addNewEnquiryModal : false, editMode : false , editenquiry : null   };
        case SAVE_ENQUIRY:
            return { ...state,dialogLoading : true, disabled : true};
        case SAVE_ENQUIRY_SUCCESS:
             return { ...state,addNewEnquiryModal : false,dialogLoading : false,selectedEnquiry : null,editMode : false, editenquiry : null, disabled : false};
        case OPEN_VIEW_ENQUIRY_MODEL:
                            return { ...state,selectedEnquiry: null,viewEnquiryDialog : true};
       case OPEN_VIEW_ENQUIRY_MODEL_SUCCESS:
                      return { ...state,selectedEnquiry:action.payload.data};
      case CLOSE_VIEW_ENQUIRY_MODEL:
                      return { ...state, viewEnquiryDialog : false };
      case  OPEN_EDIT_ENQUIRY_MODEL:
      return { ...state, addNewEnquiryModal : true, editMode : true, editenquiry: null };
      case OPEN_EDIT_ENQUIRY_MODEL_SUCCESS :
              return { ...state,editenquiry:action.payload.data[0], servicePlanList:action.payload.servicePlanList };
      case REQUEST_FAILURE:
              return { ...state , loading : false, dialogLoading : false, disabled : false,importloading : false};
      case REQUEST_SUCCESS:
                return { ...state};
      case ON_SHOW_LOADER:
                return { ...state, loading : true, disabled : true};
      case ON_HIDE_LOADER:
               return { ...state, loading : false, dialogLoading : false, disabled : false};
      case OPEN_VIEW_ENQUIRY_STATUS_MODEL:
              let data = action.payload;
              if(!data.id)
              {
                if(data.paramId && state.selectedEnquiry && state.selectedEnquiry.id == data.paramId)
                {
                  data = state.selectedEnquiry;
                  data.enquirylistId = action.payload.enquirylistId;
                }
              }
               return { ...state,viewEnquiryStatus:data,viewEnquiryStatusDialog : true,isEnquiryFollowupsave : false};
      case CLOSE_VIEW_ENQUIRY_STATUS_MODEL:
               return { ...state, viewEnquiryStatusDialog : false,isEnquiryFollowupsave : false,viewEnquiryStatus : null };
       case SAVE_ENQUIRY_STATUS:
               return { ...state,dialogLoading : true, disabled : true,isEnquiryFollowupsave : false};
       case SAVE_ENQUIRY_STATUS_SUCCESS:
               return { ...state,viewEnquiryStatusDialog : false,dialogLoading : false,viewEnquiryStatus : null, disabled : false,isEnquiryFollowupsave : true};
       case IMPORT_ENQUIRY:
                   return { ...state ,importloading : true};
       case IMPORT_ENQUIRY_SUCCESS:
                   return { ...state,importloading : false};
       case IMPORT_ENQUIRY_LIST:
              let tableInfoImport = state.tableInfoImport;
               if(action.payload)
                 {
                    if(action.payload.state)
                       {
                         tableInfoImport.pageIndex  = action.payload.state.page;
                         tableInfoImport.pageSize  = action.payload.state.pageSize;
                         tableInfoImport.sorted  = action.payload.state.sorted;
                         tableInfoImport.filtered = action.payload.state.filtered;
                         tableInfoImport.modulename = 'enquiry';
                       }
                       else {
                           tableInfoImport.sorted  =[];
                           tableInfoImport.filtered = [];
                           tableInfoImport.modulename = 'enquiry';
                       }
                   }
                       return { ...state ,tableInfoImport : tableInfoImport,importloading : true};
        case IMPORT_ENQUIRY_LIST_SUCCESS:
                       return { ...state, importfilelist: action.payload.data,importloading : false, tableInfoImport : {...state.tableInfoImport , pages : action.payload.pages[0].pages}};
        case HANDLE_CHANGE_SELECT_ALL:

        let	{ enquiries} = state;
        var selectAll = !state.selectAll;
        enquiries.forEach(x => x.checked = action.payload.value);
        return update(state, {
             	selectAll: { $set:selectAll },
          });

          case HANDLE_SINGLE_CHECKBOX_CHANGE:
          let enquiryIndex = state.enquiries.indexOf(action.payload.data);
          return update(state, {
						enquiries: {
							[enquiryIndex]: {
								checked: { $set: action.payload.value },

							}
					}
				});

        case OPEN_TRANSFER_ENQUIRY_MODEL :
                     return { ...state, opntransferenquiryDialog : true,editMode : false , editenquiry : null,transferenquirydata : action.payload};
       case CLOSE_TRANSFER_ENQUIRY_MODEL:
                     return { ...state, opntransferenquiryDialog : false, editMode : false , editenquiry : null ,transferenquirydata : null};
       case SAVE_TRANSFER_ENQUIRY:
                     return { ...state,dialogLoading : true, disabled : true};
      case SAVE_TRANSFER_ENQUIRY_SUCCESS:
                      return { ...state,opntransferenquiryDialog : false,dialogLoading : false,transferenquirydata : null,editMode : false, editenquiry : null, disabled : false};

    break;
              default: return { ...state};
              }
                  }
