// action types
import {
GET_TRAINERS_FEEDBACK_BYMEMBER,
GET_TRAINERS_FEEDBACK_BYMEMBER_SUCCESS,
OPEN_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL,
OPEN_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL_SUCCESS,
CLOSE_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL,

GET_TRAINERS_GS_FEEDBACK_BYMEMBER,
GET_TRAINERS_GS_FEEDBACK_BYMEMBER_SUCCESS,
OPEN_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL,
OPEN_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL_SUCCESS,
CLOSE_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL,

GET_TRAINERS_GENERALRATING_BYMEMBER,
GET_TRAINERS_GENERALRATING_BYMEMBER_SUCCESS,
OPEN_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL,
OPEN_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL_SUCCESS,
CLOSE_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
  memberfeedbacks: null,
  loading : false,
  disabled : false,
  dialogLoading : false,
  selectedFeedback: null,
  viewFeedbackDialog:false,
  tableInfo : {
    pageSize : 10,
    pageIndex : 0,
    pages : 1,
    totalrecord :0,
  },

  tableInfoGS : {
    pageSize : 10,
    pageIndex : 0,
    pages : 1,
    totalrecord :0,
  },

  tableInfoRating : {
    pageSize : 10,
    pageIndex : 0,
    pages : 1,
    totalrecord :0,
  },
  memberfeedbacksGS: null,
  selectedGSTrainer: null,
  viewGSFeedbackDialog:false,
  userRating: null,
  viewRatingDialog:false,
  selectedRating: null,
};
export default (state = INIT_STATE, action) => {

    switch (action.type) {
     case GET_TRAINERS_FEEDBACK_BYMEMBER:
      let tableInfo = state.tableInfo;
        if(action.payload)
        {
          if(action.payload.state)
          {
            tableInfo.pageIndex  = action.payload.state.page ? action.payload.state.page : 0;
            tableInfo.pageSize  = action.payload.state.pageSize;
            tableInfo.sorted  = action.payload.state.sorted ? action.payload.state.sorted : [];
            tableInfo.filtered = action.payload.state.filtered ? action.payload.state.filtered : [];
            tableInfo.feedbackfilter = action.payload.state.feedbackfilter;
          }
          else {
              tableInfo.feedbackfilter = action.payload.feedbackfilter;
          }
        }
      return { ...state , tableInfo : tableInfo};

      case GET_TRAINERS_FEEDBACK_BYMEMBER_SUCCESS:

              return { ...state, memberfeedbacks: action.payload.data ,tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

      case OPEN_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL :
              return { ...state,selectedFeedback: null,viewFeedbackDialog:true};

      case OPEN_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL_SUCCESS :

               return { ...state,selectedFeedback:action.payload.data};
       case CLOSE_VIEW_TRAINERS_FEEDBACK_BYMEMBER_MODEL:
               return { ...state, viewFeedbackDialog : false };

       case GET_TRAINERS_GS_FEEDBACK_BYMEMBER:
                let tableInfoGS = state.tableInfoGS;
                  if(action.payload)
                  {
                    if(action.payload.state)
                    {
                      tableInfoGS.pageIndex  = action.payload.state.page ? action.payload.state.page : 0;
                      tableInfoGS.pageSize  = action.payload.state.pageSize;
                      tableInfoGS.sorted  = action.payload.state.sorted ? action.payload.state.sorted : [];
                      tableInfoGS.filtered = action.payload.state.filtered ?action.payload.state.filtered : [];
                      tableInfoGS.feedbackfilter = action.payload.state.feedbackfilter;
                    }
                    else {
                        tableInfoGS.feedbackfilter = action.payload.feedbackfilter;
                    }
                  }
                return { ...state , tableInfoGS : tableInfoGS};

         case GET_TRAINERS_GS_FEEDBACK_BYMEMBER_SUCCESS:

               return { ...state, memberfeedbacksGS: action.payload.data ,tableInfoGS : {...state.tableInfoGS , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

        case OPEN_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL :
               return { ...state,selectedGSTrainer: null,viewGSFeedbackDialog:true};

        case OPEN_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL_SUCCESS :

                 return { ...state,selectedGSTrainer:action.payload.data};
        case CLOSE_VIEW_TRAINERS_GS_FEEDBACK_BYMEMBER_MODEL:
                 return { ...state, viewGSFeedbackDialog : false };


         case GET_TRAINERS_GENERALRATING_BYMEMBER:
          let tableInfoRating = state.tableInfoRating;
            if(action.payload)
            {
              if(action.payload.state)
              {
                tableInfoRating.pageIndex  = action.payload.state.page ? action.payload.state.page : 0;
                tableInfoRating.pageSize  = action.payload.state.pageSize;
                tableInfoRating.sorted  = action.payload.state.sorted ? action.payload.state.sorted : [];
                tableInfoRating.filtered = action.payload.state.filtered ? action.payload.state.filtered : [];
                tableInfoRating.feedbackfilter = action.payload.state.feedbackfilter;
              }
              else {
                  tableInfoRating.feedbackfilter = action.payload.feedbackfilter;
              }
            }
          return { ...state , tableInfoRating : tableInfoRating};

          case GET_TRAINERS_GENERALRATING_BYMEMBER_SUCCESS:

                  return { ...state, userRating: action.payload.data ,tableInfoRating : {...state.tableInfoRating , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

          case OPEN_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL :
                  return { ...state,selectedRating: null,viewRatingDialog:true};

          case OPEN_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL_SUCCESS :
                   return { ...state,selectedRating:action.payload.data};

           case CLOSE_VIEW_TRAINERS_GENERALRATING_BYMEMBER_MODEL:
                   return { ...state, viewRatingDialog : false,selectedRating: null};


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
