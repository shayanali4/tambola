import { all, call, fork, put, takeEvery ,select} from 'redux-saga/effects';
import {getMemberProfileFromServer} from './Membership';
import api from 'Api';
import { push } from 'connected-react-router';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
  OPEN_MEMBER_COVID19DISCLAIMER_MODEL,
  SAVE_MEMBER_COVID19DISCLAIMER,
} from 'Actions/types';

import {
opnMemberCovid19DisclaimerModelSuccess,
saveMemberCovid19DisclaimerSuccess,
requestSuccess,
requestFailure,
showLoader,
hideLoader
} from 'Actions';


const viewCovid19DisclaimerRequest = function* (data)
{  let response = yield api.post('view-covid19-disclaimer', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}


function* opnCovid19DisclaimerFromServer(action) {
    try {
      const response = yield call(viewCovid19DisclaimerRequest,{});
      if(!(response.errorMessage  || response.ORAT))
      {
          yield put(opnMemberCovid19DisclaimerModelSuccess({configuration : response[0],  questions : response[1]}));
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

export function* opnMemberCovid19DisclaimerModel() {
    yield takeEvery(OPEN_MEMBER_COVID19DISCLAIMER_MODEL, opnCovid19DisclaimerFromServer);
}

const saveMemberCovid19DisclaimerRequest = function* (data)
{
    data = cloneDeep(data);
  
    data.covid19history.selfhistorydetails.map(x => {
      x.hospitalizationdate = setLocalDate(x.hospitalizationdate);
      x.recoverydate = setLocalDate(x.recoverydate);
      x.lasttestdate = setLocalDate(x.lasttestdate);
     });

     data.covid19history.familyhistorydetails.map(x => {
       x.hospitalizationdate = setLocalDate(x.hospitalizationdate);
       x.recoverydate = setLocalDate(x.recoverydate);
       x.lasttestdate = setLocalDate(x.lasttestdate);
      });
    let response = yield api.post('save-member-covid19disclaimer', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveMemberCovid19DisclaimerFromServer(action) {
    try {
        const response = yield call(saveMemberCovid19DisclaimerRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(requestSuccess("Saved successfully."));

         yield  put(saveMemberCovid19DisclaimerSuccess());
         //yield call(opnDisclaimerFromServer);
         yield call(getMemberProfileFromServer);
         yield put(push('/member-app/membership'));
       }
      else {
          yield put(requestFailure(response.errorMessage));
        }
        } catch (error) {
        console.debug(error);
        }
  }

export function* saveMemberCovid19Disclaimer() {
    yield takeEvery(SAVE_MEMBER_COVID19DISCLAIMER, saveMemberCovid19DisclaimerFromServer);
}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(opnMemberCovid19DisclaimerModel),
      fork(saveMemberCovid19Disclaimer),
    ]);
}
