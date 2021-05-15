// action types
import {
  OPEN_ADD_NEW_ZONE_MODEL,
  OPEN_ADD_NEW_ZONE_MODEL_SUCCESS,
  CLOSE_ADD_NEW_ZONE_MODEL,

  GET_ZONES,
  GET_ZONES_SUCCESS,

  SAVE_ZONE,
  SAVE_ZONE_SUCCESS,

  OPEN_VIEW_ZONE_MODEL,
  OPEN_VIEW_ZONE_MODEL_SUCCESS,
  CLOSE_VIEW_ZONE_MODEL,

  OPEN_EDIT_ZONE_MODEL,
  OPEN_EDIT_ZONE_MODEL_SUCCESS,

   DELETE_ZONE,

    REQUEST_SUCCESS,
    REQUEST_FAILURE,
    ON_SHOW_LOADER,
    ON_HIDE_LOADER

} from 'Actions/types';

const INIT_STATE = {
      zones: null, // initial service data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewZoneModal : false,
      viewZoneDialog:false,
      selectedZone: null,
      editzone : null,
      editMode : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      branchList : [],
  };
  export default (state = INIT_STATE, action) => {

      switch (action.type) {

        // get zones
        case GET_ZONES:
        let tableInfo = state.tableInfo;
          if(action.payload)
          {
            tableInfo.pageIndex  = action.payload.state.page;
            tableInfo.pageSize  = action.payload.state.pageSize;
            tableInfo.sorted  = action.payload.state.sorted;
            tableInfo.filtered = action.payload.state.filtered;
          }
            return { ...state ,tableInfo : tableInfo};
        // get service success
        case GET_ZONES_SUCCESS:

            return { ...state, zones: action.payload.data, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
        case OPEN_ADD_NEW_ZONE_MODEL :
                     return { ...state, addNewZoneModal : false , editMode : false , editzone : null};
        case OPEN_ADD_NEW_ZONE_MODEL_SUCCESS:
                     return { ...state,branchList:action.payload.branchList,addNewZoneModal : true, loading : false  ,editMode : false , editzone : null};
         case CLOSE_ADD_NEW_ZONE_MODEL:
                     return { ...state, addNewZoneModal : false , editMode : false , editzone : null};
        case SAVE_ZONE:
                   return { ...state,dialogLoading : true, disabled : true};
        case SAVE_ZONE_SUCCESS:
                    return { ...state,addNewZoneModal : false,dialogLoading : false,editMode : false , editzone : null ,disabled : false};
        case OPEN_VIEW_ZONE_MODEL_SUCCESS:
                    return { ...state,selectedZone:action.payload.data[0],viewZoneDialog : true};
        case CLOSE_VIEW_ZONE_MODEL:
                    return { ...state, viewZoneDialog : false ,selectedZone : null };
        case OPEN_EDIT_ZONE_MODEL:
                    return { ...state, addNewZoneModal : true, editMode : true, editzone: null };
        case OPEN_EDIT_ZONE_MODEL_SUCCESS :
                      return { ...state, addNewZoneModal: true,editzone:action.payload.data[0],branchList:action.payload.branchList };

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
