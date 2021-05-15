
// action types
import {
  OPEN_ADD_NEW_ROLE_MODEL,
  OPEN_ADD_NEW_ROLE_MODEL_SUCCESS,
  CLOSE_ADD_NEW_ROLE_MODEL,

  SAVE_ROLE,
  SAVE_ROLE_SUCCESS,

  GET_ROLES,
  GET_ROLES_SUCCESS,

OPEN_EDIT_ROLE_MODEL,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      role: null, // initial member data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewRoleModal : false,
      roleList:null,
      editrole : null,
      editMode : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
};

    export default (state = INIT_STATE, action) => {
        switch (action.type) {
          // get enquiries
                case OPEN_ADD_NEW_ROLE_MODEL :
                       return { ...state, addNewRoleModal : true,editMode : false , editrole : null};
          case OPEN_ADD_NEW_ROLE_MODEL_SUCCESS:

                       return { ...state,roleList:action.payload.roleList,
                         addNewRoleModal : true, loading : false };
           case CLOSE_ADD_NEW_ROLE_MODEL:
                       return { ...state, addNewRoleModal : false, editMode : false , editrole : null   };
          case SAVE_ROLE:
                       return { ...state,  dialogLoading : true, disabled : true };
          case SAVE_ROLE_SUCCESS:
                       return { ...state, dialogLoading : false,addNewRoleModal : false ,  editMode : false, editrole : null, disabled : false};
          case GET_ROLES:

                   let tableInfo = state.tableInfo;
                   if(action.payload)
                   {
                     tableInfo.pageIndex  = action.payload.state.page;
                     tableInfo.pageSize  = action.payload.state.pageSize;
                     tableInfo.sorted  = action.payload.state.sorted;
                     tableInfo.filtered = action.payload.state.filtered;
                     }
                  return { ...state , tableInfo : tableInfo};
         case GET_ROLES_SUCCESS:

                            return { ...state, role: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };
          case OPEN_EDIT_ROLE_MODEL:
                               return { ...state, addNewRoleModal : true, editMode : true, editrole: action.payload };
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
