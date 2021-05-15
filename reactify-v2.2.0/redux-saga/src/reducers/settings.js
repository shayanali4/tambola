import {InvoiceConfig} from 'Constants/custom-config';
import Auth from '../Auth/Auth';
const authObject = new Auth();
import {cloneDeep,getLocalDate} from 'Helpers/helpers';
import {isMobile} from 'react-device-detect';

/**
 * App Settings Reducers
 */
import {
  COLLAPSED_SIDEBAR,
  DARK_MODE,
  LIGHT_MODE,
  BOXED_LAYOUT,
  RTL_LAYOUT,
  MINI_SIDEBAR,
  SEARCH_FORM_ENABLE,
  CHANGE_THEME_COLOR,
  TOGGLE_SIDEBAR_IMAGE,
  SET_SIDEBAR_IMAGE,
  SET_LANGUAGE,
  START_USER_TOUR,
  STOP_USER_TOUR,
  TOGGLE_DARK_SIDENAV,
  GET_USER_PROFILE,
  GET_USER_PROFILE_SUCCESS,
  GET_SESSIONTYPE_LIST_SUCCESS,
  GET_CLIENT_PROFILE,
  GET_CLIENT_PROFILE_SUCCESS,
  SAVE_CLIENT_PROFILE,
  SAVE_CLIENT_PROFILE_SUCCESS,
  SAVE_CHANGE_PASSWORD,
  SAVE_CHANGE_PASSWORD_SUCCESS,
  SET_USER_THEME,
  GET_MEMBER_PROFILE_SUCCESS,

  SAVE_CONFIGURATION,
  SAVE_CONFIGURATION_SUCCESS,

  VIEW_CONFIGURATION_DETAIL,
  VIEW_CONFIGURATION_DETAIL_SUCCESS,

  SAVE_PAYMENTGATEWAY_CONFIGURATION,
  SAVE_PAYMENTGATEWAY_CONFIGURATION_SUCCESS,


  SAVE_CLIENT_SOCIALMEDIA,

  OPEN_MEMBER_UNIT_MODEL,
  CLOSE_MEMBER_UNIT_MODEL,
  CHANGE_WEIGHT_UNIT,
  CHANGE_DISTANCE_UNIT,
  CHANGE_LENGTH_UNIT,
  CHANGE_TEMPERATURE_UNIT,

  OPEN_ADD_NEW_TAX_MODEL,
  CLOSE_ADD_NEW_TAX_MODEL,
  OPEN_ADD_NEW_TAX_MODEL_SUCCESS,

  SAVE_CLIENT_TAX,
  SAVE_CLIENT_TAX_SUCCESS,

  GET_CLIENT_TAX,
  GET_CLIENT_TAX_SUCCESS,

  OPEN_VIEW_CLIENT_TAX_MODEL,
  OPEN_VIEW_CLIENT_TAX_MODEL_SUCCESS,
  CLOSE_VIEW_CLIENT_TAX_MODEL,


  OPEN_ADD_NEW_TAX_CODE_CATEGORY_MODEL,
  OPEN_ADD_NEW_TAX_CODE_CATEGORY_MODEL_SUCCESS,
  CLOSE_ADD_NEW_TAX_CODE_CATEGORY_MODEL,

  SAVE_TAX_CODE_CATEGORY,
  SAVE_TAX_CODE_CATEGORY_SUCCESS,

  GET_TAX_CODE_CATEGORY,
  GET_TAX_CODE_CATEGORY_SUCCESS,

  OPEN_VIEW_TAX_CODE_CATEGORY_MODEL,
  OPEN_VIEW_TAX_CODE_CATEGORY_MODEL_SUCCESS,
  CLOSE_VIEW_TAX_CODE_CATEGORY_MODEL,

  OPEN_ADD_NEW_BIOMETRIC_MODEL,
  CLOSE_ADD_NEW_BIOMETRIC_MODEL,

  SAVE_CLIENT_BIOMETRIC,
  SAVE_CLIENT_BIOMETRIC_SUCCESS,

  GET_CLIENT_BIOMETRIC,
  GET_CLIENT_BIOMETRIC_SUCCESS,


  OPEN_VIEW_CLIENT_BIOMETRIC_MODEL,
  OPEN_VIEW_CLIENT_BIOMETRIC_MODEL_SUCCESS,
  CLOSE_VIEW_CLIENT_BIOMETRIC_MODEL,


  SAVE_PAYMENTGATEWAY_CONFIGURATION_STATUS,
  SAVE_PAYMENTGATEWAY_CONFIGURATION_STATUS_SUCCESS,

  SAVE_USER_THEME,
  SAVE_USER_THEME_SUCCESS,

  SAVE_MEMBER_THEME,
  SAVE_MEMBER_THEME_SUCCESS,

  GET_BRANCH_PROFILE_SUCCESS,

  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,

} from 'Actions/types';

// app config
import AppConfig from 'Constants/AppConfig';
import CustomConfig from 'Constants/custom-config';

let profileDetail = authObject.getProfile();
let clientProfileDetail = authObject.getClientProfile();
let memberunit = {};

if(profileDetail && profileDetail.unit)
{
    memberunit = profileDetail.unit;
}

let sidebarImages = [
  require('Assets/img/sidebar-1.jpg'),
  require('Assets/img/sidebar-2.jpg'),
  require('Assets/img/sidebar-3.jpg'),
  require('Assets/img/sidebar-4.jpg'),
];

function setSidebarImage(data) {
    if(data.sidebarimage)
    {
        let image = data.sidebarimage ?  JSON.parse(data.sidebarimage) : [];
        if(image && image.length > 0)
        {
           sidebarImages.map((x,key) =>
            {
              if(image.length > key)
              {
                  let path = CustomConfig.serverUrl + image[key];
                  sidebarImages[key] = sidebarImages[key].replace(sidebarImages[key],path);
              }
           })
        }
    }
  }


/**
 * initial app settings
 */
const INIT_STATE = {
  navCollapsed: AppConfig.navCollapsed,
  dialogLoading : false,
  darkMode: AppConfig.darkMode,
  lightMode: AppConfig.lightMode,
  boxLayout: AppConfig.boxLayout,
  rtlLayout: AppConfig.rtlLayout,
  miniSidebar: AppConfig.miniSidebar,
  searchFormOpen: false, // search form by default false
  startUserTour: false,
  isDarkSidenav: true,
  themes: [
    {
      id: 1,
      name: 'primary'
    },
    {
      id: 2,
      name: 'secondary'
    },
    {
      id: 3,
      name: 'warning'
    },
    {
      id: 4,
      name: 'info'
    },
    {
      id: 5,
      name: 'danger'
    },
    {
      id: 6,
      name: 'success'
    }
  ],
  activeTheme: {
    id: 1,
    name: 'primary'
  },
  // sidebar background image
  sidebarBackgroundImages: [

  ],
  enableSidebarBackgroundImage: AppConfig.enableSidebarBackgroundImage, // default enable sidebar background
  selectedSidebarImage: sidebarImages[0], // default sidebar background image
  locale: AppConfig.locale,
  languages: [
    {
      languageId: 'english',
      locale: 'en',
      name: 'English',
      icon: 'en',
    }
  ],
  userProfileDetail:profileDetail,
  clientProfileDetail : clientProfileDetail,
  disabled : false,
  changePasswordsuccess : false,
  memberProfileDetail:profileDetail,
  configurationsuccess : false,
  employeecode : null,
  membercode : null,
  enquirycode : null,
  hidememberbalanceandtransactions : null,

  opnunitDialog:false,
  weightunit :  memberunit.weightunit == "kg" ? 0 : 1,
  distanceunit : memberunit.distanceunit == "km" ? 0 : 1,
  lengthunit : memberunit.lengthunit == "cm" ? 0 : 1,
  temperatureunit : memberunit.temperatureunit == "°C" ? 0 : 1,

  addNewTaxModal : false,
  tableInfo : {
    pageSize : 10,
    pageIndex : 0,
    pages : 1
  },
  taxes : null,
  selectedtax : null,
  istextgroup : false,
  taxlist : null,
  viewtaxDialog : false,
  addNewTaxCodeCategoryModal : false,
  taxcodecategories : null,
  viewtaxCodeCategoryDialog :  false,
  selectedtaxcodecategory :null,
  addNewBiometricModal : false,
  biometrics : null,
  viewBiometricDialog : false,
  selectedBiometric : false,
  loading : false,
  isbranchprofileupdated : 0
};

export default (state = INIT_STATE, action) => {


  switch (action.type) {

    // collapse sidebar
    case COLLAPSED_SIDEBAR:
      return { ...state, navCollapsed: action.isCollapsed };

    // start user tour
    case START_USER_TOUR:
      return { ...state, startUserTour: true };

    // stop user tour
    case STOP_USER_TOUR:
      return { ...state, startUserTour: false };

    // change theme color
    case CHANGE_THEME_COLOR:
      return { ...state, activeTheme: action.payload };

    // dark mode
    case DARK_MODE:
      let darkMode = action.payload;
      return { ...state, darkMode: darkMode, isDarkSidenav : darkMode ? darkMode : state.isDarkSidenav , lightMode : darkMode ? !darkMode : state.lightMode};

      // light mode
      case LIGHT_MODE:
      let lightMode = action.payload;
      return { ...state, lightMode: lightMode, isDarkSidenav : lightMode ? !lightMode : state.isDarkSidenav ,darkMode : lightMode ? !lightMode : state.darkMode};

    // boxed layout
    case BOXED_LAYOUT:
      return { ...state, boxLayout: action.payload };

    // rtl layout
    case RTL_LAYOUT:
      return { ...state, rtlLayout: action.payload };

    // mini= "true" sidebar
    case MINI_SIDEBAR:
      return { ...state, miniSidebar: action.payload };

    // search form
    case SEARCH_FORM_ENABLE:
      document.body.classList.toggle('search-active', !state.searchFormOpen);
      return { ...state, searchFormOpen: !state.searchFormOpen };

    // togglw sidebar image
    case TOGGLE_SIDEBAR_IMAGE:
      return { ...state, enableSidebarBackgroundImage: !state.enableSidebarBackgroundImage };

    // set sidebar image
    case SET_SIDEBAR_IMAGE:
      return { ...state, selectedSidebarImage: action.payload };

    // set language
    case SET_LANGUAGE:
      return { ...state, locale: action.payload };

    // dark sidenav
    case TOGGLE_DARK_SIDENAV:
      return { ...state, isDarkSidenav: !state.isDarkSidenav };
    case GET_SESSIONTYPE_LIST_SUCCESS:
     return {...state, sessiontypelist : action.payload.data}
      case GET_USER_PROFILE_SUCCESS:
      {
        let userProfileDetail =  action.payload.data;
        let theme = {};
        if(userProfileDetail)
        {

            if(userProfileDetail.dateofbirth){
              userProfileDetail.age = new Date().getFullYear() - (getLocalDate(userProfileDetail.dateofbirth)).getFullYear();

            }
           userProfileDetail.modules = userProfileDetail.modules ? JSON.parse(userProfileDetail.modules) : [];
           userProfileDetail.additionalrights = userProfileDetail.additionalrights ? JSON.parse(userProfileDetail.additionalrights) : [];
           userProfileDetail.genderId = userProfileDetail.genderId ? userProfileDetail.genderId.toString() : "1";

           userProfileDetail.theme = userProfileDetail.theme ? JSON.parse(userProfileDetail.theme) : {};

           userProfileDetail.unit =  userProfileDetail.unit ? JSON.parse(userProfileDetail.unit) : null;
           userProfileDetail.totalpayment =   action.payload.staffpaydetail && action.payload.staffpaydetail.totalpayment;
           userProfileDetail.paidsalaryoflastmonth =   action.payload.staffpaydetail && action.payload.staffpaydetail.paidsalaryoflastmonth ? action.payload.staffpaydetail.paidsalaryoflastmonth : 0;
           userProfileDetail.specialization =  userProfileDetail.specialization ? JSON.parse(userProfileDetail.specialization) : [];

           userProfileDetail.defaultbranchid = userProfileDetail.defaultbranchid ? userProfileDetail.defaultbranchid : "";

           if(userProfileDetail.paidsalaryoflastmonth > 0 && userProfileDetail.salary > 0){
             userProfileDetail.payablesalary = userProfileDetail.salary - userProfileDetail.paidsalaryoflastmonth ;
             userProfileDetail.payablesalary = userProfileDetail.payablesalary > 0 ? userProfileDetail.payablesalary : 0;
           }
           else{
             userProfileDetail.payablesalary = userProfileDetail.salary;
           }

           userProfileDetail.schedule = userProfileDetail.schedule ? JSON.parse(userProfileDetail.schedule) : null;
           userProfileDetail.shifttiming = userProfileDetail.shifttiming ? JSON.parse(userProfileDetail.shifttiming) : null;

           authObject.setProfile(userProfileDetail);
         }
        return { ...state, userProfileDetail : cloneDeep(userProfileDetail) };
     }
      case GET_CLIENT_PROFILE_SUCCESS:
      let {isbranchprofileupdated} = state;

          if(action.payload)
          {
             setSidebarImage(action.payload.data);
            state.sidebarBackgroundImages = sidebarImages;
          }
          let clientProfileDetail = action.payload.data;
          if(clientProfileDetail)
          {
                        clientProfileDetail.signinbackgroundimage = clientProfileDetail.signinbackgroundimage ? JSON.parse(clientProfileDetail.signinbackgroundimage) :  [];
                        clientProfileDetail.memberprofilecoverimage =  clientProfileDetail.memberprofilecoverimage ?  JSON.parse(clientProfileDetail.memberprofilecoverimage) : [];
                        clientProfileDetail.sidebarimage = clientProfileDetail.sidebarimage ? JSON.parse(clientProfileDetail.sidebarimage) : [];


                        clientProfileDetail.clienttypeId = clientProfileDetail.clienttypeId ? parseInt(clientProfileDetail.clienttypeId) : 1;
                        clientProfileDetail.discounttypeId = clientProfileDetail.discounttypeId ? clientProfileDetail.discounttypeId.toString() : "1";
                        clientProfileDetail.taxtypeId = clientProfileDetail.taxtypeId ? clientProfileDetail.taxtypeId.toString() : "1";

                        clientProfileDetail.printtypeId = clientProfileDetail.printtypeId ? clientProfileDetail.printtypeId.toString() : "1";

                        clientProfileDetail.termsconditions = clientProfileDetail.termsconditions ? unescape(clientProfileDetail.termsconditions) : InvoiceConfig.termscondition;
                        clientProfileDetail.footermessge = clientProfileDetail.footermessge ? unescape(clientProfileDetail.footermessge) : InvoiceConfig.footermessge;

                        clientProfileDetail.ishavemutliplebranch = clientProfileDetail.ishavemutliplebranch ? parseInt(clientProfileDetail.ishavemutliplebranch) : 0;

                        clientProfileDetail.socialmedia = clientProfileDetail.socialmedia ? JSON.parse(clientProfileDetail.socialmedia) : null;
                        clientProfileDetail.biometric = clientProfileDetail.biometric ? JSON.parse(clientProfileDetail.biometric) : null;
                        clientProfileDetail.geofencing = clientProfileDetail.geofencing ? JSON.parse(clientProfileDetail.geofencing) : null;
                        clientProfileDetail.cardswipe = clientProfileDetail.cardswipe ? JSON.parse(clientProfileDetail.cardswipe) : null;
                        clientProfileDetail.termsconditionstypeId = clientProfileDetail.termsconditionstypeId ? clientProfileDetail.termsconditionstypeId.toString() : "1";

                      authObject.setClientProfile(clientProfileDetail);
                      isbranchprofileupdated = 0;
          }

          return { ...state, clientProfileDetail: cloneDeep(clientProfileDetail),isbranchprofileupdated};

          case GET_BRANCH_PROFILE_SUCCESS:
               isbranchprofileupdated = state;
              let branchProfileDetail = action.payload.data;
               clientProfileDetail =state.clientProfileDetail;
              if(branchProfileDetail)
              {

                            branchProfileDetail.biometriclist = branchProfileDetail.biometriclist ? JSON.parse(branchProfileDetail.biometriclist) : null;
                            branchProfileDetail.schedule = branchProfileDetail.schedule ? JSON.parse(branchProfileDetail.schedule) : null
                            branchProfileDetail.ptslotdetail = branchProfileDetail.ptslotdetail ? JSON.parse(branchProfileDetail.ptslotdetail) : null
                            branchProfileDetail.shifttiming = branchProfileDetail.shifttiming && JSON.parse(branchProfileDetail.shifttiming);

                            clientProfileDetail = Object.assign(clientProfileDetail, branchProfileDetail);

                          authObject.setClientProfile(clientProfileDetail);
                          isbranchprofileupdated = 1;
              }

        return { ...state, clientProfileDetail: cloneDeep(clientProfileDetail),isbranchprofileupdated};

        case SAVE_CLIENT_PROFILE:
                       return { ...state,disabled : true};

       case SAVE_CLIENT_PROFILE_SUCCESS:
                      return { ...state,disabled : false};

      case SAVE_CHANGE_PASSWORD:
                return { ...state, disabled : true};
      case   SAVE_CHANGE_PASSWORD_SUCCESS:
                 return { ...state,disabled : false ,changePasswordsuccess : true};
       case SET_USER_THEME:
       {
         let theme = action.payload;
          return { ...state, activeTheme : theme.activeTheme || state.activeTheme ,
                              enableSidebarBackgroundImage : theme.enableSidebarBackgroundImage != undefined ? theme.enableSidebarBackgroundImage : state.enableSidebarBackgroundImage ,
                            selectedSidebarImage : theme.selectedSidebarImage || state.selectedSidebarImage ,
                          isDarkSidenav : theme.isDarkSidenav != undefined ? theme.isDarkSidenav : state.isDarkSidenav ,
                        miniSidebar : theme.miniSidebar != undefined ? (isMobile ? false : theme.miniSidebar) : (isMobile ? false : state.miniSidebar) ,
                      darkMode : theme.darkMode != undefined ? theme.darkMode : state.darkMode ,
                      lightMode : theme.lightMode != undefined ? theme.lightMode : state.lightMode,
                      rtlLayout : theme.rtlLayout != undefined ? theme.rtlLayout : state.rtlLayout };
        }

        case GET_MEMBER_PROFILE_SUCCESS:
         let  memberProfileDetail = action.payload.data[0][0];
              memberProfileDetail.totalpayment = action.payload.data[1][0].totalpayment;
              memberProfileDetail.purchase = action.payload.data[2][0].purchase;
              memberProfileDetail.totalbalanceadjust =  action.payload.data[3][0];



                    memberProfileDetail.genderId = memberProfileDetail.genderId ? memberProfileDetail.genderId.toString() : "1"
                    if(memberProfileDetail.dateofbirth){
                      memberProfileDetail.age = new Date().getFullYear() - (getLocalDate(memberProfileDetail.dateofbirth)).getFullYear();

                   }
                   memberProfileDetail.measurementdata =   memberProfileDetail.measurementdata  ? JSON.parse(memberProfileDetail.measurementdata) : null ;
                  memberProfileDetail.weight = memberProfileDetail.measurementdata && memberProfileDetail.measurementdata.weight;
                 memberProfileDetail.height = memberProfileDetail.measurementdata && memberProfileDetail.measurementdata.height;

                 memberProfileDetail.measurementdata_goal =   memberProfileDetail.measurementdata_goal  ? JSON.parse(memberProfileDetail.measurementdata_goal) : null ;
                 memberProfileDetail.target_weight = memberProfileDetail.measurementdata_goal && memberProfileDetail.measurementdata_goal.weight;

                 memberProfileDetail.unit =  memberProfileDetail.unit ? JSON.parse(memberProfileDetail.unit) : null;
                 memberProfileDetail.theme = memberProfileDetail.theme ? JSON.parse(memberProfileDetail.theme) : {};
                 memberProfileDetail.gymaccessslotlist = memberProfileDetail.gymaccessslotlist ? JSON.parse(memberProfileDetail.gymaccessslotlist) : null
                 memberProfileDetail.branchlist = memberProfileDetail.branchlist ? JSON.parse(memberProfileDetail.branchlist) : null;
                 memberProfileDetail.ptslotdetail = memberProfileDetail.ptslotdetail ? JSON.parse(memberProfileDetail.ptslotdetail) : null

                 authObject.setProfile(memberProfileDetail);

          return { ...state, memberProfileDetail:cloneDeep(memberProfileDetail)};
        case SAVE_CONFIGURATION:
              return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_CONFIGURATION_SUCCESS:
              return { ...state, dialogLoading : false, disabled : false,configurationsuccess : true};
        case VIEW_CONFIGURATION_DETAIL:
                 return { ...state, editMode : true, employeecode: null,membercode : null,enquirycode : null,hidememberbalanceandtransactions : null };
        case VIEW_CONFIGURATION_DETAIL_SUCCESS:
                 return { ...state , employeecode : action.payload.data[0] && action.payload.data[0].length > 0 ? action.payload.data[0][0].employeecode : null,
                   membercode : action.payload.data[1] && action.payload.data[1].length > 0 ? action.payload.data[1][0].membercode : null,
                   enquirycode : action.payload.data[2] && action.payload.data[2].length > 0  ? action.payload.data[2][0].enquirycode : null,
                   hidememberbalanceandtransactions : action.payload.data[3][0].hidememberbalanceandtransactions };

         case SAVE_PAYMENTGATEWAY_CONFIGURATION:
                  return { ...state,  dialogLoading : true, disabled : true };
         case SAVE_PAYMENTGATEWAY_CONFIGURATION_SUCCESS:
                  return { ...state, dialogLoading : false, disabled : false};

        case SAVE_PAYMENTGATEWAY_CONFIGURATION_STATUS:
                  return { ...state,  dialogLoading : true, disabled : true };
       case SAVE_PAYMENTGATEWAY_CONFIGURATION_STATUS_SUCCESS:
                  return { ...state, dialogLoading : false, disabled : false};


       case OPEN_MEMBER_UNIT_MODEL :
                   return { ...state, opnunitDialog : true};
      case CLOSE_MEMBER_UNIT_MODEL :
                   return { ...state, opnunitDialog : false};
       case CHANGE_WEIGHT_UNIT :
                     return { ...state,weightunit :action.payload.weightunit };
      case CHANGE_DISTANCE_UNIT :
                     return { ...state,distanceunit :action.payload.distanceunit };
      case CHANGE_LENGTH_UNIT :
                     return { ...state,lengthunit :action.payload.lengthunit };
      case CHANGE_TEMPERATURE_UNIT :
                   return { ...state,temperatureunit :action.payload.temperatureunit };

      case OPEN_ADD_NEW_TAX_MODEL :
                     let istextgroup = action.payload.data;
                       if(istextgroup == true){
                         return { ...state, addNewTaxModal : true,istextgroup : istextgroup,loading : true, selectedtax : null};
                       }
                       else{
                         return { ...state, addNewTaxModal : true,istextgroup : istextgroup , selectedtax : null};
                       }
    case OPEN_ADD_NEW_TAX_MODEL_SUCCESS:
                       taxlist = action.payload.taxlist;
                         if(taxlist){
                         taxlist =   taxlist.filter(x => !x.taxgroupitem)
                         }
                  return { ...state,taxlist:taxlist, loading : false,addNewTaxModal : true, selectedtax : null };
     case CLOSE_ADD_NEW_TAX_MODEL:
                  return { ...state, addNewTaxModal : false , selectedtax : null };
     case SAVE_CLIENT_TAX:
                return { ...state, dialogLoading : true, disabled : true };
     case SAVE_CLIENT_TAX_SUCCESS:
                return { ...state, dialogLoading : false,addNewTaxModal : false, disabled : false};
       case GET_CLIENT_TAX:
                 return { ...state , tableInfo : state.tableInfo};
      case GET_CLIENT_TAX_SUCCESS:
                     let taxes = action.payload.data;
                     if(taxes){
                       taxes.forEach(x => x.percentage = !x.taxgroupitem ? x.percentage :
                         x.taxgroupitem.filter(z => z.checked).map(y => y.percentage).reduce((a, b) => parseFloat(a) + parseFloat(b),0))
                     }
                   return { ...state, taxes: taxes,taxlist : action.payload.taxlist};
     case OPEN_VIEW_CLIENT_TAX_MODEL:
                                   return { ...state, viewtaxDialog : true, selectedtax: null };
       case OPEN_VIEW_CLIENT_TAX_MODEL_SUCCESS:

                               let selectedtax = action.payload.data[0];
                                 istextgroup = state;
                               if(selectedtax.taxgroupitem){
                                 istextgroup = true;
                                 selectedtax.percentage = selectedtax.taxgroupitem.
                                   filter(z => z.checked).map(y => y.percentage).reduce((a, b) => parseFloat(a) + parseFloat(b),0)
                               }
                               else{
                                 istextgroup = false
                               }
                   return { ...state , selectedtax :selectedtax,istextgroup:istextgroup};
       case CLOSE_VIEW_CLIENT_TAX_MODEL:
                    return { ...state, viewtaxDialog : false , selectedtax : null };


     case OPEN_ADD_NEW_TAX_CODE_CATEGORY_MODEL :
              return { ...state, addNewTaxCodeCategoryModal : true};
     case OPEN_ADD_NEW_TAX_CODE_CATEGORY_MODEL_SUCCESS:
                       taxlist = action.payload.taxlist;
                       if(taxlist){
                       taxlist =   taxlist.filter(x => x.taxgroupitem);
                       taxlist.forEach(x => {
                         x.taxgroupitem = JSON.parse(x.taxgroupitem);
                         x.percentage =
                         x.taxgroupitem.filter(z => z.checked).map(y => y.percentage).reduce((a, b) => parseFloat(a) + parseFloat(b),0);
                         x.label = x.label + " " + x.percentage + "%";
                       });


                       }
                  return { ...state,taxlist:taxlist, loading : false,addNewTaxCodeCategoryModal : true };
      case CLOSE_ADD_NEW_TAX_CODE_CATEGORY_MODEL:
                 return { ...state, addNewTaxCodeCategoryModal : false };
      case SAVE_TAX_CODE_CATEGORY:
                return { ...state, dialogLoading : true, disabled : true };
      case SAVE_TAX_CODE_CATEGORY_SUCCESS:
               return { ...state, dialogLoading : false,addNewTaxCodeCategoryModal : false, disabled : false};
      case GET_TAX_CODE_CATEGORY:
                return { ...state , tableInfo : state.tableInfo};
      case GET_TAX_CODE_CATEGORY_SUCCESS:
               let taxcodecategories = action.payload.data;
              let taxlist = action.payload.taxlist;
                      if(taxcodecategories){
                          taxcodecategories.forEach(x => {
                           x.taxgroupitem  = JSON.parse(x.taxgroupitem);
                           x.percentage = x.taxgroupitem.map(y => y.percentage).reduce((a, b) => parseFloat(a) + parseFloat(b),0)});
                        }
              return { ...state, taxcodecategories: taxcodecategories,taxlist : taxlist};
      case OPEN_VIEW_TAX_CODE_CATEGORY_MODEL:
             return { ...state, viewtaxCodeCategoryDialog : true, selectedtaxcodecategory: null };
      case OPEN_VIEW_TAX_CODE_CATEGORY_MODEL_SUCCESS:
               let selectedtaxcodecategory = action.payload.data[0];
                taxlist = action.payload.taxlist;
                  if(selectedtaxcodecategory){
                       selectedtaxcodecategory.taxgroupname = taxlist.filter(y => y.id == selectedtaxcodecategory.taxgroupid)[0].label
                       selectedtaxcodecategory.taxgroupitem  = JSON.parse(selectedtaxcodecategory.taxgroupitem);
                       selectedtaxcodecategory.percentage = selectedtaxcodecategory.taxgroupitem.map(y => y.percentage).reduce((a, b) => parseFloat(a) + parseFloat(b),0);
                     }
                   return { ...state , selectedtaxcodecategory :selectedtaxcodecategory};
      case CLOSE_VIEW_TAX_CODE_CATEGORY_MODEL:
                  return { ...state, viewtaxCodeCategoryDialog : false , selectedtaxcodecategory : null };

        case OPEN_ADD_NEW_BIOMETRIC_MODEL :
                  return { ...state, addNewBiometricModal : true};
       case CLOSE_ADD_NEW_BIOMETRIC_MODEL:
                return { ...state, addNewBiometricModal : false  };
        case SAVE_CLIENT_BIOMETRIC:
                 return { ...state, dialogLoading : true, disabled : true };
        case SAVE_CLIENT_BIOMETRIC_SUCCESS:
                  return { ...state, dialogLoading : false,addNewBiometricModal : false, disabled : false};
        case GET_CLIENT_BIOMETRIC:
                  return { ...state , tableInfo : state.tableInfo};
       case GET_CLIENT_BIOMETRIC_SUCCESS:
              return { ...state, biometrics:  action.payload.data};
        case OPEN_VIEW_CLIENT_BIOMETRIC_MODEL:
              return { ...state, viewBiometricDialog : true, selectedBiometric: null };
        case OPEN_VIEW_CLIENT_BIOMETRIC_MODEL_SUCCESS:
                    return { ...state , selectedBiometric : action.payload.data[0]};
        case CLOSE_VIEW_CLIENT_BIOMETRIC_MODEL:
                             return { ...state, viewBiometricDialog : false , selectedBiometric : null };
        case SAVE_USER_THEME:
                             return { ...state,disabled : true};

        case SAVE_USER_THEME_SUCCESS:
                           return { ...state,disabled : false};

       case SAVE_MEMBER_THEME:
                         return { ...state,disabled : true};

      case SAVE_MEMBER_THEME_SUCCESS:
                        return { ...state,disabled : false};



        case ON_SHOW_LOADER:
            return { ...state, loading: true };

        case ON_HIDE_LOADER:
            return { ...state, loading : false };

            case REQUEST_FAILURE:
            return { ...state , loading : false, disabled : false};

    default: return { ...state };
  }
}
