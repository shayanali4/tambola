import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import api from 'Api';
import {memberBuyServiceReducer,settings} from '../states';
import {cloneDeep,setDateTime,setLocalDate} from 'Helpers/helpers';
import { push } from 'connected-react-router';

import {
   MEMBER_GET_SERVICE_HIT_DETAIL,
   SAVE_MEMBER_SUBSCRIPTION_DETAILS,
   MEMBER_CHECKFOR_ACTIVE_CLASS,
   SAVE_MEMBER_CLASS_BOOKING,
   MEMBER_DELETE_CLASS_BOOKED,
} from 'Actions/types';

import {
  membergetServiceHitDetailSuccess,
  saveMemberSubscriptionDetailsSuccess,
  memberCheckForActiveClassSuccess,
  saveMemberClassBookingSuccess,
  memberDeleteClassBookedSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';

const membergetServiceRequest = function* (data)
{let response = yield  api.post('member-get-servicehit', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}


const getClientProfileRequest = function* (data)
{
  let response = yield  api.post('client-signindetail', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}


function* membergetServicesFromServer(action) {
    try {
        const state = yield select(memberBuyServiceReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.memberProfileDetail && state1.memberProfileDetail.defaultbranchid;
        state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

        const response = yield call(membergetServiceRequest,state.tableInfo );



        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(membergetServiceHitDetailSuccess({data : response[0],pages : response[1]}));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }

  }catch (error) {
        console.log(error);
    }
    finally {
    }
}

export function* membergetServiceHitDetail() {
    yield takeEvery(MEMBER_GET_SERVICE_HIT_DETAIL, membergetServicesFromServer);
}


const savePaymentDetailRequest = function* (data)
{
  data = cloneDeep(data);

  if(data.cart && data.cart.length > 0)
  {
    data.cart.map(x => { x.expiryDate = setLocalDate(x.expiryDate); x.startDate = setLocalDate(new Date(x.startDate));});
  }

  data.paymentdetails.paymentDate = setLocalDate(data.paymentdetails.paymentDate);

    let response = yield api.post('save-member-subscription', data)
    .then(response => response.data)
    .catch(error => error.response.data)
    return response;
}
/**
 * save Member From Server
 */
function* savePaymentDetailToServer(action) {
    try {

            const state = yield select(memberBuyServiceReducer);
            const state1 = yield select(settings);

            action.payload.billingInformation = {};
            action.payload.billingInformation.id = state1.memberProfileDetail.id;
            action.payload.billingInformation.branchid = state1.memberProfileDetail.defaultbranchid;
            action.payload.cart = cloneDeep(state.cart);
            action.payload.cart.forEach(x => x.description = "" );


            let totalcartvalue = action.payload.cart.map(x => x.totalPrice).reduce((a,b)=> parseInt(a) + parseInt(b), 0);


        const response = yield call(savePaymentDetailRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {

              yield put(requestSuccess("Payment Done successfully."));
              let id = response[0][0].invoiceid;
              yield put(saveMemberSubscriptionDetailsSuccess({data : id}));
              // if(totalcartvalue > 0 && id)
              // {
              //     yield  put(push('/app/ecommerce/invoice?id='+id));
              // }
              // else {
                if(state.isclassscheduleredirect == 1)
                {
                  yield  put(push('/member-app/class-schedule'));
                }
                else if(state.isptscheduleredirect == 1) {
                  yield  put(push('/member-app/pt-schedule'));
                }
                else {
                  yield  put(push('/member-app/buy-service'));
                }

              // }
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 * Get Members
 */
export function* saveMemberSubscriptionDetails() {
    yield takeEvery(SAVE_MEMBER_SUBSCRIPTION_DETAILS, savePaymentDetailToServer);
}


const memberCheckForActiveClassRequest = function* (data)
{
    let response = yield api.post('member-checkfor-activeclass', data)
    .then(response => response.data)
    .catch(error => error.response.data)
    return response;
}

function* memberCheckForActiveClassToServer(action) {
    try {
            let sessiontype = action.payload.sessiontype;
            let classid = action.payload.id;
            let serviceprovidedId = action.payload.serviceprovidedId;

            const response = yield call(memberCheckForActiveClassRequest,action.payload);
            if(!(response.errorMessage  || response.ORAT))
            {
              let classDetail = response[0][0];
              classDetail.sessiontype = sessiontype;
              classDetail.classid = classid;
              classDetail.serviceprovidedId = serviceprovidedId;
               yield put(memberCheckForActiveClassSuccess({data : classDetail}));
            }
            else {
              yield put(requestFailure(response.errorMessage));
            }

        } catch (error) {
            console.log(error);
        }
}

export function* memberCheckForActiveClass() {
    yield takeEvery(MEMBER_CHECKFOR_ACTIVE_CLASS, memberCheckForActiveClassToServer);
}

const saveMemberClassBookingRequest = function* (data)
{
  data = cloneDeep(data);
  data.data.notificationdatetime = cloneDeep(data.data.startdatetime);
  data.data.startdatetime = setDateTime(data.data.startdatetime);
  data.data.enddatetime = setDateTime(data.data.enddatetime);
    let response = yield api.post('save-member-classbooking',data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveMemberClassBookingFromServer(action) {
    try {
          let interested  = action.payload.data.isinterested;

            const response = yield call(saveMemberClassBookingRequest,action.payload);

              if(!(response.errorMessage  || response.ORAT))
              {
                  if(interested == 1)
                  {
                    yield put(requestSuccess("Thank you for showing your interest."));
                  }
                  else {
                    yield put(requestSuccess("Class booked successfully."));
                  }

                    yield  put(saveMemberClassBookingSuccess());
              }
              else {
                yield put(requestFailure(response.errorMessage));
              }
    } catch (error) {
        console.log(error);
    }
}

export function* saveMemberClassBooking() {
    yield takeEvery(SAVE_MEMBER_CLASS_BOOKING, saveMemberClassBookingFromServer);
}


const deleteMemberClassBookedRequest = function* (data)
{  let response = yield api.post('delete-class-booked', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}


function* deleteMemberClassBookedFromServer(action) {
    try {
        const state1 = yield select(settings);

        action.payload.branchid = state1.memberProfileDetail && state1.memberProfileDetail.defaultbranchid;
        const response = yield call(deleteMemberClassBookedRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Booked class cancelled successfully."));
          yield  put(memberDeleteClassBookedSuccess());
    } else {
       yield put(requestFailure(response.errorMessage));
    }
  } catch (error) {
      console.log(error);
  }
  finally{
  }
}


export function* memberDeleteClassBooked() {
    yield takeEvery(MEMBER_DELETE_CLASS_BOOKED, deleteMemberClassBookedFromServer);
}



export default function* rootSaga() {
    yield all([
      fork(membergetServiceHitDetail),
      fork(saveMemberSubscriptionDetails),
      fork(memberCheckForActiveClass),
      fork(saveMemberClassBooking),
      fork(memberDeleteClassBooked)
    ]);
}
