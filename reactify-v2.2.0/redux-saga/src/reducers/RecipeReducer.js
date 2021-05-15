/**
 * EmployeeManagement Reducer
 */
import  VegRecipetype from 'Assets/data/recipetype_veg';
import  EggRecipetype from 'Assets/data/recipetype_egg';

// action types
import {
  OPEN_ADD_NEW_RECIPE_MODEL,
  CLOSE_ADD_NEW_RECIPE_MODEL,
  SAVE_RECIPE,
  SAVE_RECIPE_SUCCESS,
  GET_RECIPES,
  GET_RECIPES_SUCCESS,
  OPEN_EDIT_RECIPES_MODEL,
  OPEN_EDIT_RECIPES_MODEL_SUCCESS,
  OPEN_VIEW_RECIPES_MODEL,
  OPEN_VIEW_RECIPES_MODEL_SUCCESS,
  CLOSE_VIEW_RECIPES_MODEL,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
      recipes : null,
       loading : false,
       disabled : false,
       dialogLoading : false,
       editrecipe : null,
       editMode : false,
       addNewRecipeModal : false,
       viewRecipeDialog : false,
       selectedrecipe : null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
	   clone : false,
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

        case OPEN_ADD_NEW_RECIPE_MODEL :
            return { ...state, addNewRecipeModal : true ,editMode : false , editrecipe : null };
        case CLOSE_ADD_NEW_RECIPE_MODEL:
            return { ...state, addNewRecipeModal : false ,editMode : false , editrecipe : null};
        case SAVE_RECIPE:
                return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_RECIPE_SUCCESS:
                return { ...state, dialogLoading : false,addNewRecipeModal : false ,  editMode : false, editrecipe : null, disabled : false};
        case GET_RECIPES:
                    let tableInfo = state.tableInfo;

                      if(action.payload)
                        {
                          if(action.payload.state)
                          {
                            tableInfo.pageIndex  = action.payload.state.page;
                            tableInfo.pageSize  = action.payload.state.pageSize;
                            tableInfo.sorted  = action.payload.state.sorted;
                            tableInfo.filtered = action.payload.state.filtered;
                            tableInfo.foodlibraryfilter = action.payload.state.foodlibraryfilter;
                            tableInfo.customfoodfilter = action.payload.state.customfoodfilter;
                          }
                          else if(action.payload.foodlibraryfilter || action.payload.customfoodfilter) {
                              tableInfo.foodlibraryfilter = action.payload.foodlibraryfilter;
                              tableInfo.customfoodfilter = action.payload.customfoodfilter;
                          }
                        }

                  return { ...state , tableInfo : tableInfo};
        case GET_RECIPES_SUCCESS:
                       return { ...state, recipes:action.payload.data, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };
         case OPEN_EDIT_RECIPES_MODEL:
                        return { ...state, addNewRecipeModal : true, editMode : true, editrecipe: null ,clone : action.payload.clone || false};
        case OPEN_EDIT_RECIPES_MODEL_SUCCESS:
        let editrecipe = action.payload.data[0];
        if(editrecipe)
        {
          editrecipe.nutrition = JSON.parse(editrecipe.nutrition)
        }
                        return { ...state , editrecipe : editrecipe };
        case CLOSE_VIEW_RECIPES_MODEL:
                        return { ...state, viewRecipeDialog : false , selectedrecipe : null};
       case OPEN_VIEW_RECIPES_MODEL:
                        return { ...state, viewRecipeDialog : true , selectedrecipe : null};
       case OPEN_VIEW_RECIPES_MODEL_SUCCESS:
       let selectedrecipe = action.payload.data[0];
       if(selectedrecipe)
       {
          selectedrecipe.iseggfilleId = selectedrecipe.iseggfilleId > 0 ? selectedrecipe.iseggfilleId : '1';
          selectedrecipe.isnonvegId =  selectedrecipe.isnonvegId > 0 ?  selectedrecipe.isnonvegId : '1';
          selectedrecipe.nutrition = selectedrecipe.nutrition ? JSON.parse(selectedrecipe.nutrition) : [];
          if(selectedrecipe.nutrition.length > 0){
              selectedrecipe.nutrition = selectedrecipe.nutrition.filter(x => x.checked);
          }
       }
          return { ...state, selectedrecipe:selectedrecipe};


        default: return { ...state};
    }
}
