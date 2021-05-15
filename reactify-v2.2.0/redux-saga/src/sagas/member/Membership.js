/**
 * Employee Management Sagas
 */
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import FormData from 'form-data';

import Auth from '../../Auth/Auth';
const authObject = new Auth();
import {delay} from "Helpers/helpers";
import {settings} from '../states';

// api
import api, {fileUploadConfig} from 'Api';

import {
  GET_MEMBER_PROFILE,
  GET_MEMBER_PROFILE_SUCCESS,
  MEMBER_SAVE_CHANGE_PASSWORD,
  MEMBER_SAVE_CHANGE_PASSWORD_SUCCESS,
  SAVE_MEMBER_THEME
} from 'Actions/types';

import {
    requestFailure,
    showLoader,
    hideLoader,
    requestSuccess,
    getMemberProfileSuccess,
    memberSaveChagePasswordSuccess,
    saveMemberThemeSuccess
} from 'Actions';


const getMemberProfileRequest = function* (data)
{

   let response = yield api.post('get-member-profile', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}
/**
* VIEW Employee From Server
*/
export function* getMemberProfileFromServer() {
   try {

       const response = yield call(getMemberProfileRequest);

       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(getMemberProfileSuccess({data : response}));
       }
       else {
         yield put(requestFailure(response.errorMessage));
       }

   } catch (error) {
       console.log(error);
   }
   finally
   {
       yield put(hideLoader());
   }
}
/**
* VIEW Employees
*/
export function* getMemberProfile() {
   yield takeEvery(GET_MEMBER_PROFILE, getMemberProfileFromServer);
}

const saveChangePasswordRequest = function* (data)
{
   let response = yield api.post('member-save-changepassword', data)
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
         yield  put(memberSaveChagePasswordSuccess());
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
export function* memberSaveChangePassword() {
   yield takeEvery(MEMBER_SAVE_CHANGE_PASSWORD, saveChangePasswordFromServer);
}

const saveMemberThemeRequest = function* (data)
{
 let response = yield  api.post('save-member-theme', data)
     .then(response => response.data)
     .catch(error => error.response.data )
     return response;
}

function* saveMemberThemeToServer() {
   try {
       yield delay(1000);
       const state = yield select(settings);

       let theme ={};

       theme.activeTheme = state.activeTheme;
       theme.enableSidebarBackgroundImage = state.enableSidebarBackgroundImage;
       theme.selectedSidebarImage = state.selectedSidebarImage;
       theme.isDarkSidenav = state.isDarkSidenav;
       theme.miniSidebar = state.miniSidebar;
       theme.darkMode = state.darkMode;
       theme.lightMode = state.lightMode;

       const response = yield call(saveMemberThemeRequest, theme);

       if(!(response.errorMessage  || response.ORAT))
       {
          yield  put(saveMemberThemeSuccess());
       }

   } catch (error) {
       console.log(error);
   }
}


/**
* Get Employees
*/
export function* saveMemberTheme() {
   yield takeEvery(SAVE_MEMBER_THEME, saveMemberThemeToServer);
}




export default function* rootSaga() {
    yield all([
        fork(getMemberProfile),
        fork(memberSaveChangePassword),
        fork(saveMemberTheme),

    ]);
}
