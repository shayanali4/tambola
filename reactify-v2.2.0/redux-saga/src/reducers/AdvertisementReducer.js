/**
 * advertisement Reducer
 */
 import update from 'react-addons-update';

// action types
import {
  OPEN_ADD_NEW_ADVERTISEMENT_MODEL,
  CLOSE_ADD_NEW_ADVERTISEMENT_MODEL,
  SAVE_ADVERTISEMENT,
  SAVE_ADVERTISEMENT_SUCCESS,
  GET_ADVERTISEMENTS,
  GET_ADVERTISEMENTS_SUCCESS,
  OPEN_VIEW_ADVERTISEMENT_MODEL,
  OPEN_VIEW_ADVERTISEMENT_MODEL_SUCCESS,
  CLOSE_VIEW_ADVERTISEMENT_MODEL,
  OPEN_EDIT_ADVERTISEMENT_MODEL,
  OPEN_EDIT_ADVERTISEMENT_MODEL_SUCCESS,
  ADVERTISEMENT_HANDLE_CHANGE_SELECT_ALL,
  ADVERTISEMENT_HANDLE_SINGLE_CHECKBOX_CHANGE,
  OPEN_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL,
  CLOSE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL,
  OPEN_DISABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL,
  CLOSE_DISABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL,
  SAVE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT,
  SAVE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT_SUCCESS,

  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		 advertisements: null, // initial member data
       loading : false,
       disabled : false,
       dialogLoading : false,
       addNewAdertisementModal : false,
       viewAdvertisemetDialog:false,
       selecteAdvertisemet: null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      editMode :  false,
      editadvertisement : null,
      selectAll: false,
      opnEnablePublishingStatusAdvertisementDialog : false,
      opnDisablePublishingStatusAdvertisementDialog : false,
      enablePublishingStatusAdvertisementData : null,
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

        case OPEN_ADD_NEW_ADVERTISEMENT_MODEL :
            return { ...state, addNewAdertisementModal : true,editMode : false,editadvertisement : null};
        case CLOSE_ADD_NEW_ADVERTISEMENT_MODEL:
            return { ...state, addNewAdertisementModal : false,editMode : false,editadvertisement : null};
        case SAVE_ADVERTISEMENT:
            return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_ADVERTISEMENT_SUCCESS:
            return { ...state, dialogLoading : false,addNewAdertisementModal : false , disabled : false,editMode : false,editadvertisement : null};

        case GET_ADVERTISEMENTS:
            let tableInfo = state.tableInfo;
            if(action.payload)
            {
              tableInfo.pageIndex  = action.payload.state.page;
              tableInfo.pageSize  = action.payload.state.pageSize;
              tableInfo.sorted  = action.payload.state.sorted;
              tableInfo.filtered = action.payload.state.filtered;
            }

          return { ...state , tableInfo : tableInfo};

        case GET_ADVERTISEMENTS_SUCCESS:
             return { ...state, advertisements: action.payload.data ,selectAll : false, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

        case CLOSE_VIEW_ADVERTISEMENT_MODEL:
             return { ...state, viewAdvertisemetDialog : false , selecteAdvertisemet : null};
        case OPEN_VIEW_ADVERTISEMENT_MODEL:
             return { ...state, viewAdvertisemetDialog : true , selecteAdvertisemet : null};
       case OPEN_VIEW_ADVERTISEMENT_MODEL_SUCCESS:
             return { ...state, selecteAdvertisemet:action.payload.data[0]};

       case OPEN_EDIT_ADVERTISEMENT_MODEL:
             return { ...state, addNewAdertisementModal : true, editMode : true, editadvertisement: null };

      case OPEN_EDIT_ADVERTISEMENT_MODEL_SUCCESS:
          return { ...state,addNewAdertisementModal : true,editadvertisement:action.payload.data[0]};


      case ADVERTISEMENT_HANDLE_CHANGE_SELECT_ALL:

              var selectAll = !state.selectAll;
              state.advertisements.forEach(x =>{ x.checked = action.payload.value});
              return update(state, {
                    selectAll: { $set:selectAll },
              });

      case ADVERTISEMENT_HANDLE_SINGLE_CHECKBOX_CHANGE:

              let advertisementIndex = state.advertisements.indexOf(action.payload.data);
              return update(state, {
                 advertisements: {
                 [advertisementIndex]: {
                      checked: { $set: action.payload.value },
                      }
                    }
            });
      case OPEN_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL :
                         return { ...state, opnEnablePublishingStatusAdvertisementDialog : true,editMode : false , editadvertisement : null,enablePublishingStatusAdvertisementData : action.payload};
      case CLOSE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL:
                         return { ...state, opnEnablePublishingStatusAdvertisementDialog : false, editMode : false , editadvertisement : null ,enablePublishingStatusAdvertisementData : null};
      case OPEN_DISABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL :
                         return { ...state, opnDisablePublishingStatusAdvertisementDialog : true,editMode : false , editadvertisement : null,enablePublishingStatusAdvertisementData : action.payload};
      case CLOSE_DISABLEPUBLISHINGSTATUS_ADVERTISEMENT_MODEL:
                         return { ...state, opnDisablePublishingStatusAdvertisementDialog : false, editMode : false , editadvertisement : null ,enablePublishingStatusAdvertisementData : null};

      case SAVE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT:
                         return { ...state,dialogLoading : true, disabled : true};
      case SAVE_ENABLEPUBLISHINGSTATUS_ADVERTISEMENT_SUCCESS:
                          return { ...state,opnEnablePublishingStatusAdvertisementDialog : false,opnDisablePublishingStatusAdvertisementDialog :false,dialogLoading : false,enablePublishingStatusAdvertisementData : null,editMode : false, editadvertisement : null, disabled : false};


        default: return { ...state};
    }
}
