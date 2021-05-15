import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';

import api from 'Api';
import {memberDisclaimerListReducer,settings} from './states';
import { push } from 'connected-react-router';
import {setLocalDate,cloneDeep} from "Helpers/helpers";

import {
  GET_MEMBER_DISCLAIMER_LIST,
  SAVE_MEMBER_CONSULTATIONNOTE,
  RESET_MEMBER_DISCLAIMER,
} from 'Actions/types';

import {
  getMemberDisclaimerListSuccess,
  saveMemberConsultationNoteSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';


const getMemberDisclaimerListRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
  data.filtered.map(x => {
    if(x.id == "createdbydate" || x.id == "submiteddate" || x.id == "followupdate") {
      x.value = setLocalDate(x.value)
    }
  });

  data.startDate = data.startDate ?  setLocalDate(data.startDate ) : null;
  data.endDate = data.endDate ?  setLocalDate(data.endDate ) : null;
  
  let response = yield  api.post('get-memberdisclaimer', data)
        .then(response => response.data)
        .catch(error => error.response.data);
      return response;
}

function* getMemberDisclaimerListFromServer(action) {
    try {
        const state = yield select(memberDisclaimerListReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getMemberDisclaimerListRequest, state.tableInfo);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getMemberDisclaimerListSuccess({data : response[0] , pages : response[1]}));
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

export function* getMemberDisclaimerList() {
    yield takeEvery(GET_MEMBER_DISCLAIMER_LIST, getMemberDisclaimerListFromServer);
}



const saveMemberConsultationNoteRequest = function* (data)
{
    let response = yield api.post('save-consultationnote', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveMemberConsultationNoteFromServer(action) {
    try {
      const state = yield select(settings);
      let memberlistId = action.payload.consultationnote.memberlistId;
      action.payload.defaultbranchid = state.userProfileDetail.defaultbranchid;
      const response = yield call(saveMemberConsultationNoteRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
            yield put(requestSuccess("Consultation note added successfully."));
              yield  put(saveMemberConsultationNoteSuccess());
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }


export function* saveMemberConsultationNote() {
    yield takeEvery(SAVE_MEMBER_CONSULTATIONNOTE, saveMemberConsultationNoteFromServer);
}


  const resetMemberDisclaimerRequest = function* (data)
  {  let response = yield api.post('reset-memberdisclaimer', data)
          .then(response => response.data)
          .catch(error => error.response.data);

      return response;
  }


  function* resetMemberDisclaimerFromServer(action) {
      try {
               const response = yield call(resetMemberDisclaimerRequest, action.payload);

                if(!(response.errorMessage  || response.ORAT))
                {
                     yield put(requestSuccess("Member disclaimer reset successfully."));
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

  export function* resetMemberDisclaimer() {
      yield takeEvery(RESET_MEMBER_DISCLAIMER, resetMemberDisclaimerFromServer);
  }



export default function* rootSaga() {
    yield all([
      fork(getMemberDisclaimerList),
	  fork(saveMemberConsultationNote),
	  fork(resetMemberDisclaimer),
    ]);
}
