// action types
import {
  GET_DUES,
  GET_DUES_SUCCESS,
  SAVE_PAYMENT,
  SAVE_PAYMENT_SUCCESS,
  OPEN_ADD_NEW_PAYMENT_MODEL,
  OPEN_ADD_NEW_PAYMENT_MODEL_SUCCESS,
  CLOSE_ADD_NEW_PAYMENT_MODEL,
  GET_PENDING_CHEQUE_LIST,
  GET_PENDING_CHEQUE_LIST_SUCCESS,
  CHANGE_CHEQUE_PAYMENT_STATUS,
  CHANGE_CHEQUE_PAYMENT_STATUS_SUCCESS,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';
const INIT_STATE = {
      dues: null, // initial service data
      loading : false,
      disabled : false,
      dialogLoading : false,
      selectedpayment:null,
      openPaymentDialog : false,
      pendingcheque : null,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      paymentid :''

};
    export default (state = INIT_STATE, action) => {

        switch (action.type) {
          // get dues
          case GET_DUES:
          let tableInfo = state.tableInfo;
            if(action.payload)
            {
              tableInfo.pageIndex  = action.payload.state.page;
              tableInfo.pageSize  = action.payload.state.pageSize;
              tableInfo.sorted  = action.payload.state.sorted;
              tableInfo.filtered = action.payload.state.filtered;
            }
              return { ...state ,tableInfo : tableInfo};
          // get service success
          case GET_DUES_SUCCESS:

              return { ...state, dues: action.payload.data, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
          case OPEN_ADD_NEW_PAYMENT_MODEL :
                         return { ...state, openPaymentDialog : true};
          case OPEN_ADD_NEW_PAYMENT_MODEL_SUCCESS:
                          return { ...state,openPaymentDialog : true, loading : false };
          case CLOSE_ADD_NEW_PAYMENT_MODEL:
                         return { ...state, openPaymentDialog : false,loading:false};
          case SAVE_PAYMENT:
                    return { ...state,  dialogLoading : true, disabled : true };
          case SAVE_PAYMENT_SUCCESS:
                    return { ...state, dialogLoading : false,selectedpayment : null,openPaymentDialog : false,paymentid : action.payload.paymentid};
          case GET_PENDING_CHEQUE_LIST:
                    let tableInfoCheque = state.tableInfo;
                      if(action.payload)
                      {
                        tableInfoCheque.pageIndex  = action.payload.state.page;
                        tableInfoCheque.pageSize  = action.payload.state.pageSize;
                        tableInfoCheque.sorted  = action.payload.state.sorted;
                        tableInfoCheque.filtered = action.payload.state.filtered;
                      }
                        return { ...state ,tableInfo : tableInfoCheque};
                    // get service success
            case GET_PENDING_CHEQUE_LIST_SUCCESS:
                        return { ...state, pendingcheque: action.payload.data, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
            case CHANGE_CHEQUE_PAYMENT_STATUS:
                                  return { ...state,  dialogLoading : true, disabled : true };
            case CHANGE_CHEQUE_PAYMENT_STATUS_SUCCESS:
                                  return { ...state, dialogLoading : false,openPaymentDialog : false};

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
