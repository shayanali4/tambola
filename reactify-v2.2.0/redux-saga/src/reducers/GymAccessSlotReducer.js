
import {


  OPEN_VIEW_GYM_ACCESS_SLOT_MODEL,
  OPEN_VIEW_GYM_ACCESS_SLOT_MODEL_SUCCESS,
  CLOSE_VIEW_GYM_ACCESS_SLOT_MODEL,
  CHANGE_GYM_ACCESS_SLOT,
  CHANGE_SAVE_MEMBER_GYMACCESSSLOT,
  CHANGE_SAVE_MEMBER_GYMACCESSSLOT_SUCCESS,
  CHANGE_SAVE_MEMBER_GYMACCESSSLOT_FAILURE,

  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      loading : false,
      disabled : false,
      dialogLoading : false,
      selectedslotdetail : null,
      viewSlotDialog : false,
      tableInfo : {
       pageSize : 10,
       pageIndex : 0,
       pages : 1,
     },
     gymaccessslotid : null,
     changeslot : 0

};
export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case CLOSE_VIEW_GYM_ACCESS_SLOT_MODEL:
         return { ...state, viewSlotDialog : false , selectedslotdetail : null , tableInfo : { pageSize : 10,  pageIndex : 0,  pages : 1}
        };
      case OPEN_VIEW_GYM_ACCESS_SLOT_MODEL:
      let tableInfo = state.tableInfo;
        if(action.payload)
        {
          if(action.payload.date){
            tableInfo.date  = action.payload.date;
            tableInfo.startTime  = action.payload.starttime;
            tableInfo.endTime  = action.payload.endtime;
          }
          else if(action.payload.state)
          {
            tableInfo.pageIndex  = action.payload.state.page;
            tableInfo.pageSize  = action.payload.state.pageSize;
            tableInfo.sorted  = action.payload.state.sorted;
            tableInfo.filtered = action.payload.state.filtered;
          }

          if(action.payload.bookingstatus != null && action.payload.bookingstatus != undefined) {
              tableInfo.bookingstatus = action.payload.bookingstatus;
          }
        }
         return { ...state, viewSlotDialog : true , selectedslotdetail : null, tableInfo : tableInfo};
      case OPEN_VIEW_GYM_ACCESS_SLOT_MODEL_SUCCESS:
         return { ...state, selectedslotdetail:action.payload.data, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages}};
      case CHANGE_GYM_ACCESS_SLOT:
            return { ...state, gymaccessslotid:action.payload,changeslot : 1,viewSlotDialog : false , selectedslotdetail : null};

      case CHANGE_SAVE_MEMBER_GYMACCESSSLOT:
           return { ...state, dialogLoading : true, disabled : true };

     case CHANGE_SAVE_MEMBER_GYMACCESSSLOT_SUCCESS:
           return { ...state, dialogLoading : false, disabled : false ,gymaccessslotid:null,changeslot : 0};

     case CHANGE_SAVE_MEMBER_GYMACCESSSLOT_FAILURE:
           return { ...state, dialogLoading : false, disabled : false ,gymaccessslotid:null,changeslot : 0};

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
