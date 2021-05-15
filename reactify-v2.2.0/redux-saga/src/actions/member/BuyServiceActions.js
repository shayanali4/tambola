import {
  MEMBER_GET_SERVICE_HIT_DETAIL,
  MEMBER_GET_SERVICE_HIT_DETAIL_SUCCESS,
  MEMBER_ON_DELETE_ITEM_FROM_CART,
  MEMBER_ON_ADD_ITEM_TO_CART,
  MEMBER_ON_DATE_CHANGE,
  MEMBER_CART_EMPTY,
  SAVE_MEMBER_SUBSCRIPTION_DETAILS,
  SAVE_MEMBER_SUBSCRIPTION_DETAILS_SUCCESS,
  MEMBER_CHECKFOR_ACTIVE_CLASS,
  MEMBER_CHECKFOR_ACTIVE_CLASS_SUCCESS,
  CLOSE_MEMBER_BUYSERVICE_REDIRECT_CONFIRMATIONDIALOG,
  SAVE_MEMBER_CLASS_BOOKING,
  SAVE_MEMBER_CLASS_BOOKING_SUCCESS,
  CLOSE_MEMBER_CLASS_BOOKING_DIALOG,
  MEMBER_DELETE_CLASS_BOOKED,
  MEMBER_DELETE_CLASS_BOOKED_SUCCESS,
} from '../types';


export const membergetServiceHitDetail = (requestData) => ({
    type: MEMBER_GET_SERVICE_HIT_DETAIL,
    payload : requestData
});

export const membergetServiceHitDetailSuccess = (response) => ({
    type: MEMBER_GET_SERVICE_HIT_DETAIL_SUCCESS,
    payload: response
});


export const memberDeleteItemFromCart = (item) => ({
   type: MEMBER_ON_DELETE_ITEM_FROM_CART,
   payload: item
})

export const memberOnAddItemToCart = (hitItem) => ({
   type: MEMBER_ON_ADD_ITEM_TO_CART,
   payload: hitItem
})

export const memberOnChangeServiceDate = (date, cartItem) => ({
   type: MEMBER_ON_DATE_CHANGE,
   payload: { date, cartItem }
})

export const  memberCartempty = () => ({
   type: MEMBER_CART_EMPTY,
});
export const saveMemberSubscriptionDetails = (data) => ({
    type: SAVE_MEMBER_SUBSCRIPTION_DETAILS,
    payload : data
});
/**
 * Redux Action SAVE Members SUCCESS
 */
 export const saveMemberSubscriptionDetailsSuccess = (data) => ({
     type: SAVE_MEMBER_SUBSCRIPTION_DETAILS_SUCCESS,
     payload : data
 });


 export const memberCheckForActiveClass = (requestData) => ({
     type: MEMBER_CHECKFOR_ACTIVE_CLASS,
     payload : requestData
 });

 export const memberCheckForActiveClassSuccess = (response) => ({
     type: MEMBER_CHECKFOR_ACTIVE_CLASS_SUCCESS,
     payload: response
 });


 export const  closeMemberBuyServiceRedirectConfirmationDialog = () => ({
    type: CLOSE_MEMBER_BUYSERVICE_REDIRECT_CONFIRMATIONDIALOG,
 });


 export const saveMemberClassBooking = (data) => ({
     type: SAVE_MEMBER_CLASS_BOOKING,
     payload : data
 });

  export const saveMemberClassBookingSuccess = (data) => ({
      type: SAVE_MEMBER_CLASS_BOOKING_SUCCESS,
      payload : data
  });

  export const  closeMemberClassBookingDialog = () => ({
     type: CLOSE_MEMBER_CLASS_BOOKING_DIALOG,
  });


  export const memberDeleteClassBooked = (data) => ({
      type: MEMBER_DELETE_CLASS_BOOKED,
      payload:data
  });

  export const memberDeleteClassBookedSuccess = () => ({
      type: MEMBER_DELETE_CLASS_BOOKED_SUCCESS,
  });
