/**
 * holidays Reducer
 */

// action types
import {
  OPEN_ADD_NEW_HOLIDAYS_MODEL,
  CLOSE_ADD_NEW_HOLIDAYS_MODEL,
  SAVE_HOLIDAYS,
  SAVE_HOLIDAYS_SUCCESS,
  GET_HOLIDAYS,
  GET_HOLIDAYS_SUCCESS,
  OPEN_VIEW_HOLIDAYS_MODEL,
  OPEN_VIEW_HOLIDAYS_MODEL_SUCCESS,
  CLOSE_VIEW_HOLIDAYS_MODEL,
  OPEN_EDIT_HOLIDAYS_MODEL,
  OPEN_EDIT_HOLIDAYS_MODEL_SUCCESS,

  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		 holidays: null, // initial member data
       loading : false,
       disabled : false,
       dialogLoading : false,
       addNewHolidaysModal : false,
       viewHolidaysDialog:false,
       selectedholidays: null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      editMode :  false,
      editholidays : null
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

        case OPEN_ADD_NEW_HOLIDAYS_MODEL :
            return { ...state, addNewHolidaysModal : true,editMode : false,editholidays : null};
        case CLOSE_ADD_NEW_HOLIDAYS_MODEL:
            return { ...state, addNewHolidaysModal : false,editMode : false,editholidays : null};
        case SAVE_HOLIDAYS:
            return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_HOLIDAYS_SUCCESS:

            return { ...state, dialogLoading : false,addNewHolidaysModal : false , disabled : false,editMode : false,editholidays : null};
        case GET_HOLIDAYS:

            let tableInfo = state.tableInfo;
              if(action.payload)
              {
                if(action.payload.state)
                {
                  tableInfo.pageIndex  = action.payload.state.page;
                  tableInfo.pageSize  = action.payload.state.pageSize;
                  tableInfo.sorted  = action.payload.state.sorted;
                  tableInfo.filtered = action.payload.state.filtered;
                  tableInfo.year = action.payload.state.year;
                }
                else if(action.payload.year) {
                    tableInfo.year = action.payload.year;
                }
              }

          return { ...state , tableInfo : tableInfo};
          case GET_HOLIDAYS_SUCCESS:
             return { ...state, holidays: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

          case CLOSE_VIEW_HOLIDAYS_MODEL:
             return { ...state, viewHolidaysDialog : false , selectedholidays : null};
          case OPEN_VIEW_HOLIDAYS_MODEL:
             return { ...state, viewHolidaysDialog : true , selectedholidays : null};
          case OPEN_VIEW_HOLIDAYS_MODEL_SUCCESS:
          let selectedholidays = action.payload.data[0];

             return { ...state, selectedholidays:selectedholidays};
     case OPEN_EDIT_HOLIDAYS_MODEL:
             return { ...state, addNewHolidaysModal : true, editMode : true, editholidays: null };

     case OPEN_EDIT_HOLIDAYS_MODEL_SUCCESS: 
             let editholidays = action.payload.data[0];
                      return { ...state,addeditHolidaysModal : true,editholidays:editholidays};


        default: return { ...state};
    }
}
