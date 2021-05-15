/**
 * staffpay Reducer
 */
 import ExpensePaymentMode from 'Assets/data/expensepaymentmode';
 import Month from 'Assets/data/month';

// action types
import {
  OPEN_ADD_NEW_STAFFPAY_MODEL,
  OPEN_ADD_NEW_STAFFPAY_MODEL_SUCCESS,
  CLOSE_ADD_NEW_STAFFPAY_MODEL,
  SAVE_STAFFPAY,
  SAVE_STAFFPAY_SUCCESS,
  GET_STAFFPAY,
  GET_STAFFPAY_SUCCESS,
  OPEN_VIEW_STAFFPAY_MODEL,
  OPEN_VIEW_STAFFPAY_MODEL_SUCCESS,
  CLOSE_VIEW_STAFFPAY_MODEL,
  DELETE_STAFFPAY,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		 staffpay: null, // initial member data
       loading : false,
       disabled : false,
       dialogLoading : false,
       addNewStaffPayModal : false,
       viewStaffPayDialog:false,
       selectedstaffpay: null,
       employeeList:null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },

};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

          case REQUEST_FAILURE:
          return { ...state ,  dialogLoading : false, disabled : false};

          case REQUEST_SUCCESS:
          return { ...state};

        case ON_SHOW_LOADER:
            return { ...state, loading: true };

        case ON_HIDE_LOADER:
            return { ...state, loading : false };

        case OPEN_ADD_NEW_STAFFPAY_MODEL :

            return { ...state, addNewStaffPayModal : true};
        case OPEN_ADD_NEW_STAFFPAY_MODEL_SUCCESS:

            return { ...state,employeeList:action.payload.employeeList,  addNewStaffPayModal : true, loading : false };
        case CLOSE_ADD_NEW_STAFFPAY_MODEL:
            return { ...state, addNewStaffPayModal : false};
        case SAVE_STAFFPAY:
            return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_STAFFPAY_SUCCESS:

            return { ...state, dialogLoading : false,addNewStaffPayModal : false , disabled : false};
        case GET_STAFFPAY:

            let tableInfo = state.tableInfo;
              if(action.payload)
              {
                tableInfo.pageIndex  = action.payload.state.page;
                tableInfo.pageSize  = action.payload.state.pageSize;
                tableInfo.sorted  = action.payload.state.sorted;
                tableInfo.filtered = action.payload.state.filtered;
              }
          return { ...state , tableInfo : tableInfo};
          case GET_STAFFPAY_SUCCESS:
          let staffpay = action.payload.data;
          if(staffpay){
                staffpay.forEach(x => {
                if(x.monthofsalary){
                  let month = new Date(x.monthofsalary).getMonth() + 1 ;
                  x.monthofsalary = Month.filter(x => x.value == month)[0].short + " " + new Date(x.monthofsalary).getFullYear();
                }
                else{
                  x.monthofsalary = ''
                }
              })
          }

             return { ...state, staffpay: staffpay , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

          case CLOSE_VIEW_STAFFPAY_MODEL:
             return { ...state, viewStaffPayDialog : false , selectedstaffpay : null};
          case OPEN_VIEW_STAFFPAY_MODEL:
             return { ...state, viewStaffPayDialog : true , selectedstaffpay : null};
          case OPEN_VIEW_STAFFPAY_MODEL_SUCCESS:
          let selectedstaffpay = action.payload.data[0];
          if(selectedstaffpay){
              if(selectedstaffpay.monthofsalary){
                 let month = new Date(selectedstaffpay.monthofsalary).getMonth() + 1 ;
                 selectedstaffpay.month = Month.filter(x => x.value == month)[0].short;
               }
               else{
                   selectedstaffpay.monthofsalary = ''
               }

          }
             return { ...state, selectedstaffpay:selectedstaffpay};

        default: return { ...state};
    }
}
