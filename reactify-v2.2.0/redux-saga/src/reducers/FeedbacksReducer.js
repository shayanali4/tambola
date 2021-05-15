/**
 * Feedbacks Reducers
 */
import update from 'react-addons-update';
import { NotificationManager } from 'react-notifications';
import Auth from '../Auth/Auth';
const authObject = new Auth();
import {cloneDeep} from 'Helpers/helpers';

// action types
import {
    GET_FEEDBACKS,
    GET_FEEDBACKS_SUCCESS,
    ON_CHANGE_FEEDBACK_PAGE_TABS,
    MAKE_FAVORITE_FEEDBACK,
    ON_DELETE_FEEDBACK,
    VIEW_FEEDBACK_DETAILS,
    ADD_NEW_FEEDBACK,
    SHOW_FEEDBACK_LOADING_INDICATOR,
    HIDE_FEEDBACK_LOADING_INDICATOR,
    NAVIGATE_TO_BACK,
    REPLY_FEEDBACK,
    SEND_REPLY,
    UPDATE_SEARCH_IDEA,
    ON_SEARCH_IDEA,
    ON_COMMENT_FEEDBACK,
    ON_COMMENT_FEEDBACK_SUCCESS,
    GET_FEEDBACKS_FAILURE,
    SAVE_FEEDBACK,
    SAVE_FEEDBACK_SUCCESS,
    VIEW_COMMENTS_DETAILS,
    VIEW_COMMENTS_DETAILS_SUCCESS,
    SAVE_FEEDBACK_STATUS,
    SAVE_FEEDBACK_STATUS_SUCCESS,
    REQUEST_SUCCESS,
    REQUEST_FAILURE,
    ON_SHOW_LOADER,
    ON_HIDE_LOADER
} from 'Actions/types';
let clientProfileDetail = authObject.getClientProfile();

/**
 * initial state
 */
const INIT_STATE = {
    allFeedbacks: [],
    feedbacks: [],
    selectedTab: 0,
    selectedFeedback: null,
    loading: false,
    totalFeedbacksCount: 0,
    searchIdeaText: '',
    loadingScroll : false,
    feedbackid : null,
    viewFeedback : null,
    tableInfo : {
  		pageSize : 10,
  		pageIndex : 0,
  		pages : 1,
      filtered : [],
      sorted: [],
      totalrecord :0,
      clientid : clientProfileDetail &&  clientProfileDetail.id,
      isgeneralfeedback : clientProfileDetail &&  clientProfileDetail.id == 1 ? 1 : 0,
      activeTab : 0,
      month : '',
      year : '',
  	},
    iscommentsave : false,
    clientList : false,
    viewCommentDialog:false,
    isfeedbacksaved : false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case GET_FEEDBACKS:
        let tableInfo = cloneDeep(state.tableInfo);
          if(action.payload)
          {
            tableInfo.pageIndex = action.payload.pageIndex ? action.payload.pageIndex : 0;
            tableInfo.pageSize = action.payload.pageSize ? action.payload.pageSize : 10;
            if(action.payload.feedbackfor != null) {
              tableInfo.filtered = tableInfo.filtered.filter(x => x.id != "feedbackfor");
              tableInfo.filtered.push({id: "feedbackfor",value:action.payload.feedbackfor});
            }
            if (action.payload.feedbackstatus != null) {
              tableInfo.filtered = tableInfo.filtered.filter(x => x.id != "feedbackstatus");
              tableInfo.filtered.push({id: "feedbackstatus",value:action.payload.feedbackstatus});
            }
            if (action.payload.idea != null) {
              tableInfo.filtered = tableInfo.filtered.filter(x => x.id != "idea");
              tableInfo.filtered.push({id: "idea",value:action.payload.idea});
            }
            if (action.payload.activeTab != null) {
              tableInfo.activeTab = action.payload.activeTab;
            }
            if (action.payload.month != null) {
              tableInfo.month = action.payload.month;
            }
            if (action.payload.year != null) {
              tableInfo.year = action.payload.year;
            }
            if (action.payload.clientid != null) {
              tableInfo.clientid = action.payload.clientid
            }
            else if (action.payload.isgeneralfeedback != null) {
              tableInfo.isgeneralfeedback = action.payload.isgeneralfeedback
            }


          }
          else{
            tableInfo.filtered = [];
          }
           return { ...state, loading: true,feedbackid : state.feedbackid,feedbacks : state.feedbacks,tableInfo : tableInfo};

        // get feedbacks
        case GET_FEEDBACKS_SUCCESS:
          let feedbacks = action.payload.data;
          if(feedbacks)
          {
            feedbacks.forEach(x => x.images = x.images ? JSON.parse(x.images) : [])
          }
            return {
                ...state,
                feedbacks :feedbacks ,
                loading: false,
                // totalFeedbacksCount: feedbacks.length,
                // plannedFeedbacksCount: feedbacks.filter(feedback => feedback.planned).length,
                // progressFeedbacksCount: feedbacks.filter(feedback => feedback.inProgress).length,
                // feedbackid : feedbackid,
                // loadingScroll : loadMore,
                tableInfo : {...state.tableInfo , pages :  action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count },
                clientList : action.payload.clientList ? action.payload.clientList : state.clientList
            };

        // get feedbacks failure
        case GET_FEEDBACKS_FAILURE:
            return {
                ...state,
                loading: false,
                allFeedbacks: null,
                feedbacks: []
            }

        // show loading indicator
        case SHOW_FEEDBACK_LOADING_INDICATOR:
            return { ...state, loading: true };

        // hide loading indicator
        case HIDE_FEEDBACK_LOADING_INDICATOR:
            return { ...state, loading: false };

        // on change feedback tab
        case ON_CHANGE_FEEDBACK_PAGE_TABS:
            if (action.payload === 1) {
              const plannedFeedbacks = state.feedbacks && state.feedbacks.filter(feedback => feedback.planned && !feedback.deleted);
              return { ...state, feedbacks: plannedFeedbacks, selectedTab: action.payload };
            }
            if (action.payload === 0) {
                return { ...state, feedbacks: [], selectedTab: action.payload,feedbackid : null };
            }
            if (action.payload === 2) {
                const progressFeedbacks = state.allFeedbacks.filter(feedback => feedback.inProgress && !feedback.deleted);
                return { ...state, selectedTab: action.payload, feedbacks: progressFeedbacks };
            }
            if (action.payload === 3) {
                return { ...state, selectedTab: action.payload };
            }
              return { ...state, feedbacks:state.feedbacks && state.feedbacks.filter(feedback => !feedback.deleted), selectedTab: 0 };

              // view feedback details
        case VIEW_FEEDBACK_DETAILS:
          let selectedFeedback = action.payload;

            return { ...state, selectedFeedback: selectedFeedback, loading: false };

            case VIEW_COMMENTS_DETAILS:
              return { ...state, loading: true,viewCommentDialog : true };
            case VIEW_COMMENTS_DETAILS_SUCCESS:
            let viewFeedback = action.payload.data;
            viewFeedback.comments =  viewFeedback.comments ? JSON.parse(viewFeedback.comments) : null;
            if( viewFeedback.comments){
              viewFeedback.comments.sort( function ( a, b ) { return b.id - a.id; } );
            }

                return { ...state, viewFeedback: viewFeedback, loading: false };

        // add new feedback
        case ADD_NEW_FEEDBACK:
            NotificationManager.success('New Feedback Added!');
            return update(state, {
                allFeedbacks: {
                    $splice: [[0, 0, action.payload]]
                },
                feedbacks: {
                    $splice: [[0, 0, action.payload]]
                },
                loading: { $set: false }
            });

        // navigate to back
        case NAVIGATE_TO_BACK:
            return { ...state, selectedFeedback: null, loading: false,viewFeedback:null,viewCommentDialog : false };

        // reply feedback
        case REPLY_FEEDBACK:
            let indexOfFeedback = state.feedbacks.indexOf(action.payload);
            return update(state, {
                feedbacks: {
                    [indexOfFeedback]: {
                        replyBox: { $set: !action.payload.replyBox }
                    }
                }
            });

        // send reply
        case SEND_REPLY:
            NotificationManager.success('Reply Sent Successfully!');
            let indexOfReplyFeedback = state.feedbacks.indexOf(action.payload);
            return update(state, {
                feedbacks: {
                    [indexOfReplyFeedback]: {
                        replyBox: { $set: false }
                    }
                },
                loading: { $set: false }
            });

        // update search
        case UPDATE_SEARCH_IDEA:
            return { ...state, searchIdeaText: action.payload };

        // on search ideas
        case ON_SEARCH_IDEA:
            if (action.payload === '') {
                return { ...state, feedbacks: state.allFeedbacks, loading: false };
            } else {
                const searchFeedbacks = state.allFeedbacks.filter((feedback) =>
                    feedback.idea.toLowerCase().indexOf(action.payload.toLowerCase()) > -1);
                return { ...state, feedbacks: searchFeedbacks, loading: false }
            }

        // on comment
        // case ON_COMMENT_FEEDBACK:
        //     return {
        //         ...state,
        //         selectedFeedback: {
        //             ...state.selectedFeedback,
        //             comments: [...state.selectedFeedback.comments || {}, action.payload]
        //         }
        //     }

        case ON_COMMENT_FEEDBACK:
            return { ...state, dialogLoading : true, disabled : true ,feedbackid : null,feedbacks: [],iscommentsave : false};

        case ON_COMMENT_FEEDBACK_SUCCESS:
            return { ...state,dialogLoading : false,disabled : false,iscommentsave : true};



        case SAVE_FEEDBACK:
            return { ...state, dialogLoading : true, disabled : true, isfeedbacksaved : false};

        case SAVE_FEEDBACK_SUCCESS:
            return { ...state,dialogLoading : false,disabled : false, isfeedbacksaved : true};

        case SAVE_FEEDBACK_STATUS:
                return { ...state, dialogLoading : true, disabled : true};

        case SAVE_FEEDBACK_STATUS_SUCCESS:
                return { ...state,dialogLoading : false,disabled : false};

            case REQUEST_FAILURE:
                   return { ...state , dialogLoading : false, disabled : false,loading : false};
             case REQUEST_SUCCESS:
                   return { ...state};
             case ON_SHOW_LOADER:
                   return { ...state, loading : true};
             case ON_HIDE_LOADER:
                   return { ...state, loading : false};

        default: return { ...state };
    }
}
