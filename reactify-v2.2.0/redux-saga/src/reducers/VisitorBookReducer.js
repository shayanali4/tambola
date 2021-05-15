/**
 * EmployeeManagement Reducer
 */
 import update from 'react-addons-update';

// action types
import {
  OPEN_ADD_NEW_VISITOR_MODEL,
  OPEN_ADD_NEW_VISITOR_MODEL_SUCCESS,
  CLOSE_ADD_NEW_VISITOR_MODEL,
  SAVE_VISITOR,
  SAVE_VISITOR_SUCCESS,
  GET_VISITORS,
  GET_VISITORS_SUCCESS,
  OPEN_VIEW_VISITOR_MODEL,
  OPEN_VIEW_VISITOR_MODEL_SUCCESS,
  CLOSE_VIEW_VISITOR_MODEL,
  BOOK_GYM_ACCESSSLOT_MEMBER_VISITOR,
  BOOK_GYM_ACCESSSLOT_MEMBER_VISITOR_SUCCESS,
  GET_MEMBER_GYM_ACCESSSLOT,
  GET_MEMBER_GYM_ACCESSSLOT_SUCCESS,
  OPEN_EDIT_VISITOR_MODEL,
  OPEN_EDIT_VISITOR_MODEL_SUCCESS,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		 visitor: null, // initial member data
       loading : false,
       disabled : false,
       dialogLoading : false,
       addNewVisitorModal : false,
       viewVisitorDialog:false,
       selectedVisitor: null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      employeeList : null,
      isslotbooked : 0,
      gymaccessslotlistdetails : null,
      editvisitor : null,
      editMode : false,
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

          case REQUEST_FAILURE:
            return { ...state ,  dialogLoading : false, disabled : false,loading : false};

          case REQUEST_SUCCESS:
            return { ...state};

          case ON_SHOW_LOADER:
            return { ...state, loading: true };

          case ON_HIDE_LOADER:
            return { ...state, loading : false };

          case OPEN_ADD_NEW_VISITOR_MODEL :
            return { ...state, addNewVisitorModal : true ,editMode : false ,editvisitor : null};

          case OPEN_ADD_NEW_VISITOR_MODEL_SUCCESS:
            return { ...state, addNewVisitorModal : true,employeeList : action.payload.employeeList,editMode : false ,editvisitor : null};

          case CLOSE_ADD_NEW_VISITOR_MODEL:
            return { ...state, addNewVisitorModal : false ,editMode : false ,editvisitor : null};

          case SAVE_VISITOR:
            return { ...state,  dialogLoading : true, disabled : true };

          case SAVE_VISITOR_SUCCESS:
                return { ...state, dialogLoading : false,addNewVisitorModal : false , disabled : false,isslotbooked : 0, editMode : false, editvisitor : null};

          case GET_VISITORS:
              let tableInfo = state.tableInfo;
                if(action.payload)
                {
                  tableInfo.pageIndex  = action.payload.state.page;
                  tableInfo.pageSize  = action.payload.state.pageSize;
                  tableInfo.sorted  = action.payload.state.sorted;
                  tableInfo.filtered = action.payload.state.filtered;
                }
            return { ...state , tableInfo : tableInfo};

          case GET_VISITORS_SUCCESS:
              let visitor = action.payload.data;
               return { ...state, visitor: visitor , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

          case CLOSE_VIEW_VISITOR_MODEL:
              return { ...state, viewVisitorDialog : false , selectedVisitor : null};

          case OPEN_VIEW_VISITOR_MODEL:
              return { ...state, viewVisitorDialog : true , selectedVisitor : null};

          case OPEN_VIEW_VISITOR_MODEL_SUCCESS:
               let selectedVisitor = action.payload.data[0];
                return { ...state, selectedVisitor:selectedVisitor };

          case BOOK_GYM_ACCESSSLOT_MEMBER_VISITOR:
                  return { ...state,disabled : true,loading : true};

           case BOOK_GYM_ACCESSSLOT_MEMBER_VISITOR_SUCCESS:
                 return { ...state,isslotbooked : 1,disabled : false,loading : false};

           case GET_MEMBER_GYM_ACCESSSLOT:
                     return { ...state, gymaccessslotlistdetails: null , loading : true , isslotbooked : 0};

           case GET_MEMBER_GYM_ACCESSSLOT_SUCCESS:
                     return { ...state, gymaccessslotlistdetails:action.payload.data[0] , loading : false};

           case OPEN_EDIT_VISITOR_MODEL:
              return { ...state, addNewVisitorModal : true, editMode : true, editvisitor: null };

           case OPEN_EDIT_VISITOR_MODEL_SUCCESS:
               let editvisitor = action.payload.data[0];
              return { ...state , editvisitor : editvisitor,employeeList : action.payload.employeeList };


        default: return { ...state};
    }
}
