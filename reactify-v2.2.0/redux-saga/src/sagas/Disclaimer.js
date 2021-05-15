/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {disclaimerReducer,settings} from './states';
import { push } from 'connected-react-router';
import {delay,cloneDeep,setLocalDate} from "Helpers/helpers";
import {viewMemberFromServer} from './MemberManagement';
import {getUserProfileFromServer} from './EmployeeManagement';

// api
import api, {fileUploadConfig} from 'Api';

import {
  SAVE_RULE,
  GET_RULES,
  DELETE_RULE,

  SAVE_QUESTION,
  GET_QUESTIONS,
  DELETE_QUESTION,

  OPEN_STAFFDISCLAIMER_MODEL,
  SAVE_STAFFDISCLAIMER,
  GET_STAFFDISCLAIMER_SAVED_FORM,

  VIEW_DISCLAIMER,
  SAVE_DISCLAIMER,

  VIEW_COVID19_DISCLAIMER,
  SAVE_COVID19_DISCLAIMER,

  GET_MEMBER_COVID19DISCLAIMERFORM,
  GET_STAFF_COVID19DISCLAIMERFORM,

  OPEN_STAFF_COVID19DISCLAIMER_MODEL,
  SAVE_STAFF_COVID19DISCLAIMER,

} from 'Actions/types';

import {
    saveRuleSuccess,
    getRulesSuccess,

    saveQuestionSuccess,
    getQuestionsSuccess,

    opnDisclaimerModelSuccess,
    saveStaffDisclaimerSuccess,
    getStaffDisclaimerSavedFormSuccess,

    viewDisclaimerSuccess,

    viewCovid19DisclaimerSuccess,

    getMemberCovid19DisclaimerFormSuccess,
    getStaffCovid19DisclaimerFormSuccess,

    opnStaffCovid19DisclaimerModelSuccess,
    saveStaffCovid19DisclaimerSuccess,

    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';


const saveRuleRequest = function* (data)
{
  let response = yield api.post('save-rule',data)
      .then(response => response.data)
      .catch(error => error.response.data )
  return response;
}

function* saveRuleFromServer(action) {
    try {

        const response = yield call(saveRuleRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            const {ruledetail} = action.payload;
            if(ruledetail.id != 0)
            {
              yield put(requestSuccess("Rule updated successfully."));
            }
            else {
              yield put(requestSuccess("Rule created successfully."));
            }
            yield put(saveRuleSuccess());
            yield call(getRulesFromServer);
            yield put(push('/app/setting/disclaimer/2'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveRule() {
    yield takeEvery(SAVE_RULE, saveRuleFromServer);
}


const getRulesRequest = function* (data)
{let response = yield  api.post('get-rule', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getRulesFromServer(action) {
    try {
        const state = yield select(disclaimerReducer);
        const response = yield call(getRulesRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getRulesSuccess({data : response[0] , pages : response[1]}));
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

export function* getRules() {
    yield takeEvery(GET_RULES, getRulesFromServer);
}


const deleteRuleRequest = function* (data)
{  let response = yield api.post('delete-rule', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

 function* deleteruleFromServer(action) {
     try {

       const response = yield call(deleteRuleRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Rule deleted successfully."));
             yield call(getRulesFromServer);
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

export function* deleteRule() {
    yield takeEvery(DELETE_RULE, deleteruleFromServer);
}


const getQuestionRequest = function* (data)
{let response = yield  api.post('get-questions', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getQuestionFromServer(action) {
    try {
        const state = yield select(disclaimerReducer);
        const response = yield call(getQuestionRequest, state.tableInfoQuestion);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getQuestionsSuccess({data : response[0] , pages : response[1]}));
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


export function* getQuestions() {
    yield takeEvery(GET_QUESTIONS, getQuestionFromServer);
}

const saveQuestionRequest = function* (data)
{
  let response = yield api.post('save-question',data)
      .then(response => response.data)
      .catch(error => error.response.data )
  return response;
}

function* saveQuestionFromServer(action) {
    try {
        const response = yield call(saveQuestionRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            const {question} = action.payload;
            if(question.id != 0)
            {
              yield put(requestSuccess("Question updated successfully."));
            }
            else {
              yield put(requestSuccess("Question created successfully."));
            }
            yield put(saveQuestionSuccess());
            yield call(getQuestionFromServer);
            yield put(push('/app/setting/disclaimer/1'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveQuestion() {
    yield takeEvery(SAVE_QUESTION, saveQuestionFromServer);
}


const deleteQuestionRequest = function* (data)
{  let response = yield api.post('delete-question', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

 function* deletequestionFromServer(action) {
     try {
       const response = yield call(deleteQuestionRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Question deleted successfully."));
             yield call(getQuestionFromServer);
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

export function* deleteQuestion() {
    yield takeEvery(DELETE_QUESTION, deletequestionFromServer);
}


function* opnDisclaimerFromServer(action) {
    try {

      const response = yield call(viewDisclaimerRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
          yield put(opnDisclaimerModelSuccess({configuration : response[0],  questions : response[1],  rules : response[2] ,disclaimermemberdetails : (response[3] ? response[3][0] : null)  }));
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

export function* opnDisclaimerModel() {
    yield takeEvery(OPEN_STAFFDISCLAIMER_MODEL, opnDisclaimerFromServer);
}


const saveStaffDisclaimerRequest = function* (data)
{
    let response = yield api.post('save-member-disclaimer', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveStaffDisclaimerFromServer(action) {
    try {
        const response = yield call(saveStaffDisclaimerRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess("Saved successfully."));

         yield  put(saveStaffDisclaimerSuccess());
         yield call(viewMemberFromServer);

       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

export function* saveStaffDisclaimer() {
    yield takeEvery(SAVE_STAFFDISCLAIMER, saveStaffDisclaimerFromServer);
}




/**
 * Send Disclaimer VIEW Request To Server
 */
 const viewDisclaimerRequest = function* (data)
 {  let response = yield api.post('view-disclaimer', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }

function* viewDisclaimerFromServer(action) {
    try {
        const response = yield call(viewDisclaimerRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(viewDisclaimerSuccess({configuration : response[0],  questions : response[1],  rules : response[2] }));
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
export function* viewDisclaimer() {
    yield takeEvery(VIEW_DISCLAIMER, viewDisclaimerFromServer);
}




/**
 * Send Disclaimer VIEW Request To Server
 */
 const saveDisclaimerRequest = function* (data)
 {  let response = yield api.post('save-disclaimer', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }

function* saveDisclaimerFromServer(action) {
    try {

          yield delay(1000);
          const state = yield select(disclaimerReducer);

          let requestData ={};

          requestData.consent = state.declaration_config;
          requestData.isdisclaimerenabled = state.enabledisclaimertomember_config;
          requestData.questionlist = state.basicList_config.map(x => x.id);
          requestData.questionlist = requestData.questionlist.concat(state.workoutHistory_config.map(x => x.id));
          requestData.questionlist = requestData.questionlist.concat(state.medicalHistory_config.map(x => x.id));
          requestData.rulelist = state.ruleList_config.map(x => x.id);

          const response = yield call(saveDisclaimerRequest, requestData);


        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess('Saved successfully!'));
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

export function* saveDisclaimer() {
    yield takeEvery(SAVE_DISCLAIMER, saveDisclaimerFromServer);
}



const getStaffDisclaimerSavedFormRequest = function* (data)
{
    let response = yield api.post('get-member-saved-disclaimer',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* getStaffDisclaimerSavedFormFromServer(action) {
    try {
        const response = yield call(getStaffDisclaimerSavedFormRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          let disclaimerform = JSON.parse(response[0][0].disclaimerform);
          let emergencydetail = JSON.parse(response[0][0].emergencydetail);
		  let memberdetails = response[0][0];

          yield put(getStaffDisclaimerSavedFormSuccess({basicList : disclaimerform.basicList,
          workoutHistory : disclaimerform.workoutHistory,medicalHistory : disclaimerform.medicalHistory ,
          ruleList : disclaimerform.ruleList , declaration : disclaimerform.declaration,
          emergencydetail : emergencydetail , disclaimermemberdetails : memberdetails}));
       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

export function* getStaffDisclaimerSavedForm() {
    yield takeEvery(GET_STAFFDISCLAIMER_SAVED_FORM, getStaffDisclaimerSavedFormFromServer);
}


const viewCovid19DisclaimerRequest = function* (data)
{  let response = yield api.post('view-covid19-disclaimer', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

function* viewCovid19DisclaimerFromServer(action) {
   try {
       const response = yield call(viewCovid19DisclaimerRequest,action.payload);
       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(viewCovid19DisclaimerSuccess({configuration : response[0],  questions : response[1]}));
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

export function* viewCovid19Disclaimer() {
   yield takeEvery(VIEW_COVID19_DISCLAIMER, viewCovid19DisclaimerFromServer);
}

const saveCovid19DisclaimerRequest = function* (data)
{  let response = yield api.post('save-covid19-disclaimer', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

function* saveCovid19DisclaimerFromServer(action) {
   try {
         yield delay(1000);
         const state = yield select(disclaimerReducer);

         let requestData ={};

         requestData.iscovid19memberdisclaimerenabled = state.enablecovid19disclaimertomember_config;
         requestData.iscovid19staffdisclaimerenabled = state.enablecovid19disclaimertostaff_config;
         requestData.covid19daysconfig = state.covid19days_config;
         requestData.questionlist = state.covid19medicalHistory_config.map(x => x.id);

         const response = yield call(saveCovid19DisclaimerRequest, requestData);

       if(!(response.errorMessage  || response.ORAT))
       {
         yield put(requestSuccess('Saved successfully!'));
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

export function* saveCovid19Disclaimer() {
   yield takeEvery(SAVE_COVID19_DISCLAIMER, saveCovid19DisclaimerFromServer);
}


const getMemberCovid19DisclaimerRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
  data.filterbydate = setLocalDate(data.filterbydate);
  data.filtered.map(x => {
    if(x.id == "createdbydate" || x.id == "lastcheckin") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-member-covid19disclaimer', data)
        .then(response => response.data)
        .catch(error => error.response.data);
      return response;
}

function* getMemberCovid19DisclaimerFromServer(action) {
    try {
        const state = yield select(disclaimerReducer);
        const state1 = yield select(settings);

        state.tableInfoCovid19Disclaimer.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getMemberCovid19DisclaimerRequest, state.tableInfoCovid19Disclaimer);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getMemberCovid19DisclaimerFormSuccess({data : response[0] , pages : response[1]}));
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

export function* getMemberCovid19DisclaimerForm() {
    yield takeEvery(GET_MEMBER_COVID19DISCLAIMERFORM, getMemberCovid19DisclaimerFromServer);
}


const viewStaffCovid19DisclaimerRequest = function* (data)
{  let response = yield api.post('view-covid19-disclaimer', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}


function* opnStaffCovid19DisclaimerFromServer(action) {
    try {
      const response = yield call(viewStaffCovid19DisclaimerRequest,{});
      if(!(response.errorMessage  || response.ORAT))
      {
          yield put(opnStaffCovid19DisclaimerModelSuccess({configuration : response[0],  questions : response[1]}));
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

export function* opnStaffCovid19DisclaimerModel() {
    yield takeEvery(OPEN_STAFF_COVID19DISCLAIMER_MODEL, opnStaffCovid19DisclaimerFromServer);
}

const saveStaffCovid19DisclaimerRequest = function* (data)
{
    let response = yield api.post('save-member-covid19disclaimer', data)
        .then(response => response.data)
        .catch(error => error.response.data )
    return response;
}

function* saveStaffCovid19DisclaimerFromServer(action) {
    try {
        const response = yield call(saveStaffCovid19DisclaimerRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess("Saved successfully."));

         yield  put(saveStaffCovid19DisclaimerSuccess());
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

export function* saveStaffCovid19Disclaimer() {
    yield takeEvery(SAVE_STAFF_COVID19DISCLAIMER, saveStaffCovid19DisclaimerFromServer);
}


const getStaffCovid19DisclaimerRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
  data.filterbydate = setLocalDate(data.filterbydate);
  data.filtered.map(x => {
    if(x.id == "createdbydate" || x.id == "lastcheckin") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-staff-covid19disclaimer', data)
        .then(response => response.data)
        .catch(error => error.response.data);
      return response;
}

function* getStaffCovid19DisclaimerFromServer(action) {
    try {
        const state = yield select(disclaimerReducer);
        const state1 = yield select(settings);

        state.stafftableInfoCovid19Disclaimer.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getStaffCovid19DisclaimerRequest, state.stafftableInfoCovid19Disclaimer);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getStaffCovid19DisclaimerFormSuccess({data : response[0] , pages : response[1]}));
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

export function* getStaffCovid19DisclaimerForm() {
    yield takeEvery(GET_STAFF_COVID19DISCLAIMERFORM, getStaffCovid19DisclaimerFromServer);
}


/**
 * Member Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveRule),
        fork(getRules),
        fork(deleteRule),
        fork(getQuestions),
        fork(saveQuestion),
        fork(deleteQuestion),
        fork(opnDisclaimerModel),
        fork(saveStaffDisclaimer),
        fork(viewDisclaimer),
        fork(saveDisclaimer),
        fork(getStaffDisclaimerSavedForm),
        fork(viewCovid19Disclaimer),
        fork(saveCovid19Disclaimer),
        fork(getMemberCovid19DisclaimerForm),
        fork(opnStaffCovid19DisclaimerModel),
        fork(saveStaffCovid19Disclaimer),
        fork(getStaffCovid19DisclaimerForm),
    ]);
}
