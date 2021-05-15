import { NotificationManager } from 'react-notifications';
import {convertSecToHour,convertkgTolbs} from 'Helpers/unitconversion';
import {getLocalTime} from 'Helpers/helpers';
import Auth from '../Auth/Auth';
const authObject = new Auth();

// action types
import {
  SAVE_MEMBERATTENDANCE,
  SAVE_MEMBERATTENDANCE_SUCCESS,
  GET_MEMBERATTENDANCE_LIST,
  GET_MEMBERATTENDANCE_LIST_SUCCESS,
  DELETE_ATTENDANCE,
  DELETE_LAST_ATTENDANCE,
  SAVE_MEMBER_PT_ATTENDANCE,
  SAVE_MEMBER_PT_ATTENDANCE_SUCCESS,
  GET_MEMBER_PT_ATTENDANCE_LIST,
  GET_MEMBER_PT_ATTENDANCE_LIST_SUCCESS,
  SAVE_PT_SESSIONTIMEWEIGHT,
  SAVE_PT_SESSIONTIMEWEIGHT_SUCCESS,
  DELETE_LAST_PT_ATTENDANCE,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
  loading : false,
  disabled : false,
  dialogLoading : false,
  lastattendence : null,
  attendencelist : null,
  attendencesaved : false,
  attendencelistPT : null,
  lastptattendence : null,
  tableInfo : {
    pageSize : 5,
    pageIndex : 0,
    pages : 1,
    totalrecord :0,
  },
  tableInfoPT :  {
    pageSize : 5,
    pageIndex : 0,
    pages : 1,
    totalrecord :0,
  },
  savedPtAttendance : 0,
};
export default (state = INIT_STATE, action) => {

    switch (action.type) {
      case SAVE_MEMBERATTENDANCE:
          return { ...state,loading : true ,attendencesaved : false ,savedPtAttendance : 0};
      case SAVE_MEMBERATTENDANCE_SUCCESS:
        let lastattendence = action.payload.data[0];
                  if(lastattendence)
                  {
                    if(lastattendence.IsMembershipActvie == 0)
                    {
                      NotificationManager.warning('Member has no active membership.');
                    }
                    // if(lastattendence.IsClassActvie == 0)
                    // {
                    //   NotificationManager.warning('Member has no active class.');
                    // }
                  }
          return { ...state, dialogLoading : false , lastattendence : lastattendence,loading : false,attendencesaved : true ,savedPtAttendance : 0};
      case GET_MEMBERATTENDANCE_LIST:
           profileDetail = authObject.getProfile();
          let tableInfo = state.tableInfo;
            if(action.payload)
            {
              if(action.payload.state)
              {
                tableInfo.pageIndex  = action.payload.state.page;
                tableInfo.pageSize  = action.payload.state.pageSize;
                tableInfo.sorted  = action.payload.state.sorted;
                tableInfo.filtered = action.payload.state.filtered;
                tableInfo.startDate = action.payload.state.startDate;
                tableInfo.endDate = action.payload.state.endDate;
                tableInfo.isTrainer = profileDetail.isTrainer;
              }
            else{
              tableInfo.startDate = action.payload.startDate;
              tableInfo.endDate = action.payload.endDate;
            }
          }
          return { ...state , tableInfo : tableInfo,attendencesaved : false ,savedPtAttendance : 0};

      case GET_MEMBERATTENDANCE_LIST_SUCCESS:
            return { ...state, attendencelist: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count ,savedPtAttendance : 0} };

      case DELETE_LAST_ATTENDANCE:
             return { ...state, lastattendence : null,savedPtAttendance : 0};

      case SAVE_MEMBER_PT_ATTENDANCE:
             return { ...state ,loading : true,savedPtAttendance : 0};
      case SAVE_MEMBER_PT_ATTENDANCE_SUCCESS:
             let lastptattendence = action.payload.data[0];
             let savedPtAttendance = 1;
                    if(lastptattendence && lastptattendence.IsClassActive == 0)
                     {
                         NotificationManager.error('Member has no active pt of ' + lastptattendence.sessiontype + " ("+ lastptattendence.selectedEmployeeName +').');
                         lastptattendence = null;
                         savedPtAttendance = 0;
                     }
             return { ...state, dialogLoading : false , lastptattendence : lastptattendence,loading : false,savedPtAttendance : savedPtAttendance};

       case GET_MEMBER_PT_ATTENDANCE_LIST:
             let profileDetail = authObject.getProfile();
             let tableInfoPT = state.tableInfoPT;

             if(action.payload)
             {
               if(action.payload.state)
               {
                 tableInfoPT.pageIndex  = action.payload.state.page;
                 tableInfoPT.pageSize  = action.payload.state.pageSize;
                 tableInfoPT.sorted  = action.payload.state.sorted;
                 tableInfoPT.filtered = action.payload.state.filtered;
                 tableInfoPT.startDate = action.payload.state.startDate;
                 tableInfoPT.endDate = action.payload.state.endDate;
                 tableInfoPT.isTrainer = profileDetail.isTrainer;
               }
             else{
               tableInfoPT.startDate = action.payload.startDate;
               tableInfoPT.endDate = action.payload.endDate;
             }
           }
             return { ...state , tableInfoPT : tableInfoPT ,savedPtAttendance : 0};

       case GET_MEMBER_PT_ATTENDANCE_LIST_SUCCESS:

       let attendencelistPT = action.payload.data;

       attendencelistPT && attendencelistPT.forEach(x =>
         {
           x.startweight = x.startweight || 0;
           x.endweight = x.endweight || 0;

           x.startweightlbs =  convertkgTolbs(x.startweight);
           x.startweightlbs = x.startweightlbs ? x.startweightlbs.toFixed(2) : 0;
           x.endweightlbs =  convertkgTolbs(x.endweight);
           x.endweightlbs = x.endweightlbs ? x.endweightlbs.toFixed(2) : 0;

           x.weightlosslbs =  x.endweight ? parseFloat((x.startweightlbs || 0) - (x.endweightlbs || 0)).toFixed(2) : 0;
           x.weightloss =  x.endweight ?  parseFloat((x.startweight || 0) - (x.endweight || 0)).toFixed(2) : 0;

           let starttime = getLocalTime(x.starttime);
           let endtime = getLocalTime(x.endtime);
           var time = endtime - starttime ;
           time = convertSecToHour(time/1000);

           x.totaltime = time.hh + ":" + time.mm;
         });

             return { ...state, attendencelistPT: attendencelistPT , tableInfoPT : {...state.tableInfoPT , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} ,savedPtAttendance : 0};

       case SAVE_PT_SESSIONTIMEWEIGHT:
             return { ...state,savedPtAttendance : 0};

       case SAVE_PT_SESSIONTIMEWEIGHT_SUCCESS:
             return { ...state, dialogLoading : false ,savedPtAttendance : 0};

       case DELETE_LAST_PT_ATTENDANCE:
             return { ...state, lastptattendence : null ,savedPtAttendance : 0};

      case REQUEST_FAILURE:
                           return { ...state , loading : false, dialogLoading : false, disabled : false ,savedPtAttendance : 0};
      case REQUEST_SUCCESS:
                           return { ...state ,savedPtAttendance : 0};
       case ON_SHOW_LOADER:
                         return { ...state, loading : true, disabled : true ,savedPtAttendance : 0};
      case ON_HIDE_LOADER:
                         return { ...state, loading : false, dialogLoading : false, disabled : false ,savedPtAttendance : 0};
      break;
     default: return { ...state};
                                     }
                                     }
