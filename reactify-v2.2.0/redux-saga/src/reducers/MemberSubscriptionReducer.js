/**
 * MemberSubscription Reducer
 */
import update from 'react-addons-update';

// action types
import {
  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  GET_SUBSCRIPTION_LIST,
  GET_SUBSCRIPTION_LIST_SUCCESS,
  ON_CHANGE_SUBSCRIPTION,
  SAVE_SUBSCRIPTION_FOLLOWUP,
  SAVE_SUBSCRIPTION_FOLLOWUP_SUCCESS,
  OPEN_VIEW_MEMBER_FOLLOWUP_MODEL,
  CLOSE_VIEW_MEMBER_FOLLOWUP_MODEL,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
      subscriptionList:null,
       loading : false,
       disabled : false,
       dialogLoading : false,
        tableInfo : {
          pageSize : 10,
          pageIndex : 0,
          pages : 1,
          subscriptiontype : '2',
          totalrecord :0,
          startDate : null,
          endDate : null,
          absentstartDay : null,
          absentendDay : null,
        },
        viewSubscriptionFollowup: null,
        viewSubscriptionFollowupDialog:false,
        isFollowupsave : false,

        viewMemberFollowup: null,
        viewMemberFollowupDialog:false,

};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case ON_SHOW_LOADER:
            return { ...state, loading: true };

        case ON_HIDE_LOADER:
            return { ...state, loading : false };

           case GET_SUBSCRIPTION_LIST:
             let tableInfo = state.tableInfo;
               if(action.payload)
               {
                 if(action.payload.state)
                 {
                   tableInfo.pageIndex  = action.payload.state.page;
                    tableInfo.pageSize  = action.payload.state.pageSize;
                    tableInfo.sorted  = action.payload.state.sorted;
                    tableInfo.filtered = action.payload.state.filtered;
                    tableInfo.subscriptiontype = state.tableInfo.subscriptiontype;

                  }
                  else {
                      tableInfo.startDate = action.payload.startDate;
                      tableInfo.endDate = action.payload.endDate;
                      tableInfo.absentstartDay = action.payload.absentstartDay;
                      tableInfo.absentendDay = action.payload.absentendDay;
                  }
              }

             return { ...state , tableInfo : tableInfo,isFollowupsave : false};

             case GET_SUBSCRIPTION_LIST_SUCCESS:
               return { ...state, subscriptionList: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} ,isFollowupsave : false};

               case ON_CHANGE_SUBSCRIPTION:
               {
                 return update(state, {
                       tableInfo: {
                         subscriptiontype : {  $set: action.payload.subscriptiontype }
                        },
                   },
                 )
               }

            case SAVE_SUBSCRIPTION_FOLLOWUP:
                  return { ...state,dialogLoading : true, disabled : true,isFollowupsave : false};
            case SAVE_SUBSCRIPTION_FOLLOWUP_SUCCESS:
                  return { ...state,viewSubscriptionFollowupDialog : false,dialogLoading : false,viewSubscriptionFollowup : null, disabled : false,isFollowupsave : true};

            case OPEN_VIEW_MEMBER_FOLLOWUP_MODEL:
                     return { ...state,viewMemberFollowup:action.payload,viewMemberFollowupDialog : true,isFollowupsave : false};
            case CLOSE_VIEW_MEMBER_FOLLOWUP_MODEL:
                     return { ...state, viewMemberFollowupDialog : false,isFollowupsave : false,viewMemberFollowup : null };

            case REQUEST_FAILURE:
                return { ...state , loading : false, dialogLoading : false, disabled : false};

            case REQUEST_SUCCESS:
                return { ...state};

        default: return { ...state};
    }
}
