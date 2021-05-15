/**
 * expense Reducer
 */

import ExpensePaymentMode from 'Assets/data/expensepaymentmode';
// action types
import {
  OPEN_ADD_NEW_EXPENSE_MODEL,
  OPEN_ADD_NEW_EXPENSE_MODEL_SUCCESS,
  CLOSE_ADD_NEW_EXPENSE_MODEL,
  SAVE_EXPENSE,
  SAVE_EXPENSE_SUCCESS,
  GET_EXPENSE,
  GET_EXPENSE_SUCCESS,
  OPEN_VIEW_EXPENSE_MODEL,
  OPEN_VIEW_EXPENSE_MODEL_SUCCESS,
  OPEN_EDIT_EXPENSE_MODEL,
  OPEN_EDIT_EXPENSE_MODEL_SUCCESS,
  CLOSE_VIEW_EXPENSE_MODEL,

  OPEN_CLAIM_EXPENSE_MODEL,
  OPEN_CLAIM_EXPENSE_MODEL_SUCCESS,
  CLOSE_CLAIM_EXPENSE_MODEL,
  SAVE_CLAIM_EXPENSE,
  SAVE_CLAIM_EXPENSE_SUCCESS,

  IMPORT_EXPENSE,
  IMPORT_EXPENSE_SUCCESS,
  IMPORT_EXPENSE_LIST,
  IMPORT_EXPENSE_LIST_SUCCESS,

  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		 expense: null, // initial member data
       loading : false,
       disabled : false,
       dialogLoading : false,
       addNewExpenseModal : false,
       editexpense:null,
       editMode : false,
       viewExpenseDialog:false,
       selectedexpense: null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },

      importloading:false,
      importfilelist : null,
      tableInfoImport : {
        pageSize : 5,
        pageIndex : 0,
        pages : 1,
      },

      opnClaimExpenseDialog : false,
      selectedclaimexpense: null,
      employeeList : null,
      addExpense : null,
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

          case REQUEST_FAILURE:
          return { ...state ,  dialogLoading : false, disabled : false,importloading : false};

          case REQUEST_SUCCESS:
          return { ...state};

        case ON_SHOW_LOADER:
            return { ...state, loading: true };

        case ON_HIDE_LOADER:
            return { ...state, loading : false };

        case OPEN_ADD_NEW_EXPENSE_MODEL :
            return { ...state, addNewExpenseModal : true,editMode : false,editexpense:null,dialogLoading : true,addExpense : action.payload};
        case OPEN_ADD_NEW_EXPENSE_MODEL_SUCCESS :
            return { ...state,dialogLoading : false,employeeList : action.payload.employeeList ? action.payload.employeeList : state.employeeList};
        case CLOSE_ADD_NEW_EXPENSE_MODEL:
            return { ...state, addNewExpenseModal : false,editMode : false,editexpense:null,addExpense : null};
        case OPEN_EDIT_EXPENSE_MODEL:
              return { ...state, addNewExpenseModal : true, editMode : true,editexpense:null };
       case OPEN_EDIT_EXPENSE_MODEL_SUCCESS:
              return { ...state ,  editexpense:action.payload.data[0] , employeeList : action.payload.employeeList ? action.payload.employeeList : state.employeeList };
        case SAVE_EXPENSE:
            return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_EXPENSE_SUCCESS:

            return { ...state, dialogLoading : false,addNewExpenseModal : false , disabled : false ,editMode : false,editexpense:null,addExpense : null};
        case GET_EXPENSE:

            let tableInfo = state.tableInfo;
              if(action.payload)
              {
                tableInfo.pageIndex  = action.payload.state.page;
                tableInfo.pageSize  = action.payload.state.pageSize;
                tableInfo.sorted  = action.payload.state.sorted;
                tableInfo.filtered = action.payload.state.filtered;
              }
          return { ...state , tableInfo : tableInfo};
          case GET_EXPENSE_SUCCESS:

             return { ...state, expense: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} ,
             employeeList : action.payload.employeeList ? action.payload.employeeList : state.employeeList};

          case CLOSE_VIEW_EXPENSE_MODEL:
             return { ...state, viewExpenseDialog : false , selectedexpense : null};
          case OPEN_VIEW_EXPENSE_MODEL:
             return { ...state, viewExpenseDialog : true , selectedexpense : null};
          case OPEN_VIEW_EXPENSE_MODEL_SUCCESS:
          let selectedexpense = action.payload.data[0];
          // if(selectedexpense){
          //   selectedexpense.paymentmode =  selectedexpense.paymentmode ? ExpensePaymentMode.filter(value => value.name == selectedexpense.paymentmode)[0] : '';
          // }

             return { ...state, selectedexpense:selectedexpense};



           case OPEN_CLAIM_EXPENSE_MODEL:
                    return { ...state,selectedclaimexpense:action.payload,opnClaimExpenseDialog : true};
           case OPEN_CLAIM_EXPENSE_MODEL_SUCCESS :
                    return { ...state,employeeList:action.payload.employeeList ? action.payload.employeeList : state.employeeList };
           case CLOSE_CLAIM_EXPENSE_MODEL:
                    return { ...state, opnClaimExpenseDialog : false,selectedclaimexpense : null};
           case SAVE_CLAIM_EXPENSE:
                    return { ...state,dialogLoading : true, disabled : true};
           case SAVE_CLAIM_EXPENSE_SUCCESS:
                    return { ...state,opnClaimExpenseDialog : false,dialogLoading : false,selectedclaimexpense : null, disabled : false};

           case IMPORT_EXPENSE:
                    return { ...state ,importloading : true};
           case IMPORT_EXPENSE_SUCCESS:
                    return { ...state,importloading : false};
           case IMPORT_EXPENSE_LIST:
                 let tableInfoImport = state.tableInfoImport;
                  if(action.payload)
                    {
                       if(action.payload.state)
                          {
                            tableInfoImport.pageIndex  = action.payload.state.page;
                            tableInfoImport.pageSize  = action.payload.state.pageSize;
                            tableInfoImport.sorted  = action.payload.state.sorted;
                            tableInfoImport.filtered = action.payload.state.filtered;
                            tableInfoImport.modulename = 'expense';
                          }
                          else {
                              tableInfoImport.sorted  =[];
                              tableInfoImport.filtered = [];
                              tableInfoImport.modulename = 'expense';
                          }
                      }
                    return { ...state ,tableInfoImport : tableInfoImport,importloading : true};
           case IMPORT_EXPENSE_LIST_SUCCESS:
                          return { ...state, importfilelist: action.payload.data,importloading : false, tableInfoImport : {...state.tableInfoImport , pages : action.payload.pages[0].pages}};



        default: return { ...state};
    }
}
