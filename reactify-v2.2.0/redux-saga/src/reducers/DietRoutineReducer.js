/**
 * EmployeeManagement Reducer
 */
import  VegRecipetype from 'Assets/data/recipetype_veg';
import  EggRecipetype from 'Assets/data/recipetype_egg';
import Mealplan  from 'Assets/data/mealplan';

// action types
import {
  OPEN_ADD_NEW_DIET_ROUTINE_MODEL,
  CLOSE_ADD_NEW_DIET_ROUTINE_MODEL,
  SAVE_DIET_ROUTINE,
  SAVE_DIET_ROUTINE_SUCCESS,
  GET_DIET_ROUTINES,
  GET_DIET_ROUTINES_SUCCESS,
  OPEN_EDIT_DIET_ROUTINE_MODEL,
  OPEN_EDIT_DIET_ROUTINE_MODEL_SUCCESS,
  OPEN_VIEW_DIET_ROUTINE_MODEL,
  OPEN_VIEW_DIET_ROUTINE_MODEL_SUCCESS,
  CLOSE_VIEW_DIET_ROUTINE_MODEL,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
      dietroutines : null,
       loading : false,
       disabled : false,
       dialogLoading : false,
       editdietroutine : null,
       editMode : false,
       addNewDietRoutineModal : false,
       viewDietRoutineDialog : false,
       selectedDietroutine : null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      clone : false
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

        case OPEN_ADD_NEW_DIET_ROUTINE_MODEL :
            return { ...state, addNewDietRoutineModal : true ,editMode : false , editdietroutine : null };
        case CLOSE_ADD_NEW_DIET_ROUTINE_MODEL:
            return { ...state, addNewDietRoutineModal : false ,editMode : false , editdietroutine : null};
        case SAVE_DIET_ROUTINE:
                return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_DIET_ROUTINE_SUCCESS:
                return { ...state, dialogLoading : false , disabled : false};
        case GET_DIET_ROUTINES:
                    let tableInfo = state.tableInfo;
                      if(action.payload)
                      {
                        tableInfo.pageIndex  = action.payload.state.page;
                        tableInfo.pageSize  = action.payload.state.pageSize;
                        tableInfo.sorted  = action.payload.state.sorted;
                        tableInfo.filtered = action.payload.state.filtered;
                      }
                  return { ...state , tableInfo : tableInfo};
        case GET_DIET_ROUTINES_SUCCESS:

            let dietroutines =  action.payload.data ;

            dietroutines.forEach(y => {y.isnonvegid = VegRecipetype.filter(value => value.name == y.isnonveg).map(x => x.value)[0],
            y.iseggfilleid = EggRecipetype.filter(value => value.name == y.iseggfille).map(x => x.value)[0]} )

                       return { ...state, dietroutines:dietroutines, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

           case CLOSE_VIEW_DIET_ROUTINE_MODEL:

                                       return { ...state, viewDietRoutineDialog : false , selectedDietroutine : null};
             case OPEN_VIEW_DIET_ROUTINE_MODEL:

                                     return { ...state, viewDietRoutineDialog : true , selectedDietroutine : null};
             case OPEN_VIEW_DIET_ROUTINE_MODEL_SUCCESS:
                       {
                                 let  selectedDietroutine = action.payload.data[0];

                                 selectedDietroutine.mealplan = selectedDietroutine.mealplan ?  Mealplan.filter(value => value.name == selectedDietroutine.mealplan).map(x => x.value)[0] : '1';


                                     return { ...state, selectedDietroutine: selectedDietroutine};
                        }
            case OPEN_EDIT_DIET_ROUTINE_MODEL:
                                        return { ...state, addNewDietRoutineModal : true, editMode : true, editdietroutine: null,clone : action.payload.clone || false };
          case OPEN_EDIT_DIET_ROUTINE_MODEL_SUCCESS:
                                return { ...state , editdietroutine : action.payload.data[0]};
      default: return { ...state};
    }
}
