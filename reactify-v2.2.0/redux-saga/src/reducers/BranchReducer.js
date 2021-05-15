// action types
import {
OPEN_ADD_NEW_BRANCH_MODEL,
OPEN_ADD_NEW_BRANCH_MODEL_SUCCESS,
CLOSE_ADD_NEW_BRANCH_MODEL,

GET_BRANCHES,
GET_BRANCHES_SUCCESS,

SAVE_BRANCH,
SAVE_BRANCH_SUCCESS,

DELETE_BRANCH,

OPEN_VIEW_BRANCH_MODEL,
OPEN_VIEW_BRANCH_MODEL_SUCCESS,
CLOSE_VIEW_BRANCH_MODEL,

OPEN_EDIT_BRANCH_MODEL,
OPEN_EDIT_BRANCH_MODEL_SUCCESS,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER

} from 'Actions/types';
const INIT_STATE = {
      branches: null, // initial service data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewBranchModal : false,
      selectedBranch: null,
      selectedSchedule:null,
      viewBranchDialog:false,
      employeeList:null,
      editbranch : null,
      editMode : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1
      },
      loadingScroll : false,
      branchid : null,
  };
  export default (state = INIT_STATE, action) => {

      switch (action.type) {

        // get branches
        case GET_BRANCHES:
        let tableInfo = state.tableInfo;
          if(action.payload)
          {
            tableInfo.pageIndex  = action.payload.state.page;
            tableInfo.pageSize  = action.payload.state.pageSize;
            tableInfo.sorted  = action.payload.state.sorted;
            tableInfo.filtered = action.payload.state.filtered;
          }
            return { ...state, tableInfo : tableInfo};
        // get branches success
        case GET_BRANCHES_SUCCESS:

          return { ...state,branches : action.payload.data,tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
        case OPEN_ADD_NEW_BRANCH_MODEL :
                     return { ...state, addNewBranchModal : true,editMode : false , editbranch : null};
        case OPEN_ADD_NEW_BRANCH_MODEL_SUCCESS:
                     return { ...state,addNewBranchModal : true, loading : false,employeeList:action.payload.employeeList,editMode : false ,
                        editbranch : null};
         case CLOSE_ADD_NEW_BRANCH_MODEL:
                     return { ...state, addNewBranchModal : false ,editMode : false , editbranch : null };
         case SAVE_BRANCH:
                      return { ...state,dialogLoading : true, disabled : true};
        case SAVE_BRANCH_SUCCESS:
                       return { ...state,addNewBranchModal : false,dialogLoading : false,editMode : false , editbranch : null,disabled : false};
         case OPEN_VIEW_BRANCH_MODEL:
                       return { ...state, viewBranchDialog : true , selectedSchedule : null,selectedBranch :null};

         case OPEN_VIEW_BRANCH_MODEL_SUCCESS :
                     let selectedBranch = action.payload.data[0];
                     if(selectedBranch)
                     {
                       selectedBranch.timing = selectedBranch.timing ? JSON.parse(selectedBranch.timing) :  [];
                       selectedBranch.shifttiming = selectedBranch.shifttiming && JSON.parse(selectedBranch.shifttiming);
                     }
                      return { ...state,selectedBranch:selectedBranch,selectedSchedule:action.payload.selectedSchedule};
        case CLOSE_VIEW_BRANCH_MODEL:
                      return { ...state, viewBranchDialog : false, selectedSchedule : null,selectedBranch :null};
        case OPEN_EDIT_BRANCH_MODEL:
                    return { ...state, addNewBranchModal : true, editMode : true, editbranch: null };

        case OPEN_EDIT_BRANCH_MODEL_SUCCESS:
                let editbranch = action.payload.data[0];
                if(editbranch)
                {
                  editbranch.timing = editbranch.timing ? JSON.parse(editbranch.timing) :  [];
                  editbranch.shifttiming = editbranch.shifttiming && JSON.parse(editbranch.shifttiming);
                }
              return { ...state,addNewBranchModal : true,employeeList:action.payload.employeeList,editbranch:editbranch};

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
