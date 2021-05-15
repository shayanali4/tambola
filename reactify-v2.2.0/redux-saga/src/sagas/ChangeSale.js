import { all, call, fork, put, takeEvery ,select} from 'redux-saga/effects';
import api from 'Api';
import { push } from 'connected-react-router';
import {changesaleReducer,ecommerce,settings} from './states';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
  GET_CHANGESUBSCRIPTIONSALES,
  CHANGE_SALE,
  OPEN_CHANGESALE_MODEL
} from 'Actions/types';

import {
getChangeSubscriptionsalesSuccess,
changeSaleSuccess,
opnChangeSaleModelSuccess,
onCloseChangeSaleTransfer,
requestSuccess,
requestFailure,
showLoader,
hideLoader
} from 'Actions';
/**
 * Send changesubscriptionsale Request To Server
 */
const getChangeSubscriptionSaleRequest = function* (data)
{let response = yield  api.post('get-changesubscriptionsale', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Send changeproductsale Request To Server
 */
const getChangeproductSaleRequest = function* (data)
{let response = yield  api.post('get-changeproductsale', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}


/**
 * Get changesale From Server
 */

function* getChangeSubscriptionsalesFromServer(action) {
    try {
        const state = yield select(changesaleReducer);
        const state1 = yield select(settings);
        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(state.tableInfo.changesalefilter == 1 ? getChangeSubscriptionSaleRequest :getChangeproductSaleRequest , state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getChangeSubscriptionsalesSuccess({data : response[0], pages : response[1]}));
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
 * Get changesale
 */
export function* getChangeSubscriptionsales() {
    yield takeEvery(GET_CHANGESUBSCRIPTIONSALES, getChangeSubscriptionsalesFromServer);
}

/**
 * Send change subscription Request To Server
 */
 const changeSaleRequest = function* (data)
 {

     data = cloneDeep(data);

     if(data.installments && data.installments.length > 0)
     {
       data.installments.map(x => x.installmentDate = setLocalDate(x.installmentDate) );
     }
     if(data.cart)
     {
       data.cart.expiryDate = setLocalDate(data.cart.expiryDate);
       data.cart.startDate = setLocalDate(data.cart.startDate);
     }

     if(data.canceldetail)
     {
       data.canceldetail.cancelexpirydate = setLocalDate(data.canceldetail.cancelexpirydate);
       data.canceldetail.transferactivationdate = setLocalDate(data.canceldetail.transferactivationdate);
       data.canceldetail.transferexpirydate = setLocalDate(data.canceldetail.transferexpirydate);
       data.canceldetail.startdate = setLocalDate(data.canceldetail.startdate);
       data.canceldetail.newexpirydate = setLocalDate(data.canceldetail.newexpirydate);
     }

     if(data.paymentInformatioArray && data.paymentInformatioArray.length > 0){
         data.paymentInformatioArray.map(x => { x.chequeDate = setLocalDate(x.chequeDate); x.paymentDate = setLocalDate(x.paymentDate);});
       }


     data.invoiceDate = setLocalDate(data.invoiceDate);

     let response = yield api.post('change-sale', data)
     .then(response => response.data)
     .catch(error => error.response.data)
     return response;

 }
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
 * Delete sale From Server
 */
function* changeSaleFromServer(action) {
    try {

             const state = yield select(changesaleReducer);
             const state1 = yield select(ecommerce);
             const state2 = yield select(settings);

             action.payload.canceldetail = state.changeSaledetail;
             action.payload.canceldetail.remark = action.payload.remark;
             action.payload.canceldetail.cancelexpirydate = action.payload.cancelexpirydate;
             action.payload.canceldetail.transferactivationdate = action.payload.transferactivationdate;
             action.payload.canceldetail.transferexpirydate = action.payload.transferexpirydate;
             action.payload.canceldetail.branchid = state2.userProfileDetail.defaultbranchid;
             action.payload.changetype = state.changetype;
             action.payload.canceldetail.enablepaymentcancel = action.payload.enablepaymentcancel;
              let  paymentArray = cloneDeep(action.payload.paymentArray) || [];
              action.payload.memberbalance = action.payload.memberbalance || 0;
             if(action.payload.paymentdetails && action.payload.paymentdetails.paymentAmount > 0){
             paymentArray.push(action.payload.paymentdetails);
             }
             action.payload.totalpaymentAmount = paymentArray.length > 0 ? paymentArray.map(x => x.paymentAmount).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) :0 ;
             action.payload.paymentInformatioArray = paymentArray;

             if(action.payload.enablepaymentcancel == 1)
             {
               action.payload.canceldetail.cancelpaymentamount = state.changeSaledetail.paymentamount;
             }

             let changeType = action.payload.changetype;
             let creditforinvoiceid = action.payload.canceldetail.invoiceid;

             if(action.payload.changetype == "3"){
               action.payload.billingInformation = state1.selectedmember;
               action.payload.billingInformation.timezoneoffset = state2.userProfileDetail.timezoneoffsetvalue;
           }
            let totalcartvalue = 0;
            let changeServiceType = '';
             if(action.payload.changetype == "2" || (action.payload.changetype == "3" && state1.cart && state1.cart.length > 0)){
               action.payload.cart = cloneDeep(state1.cart[0]);
               action.payload.cart.description = "";
               action.payload.installments = state1.installments;
               action.payload.salesby = state1.salesby;
               action.payload.invoiceDate = state1.invoiceDate;
               action.payload.changeservicetype =   action.payload.canceldetail.isservice == "1" ? (action.payload.changetype == "3" ? "Transfer Service" :  "Upgrade Service") :  "Replace Product";
               changeServiceType = action.payload.canceldetail.isservice == "1" ? "Service upgraded " :  "Product replaced";
               totalcartvalue = action.payload.cart.totalPrice;
           }

                 let totalInstallmentAmount = action.payload.installments ? action.payload.installments.map(x => x.installmentAmount).reduce((a,b)=> parseFloat(a) + parseFloat(b), 0) : 0;

                 if(action.payload.paymentType == 2 && (action.payload.changetype == "2" || (action.payload.changetype == "3" && state1.cart && state1.cart.length > 0)) && action.payload.memberbalance > totalcartvalue && (action.payload.totalpaymentAmount > 0 || totalInstallmentAmount > 0))
                 {
                   yield put(requestFailure("You have enough credits."));
                 }
                 else if(action.payload.paymentType == 2 && (action.payload.changetype == "2" || (action.payload.changetype == "3" && state1.cart && state1.cart.length > 0)) && action.payload.memberbalance + action.payload.totalpaymentAmount  < totalcartvalue && action.payload.memberbalance + action.payload.totalpaymentAmount + totalInstallmentAmount  != totalcartvalue )
                 {
                     yield put(requestFailure("Please make installments for outstanding amount."));
                 }
                 else if(action.payload.paymentType == 2 && (action.payload.changetype == "2" || (action.payload.changetype == "3" && state1.cart && state1.cart.length > 0)) && action.payload.memberbalance < totalcartvalue &&  action.payload.memberbalance + action.payload.totalpaymentAmount + totalInstallmentAmount  != totalcartvalue){
                   yield put(requestFailure("Please enter valid amount."));
                 }
               else{
                 if(action.payload.paymentdetails && action.payload.paymentdetails.paymentMode == "4" && action.payload.paymentdetails.linkpayEnable == 1 && action.payload.paymentdetails.userpaymenttype == "3"){

                       let purchasedetail = {};
                       purchasedetail.billing = action.payload.canceldetail;

                       if(action.payload.changetype == "3"){
                       purchasedetail.billing = state1.selectedmember;
                     }
                     else{
                       purchasedetail.billing.id = action.payload.canceldetail.memberid;
                     }


                       purchasedetail.cart = [];
                       purchasedetail.cart.push(action.payload.cart);

                       purchasedetail.payment = action.payload.paymentdetails;

                       let duesdata = {};
                       duesdata.paymentDate =  action.payload.paymentdetails.paymentDate;
                       duesdata.paymentAmount =  action.payload.paymentdetails.paymentAmount.toString();
                       duesdata.paymentMode = action.payload.paymentdetails.paymentMode;
                       duesdata.emailid = purchasedetail.billing.personalemailid;
                       duesdata.paymentamount = action.payload.paymentdetails.paymentAmount;
                       duesdata.mobile = purchasedetail.billing.mobile;
                       duesdata.branchid = purchasedetail.billing.defaultbranchid || state2.userProfileDetail.defaultbranchid;
                       duesdata.timezoneoffset = state2.userProfileDetail.timezoneoffsetvalue;
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
                const response = yield call(changeSaleRequest, action.payload);
                if(!(response.errorMessage  || response.ORAT))
                {
                    let successmsg = (changeType == "1" ? (action.payload.canceldetail.isservice == "1" ? 'Service cancelled' : 'Product cancelled') : (changeType == "2" ? changeServiceType : 'Service transferred'));

                       yield put(requestSuccess(successmsg +" successfully."));

                     let id = response[0][0].invoiceid;
                     let creditnoteid = response[0][0].creditnoteid;

                     yield put(changeSaleSuccess({data : id}));
                     yield put(onCloseChangeSaleTransfer());
                     if(id && creditnoteid){
                        yield  put(push('/app/ecommerce/invoice?id='+id+'&?creditnoteid='+creditnoteid));
                      }
                      else if (id){
                        yield  put(push('/app/ecommerce/invoice?id='+id));                    }
                      else if(creditnoteid ){
                        yield  put(push('/app/ecommerce/invoice?creditnoteid='+creditnoteid));
                      }
                      else {
                        yield  put(push('/app/ecommerce/change-sale'));
                      }
                     yield call(getChangeSubscriptionsalesFromServer);
                }
                else {
                   // yield put(onCloseChangeSaleTransfer());
                   yield put(requestFailure(response.errorMessage));
                }
              }
            }
           } catch (error) {
               console.log(error);
           }
           finally{
           }
}

export function* changeSale() {
    yield takeEvery(CHANGE_SALE, changeSaleFromServer);
}

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
 * Send Product Request To Server
 */
const getProductRequest = function* (data)
{let response = yield  api.post('get-producthit', data)
      .then(response => response.data)
      .catch(error => error.response.data )

      return response;
}
/**
 * Send Employee VIEW Request To Server
 */
 const viewServiceRequest = function* (data)
 {
   let response = yield api.post('view-subscriptionsale', data)
       .then(response => response.data)
       .catch(error => error.response.data )
     return response;
 }

function* getChangesalesFromServer(action) {
    try {
        const state = yield select(changesaleReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid =  state1.userProfileDetail.defaultbranchid;
          state.tableInfosales.branchid = state1.userProfileDetail.defaultbranchid;
          state.tableInfosales.enablecomplimentarysale = state1.userProfileDetail.enablecomplimentarysale;
          state.tableInfosales.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

            const response1 = yield call(viewServiceRequest,action.payload);
            const {isservice} = action.payload;
            let response = {};
            if(isservice == 1){
               response = yield call(getServiceRequest,state.tableInfosales );
            }
            else{
               response = yield call(getProductRequest,state.tableInfosales);
            }
              if(response && !response.errorMessage && !response1.errorMessage)
              {
                  yield put(opnChangeSaleModelSuccess({services : (isservice ? response[0] : null),
                    changeSaledetail:response1[0][0],products:(!isservice ? response[0] : null)}));
             }
             else {
                 yield put(requestFailure(response && (response.errorMessage || response1.errorMessage )));
             }
    } catch (error) {
      console.log(error);
    }
    finally {
    }
}

/**
 * Get changesale
 */
export function* opnChangeSaleModel() {
    yield takeEvery(OPEN_CHANGESALE_MODEL, getChangesalesFromServer);
}
/**
 * Email Root Saga
 */
export default function* rootSaga() {
    yield all([
      fork(getChangeSubscriptionsales),
      fork(changeSale),
      fork(opnChangeSaleModel)
    ]);
}
