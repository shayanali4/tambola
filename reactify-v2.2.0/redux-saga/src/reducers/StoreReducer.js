
import update from 'react-addons-update';

// action types
import {
  GET_STORES,
  GET_STORES_SUCCESS,

  OPEN_ADD_NEW_STORE_MODEL,
  CLOSE_ADD_NEW_STORE_MODEL,
  OPEN_ADD_NEW_STORE_MODEL_SUCCESS,

  OPEN_EDIT_STORE_MODEL,
  OPEN_EDIT_STORE_MODEL_SUCCESS,

  OPEN_VIEW_STORE_MODEL,
  OPEN_VIEW_STORE_MODEL_SUCCESS,
  CLOSE_VIEW_STORE_MODEL,

  SAVE_STORE,
  SAVE_STORE_SUCCESS,

  DELETE_STORE,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      stores: null, // initial Store data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewStoreModal : false,
      viewStoreDialog:false,
      selectedStore: null,
      editStore : null,
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
      // get stores
      case GET_STORES:

      let tableInfo = state.tableInfo;
        if(action.payload)
        {
          tableInfo.pageIndex  = action.payload.state.page;
          tableInfo.pageSize  = action.payload.state.pageSize;
          tableInfo.sorted  = action.payload.state.sorted;
          tableInfo.filtered = action.payload.state.filtered;
        }
      return { ...state , tableInfo : tableInfo};
      // get Store success
      case GET_STORES_SUCCESS:
      {
         let stores = action.payload.data;

         return { ...state, stores: stores,selectAll : false,  tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
     }
     case OPEN_ADD_NEW_STORE_MODEL :
              return { ...state, addNewStoreModal : true ,editMode : false ,editStore : null};
      case OPEN_ADD_NEW_STORE_MODEL_SUCCESS:
               return { ...state,addNewStoreModal : true, editMode : false ,editStore : null,storecodecategorylist : action.payload.storecodecategorylist};
    case CLOSE_ADD_NEW_STORE_MODEL:
              return { ...state, addNewStoreModal : false ,editMode : false,editStore : null};
    case OPEN_EDIT_STORE_MODEL:
        return { ...state, addNewStoreModal : true, editMode : true, editStore: null };
    case OPEN_EDIT_STORE_MODEL_SUCCESS:
            let editStore = action.payload.data[0];
            if(editStore)
            {
               editStore.images =  JSON.parse(editStore.images);
               editStore.images = editStore.images || [];

               editStore.statusId =  editStore.statusId ? editStore.statusId.toString() : '';
          		 editStore.measurementunitId = editStore.measurementunitId ? editStore.measurementunitId.toString() : '';
          		 editStore.StoretypeId = editStore.StoretypeId ? editStore.StoretypeId.toString() : '';
          		 editStore.StorevalidityId = editStore.StorevalidityId ?  editStore.StorevalidityId.toString() : '';
               editStore.activityId = editStore.activityId ?  editStore.activityId.toString() : '';
               editStore.applicableforId = editStore.applicableforId ?  editStore.applicableforId.toString() : '';
               editStore.durationId = editStore.durationId ?  editStore.durationId.toString() : '';
               editStore.sessiontypeId = editStore.sessiontypeId ?  editStore.sessiontypeId.toString() : '';
            }
              return { ...state,editStore:editStore,storecodecategorylist : action.payload.storecodecategorylist };
     case OPEN_VIEW_STORE_MODEL :
         return { ...state, viewStoreDialog : true , selectedStore : null};

      case OPEN_VIEW_STORE_MODEL_SUCCESS:
        let selectedStore = action.payload.data[0];
        if(selectedStore)
        {
          selectedStore.images = JSON.parse(selectedStore.images);
           selectedStore.images = selectedStore.images || [];

             selectedStore.statusId =  selectedStore.statusId ? selectedStore.statusId.toString() : '';
      		 selectedStore.measurementunitId = selectedStore.measurementunitId ? selectedStore.measurementunitId.toString() : '';
      		 selectedStore.StoretypeId = selectedStore.StoretypeId ? selectedStore.StoretypeId.toString() : '';
      		 selectedStore.StorevalidityId = selectedStore.StorevalidityId ?  selectedStore.StorevalidityId.toString() : '';

        }
              return { ...state,selectedStore:selectedStor };
      case CLOSE_VIEW_STORE_MODEL:
          return { ...state, viewStoreDialog : false ,selectedStore :null};
     case SAVE_STORE:
                  return { ...state, dialogLoading : true, disabled : true };
      case SAVE_STORE_SUCCESS:
                  return { ...state, dialogLoading : false,addNewStoreModal : false , editMode : false, editStore : null, disabled : false};


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
