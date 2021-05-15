
/**
 * Employee Management Sagas
 */
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import FormData from 'form-data';
import {employeeManagementReducer,settings} from './states';
import { push } from 'connected-react-router';
// api
import api, {fileUploadConfig} from 'Api';
import Auth from '../Auth/Auth';
const authObject = new Auth();
import {cloneDeep,setLocalDate,setDateTime,delay } from 'Helpers/helpers';
import CustomConfig from 'Constants/custom-config';

import {
    OPEN_ADD_NEW_EMPLOYEE_MODEL,
    GET_EMPLOYEES,
    DELETE_EMPLOYEE,
    SAVE_EMPLOYEE,
    OPEN_VIEW_EMPLOYEE_MODEL,
    OPEN_EDIT_EMPLOYEE_MODEL,
    GET_SESSIONTYPE_LIST,
    GET_USER_PROFILE,
    GET_CLIENT_PROFILE,
    SAVE_CLIENT_PROFILE,
    SAVE_CHANGE_PASSWORD,
    SAVE_USER_THEME,
    SAVE_CONFIGURATION,
    VIEW_CONFIGURATION_DETAIL,
    SAVE_PAYMENTGATEWAY_CONFIGURATION,
    SAVE_USER_UNIT,
    SAVE_CLIENT_SOCIALMEDIA,
    OPEN_STARTER_VIEW_EMPLOYEE_MODEL,

    SAVE_CLIENT_TAX,
    GET_CLIENT_TAX,
    SAVE_CLIENT_TAX_CONFIGURATION,
    OPEN_VIEW_CLIENT_TAX_MODEL,
    OPEN_ADD_NEW_TAX_MODEL,
    DELETE_CLIENT_TAX,
    OPEN_ADD_NEW_TAX_CODE_CATEGORY_MODEL,
    SAVE_TAX_CODE_CATEGORY,
    GET_TAX_CODE_CATEGORY,
    OPEN_VIEW_TAX_CODE_CATEGORY_MODEL,
    DELETE_TAX_CODE_CATEGORY,
    SAVE_CLIENT_BIOMETRIC_CONFIGURATION,
    SAVE_CLIENT_BIOMETRIC,
    GET_CLIENT_BIOMETRIC,
    OPEN_VIEW_CLIENT_BIOMETRIC_MODEL,
    SET_EMPLOYEE_DEFAULT_BRANCH,
    ON_CANCEL_ADVANCEBOOKINGOFMEMBER,
    SAVE_PAYMENTGATEWAY_CONFIGURATION_STATUS,
    SAVE_TERMSCONDITION,
    GET_BRANCH_PROFILE
} from 'Actions/types';

import {
    opnAddNewEmployeeModelSuccess,
    getEmployeesSuccess,
    saveEmployeeSuccess,
    viewEmployeesSuccess,
    editEmployeesSuccess,
    requestSuccess,
    requestFailure,
    showLoader,
    hideLoader,
    getUserProfileSuccess,
    getSessionTypeListSuccess,
    getClientProfileSuccess,
    saveClientProfileSuccess,
    saveChagePasswordSuccess,
    saveConfigurationSuccess,
    viewconfigrationdetailSuccess,
    savePaymentGatewayConfigurationSuccess,
    viewStarterEmployeesSuccess,

    saveClientTaxSuccess,
    getClientTaxSuccess,
    viewClientTaxSuccess,
    opnAddNewTaxModelSuccess,
    opnAddNewTaxCodeCategoryModelSuccess,
    saveTaxCodecategorySuccess,
    getTaxCodeCategorySuccess,
    viewTaxCodeCategoryModelSuccess,
    saveClientBiometricSuccess,
    getClientBiometricSuccess,
    viewClientBiometricSuccess,

    setEmployeeDefaultBranchSuccess,
    savePaymentGatewayConfigurationStatusSuccess,
    saveUserThemeSuccess,
    saveTermsconditionSuccess,
    getBranchProfileSuccess
} from 'Actions';

/**
 * Send Employee Management Request To Server
 */
const getEmployeesRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "lastcheckin") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-employees', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
}
/**
 * Get Employees From Server
 */

function* getEmployeesFromServer() {
    try {
        const state = yield select(employeeManagementReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getEmployeesRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getEmployeesSuccess({data : response[0] , pages : response[1]}));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally {
    }
}


/**
 * Get Employees
 */
export function* getEmployees() {
    yield takeEvery(GET_EMPLOYEES, getEmployeesFromServer);
}

/**
 * Send Employee Delete Request To Server
 */
const deleteEmployeesRequest = function* (data)
{  let response = yield api.post('delete-employee', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete Employee From Server
 */
 function* deleteEmployeeFromServer(action) {
     try {

       const response = yield call(deleteEmployeesRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Employee deleted successfully."));
             yield call(getEmployeesFromServer);

        }
        else {
           yield put(requestFailure(response.errorMessage));
        }

     } catch (error) {
         console.log(error);
     }
     finally{
     }
 }

/**
 * Get Employees
 */
export function* deleteEmployee() {
    yield takeEvery(DELETE_EMPLOYEE, deleteEmployeeFromServer);
}

/**
 * Send Employee Save Request To Server
 */
const saveEmployeesRequest = function* (data)
{
  data = cloneDeep(data);
  data.professionaldetail.dateofjoining = setLocalDate(data.professionaldetail.dateofjoining);
  data.professionaldetail.dateofresigning = setLocalDate(data.professionaldetail.dateofresigning);
  data.personaldetail.dateofbirth = setLocalDate(data.personaldetail.dateofbirth);
  data.personaldetail.duration.map(x => {
    x.starttime = setDateTime(x.starttime);
    x.endtime = setDateTime(x.endtime);
   });
  data.personaldetail.schedule.map(x => {
    if(x.checked && x.duration && x.duration.length > 0)
    {
      x.duration.map(y => {
        y.starttime = setDateTime(y.starttime);
        y.endtime = setDateTime(y.endtime);
      })
    }
   });

  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

  if(data.professionaldetail.imageFiles.length > 0)
      formData.append("files", data.professionaldetail.imageFiles[0]);

    let response = yield api.post('save-employee', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save Employee From Server
 */
function* saveEmployeeFromServer(action) {
    try {
        const state1 = yield select(settings);

        action.payload.branchid = state1.userProfileDetail.defaultbranchid;

        const response = yield call(saveEmployeesRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {

            const {professionaldetail,reloadrequired} = action.payload;

            if(professionaldetail.id && professionaldetail.id != 0)
            {
              yield put(requestSuccess("Employee updated successfully."));
            }
            else {
              yield put(requestSuccess("Employee created successfully."));
            }
            yield  put(saveEmployeeSuccess());

            if(state1.clientProfileDetail.clienttypeId == 2)
            {
              yield put(push('/app/dashboard/master-dashboard'));
              if(reloadrequired)
              {
                window.location.reload();
              }
            }
            else {
              yield call(getEmployeesFromServer);
              if(reloadrequired)
              {
                yield put(push('/app/employee-management'));
                window.location.reload();
              }
              else {
                yield put(push('/app/employee-management'));
              }
            }
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 * Get Employees
 */
export function* saveEmployee() {
    yield takeEvery(SAVE_EMPLOYEE, saveEmployeeFromServer);
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewEmployeesRequest = function* (data)
 {  let response = yield api.post('view-employee', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }
/**
 * VIEW Employee From Server
 */
function* viewEmployeeFromServer(action) {
    try {
        const response = yield call(viewEmployeesRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewEmployeesSuccess({data : response}));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally
    {

    }
}
/**
 * VIEW Employees
 */
export function* opnViewEmployeeModel() {
    yield takeEvery(OPEN_VIEW_EMPLOYEE_MODEL, viewEmployeeFromServer);
}


/**
 * Edit Employee From Server
 */
function* editEmployeeFromServer(action) {
    try {
        const state = yield select(settings);

        const response = yield call(viewEmployeesRequest,action.payload);
        const response1 = yield call(getRoleRequest,action.payload);
        let response2 = [];
        let response3 = [];
        const response4 = yield call(getTimezoneRequest,action.payload);
        if(state.clientProfileDetail.ishavemutliplebranch == 1){
           response2 = yield call(getZoneRequest,action.payload);
           response3 = yield call(getBranchRequest,action.payload);
       }

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage && !response2.errorMessage && !response3.errorMessage && !response4.errorMessage)
        {
            yield put(editEmployeesSuccess({data : response[0],rolelist : response1[0],zonelist : response2[0],branchlist : response3[0],timezonelist : response4[0]}));
        }
        else {
          yield put(requestFailure(response.errorMessage || response1.errorMessage || response2.errorMessage || response3.errorMessage || response4.errorMessage));
        }
    } catch (error) {
        console.log(error);
    }
    finally
    {

    }
}

/**
 * Edit Employees
 */
export function* opnEditEmployeeModel() {
    yield takeEvery(OPEN_EDIT_EMPLOYEE_MODEL, editEmployeeFromServer);
}


const getSessionTypeListRequest = function* ()
{
   let response = yield api.post('session-list')
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}

export function* getSessionTypeListServer() {
   try {
       const response = yield call(getSessionTypeListRequest);

      if(!(response.errorMessage  || response.ORAT))
       {
           yield put(getSessionTypeListSuccess({data : response[0]}));
       }

   } catch (error) {
       console.log(error);
   }
   finally
   {
   }
}

export function* getSessionTypeList() {
   yield takeEvery(GET_SESSIONTYPE_LIST, getSessionTypeListServer);
}



const getUserProfileRequest = function* (data)
{
   let response = yield api.post('get-profile-detail', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}
/**
* VIEW Employee From Server
*/
export function* getUserProfileFromServer() {
   try {
       const response = yield call(getUserProfileRequest);

      if(!(response.errorMessage  || response.ORAT))
       {
           yield put(getUserProfileSuccess({data : response[0][0],staffpaydetail : response[1][0]}));
       }
       else {
         yield put(requestFailure(response.errorMessage));
       }

   } catch (error) {
       console.log(error);
   }
   finally
   {
   }
}
/**
* VIEW Employees
*/
export function* getUserProfile() {
   yield takeEvery(GET_USER_PROFILE, getUserProfileFromServer);
}


const getClientProfileRequest = function* (data)
{
  let response = yield api.post('get-client-profile-detail', data)
     .then(response => response.data)
     .catch(error => error.response.data )

   return response;
}
/**
* VIEW Employee From Server
*/
export function* getClientProfileFromServer() {
  try {
      const state = yield select(settings);

      let branchid = state.userProfileDetail && state.userProfileDetail.defaultbranchid ? state.userProfileDetail.defaultbranchid : 0;
      const response = yield call(getClientProfileRequest,{branchid});

      if(!(response.errorMessage  || response.ORAT))
      {
          yield put(getClientProfileSuccess({data : response[0][0]}));
      }
      else {
        yield put(requestFailure(response.errorMessage));
      }

  } catch (error) {
      console.log(error);
  }
  finally
  {
  }
}
/**
* VIEW Employees
*/
export function* getClientProfile() {
  yield takeEvery(GET_CLIENT_PROFILE, getClientProfileFromServer);
}

const getBranchProfileRequest = function* (data)
{
  let response = yield api.post('get-branch-profile-detail', data)
     .then(response => response.data)
     .catch(error => error.response.data )

   return response;
}
/**
* VIEW branch detail From Server
*/
export function* getBranchProfileFromServer() {
  try {
      const state = yield select(settings);

      let branchid = state.userProfileDetail && state.userProfileDetail.defaultbranchid ? state.userProfileDetail.defaultbranchid : 0;
      const response = yield call(getBranchProfileRequest,{branchid});

      if(!(response.errorMessage  || response.ORAT))
      {
         
          yield put(getBranchProfileSuccess({data : response[0][0]}));
      }
      else {
        yield put(requestFailure(response.errorMessage));
      }

  } catch (error) {
      console.log(error);
  }
  finally
  {
  }
}
/**
* VIEW Employees
*/
export function* getBranchProfile() {
  yield takeEvery(GET_BRANCH_PROFILE, getBranchProfileFromServer);
}

const saveClientProfileRequest = function* (data)
{
  data = cloneDeep(data);
  data.profiledetail.duration.map(x => {
    x.starttime = setDateTime(x.starttime);
    x.endtime = setDateTime(x.endtime);
   });
  data.profiledetail.schedule.map(x => {
    x.starttime = setDateTime(x.starttime);
    x.endtime = setDateTime(x.endtime);
    x.starttime1 = setDateTime(x.starttime1);
    x.endtime1 = setDateTime(x.endtime1);
    if(x.checked && x.duration && x.duration.length > 0)
    {
      x.duration.map(y => {
        y.starttime = setDateTime(y.starttime);
        y.endtime = setDateTime(y.endtime);
      })
    }
   });

   let response = yield api.post('save-client-profile', data)
       .then(response => response.data)
       .catch(error => error.response.data )

   return response;
}
/**
* save Employee From Server
*/
function* saveClientProfileFromServer(action) {
   try {
       const response = yield call(saveClientProfileRequest,cloneDeep(action.payload));
       if(!(response.errorMessage  || response.ORAT))
       {

             yield put(requestSuccess("Organization details updated successfully."));
             yield call(getClientProfileFromServer);

           yield  put(saveClientProfileSuccess());

       }
       else {
         yield put(requestFailure(response.errorMessage));
       }

   } catch (error) {
       console.log(error);
   }
}

/**
* Get Employees
*/
export function* saveClientProfile() {
   yield takeEvery(SAVE_CLIENT_PROFILE, saveClientProfileFromServer);
}

const saveChangePasswordRequest = function* (data)
{
   let response = yield api.post('save-changepassword', data)
       .then(response => response.data)
       .catch(error => error.response.data)

   return response;
}
/**
* save change password From Server
*/
function* saveChangePasswordFromServer(action) {
   try {
     const response = yield call(saveChangePasswordRequest,action.payload);
     if(!(response.errorMessage  || response.ORAT))
     {
       const {changepassword} = action.payload;
         yield put(requestSuccess("Password Change successfully."));
         yield  put(saveChagePasswordSuccess());
    }
   else {
       yield put(requestFailure(response.errorMessage));
     }
     } catch (error) {
     console.debug(error);
     }
}

/**
* Get password
*/
export function* saveChangePassword() {
   yield takeEvery(SAVE_CHANGE_PASSWORD, saveChangePasswordFromServer);
}

const saveUserThemeRequest = function* (data)
{
 let response = yield  api.post('save-user-theme', data)
     .then(response => response.data)
     .catch(error => error.response.data )
     return response;
}

function* saveUserThemeToServer() {
   try {
       yield delay(1500);
       const state = yield select(settings);

       let theme ={};

       theme.activeTheme = state.activeTheme;
       theme.enableSidebarBackgroundImage = state.enableSidebarBackgroundImage;
       theme.selectedSidebarImage = state.selectedSidebarImage;
       theme.isDarkSidenav = state.isDarkSidenav;
       theme.miniSidebar = state.miniSidebar;
       theme.darkMode = state.darkMode;
       theme.lightMode = state.lightMode;
       theme.rtlLayout = state.rtlLayout;
       theme.ChartConfig = {};
       if (theme.activeTheme.name == "secondary") {
         theme.ChartConfig.primary = "#fdabdd" ;
       }
       else{
            theme.ChartConfig.primary  = "#2e8de1" ;
         }
       const response = yield call(saveUserThemeRequest, theme);

       if(!(response.errorMessage  || response.ORAT))
       {
          yield call(getUserProfileFromServer);
          yield  put(saveUserThemeSuccess());
       }


   } catch (error) {
       console.log(error);
   }
}


/**
* Get Employees
*/
export function* saveUserTheme() {
   yield takeEvery(SAVE_USER_THEME, saveUserThemeToServer);
}

const getRoleRequest = function* (data)
{
   let response = yield api.post('role-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}

const getZoneRequest = function* (data)
{
   let response = yield api.post('zone-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}

const getBranchRequest = function* (data)
{
   let response = yield api.post('branch-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}

const getTimezoneRequest = function* (data)
{
   let response = yield api.post('timezone-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}

/**
* opn add new  employee model From Server
*/
function* addRoleFromServer(action) {
   try {
        const state = yield select(settings);
        const response = yield call(getRoleRequest,action.payload);
        let response1 = [];
        let response2 = [];

        if(state.clientProfileDetail.ishavemutliplebranch == 1){
          response1 = yield call(getZoneRequest,action.payload);
          response2 = yield call(getBranchRequest,action.payload);
        }
        const response3 = yield call(getTimezoneRequest,action.payload);
       if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage && !response2.errorMessage && !response3.errorMessage )
       {
       yield put(opnAddNewEmployeeModelSuccess({rolelist : response[0],zonelist : response1[0],branchlist : response2[0],timezonelist : response3[0]}));
      }
      else {
        yield put(requestFailure(response.errorMessage || response1.errorMessage || response2.errorMessage || response3.errorMessage));
      }
    }catch (error) {
         console.log(error);
    }
    finally
    {
    }
}
/**
* VIEW Subscriptions
*/
export function* opnAddNewEmployeeModel() {
   yield takeEvery(OPEN_ADD_NEW_EMPLOYEE_MODEL, addRoleFromServer);
}

const saveconfigurationRequest = function* (data)
{
    let response = yield api.post('save-configuration', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
* save configuration From Server
*/
function* saveConfigurationFromServer(action) {
   try {
       const response = yield call(saveconfigurationRequest,action.payload);
       if(!(response.errorMessage  || response.ORAT))
       {

             yield put(requestSuccess("Configuration details created successfully."));

           yield  put(saveConfigurationSuccess());

       }
       else {
         yield put(requestFailure(response.errorMessage));
       }

   } catch (error) {
       console.log(error);
   }
}

/**
* Get Employees
*/
export function* saveConfiguration() {
   yield takeEvery(SAVE_CONFIGURATION, saveConfigurationFromServer);
}

/**
 * Send Employee VIEW Request To Server
 */
 const viewConfigurationRequest = function* (data)
 {  let response = yield api.post('view-configuration', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }
 /**
  * Edit Employee From Server
  */
 function* viewConfigurationFromServer(action) {
     try {
         const response = yield call(viewConfigurationRequest,action.payload);
         if(!(response.errorMessage  || response.ORAT))
         {
             yield put(viewconfigrationdetailSuccess({data : response}));
         }
         else {
           yield put(requestFailure(response.errorMessage));
         }
     } catch (error) {
         console.log(error);
     }
     finally
     {

     }
 }

 /**
  * Edit Employees
  */
 export function* viewconfigrationdetail() {
     yield takeEvery(VIEW_CONFIGURATION_DETAIL, viewConfigurationFromServer);
 }

 const savepaymentgatewayconfigurationRequest = function* (data)
 {
     let response = yield api.post('save-paymentgateay-configuration', data)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }
 /**
 * save paymentgateway configuration From Server
 */
 function* savePaymentGatewayConfigurationFromServer(action) {
    try {
        const response = yield call(savepaymentgatewayconfigurationRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {

              yield put(requestSuccess("Configuration details created successfully."));
             yield  put(savePaymentGatewayConfigurationSuccess());
             yield call(getClientProfileFromServer);
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
 }

 /**
 * Get Employees
 */
 export function* savePaymentGatewayConfiguration() {
    yield takeEvery(SAVE_PAYMENTGATEWAY_CONFIGURATION, savePaymentGatewayConfigurationFromServer);
 }


 const saveUserUnitRequest = function* (data)
 {
  let response = yield  api.post('save-user-unit', data)
      .then(response => response.data)
      .catch(error => error.response.data )
      return response;
 }

 function* saveUserUnitToServer() {
    try {
        yield delay(1000);
        const state = yield select(settings);

       let weightunit = state.weightunit == 0 ? "kg" : "lbs";
       let distanceunit = state.distanceunit == 0 ? "km" : "mile";
       let lengthunit = state.lengthunit == 0 ? "cm" : "inch";
       let temperatureunit = state.temperatureunit == 0 ? "°C" : "°F";


        yield call(saveUserUnitRequest,{weightunit,distanceunit,lengthunit,temperatureunit});
        yield call(getUserProfileFromServer);

    } catch (error) {
        console.log(error);
    }
 }


 /**
 * Get Employees
 */
 export function* saveUserUnit() {
    yield takeEvery(SAVE_USER_UNIT, saveUserUnitToServer);
 }


 const saveclientsocialmediaRequest = function* (data)
 {
     let response = yield api.post('save-client-socialmedia', data)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }

 function* saveClientSocialMediaFromServer(action) {
    try {
        const response = yield call(saveclientsocialmediaRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {

              yield put(requestSuccess("Details updated successfully."));
              yield call(getClientProfileFromServer);
          //  yield  put(saveClientSocialMediaSuccess());

        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
 }

 export function* saveClientSocialMedia() {
    yield takeEvery(SAVE_CLIENT_SOCIALMEDIA, saveClientSocialMediaFromServer);
 }



 /**
  * Send tax Save Request To Server
  */
 const saveTaxRequest = function* (data)
 {
     let response = yield api.post('save-tax', data)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }
 /**
  * save tax From Server
  */
 function* saveTaxFromServer(action) {
     try {
         const response = yield call(saveTaxRequest,action.payload);
         if(!(response.errorMessage  || response.ORAT))
         {
           const {taxdetail} = action.payload;
            yield put(requestSuccess("Tax added successfully."));
          yield  put(saveClientTaxSuccess());
          yield call(getTaxFromServer);
          yield put(push('/app/setting/organization/2'));
        }
       else {
           yield put(requestFailure(response.errorMessage));
         }
         } catch (error) {
         console.debug(error);
         }
   }

 /**
  * save tax
  */
 export function* saveClientTax() {
     yield takeEvery(SAVE_CLIENT_TAX, saveTaxFromServer);
 }


 /**
  * Send tax Request To Server
  */
 const getTaxRequest = function* (data)
 {
   let response = yield  api.post('get-taxes', data)
       .then(response => response.data)
       .catch(error => error.response.data )
       return response;
 }
 /**
  * Get tax From Server
  */

 function* getTaxFromServer() {
     try {
         const state = yield select(employeeManagementReducer);
         const state1 = yield select(settings);
         state.tableInfo.clientcountrycode = state1.clientProfileDetail.countrycode;
         const response = yield call(getTaxRequest, state.tableInfo);
         const response1 = yield call(getTaxListRequest,state.tableInfo);

         if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
         {
             yield put(getClientTaxSuccess({data : response[0],taxlist : response1[0]}));
         }
         else {
             yield put(requestFailure(response.errorMessage || response1.errorMessage));
         }

     } catch (error) {
         console.log(error);
     }
     finally {
     }
 }


 /**
  * Get tax
  */
 export function* getClientTax() {
     yield takeEvery(GET_CLIENT_TAX, getTaxFromServer);
 }



 /**
  * Send biometric configuration Save Request To Server
  */
 const saveBiometricConfiguarionRequest = function* (data)
 {
   let response = yield api.post('save-biometricconfiquration', data)
       .then(response => response.data)
       .catch(error => error.response.data )

   return response;
 }
 /**
  * save biometric configuration From Server
  */
 function* saveBiometricConfigurationFromServer(action) {
     try {
         const response = yield call(saveBiometricConfiguarionRequest,action.payload);
         if(!(response.errorMessage  || response.ORAT))
         {
             yield put(requestSuccess("Biometric configuration updated successfully."));
             yield call(getClientProfileFromServer);
        }
       else {
           yield put(requestFailure(response.errorMessage));
         }
         } catch (error) {
         console.debug(error);
         }
   }

 /**
  * save biometric configuration
  */
 export function* saveClientBiometricConfiguration() {
     yield takeEvery(SAVE_CLIENT_BIOMETRIC_CONFIGURATION, saveBiometricConfigurationFromServer)
   }
 /**
  * Send edit tax Request To Server
  */
 const viewTaxRequest = function* (data)
 {
     let response = yield api.post('view-tax', data)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }
 /**
  * view tax From Server
  */
 function* viewTaxFromServer(action) {
     try {
         const response = yield call(viewTaxRequest,action.payload);
         if(!(response.errorMessage  || response.ORAT))
         {
             yield put(viewClientTaxSuccess({data : response[0]}));
         }
         else {
           yield put(requestFailure(response.errorMessage));
         }
     } catch (error) {
         console.log(error);
     }
     finally
     {

     }
 }

 /**
  * view tax
  */
 export function* opnViewClientTaxModel() {
     yield takeEvery(OPEN_VIEW_CLIENT_TAX_MODEL, viewTaxFromServer);
 }
 const getTaxListRequest = function* (data)
 {
    let response = yield api.post('tax-list',data)
         .then(response => response.data)
         .catch(error => error.data);

     return response;
 }

 /**
 * opn add new tax model From Server
 */
 function* addtaxFromServer(action) {
    try {
      if(action.payload.data == true){
        const state = yield select(settings);
        action.payload.clientcountrycode = state.clientProfileDetail.countrycode;
        const response = yield call(getTaxListRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(opnAddNewTaxModelSuccess({taxlist : response[0]}));
       }
       else {
         yield put(requestFailure(response.errorMessage));
       }
     }
     }catch (error) {
          console.log(error);
     }
     finally
     {
     }
 }
 /**
 * opn tax model
 */
 export function* opnAddNewTaxModel() {
    yield takeEvery(OPEN_ADD_NEW_TAX_MODEL, addtaxFromServer);
 }

 /**
 * opn add new tax model From Server
 */
 function* addtaxCodeCategoryFromServer(action) {
    try {
        const response = yield call(getTaxListRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(opnAddNewTaxCodeCategoryModelSuccess({taxlist : response[0]}));
       }
       else {
         yield put(requestFailure(response.errorMessage));
       }
     }catch (error) {
          console.log(error);
     }
     finally
     {
     }
 }
 /**
 * opn tax model
 */
 export function* opnAddNewTaxCodeCategoryModel() {
    yield takeEvery(OPEN_ADD_NEW_TAX_CODE_CATEGORY_MODEL, addtaxCodeCategoryFromServer);
 }
 /**
  * Send tax Delete Request To Server
  */
 const deleteClientTaxRequest = function* (data)
 {  let response = yield api.post('delete-tax', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }

 /**
  * Delete tax From Server
  */
  function* deleteClientTaxFromServer(action) {
      try {

        const response = yield call(deleteClientTaxRequest, action.payload);

         if(!(response.errorMessage  || response.ORAT))
         {
              yield put(requestSuccess("Tax deleted successfully."));
              yield call(getTaxFromServer);
         }
         else {
            yield put(requestFailure(response.errorMessage));
         }

      } catch (error) {
          console.log(error);
      }
      finally{
      }
  }

 /**
  * delete tax
  */
 export function* deleteClientTax() {
     yield takeEvery(DELETE_CLIENT_TAX, deleteClientTaxFromServer);
 }

 /**
  * Send tax code CATEGORY Save Request To Server
  */
 const saveTaxCodeCategoryRequest = function* (data)
 {
     let response = yield api.post('save-code-Category', data)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }
 /**
  * save tax code CATEGORYFrom Server
  */
 function* saveTaxCodeCategoryFromServer(action) {
     try {
         const response = yield call(saveTaxCodeCategoryRequest,action.payload);
         if(!(response.errorMessage  || response.ORAT))
         {
          yield put(requestSuccess("Tax Code Category added successfully."));
          yield  put(saveTaxCodecategorySuccess());
          yield call(getTaxcodecategoryFromServer);
          yield put(push('/app/setting/organization/2'));
        }
       else {
           yield put(requestFailure(response.errorMessage));
         }
         } catch (error) {
         console.debug(error);
         }
   }

 /**
  * save tax
  */
 export function* saveTaxCodecategory() {
     yield takeEvery(SAVE_TAX_CODE_CATEGORY, saveTaxCodeCategoryFromServer);
 }
 /**
  * Send tax Request To Server
  */
 const getTaxcodecategoryRequest = function* (data)
 {
   let response = yield  api.post('get-taxcodecategories', data)
       .then(response => response.data)
       .catch(error => error.response.data )
       return response;
 }
 /**
  * Get Tax code category From Server
  */

 function* getTaxcodecategoryFromServer() {
     try {
         const state = yield select(employeeManagementReducer);
         const state1 = yield select(settings);
         state.tableInfo.clientcountrycode = state1.clientProfileDetail.countrycode;
         const response = yield call(getTaxcodecategoryRequest, state.tableInfo);

         if(!(response.errorMessage  || response.ORAT))
         {
             yield put(getTaxCodeCategorySuccess({data : response[0]}));
         }
         else {
             yield put(requestFailure(response.errorMessage || response1.errorMessage));
         }

     } catch (error) {
         console.log(error);
     }
     finally {
     }
 }


 /**
  * Get tax
  */
 export function* getTaxCodeCategory() {
     yield takeEvery(GET_TAX_CODE_CATEGORY, getTaxcodecategoryFromServer);
 }

 /**
  * Send edit tax Request To Server
  */
 const viewTaxCodeCategoryRequest = function* (data)
 {
     let response = yield api.post('view-taxcodecategory', data)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }
 /**
  * view tax code category From Server
  */
 function* viewTaxCodeCategoryFromServer(action) {
     try {
       const state = yield select(employeeManagementReducer);
         const response = yield call(viewTaxCodeCategoryRequest,action.payload);
         const response1 = yield call(getTaxListRequest,state.tableInfo);

         if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
         {
             yield put(viewTaxCodeCategoryModelSuccess({data : response[0],taxlist : response1[0]}));
         }
         else {
           yield put(requestFailure(response.errorMessage|| response1.errorMessage));
         }
     } catch (error) {
         console.log(error);
     }
     finally
     {

     }
 }

 /**
  * view tax
  */
 export function* opnViewTaxCodeCategoryModel() {
     yield takeEvery(OPEN_VIEW_TAX_CODE_CATEGORY_MODEL, viewTaxCodeCategoryFromServer);
 }
 /**
  * Send tax code category Delete Request To Server
  */
 const deleteTaxCodeCategoryRequest = function* (data)
 {  let response = yield api.post('delete-taxcodecategory', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }

 /**
  * Delete tax code category From Server
  */
  function* deleteTaxCodeCategoryFromServer(action) {
      try {

        const response = yield call(deleteTaxCodeCategoryRequest, action.payload);

         if(!(response.errorMessage  || response.ORAT))
         {
              yield put(requestSuccess("Tax Code Category deleted successfully."));
              yield call(getTaxcodecategoryFromServer);
         }
         else {
            yield put(requestFailure(response.errorMessage));
         }

      } catch (error) {
          console.log(error);
      }
      finally{
      }
  }

 /**
  * delete tax code category
  */
 export function* deletTaxCodeCategory() {
     yield takeEvery(DELETE_TAX_CODE_CATEGORY, deleteTaxCodeCategoryFromServer);
 }


 /**
  * Send tax configuration Save Request To Server
  */
 const saveTaxConfiguarionRequest = function* (data)
 {
   var formData = new FormData();
   for ( var key in data ) {
       formData.append(key, JSON.stringify(data[key]));
   }

   if(data.taxdetail.imageFiles.length > 0)
     formData.append("files", data.taxdetail.imageFiles[0]);

     let response = yield api.post('save-taxconfiguration',  formData, fileUploadConfig)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }
 /**
  * save tax configuration From Server
  */
 function* saveTaxConfigurationFromServer(action) {
     try {
         const response = yield call(saveTaxConfiguarionRequest,action.payload);
         if(!(response.errorMessage  || response.ORAT))
         {
             yield put(requestSuccess("Tax configuration updated successfully."));
             yield call(getClientProfileFromServer);
             // authObject.logout();
        }
       else {
           yield put(requestFailure(response.errorMessage));
         }
         } catch (error) {
         console.debug(error);
         }
   }

 /**
  * save tax configuration
  */
 export function* saveClientTaxConfiguration() {
     yield takeEvery(SAVE_CLIENT_TAX_CONFIGURATION, saveTaxConfigurationFromServer);
 }


 /**
  * Send biometric Save Request To Server
  */
 const saveBiometricRequest = function* (data)
 {
     let response = yield api.post('save-biometric', data)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }
 /**
  * save biometric From Server
  */
 function* saveBiometricFromServer(action) {
     try {
         const state1 = yield select(settings);

         action.payload.branchid = state1.userProfileDetail.defaultbranchid;
         const response = yield call(saveBiometricRequest,action.payload);
         if(!(response.errorMessage  || response.ORAT))
         {
            yield put(requestSuccess("Biometric Device added successfully."));
          yield  put(saveClientBiometricSuccess());
          yield call(getBiometricFromServer);
          yield put(push('/app/setting/integration'));
        }
       else {
           yield put(requestFailure(response.errorMessage));
         }
         } catch (error) {
         console.debug(error);
         }
   }

 /**
  * save tax
  */
 export function* saveClientBiometric() {
     yield takeEvery(SAVE_CLIENT_BIOMETRIC, saveBiometricFromServer);
 }

 /**
  * Send tax Request To Server
  */
 const getBiometricRequest = function* (data)
 {
   let response = yield  api.post('get-biometric', data)
       .then(response => response.data)
       .catch(error => error.response.data )
       return response;
 }
 /**
  * Get tax From Server
  */

 function* getBiometricFromServer() {
     try {
         const state = yield select(employeeManagementReducer);
         const state1 = yield select(settings);

         state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;

         const response = yield call(getBiometricRequest, state.tableInfo);

         if(!(response.errorMessage  || response.ORAT))
         {
             yield put(getClientBiometricSuccess({data : response[0]}));
         }
         else {
             yield put(requestFailure(response.errorMessage));
         }

     } catch (error) {
         console.log(error);
     }
     finally {
     }
 }


 /**
  * Get biometric
  */
 export function* getClientBiometric() {
     yield takeEvery(GET_CLIENT_BIOMETRIC, getBiometricFromServer);
 }



 /**
  * Send edit biometric Request To Server
  */
 const viewBiometricRequest = function* (data)
 {
     let response = yield api.post('view-biometric', data)
         .then(response => response.data)
         .catch(error => error.response.data )

     return response;
 }
 /**
  * view biometric From Server
  */
 function* viewBiometricFromServer(action) {
     try {
         const response = yield call(viewBiometricRequest,action.payload);
         if(!(response.errorMessage  || response.ORAT))
         {
             yield put(viewClientBiometricSuccess({data : response[0]}));
         }
         else {
           yield put(requestFailure(response.errorMessage));
         }
     } catch (error) {
         console.log(error);
     }
     finally
     {

     }
 }

 /**
  * view biometric
  */
 export function* opnViewClientBiometricModel() {
     yield takeEvery(OPEN_VIEW_CLIENT_BIOMETRIC_MODEL, viewBiometricFromServer);
 }


 const setEmployeeDefaultBranchRequest = function* (data)
 {  let response = yield api.post('set-user-default-branch', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }

function* setEmployeeDefaultBranchFromServer(action) {
    try {
        const response = yield call(setEmployeeDefaultBranchRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(setEmployeeDefaultBranchSuccess({data : response}));
            yield call(getUserProfileFromServer);
            window.location.reload();
        }
        else {
          yield put(requestFailure(response.errorMessage));
          authObject.logout();
        }

    } catch (error) {
        console.log(error);
    }
    finally
    {

    }
}

export function* setEmployeeDefaultBranch() {
    yield takeEvery(SET_EMPLOYEE_DEFAULT_BRANCH, setEmployeeDefaultBranchFromServer);
}



const viewStarterEmployeesRequest = function* (data)
{  let response = yield api.post('view-employee', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

function* viewStarterEmployeeFromServer(action) {
   try {
       const response = yield call(viewStarterEmployeesRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(viewStarterEmployeesSuccess({data : response}));
       }
       else {
         yield put(requestFailure(response.errorMessage));
       }

   } catch (error) {
       console.log(error);
   }
   finally
   {

   }
}

export function* opnViewStarterEmployeeModel() {
   yield takeEvery(OPEN_STARTER_VIEW_EMPLOYEE_MODEL, viewStarterEmployeeFromServer);
}


const cancelAdvanceBookigRequest = function* (data)
{  let response = yield api.post('delete-bulkgymaccessslots', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

function* cancelAdvanceBookingFromServer(action) {
   try {
       action.payload.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
       const response = yield call(cancelAdvanceBookigRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
       }
       else {
         yield put(requestFailure(response.errorMessage));
       }

   } catch (error) {
       console.log(error);
   }
   finally
   {

   }
}

export function* onCancelAdvanceBookingofMember() {
   yield takeEvery(ON_CANCEL_ADVANCEBOOKINGOFMEMBER, cancelAdvanceBookingFromServer);
}
/**
* save paymentgateway configuration status request
*/
const savepaymentgatewayconfigurationStatusRequest = function* (data)
{
    let response = yield api.post('save-paymentgateay-configuration-status', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
* save paymentgateway configuration status From Server
*/
function* savePaymentGatewayConfigurationStatusFromServer(action) {
   try {
       const response = yield call(savepaymentgatewayconfigurationStatusRequest,action.payload);
       if(!(response.errorMessage  || response.ORAT))
       {

             yield put(requestSuccess("Status Changed successfully."));
            yield  put(savePaymentGatewayConfigurationStatusSuccess());
            yield call(getClientProfileFromServer);
       }
       else {
         yield put(requestFailure(response.errorMessage));
       }

   } catch (error) {
       console.log(error);
   }
}

/**
* get paymentgateway
*/
export function* savePaymentGatewayConfigurationStatus() {
   yield takeEvery(SAVE_PAYMENTGATEWAY_CONFIGURATION_STATUS, savePaymentGatewayConfigurationStatusFromServer);
}

/**
 * Send termsCondition Save Request To Server
 */
const saveTermsconditionRequest = function* (data)
{
  let response = yield api.post('save-employeetermscondition', data)
      .then(response => response.data)
      .catch(error => error.response.data )

  return response;
}
/**
 * save termsCondition From Server
 */
function* saveTermsconditionFromServer(action) {
    try {
        const state1 = yield select(settings);

        const response = yield call(saveTermsconditionRequest);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield call(getUserProfileFromServer);
            yield put(push('/app/dashboard/master-dashboard'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 * Get termsCondition
 */
export function* saveTermscondition() {
    yield takeEvery(SAVE_TERMSCONDITION, saveTermsconditionFromServer);
}


export default function* rootSaga() {
    yield all([
        fork(getEmployees),
        fork(deleteEmployee),
        fork(saveEmployee),
        fork(opnViewEmployeeModel),
        fork(opnEditEmployeeModel),
        fork(getSessionTypeList),
        fork(getUserProfile),
        fork(getClientProfile),
        fork(saveClientProfile),
        fork(saveChangePassword),
        fork(saveUserTheme),
        fork(opnAddNewEmployeeModel),
        fork(saveConfiguration),
        fork(viewconfigrationdetail),
        fork(saveUserUnit),
        fork(saveClientSocialMedia),
        fork(savePaymentGatewayConfiguration),
        fork(saveClientTax),
        fork(getClientTax),
        fork(saveClientTaxConfiguration),
        fork(opnViewClientTaxModel),
        fork(opnAddNewTaxModel),
        fork(deleteClientTax),
        fork(opnAddNewTaxCodeCategoryModel),
        fork(saveTaxCodecategory),
        fork(getTaxCodeCategory),
        fork(opnViewTaxCodeCategoryModel),
        fork(deletTaxCodeCategory),
        fork(saveClientBiometricConfiguration),
        fork(saveClientBiometric),
        fork(getClientBiometric),
        fork(opnViewClientBiometricModel),
        fork(setEmployeeDefaultBranch),
        fork(opnViewStarterEmployeeModel),
        fork(onCancelAdvanceBookingofMember),
        fork(savePaymentGatewayConfigurationStatus),
        fork(saveTermscondition),
        fork(getBranchProfile)
    ]);
}
