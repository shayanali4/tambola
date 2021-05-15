/**
 * Member Subscription Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {memberSubscriptionReducer,settings} from './states';
import { push } from 'connected-react-router';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';
import {getduesFromServer} from './Dues';
import {getMembersFromServer} from './MemberManagement';
import {getMasterDashboardTodayMemberReminderFromServer,getFollowupDashboardRecentExpiredMemberFromServer,
getFollowupDashboardRecentPTExpiredFromServer,getFollowupDashboardPaymentDuesFromServer,getFollowupDashboardMissedMemberFollowupFromServer,
getFollowupDashboardRecentMemberFromServer,getFollowupDashboardMembershiptobeExpiredFromServer,getFollowupDashboardPTTobeExpiredFromServer,getFollowupDashboardTodayBirthdayFromServer,
getFollowupDashboardTodayAnniversaryFromServer} from './FollowupDashboard';
import {getMeasurementsFromServer} from './Measurement';
import {getWorkoutSchedulesFromServer} from './WorkoutSchedule';
import {getAllocateDietFromServer} from './AllocateDiet';

// api
import api from 'Api';

import {
  GET_SUBSCRIPTION_LIST,
  SAVE_SUBSCRIPTION_FOLLOWUP,
} from 'Actions/types';

import {
    getSubscriptionListSuccess,
    saveSubcriptionFollowupSuccess,
    requestSuccess,
    requestFailure,
    showLoader,
    hideLoader,
} from 'Actions';

  /**
   * Get Subscriptions
   */
  export function* onChangeSaveSubscription() {
      yield takeEvery(ON_CHANGE_SAVE_SUBSCRIPTION, saveSubscriptionToServer);
  }


  /**
   * Send Subscription List Request To Server
   */
  const getSubscribersListRequest = function* (data)
  {
    data = cloneDeep(data);
    data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

    data.filtered && data.filtered.map(x => {
      if(x.id == "followupdate")
      {
        x.value = setLocalDate(x.value);
      }
      if (x.id == "expirydatesubscription") {
        x.value = setLocalDate(x.value)
      }
      if (x.id == "startdate") {
        x.value = setLocalDate(x.value)
      }
      if (x.id == "lastcheckin") {
        x.value = setLocalDate(x.value)
      }
    });
    data.startDate= setLocalDate(data.startDate);
    data.endDate= setLocalDate(data.endDate);
    let response = yield  api.post('get-subscription', data)
          .then(response => response.data)
          .catch(error => error.response.data);

        return response;
  }
  /**
   * Get Subscribers List From Server
   */

  function* getSubscribersListFromServer(action) {
      try {

          const state = yield select(memberSubscriptionReducer);
          const state1 = yield select(settings);

          state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
          const response = yield call(getSubscribersListRequest, state.tableInfo);

          if(!(response.errorMessage  || response.ORAT))
          {
              yield put(getSubscriptionListSuccess({data : response[0] , pages : response[1]}));
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
   * Get Subscription List
   */
  export function* getSubscriptionList() {
      yield takeEvery(GET_SUBSCRIPTION_LIST, getSubscribersListFromServer);
  }

  const saveSubscriptionFollowupRequest = function* (data)
  {
     data = cloneDeep(data);
     data.subscription.followupdate = setDateTime(data.subscription.followupdate);
      let response = yield api.post('save-memberfollowup', data)
          .then(response => response.data)
          .catch(error => error.response.data )

      return response;
  }
  /**
   * save product From Server
   */
  function* saveSubscriptionFollowupFromServer(action) {
      try {
        const state = yield select(settings);
        let memberfollowuplistId = action.payload.subscription.memberfollowuplistId;
        action.payload.subscription.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveSubscriptionFollowupRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
              yield put(requestSuccess("Followup added successfully."));
                yield  put(saveSubcriptionFollowupSuccess());

                switch (memberfollowuplistId) {
                  case 0:
                    // Inactivemember Module
                      yield call(getSubscribersListFromServer);
                    break;
                  case 1:
                    // Dues
                    yield call(getduesFromServer);
                    break;
                  case 2:
                    // Member Management
                    yield call(getMembersFromServer);
                    break;
                  case 3:
                    // Today Member Reminder
                    yield call(getMasterDashboardTodayMemberReminderFromServer);
                    break;
                  case 4:
                    // Followup Dashboard Recent expired membership
                    yield call(getFollowupDashboardRecentExpiredMemberFromServer);
                    break;
                  case 5:
                    // Followup Dashboard Recent expired pt
                    yield call(getFollowupDashboardRecentPTExpiredFromServer);
                    break;
                  case 6:
                    // Followup Dashboard dues
                    yield call(getFollowupDashboardPaymentDuesFromServer);
                    break;
                  case 7:
                    // Followup Dashboard missed followup
                    yield call(getFollowupDashboardMissedMemberFollowupFromServer);
                    break;
                  case 8:
                    // Followup Dashboard recent member
                    yield call(getFollowupDashboardRecentMemberFromServer);
                    break;
                  case 9:
                    // Followup Dashboard birthday
                    yield call(getFollowupDashboardTodayBirthdayFromServer);
                    break;
                  case 10:
                    // Measurement
                    yield call(getMeasurementsFromServer);
                    break;
                  case 11:
                    // Workout
                    yield call(getWorkoutSchedulesFromServer);
                    break;
                  case 12:
                    // Diet
                    yield call(getAllocateDietFromServer);
                    break;
                  case 13:
                    // Followup Dashboard Membership renewal in advance
                    yield call(getFollowupDashboardMembershiptobeExpiredFromServer);
                    break;
                  case 14:
                    // Followup Dashboard pt renewal in advance
                    yield call(getFollowupDashboardPTTobeExpiredFromServer);
                    break;
                  case 15:
                    // Followup Dashboard today anniversary
                    yield call(getFollowupDashboardTodayAnniversaryFromServer);
                    break;
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
  export function* saveSubcriptionFollowup() {
      yield takeEvery(SAVE_SUBSCRIPTION_FOLLOWUP, saveSubscriptionFollowupFromServer);
  }



/**
 * Subscription Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getSubscriptionList),
        fork(saveSubcriptionFollowup),
    ]);
}
