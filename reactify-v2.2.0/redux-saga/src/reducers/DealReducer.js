
import update from 'react-addons-update';

// action types
import {
  GET_DEALS,
  GET_DEALS_SUCCESS,

  OPEN_ADD_NEW_DEAL_MODEL,
  CLOSE_ADD_NEW_DEAL_MODEL,
  OPEN_ADD_NEW_DEAL_MODEL_SUCCESS,

  OPEN_EDIT_DEAL_MODEL,
  OPEN_EDIT_DEAL_MODEL_SUCCESS,

  OPEN_VIEW_DEAL_MODEL,
  OPEN_VIEW_DEAL_MODEL_SUCCESS,
  CLOSE_VIEW_DEAL_MODEL,

  SAVE_DEAL,
  SAVE_DEAL_SUCCESS,

  DELETE_DEAL,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      deals: null, // initial Deal data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewDealModal : false,
      viewDealDialog:false,
      selectedDeal: null,
      editDeal : null,
      editMode : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      };

export default (state = INIT_STATE, action) => {

    switch (action.type) {
      // get deals
      case GET_DEALS:

      let tableInfo = state.tableInfo;
        if(action.payload)
        {
          tableInfo.pageIndex  = action.payload.state.page;
          tableInfo.pageSize  = action.payload.state.pageSize;
          tableInfo.sorted  = action.payload.state.sorted;
          tableInfo.filtered = action.payload.state.filtered;
        }
      return { ...state , tableInfo : tableInfo};
      // get Deal success
      case GET_DEALS_SUCCESS:
      {
         let deals = action.payload.data;

         return { ...state, deals: deals,selectAll : false,  tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
     }
     case OPEN_ADD_NEW_DEAL_MODEL :
              return { ...state, addNewDealModal : true ,editMode : false ,editDeal : null};
      case OPEN_ADD_NEW_DEAL_MODEL_SUCCESS:

               return { ...state,addNewDealModal : true, editMode : false ,editDeal : null,dealtypelist : action.payload.dealtypelist,storelist : action.payload.storelist};
    case CLOSE_ADD_NEW_DEAL_MODEL:
              return { ...state, addNewDealModal : false ,editMode : false,editDeal : null};
    case OPEN_EDIT_DEAL_MODEL:
        return { ...state, addNewDealModal : true, editMode : true, editDeal: null };
    case OPEN_EDIT_DEAL_MODEL_SUCCESS:
            let editDeal = action.payload.data[0];
            if(editDeal)
            {

               editDeal.statusId =  editDeal.statusId ? editDeal.statusId.toString() : '';
          	    }
              return { ...state,editDeal:editDeal,dealtypelist : action.payload.dealtypelist ,storelist : action.payload.storelist };
     case OPEN_VIEW_DEAL_MODEL :
         return { ...state, viewDealDialog : true , selectedDeal : null};

      case OPEN_VIEW_DEAL_MODEL_SUCCESS:
        let selectedDeal = action.payload.data[0];
        if(selectedDeal)
        {
          selectedDeal.images = JSON.parse(selectedDeal.images);
           selectedDeal.images = selectedDeal.images || [];

             selectedDeal.statusId =  selectedDeal.statusId ? selectedDeal.statusId.toString() : '';
      		 selectedDeal.measurementunitId = selectedDeal.measurementunitId ? selectedDeal.measurementunitId.toString() : '';
      		 selectedDeal.DealtypeId = selectedDeal.DealtypeId ? selectedDeal.DealtypeId.toString() : '';
      		 selectedDeal.DealvalidityId = selectedDeal.DealvalidityId ?  selectedDeal.DealvalidityId.toString() : '';

        }
              return { ...state,selectedDeal:selectedStor };
      case CLOSE_VIEW_DEAL_MODEL:
          return { ...state, viewDealDialog : false ,selectedDeal :null};
     case SAVE_DEAL:
                  return { ...state, dialogLoading : true, disabled : true };
      case SAVE_DEAL_SUCCESS:
                  return { ...state, dialogLoading : false,addNewDealModal : false , editMode : false, editDeal : null, disabled : false};


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
