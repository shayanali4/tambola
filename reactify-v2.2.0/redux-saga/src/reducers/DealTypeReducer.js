
import update from 'react-addons-update';

// action types
import {
  GET_DEALTYPES,
  GET_DEALTYPES_SUCCESS,

  OPEN_ADD_NEW_DEALTYPE_MODEL,
  CLOSE_ADD_NEW_DEALTYPE_MODEL,
  OPEN_ADD_NEW_DEALTYPE_MODEL_SUCCESS,

  OPEN_EDIT_DEALTYPE_MODEL,
  OPEN_EDIT_DEALTYPE_MODEL_SUCCESS,

  OPEN_VIEW_DEALTYPE_MODEL,
  OPEN_VIEW_DEALTYPE_MODEL_SUCCESS,
  CLOSE_VIEW_DEALTYPE_MODEL,

  SAVE_DEALTYPE,
  SAVE_DEALTYPE_SUCCESS,

  DELETE_DEALTYPE,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      dealtypes: null, // initial DealType data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewDealTypeModal : false,
      viewDealTypeDialog:false,
      selectedDealType: null,
      editDealType : null,
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
      // get dealtypes
      case GET_DEALTYPES:

      let tableInfo = state.tableInfo;
        if(action.payload)
        {
          tableInfo.pageIndex  = action.payload.state.page;
          tableInfo.pageSize  = action.payload.state.pageSize;
          tableInfo.sorted  = action.payload.state.sorted;
          tableInfo.filtered = action.payload.state.filtered;
        }
      return { ...state , tableInfo : tableInfo};
      // get DealType success
      case GET_DEALTYPES_SUCCESS:
      {
         let dealtypes = action.payload.data;

         return { ...state, dealtypes: dealtypes,selectAll : false,  tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
     }
     case OPEN_ADD_NEW_DEALTYPE_MODEL :
     
              return { ...state, addNewDealTypeModal : true ,editMode : false ,editDealType : null};
      case OPEN_ADD_NEW_DEALTYPE_MODEL_SUCCESS:
               return { ...state,addNewDealTypeModal : true, editMode : false ,editDealType : null};
    case CLOSE_ADD_NEW_DEALTYPE_MODEL:
              return { ...state, addNewDealTypeModal : false ,editMode : false,editDealType : null};
    case OPEN_EDIT_DEALTYPE_MODEL:
        return { ...state, addNewDealTypeModal : true, editMode : true, editDealType: null };
    case OPEN_EDIT_DEALTYPE_MODEL_SUCCESS:
            let editDealType = action.payload.data[0];
            if(editDealType)
            {

               editDealType.images =  JSON.parse(editDealType.images);
               editDealType.images = editDealType.images || [];

        }
              return { ...state,editDealType:editDealType,taxcodecategorylist : action.payload.taxcodecategorylist,
                branchlist:action.payload.branchlist, parallelplanlist : action.payload.parallelplanlist };
     case OPEN_VIEW_DEALTYPE_MODEL :
         return { ...state, viewDealTypeDialog : true , selectedDealType : null};

      case OPEN_VIEW_DEALTYPE_MODEL_SUCCESS:
        let selectedDealType = action.payload.data[0];
        if(selectedDealType)
        {
          selectedDealType.images = JSON.parse(selectedDealType.images);
           selectedDealType.images = selectedDealType.images || [];

           selectedDealType.branchlist = selectedDealType.branchlist ? JSON.parse(selectedDealType.branchlist) : [];

           selectedDealType.statusId =  selectedDealType.statusId ? selectedDealType.statusId.toString() : '';
      		 selectedDealType.measurementunitId = selectedDealType.measurementunitId ? selectedDealType.measurementunitId.toString() : '';
      		 selectedDealType.DealTypetypeId = selectedDealType.DealTypetypeId ? selectedDealType.DealTypetypeId.toString() : '';
      		 selectedDealType.DealTypevalidityId = selectedDealType.DealTypevalidityId ?  selectedDealType.DealTypevalidityId.toString() : '';

        }
              return { ...state,selectedDealType:selectedDealType,taxcodecategorylist : action.payload.taxcodecategorylist };
      case CLOSE_VIEW_DEALTYPE_MODEL:
          return { ...state, viewDealTypeDialog : false ,selectedDealType :null};
     case SAVE_DEALTYPE:
                  return { ...state, dialogLoading : true, disabled : true };
      case SAVE_DEALTYPE_SUCCESS:
                  return { ...state, dialogLoading : false,addNewDealTypeModal : false , editMode : false, editDealType : null, disabled : false};


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
