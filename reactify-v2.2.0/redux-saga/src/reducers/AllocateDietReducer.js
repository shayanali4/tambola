import update from 'react-addons-update';

import {


  OPEN_ADD_NEW_ALLOCATEDIET_MODEL,
  CLOSE_ADD_NEW_ALLOCATEDIET_MODEL,

  SAVE_ALLOCATEDIET,
  SAVE_ALLOCATEDIET_SUCCESS,

  GET_ALLOCATEDIETS,
  GET_ALLOCATEDIET_SUCCESS,

  SAVE_DIET_PHASE,

  OPEN_EDIT_ALLOCATEDIET_MODEL,
  OPEN_EDIT_ALLOCATEDIET_MODEL_SUCCESS,

  OPEN_VIEW_ALLOCATEDIET_MODEL,
  OPEN_VIEW_ALLOCATEDIET_MODEL_SUCCESS,
  CLOSE_VIEW_ALLOCATEDIET_MODEL,

  ON_DIETNOTALLOCATEDMEMBERFILTER_CHANGE,

  OPEN_ADD_NEW_DIET_NOT_ALLOCATED_MEMBER_MODEL,
  CLOSE_ADD_NEW_DIET_NOT_ALLOCATED_MEMBER_MODEL,

  OPEN_FILTER_WITH_DIETENDDATE_MEMBER_MODEL,
  CLOSE_FILTER_WITH_DIETENDDATE_MEMBER_MODEL,

  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewAllocateDietModal : false,
      editMode :false,
      editAllocateDiets : null,
      dietschedules:null,
      selectedDietSchedule : null,
      viewAllocateDietDialog : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      notallocatedmemberfilter : 0,
      addNewNotAllocatedMemberModal : false,
      notAllocatedMemberDetail : null,
      filterwithDietenddate : 0,
      opnDietEndDateModal : 0


};
export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case OPEN_ADD_NEW_ALLOCATEDIET_MODEL :
           return { ...state, addNewAllocateDietModal : true,notAllocatedMemberDetail:action.payload || null};
     case CLOSE_ADD_NEW_ALLOCATEDIET_MODEL:
                   return { ...state, addNewAllocateDietModal : false,editAllocateDiets : null,  editMode : false,notAllocatedMemberDetail:null};
      // get Workout Schedules
       case GET_ALLOCATEDIETS:
                let tableInfo = state.tableInfo;

                   if(action.payload)
                   {
                     if(action.payload.state)
                     {
                       tableInfo.pageIndex  = action.payload.state.page;
                       tableInfo.pageSize  = action.payload.state.pageSize;
                       tableInfo.sorted  = action.payload.state.sorted;
                       tableInfo.filtered = action.payload.state.filtered;
                       tableInfo.archivedworkoutfilter = action.payload.state.archivedworkoutfilter;
                     }
                     else {
                       tableInfo.archivedworkoutfilter = action.payload.archivedworkoutfilter;
                     }
                   }
                 return { ...state , tableInfo : tableInfo};
      // get workout dietschedules success
       case GET_ALLOCATEDIET_SUCCESS:
                 return { ...state, dietschedules: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };
      // save workout routine
       case SAVE_ALLOCATEDIET:
                 return { ...state, dialogLoading : true, disabled : true };
        // save workout routine success
      case SAVE_ALLOCATEDIET_SUCCESS:
                return { ...state, dialogLoading : false, disabled : false,addNewNotAllocatedMemberModal : false,notallocatedmemberfilter : 0,filterwithDietenddate : 0 };
    // save Phase
      case SAVE_DIET_PHASE:
                  return { ...state,addNewAllocateDietModal : true};
    // open edit allocatediet model
          case  OPEN_EDIT_ALLOCATEDIET_MODEL:
                    return { ...state, addNewAllocateDietModal : true, editMode : true, editAllocateDiets: null };
    // open edit allocatediet model  success
        case OPEN_EDIT_ALLOCATEDIET_MODEL_SUCCESS :
                    let editAllocateDiets = action.payload.data[0];

                    return { ...state,editAllocateDiets:editAllocateDiets};
      // open view allocatediet model
       case OPEN_VIEW_ALLOCATEDIET_MODEL:
                   return { ...state,selectedDietSchedule: null,viewAllocateDietDialog : true};
     // open view allocatediet model success
       case OPEN_VIEW_ALLOCATEDIET_MODEL_SUCCESS:
                  let selectedDietSchedule = action.payload.data[0];

                     return { ...state,selectedDietSchedule:selectedDietSchedule};
      // close view allocatediet model
      case CLOSE_VIEW_ALLOCATEDIET_MODEL:
                     return { ...state, viewAllocateDietDialog : false };
       case ON_DIETNOTALLOCATEDMEMBERFILTER_CHANGE:
              {
                  return update(state, {
                       [action.payload.key]: { $set: action.payload.value },
               });
          }

        case OPEN_ADD_NEW_DIET_NOT_ALLOCATED_MEMBER_MODEL :
                    return { ...state, addNewNotAllocatedMemberModal : true};
       case CLOSE_ADD_NEW_DIET_NOT_ALLOCATED_MEMBER_MODEL:
                    return { ...state, addNewNotAllocatedMemberModal : false,editAllocateDiets : null,  editMode : false,notallocatedmemberfilter : 0};

      case OPEN_FILTER_WITH_DIETENDDATE_MEMBER_MODEL :
                    return { ...state, opnDietEndDateModal : true};
      case CLOSE_FILTER_WITH_DIETENDDATE_MEMBER_MODEL:
                    return { ...state, opnDietEndDateModal : false,editAllocateDiets : null,  editMode : false,filterwithDietenddate : 0};

      case REQUEST_FAILURE:
              return { ...state , loading : false, dialogLoading : false, disabled : false};
      case REQUEST_SUCCESS:
                return { ...state};
      case ON_SHOW_LOADER:
                return { ...state, loading : true, disabled : true};
      case ON_HIDE_LOADER:
             return { ...state, loading : false, dialogLoading : false, disabled : false};
      break;
                 default: return { ...state};
         }
       }
