/**
 * EmployeeManagement Reducer
 */
// action types
import {
    GET_EMPLOYEES,
    GET_EMPLOYEES_SUCCESS,
    OPEN_ADD_NEW_EMPLOYEE_MODEL,
    OPEN_ADD_NEW_EMPLOYEE_MODEL_SUCCESS,
    CLOSE_ADD_NEW_EMPLOYEE_MODEL,
    OPEN_EDIT_EMPLOYEE_MODEL,
    OPEN_EDIT_EMPLOYEE_MODEL_SUCCESS,
    OPEN_VIEW_EMPLOYEE_MODEL,
    OPEN_VIEW_EMPLOYEE_MODEL_SUCCESS,
    CLOSE_VIEW_EMPLOYEE_MODEL,
    DELETE_EMPLOYEE,
    SAVE_EMPLOYEE,
    SAVE_EMPLOYEES_SUCCESS,
    SET_EMPLOYEE_DEFAULT_BRANCH,
    SET_EMPLOYEE_DEFAULT_BRANCH_SUCCESS,

    OPEN_STARTER_VIEW_EMPLOYEE_MODEL,
    OPEN_STARTER_VIEW_EMPLOYEE_MODEL_SUCCESS,
    CLOSE_STARTER_VIEW_EMPLOYEE_MODEL,

    SAVE_TERMSCONDITION,
    SAVE_TERMSCONDITION_SUCCESS,

    REQUEST_SUCCESS,
    REQUEST_FAILURE,
    ON_SHOW_LOADER,
    ON_HIDE_LOADER
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		employees: null, // initial employee data
      disabled : false,
      loading : false,
      dialogLoading : false,
      addNewEmployeeModal : false,
      viewEmployeeDialog:false,
      selectedemployee: null,
      selectedstarteremployee: null,
      editemployee : null,
      editMode : false,
      rolelist : null,
      zonelist : null,
      branchlist : null,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      totalpayment : 0,
      paidsalaryoflastmonth : 0,
      headerloading : false,
      timezonelist : null,
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

      // get employees
        case GET_EMPLOYEES:
            let tableInfo = state.tableInfo;
              if(action.payload)
              {
                tableInfo.pageIndex  = action.payload.state.page;
                tableInfo.pageSize  = action.payload.state.pageSize;
                tableInfo.sorted  = action.payload.state.sorted;
                tableInfo.filtered = action.payload.state.filtered;
              }
            return { ...state , tableInfo : tableInfo};
        // get employees success
        case GET_EMPLOYEES_SUCCESS:
         let employees =  action.payload.data;

         employees.forEach(x => x.specialization = x.specialization ? JSON.parse(x.specialization) : []);

            return { ...state, employees: action.payload.data,tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}  };


        case OPEN_ADD_NEW_EMPLOYEE_MODEL :
            return { ...state, addNewEmployeeModal : true, editMode : false , editemployee : null };
        case OPEN_ADD_NEW_EMPLOYEE_MODEL_SUCCESS:
                         return { ...state,rolelist:action.payload.rolelist,
                           addNewEmployeeModal : true, loading : false,zonelist : action.payload.zonelist,
                           branchlist : action.payload.branchlist,timezonelist : action.payload.timezonelist  };

        case CLOSE_ADD_NEW_EMPLOYEE_MODEL :
            return { ...state, addNewEmployeeModal : false , editMode : false , editemployee : null };

        case OPEN_EDIT_EMPLOYEE_MODEL:
                return { ...state, addNewEmployeeModal : true, editMode : true, editemployee: null };
        case OPEN_EDIT_EMPLOYEE_MODEL_SUCCESS:
         let editemployee = action.payload.data[0];
         editemployee.schedule = editemployee.schedule ? JSON.parse(editemployee.schedule) : null;
         editemployee.shifttiming = editemployee.shifttiming ? JSON.parse(editemployee.shifttiming) : null;

            return { ...state , editemployee : editemployee,rolelist:action.payload.rolelist,
              zonelist : action.payload.zonelist,branchlist : action.payload.branchlist,
              timezonelist : action.payload.timezonelist };

        case CLOSE_VIEW_EMPLOYEE_MODEL:
            return { ...state , selectedemployee : null};
        case OPEN_VIEW_EMPLOYEE_MODEL:
                return { ...state,  selectedemployee : null,loading : true};
        case OPEN_VIEW_EMPLOYEE_MODEL_SUCCESS:
        let selectedemployee =  action.payload.data[0][0];
        let paidsalaryoflastmonth = action.payload.data[1][0].paidsalaryoflastmonth;
        selectedemployee.specialization = selectedemployee.specialization ? JSON.parse(selectedemployee.specialization) : [];
        if(paidsalaryoflastmonth > 0 && selectedemployee.salary > 0){
          selectedemployee.payablesalary = selectedemployee.salary - paidsalaryoflastmonth ;
          selectedemployee.payablesalary = selectedemployee.payablesalary > 0 ? selectedemployee.payablesalary : 0;
        }
        else{
          selectedemployee.payablesalary = selectedemployee.salary;
          selectedemployee.schedule = selectedemployee.schedule ? JSON.parse(selectedemployee.schedule) : null;
          selectedemployee.shifttiming = selectedemployee.shifttiming ? JSON.parse(selectedemployee.shifttiming) : null;

        }
                return { ...state, selectedemployee:selectedemployee,totalpayment : action.payload.data[1][0].totalpayment,paidsalaryoflastmonth:paidsalaryoflastmonth ,loading : false};

        case SAVE_EMPLOYEE:
            return { ...state, dialogLoading : true, disabled : true };
     // save employees success
         case SAVE_EMPLOYEES_SUCCESS:
            return { ...state,addNewEmployeeModal : false, dialogLoading : false, editMode : false, editemployee : null, disabled : false};

         case SET_EMPLOYEE_DEFAULT_BRANCH :
            return { ...state, headerloading : true };
         case SET_EMPLOYEE_DEFAULT_BRANCH_SUCCESS:
            return { ...state,headerloading : false };


        case CLOSE_STARTER_VIEW_EMPLOYEE_MODEL:
            return { ...state , selectedstarteremployee : null,viewEmployeeDialog : false};
        case OPEN_STARTER_VIEW_EMPLOYEE_MODEL:
                return { ...state,  selectedstarteremployee : null,viewEmployeeDialog : false};
        case OPEN_STARTER_VIEW_EMPLOYEE_MODEL_SUCCESS:
        let selectedstarteremployee =  action.payload.data[0][0];
        let paidsalaryoflastmonthstarter = action.payload.data[1][0].paidsalaryoflastmonth;
        if(paidsalaryoflastmonthstarter > 0 && selectedstarteremployee.salary > 0){
          selectedstarteremployee.payablesalary = selectedstarteremployee.salary - paidsalaryoflastmonthstarter ;
          selectedstarteremployee.payablesalary = selectedstarteremployee.payablesalary > 0 ? selectedstarteremployee.payablesalary : 0;
        }
        else{
          selectedstarteremployee.payablesalary = selectedstarteremployee.salary;
        }
                return { ...state, selectedstarteremployee:selectedstarteremployee,viewEmployeeDialog : true};

         case SAVE_TERMSCONDITION:
            return { ...state, dialogLoading : true, disabled : true };

         case SAVE_TERMSCONDITION_SUCCESS:
                  return { ...state,dialogLoading : false, disabled : false};


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
