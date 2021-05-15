/**
 * resultandtestimonial Reducer
 */
 import update from 'react-addons-update';

// action types
import {
  OPEN_ADD_NEW_RESULTANDTESTIMONIAL_MODEL,
  OPEN_ADD_NEW_RESULTANDTESTIMONIAL_MODEL_SUCCESS,
  CLOSE_ADD_NEW_RESULTANDTESTIMONIAL_MODEL,

  SAVE_RESULTANDTESTIMONIAL,
  SAVE_RESULTANDTESTIMONIAL_SUCCESS,
  GET_RESULTANDTESTIMONIAL,
  GET_RESULTANDTESTIMONIAL_SUCCESS,
  OPEN_VIEW_RESULTANDTESTIMONIAL_MODEL,
  OPEN_VIEW_RESULTANDTESTIMONIAL_MODEL_SUCCESS,
  CLOSE_VIEW_RESULTANDTESTIMONIAL_MODEL,
  DELETE_RESULTANDTESTIMONIAL,
  OPEN_EDIT_RESULTANDTESTIMONIAL_MODEL,
  OPEN_EDIT_RESULTANDTESTIMONIAL_MODEL_SUCCESS,
  RESULTANDTESTIMONIAL_HANDLE_CHANGE_SELECT_ALL,
  RESULTANDTESTIMONIAL_HANDLE_SINGLE_CHECKBOX_CHANGE,
  OPEN_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL,
  CLOSE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL,
  OPEN_DISABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL,
  CLOSE_DISABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL,
  SAVE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL,
  SAVE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_SUCCESS,

  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		 resultandtestimonial: null, // initial member data
       loading : false,
       disabled : false,
       dialogLoading : false,
       addNewResultAndTestimonialModal : false,
       viewResultAndTestimonialDialog:false,
       selectedResultAndTestimonial: null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      editMode :  false,
      editResultAndTestimonial : null,
      selectAll: false,
      opnEnablePublishingStatusResultAndTestimonialDialog : false,
      opnDisablePublishingStatusResultAndTestimonialDialog : false,
      enablePublishingStatusResultAndTestimonialData : null,
      employeeList : null,
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

        case OPEN_ADD_NEW_RESULTANDTESTIMONIAL_MODEL :
            return { ...state, addNewResultAndTestimonialModal : true,editMode : false,editResultAndTestimonial : null};

        case OPEN_ADD_NEW_RESULTANDTESTIMONIAL_MODEL_SUCCESS:
          return { ...state, addNewResultAndTestimonialModal : true,employeeList : action.payload.employeeList,editMode : false ,editResultAndTestimonial : null};

        case CLOSE_ADD_NEW_RESULTANDTESTIMONIAL_MODEL:
            return { ...state, addNewResultAndTestimonialModal : false,editMode : false,editResultAndTestimonial : null};

        case SAVE_RESULTANDTESTIMONIAL:
            return { ...state,  dialogLoading : true, disabled : true };

        case SAVE_RESULTANDTESTIMONIAL_SUCCESS:
            return { ...state, dialogLoading : false,addNewResultAndTestimonialModal : false , disabled : false,editMode : false,editResultAndTestimonial : null};

        case GET_RESULTANDTESTIMONIAL:
            let tableInfo = state.tableInfo;
            if(action.payload)
            {
              tableInfo.pageIndex  = action.payload.state.page;
              tableInfo.pageSize  = action.payload.state.pageSize;
              tableInfo.sorted  = action.payload.state.sorted;
              tableInfo.filtered = action.payload.state.filtered;
            }

          return { ...state , tableInfo : tableInfo};

        case GET_RESULTANDTESTIMONIAL_SUCCESS:
             return { ...state, resultandtestimonial: action.payload.data ,selectAll : false, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

        case CLOSE_VIEW_RESULTANDTESTIMONIAL_MODEL:
             return { ...state, viewResultAndTestimonialDialog : false , selectedResultAndTestimonial : null};
        case OPEN_VIEW_RESULTANDTESTIMONIAL_MODEL:
             return { ...state, viewResultAndTestimonialDialog : true , selectedResultAndTestimonial : null};
       case OPEN_VIEW_RESULTANDTESTIMONIAL_MODEL_SUCCESS:
             return { ...state, selectedResultAndTestimonial:action.payload.data[0]};

       case OPEN_EDIT_RESULTANDTESTIMONIAL_MODEL:
             return { ...state, addNewResultAndTestimonialModal : true, editMode : true, editResultAndTestimonial: null };

      case OPEN_EDIT_RESULTANDTESTIMONIAL_MODEL_SUCCESS:
          return { ...state,addNewResultAndTestimonialModal : true,editResultAndTestimonial:action.payload.data[0] , employeeList : action.payload.employeeList ? action.payload.employeeList : state.employeeList};


      case RESULTANDTESTIMONIAL_HANDLE_CHANGE_SELECT_ALL:

              var selectAll = !state.selectAll;
              state.resultandtestimonial.forEach(x =>{ x.checked = action.payload.value});
              return update(state, {
                    selectAll: { $set:selectAll },
              });

      case RESULTANDTESTIMONIAL_HANDLE_SINGLE_CHECKBOX_CHANGE:

              let resultandtestimonialIndex = state.resultandtestimonial.indexOf(action.payload.data);
              return update(state, {
                 resultandtestimonial: {
                 [resultandtestimonialIndex]: {
                      checked: { $set: action.payload.value },
                      }
                    }
            });
      case OPEN_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL :
                         return { ...state, opnEnablePublishingStatusResultAndTestimonialDialog : true,editMode : false , editResultAndTestimonial : null,enablePublishingStatusResultAndTestimonialData : action.payload};

      case CLOSE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL:
                         return { ...state, opnEnablePublishingStatusResultAndTestimonialDialog : false, editMode : false , editResultAndTestimonial : null ,enablePublishingStatusResultAndTestimonialData : null};

      case OPEN_DISABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL :
                         return { ...state, opnDisablePublishingStatusResultAndTestimonialDialog : true,editMode : false , editResultAndTestimonial : null,enablePublishingStatusResultAndTestimonialData : action.payload};

      case CLOSE_DISABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_MODEL:
                         return { ...state, opnDisablePublishingStatusResultAndTestimonialDialog : false, editMode : false , editResultAndTestimonial : null ,enablePublishingStatusResultAndTestimonialData : null};

      case SAVE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL:
                         return { ...state,dialogLoading : true, disabled : true};
      case SAVE_ENABLEPUBLISHINGSTATUS_RESULTANDTESTIMONIAL_SUCCESS:
                          return { ...state,opnEnablePublishingStatusResultAndTestimonialDialog : false,opnDisablePublishingStatusResultAndTestimonialDialog :false,dialogLoading : false,enablePublishingStatusResultAndTestimonialData : null,editMode : false, editResultAndTestimonial : null, disabled : false};


        default: return { ...state};
    }
}
