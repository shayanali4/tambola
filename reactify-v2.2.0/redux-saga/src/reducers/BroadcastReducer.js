import  Status from 'Assets/data/status';
import  ServiceValidity from 'Assets/data/servicevalidity';
import  Serviceunit from 'Assets/data/measurementunit';
import ServiceType from 'Assets/data/servicetype';

// action types
import {
GET_BROADCAST,
GET_BROADCAST_SUCCESS,
OPEN_ADD_NEW_BROADCAST_MODEL,
OPEN_ADD_NEW_BROADCAST_MODEL_SUCCESS,
CLOSE_ADD_NEW_BROADCAST_MODEL,
SAVE_BROADCAST,
SAVE_BROADCAST_SUCCESS,
OPEN_VIEW_BROADCAST_MODEL,
OPEN_VIEW_BROADCAST_MODEL_SUCCESS,
CLOSE_VIEW_BROADCAST_MODEL,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      broadcast: null, // initial service data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewBroadcastModal : false,
      viewBroadcastDialog:false,
      selectedBroadcast: null,
      editbroadcast : null,
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
      // get services
      case GET_BROADCAST:

      let tableInfo = state.tableInfo;
        if(action.payload)
        {
          tableInfo.pageIndex  = action.payload.state.page;
          tableInfo.pageSize  = action.payload.state.pageSize;
          tableInfo.sorted  = action.payload.state.sorted;
          tableInfo.filtered = action.payload.state.filtered;
        }
      return { ...state , tableInfo : tableInfo};
      // get service success
      case GET_BROADCAST_SUCCESS:
      {
         let broadcast = action.payload.data;

         return { ...state, broadcast: broadcast,  tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
     }
     case OPEN_ADD_NEW_BROADCAST_MODEL :
              return { ...state, addNewBroadcastModal : true ,editMode : false ,editbroadcast : null};
      case OPEN_ADD_NEW_BROADCAST_MODEL_SUCCESS:
               return { ...state,addNewBroadcastModal : true, editMode : false ,editbroadcast : null };
    case CLOSE_ADD_NEW_BROADCAST_MODEL:
              return { ...state, addNewBroadcastModal : false ,editMode : false,editbroadcast : null};
     case SAVE_BROADCAST:
                  return { ...state, dialogLoading : true, disabled : true };
      case SAVE_BROADCAST_SUCCESS:
                  return { ...state, dialogLoading : false,addNewBroadcastModal : false , editMode : false, editbroadcast : null, disabled : false};

      case OPEN_VIEW_BROADCAST_MODEL :
                           return { ...state,selectedBroadcast : null, viewBroadcastDialog:true};

      case OPEN_VIEW_BROADCAST_MODEL_SUCCESS :

                            let selectedBroadcast = action.payload.data[0].response;
                            selectedBroadcast = selectedBroadcast ? JSON.parse(selectedBroadcast) : '';

                            if(selectedBroadcast)
                            {
                                //selectedBroadcast.mobileresponse = mobileresponse.concat(selectedBroadcast.map(x => x.mobile));
                                selectedBroadcast[0].responsemessage = (selectedBroadcast.map(x => x.responsemessage)).join(', ');
                            }

                            return { ...state,selectedBroadcast: selectedBroadcast[0]};
      case CLOSE_VIEW_BROADCAST_MODEL:
                             return { ...state, viewBroadcastDialog : false };

                  // save services success
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
