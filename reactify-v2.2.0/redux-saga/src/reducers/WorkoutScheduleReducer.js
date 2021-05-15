import update from 'react-addons-update';

import {


  OPEN_ADD_NEW_WORKOUTSCHEDULE_MODEL,
  OPEN_ADD_NEW_WORKOUTSCHEDULE_MODEL_SUCCESS,
  CLOSE_ADD_NEW_WORKOUTSCHEDULE_MODEL,

  GET_WORKOUTSCHEDULES,
  GET_WORKOUTSCHEDULE_SUCCESS,

  SAVE_WORKOUTSCHEDULE,
  SAVE_WORKOUTSCHEDULE_SUCCESS,

  OPEN_VIEW_WORKOUTSCHEDULE_MODEL,
  OPEN_VIEW_WORKOUTSCHEDULE_MODEL_SUCCESS,
  CLOSE_VIEW_WORKOUTSCHEDULE_MODEL,

  OPEN_EDIT_WORKOUTSCHEDULE_MODEL,
  OPEN_EDIT_WORKOUTSCHEDULE_MODEL_SUCCESS,

  SAVE_PHASE,
  SAVE_PHASE_SUCCESS,


  OPEN_ADD_NEW_ALLOCATED_MEMBER_MODEL,
  CLOSE_ADD_NEW_ALLOCATED_MEMBER_MODEL,

  ON_NOTALLOCATEDMEMBERFILTER_CHANGE,

  OPEN_FILTER_WITH_WORKOUTENDDATE_MEMBER_MODEL,
  CLOSE_FILTER_WITH_WORKOUTENDDATE_MEMBER_MODEL,

  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewWorkoutScheduleModal : false,
      editMode :false,
      editWorkoutSchedules : null,
      schedules:null,
      selectedSchedule : null,
      viewWorkoutScheduleDialog : false,
      addNewPhaseModel : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      addNewNotAllocatedMemberModal : false,
      notAllocatedMemberDetail : null,
      allocatedmemberfilter : 0,
      filterwithworkoutenddate : 0,
      opnWorkoutEndDateModal : 0

};
export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case OPEN_ADD_NEW_WORKOUTSCHEDULE_MODEL :
           return { ...state, addNewWorkoutScheduleModal : true,notAllocatedMemberDetail:action.payload || null};
     case CLOSE_ADD_NEW_WORKOUTSCHEDULE_MODEL:
                   return { ...state, addNewWorkoutScheduleModal : false,editWorkoutSchedules : null,  editMode : false,notAllocatedMemberDetail:null};
      // get Workout Schedules
       case GET_WORKOUTSCHEDULES:
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
      // get workout schedules success
       case GET_WORKOUTSCHEDULE_SUCCESS:
                 return { ...state, schedules: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };
      // save workout routine
       case SAVE_WORKOUTSCHEDULE:
                 return { ...state, dialogLoading : true, disabled : true };
        // save workout routine success
      case SAVE_WORKOUTSCHEDULE_SUCCESS:
                return { ...state, dialogLoading : false, disabled : false,addNewNotAllocatedMemberModal : false,allocatedmemberfilter : 0,filterwithworkoutenddate: 0,opnWorkoutEndDateModal :false};
    // save Phase
      case SAVE_PHASE:
                return { ...state,addNewWorkoutScheduleModal : true};

       // open view workoutschedule model
      case OPEN_VIEW_WORKOUTSCHEDULE_MODEL:
                  return { ...state,selectedSchedule: null,viewWorkoutScheduleDialog : true};
     // open view workoutschedule model success
      case OPEN_VIEW_WORKOUTSCHEDULE_MODEL_SUCCESS:
                  return { ...state,selectedSchedule:action.payload.data[0]};
     // close view workoutschedule model
      case CLOSE_VIEW_WORKOUTSCHEDULE_MODEL:
                  return { ...state, viewWorkoutScheduleDialog : false };
    // open edit workoutschedule model
      case  OPEN_EDIT_WORKOUTSCHEDULE_MODEL:
                  return { ...state, addNewWorkoutScheduleModal : true, editMode : true, editWorkoutSchedules: null };
      // open edit workoutschedule model  success
        case OPEN_EDIT_WORKOUTSCHEDULE_MODEL_SUCCESS :
                let editWorkoutSchedules = action.payload.data[0];
                if(editWorkoutSchedules)
                {
                  editWorkoutSchedules.phases =  editWorkoutSchedules.phases ?  JSON.parse(editWorkoutSchedules.phases) : [] ;
                    editWorkoutSchedules.phases.forEach(x => x.workoutroutinedetail = x.workoutroutinedetail || [])
                }
                return { ...state,editWorkoutSchedules:editWorkoutSchedules};
      case OPEN_ADD_NEW_ALLOCATED_MEMBER_MODEL :
                return { ...state, addNewNotAllocatedMemberModal : true};
     case CLOSE_ADD_NEW_ALLOCATED_MEMBER_MODEL:
                return { ...state, addNewNotAllocatedMemberModal : false,editWorkoutSchedules : null,  editMode : false,allocatedmemberfilter : 0};

    case ON_NOTALLOCATEDMEMBERFILTER_CHANGE:
          {
              return update(state, {
                    [action.payload.key]: { $set: action.payload.value },
                });
            }

      case OPEN_FILTER_WITH_WORKOUTENDDATE_MEMBER_MODEL :
              return { ...state, opnWorkoutEndDateModal : true};
      case CLOSE_FILTER_WITH_WORKOUTENDDATE_MEMBER_MODEL:
              return { ...state, opnWorkoutEndDateModal : false,editWorkoutSchedules : null,  editMode : false,filterwithworkoutenddate : 0};


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
