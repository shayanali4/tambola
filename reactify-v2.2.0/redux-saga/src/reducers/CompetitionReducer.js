// action types
import {
OPEN_ADD_NEW_COMPETITION_MODEL,
OPEN_ADD_NEW_COMPETITION_MODEL_SUCCESS,
CLOSE_ADD_NEW_COMPETITION_MODEL,
GET_COMPETITION,
GET_COMPETITION_SUCCESS,
SAVE_COMPETITION,
SAVE_COMPETITION_SUCCESS,
OPEN_VIEW_COMPETITION_MODEL,
OPEN_VIEW_COMPETITION_MODEL_SUCCESS,
CLOSE_VIEW_COMPETITION_MODEL,
DELETE_COMPETITION,
OPEN_EDIT_COMPETITION_MODEL,
OPEN_EDIT_COMPETITION_MODEL_SUCCESS,

// Participants
OPEN_ADD_NEW_PARTICIPANT_MODEL,
CLOSE_ADD_NEW_PARTICIPANT_MODEL,
SAVE_PARTICIPANT,
SAVE_PARTICIPANT_SUCCESS,
OPEN_EDIT_PARTICIPANT_MODEL,
OPEN_EDIT_PARTICIPANT_MODEL_SUCCESS,
DELETE_PARTICIPANT,
GET_PARTICIPANT,
GET_PARTICIPANT_SUCCESS,


OPEN_ADD_NEW_PARTICIPANT_MEASUREMENT_MODEL,
OPEN_ADD_NEW_PARTICIPANT_MEASUREMENT_MODEL_SUCCESS,
CLOSE_ADD_NEW_PARTICIPANT_MEASUREMENT_MODEL,

SAVE_PARTICIPANT_MEASUREMENT,
SAVE_PARTICIPANT_MEASUREMENT_SUCCESS,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      competition: null,
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewCompetitionModal : false,
      viewCompetitionDialog:false,
      selectedCompetition: null,
      editcompetition : null,
      editMode : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      tableInfoParticipant : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      participantList: null,

      // Participants
      addNewParticipantModal : false,
      editParticipant : null,
      addNewParticipantMeasurementModal : false,
      participanthistory : null
    };

export default (state = INIT_STATE, action) => {

    switch (action.type) {

      case OPEN_ADD_NEW_COMPETITION_MODEL :
              return { ...state, addNewCompetitionModal : true ,editMode : false ,editcompetition : null};
      case OPEN_ADD_NEW_COMPETITION_MODEL_SUCCESS:
               return { ...state,addNewCompetitionModal : true, editMode : false ,editcompetition : null };
      case CLOSE_ADD_NEW_COMPETITION_MODEL:
              return { ...state, addNewCompetitionModal : false ,editMode : false,editcompetition : null};

      case GET_COMPETITION:

        let tableInfo = state.tableInfo;
          if(action.payload)
          {
            tableInfo.pageIndex  = action.payload.state.page;
            tableInfo.pageSize  = action.payload.state.pageSize;
            tableInfo.sorted  = action.payload.state.sorted;
            tableInfo.filtered = action.payload.state.filtered;
          }
        return { ...state , tableInfo : tableInfo};

      case GET_COMPETITION_SUCCESS:
      {
         let competition = action.payload.data;

         return { ...state, competition: competition,  tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
     }


     case OPEN_EDIT_COMPETITION_MODEL:
         return { ...state, addNewCompetitionModal : true, editMode : true, editcompetition: null };
     case OPEN_EDIT_COMPETITION_MODEL_SUCCESS:
               return { ...state,editcompetition:action.payload.data[0]};
      case OPEN_VIEW_COMPETITION_MODEL :
          return { ...state, viewCompetitionDialog : true , selectedCompetition : null};

       case OPEN_VIEW_COMPETITION_MODEL_SUCCESS:
           let  selectedCompetition = action.payload.data[0];

           selectedCompetition.participantdetail = selectedCompetition.participantdetail ? JSON.parse(selectedCompetition.participantdetail) : null;

               return { ...state,selectedCompetition:selectedCompetition};
       case CLOSE_VIEW_COMPETITION_MODEL:
           return { ...state, viewCompetitionDialog : false ,selectedCompetition :null};
      case SAVE_COMPETITION:
                   return { ...state, dialogLoading : true, disabled : true };
       case SAVE_COMPETITION_SUCCESS:
                   return { ...state, dialogLoading : false,addNewCompetitionModal : false , editMode : false, editcompetition : null, disabled : false};

      //Participants
       case OPEN_ADD_NEW_PARTICIPANT_MODEL :
               return { ...state, addNewParticipantModal : true ,editParticipant : null,editMode : false};
       case CLOSE_ADD_NEW_PARTICIPANT_MODEL:
               return { ...state, addNewParticipantModal : false ,editParticipant : null,editMode : false};
       case SAVE_PARTICIPANT:
               return { ...state, dialogLoading : true, disabled : true };
       case SAVE_PARTICIPANT_SUCCESS:
               return { ...state, dialogLoading : false,addNewParticipantModal : false , editParticipant : null, disabled : false,editMode : false};
               case OPEN_ADD_NEW_PARTICIPANT_MEASUREMENT_MODEL :
                         return { ...state, addNewParticipantMeasurementModal : true ,editMode : false ,editcompetition : null,participanthistory : action.payload};
               case OPEN_ADD_NEW_PARTICIPANT_MEASUREMENT_MODEL_SUCCESS:
                         return { ...state,addNewParticipantMeasurementModal : true, editMode : false ,editcompetition : null };
              case CLOSE_ADD_NEW_PARTICIPANT_MEASUREMENT_MODEL:
                         return { ...state, addNewParticipantMeasurementModal : false ,editMode : false,editcompetition : null};
             case SAVE_PARTICIPANT_MEASUREMENT:
                          return { ...state, dialogLoading : true, disabled : true };
             case SAVE_PARTICIPANT_MEASUREMENT_SUCCESS:
                        return { ...state, dialogLoading : false,addNewParticipantMeasurementModal : false , editMode : false, participanthistory : null, disabled : false};

       case OPEN_EDIT_PARTICIPANT_MODEL:
               return { ...state, addNewParticipantModal : true, editMode : true, editParticipant: null };
       case OPEN_EDIT_PARTICIPANT_MODEL_SUCCESS:
               return { ...state,editParticipant:action.payload.data[0]};

         case GET_PARTICIPANT:

           let tableInfoParticipant = state.tableInfoParticipant;
             if(action.payload)
             {
               tableInfoParticipant.pageIndex  = action.payload.state.page;
               tableInfoParticipant.pageSize  = action.payload.state.pageSize;
               tableInfoParticipant.sorted  = action.payload.state.sorted;
               tableInfoParticipant.filtered = action.payload.state.filtered;
             }
           return { ...state , tableInfoParticipant : tableInfoParticipant, participantList : null};

         case GET_PARTICIPANT_SUCCESS:
         {
            let participantList = action.payload.data;

            return { ...state, participantList: participantList,  tableInfoParticipant : {...state.tableInfoParticipant , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
        }

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
