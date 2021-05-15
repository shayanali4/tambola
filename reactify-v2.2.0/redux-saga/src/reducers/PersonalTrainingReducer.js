/**
 * MemberSubscription Reducer
 */

import Auth from '../Auth/Auth';
const authObject = new Auth();

import update from 'react-addons-update';


// action types
import {
  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  GET_MEMBER_PERSONALTRAINING_LIST,
  GET_MEMBER_PERSONALTRAINING_LIST_SUCCESS,

  OPEN_ADD_ASSIGNTRAINER_MODEL,
  OPEN_ADD_ASSIGNTRAINER_MODEL_SUCCESS,
  CLOSE_ADD_ASSIGNTRAINER_MODEL,

  SAVE_ASSIGNTRAINER,
  SAVE_ASSIGNTRAINER_SUCCESS,

  SAVE_PTSLOT,
  SAVE_PTSLOT_SUCCESS,
  SAVE_PTSLOT_FAILURE,

  OPEN_VIEW_PT_SLOT_MODEL,
  OPEN_VIEW_PT_SLOT_MODEL_SUCCESS,
  CLOSE_VIEW_PT_SLOT_MODEL,

  ADD_ROOM,
  SET_VIDEO,
  SET_AUDIO,

  SAVE_ONLINEACCESSURL,
  SAVE_ONLINEACCESSURL_SUCCESS,

  SAVE_NOTE_NEXTSESSION,
  SAVE_NOTE_NEXTSESSION_SUCCESS,

  DELETE_PT_SLOT,
  DELETE_PT_SLOT_SUCCESS,

  REQUEST_SUCCESS,
  REQUEST_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
      personaltrainingList:null,
       loading : false,
       disabled : false,
       dialogLoading : false,
        tableInfo : {
          pageSize : 10,
          pageIndex : 0,
          pages : 1,
          totalrecord :0,
        },
        tableInfoPTSlot : {
          pageSize : 10,
          pageIndex : 0,
          pages : 1,
          totalrecord :0,
        },
          addAssignTrainerDialog : false,
          employeeList:null,
          selectedTrainer:null,
          selectedPTslotdetail : null,
          viewPTSlotDialog : false,
          rooms:[],
          video: true,
          audio: true,
          onlineAccessUrlSaveSuccess : false,
          noteForNextSessionSaveSuccess : false,
          ptslotsavesuccess : false,
          ptslotdeletesuccess : false
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case ON_SHOW_LOADER:
            return { ...state, loading: true };

        case ON_HIDE_LOADER:
            return { ...state, loading : false };

           case GET_MEMBER_PERSONALTRAINING_LIST:
           let profileDetail = authObject.getProfile();
             let tableInfo = state.tableInfo;
          if(action.payload)
          {
              if(action.payload.state)
              {
                 tableInfo.pageIndex  = action.payload.state.page;
                 tableInfo.pageSize  = action.payload.state.pageSize;
                 tableInfo.sorted  = action.payload.state.sorted;
                 tableInfo.filtered = action.payload.state.filtered;
                 tableInfo.isTrainer = profileDetail.isTrainer;
                 tableInfo.ptlistfilter = action.payload.state.ptlistfilter;
               }
                 else{
                   tableInfo.ptlistfilter = action.payload.ptlistfilter;
                 }
          }
             return { ...state , tableInfo : tableInfo};

             case GET_MEMBER_PERSONALTRAINING_LIST_SUCCESS:
             let personaltrainingList = action.payload.data;
             personaltrainingList.forEach(x => x.schedule = x.schedule ? JSON.parse(x.schedule) : null);

               return { ...state, personaltrainingList:personaltrainingList , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };
             case OPEN_ADD_ASSIGNTRAINER_MODEL :

                   return { ...state ,addAssignTrainerDialog : true, selectedTrainer : action.payload.data , dialogLoading : true};
             case OPEN_ADD_ASSIGNTRAINER_MODEL_SUCCESS:

              return { ...state,employeeList:action.payload.employeeList,addAssignTrainerDialog : true, dialogLoading : false};

             case CLOSE_ADD_ASSIGNTRAINER_MODEL:
                               return { ...state, addAssignTrainerDialog : false};
             case SAVE_ASSIGNTRAINER:
                           return { ...state,  dialogLoading : true, disabled : true };
             case SAVE_ASSIGNTRAINER_SUCCESS:
                           return { ...state, dialogLoading : false,addAssignTrainerDialog : false ,  editMode : false, disabled : false};
            // save pt slot
            case SAVE_PTSLOT:
                    return { ...state, dialogLoading : true, disabled : true,ptslotsavesuccess : false,ptslotdeletesuccess : false  };
           // save pt slot success
           case SAVE_PTSLOT_SUCCESS:
                 return { ...state, dialogLoading : false, disabled : false,ptslotsavesuccess : true  };
         // save pt slot success
        case SAVE_PTSLOT_FAILURE:
                return { ...state, dialogLoading : false, disabled : false ,gymaccessslotid:null,ptslotsavesuccess : false };

          case CLOSE_VIEW_PT_SLOT_MODEL:
                          return { ...state, viewPTSlotDialog : false , selectedPTslotdetail : null};
          case OPEN_VIEW_PT_SLOT_MODEL:
              let tableInfoPTSlot = state.tableInfoPTSlot;
                 if(action.payload)
                   {
                       if(action.payload.date){
                          tableInfoPTSlot.date  = action.payload.date;
                          tableInfoPTSlot.startTime  = action.payload.starttime;
                          tableInfoPTSlot.staffid  = action.payload.staffid;
                           }
                      else{
                          tableInfoPTSlot.pageIndex  = action.payload.state.page;
                          tableInfoPTSlot.pageSize  = action.payload.state.pageSize;
                          tableInfoPTSlot.sorted  = action.payload.state.sorted;
                          tableInfoPTSlot.filtered = action.payload.state.filtered;
                           }
                  }
                    return { ...state, viewPTSlotDialog : true , selectedPTslotdetail : null, tableInfoPTSlot : tableInfoPTSlot};
          case OPEN_VIEW_PT_SLOT_MODEL_SUCCESS:
                          return { ...state, selectedPTslotdetail:action.payload.data, tableInfoPTSlot : {...state.tableInfoPTSlot , pages : action.payload.pages[0].pages}};

          case ADD_ROOM:
                return update(state, {
                              rooms: {
                                $push: [action.payload]
                              },
                            });
          case SET_VIDEO:
                return { ...state,  video : action.payload };
          case SET_AUDIO:
                return { ...state,  audio : action.payload };
          // SAVE ONLINE ACCESS URL
          case SAVE_ONLINEACCESSURL:
                        return { ...state,  dialogLoading : true, disabled : true,onlineAccessUrlSaveSuccess : false };
          // SAVE ONLINE ACCESS URL SUCCESS
          case SAVE_ONLINEACCESSURL_SUCCESS:
                        return { ...state, dialogLoading : false,editMode : false, disabled : false,onlineAccessUrlSaveSuccess : true};
          // SAVE NOTE FOR NEXT SESSION
          case SAVE_NOTE_NEXTSESSION:
                        return { ...state,  dialogLoading : true, disabled : true,noteForNextSessionSaveSuccess : false };
          // SAVE NOTE FOR NEXT SESSION SUCCESS
          case SAVE_NOTE_NEXTSESSION_SUCCESS:
                        return { ...state, dialogLoading : false,editMode : false, disabled : false,noteForNextSessionSaveSuccess : true};

          // delete pt slot
          case DELETE_PT_SLOT:
                        return { ...state, dialogLoading : true, disabled : true,ptslotdeletesuccess : false ,ptslotsavesuccess: false };

          // delete pt slot success
           case DELETE_PT_SLOT_SUCCESS:
                  return { ...state, dialogLoading : false, disabled : false,ptslotdeletesuccess : true  };

            case REQUEST_FAILURE:
                return { ...state , loading : false, dialogLoading : false, disabled : false};

            case REQUEST_SUCCESS:
                return { ...state};

        default: return { ...state};
    }
}
