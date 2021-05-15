/**
 * Member Management Actions
 */
import {
    GET_MEMBERS,
    GET_MEMBERS_SUCCESS,

    OPEN_ADD_NEW_MEMBER_MODEL,
    OPEN_ADD_NEW_MEMBER_MODEL_SUCCESS,
    CLOSE_ADD_NEW_MEMBER_MODEL,
    SAVE_MEMBER,
    SAVE_MEMBER_SUCCESS,

    OPEN_VIEW_MEMBER_MODEL,
    OPEN_VIEW_MEMBER_MODEL_SUCCESS,
    CLOSE_VIEW_MEMBER_MODEL,

    OPEN_EDIT_MEMBER_MODEL,
    OPEN_EDIT_MEMBER_MODEL_SUCCESS,

    DELETE_MEMBER,

    IMPORT_MEMBER,
    IMPORT_MEMBER_SUCCESS,
    IMPORT_MEMBER_LIST,
    IMPORT_MEMBER_LIST_SUCCESS,

    GET_MEMBERPROFILE_MEMBERSHIP,
    GET_MEMBERPROFILE_MEMBERSHIP_SUCCESS,
    SAVE_ACTIVEMEMBERSHIP_CHANGEDATE,
    SAVE_ACTIVEMEMBERSHIP_CHANGEDATE_SUCCESS,
    OPEN_MEMBERSHIP_CHANGEDATE_MODEL,
    OPEN_MEMBERSHIP_CHANGEDATE_MODEL_SUCCESS,
    CLOSE_MEMBERSHIP_CHANGEDATE_MODEL,

    OPEN_CANCEL_PAYMENT_MODEL,
    CLOSE_CANCEL_PAYMENT_MODEL,
    SAVE_CANCEL_PAYMENT,
    SAVE_CANCEL_PAYMENT_SUCCESS,

    OPEN_EDIT_MEMBER_CHANGESTATUS_MODEL,
    CLOSE_EDIT_MEMBER_CHANGESTATUS_MODEL,

    SAVE_MEMBER_STATUS,
    SAVE_MEMBER_STATUS_SUCCESS,

    OPEN_MEMBER_BALANCE_ADJUSTMENT_MODEL,
    CLOSE_MEMBER_BALANCE_ADJUSTMENT_MODEL,

    SAVE_MEMBER_BALANCE_ADJUSTMENT,
    SAVE_MEMBER_BALANCE_ADJUSTMENT_SUCCESS,

    MEMBER_HANDLE_CHANGE_SELECT_ALL,
    MEMBER_HANDLE_SINGLE_CHECKBOX_CHANGE,
    OPEN_CHANGE_MEMBER_SALESBY_MODEL,
    CLOSE_CHANGE_MEMBER_SALESBY_MODEL,
    SAVE_CHANGE_MEMBER_SALESBY,
    SAVE_CHANGE_MEMBER_SALESBY_SUCCESS,

  } from './types';

/**
 * Redux Action Get Members
 */
export const getMembers = (data) => ({
    type: GET_MEMBERS,
    payload : data
});


/**
 * Redux Action Get Members Success
 */
export const getMembersSuccess = (response) => ({
    type: GET_MEMBERS_SUCCESS,
    payload: response
});


/**
 * Redux Action Open Model for new Member
 */
export const opnAddNewMemberModel = () => ({
    type: OPEN_ADD_NEW_MEMBER_MODEL
});

export const opnAddNewMemberModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_MEMBER_MODEL_SUCCESS,
    payload: response
});

/**
 * Redux Action close New Member Model
 */
export const clsAddNewMemberModel = () => ({
    type: CLOSE_ADD_NEW_MEMBER_MODEL
});


/**
 * Redux Action SAVE Members
 */
export const saveMember = (data) => ({
    type: SAVE_MEMBER,
    payload : data
});
/**
 * Redux Action SAVE Members SUCCESS
 */

export const saveMemberSuccess = () => ({
    type: SAVE_MEMBER_SUCCESS,
});

/**
 * Redux Action Open Model to view employee
 */
export const opnViewMemberModel = (requestData) => ({
    type: OPEN_VIEW_MEMBER_MODEL,
      payload:requestData
});
/**
 * Redux Action Get Employees Success
 */
export const viewMemberSuccess = (response) => ({
    type: OPEN_VIEW_MEMBER_MODEL_SUCCESS,
    payload: response
});


/**
 * Redux Action close View Employee Model
 */
export const clsViewMemberModel = () => ({
    type: CLOSE_VIEW_MEMBER_MODEL
});


/**
 * Redux Action Open Model to edit employee
 */
export const opnEditMemberModel = (requestData) => ({
    type: OPEN_EDIT_MEMBER_MODEL,
    payload:requestData
});
/**
 * Redux Action Get Employees Success
 */
export const editMemberSuccess = (response) => ({
    type: OPEN_EDIT_MEMBER_MODEL_SUCCESS,
    payload: response
});


/**
 * Redux Action Delete Employee
 */
export const deleteMember = (data) => ({
    type: DELETE_MEMBER,
    payload:data
});

export const importMember = (data) => ({
    type: IMPORT_MEMBER,
    payload : data
});

export const importMemberSuccess = (response) => ({
    type: IMPORT_MEMBER_SUCCESS,
    payload: response
});

export const importMemberList = (data) => ({
    type: IMPORT_MEMBER_LIST,
    payload : data
});

export const importMemberListSuccess = (response) => ({
    type: IMPORT_MEMBER_LIST_SUCCESS,
    payload: response
});

export const saveActiveMembershipChangedate = (data) => ({
    type: SAVE_ACTIVEMEMBERSHIP_CHANGEDATE,
    payload : data
});

export const saveActiveMembershipChangedateSuccess = () => ({
    type: SAVE_ACTIVEMEMBERSHIP_CHANGEDATE_SUCCESS,
});

export const getMemberProfileMembership = (data) => ({
    type: GET_MEMBERPROFILE_MEMBERSHIP,
    payload : data
});

export const getMemberProfileMembershipSuccess = (response) => ({
    type: GET_MEMBERPROFILE_MEMBERSHIP_SUCCESS,
    payload: response
});

export const opnMembershipChangedateModel = (data) => ({
    type: OPEN_MEMBERSHIP_CHANGEDATE_MODEL,
    payload : data
});

export const opnMembershipChangedateModelSuccess = (response) => ({
    type: OPEN_MEMBERSHIP_CHANGEDATE_MODEL_SUCCESS,
    payload: response
});

export const clsMembershipChangedateModel = () => ({
    type: CLOSE_MEMBERSHIP_CHANGEDATE_MODEL
});
export const opnCancelPaymentModel = (data) => ({
    type: OPEN_CANCEL_PAYMENT_MODEL,
    payload : data
});

export const clsCancelPaymentModel = () => ({
    type: CLOSE_CANCEL_PAYMENT_MODEL
});
/**
 * Redux Action SAVE Members
 */
export const saveCancelPayment = (data) => ({
    type: SAVE_CANCEL_PAYMENT,
    payload : data
});
/**
 * Redux Action SAVE Members SUCCESS
 */

export const saveCancelPaymentSuccess = () => ({
    type: SAVE_CANCEL_PAYMENT_SUCCESS,
});

/**
 * Redux Action open edit Changestatus Model
 */
export const opnEditMemberChangestatusModel = (response) => ({
    type: OPEN_EDIT_MEMBER_CHANGESTATUS_MODEL,
    payload: response
});

/**
 * Redux Action close  Changestatus Model
 */
export const clsEditMemberChangestatusModel = () => ({
    type: CLOSE_EDIT_MEMBER_CHANGESTATUS_MODEL
});

/**
 * Redux Action  SAVE MEMBER STATUS
 */
export const saveMemberStatus = (data) => ({
    type: SAVE_MEMBER_STATUS,
    payload : data
});
/**
 * Redux Action SAVE MEMBER STATUS SUCCESS
 */
export const saveMemberStatusSuccess = () => ({
    type: SAVE_MEMBER_STATUS_SUCCESS,
});

/**
 * Redux Action open BalanceAdjustment Model
 */
export const opnMemberBalanceAdjustmentModel = (response) => ({
    type: OPEN_MEMBER_BALANCE_ADJUSTMENT_MODEL,
    payload: response
});

/**
 * Redux Action close BalanceAdjustment Model
 */
export const clsMemberBalanceAdjustmentModel = () => ({
    type: CLOSE_MEMBER_BALANCE_ADJUSTMENT_MODEL
});
/**
 * Redux Action  SAVE MEMBER BalanceAdjustment
 */
export const saveMemberBalanceAdjustment = (data) => ({
    type: SAVE_MEMBER_BALANCE_ADJUSTMENT,
    payload : data
});
/**
 * Redux Action SAVE MEMBER BalanceAdjustment SUCCESS
 */
export const saveMemberBalanceAdjustmentSuccess = (data) => ({
    type: SAVE_MEMBER_BALANCE_ADJUSTMENT_SUCCESS,
    payload : data
});



export const memberHandleChangeSelectAll = (value) => ({
   type: MEMBER_HANDLE_CHANGE_SELECT_ALL,
   payload: {value }
});

export const memberHandleSingleCheckboxChange = (value,data, id) => ({
   type: MEMBER_HANDLE_SINGLE_CHECKBOX_CHANGE,
   payload: {value, data, id }
});


export const opnChangeMemberSalesbyModel = (data) => ({
  type: OPEN_CHANGE_MEMBER_SALESBY_MODEL,
  payload : data
});

export const clsChangeMemberSalesbyModel = () => ({
    type: CLOSE_CHANGE_MEMBER_SALESBY_MODEL,
});

export const saveChangeMemberSalesby = (data) => ({
    type: SAVE_CHANGE_MEMBER_SALESBY,
    payload : data
});

export const saveChangeMemberSalesbySuccess = () => ({
    type: SAVE_CHANGE_MEMBER_SALESBY_SUCCESS,
});
