import { NotificationManager } from 'react-notifications';
import  Status from 'Assets/data/status';
import Auth from '../Auth/Auth';
const authObject = new Auth();

let clientprofile = authObject.getClientProfile();


// action types
import {
OPEN_ADD_NEW_PACKAGE_MODEL,
CLOSE_ADD_NEW_PACKAGE_MODEL,
OPEN_ADD_NEW_PACKAGE_MODEL_SUCCESS,

SAVE_PACKAGE,
SAVE_PACKAGE_SUCCESS,

GET_PACKAGES_SUCCESS,
GET_PACKAGES,

OPEN_VIEW_PACKAGE_MODEL,
OPEN_VIEW_PACKAGE_MODEL_SUCCESS,
CLOSE_VIEW_PACKAGE_MODEL,

OPEN_EDIT_PACKAGE_MODEL,
OPEN_EDIT_PACKAGE_MODEL_SUCCESS,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      Packages: null, // initial service data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewPackageModal : false,
      viewPackageDialog:false,
      selectedPackage: null,
      editPackage : null,
      editMode : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      servicePlanList:null,
      productList : null,
      branchlist : null
    };

export default (state = INIT_STATE, action) => {

    switch (action.type) {

     case OPEN_ADD_NEW_PACKAGE_MODEL :
              return { ...state, addNewPackageModal : true ,editMode : false ,editPackage : null};
    case CLOSE_ADD_NEW_PACKAGE_MODEL:
              return { ...state, addNewPackageModal : false ,editMode : false,editPackage : null};
    case OPEN_ADD_NEW_PACKAGE_MODEL_SUCCESS:
             return { ...state,servicePlanList:action.payload.servicePlanList,productList :action.payload.productList,
                     addNewPackageModal : true, loading : false,branchlist:action.payload.branchlist };
     // get packages
      case GET_PACKAGES:
            let tableInfo = state.tableInfo;
             if(action.payload)
                 {
                   tableInfo.pageIndex  = action.payload.state.page;
                  tableInfo.pageSize  = action.payload.state.pageSize;
                   tableInfo.sorted  = action.payload.state.sorted;
                   tableInfo.filtered = action.payload.state.filtered;
                 }
             return { ...state , tableInfo : tableInfo};
     // get packages success
       case GET_PACKAGES_SUCCESS:
              return { ...state, Packages: action.payload.data,  tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages , totalrecord : action.payload.pages[0].count}};
        case SAVE_PACKAGE:
               return { ...state, dialogLoading : true, disabled : true };
       case SAVE_PACKAGE_SUCCESS:
                return { ...state, dialogLoading : false,addNewPackageModal : false , editMode : false, editPackage : null, disabled : false};
        case OPEN_EDIT_PACKAGE_MODEL:
                   return { ...state, addNewPackageModal : true, editMode : true, editPackage: null };
        case OPEN_EDIT_PACKAGE_MODEL_SUCCESS:
            let editPackage = action.payload.data[0];
              if(editPackage)
                { 
                    editPackage.packageitem.sort((x,y) => x.packageid- y.packageid);
                     editPackage.packageitem.forEach(x => x.totalPrice = parseFloat(x.specialprice * x.Quantity).toFixed(2));
                }
           return { ...state , editPackage : editPackage , addNewPackageModal : true,servicePlanList:action.payload.servicePlanList,productList :action.payload.productList,branchlist:action.payload.branchlist};
      case CLOSE_VIEW_PACKAGE_MODEL:
              return { ...state, viewPackageDialog : false , selectedPackage : null};
      case OPEN_VIEW_PACKAGE_MODEL:
              return { ...state, viewPackageDialog : true , selectedPackage : null};
      case OPEN_VIEW_PACKAGE_MODEL_SUCCESS:
                    let selectedPackage = action.payload.data[0];
                    if(selectedPackage)
                    {
                      selectedPackage.branchlist = selectedPackage.branchlist ? JSON.parse(selectedPackage.branchlist) : [];
                      selectedPackage.status = Status.filter(value => value.name == selectedPackage.status)[0];
                      selectedPackage.packageitem.sort((x,y) => x.packageid- y.packageid);
                      selectedPackage.packageitem.forEach(x => x.totalPrice = parseFloat(x.specialprice * x.Quantity).toFixed(2));
                    }
                   return { ...state, selectedPackage:selectedPackage };

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
