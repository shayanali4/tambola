/**
 * EmployeeManagement Reducer
 */

// action types
import {
    OPEN_ADD_NEW_WORKOUTROUTINE_MODEL,
    CLOSE_ADD_NEW_WORKOUTROUTINE_MODEL,

    GET_WORKOUTROUTINES,
    GET_WORKOUTROUTINE_SUCCESS,

    SAVE_WORKOUTROUTINE,
    SAVE_WORKOUTROUTINE_SUCCESS,

    DELETE_WORKOUTROUTINE,

    OPEN_EDIT_WORKOUTROUTINE_MODEL,
    OPEN_EDIT_WORKOUTROUTINE_MODEL_SUCCESS,

    OPEN_VIEW_WORKOUTROUTINE_MODEL,
    OPEN_VIEW_WORKOUTROUTINE_MODEL_SUCCESS,
    CLOSE_VIEW_WORKOUTROUTINE_MODEL,

// workout routine day
    OPEN_ADD_NEW_WORKOUTROUTINEDAY_MODEL,
    CLOSE_ADD_NEW_WORKOUTROUTINEDAY_MODEL,

    SAVE_WORKOUTROUTINEDAY,
    SAVE_WORKOUTROUTINEDAY_SUCCESS,

    OPEN_EDIT_WORKOUTROUTINEDAY_MODEL,
    OPEN_EDIT_WORKOUTROUTINEDAY_MODEL_SUCCESS,

    DELETE_WORKOUTROUTINEDAY,

    SAVE_WORKOUEXERCISE,
    SAVE_WORKOUTEXERCISE_SUCCESS,

    REQUEST_SUCCESS,
    REQUEST_FAILURE,
    ON_SHOW_LOADER,
    ON_HIDE_LOADER
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		workoutroutines: null, // initial employee data
      disabled : false,
      loading : false,
      dialogLoading : false,
      addNewWorkoutRoutineModal : false,
      viewWorkoutRoutineDialog:false,
      selectedworkoutroutine: null,
      editworkoutroutine : null,
      editMode : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },

      // WORKOUT ROUTINE DAY
      addNewWorkoutRoutineDayModal : false,
      editWorkoutRoutineDay : null,
      clone : false

};

export default (state = INIT_STATE, action) => {

    switch (action.type) {

      // get workoutroutines
        case GET_WORKOUTROUTINES:
            let tableInfo = state.tableInfo;
              if(action.payload)
              {
                tableInfo.pageIndex  = action.payload.state.page;
                tableInfo.pageSize  = action.payload.state.pageSize;
                tableInfo.sorted  = action.payload.state.sorted;
                tableInfo.filtered = action.payload.state.filtered;
              }
            return { ...state , tableInfo : tableInfo};
        // get workoutroutines success
        case GET_WORKOUTROUTINE_SUCCESS:

            return { ...state, workoutroutines: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

        case OPEN_ADD_NEW_WORKOUTROUTINE_MODEL :
            return { ...state, addNewWorkoutRoutineModal : true, editMode : false , editworkoutroutine : null };
        case CLOSE_ADD_NEW_WORKOUTROUTINE_MODEL :
            return { ...state, addNewWorkoutRoutineModal : false , editMode : false , editworkoutroutine : null };
        case SAVE_WORKOUTROUTINE:
                return { ...state, dialogLoading : true, disabled : true };
          // save employees success
        case SAVE_WORKOUTROUTINE_SUCCESS:
                return { ...state,addNewWorkoutRoutineModal : false, dialogLoading : false, editMode : false, editworkoutroutine : null, disabled : false};
                        //
          case OPEN_EDIT_WORKOUTROUTINE_MODEL:
                          return { ...state, addNewWorkoutRoutineModal : true, editMode : true, editworkoutroutine: null,clone : action.payload.clone || false };
          case OPEN_EDIT_WORKOUTROUTINE_MODEL_SUCCESS:
                        return { ...state , editworkoutroutine : action.payload.data[0]  };

            case CLOSE_VIEW_WORKOUTROUTINE_MODEL:

                            return { ...state, viewWorkoutRoutineDialog : false , selectedworkoutroutine : null};
          case OPEN_VIEW_WORKOUTROUTINE_MODEL:

                          return { ...state, viewWorkoutRoutineDialog : true , selectedworkoutroutine : null};
            case OPEN_VIEW_WORKOUTROUTINE_MODEL_SUCCESS:
            {
                      let  selectedworkoutroutine = action.payload.data[0];

                      selectedworkoutroutine.workoutroutinedetail = selectedworkoutroutine.workoutroutinedetail ? JSON.parse(selectedworkoutroutine.workoutroutinedetail) : null;

                          return { ...state, selectedworkoutroutine: selectedworkoutroutine};
             }
          // WORKOUT ROUTINE DAY
            case OPEN_ADD_NEW_WORKOUTROUTINEDAY_MODEL :
                      return { ...state, addNewWorkoutRoutineDayModal : true ,editWorkoutRoutineDay: null};
            case CLOSE_ADD_NEW_WORKOUTROUTINEDAY_MODEL :
                      return { ...state, addNewWorkoutRoutineDayModal : false ,editWorkoutRoutineDay: null };

            case SAVE_WORKOUTROUTINEDAY:
                    return { ...state, dialogLoading : true, disabled : true };
                        // save employees success
            case SAVE_WORKOUTROUTINEDAY_SUCCESS:
                      return { ...state,addNewWorkoutRoutineDayModal : false, dialogLoading : false, disabled : false,editWorkoutRoutineDay:null};

                                      //
            case OPEN_EDIT_WORKOUTROUTINEDAY_MODEL:
                          return { ...state, addNewWorkoutRoutineDayModal : true, editWorkoutRoutineDay: action.payload };
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
