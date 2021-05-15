import {
   ON_DELETE_ITEM_FROM_CART,
   ON_QUANTITY_CHANGE,
   ON_ADD_ITEM_TO_CART,
   ON_EMPLOYEELIST,
   ON_EMPLOYEELIST_SUCCESS,
   ON_EMPLOYEE_CHANGE,
   GET_SERVICE_HIT_DETAIL,
   GET_SERVICE_HIT_DETAIL_SUCCESS,
   ON_DATE_CHANGE,
   GET_MEMBER_DETAILS,
   GET_MEMBER_DETAILS_SUCCESS,
   SAVE_MEMBER_DETAIL,
   GET_ENQUIRY_DETAILS,
   GET_ENQUIRY_DETAILS_SUCCESS,
   SAVE_SUBSCRIPTION_DETAILS,
   SAVE_SUBSCRIPTION_DETAILS_SUCCESS,
   SAVE_INSTALLMENT_DETAIL,
   GET_PRODUCT_HIT_DETAIL,
   GET_PRODUCT_HIT_DETAIL_SUCCESS,
   GET_PACKAGE_HIT_DETAIL,
 	 GET_PACKAGE_HIT_DETAIL_SUCCESS,
   ON_DISCOUNT_CHANGE,
   ON_CLASS_CHANGE,
   CART_EMPTY,
   ON_TOTALPROCE_CHANGE,
   ON_CLOSE_CHANGESALE_TRANSFER,
   ON_ASSIGNTRAINER_CHANGE,
   ON_COMPLEMENTCATEGORY_CHANGE,
   
   GET_UNFINISHEDCART_LIST,
   GET_UNFINISHEDCART_LIST_SUCCESS,
   DELETE_UNFINISHEDCART,
   OPEN_UNFINISHEDCART_IN_EXPRESSSALE,
} from './types';

export const deleteItemFromCart = (item) => ({
   type: ON_DELETE_ITEM_FROM_CART,
   payload: item
})

export const onChangeProductQuantity = (quantity, cartItem) => ({
   type: ON_QUANTITY_CHANGE,
   payload: { quantity, cartItem }
})

export const onAddItemToCart = (hitItem) => ({
   type: ON_ADD_ITEM_TO_CART,
   payload: hitItem
})

export const onChangeEmployee = (employee, cartItem) => ({
   type: ON_EMPLOYEE_CHANGE,
   payload: { employee, cartItem }
})
export const getServiceHitDetail = (requestData) => ({
    type: GET_SERVICE_HIT_DETAIL,
    payload : requestData
});
/**
 * Redux Action Get services Success
 */
export const getServiceHitDetailSuccess = (response) => ({
    type: GET_SERVICE_HIT_DETAIL_SUCCESS,
    payload: response
});

export const onChangeServiceDate = (date, cartItem) => ({
   type: ON_DATE_CHANGE,
   payload: { date, cartItem }
})


export const getMemberDetail = (requestData) => ({
    type: GET_MEMBER_DETAILS,
    payload : requestData
});
/**
 * Redux Action Get services Success
 */
export const getMemberDetailSuccess = (response) => ({
    type: GET_MEMBER_DETAILS_SUCCESS,
    payload: response
});

export const saveMemberDetail = (requestData) => ({
    type: SAVE_MEMBER_DETAIL,
    payload : requestData
});



export const getEnquiryDetail = (requestData) => ({
    type: GET_ENQUIRY_DETAILS,
    payload : requestData
});
/**
 * Redux Action Get services Success
 */
export const getEnquiryDetailSuccess = (response) => ({
    type: GET_ENQUIRY_DETAILS_SUCCESS,
    payload: response
});

export const saveSubscriptionDetails = (data) => ({
    type: SAVE_SUBSCRIPTION_DETAILS,
    payload : data
});
/**
 * Redux Action SAVE Members SUCCESS
 */
 export const saveSubscriptionDetailsSuccess = (data) => ({
     type: SAVE_SUBSCRIPTION_DETAILS_SUCCESS,
     payload : data
 });

export const saveInstallmentDetail = (requestData) => ({
    type: SAVE_INSTALLMENT_DETAIL,
    payload : requestData
});

export const getProductHitDetail = (requestData) => ({
    type: GET_PRODUCT_HIT_DETAIL,
    payload : requestData
});
/**
 * Redux Action Get services Success
 */
export const getProductHitDetailSuccess = (response) => ({
    type: GET_PRODUCT_HIT_DETAIL_SUCCESS,
    payload: response
});
export const getPackageHitDetail = (requestData) => ({
    type: GET_PACKAGE_HIT_DETAIL,
    payload : requestData
});
/**
 * Redux Action Get services Success
 */
export const getPackageHitDetailSuccess = (response) => ({
    type: GET_PACKAGE_HIT_DETAIL_SUCCESS,
    payload: response
});
export const onEmployeeList = (hitItem) => ({
   type: ON_EMPLOYEELIST,
   payload: hitItem
})
/**
 * Redux Action Get services Success
 */
export const onEmployeeListSuccess = (response) => ({
    type: ON_EMPLOYEELIST_SUCCESS,
    payload: response
});
export const onDiscountChange = (key,discount, cartItem) => ({
   type: ON_DISCOUNT_CHANGE,
   payload: { key,discount, cartItem }
});
export const onTotalPriceChange = (key,value, cartItem) => ({
   type: ON_TOTALPROCE_CHANGE,
   payload: { key,value, cartItem }
});



export const  cartempty = () => ({
   type: CART_EMPTY,
})

export const onCloseChangeSaleTransfer = (requestData) => ({
    type: ON_CLOSE_CHANGESALE_TRANSFER,
    payload : requestData
});

export const onAssignTrainerChange = (assigntrainerid, cartItem) => ({
   type: ON_ASSIGNTRAINER_CHANGE,
   payload: { assigntrainerid, cartItem }
});

export const onComplementCategoryChange = (complementcategory, cartItem) => ({
   type: ON_COMPLEMENTCATEGORY_CHANGE,
   payload: { complementcategory, cartItem }
});




export const getUnfinishedCartList = (requestData) => ({
    type: GET_UNFINISHEDCART_LIST,
    payload : requestData
});

export const getUnfinishedCartListSuccess = (response) => ({
    type: GET_UNFINISHEDCART_LIST_SUCCESS,
    payload: response
});

export const deleteUnfinishedCart = (requestData) => ({
    type: DELETE_UNFINISHEDCART,
    payload : requestData
});

export const opnUnfinishedCartInExpresssale = (requestData) => ({
    type: OPEN_UNFINISHEDCART_IN_EXPRESSSALE,
    payload : requestData
});