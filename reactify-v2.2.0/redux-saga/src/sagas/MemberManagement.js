/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {memberManagementReducer,settings} from './states';
import { push } from 'connected-react-router';
import {cloneDeep,setLocalDate} from 'Helpers/helpers';

// api
import api, {fileUploadConfig} from 'Api';

import {
  GET_MEMBERS,
  OPEN_ADD_NEW_MEMBER_MODEL,
  CLOSE_ADD_NEW_MEMBER_MODEL,
  SAVE_MEMBER,
  OPEN_EDIT_MEMBER_MODEL,
  OPEN_VIEW_MEMBER_MODEL,
  DELETE_MEMBER,
  IMPORT_MEMBER,
  IMPORT_MEMBER_LIST,
  SAVE_ACTIVEMEMBERSHIP_CHANGEDATE,
  GET_MEMBERPROFILE_MEMBERSHIP,
  SAVE_CANCEL_PAYMENT,
  SAVE_MEMBER_STATUS,
  SAVE_MEMBER_BALANCE_ADJUSTMENT,
  SAVE_CHANGE_MEMBER_SALESBY,
} from 'Actions/types';

import {
    getMembersSuccess,
    getMembersFailure,
    saveMemberSuccess,
    opnAddNewMemberModelSuccess,
    viewMemberSuccess,
    editMemberSuccess,
    importMemberSuccess,
    importMemberListSuccess,
    saveActiveMembershipChangedateSuccess,
    getMemberProfileMembershipSuccess,
    saveCancelPaymentSuccess,
    saveMemberStatusSuccess,
    saveMemberBalanceAdjustmentSuccess,
    saveChangeMemberSalesbySuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

/**
 * Send Member Save Request To Server
 */
const saveMembersRequest = function* (data)
{

  data = cloneDeep(data);
  data.memberdetail.dateOfBirth = setLocalDate(data.memberdetail.dateOfBirth);
  data.memberdetail.anniversary  = setLocalDate(data.memberdetail.anniversary );

  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

  if(data.memberdetail.imageFiles.length > 0)
    formData.append("files", data.memberdetail.imageFiles[0]);

    let response = yield api.post('save-member', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}
/**
 * save Member From Server
 */
function* saveMemberFromServer(action) {
    try {

        const response = yield call(saveMembersRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {

            const {memberdetail} = action.payload;
            if(memberdetail.id && memberdetail.id != 0)
            {
              yield put(requestSuccess("Member updated successfully."));
            }
            else {
              yield put(requestSuccess("Member created successfully."));
            }

            yield  put(saveMemberSuccess());
            yield call(getMembersFromServer);
             yield put(push('/app/members/member-management'));
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
export function* saveMember() {
    yield takeEvery(SAVE_MEMBER, saveMemberFromServer);
}



/**
 * Send Member Management Request To Server
 */
const getMembersRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered && data.filtered.map(x => {
    if(x.id == "lastcheckin")
    {
      x.value = setLocalDate(x.value);
    }
    if (x.id == "createdbydate") {
      x.value = setLocalDate(x.value)
    }
    if (x.id == "maxexpirydate") {
      x.value = setLocalDate(x.value)
    }
  });

  let response = yield  api.post('get-members', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}
/**
 * Get Members From Server
 */

export function* getMembersFromServer(action) {
    try {
        const state = yield select(memberManagementReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getMembersRequest, state.tableInfo);



        if(!(response.errorMessage  || response.ORAT) )
        {
            yield put(getMembersSuccess({data : response[0] , pages : response[1]}));
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
 * Get Members
 */
export function* getMembers() {
    yield takeEvery(GET_MEMBERS, getMembersFromServer);
}


const getBranchRequest = function* (data)
{
   let response = yield api.post('branch-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}

function* getBranchlistFromServer(action) {
   try {

       const response = yield call(getBranchRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
       yield put(opnAddNewMemberModelSuccess({branchList : response[0]}));
      }
      else {
        yield put(requestFailure(response.errorMessage));
      }
    }catch (error) {
         console.log(error);
    }
    finally
    {
        yield put(hideLoader());
    }
}

export function* opnAddNewMemberModel() {
   yield takeEvery(OPEN_ADD_NEW_MEMBER_MODEL, getBranchlistFromServer);
}


  /**
   * Send Member VIEW Request To Server
   */
   const viewMemberRequest = function* (data)
   {  let response = yield api.post('view-member', data)
           .then(response => response.data)
           .catch(error => error.response.data);

       return response;
   }
  /**
   * VIEW Member From Server
   */
export function* viewMemberFromServer(action) {
      try {
          const state = yield select(memberManagementReducer);
          let data;
          if(action && action.payload)
          {
            data = action.payload;
          }
          else {
            let requestData = {};
            requestData.id = state.selectedmemberProfile.id;
            data = requestData;
          }
          const response = yield call(viewMemberRequest,data);

          if(!(response.errorMessage  || response.ORAT))
          {
              yield put(viewMemberSuccess({data : response}));
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
   * VIEW Members
   */
  export function* opnViewMemberModel() {
      yield takeEvery(OPEN_VIEW_MEMBER_MODEL, viewMemberFromServer);
  }



  /**
   * Edit Member From Server
   */
  function* editMemberFromServer(action) {
      try {

          const response = yield call(viewMemberRequest,action.payload);
          const response1 = yield call(getBranchRequest,action.payload);

          if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage )
          {
              yield put(editMemberSuccess({data : response[0],branchList : response1[0]}));
          }
          else {
            yield put(requestFailure(response.errorMessage || response1.errorMessage ));
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
  export function* opnEditMemberModel() {
      yield takeEvery(OPEN_EDIT_MEMBER_MODEL, editMemberFromServer);
  }



  /**
   * Send Member Delete Request To Server
   */
  const deleteMemberRequest = function* (data)
  {  let response = yield api.post('delete-member', data)
          .then(response => response.data)
          .catch(error => error.response.data);

      return response;
  }

  /**
   * Delete Member From Server
   */
  function* deleteMemberFromServer(action) {
      try {
               const response = yield call(deleteMemberRequest, action.payload);

                if(!(response.errorMessage  || response.ORAT))
                {
                     yield put(requestSuccess("Member deleted successfully."));
                     yield call(getMembersFromServer);
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

  export function* deleteMember() {
      yield takeEvery(DELETE_MEMBER, deleteMemberFromServer);
  }


  const memberImportRequest = function* (data)
  {
    var formData = new FormData();
    for ( var key in data ) {
        formData.append(key, JSON.stringify(data[key]));
    }

    if(data.importfile.length > 0)
      formData.append("files", data.importfile[0]);
      api.defaults.timeout = 5 * 60 * 1000;

      let response = yield api.post('member-import', formData, fileUploadConfig)
          .then(response => response.data)
          .catch(error => error.response.data)

      return response;
  }

  function* memberImportFromServer(action) {
      try {
            if(action.payload.importfile.length == 0)
            {
                yield put(requestFailure('Please import file.'));
            }
            else {
              const state1 = yield select(settings);

              action.payload.branchid = state1.userProfileDetail.defaultbranchid;
              action.payload.packtypeId = state1.clientProfileDetail.packtypeId;
                const response = yield call(memberImportRequest,action.payload);
                if(!(response.errorMessage  || response.ORAT))
                {
                    yield put(requestSuccess("Excel file imported successfully.Please check your file status below."));
                    yield  put(importMemberSuccess());
                    yield call(memberImportListFromServer);
                    yield call(getMembersFromServer);
                }
                else {
                  yield put(requestFailure(response.errorMessage));
                    yield call(memberImportListFromServer);
                }
            }
      } catch (error) {
          console.log(error);
      }
  }

  export function* importMember() {
      yield takeEvery(IMPORT_MEMBER, memberImportFromServer);
  }

  const memberImportListRequest = function* (data)
  {let response = yield  api.post('get-enquiry-bulkupload', data)
        .then(response => response.data)
        .catch(error => error.response.data )

        return response;
  }

  function* memberImportListFromServer(action) {
      try {
          const state = yield select(memberManagementReducer);
          const response = yield call(memberImportListRequest, state.tableInfoImport);

          if(!(response.errorMessage  || response.ORAT))
          {
          yield put(importMemberListSuccess({data : response[0], pages : response[1]}));
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


  export function* importMemberList() {
      yield takeEvery(IMPORT_MEMBER_LIST, memberImportListFromServer);
  }

  const saveMembershipChangeddateRequest = function* (data)
  {
      data = cloneDeep(data);
      data.membershipDetails.startdate = setLocalDate(data.membershipDetails.startdate);
      data.membershipDetails.expirydatesubscription  = setLocalDate(data.membershipDetails.expirydatesubscription );

      var formData = new FormData();
      for ( var key in data ) {
          formData.append(key, JSON.stringify(data[key]));
      }

      if(data.membershipDetails.imageFiles.length > 0)
        formData.append("files", data.membershipDetails.imageFiles[0]);

        let response = yield api.post('member-profile-edit-membershipdate', formData, fileUploadConfig)
            .then(response => response.data)
            .catch(error => error.response.data)

        return response;
  }

  function* saveMembershipChangeddateFromServer(action) {
    try {
            const response = yield call(saveMembershipChangeddateRequest,action.payload);
            if(!(response.errorMessage  || response.ORAT))
            {
                yield put(requestSuccess("Saved successfully."));
                yield  put(saveActiveMembershipChangedateSuccess());
                yield call(getMemberProfileMembershipFromServer);
            }
            else {
              yield put(requestFailure(response.errorMessage));
            }
        // }
      } catch (error) {
          console.log(error);
      }
  }

  export function* saveActiveMembershipChangedate() {
      yield takeEvery(SAVE_ACTIVEMEMBERSHIP_CHANGEDATE, saveMembershipChangeddateFromServer);
  }

  const getMemberProfileMembershipRequest = function* (data)
  {let response = yield  api.post('member-profile-membership', data)
          .then(response => response.data)
          .catch(error => error.response.data);

        return response;
  }

  function* getMemberProfileMembershipFromServer(action) {
      try {
          const state = yield select(memberManagementReducer);
          let data = action && action.payload ? action.payload : state.memberid;
          const response = yield call(getMemberProfileMembershipRequest, data);
          if(!(response.errorMessage  || response.ORAT))
          {
              yield put(getMemberProfileMembershipSuccess({data : response[0]}));
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

  export function* getMemberProfileMembership() {
      yield takeEvery(GET_MEMBERPROFILE_MEMBERSHIP, getMemberProfileMembershipFromServer);
  }




  const changeCancelPaymentStatusRequest = function* (data)
  {
    data = cloneDeep(data);
    data.paymentdetails.dueDate = setLocalDate(data.paymentdetails.dueDate);

      let response = yield api.post('change-paymentstatus', data)
          .then(response => response.data)
          .catch(error => error.response.data)

      return response;
  }
  /**
   * save Member From Server
   */
  function*  changeCancelPaymentStatusToServer(action) {
      try {
              const state = yield select(memberManagementReducer);
              const state1 = yield select(settings);

              action.payload.branchid = state1.userProfileDetail.defaultbranchid;
              const response = yield call(changeCancelPaymentStatusRequest,action.payload);

          if(!(response.errorMessage  || response.ORAT))
          {
                yield put(requestSuccess("Payment Cancelled successfully."));
                yield  put(saveCancelPaymentSuccess());
                yield call(viewMemberFromServer);
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
  export function* saveCancelPayment() {
      yield takeEvery(SAVE_CANCEL_PAYMENT, changeCancelPaymentStatusToServer);
  }

  const saveMemberStatusRequest = function* (data)
  {
    data = cloneDeep(data);
    data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
    data.member.startdate = setLocalDate(data.member.startdate);
    data.member.enddate = setLocalDate(data.member.enddate);

      let response = yield api.post('save-memberstatus', data)
          .then(response => response.data)
          .catch(error => error.response.data )

      return response;
  }
  /**
   * save member status From Server
   */
  function* saveMemberStatusFromServer(action) {
      try {
        const response = yield call(saveMemberStatusRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
              yield put(requestSuccess("Member updated successfully."));
              yield  put(saveMemberStatusSuccess());
              yield call(viewMemberFromServer);
            }
            else {
              yield put(requestFailure(response.errorMessage));
            }

        } catch (error) {
            console.log(error);
        }
        }


  /**
   * save member
   */
  export function* saveMemberStatus() {
      yield takeEvery(SAVE_MEMBER_STATUS, saveMemberStatusFromServer);
  }

  const saveMemberBalanceAdjustmentRequest = function* (data)
  {
      let response = yield api.post('save-memberbalanceadjustment', data)
          .then(response => response.data)
          .catch(error => error.response.data )

      return response;
  }
  /**
   * save member balanceadjustment From Server
   */
  function* saveMemberBalanceAdjustmentFromServer(action) {
      try {
        const state = yield select(settings);

        action.payload.member.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveMemberBalanceAdjustmentRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
              yield put(requestSuccess("Member Balance updated successfully."));
              yield  put(saveMemberBalanceAdjustmentSuccess({balanceadjustmentID : response[0][0].balanceadjustmentID,balanceadjustmentType : response[0][0].balanceadjustmentType}));
              yield call(viewMemberFromServer);
            }
            else {
              yield put(requestFailure(response.errorMessage));
            }

        } catch (error) {
            console.log(error);
        }
        }


  /**
   * save member
   */
  export function* saveMemberBalanceAdjustment() {
      yield takeEvery(SAVE_MEMBER_BALANCE_ADJUSTMENT, saveMemberBalanceAdjustmentFromServer);
  }



  const saveChangeMemberSalesbyRequest = function* (data)
  {
      let response = yield api.post('save-changemembersalesby', data)
          .then(response => response.data)
          .catch(error => error.response.data )

      return response;
  }

  function* saveChangeMemberSalesbyFromServer(action) {
      try {
        const state = yield select(settings);

        action.payload.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveChangeMemberSalesbyRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
                yield put(requestSuccess("Sales representative changed successfully."));
                yield put(saveChangeMemberSalesbySuccess());
                yield put(push('/app/members/member-management'));
                yield call(getMembersFromServer);
            }
            else {
              yield put(requestFailure(response.errorMessage));
            }

        } catch (error) {
            console.log(error);
        }
        }


  export function* saveChangeMemberSalesby() {
      yield takeEvery(SAVE_CHANGE_MEMBER_SALESBY, saveChangeMemberSalesbyFromServer);
  }


/**
 * Member Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getMembers),
        fork(saveMember),
        fork(opnViewMemberModel),
        fork(opnEditMemberModel),
        fork(deleteMember),
        fork(opnAddNewMemberModel),
        fork(importMember),
        fork(importMemberList),
        fork(saveActiveMembershipChangedate),
        fork(getMemberProfileMembership),
        fork(saveCancelPayment),
        fork(saveMemberStatus),
        fork(saveMemberBalanceAdjustment),
        fork(saveChangeMemberSalesby),
    ]);
}
