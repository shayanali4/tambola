
// action types
import {
  OPEN_ADD_NEW_EXERCISE_MODEL,
  CLOSE_ADD_NEW_EXERCISE_MODEL,
  SAVE_EXERCISE,
  SAVE_EXERCISE_SUCCESS,
  GET_EXERCISES,
  GET_EXERCISES_SUCCESS,
  OPEN_EDIT_EXERCISES_MODEL,
  OPEN_EDIT_EXERCISES_MODEL_SUCCESS,
  OPEN_VIEW_EXERCISES_MODEL,
  OPEN_VIEW_EXERCISES_MODEL_SUCCESS,
  CLOSE_VIEW_EXERCISES_MODEL,
  SAVE_FAVORITE_EXERCISE,
  SAVE_FAVORITE_EXERCISE_FAILURE,
  SAVE_FAVORITE_EXERCISE_SUCCESS,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
  exercises: null, // initial class data
  loading : false,
  disabled : false,
  dialogLoading : false,
  addNewExerciseModal : false,
  selectedExercise: null,
  editexercise : null,
  editMode : false,
  viewExerciseDialog:false,
  tableInfo : {
    pageSize : 10,
    pageIndex : 0,
    pages : 1,
    totalrecord :0,
  },
  selectedExerciseForFavorite: null,
  isfavouritesavefailed : false,
  favoritexercises : null,
  isfavouritesavesuccess : true
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

      // get employees
        case GET_EXERCISES:
            let tableInfo = state.tableInfo;

              if(action.payload)
                {
                  if(action.payload.state)
                  {
                    tableInfo.pageIndex  = action.payload.state.page;
                    tableInfo.pageSize  = action.payload.state.pageSize;
                    tableInfo.sorted  = action.payload.state.sorted;
                    tableInfo.filtered = action.payload.state.filtered;
                    tableInfo.userId = action.payload.state.userId;
                    tableInfo.exerciselibraryfilter = action.payload.state.exerciselibraryfilter;
                    tableInfo.customexercisefilter = action.payload.state.customexercisefilter;
                  }
                  else if(action.payload.exerciselibraryfilter || action.payload.customexercisefilter) {
                      tableInfo.exerciselibraryfilter = action.payload.exerciselibraryfilter;
                      tableInfo.customexercisefilter = action.payload.customexercisefilter;
                  }
                }

            return { ...state , tableInfo : tableInfo,isfavouritesavefailed : false,isfavouritesavesuccess : false};
        // get employees success
        case GET_EXERCISES_SUCCESS:
            return { ...state, exercises: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };


        case OPEN_ADD_NEW_EXERCISE_MODEL :
            return { ...state, addNewExerciseModal : true, editMode : false , editexercise : null ,isfavouritesavefailed : false,isfavouritesavesuccess : false};
        case CLOSE_ADD_NEW_EXERCISE_MODEL :
            return { ...state, addNewExerciseModal : false , editMode : false , editexercise : null };
        case SAVE_EXERCISE:
              return { ...state, dialogLoading : true, disabled : true };
          // save employees success
        case SAVE_EXERCISE_SUCCESS:
              return { ...state,addNewExerciseModal : false, dialogLoading : false, editMode : false, editexercise : null, disabled : false};

      case OPEN_EDIT_EXERCISES_MODEL:
              return { ...state, addNewExerciseModal : true, editMode : true, editexercise: null ,isfavouritesavefailed : false,isfavouritesavesuccess : false};
      case OPEN_EDIT_EXERCISES_MODEL_SUCCESS:
                let editexercise = action.payload.data[0];
                if(editexercise)
                {
                  editexercise.images = JSON.parse(editexercise.images);
                }
                return { ...state, editexercise: editexercise };

      case CLOSE_VIEW_EXERCISES_MODEL:
              return { ...state, viewExerciseDialog : false , selectedExercise : null};
      case OPEN_VIEW_EXERCISES_MODEL:
              return { ...state, viewExerciseDialog : true , selectedExercise :null,isfavouritesavefailed : false,isfavouritesavesuccess : false};
      case OPEN_VIEW_EXERCISES_MODEL_SUCCESS:
          let selectedExercise = action.payload.data[0];
          if(selectedExercise)
          {
            selectedExercise.images =  selectedExercise.images ?  JSON.parse(selectedExercise.images) : []  ;
          }
                return { ...state,selectedExercise:selectedExercise};

      case SAVE_FAVORITE_EXERCISE:
          let selectedExerciseFavorite = action.payload;
          return { ...state , selectedExerciseForFavorite : selectedExerciseFavorite,isfavouritesavefailed : false,isfavouritesavesuccess : false};

      case SAVE_FAVORITE_EXERCISE_SUCCESS:
              return { ...state , isfavouritesavesuccess : true};

      case SAVE_FAVORITE_EXERCISE_FAILURE:
          return { ...state , isfavouritesavefailed : true};

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
