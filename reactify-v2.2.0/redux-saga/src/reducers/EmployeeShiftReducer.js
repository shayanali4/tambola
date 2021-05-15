// action types
import {
SAVE_SHIFT_CONFIGURATION,
SAVE_SHIFT_CONFIGURATION_SUCCESS,
OPEN_ADD_NEW_SHIFT_MODEL,
CLOSE_ADD_NEW_SHIFT_MODEL,
GET_SHIFT,
GET_SHIFT_SUCCESS,
OPEN_EDIT_SHIFT_MODEL,
OPEN_EDIT_SHIFT_MODEL_SUCCESS,
DELETE_SHIFT,

OPEN_ADD_NEW_ASSIGNSHIFT_MODEL,
OPEN_ADD_NEW_ASSIGNSHIFT_MODEL_SUCCESS,
CLOSE_ADD_NEW_ASSIGNSHIFT_MODEL,
GET_ASSIGNSHIFT,
GET_ASSIGNSHIFT_SUCCESS,
OPEN_EDIT_ASSIGNSHIFT_MODEL,
OPEN_EDIT_ASSIGNSHIFT_MODEL_SUCCESS,
DELETE_ASSIGNSHIFT,
SAVE_ASSIGNSHIFT,
SAVE_ASSIGNSHIFT_SUCCESS,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER

} from 'Actions/types';
const INIT_STATE = {
      shifts: null, // initial member data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewShiftModal : false,
      tableInfo : {
       pageSize : 10,
       pageIndex : 0,
       pages : 1,
       totalrecord :0,
     },
     editMode :  false,
     editshift : null,


     addNewAssignShiftModal : false,
     editassignshift : null,
     employeeList : null,
     shiftList : null,
     assignShifTableInfo : {
      pageSize : 10,
      pageIndex : 0,
      pages : 1,
      totalrecord :0,
    },
     assignshift : null,

  };
  export default (state = INIT_STATE, action) => {

      switch (action.type) {

       case OPEN_ADD_NEW_SHIFT_MODEL :
           return { ...state, addNewShiftModal : true,editMode : false,editshift : null};
       case CLOSE_ADD_NEW_SHIFT_MODEL:
           return { ...state, addNewShiftModal : false,editMode : false,editshift : null};
       case SAVE_SHIFT_CONFIGURATION:
           return { ...state,  dialogLoading : true, disabled : true };
       case SAVE_SHIFT_CONFIGURATION_SUCCESS:
           return { ...state, dialogLoading : false,addNewShiftModal : false , disabled : false,editMode : false,editshift : null};

       case GET_SHIFT:
           let tableInfo = state.tableInfo;
           if(action.payload)
           {
             tableInfo.pageIndex  = action.payload.state.page;
             tableInfo.pageSize  = action.payload.state.pageSize;
             tableInfo.sorted  = action.payload.state.sorted;
             tableInfo.filtered = action.payload.state.filtered;
           }

         return { ...state , tableInfo : tableInfo};

       case GET_SHIFT_SUCCESS:
            return { ...state, shifts: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

       case OPEN_EDIT_SHIFT_MODEL:
              return { ...state, addNewShiftModal : true, editMode : true, editshift: null };

       case OPEN_EDIT_SHIFT_MODEL_SUCCESS:
            return { ...state ,  editshift:action.payload.data[0]};


      case OPEN_ADD_NEW_ASSIGNSHIFT_MODEL :
          return { ...state, addNewAssignShiftModal : true,editMode : false,editassignshift:null,dialogLoading : true};
      case OPEN_ADD_NEW_ASSIGNSHIFT_MODEL_SUCCESS :
          return { ...state,dialogLoading : false,employeeList : action.payload.employeeList ? action.payload.employeeList : state.employeeList,
          shiftList : action.payload.shiftList ? action.payload.shiftList : state.shiftList};
      case CLOSE_ADD_NEW_ASSIGNSHIFT_MODEL:
          return { ...state, addNewAssignShiftModal : false,editMode : false,editassignshift:null};
      case OPEN_EDIT_ASSIGNSHIFT_MODEL:
            return { ...state, addNewAssignShiftModal : true, editMode : true,editassignshift:null };
      case OPEN_EDIT_ASSIGNSHIFT_MODEL_SUCCESS:
            return { ...state ,  editassignshift:action.payload.data ,employeeList : action.payload.employeeList ? action.payload.employeeList : state.employeeList,
            shiftList : action.payload.shiftList ? action.payload.shiftList : state.shiftList };
      case SAVE_ASSIGNSHIFT:
          return { ...state,  dialogLoading : true, disabled : true };
      case SAVE_ASSIGNSHIFT_SUCCESS:

          return { ...state, dialogLoading : false,addNewAssignShiftModal : false , disabled : false ,editMode : false,editassignshift:null};
      case GET_ASSIGNSHIFT:

          let assignShifTableInfo = state.assignShifTableInfo;
            if(action.payload)
            {
              assignShifTableInfo.pageIndex  = action.payload.state.page;
              assignShifTableInfo.pageSize  = action.payload.state.pageSize;
              assignShifTableInfo.sorted  = action.payload.state.sorted;
              assignShifTableInfo.filtered = action.payload.state.filtered;
            }
        return { ...state , assignShifTableInfo : assignShifTableInfo};
        case GET_ASSIGNSHIFT_SUCCESS:

           return { ...state, assignshift: action.payload.data , assignShifTableInfo : {...state.assignShifTableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} ,
           employeeList : action.payload.employeeList ? action.payload.employeeList : state.employeeList};


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
