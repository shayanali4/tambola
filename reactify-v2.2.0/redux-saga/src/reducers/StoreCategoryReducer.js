
import update from 'react-addons-update';

// action types
import {
  GET_STORECATEGORYS,
  GET_STORECATEGORYS_SUCCESS,

  OPEN_ADD_NEW_STORECATEGORY_MODEL,
  CLOSE_ADD_NEW_STORECATEGORY_MODEL,
  OPEN_ADD_NEW_STORECATEGORY_MODEL_SUCCESS,

  OPEN_EDIT_STORECATEGORY_MODEL,
  OPEN_EDIT_STORECATEGORY_MODEL_SUCCESS,

  OPEN_VIEW_STORECATEGORY_MODEL,
  OPEN_VIEW_STORECATEGORY_MODEL_SUCCESS,
  CLOSE_VIEW_STORECATEGORY_MODEL,

  SAVE_STORECATEGORY,
  SAVE_STORECATEGORY_SUCCESS,

  DELETE_STORECATEGORY,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      storecategorys: null, // initial StoreCategory data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewStoreCategoryModal : false,
      viewStoreCategoryDialog:false,
      selectedStoreCategory: null,
      editStoreCategory : null,
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
      // get storecategorys
      case GET_STORECATEGORYS:

      let tableInfo = state.tableInfo;
        if(action.payload)
        {
          tableInfo.pageIndex  = action.payload.state.page;
          tableInfo.pageSize  = action.payload.state.pageSize;
          tableInfo.sorted  = action.payload.state.sorted;
          tableInfo.filtered = action.payload.state.filtered;
        }
      return { ...state , tableInfo : tableInfo};
      // get StoreCategory success
      case GET_STORECATEGORYS_SUCCESS:
      {
         let storecategorys = action.payload.data;

         return { ...state, storecategorys: storecategorys,selectAll : false,  tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
     }
     case OPEN_ADD_NEW_STORECATEGORY_MODEL :
     
              return { ...state, addNewStoreCategoryModal : true ,editMode : false ,editStoreCategory : null};
      case OPEN_ADD_NEW_STORECATEGORY_MODEL_SUCCESS:
               return { ...state,addNewStoreCategoryModal : true, editMode : false ,editStoreCategory : null};
    case CLOSE_ADD_NEW_STORECATEGORY_MODEL:
              return { ...state, addNewStoreCategoryModal : false ,editMode : false,editStoreCategory : null};
    case OPEN_EDIT_STORECATEGORY_MODEL:
        return { ...state, addNewStoreCategoryModal : true, editMode : true, editStoreCategory: null };
    case OPEN_EDIT_STORECATEGORY_MODEL_SUCCESS:
            let editStoreCategory = action.payload.data[0];
            if(editStoreCategory)
            {

               editStoreCategory.images =  JSON.parse(editStoreCategory.images);
               editStoreCategory.images = editStoreCategory.images || [];

        }
              return { ...state,editStoreCategory:editStoreCategory,taxcodecategorylist : action.payload.taxcodecategorylist,
                branchlist:action.payload.branchlist, parallelplanlist : action.payload.parallelplanlist };
     case OPEN_VIEW_STORECATEGORY_MODEL :
         return { ...state, viewStoreCategoryDialog : true , selectedStoreCategory : null};

      case OPEN_VIEW_STORECATEGORY_MODEL_SUCCESS:
        let selectedStoreCategory = action.payload.data[0];
        if(selectedStoreCategory)
        {
          selectedStoreCategory.images = JSON.parse(selectedStoreCategory.images);
           selectedStoreCategory.images = selectedStoreCategory.images || [];

           selectedStoreCategory.branchlist = selectedStoreCategory.branchlist ? JSON.parse(selectedStoreCategory.branchlist) : [];

           selectedStoreCategory.statusId =  selectedStoreCategory.statusId ? selectedStoreCategory.statusId.toString() : '';
      		 selectedStoreCategory.measurementunitId = selectedStoreCategory.measurementunitId ? selectedStoreCategory.measurementunitId.toString() : '';
      		 selectedStoreCategory.StoreCategorytypeId = selectedStoreCategory.StoreCategorytypeId ? selectedStoreCategory.StoreCategorytypeId.toString() : '';
      		 selectedStoreCategory.StoreCategoryvalidityId = selectedStoreCategory.StoreCategoryvalidityId ?  selectedStoreCategory.StoreCategoryvalidityId.toString() : '';

        }
              return { ...state,selectedStoreCategory:selectedStoreCategory,taxcodecategorylist : action.payload.taxcodecategorylist };
      case CLOSE_VIEW_STORECATEGORY_MODEL:
          return { ...state, viewStoreCategoryDialog : false ,selectedStoreCategory :null};
     case SAVE_STORECATEGORY:
                  return { ...state, dialogLoading : true, disabled : true };
      case SAVE_STORECATEGORY_SUCCESS:
                  return { ...state, dialogLoading : false,addNewStoreCategoryModal : false , editMode : false, editStoreCategory : null, disabled : false};


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
