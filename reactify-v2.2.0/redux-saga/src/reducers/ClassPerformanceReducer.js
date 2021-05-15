import {convertSecToHour,convertkgTolbs} from 'Helpers/unitconversion';
import Auth from '../Auth/Auth';
const authObject = new Auth();

// action types
import {
  GET_CLASS_PERFORMANCE_SUCCESS,
  GET_CLASS_PERFORMANCE,

  OPEN_VIEW_CLASS_PERFORMANCE_MODEL,
  OPEN_VIEW_CLASS_PERFORMANCE_MODEL_SUCCESS,
  CLOSE_VIEW_CLASS_PERFORMANCE_MODEL,

  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
  performances: null, // initial class data
  loading : false,
  disabled : false,
  dialogLoading : false,
  selectedperformance : null,
  viewClassPerformanceDialog:false,
  tableInfo : {
    pageSize : 10,
    pageIndex : 0,
    pages : 1,
    totalrecord :0,
  },
  tableInfoView : {
    pageSize : 10,
    pageIndex : 0,
    pages : 1
  },
};
export default (state = INIT_STATE, action) => {
    switch (action.type) {
      // get performances
      case GET_CLASS_PERFORMANCE:
      let profileDetail = authObject.getProfile();

      let tableInfo = state.tableInfo;
        if(action.payload)
        {
          tableInfo.pageIndex  = action.payload.state.page;
          tableInfo.pageSize  = action.payload.state.pageSize;
          tableInfo.sorted  = action.payload.state.sorted;
          tableInfo.filtered = action.payload.state.filtered;
          tableInfo.isTrainer = profileDetail.isTrainer;
        }
          return { ...state ,tableInfo : tableInfo};
      // get performances success
      case GET_CLASS_PERFORMANCE_SUCCESS:

          return { ...state, performances: action.payload.data, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
      case OPEN_VIEW_CLASS_PERFORMANCE_MODEL:
      let tableInfoView = state.tableInfoView;
        if(action.payload)
        {
            if(action.payload.data)
            {
              const {classid,date} = action.payload.data;
              tableInfoView.classid = classid;
              tableInfoView.date = date;
            }
            else {
              tableInfoView.pageIndex  = action.payload.state.page;
              tableInfoView.pageSize  = action.payload.state.pageSize;
              tableInfoView.sorted  = action.payload.state.sorted;
              tableInfoView.filtered = action.payload.state.filtered;
            }
          }
          return { ...state , tableInfoView : tableInfoView};

      case OPEN_VIEW_CLASS_PERFORMANCE_MODEL_SUCCESS :
      let selectedperformance = action.payload.data;

      selectedperformance && selectedperformance.forEach(x =>
        {
          x.startweight = x.startweight ? parseFloat(x.startweight).toFixed(2) : 0;
          x.endweight = x.endweight ? parseFloat(x.endweight).toFixed(2) : 0;

          x.startweightlbs =  convertkgTolbs(x.startweight);
          x.startweightlbs = x.startweightlbs ? x.startweightlbs.toFixed(2) : 0;
          x.endweightlbs =  convertkgTolbs(x.endweight);
          x.endweightlbs = x.endweightlbs ? x.endweightlbs.toFixed(2) : 0;

          x.weightlosslbs =  parseFloat((x.startweightlbs || 0) - (x.endweightlbs || 0)).toFixed(2);
          x.weightloss =  parseFloat((x.startweight || 0) - (x.endweight || 0)).toFixed(2);
        });
            return { ...state,selectedperformance:selectedperformance,viewClassPerformanceDialog:true ,dialogLoading : true,tableInfoView : {...state.tableInfoView , pages : action.payload.pages[0].pages}};
      case CLOSE_VIEW_CLASS_PERFORMANCE_MODEL:
            return { ...state, viewClassPerformanceDialog : false };

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
