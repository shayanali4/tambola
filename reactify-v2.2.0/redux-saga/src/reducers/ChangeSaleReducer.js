import Status from 'Assets/data/status';
import update from 'react-addons-update';

// action types
import {
  GET_CHANGESUBSCRIPTIONSALES,
  GET_CHANGESUBSCRIPTIONSALES_SUCCESS,

  CHANGE_SALE,
  CHANGE_SALE_SUCCESS,

  OPEN_CHANGESALE_MODEL,
  OPEN_CHANGESALE_MODEL_SUCCESS,
  CLOSE_CHANGESALE_MODEL,

  ON_CHANGE,

  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
  } from 'Actions/types';

  const INIT_STATE = {
    changesubscriptionsales: null,
    loading : false,
    disabled : false,
    dialogLoading : false,
    tableInfo : {
      pageSize : 10,
      pageIndex : 0,
      pages : 1,
      changesalefilter : '1',
      totalrecord :0,
    },
    invoiceid : '',
    changeSaleModal : false,
    changeSaledetail : null,
    services : null,
    canceldetail : null,
    changetype : '1',
    products : null,
    tableInfosales : {
      pageSize : 10,
      pageIndex : 0,
      pages : 1,
      isExpressSale : true
    },
    classList : null

};
  export default (state = INIT_STATE, action) => {

      switch (action.type) {
        case GET_CHANGESUBSCRIPTIONSALES:
        let tableInfo = state.tableInfo;
          if(action.payload)
          {
            if(action.payload.state)
            {
                tableInfo.pageIndex  = action.payload.state.page;
                tableInfo.pageSize  = action.payload.state.pageSize;
                tableInfo.sorted  = action.payload.state.sorted;
                tableInfo.filtered = action.payload.state.filtered;
                tableInfo.changesalefilter = action.payload.state.changesalefilter;
              }
              else{
                tableInfo.changesalefilter = action.payload.changesalefilter;
              }
          }
        return { ...state , tableInfo : tableInfo};
      // get changesale success
        case GET_CHANGESUBSCRIPTIONSALES_SUCCESS:
                  return { ...state, changesubscriptionsales: action.payload.data ,tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

        case CHANGE_SALE:
                 return { ...state,  dialogLoading : true, disabled : true };
        case CHANGE_SALE_SUCCESS:
                  return { ...state, dialogLoading : false, disabled : false,invoiceid:action.payload.data};

        case OPEN_CHANGESALE_MODEL :
                return { ...state , changetype : '1',changeSaledetail : null};
       case OPEN_CHANGESALE_MODEL_SUCCESS :
      //  let changeSaledetail = action.payload.changeSaledetail;
      //  let services = action.payload.services;
      //  let products = action.payload.products;
      //  if(changeSaledetail){
      //      if(services){
      //      services = services.filter(x => x.servicetypeId == changeSaledetail.servicetypeId)
      //      }
      // }
              return { ...state, services : action.payload.services,changeSaledetail : action.payload.changeSaledetail,products : action.payload.products,classList : action.payload.classList };

        case CLOSE_CHANGESALE_MODEL:
                return { ...state, changesaledetail : null,services : null ,changetype : '1'};

        case ON_CHANGE:
            {
              return update(state, {
                 changetype : { $set: action.payload.type }
              });
            }
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
