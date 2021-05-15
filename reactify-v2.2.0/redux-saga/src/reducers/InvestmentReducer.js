/**
 * investment Reducer
 */

import ExpensePaymentMode from 'Assets/data/expensepaymentmode';
// action types
import {
  OPEN_ADD_NEW_INVESTMENT_MODEL,
  CLOSE_ADD_NEW_INVESTMENT_MODEL,
  SAVE_INVESTMENT,
  SAVE_INVESTMENT_SUCCESS,
  GET_INVESTMENTS,
  GET_INVESTMENTS_SUCCESS,
  OPEN_VIEW_INVESTMENT_MODEL,
  OPEN_VIEW_INVESTMENT_MODEL_SUCCESS,
  CLOSE_VIEW_INVESTMENT_MODEL,

  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		 investment: null, // initial member data
       loading : false,
       disabled : false,
       dialogLoading : false,
       addNewInvestmentModal : false,
       viewInvestmentDialog:false,
       selectedinvestment: null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
       },
       addInvestment:null,
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

        case OPEN_ADD_NEW_INVESTMENT_MODEL :
            return { ...state, addNewInvestmentModal : true,addInvestment:action.payload};
        case CLOSE_ADD_NEW_INVESTMENT_MODEL:
            return { ...state, addNewInvestmentModal : false};
        case SAVE_INVESTMENT:
            return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_INVESTMENT_SUCCESS:
            return { ...state, dialogLoading : false,addNewInvestmentModal : false , disabled : false,addInvestment:null};
        case GET_INVESTMENTS:
            let tableInfo = state.tableInfo;
              if(action.payload)
              {
                tableInfo.pageIndex  = action.payload.state.page;
                tableInfo.pageSize  = action.payload.state.pageSize;
                tableInfo.sorted  = action.payload.state.sorted;
                tableInfo.filtered = action.payload.state.filtered;
              }
          return { ...state , tableInfo : tableInfo};
          case GET_INVESTMENTS_SUCCESS:
             return { ...state, investment: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

          case CLOSE_VIEW_INVESTMENT_MODEL:
             return { ...state, viewInvestmentDialog : false , selectedinvestment : null};
          case OPEN_VIEW_INVESTMENT_MODEL:
             return { ...state, viewInvestmentDialog : true , selectedinvestment : null};
          case OPEN_VIEW_INVESTMENT_MODEL_SUCCESS:
          let selectedinvestment = action.payload.data[0];
          if(selectedinvestment){
            selectedinvestment.paymentmode =  selectedinvestment.paymentmode ? ExpensePaymentMode.filter(value => value.name == selectedinvestment.paymentmode)[0] : '';
          }

             return { ...state, selectedinvestment:selectedinvestment};

        default: return { ...state};
    }
}
