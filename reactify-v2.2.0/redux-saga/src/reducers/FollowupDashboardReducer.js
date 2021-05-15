/**
 * advertisement Reducer
 */
 import update from 'react-addons-update';
 import {cloneDeep} from 'Helpers/helpers';


// action types
import {
  GET_FOLLOWUPDASHBOARD_ONTRIALENQUIRIES,
  GET_FOLLOWUPDASHBOARD_ONTRIALENQUIRIES_SUCCESS,

  GET_FOLLOWUPDASHBOARD_RECENTENQUIRIES,
  GET_FOLLOWUPDASHBOARD_RECENTENQUIRIES_SUCCESS,

  GET_FOLLOWUPDASHBOARD_RECENTEXPIREDMEMBER,
  GET_FOLLOWUPDASHBOARD_RECENTEXPIREDMEMBER_SUCCESS,

  GET_FOLLOWUPDASHBOARD_MEMBERSHIPTOBEEXPIRED,
  GET_FOLLOWUPDASHBOARD_MEMBERSHIPTOBEEXPIRED_SUCCESS,

  GET_FOLLOWUPDASHBOARD_PAYMENTDUES,
  GET_FOLLOWUPDASHBOARD_PAYMENTDUES_SUCCESS,

  GET_FOLLOWUPDASHBOARD_RECENTPTEXPIRED,
  GET_FOLLOWUPDASHBOARD_RECENTPTEXPIRED_SUCCESS,

  GET_FOLLOWUPDASHBOARD_PTTOBEEXPIRED,
  GET_FOLLOWUPDASHBOARD_PTTOBEEXPIRED_SUCCESS,

  GET_FOLLOWUPDASHBOARD_MISSEDENQUIRYFOLLOWUP,
  GET_FOLLOWUPDASHBOARD_MISSEDENQUIRYFOLLOWUP_SUCCESS,

  GET_FOLLOWUPDASHBOARD_MISSEDMEMBERFOLLOWUP,
  GET_FOLLOWUPDASHBOARD_MISSEDMEMBERFOLLOWUP_SUCCESS,

  GET_MASTERDASHBOARD_TODAYENQUIRYREMINDER,
  GET_MASTERDASHBOARD_TODAYENQUIRYREMINDER_SUCCESS,

  GET_MASTERDASHBOARD_TODAYMEMBERREMINDER,
  GET_MASTERDASHBOARD_TODAYMEMBERREMINDER_SUCCESS,

  GET_FOLLOWUPDASHBOARD_RECENTMEMBER,
  GET_FOLLOWUPDASHBOARD_RECENTMEMBER_SUCCESS,

  GET_FOLLOWUPDASHBOARD_TODAY_BIRTHDAY,
  GET_FOLLOWUPDASHBOARD_TODAY_BIRTHDAY_SUCCESS,

  GET_FOLLOWUPDASHBOARD_TODAY_ANNIVERSARY,
  GET_FOLLOWUPDASHBOARD_TODAY_ANNIVERSARY_SUCCESS,

} from 'Actions/types';

let tableInfo = {
                       pageSize : 5,
                       pageIndex : 0,
                       pages : 1,
                       totalrecord :0,
                    };

// initial state
const INIT_STATE = {
  		 ontrialenquiries: null,
       tableInfoOnTrialEnquiries : cloneDeep(tableInfo),

       recentenquiries: null,
       tableInfoRecentEnquiries : cloneDeep(tableInfo),

       recentexpiredmember: null,
       tableInfoRecentExpiredMember : cloneDeep(tableInfo),

       membershiptobeexpired: null,
       tableInfoMembershipToBeExpired : cloneDeep(tableInfo),

       paymentdues: null,
       tableInfoPaymentDues : cloneDeep(tableInfo),

       recentptexpired: null,
       tableInfoRecentPTExpired : cloneDeep(tableInfo),

       pttobeexpired: null,
       tableInfoPtToBeExpired : cloneDeep(tableInfo),

       missedenquiryfollowup: null,
       tableInfoMissedEnquiryFollowup : cloneDeep(tableInfo),

       missedmemberfollowup: null,
       tableInfoMissedMemberFollowup : cloneDeep(tableInfo),

       todayenquiryreminder: null,
       tableInfoTodayEnquiryReminder : {},
       loading : false,

       todaymemberreminder: null,
       tableInfoTodayMemberReminder : cloneDeep(tableInfo),
       memberloading : false,

       recentmember: null,
       tableInfoRecentMember : cloneDeep(tableInfo),

       todaybirthday: null,
       tableInfoTodayBirthday : cloneDeep(tableInfo),

       todayanniversary: null,
       tableInfoTodayAnniversary : cloneDeep(tableInfo),

};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

          case GET_FOLLOWUPDASHBOARD_ONTRIALENQUIRIES:
            let tableInfoOnTrialEnquiries = state.tableInfoOnTrialEnquiries;
            if(action.payload)
            {
              if(action.payload.state)
              {
                tableInfoOnTrialEnquiries.pageIndex  = action.payload.state.page;
                tableInfoOnTrialEnquiries.pageSize  = action.payload.state.pageSize;
                tableInfoOnTrialEnquiries.sorted  = action.payload.state.sorted;
                tableInfoOnTrialEnquiries.filtered = action.payload.state.filtered;
                tableInfoOnTrialEnquiries.staffid = action.payload.state.staffid;
              }
              else {
                  tableInfoOnTrialEnquiries.staffid = action.payload.staffid;
              }

            }

            return { ...state , tableInfoOnTrialEnquiries : tableInfoOnTrialEnquiries};

         case GET_FOLLOWUPDASHBOARD_ONTRIALENQUIRIES_SUCCESS:
             return { ...state, ontrialenquiries: action.payload.data ,tableInfoOnTrialEnquiries : {...state.tableInfoOnTrialEnquiries , pages : action.payload.pages[0].pages,
               totalrecord : action.payload.pages[0].count,
               expected : action.payload.pages[0].expected

             } };




         case GET_FOLLOWUPDASHBOARD_RECENTENQUIRIES:
           let tableInfoRecentEnquiries = state.tableInfoRecentEnquiries;
           if(action.payload)
           {
             if(action.payload.state)
             {
               tableInfoRecentEnquiries.pageIndex  = action.payload.state.page;
               tableInfoRecentEnquiries.pageSize  = action.payload.state.pageSize;
               tableInfoRecentEnquiries.sorted  = action.payload.state.sorted;
               tableInfoRecentEnquiries.filtered = action.payload.state.filtered;
               tableInfoRecentEnquiries.staffid = action.payload.state.staffid;
             }
             else {
                 tableInfoRecentEnquiries.staffid = action.payload.staffid;
             }

           }

           return { ...state , tableInfoRecentEnquiries : tableInfoRecentEnquiries};

        case GET_FOLLOWUPDASHBOARD_RECENTENQUIRIES_SUCCESS:
            return { ...state, recentenquiries: action.payload.data ,tableInfoRecentEnquiries : {...state.tableInfoRecentEnquiries , pages : action.payload.pages[0].pages,
              totalrecord : action.payload.pages[0].count,
              expected : action.payload.pages[0].expected} };



        case GET_FOLLOWUPDASHBOARD_RECENTEXPIREDMEMBER:
          let tableInfoRecentExpiredMember = state.tableInfoRecentExpiredMember;
          if(action.payload)
          {
            if(action.payload.state)
            {
              tableInfoRecentExpiredMember.pageIndex  = action.payload.state.page;
              tableInfoRecentExpiredMember.pageSize  = action.payload.state.pageSize;
              tableInfoRecentExpiredMember.sorted  = action.payload.state.sorted;
              tableInfoRecentExpiredMember.filtered = action.payload.state.filtered;
              tableInfoRecentExpiredMember.staffid = action.payload.state.staffid;
            }
            else {
                tableInfoRecentExpiredMember.staffid = action.payload.staffid;
            }
          }

          return { ...state , tableInfoRecentExpiredMember : tableInfoRecentExpiredMember};

       case GET_FOLLOWUPDASHBOARD_RECENTEXPIREDMEMBER_SUCCESS:
           return { ...state, recentexpiredmember: action.payload.data ,tableInfoRecentExpiredMember : {...state.tableInfoRecentExpiredMember , pages : action.payload.pages[0].pages,
             totalrecord : action.payload.pages[0].count,
             expected : action.payload.pages[0].expected  } };


       case GET_FOLLOWUPDASHBOARD_MEMBERSHIPTOBEEXPIRED:
         let tableInfoMembershipToBeExpired = state.tableInfoMembershipToBeExpired;
         if(action.payload)
         {
           if(action.payload.state)
           {
             tableInfoMembershipToBeExpired.pageIndex  = action.payload.state.page;
             tableInfoMembershipToBeExpired.pageSize  = action.payload.state.pageSize;
             tableInfoMembershipToBeExpired.sorted  = action.payload.state.sorted;
             tableInfoMembershipToBeExpired.filtered = action.payload.state.filtered;
             tableInfoMembershipToBeExpired.staffid = action.payload.state.staffid;
           }
           else {
               tableInfoMembershipToBeExpired.staffid = action.payload.staffid;
           }
         }

         return { ...state , tableInfoMembershipToBeExpired : tableInfoMembershipToBeExpired};

       case GET_FOLLOWUPDASHBOARD_MEMBERSHIPTOBEEXPIRED_SUCCESS:
          return { ...state, membershiptobeexpired: action.payload.data ,tableInfoMembershipToBeExpired : {...state.tableInfoMembershipToBeExpired , pages : action.payload.pages[0].pages,
            totalrecord : action.payload.pages[0].count,
            expected : action.payload.pages[0].expected} };


       case GET_FOLLOWUPDASHBOARD_PAYMENTDUES:
        let tableInfoPaymentDues = state.tableInfoPaymentDues;
        if(action.payload)
        {
          if(action.payload.state)
          {
            tableInfoPaymentDues.pageIndex  = action.payload.state.page;
            tableInfoPaymentDues.pageSize  = action.payload.state.pageSize;
            tableInfoPaymentDues.sorted  = action.payload.state.sorted;
            tableInfoPaymentDues.filtered = action.payload.state.filtered;
            tableInfoPaymentDues.staffid = action.payload.state.staffid;
          }
          else {
              tableInfoPaymentDues.staffid = action.payload.staffid;
          }
        }

        return { ...state , tableInfoPaymentDues : tableInfoPaymentDues};

       case GET_FOLLOWUPDASHBOARD_PAYMENTDUES_SUCCESS:
         return { ...state, paymentdues: action.payload.data ,tableInfoPaymentDues : {...state.tableInfoPaymentDues , pages : action.payload.pages[0].pages,
           totalrecord : action.payload.pages[0].count,
         expected : action.payload.pages[0].expected} };


       case GET_FOLLOWUPDASHBOARD_RECENTPTEXPIRED:
        let tableInfoRecentPTExpired = state.tableInfoRecentPTExpired;
        if(action.payload)
        {
          if(action.payload.state)
          {
            tableInfoRecentPTExpired.pageIndex  = action.payload.state.page;
            tableInfoRecentPTExpired.pageSize  = action.payload.state.pageSize;
            tableInfoRecentPTExpired.sorted  = action.payload.state.sorted;
            tableInfoRecentPTExpired.filtered = action.payload.state.filtered;
            tableInfoRecentPTExpired.staffid = action.payload.state.staffid;
          }
          else {
              tableInfoRecentPTExpired.staffid = action.payload.staffid;
          }
        }

        return { ...state , tableInfoRecentPTExpired : tableInfoRecentPTExpired};

       case GET_FOLLOWUPDASHBOARD_RECENTPTEXPIRED_SUCCESS:
           return { ...state, recentptexpired: action.payload.data ,tableInfoRecentPTExpired : {...state.tableInfoRecentPTExpired , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count,
           expected : action.payload.pages[0].expected} };


       case GET_FOLLOWUPDASHBOARD_PTTOBEEXPIRED:
        let tableInfoPtToBeExpired = state.tableInfoPtToBeExpired;
        if(action.payload)
        {
          if(action.payload.state)
          {
            tableInfoPtToBeExpired.pageIndex  = action.payload.state.page;
            tableInfoPtToBeExpired.pageSize  = action.payload.state.pageSize;
            tableInfoPtToBeExpired.sorted  = action.payload.state.sorted;
            tableInfoPtToBeExpired.filtered = action.payload.state.filtered;
            tableInfoPtToBeExpired.staffid = action.payload.state.staffid;
          }
          else {
              tableInfoPtToBeExpired.staffid = action.payload.staffid;
          }
        }

        return { ...state , tableInfoPtToBeExpired : tableInfoPtToBeExpired};

       case GET_FOLLOWUPDASHBOARD_PTTOBEEXPIRED_SUCCESS:
           return { ...state, pttobeexpired: action.payload.data ,tableInfoPtToBeExpired : {...state.tableInfoPtToBeExpired , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count,
           expected : action.payload.pages[0].expected} };


       case GET_FOLLOWUPDASHBOARD_MISSEDENQUIRYFOLLOWUP:
        let tableInfoMissedEnquiryFollowup = state.tableInfoMissedEnquiryFollowup;
        if(action.payload)
        {
          if(action.payload.state)
          {
            tableInfoMissedEnquiryFollowup.pageIndex  = action.payload.state.page;
            tableInfoMissedEnquiryFollowup.pageSize  = action.payload.state.pageSize;
            tableInfoMissedEnquiryFollowup.sorted  = action.payload.state.sorted;
            tableInfoMissedEnquiryFollowup.filtered = action.payload.state.filtered;
            tableInfoMissedEnquiryFollowup.staffid = action.payload.state.staffid;
          }
          else {
              tableInfoMissedEnquiryFollowup.staffid = action.payload.staffid;
          }
        }

        return { ...state , tableInfoMissedEnquiryFollowup : tableInfoMissedEnquiryFollowup};

       case GET_FOLLOWUPDASHBOARD_MISSEDENQUIRYFOLLOWUP_SUCCESS:
           return { ...state, missedenquiryfollowup: action.payload.data ,tableInfoMissedEnquiryFollowup : {...state.tableInfoMissedEnquiryFollowup , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count,
           expected : action.payload.pages[0].expected} };


       case GET_FOLLOWUPDASHBOARD_MISSEDMEMBERFOLLOWUP:
        let tableInfoMissedMemberFollowup = state.tableInfoMissedMemberFollowup;
        if(action.payload)
        {
          if(action.payload.state)
          {
            tableInfoMissedMemberFollowup.pageIndex  = action.payload.state.page;
            tableInfoMissedMemberFollowup.pageSize  = action.payload.state.pageSize;
            tableInfoMissedMemberFollowup.sorted  = action.payload.state.sorted;
            tableInfoMissedMemberFollowup.filtered = action.payload.state.filtered;
            tableInfoMissedMemberFollowup.staffid = action.payload.state.staffid;
          }
          else {
              tableInfoMissedMemberFollowup.staffid = action.payload.staffid;
          }
        }

        return { ...state , tableInfoMissedMemberFollowup : tableInfoMissedMemberFollowup};

       case GET_FOLLOWUPDASHBOARD_MISSEDMEMBERFOLLOWUP_SUCCESS:
           return { ...state, missedmemberfollowup: action.payload.data ,tableInfoMissedMemberFollowup : {...state.tableInfoMissedMemberFollowup , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };


       case GET_MASTERDASHBOARD_TODAYENQUIRYREMINDER:
        let tableInfoTodayEnquiryReminder = {};
        if(action.payload)
        {
          if(action.payload.attendedbyfilter || action.payload.followupbyfilter) {
              tableInfoTodayEnquiryReminder.attendedbyfilter = action.payload.attendedbyfilter;
              tableInfoTodayEnquiryReminder.followupbyfilter = action.payload.followupbyfilter;
          }
        }

        return { ...state , tableInfoTodayEnquiryReminder : tableInfoTodayEnquiryReminder,todayenquiryreminder: null,loading : true};

       case GET_MASTERDASHBOARD_TODAYENQUIRYREMINDER_SUCCESS:
           return { ...state, todayenquiryreminder: action.payload.data , tableInfoTodayEnquiryReminder : action.payload.tableInfoTodayEnquiryReminder , loading : false };



       case GET_MASTERDASHBOARD_TODAYMEMBERREMINDER:
        let tableInfoTodayMemberReminder = state.tableInfoTodayMemberReminder;
        if(action.payload)
        {
          if(action.payload.state)
          {
            tableInfoTodayMemberReminder.pageIndex  = action.payload.state.page;
            tableInfoTodayMemberReminder.pageSize  = action.payload.state.pageSize;
            tableInfoTodayMemberReminder.sorted  = action.payload.state.sorted;
            tableInfoTodayMemberReminder.filtered = action.payload.state.filtered;
          }
          else {
              tableInfoTodayMemberReminder.followupbyfilter = action.payload.followupbyfilter;
          }
        }

        return { ...state , tableInfoTodayEnquiryReminder : tableInfoTodayEnquiryReminder,todaymemberreminder: null,memberloading : true};

       case GET_MASTERDASHBOARD_TODAYMEMBERREMINDER_SUCCESS:
           return { ...state, todaymemberreminder: action.payload.data , memberloading : false };



       case GET_FOLLOWUPDASHBOARD_RECENTMEMBER:
        let tableInfoRecentMember = state.tableInfoRecentMember;
        if(action.payload)
        {
          if(action.payload.state)
          {
            tableInfoRecentMember.pageIndex  = action.payload.state.page;
            tableInfoRecentMember.pageSize  = action.payload.state.pageSize;
            tableInfoRecentMember.sorted  = action.payload.state.sorted;
            tableInfoRecentMember.filtered = action.payload.state.filtered;
            tableInfoRecentMember.staffid = action.payload.state.staffid;
          }
          else {
              tableInfoRecentMember.staffid = action.payload.staffid;
          }

        }

        return { ...state , tableInfoRecentMember : tableInfoRecentMember};

       case GET_FOLLOWUPDASHBOARD_RECENTMEMBER_SUCCESS:
           return { ...state, recentmember: action.payload.data ,tableInfoRecentMember : {...state.tableInfoRecentMember , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };


       case GET_FOLLOWUPDASHBOARD_TODAY_BIRTHDAY:
        let tableInfoTodayBirthday = state.tableInfoTodayBirthday;
        if(action.payload)
        {
          if(action.payload.state)
          {
            tableInfoTodayBirthday.pageIndex  = action.payload.state.page;
            tableInfoTodayBirthday.pageSize  = action.payload.state.pageSize;
            tableInfoTodayBirthday.sorted  = action.payload.state.sorted;
            tableInfoTodayBirthday.filtered = action.payload.state.filtered;
          }
        }

        return { ...state , tableInfoTodayBirthday : tableInfoTodayBirthday};

       case GET_FOLLOWUPDASHBOARD_TODAY_BIRTHDAY_SUCCESS:
           return { ...state, todaybirthday: action.payload.data ,tableInfoTodayBirthday : {...state.tableInfoTodayBirthday , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };


       case GET_FOLLOWUPDASHBOARD_TODAY_ANNIVERSARY:
        let tableInfoTodayAnniversary = state.tableInfoTodayAnniversary;
        if(action.payload)
        {
          if(action.payload.state)
          {
            tableInfoTodayAnniversary.pageIndex  = action.payload.state.page;
            tableInfoTodayAnniversary.pageSize  = action.payload.state.pageSize;
            tableInfoTodayAnniversary.sorted  = action.payload.state.sorted;
            tableInfoTodayAnniversary.filtered = action.payload.state.filtered;
          }
        }

        return { ...state , tableInfoTodayAnniversary : tableInfoTodayAnniversary};

       case GET_FOLLOWUPDASHBOARD_TODAY_ANNIVERSARY_SUCCESS:
           return { ...state, todayanniversary: action.payload.data ,tableInfoTodayAnniversary : {...state.tableInfoTodayAnniversary , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };


        default: return { ...state};
    }
}
