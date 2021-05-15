/**
 * budget Reducer
 */
 import BudgetPeriod  from 'Assets/data/budgetperiod';

// action types
import {
  OPEN_ADD_NEW_BUDGET_MODEL,
  CLOSE_ADD_NEW_BUDGET_MODEL,
  SAVE_BUDGET,
  SAVE_BUDGET_SUCCESS,
  GET_BUDGET,
  GET_BUDGET_SUCCESS,
  OPEN_VIEW_BUDGET_MODEL,
  OPEN_VIEW_BUDGET_MODEL_SUCCESS,
  CLOSE_VIEW_BUDGET_MODEL,
  OPEN_EDIT_BUDGET_MODEL,
  OPEN_EDIT_BUDGET_MODEL_SUCCESS,

  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		 budgets: null, // initial member data
       loading : false,
       disabled : false,
       dialogLoading : false,
       addNewBudgetModal : false,
       viewBudgetDialog:false,
       selectedbudget: null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      editMode :  false,
      editbudget : null
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

        case OPEN_ADD_NEW_BUDGET_MODEL :
            return { ...state, addNewBudgetModal : true,editMode : false,editbudget : null};
        case CLOSE_ADD_NEW_BUDGET_MODEL:
            return { ...state, addNewBudgetModal : false,editMode : false,editbudget : null};
        case SAVE_BUDGET:
            return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_BUDGET_SUCCESS:

            return { ...state, dialogLoading : false,addNewBudgetModal : false , disabled : false,editMode : false,editbudget : null};
        case GET_BUDGET:

            let tableInfo = state.tableInfo;
              if(action.payload)
              {
                tableInfo.pageIndex  = action.payload.state.page;
                tableInfo.pageSize  = action.payload.state.pageSize;
                tableInfo.sorted  = action.payload.state.sorted;
                tableInfo.filtered = action.payload.state.filtered;
              }
          return { ...state , tableInfo : tableInfo};
          case GET_BUDGET_SUCCESS:
             return { ...state, budgets: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

          case CLOSE_VIEW_BUDGET_MODEL:
             return { ...state, viewBudgetDialog : false , selectedbudget : null};
          case OPEN_VIEW_BUDGET_MODEL:
             return { ...state, viewBudgetDialog : true , selectedbudget : null};
          case OPEN_VIEW_BUDGET_MODEL_SUCCESS:
          let selectedbudget = action.payload.data[0];
          if(selectedbudget){
            selectedbudget.budgettype = selectedbudget.budgettype ? JSON.parse(selectedbudget.budgettype) : [];
            selectedbudget.consumed = selectedbudget.consumed ? JSON.parse(selectedbudget.consumed) : [];
             selectedbudget.budgettype.forEach(x => {
               selectedbudget.consumed.filter(y =>{
                 if(y.categoryid == parseInt(x.value)){
                   x.consume = y.consume
                 }
                 if(x.value == "3"){
                   x.consume = x.consume || 0;
                   x.consume += y.consumesales
                 }
               })
                  x.available = x.budget - (x.consume || 0);
             });
             let total = {name : "Total",
                consume : selectedbudget.budgettype.map(y => y.consume || 0).reduce((a, b) => parseInt(a) + parseInt(b),0),
                available :selectedbudget.budgettype.map(y => y.available || 0).reduce((a, b) => parseInt(a) + parseInt(b),0),
                budget : selectedbudget.totalbudget
                 }
                selectedbudget.budgettype.push(total)
                let budgetPeriodduration = BudgetPeriod.filter(x => x.value == selectedbudget.budgetperiodId)[0];
                selectedbudget.duration = budgetPeriodduration.duration;
                selectedbudget.durationcount = budgetPeriodduration.durationcount;

          }
             return { ...state, selectedbudget:selectedbudget};
     case OPEN_EDIT_BUDGET_MODEL:
             return { ...state, addNewBudgetModal : true, editMode : true, editbudget: null };

     case OPEN_EDIT_BUDGET_MODEL_SUCCESS:
             let editbudget = action.payload.data[0];
              if(editbudget)
               {
                    let budgetPeriodduration = BudgetPeriod.filter(x => x.value == editbudget.budgetperiodId)[0];
                   editbudget.budgettype = editbudget.budgettype ? JSON.parse(editbudget.budgettype) :  [];
                   editbudget.duration = budgetPeriodduration.duration;
                   editbudget.durationcount = budgetPeriodduration.durationcount;
                   editbudget.totalmonthlybudget = editbudget.budgettype.map(x => ((x.budget || 0) /editbudget.durationcount).toFixed(2) || '').reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
               }
          return { ...state,addNewBudgetModal : true,editbudget:editbudget};


        default: return { ...state};
    }
}
