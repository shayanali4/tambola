/**
 * Product Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import api from 'Api';
import {ecommerce,settings} from './states';
import { push } from 'connected-react-router';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';


import {
   GET_SERVICE_HIT_DETAIL,
   GET_MEMBER_DETAILS,
   GET_ENQUIRY_DETAILS,
   SAVE_SUBSCRIPTION_DETAILS,
   GET_PRODUCT_HIT_DETAIL,
   GET_PACKAGE_HIT_DETAIL,
   ON_EMPLOYEELIST,
   GET_UNFINISHEDCART_LIST,
   DELETE_UNFINISHEDCART,
} from 'Actions/types';

import {
  getServiceHitDetailSuccess,
  getMemberDetailSuccess,
  getEnquiryDetailSuccess,
  saveSubscriptionDetailsSuccess,
  getProductHitDetailSuccess,
  getPackageHitDetailSuccess,
  onEmployeeListSuccess,
  getUnfinishedCartListSuccess,
  requestSuccess,
  requestFailure,
  showLoader,
  hideLoader
} from 'Actions';


/**
 * Send service Request To Server
 */
const getServiceRequest = function* (data)
{let response = yield  api.post('get-servicehit', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

/**
 * Get service From Server
 */

function* getServicesFromServer(action) {
    try {
        const state = yield select(ecommerce);
        const state1 = yield select(settings);
        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        state.tableInfo.enablecomplimentarysale = state1.userProfileDetail.enablecomplimentarysale;
        state.tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

        const response = yield call(getServiceRequest,state.tableInfo );

        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getServiceHitDetailSuccess({data : response[0],pages : response[1]}));
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

/**
 * Get Service
 */
export function* getServiceHitDetail() {
    yield takeEvery(GET_SERVICE_HIT_DETAIL, getServicesFromServer);
}



/**
 * Send Member VIEW Request To Server
 */
 const viewMemberRequest = function* (data)
 {  let response = yield api.post('sales-view-member', data)
         .then(response => response.data)
         .catch(error => error.response.data);

     return response;
 }
/**
 * VIEW Member From Server
 */
function* getMemberFromServer(action) {
    try {

        const response = yield call(viewMemberRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getMemberDetailSuccess({data : response[0]}));
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

export function* getMemberDetail() {
    yield takeEvery(GET_MEMBER_DETAILS, getMemberFromServer);
}

const viewEnquiryRequest = function* (data)
{
  let response = yield api.post('view-enquiry', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}
/**
* VIEW Employee From Server
*/
function* getEnquiryFromServer(action) {
   try {
       const response = yield call(viewEnquiryRequest,action.payload);
       if(!(response.errorMessage  || response.ORAT))
       {
       yield put(getEnquiryDetailSuccess({data : response[0]}));
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


export function* getEnquiryDetail() {
    yield takeEvery(GET_ENQUIRY_DETAILS, getEnquiryFromServer);
}


const savePaymentDetailRequest = function* (data)
{
    data = cloneDeep(data);

    if(data.cart && data.cart.length > 0)
    {
      data.cart.map(x => { x.expiryDate = setLocalDate(x.expiryDate); x.startDate = setLocalDate(x.startDate);});
    }

    if(data.installments && data.installments.length > 0)
    {
      data.installments.map(x => x.installmentDate = setLocalDate(x.installmentDate) );
    }
    data.invoiceDate = setLocalDate(data.invoiceDate);

  if(data.paymentInformatioArray && data.paymentInformatioArray.length > 0){
    data.paymentInformatioArray.map(x => { x.chequeDate = setLocalDate(x.chequeDate); x.paymentDate = setLocalDate(x.paymentDate);});
  }

    let response = yield api.post('save-subscription', data)
    .then(response => response.data)
    .catch(error => error.response.data)
    return response;
}
/**
 * save Member payment link init request
 */

const saveLinkPayDetailRequest = function* (data)
{
    data = cloneDeep(data);
    data.duesdata.paymentDate = setLocalDate(data.duesdata.paymentDate);

    if(data.duesdata.purchasedetail.cart && data.duesdata.purchasedetail.cart.length > 0)
    {
      data.duesdata.purchasedetail.cart.map(x => { x.expiryDate = setLocalDate(x.expiryDate); x.startDate = setLocalDate(x.startDate);});
    }


    if(data.paymentInformatioArray && data.paymentInformatioArray.length > 0){
      data.paymentInformatioArray.map(x => { x.chequeDate = setLocalDate(x.chequeDate); x.paymentDate = setLocalDate(x.paymentDate);x.invoiceDate =setLocalDate(x.invoiceDate) });
    }

    let response = yield api.post('membership-save-onlinepaymentinit', data)
    .then(response => response.data)
    .catch(error => error.response.data)
    return response;
}

/**
 * save Member From Server
 */
function* savePaymentDetailToServer(action) {
    try {
            const state = yield select(ecommerce);
            const state1 = yield select(settings);

            action.payload.billingInformation = state.selectedmember;
            action.payload.billingInformation.branchid = state1.userProfileDetail.defaultbranchid;
            action.payload.billingInformation.timezoneoffset = state1.userProfileDetail.timezoneoffsetvalue;
            action.payload.cart = cloneDeep(state.cart);
            action.payload.cart.forEach(x => x.description = "" );
            action.payload.installments = state.installments;
            action.payload.salesby = state.salesby;
            action.payload.invoiceDate = state.invoiceDate;
			action.payload.unfinishedcartid = state.unfinishedcartid;
            action.payload.biomaxadddelail = {};
            action.payload.biomaxadddelail.userid = state1.clientProfileDetail.id;
            let  paymentArray = cloneDeep(action.payload.paymentArray) || [];
            action.payload.biomaxadddelail.name = action.payload.billingInformation.firstname +  " " + action.payload.billingInformation.lastname;
            if(state1.clientProfileDetail.biometriclist && state1.clientProfileDetail.biometriclist.length > 0){
            action.payload.biomaxadddelail.SerialNumber = state1.clientProfileDetail.biometriclist.map(x => x.serialnumber);
            }
            if(action.payload.paymentdetails.paymentAmount > 0){
              paymentArray.push(action.payload.paymentdetails);
            }
            action.payload.totalpaymentAmount = paymentArray.length > 0 ? paymentArray.map(x => x.paymentAmount).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) : 0 ;
            action.payload.paymentInformatioArray = paymentArray;
            let quantity  = [];
            quantity  =  action.payload.cart.filter(function (x) {
                        return x.Quantity == " ";
                    });

            let totalcartvalue = action.payload.cart.map(x => x.totalPrice).reduce((a,b)=> parseFloat(a) + parseFloat(b), 0);
            let totalInstallmentAmount = action.payload.installments ? action.payload.installments.map(x => x.installmentAmount).reduce((a,b)=> parseFloat(a) + parseFloat(b), 0) : 0;

            action.payload.memberbalance = action.payload.memberbalance &&  action.payload.memberbalance > 0 ? action.payload.memberbalance :  0;

        if(quantity.length > 0){
                     yield put(requestFailure("Quantity is required"));
            }
            else if(action.payload.paymentType == 2 && action.payload.memberbalance > totalcartvalue && (action.payload.totalpaymentAmount > 0 || totalInstallmentAmount > 0))
             {
                yield put(requestFailure("You have enough credits."));
              }
              else if(action.payload.paymentType == 2 && action.payload.memberbalance + action.payload.totalpaymentAmount  < totalcartvalue && action.payload.memberbalance + action.payload.totalpaymentAmount + totalInstallmentAmount  != totalcartvalue )
              {
                  yield put(requestFailure("Please make installments for outstanding amount."));
              }
              else if(action.payload.paymentType == 2 && action.payload.memberbalance < totalcartvalue &&  action.payload.memberbalance + action.payload.totalpaymentAmount + totalInstallmentAmount  != totalcartvalue){
                yield put(requestFailure("Please enter valid amount."));
              }
              else {
                 if(action.payload.paymentdetails.paymentMode == "4" && action.payload.paymentdetails.linkpayEnable == 1 && action.payload.paymentdetails.userpaymenttype == "3"){

                       let purchasedetail = {};

                       purchasedetail.billing = action.payload.billingInformation;

                       purchasedetail.cart = action.payload.cart;

                       purchasedetail.payment = action.payload.paymentdetails;

                       let duesdata = {};
                       duesdata.paymentDate =  action.payload.paymentdetails.paymentDate;
                       duesdata.paymentAmount =  action.payload.paymentdetails.paymentAmount.toString();
                       duesdata.paymentMode = action.payload.paymentdetails.paymentMode;
                       duesdata.emailid = action.payload.billingInformation.personalemailid;
                       duesdata.paymentamount = action.payload.paymentdetails.paymentAmount;
                       duesdata.mobile = action.payload.billingInformation.mobile;
                       duesdata.branchid = action.payload.billingInformation.branchid;
                       duesdata.timezoneoffset = action.payload.billingInformation.timezoneoffset;
                       duesdata.purchasedetail = purchasedetail;
                       duesdata.userpaymenttype = action.payload.paymentdetails.userpaymenttype;
                       duesdata.linkpayEnable = action.payload.paymentdetails.linkpayEnable;
                       duesdata.configurationValue = action.payload.paymentdetails.configurationValue;
                        const response = yield call(saveLinkPayDetailRequest,{duesdata});

                        if(!(response.errorMessage  || response.ORAT))
                        {

                              yield put(requestSuccess("Link Created successfully."));
                              yield  put(push('/app/ecommerce/service'));
                              yield put(saveSubscriptionDetailsSuccess());

                        }
                        else {
                          yield put(requestFailure(response.errorMessage));
                        }
                      }
                      else{
                            const response = yield call(savePaymentDetailRequest,action.payload);
                            if(!(response.errorMessage  || response.ORAT))
                            {

                                  yield put(requestSuccess("Payment Done successfully."));
                                  let id = response[0][0].invoiceid;
                                  yield put(saveSubscriptionDetailsSuccess({data : id}));
                                  if(totalcartvalue > 0 && id)
                                  {
                                      yield  put(push('/app/ecommerce/invoice?id='+id));
                                  }
                                  else {
                                      yield  put(push('/app/ecommerce/service'));
                                  }
                            }
            else {
              yield put(requestFailure(response.errorMessage));
            }
          }
      }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Get Members
 */
export function* saveSubscriptionDetails() {
    yield takeEvery(SAVE_SUBSCRIPTION_DETAILS, savePaymentDetailToServer);
}

/**
 * Send Product Request To Server
 */
const getProductRequest = function* (data)
{let response = yield  api.post('get-producthit', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

function* getProductsFromServer(action) {
    try {
        const state = yield select(ecommerce);
        const state1 = yield select(settings);

        state.tableInfoProduct.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getProductRequest,state.tableInfoProduct );
        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(getProductHitDetailSuccess({data : response[0],pages : response[1]}));
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

/**
 * Get Service
 */
export function* getProductHitDetail() {
    yield takeEvery(GET_PRODUCT_HIT_DETAIL, getProductsFromServer);
}
/**
 * Send package Request To Server
 */
const getPackageRequest = function* (data)
{let response = yield  api.post('get-packagehit', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}

function* getPackagesFromServer(action) {
    try {
        const state = yield select(ecommerce);
        const state1 = yield select(settings);

       state.tableInfoPackage.branchid = state1.userProfileDetail.defaultbranchid;
       state.tableInfoPackage.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

       const response = yield call(getPackageRequest,state.tableInfoPackage );
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(getPackageHitDetailSuccess({data : response[0],pages : response[1]}));
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

/**
 * Get package
 */
export function* getPackageHitDetail() {
    yield takeEvery(GET_PACKAGE_HIT_DETAIL, getPackagesFromServer);
}


const getEmployeeRequest = function* (data)
{
   let response = yield api.post('employee-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}
/**
 * Get employeelist From Server
 */

function* getemployeelistFromServer(action) {
    try {
      const state = yield select(ecommerce);
      if(state.employeeList == null){
        const state1 = yield select(settings);
        let branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getEmployeeRequest,{branchid});
        if(!(response.errorMessage  || response.ORAT))
        {
        yield put(onEmployeeListSuccess({employeeList : response[0]}));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }
  }
  }catch (error) {
        console.log(error);
    }
    finally {
    }
  }

/**
 * Get Service
 */
export function* onEmployeeList() {
    yield takeEvery(ON_EMPLOYEELIST, getemployeelistFromServer);
}


const getUnfinishedCartListRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "followupdate" || x.id == "createdbydate") {
      x.value = setLocalDate(x.value)
    }
  });

  let response = yield  api.post('get-unfinishedcart', data)
      .then(response => response.data)
      .catch(error => { return error.response.data;} )

      return response;
}

function* getUnfinishedCartListFromServer(action) {
    try {
        const state = yield select(ecommerce);
        const state1 = yield select(settings);

        state.tableInfoUnfinishedCart.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getUnfinishedCartListRequest, state.tableInfoUnfinishedCart);

        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(getUnfinishedCartListSuccess({data : response[0], pages : response[1]}));
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


export function* getUnfinishedCartList() {
    yield takeEvery(GET_UNFINISHEDCART_LIST, getUnfinishedCartListFromServer);
}


const deleteUnfinishedCartRequest = function* (data)
{  let response = yield api.post('delete-unfinishedcart', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

function* deleteUnfinishedCartFromServer(action) {
    try {
        yield put(showLoader());
        const response = yield call(deleteUnfinishedCartRequest, action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess("Unfinished cart deleted successfully."));
          yield call(getUnfinishedCartListFromServer);
    } else {
       yield put(requestFailure(response.errorMessage));
    }
  } catch (error) {
      console.log(error);
  }
  finally{

  }
}

export function* deleteUnfinishedCart() {
    yield takeEvery(DELETE_UNFINISHEDCART, deleteUnfinishedCartFromServer);

}


/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getServiceHitDetail),
      fork(getMemberDetail),
      fork(getEnquiryDetail),
      fork(saveSubscriptionDetails),
      fork(getProductHitDetail),
      fork(onEmployeeList),
      fork(getPackageHitDetail),
	  fork(getUnfinishedCartList),
	  fork(deleteUnfinishedCart)
    ]);
}
