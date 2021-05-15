import { NotificationManager } from 'react-notifications';
import {convertSecToHour,convertkgTolbs} from 'Helpers/unitconversion';
// action types
import {
  SAVE_CLASSATTENDANCE,
  SAVE_CLASSATTENDANCE_SUCCESS,

  GET_CLASSATTENDANCE_LIST,
  GET_CLASSATTENDANCE_LIST_SUCCESS,

  DELETE_CLASS_ATTENDANCE,
  DELETE_CLASS_LAST_ATTENDANCE,

  SAVE_SESSIONWEIGHT,
  SAVE_SESSIONWEIGHT_SUCCESS,

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
  classlist : null,
  tableInfo : {
    pageSize : 5,
    pageIndex : 0,
    pages : 1,
    totalrecord :0,
  },
};
export default (state = INIT_STATE, action) => {

    switch (action.type) {
      case SAVE_CLASSATTENDANCE:
          return { ...state,loading : true };
      case SAVE_CLASSATTENDANCE_SUCCESS:
      let lastattendence = action.payload.data[0];
                if(lastattendence)
                {
                  if(lastattendence.IsMembershipActvie == 0)
                  {
                    NotificationManager.warning('Member has no active membership.');
                  }
                  if(lastattendence.IsClassActvie == 0)
                  {
                    NotificationManager.warning('Member has no active class of ' + lastattendence.sessiontype +'.');
                  }
                }
          return { ...state, dialogLoading : false , lastattendence : lastattendence,loading : false};
      case GET_CLASSATTENDANCE_LIST:
          let tableInfo = state.tableInfo;
            if(action.payload)
            {
              tableInfo.pageIndex  = action.payload.state.page;
              tableInfo.pageSize  = action.payload.state.pageSize;
              tableInfo.sorted  = action.payload.state.sorted;
              tableInfo.filtered = action.payload.state.filtered;
            }
          return { ...state , tableInfo : tableInfo};

      case GET_CLASSATTENDANCE_LIST_SUCCESS:

      let classlist = action.payload.data;

      classlist && classlist.forEach(x =>
        {
          x.startweight = x.startweight || 0;
          x.endweight = x.endweight || 0;

          x.startweightlbs =  convertkgTolbs(x.startweight);
          x.startweightlbs = x.startweightlbs ? x.startweightlbs.toFixed(2) : 0;
          x.endweightlbs =  convertkgTolbs(x.endweight);
          x.endweightlbs = x.endweightlbs ? x.endweightlbs.toFixed(2) : 0;

          x.weightlosslbs =  parseFloat( (x.endweightlbs || 0) - (x.startweightlbs || 0)).toFixed(2);
          x.weightloss =  parseFloat( (x.endweight || 0) - (x.startweight || 0)).toFixed(2);
        });
            return { ...state, classlist: classlist , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

      case DELETE_CLASS_LAST_ATTENDANCE:
                 return { ...state, lastattendence : null};
        case SAVE_SESSIONWEIGHT:
                 return { ...state };
        case SAVE_SESSIONWEIGHT_SUCCESS:
               return { ...state, dialogLoading : false};


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
