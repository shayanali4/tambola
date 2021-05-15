import Status from 'Assets/data/status';
// action types
import {
  GET_CLASSES,
  GET_CLASSES_SUCCESS,
  OPEN_ADD_NEW_CLASS_MODEL,
  OPEN_ADD_NEW_CLASS_MODEL_SUCCESS,
  CLOSE_ADD_NEW_CLASS_MODEL,
  OPEN_EDIT_CLASS_MODEL,
  OPEN_EDIT_CLASS_MODEL_SUCCESS,
  OPEN_VIEW_CLASS_MODEL,
  OPEN_VIEW_CLASS_MODEL_SUCCESS,
  CLOSE_VIEW_CLASS_MODEL,
  SAVE_CLASS,
  SAVE_CLASS_SUCCESS,
  DELETE_CLASS,

  GET_CLASS_BOOKED_AND_INTERESTED_LIST,
  GET_CLASS_BOOKED_AND_INTERESTED_LIST_SUCCESS,

  STAFF_SAVE_MEMBER_CLASS_BOOKING,
  STAFF_SAVE_MEMBER_CLASS_BOOKING_SUCCESS,

  SAVE_CLASS_ONLINEACCESSURL,
  SAVE_CLASS_ONLINEACCESSURL_SUCCESS,
  OPEN_ADD_CLASS_ONLINEACCESSURL_MODEL,
  CLOSE_ADD_CLASS_ONLINEACCESSURL_MODEL,

  CLASS_CANCEL,
  CLASS_CANCEL_SUCCESS,

  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
  } from 'Actions/types';

  const INIT_STATE = {
    classes: null, // initial class data
    loading : false,
    disabled : false,
    dialogLoading : false,
    addNewClassModal : false,
    selectedClass: null,
    viewClassDialog:false,
    editClass : null,
    editMode : false,
    employeeList:null,
    tableInfo : {
      pageSize : 10,
      pageIndex : 0,
      pages : 1,
      totalrecord :0,
    },


    tableInfoBookedAndInterested : {
      pageSize : 10,
      pageIndex : 0,
      pages : 1,
      totalrecord :0,
    },
    classbookedAndInterestedList : null,
    opnClassOnlineAccessUrlModal : false,
    dataToOnlineAccessUrl : null,
    onlineAccessUrlSaveSuccess : false,
    classCancelSuccess : false,

};
  export default (state = INIT_STATE, action) => {

      switch (action.type) {
        case GET_CLASSES:
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
        case GET_CLASSES_SUCCESS:
                  return { ...state, classes: action.payload.data ,tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

        case OPEN_ADD_NEW_CLASS_MODEL :
                           return { ...state, addNewClassModal : true,editMode : false,editClass :null};
        case OPEN_ADD_NEW_CLASS_MODEL_SUCCESS:
                            return { ...state,employeeList:action.payload.employeeList ? action.payload.employeeList : state.employeeList,
                          addNewClassModal : true, loading : false };
       case CLOSE_ADD_NEW_CLASS_MODEL:
                           return { ...state, addNewClassModal : false,editMode : false,editClass :null};
      case SAVE_CLASS:
                            return { ...state, dialogLoading : true, disabled : true,editClass :null};
      case SAVE_CLASS_SUCCESS:
                           return { ...state, dialogLoading : false,addNewClassModal : false,selectedClass :null, disabled : false};
      case OPEN_EDIT_CLASS_MODEL:
                           return { ...state, addNewClassModal : true, editMode : true, editClass: null,  dialogLoading : true };
      case OPEN_EDIT_CLASS_MODEL_SUCCESS:

                          let editClass = action.payload.data[0];
                          if(editClass)
                          {
                            editClass.schedule = JSON.parse(editClass.schedule)
                          }
                           return { ...state,employeeList:action.payload.employeeList ? action.payload.employeeList : state.employeeList,
                             editClass:editClass , dialogLoading : false};
     case OPEN_VIEW_CLASS_MODEL :
                          return { ...state,selectedClass : null, viewClassDialog:true};

     case OPEN_VIEW_CLASS_MODEL_SUCCESS :

                           let selectedClass = action.payload.data[0];
                           if(selectedClass)
                           {
                              selectedClass.schedule = JSON.parse(selectedClass.schedule)
                           }
                           return { ...state,selectedClass: selectedClass};
     case CLOSE_VIEW_CLASS_MODEL:
                            return { ...state, viewClassDialog : false };

           case GET_CLASS_BOOKED_AND_INTERESTED_LIST:
           let tableInfoBookedAndInterested = state.tableInfoBookedAndInterested;
             if(action.payload)
             {
                 if(action.payload.state)
                 {
                   tableInfoBookedAndInterested.pageIndex  = action.payload.state.page;
                   tableInfoBookedAndInterested.pageSize  = action.payload.state.pageSize;
                   tableInfoBookedAndInterested.sorted  = action.payload.state.sorted;
                   tableInfoBookedAndInterested.filtered = action.payload.state.filtered;
                   tableInfoBookedAndInterested.classid  = action.payload.state.classid;
                   tableInfoBookedAndInterested.classdate  = action.payload.state.classdate;
                 }
                 else if(action.payload.classid) {
                     tableInfoBookedAndInterested.classid = action.payload.classid;
                 }
                 else if(action.payload.date) {
                     tableInfoBookedAndInterested.classdate = action.payload.classdate;
                 }

               }
              return { ...state, classbookedAndInterestedList : null, tableInfoBookedAndInterested : tableInfoBookedAndInterested};

           case GET_CLASS_BOOKED_AND_INTERESTED_LIST_SUCCESS:

              return { ...state, classbookedAndInterestedList:action.payload.data, tableInfoBookedAndInterested : {...state.tableInfoBookedAndInterested , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};

          case STAFF_SAVE_MEMBER_CLASS_BOOKING:
                   return { ...state,  dialogLoading : true, disabled : true };
          case STAFF_SAVE_MEMBER_CLASS_BOOKING_SUCCESS:
                    return { ...state, dialogLoading : false, disabled : false};

          case SAVE_CLASS_ONLINEACCESSURL:
                    return { ...state,  dialogLoading : true, disabled : true , onlineAccessUrlSaveSuccess : false};

          case SAVE_CLASS_ONLINEACCESSURL_SUCCESS:
                    return { ...state, dialogLoading : false,editMode : false, disabled : false,opnClassOnlineAccessUrlModal : false,dataToOnlineAccessUrl : null,onlineAccessUrlSaveSuccess : true};

          case OPEN_ADD_CLASS_ONLINEACCESSURL_MODEL :
                    return { ...state, opnClassOnlineAccessUrlModal : true,editMode : false,editClass :null,dataToOnlineAccessUrl : action.payload,onlineAccessUrlSaveSuccess : false};

          case CLOSE_ADD_CLASS_ONLINEACCESSURL_MODEL:
                    return { ...state, opnClassOnlineAccessUrlModal : false,editMode : false,editClass :null,dataToOnlineAccessUrl : null,onlineAccessUrlSaveSuccess : false};

          case CLASS_CANCEL:
                    return { ...state, dialogLoading : true, disabled : true,classCancelSuccess : false};
          case CLASS_CANCEL_SUCCESS:
                    return { ...state, dialogLoading : false,classCancelSuccess : true, disabled : false};


      case REQUEST_FAILURE:
              return { ...state , loading : false, dialogLoading : false, disabled : false,onlineAccessUrlSaveSuccess : false,classCancelSuccess : false};
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
