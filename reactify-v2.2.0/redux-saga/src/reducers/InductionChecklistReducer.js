/**
 * EmployeeManagement Reducer
 */
import {cloneDeep} from 'Helpers/helpers';
import update from 'react-addons-update';
import {convertMinToHourMin} from 'Helpers/unitconversion';

// action types
import {
  GET_INDUCTION_CHECKLIST_MEMBERS,
  GET_INDUCTION_CHECKLIST_MEMBERS_SUCCESS,

  REQUEST_FAILURE,
  REQUEST_SUCCESS,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		 inductionchecklistmembers: null, // initial member data
       loading : false,
       disabled : false,
       dialogLoading : false,
        tableInfo : {
          pageSize : 10,
          pageIndex : 0,
          pages : 1,
          totalrecord :0,
        },
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

        // get induction checklist member
        case GET_INDUCTION_CHECKLIST_MEMBERS:
        let tableInfo = state.tableInfo;
          if(action.payload)
          {
            if(action.payload.state)
            {
              tableInfo.pageIndex  = action.payload.state.page;
              tableInfo.pageSize  = action.payload.state.pageSize;
              tableInfo.sorted  = action.payload.state.sorted;
              tableInfo.filtered = action.payload.state.filtered;
              tableInfo.activitycheckervalue = action.payload.state.activitycheckervalue;
              tableInfo.activitycheckerlabel = action.payload.state.activitycheckerlabel;
              tableInfo.startDate = action.payload.state.startDate;
              tableInfo.endDate = action.payload.state.endDate;
              tableInfo.salesrepresentative = action.payload.state.salesrepresentative;
            }
            else {
              if(action.payload.activitycheckervalue){
                tableInfo.activitycheckervalue = action.payload.activitycheckervalue;
              }
              else if(action.payload.activitycheckerlabel){
                tableInfo.activitycheckerlabel = action.payload.activitycheckerlabel;
              }
              else if (action.payload.startDate) {
                tableInfo.startDate = action.payload.startDate;
                tableInfo.endDate = action.payload.endDate;
              }
              else if (action.payload.salesrepresentative) {
                tableInfo.salesrepresentative = action.payload.salesrepresentative;
              }
            }
          }
        return { ...state , tableInfo : tableInfo};

        case GET_INDUCTION_CHECKLIST_MEMBERS_SUCCESS:

          let inductionchecklistmembers = action.payload.data;
          return { ...state, inductionchecklistmembers: inductionchecklistmembers , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}, selectAll : false};

          case REQUEST_FAILURE:
          return { ...state , dialogLoading : false, disabled : false,importloading : false};

          case REQUEST_SUCCESS:
          return { ...state};

        case ON_SHOW_LOADER:
            return { ...state, loading: true };

        case ON_HIDE_LOADER:
            return { ...state, loading : false };

      default: return { ...state};
    }
}
