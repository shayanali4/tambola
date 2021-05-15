import update from 'react-addons-update';

// action types
import {
OPEN_ADD_NEW_MEASUREMENT_MODEL,
OPEN_ADD_NEW_MEASUREMENT_MODEL_SUCCESS,
CLOSE_ADD_NEW_MEASUREMENT_MODEL,
GET_MEASUREMENTS,
GET_MEASUREMENTS_SUCCESS,
SAVE_MEASUREMENT,
SAVE_MEASUREMENT_SUCCESS,
OPEN_VIEW_MEASUREMENT_MODEL,
OPEN_VIEW_MEASUREMENT_MODEL_SUCCESS,
CLOSE_VIEW_MEASUREMENT_MODEL,
DELETE_MEASUREMENT,
OPEN_EDIT_MEASUREMENT_MODEL,
OPEN_EDIT_MEASUREMENTMODEL_SUCCESS,

GET_BODY_MEASUREMENT_DETAILS,
GET_BODY_MEASUREMENT_DETAILS_SUCCESS,


OPEN_ADD_NEW_NOT_TAKEN_MEASUREMENT_MEMBER_MODEL,
CLOSE_ADD_NEW_NOT_TAKEN_MEASUREMENT_MEMBER_MODEL,

OPEN_VIEW_MEASUREMENT_INBODY_MODEL,
OPEN_VIEW_MEASUREMENT_INBODY_MODEL_SUCCESS,
CLOSE_VIEW_MEASUREMENT_INBODY_MODEL,

OPEN_VIEW_INBODY_MEASUREMENT_MODEL,
OPEN_VIEW_INBODY_MEASUREMENT_MODEL_SUCCESS,
CLOSE_VIEW_INBODY_MEASUREMENT_MODEL,


OPEN_VIEW_MEASUREMENT_PDF_MODEL,
CLOSE_VIEW_MEASUREMENT_PDF_MODEL,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
  measurements: null, // initial class data
  loading : false,
  disabled : false,
  dialogLoading : false,
  addNewMeasurementModal : false,
  selectedMeasurement: null,
  editmeasurement : null,
  editMode : false,
  viewMeasurementDialog:false,
  tableInfo : {
    pageSize : 10,
    pageIndex : 0,
    pages : 1,
    totalrecord :0,
  },
  bodymesuarement :null,
  addNewNotTakenMeasurementMemberModal : false,
  notTakenMeasurementMemberDetail : null,
  selectedInBodydata : null,
  viewInBodyDialog : false,
  selectedInBodyMeasurement : null,
  viewInBodyMeasurementDialog : false,
  viewPdfDialog : false,
  selectedPdfData : null,
  inbodyBodyCompositionHistory : null

};
export default (state = INIT_STATE, action) => {

    switch (action.type) {
      case GET_MEASUREMENTS:
      let tableInfo = state.tableInfo;
        if(action.payload)
        {
          if(action.payload.state)
          {
          tableInfo.pageIndex  = action.payload.state.page;
          tableInfo.pageSize  = action.payload.state.pageSize;
          tableInfo.sorted  = action.payload.state.sorted;
          tableInfo.filtered = action.payload.state.filtered;
          tableInfo.membersnottakenmeasurementlist = action.payload.state.membersnottakenmeasurementlist;
         }
         else {
          if(action.payload.membersmeasurementfilter != null){
            tableInfo.membersmeasurementfilter = action.payload.membersmeasurementfilter;
          }
          else if (action.payload.filterbydate || action.payload.filterbydate == null) {
            tableInfo.filterbydate = action.payload.filterbydate;
          }
        }
    }
      return { ...state , tableInfo : tableInfo};
                           // get service success
      case GET_MEASUREMENTS_SUCCESS:
            action.payload.data.forEach(x => {
                x.measurementdata_goal = x.measurementdata_goal ? JSON.parse(x.measurementdata_goal) : null;
                var measurementdata = JSON.parse(x.measurementdata);
                for (var key in measurementdata) { x[key] = measurementdata[key]}
                x.measurementdata = null;
              });
              action.payload.data.forEach(x => {
                  x.advancemeasurementdata_goal =x.advancemeasurementdata_goal ? JSON.parse(x.advancemeasurementdata_goal) : null;
                  var advancemeasurementdata = JSON.parse(x.advancemeasurementdata);
                  for (var key in advancemeasurementdata) { x[key] = advancemeasurementdata[key]}
                  x.advancemeasurementdata = null;
                  if(x.measurementdata_goal){
                   x.weightcontrol = (x.measurementdata_goal.weight - x.weight);
                   x.weightcontrol = x.weightcontrol.toFixed(2);
                  }
                });
                // action.payload.data.forEach(x => {
                //   
                //     var measurementdata_goal = JSON.parse(x.measurementdata_goal);
                //     for (var mg in measurementdata_goal) {
                //     x[mg + "goal"] = x[mg]
                //   }
                //     x.measurementdata_goal = null;
                //   });
                //   action.payload.data.forEach(x => {
                //       var advancemeasurementdata_goal = JSON.parse(x.advancemeasurementdata_goal);
                //       for (var ag in advancemeasurementdata_goal) {
                //         x[ag + "goal"] = x[ag]
                //       }
                //       x.advancemeasurementdata_goal = null;
                //     });

              return { ...state, measurements: action.payload.data ,tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

      case OPEN_ADD_NEW_MEASUREMENT_MODEL :
                         return { ...state, addNewMeasurementModal : true,editMode : false,editmeasurement : null, bodymesuarement : null,notTakenMeasurementMemberDetail:action.payload || null};
      case OPEN_ADD_NEW_MEASUREMENT_MODEL_SUCCESS:

                                return { ...state,
                        addNewMeasurementModal : true, loading : false };
     case CLOSE_ADD_NEW_MEASUREMENT_MODEL:
                         return { ...state, addNewMeasurementModal : false,editMode : false,editmeasurement : null, bodymesuarement : null,notTakenMeasurementMemberDetail:null};
    case SAVE_MEASUREMENT:
                          return { ...state, dialogLoading : true, disabled : true, bodymesuarement : null,editmeasurement : null};
    case SAVE_MEASUREMENT_SUCCESS:
                         return { ...state, dialogLoading : false,addNewMeasurementModal : false,selectedMeasurement :null,editMode : false, disabled : false,editmeasurement :null,addNewNotTakenMeasurementMemberModal : false};

    case OPEN_VIEW_MEASUREMENT_MODEL :
            return { ...state,selectedMeasurement: null,viewMeasurementDialog:true};

    case OPEN_VIEW_MEASUREMENT_MODEL_SUCCESS :
                         let selectedMeasurement = action.payload.data[0];
                         if(selectedMeasurement)
                         {
                             selectedMeasurement.measurementdata  = selectedMeasurement.measurementdata ? JSON.parse(selectedMeasurement.measurementdata) : {};
                             selectedMeasurement.advancemeasurementdata  =  selectedMeasurement.advancemeasurementdata ? JSON.parse(selectedMeasurement.advancemeasurementdata) : {};
                         }
                         return { ...state,selectedMeasurement:action.payload.data[0]};
    case CLOSE_VIEW_MEASUREMENT_MODEL:
                        return { ...state, viewMeasurementDialog : false };
    case OPEN_VIEW_INBODY_MEASUREMENT_MODEL :
                        return { ...state,selectedInBodyMeasurement: null,viewInBodyMeasurementDialog:true};

    case OPEN_VIEW_INBODY_MEASUREMENT_MODEL_SUCCESS :
                           let selectedInBodyMeasurement = action.payload.data[0];
                           if(selectedInBodyMeasurement)
                            {
                                    selectedInBodyMeasurement.measurementdata  = selectedInBodyMeasurement.measurementdata ? JSON.parse(selectedInBodyMeasurement.measurementdata) : {};
                                    selectedInBodyMeasurement.advancemeasurementdata  =  selectedInBodyMeasurement.advancemeasurementdata ? JSON.parse(selectedInBodyMeasurement.advancemeasurementdata) : {};
                              }
                            return { ...state,selectedInBodyMeasurement:action.payload.data[0]};
    case CLOSE_VIEW_INBODY_MEASUREMENT_MODEL:
                            return { ...state, viewInBodyMeasurementDialog : false };

    case OPEN_EDIT_MEASUREMENT_MODEL:
                        return { ...state, addNewMeasurementModal : true, editMode : true, editmeasurement: null };

    case OPEN_EDIT_MEASUREMENTMODEL_SUCCESS:
          let editmeasurement = action.payload.data[0];
            if(editmeasurement && editmeasurement.measurementdata)
            {
              editmeasurement.measurementdata  = JSON.parse(editmeasurement.measurementdata);
            }
            if(editmeasurement && editmeasurement.advancemeasurementdata) {
              editmeasurement.advancemeasurementdata  = JSON.parse(editmeasurement.advancemeasurementdata);
            }


                       return { ...state,editmeasurement: editmeasurement };

     case GET_BODY_MEASUREMENT_DETAILS :
                             return { ...state, loading : true , bodymesuarement : null};
    case GET_BODY_MEASUREMENT_DETAILS_SUCCESS:
    let bodymesuarement = action.payload.data[0];

    if(bodymesuarement)
    {
      bodymesuarement.measurementdata = bodymesuarement.measurementdata ? JSON.parse(bodymesuarement.measurementdata) : null;
      bodymesuarement.advancemeasurementdata = bodymesuarement.advancemeasurementdata ? JSON.parse(bodymesuarement.advancemeasurementdata) : null;
      bodymesuarement.measurementdate = bodymesuarement.measurementdate;
      bodymesuarement.memberId = bodymesuarement.id;
    }
    const {measurementdata, advancemeasurementdata,measurementdate,memberId} = bodymesuarement ? bodymesuarement : {};


     return { ...state, bodymesuarement: bodymesuarement ?  {measurementdata, advancemeasurementdata,measurementdate,memberId} : {} };


      case OPEN_ADD_NEW_NOT_TAKEN_MEASUREMENT_MEMBER_MODEL :
              return { ...state, addNewNotTakenMeasurementMemberModal : true};
      case CLOSE_ADD_NEW_NOT_TAKEN_MEASUREMENT_MEMBER_MODEL:
             return { ...state, addNewNotTakenMeasurementMemberModal : false,editWorkoutSchedules : null,  editMode : false};
      case OPEN_VIEW_MEASUREMENT_INBODY_MODEL:
             return { ...state, viewInBodyDialog : true };
       case OPEN_VIEW_MEASUREMENT_INBODY_MODEL_SUCCESS:
             return { ...state, viewInBodyDialog : true , selectedInBodydata : action.payload.data[0]};
      case CLOSE_VIEW_MEASUREMENT_INBODY_MODEL:
            return { ...state, viewInBodyDialog : false, selectedInBodydata : null};
      case OPEN_VIEW_MEASUREMENT_PDF_MODEL:
            let inbodyBodyCompositionHistory = action.payload.fullbodydata ;
            inbodyBodyCompositionHistory = inbodyBodyCompositionHistory.slice(0, 9);
            inbodyBodyCompositionHistory = inbodyBodyCompositionHistory.reverse();
                   return { ...state, viewPdfDialog : true,selectedPdfData : action.payload.data,inbodyBodyCompositionHistory : inbodyBodyCompositionHistory};
       case CLOSE_VIEW_MEASUREMENT_PDF_MODEL:
                  return { ...state, viewPdfDialog : false,selectedPdfData : null,inbodyBodyCompositionHistory : null};
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
