
// action types
import {
  SAVE_EMPLOYEEATTENDANCE,
  SAVE_EMPLOYEEATTENDANCE_SUCCESS,
  GET_EMPLOYEEATTENDANCE_LIST,
  GET_EMPLOYEEATTENDANCE_LIST_SUCCESS,
  DELETE_EMPLOYEE_LAST_ATTENDANCE,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
  loading : false,
  disabled : false,
  dialogLoading : false,
  lastattendence : null,
  attendencelist : null,
  attendencesaved : false,
  tableInfo : {
    pageSize : 5,
    pageIndex : 0,
    pages : 1,
    totalrecord :0,
  },
};
export default (state = INIT_STATE, action) => {

    switch (action.type) {
      case SAVE_EMPLOYEEATTENDANCE:
          return { ...state,loading : true ,attendencesaved : false};
      case SAVE_EMPLOYEEATTENDANCE_SUCCESS:

          return { ...state, dialogLoading : false , lastattendence : action.payload.data[0],loading : false,attendencesaved : true};
      case GET_EMPLOYEEATTENDANCE_LIST:
          let tableInfo = state.tableInfo;
            if(action.payload)
            {
              if(action.payload.state)
              {
                  tableInfo.pageIndex  = action.payload.state.page;
                  tableInfo.pageSize  = action.payload.state.pageSize;
                  tableInfo.sorted  = action.payload.state.sorted;
                  tableInfo.filtered = action.payload.state.filtered;
                  tableInfo.startDate = action.payload.state.startDate;
                  tableInfo.endDate = action.payload.state.endDate;
               }
               else{
                 tableInfo.startDate = action.payload.startDate;
                 tableInfo.endDate = action.payload.endDate;
               }
            }
          return { ...state , tableInfo : tableInfo,attendencesaved : false};

      case GET_EMPLOYEEATTENDANCE_LIST_SUCCESS:
            return { ...state, attendencelist: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

      case DELETE_EMPLOYEE_LAST_ATTENDANCE:
             return { ...state, lastattendence : null};

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
