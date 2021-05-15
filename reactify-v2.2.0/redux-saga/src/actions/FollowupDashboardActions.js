
import {
    GET_FOLLOWUPDASHBOARD_ONTRIALENQUIRIES,
    GET_FOLLOWUPDASHBOARD_ONTRIALENQUIRIES_SUCCESS,

    GET_FOLLOWUPDASHBOARD_RECENTENQUIRIES,
    GET_FOLLOWUPDASHBOARD_RECENTENQUIRIES_SUCCESS,

    GET_FOLLOWUPDASHBOARD_RECENTEXPIREDMEMBER,
    GET_FOLLOWUPDASHBOARD_RECENTEXPIREDMEMBER_SUCCESS,

    GET_FOLLOWUPDASHBOARD_MEMBERSHIPTOBEEXPIRED,
    GET_FOLLOWUPDASHBOARD_MEMBERSHIPTOBEEXPIRED_SUCCESS,

    GET_FOLLOWUPDASHBOARD_PAYMENTDUES,
    GET_FOLLOWUPDASHBOARD_PAYMENTDUES_SUCCESS,

    GET_FOLLOWUPDASHBOARD_RECENTPTEXPIRED,
    GET_FOLLOWUPDASHBOARD_RECENTPTEXPIRED_SUCCESS,

    GET_FOLLOWUPDASHBOARD_PTTOBEEXPIRED,
    GET_FOLLOWUPDASHBOARD_PTTOBEEXPIRED_SUCCESS,

    GET_FOLLOWUPDASHBOARD_MISSEDENQUIRYFOLLOWUP,
    GET_FOLLOWUPDASHBOARD_MISSEDENQUIRYFOLLOWUP_SUCCESS,

    GET_FOLLOWUPDASHBOARD_MISSEDMEMBERFOLLOWUP,
    GET_FOLLOWUPDASHBOARD_MISSEDMEMBERFOLLOWUP_SUCCESS,

    GET_MASTERDASHBOARD_TODAYENQUIRYREMINDER,
    GET_MASTERDASHBOARD_TODAYENQUIRYREMINDER_SUCCESS,

    GET_MASTERDASHBOARD_TODAYMEMBERREMINDER,
    GET_MASTERDASHBOARD_TODAYMEMBERREMINDER_SUCCESS,

    GET_FOLLOWUPDASHBOARD_RECENTMEMBER,
    GET_FOLLOWUPDASHBOARD_RECENTMEMBER_SUCCESS,

    GET_FOLLOWUPDASHBOARD_TODAY_BIRTHDAY,
    GET_FOLLOWUPDASHBOARD_TODAY_BIRTHDAY_SUCCESS,

    GET_FOLLOWUPDASHBOARD_TODAY_ANNIVERSARY,
    GET_FOLLOWUPDASHBOARD_TODAY_ANNIVERSARY_SUCCESS,

  } from './types';


export const getFollowupDashboardOntrialEnquiries = (data) => ({
    type: GET_FOLLOWUPDASHBOARD_ONTRIALENQUIRIES,
    payload : data
});

export const getFollowupDashboardOntrialEnquiriesSuccess = (response) => ({
    type: GET_FOLLOWUPDASHBOARD_ONTRIALENQUIRIES_SUCCESS,
    payload: response
});


export const getFollowupDashboardRecentEnquiries = (data) => ({
    type: GET_FOLLOWUPDASHBOARD_RECENTENQUIRIES,
    payload : data
});

export const getFollowupDashboardRecentEnquiriesSuccess = (response) => ({
    type: GET_FOLLOWUPDASHBOARD_RECENTENQUIRIES_SUCCESS,
    payload: response
});



export const getFollowupDashboardRecentExpiredMember = (data) => ({
    type: GET_FOLLOWUPDASHBOARD_RECENTEXPIREDMEMBER,
    payload : data
});

export const getFollowupDashboardRecentExpiredMemberSuccess = (response) => ({
    type: GET_FOLLOWUPDASHBOARD_RECENTEXPIREDMEMBER_SUCCESS,
    payload: response
});



export const getFollowupDashboardMembershiptobeExpired = (data) => ({
    type: GET_FOLLOWUPDASHBOARD_MEMBERSHIPTOBEEXPIRED,
    payload : data
});

export const getFollowupDashboardMembershiptobeExpiredSuccess = (response) => ({
    type: GET_FOLLOWUPDASHBOARD_MEMBERSHIPTOBEEXPIRED_SUCCESS,
    payload: response
});



export const getFollowupDashboardPaymentDues = (data) => ({
    type: GET_FOLLOWUPDASHBOARD_PAYMENTDUES,
    payload : data
});

export const getFollowupDashboardPaymentDuesSuccess = (response) => ({
    type: GET_FOLLOWUPDASHBOARD_PAYMENTDUES_SUCCESS,
    payload: response
});



export const getFollowupDashboardRecentPTExpired = (data) => ({
    type: GET_FOLLOWUPDASHBOARD_RECENTPTEXPIRED,
    payload : data
});

export const getFollowupDashboardRecentPTExpiredSuccess = (response) => ({
    type: GET_FOLLOWUPDASHBOARD_RECENTPTEXPIRED_SUCCESS,
    payload: response
});



export const getFollowupDashboardPTTobeExpired = (data) => ({
    type: GET_FOLLOWUPDASHBOARD_PTTOBEEXPIRED,
    payload : data
});

export const getFollowupDashboardPTTobeExpiredSuccess = (response) => ({
    type: GET_FOLLOWUPDASHBOARD_PTTOBEEXPIRED_SUCCESS,
    payload: response
});



export const getFollowupDashboardMissedEnquiryFollowup = (data) => ({
    type: GET_FOLLOWUPDASHBOARD_MISSEDENQUIRYFOLLOWUP,
    payload : data
});

export const getFollowupDashboardMissedEnquiryFollowupSuccess = (response) => ({
    type: GET_FOLLOWUPDASHBOARD_MISSEDENQUIRYFOLLOWUP_SUCCESS,
    payload: response
});



export const getFollowupDashboardMissedMemberFollowup = (data) => ({
    type: GET_FOLLOWUPDASHBOARD_MISSEDMEMBERFOLLOWUP,
    payload : data
});

export const getFollowupDashboardMissedMemberFollowupSuccess = (response) => ({
    type: GET_FOLLOWUPDASHBOARD_MISSEDMEMBERFOLLOWUP_SUCCESS,
    payload: response
});


export const getMasterDashboardTodayEnquiryReminder = (data) => ({
    type: GET_MASTERDASHBOARD_TODAYENQUIRYREMINDER,
    payload : data
});

export const getMasterDashboardTodayEnquiryReminderSuccess = (response) => ({
    type: GET_MASTERDASHBOARD_TODAYENQUIRYREMINDER_SUCCESS,
    payload: response
});


export const getMasterDashboardTodayMemberReminder = (data) => ({
    type: GET_MASTERDASHBOARD_TODAYMEMBERREMINDER,
    payload : data
});

export const getMasterDashboardTodayMemberReminderSuccess = (response) => ({
    type: GET_MASTERDASHBOARD_TODAYMEMBERREMINDER_SUCCESS,
    payload: response
});



export const getFollowupDashboardRecentMember = (data) => ({
    type: GET_FOLLOWUPDASHBOARD_RECENTMEMBER,
    payload : data
});

export const getFollowupDashboardRecentMemberSuccess = (response) => ({
    type: GET_FOLLOWUPDASHBOARD_RECENTMEMBER_SUCCESS,
    payload: response
});


export const getFollowupDashboardTodayBirthday = (data) => ({
    type: GET_FOLLOWUPDASHBOARD_TODAY_BIRTHDAY,
    payload : data
});

export const getFollowupDashboardTodayBirthdaySuccess = (response) => ({
    type: GET_FOLLOWUPDASHBOARD_TODAY_BIRTHDAY_SUCCESS,
    payload: response
});


export const getFollowupDashboardTodayAnniversary = (data) => ({
    type: GET_FOLLOWUPDASHBOARD_TODAY_ANNIVERSARY,
    payload : data
});

export const getFollowupDashboardTodayAnniversarySuccess = (response) => ({
    type: GET_FOLLOWUPDASHBOARD_TODAY_ANNIVERSARY_SUCCESS,
    payload: response
});
