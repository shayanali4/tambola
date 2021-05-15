/**
 * Redux App Settings Actions
 */
import {
    COLLAPSED_SIDEBAR,
    DARK_MODE,
    LIGHT_MODE,
    BOXED_LAYOUT,
    RTL_LAYOUT,
    TOGGLE_MENU,
    MINI_SIDEBAR,
    SEARCH_FORM_ENABLE,
    CHANGE_THEME_COLOR,
    TOGGLE_SIDEBAR_IMAGE,
    SET_SIDEBAR_IMAGE,
    SET_LANGUAGE,
    START_USER_TOUR,
    STOP_USER_TOUR,
    TOGGLE_DARK_SIDENAV,
  	GET_SESSIONTYPE_LIST,
	  GET_SESSIONTYPE_LIST_SUCCESS,
    GET_USER_PROFILE,
    GET_USER_PROFILE_SUCCESS,
    GET_CLIENT_PROFILE,
    GET_CLIENT_PROFILE_SUCCESS,
    SAVE_CLIENT_PROFILE,
    SAVE_CLIENT_PROFILE_SUCCESS,
    SAVE_CHANGE_PASSWORD,
    SAVE_CHANGE_PASSWORD_SUCCESS,
    SAVE_USER_THEME,
    SAVE_USER_THEME_SUCCESS,
    SET_USER_THEME,
    SAVE_CONFIGURATION,
    SAVE_CONFIGURATION_SUCCESS,
    VIEW_CONFIGURATION_DETAIL,
    VIEW_CONFIGURATION_DETAIL_SUCCESS,
    SAVE_CLIENT_SOCIALMEDIA,

    SAVE_PAYMENTGATEWAY_CONFIGURATION,
    SAVE_PAYMENTGATEWAY_CONFIGURATION_SUCCESS,

    OPEN_MEMBER_UNIT_MODEL,
    CLOSE_MEMBER_UNIT_MODEL,
    CHANGE_WEIGHT_UNIT,
    CHANGE_DISTANCE_UNIT,
    CHANGE_LENGTH_UNIT,
    CHANGE_TEMPERATURE_UNIT,
    SAVE_MEMBER_UNIT,
    SAVE_USER_UNIT ,

    OPEN_ADD_NEW_TAX_MODEL,
    OPEN_ADD_NEW_TAX_MODEL_SUCCESS,
    CLOSE_ADD_NEW_TAX_MODEL,

    SAVE_CLIENT_TAX,
    SAVE_CLIENT_TAX_SUCCESS,

    GET_CLIENT_TAX,
    GET_CLIENT_TAX_SUCCESS,

    SAVE_CLIENT_TAX_CONFIGURATION,

    OPEN_VIEW_CLIENT_TAX_MODEL,
    OPEN_VIEW_CLIENT_TAX_MODEL_SUCCESS,
    CLOSE_VIEW_CLIENT_TAX_MODEL,

    DELETE_CLIENT_TAX,

    OPEN_ADD_NEW_TAX_CODE_CATEGORY_MODEL,
    OPEN_ADD_NEW_TAX_CODE_CATEGORY_MODEL_SUCCESS,
    CLOSE_ADD_NEW_TAX_CODE_CATEGORY_MODEL,

    SAVE_TAX_CODE_CATEGORY,
    SAVE_TAX_CODE_CATEGORY_SUCCESS,

    GET_TAX_CODE_CATEGORY,
    GET_TAX_CODE_CATEGORY_SUCCESS,

    OPEN_VIEW_TAX_CODE_CATEGORY_MODEL,
    OPEN_VIEW_TAX_CODE_CATEGORY_MODEL_SUCCESS,
    CLOSE_VIEW_TAX_CODE_CATEGORY_MODEL,

    DELETE_TAX_CODE_CATEGORY,

    SAVE_CLIENT_BIOMETRIC_CONFIGURATION,

    OPEN_ADD_NEW_BIOMETRIC_MODEL,
    CLOSE_ADD_NEW_BIOMETRIC_MODEL,

    SAVE_CLIENT_BIOMETRIC,
    SAVE_CLIENT_BIOMETRIC_SUCCESS,

    GET_CLIENT_BIOMETRIC,
    GET_CLIENT_BIOMETRIC_SUCCESS,

    OPEN_VIEW_CLIENT_BIOMETRIC_MODEL,
    OPEN_VIEW_CLIENT_BIOMETRIC_MODEL_SUCCESS,
    CLOSE_VIEW_CLIENT_BIOMETRIC_MODEL,

    ON_CANCEL_ADVANCEBOOKINGOFMEMBER,

    SAVE_PAYMENTGATEWAY_CONFIGURATION_STATUS,
    SAVE_PAYMENTGATEWAY_CONFIGURATION_STATUS_SUCCESS,

    GET_BRANCH_PROFILE,
    GET_BRANCH_PROFILE_SUCCESS

} from './types';

/**
 * Redux Action To Emit Collapse Sidebar
 * @param {*boolean} isCollapsed
 */
export const collapsedSidebarAction = (isCollapsed) => ({
    type: COLLAPSED_SIDEBAR,
    isCollapsed
});

/**
 * Redux Action To Start User Tour
 */
export const startUserTour = () => ({
    type: START_USER_TOUR
});

/**
 * Redux Action To Stop User Tour
 */
export const stopUserTour = () => ({
    type: STOP_USER_TOUR
});

/**
 * Redux Action To Emit Dark Mode
 * @param {*boolean} isDarkMode
 */
export const darkModeAction = (isDarkMode) => ({
    type: DARK_MODE,
    payload: isDarkMode
});

/**
 * Redux Action To Emit lIGHT Mode
 * @param {*boolean} isLightMode
 */
export const lightModeAction = (isLightMode) => ({
    type: LIGHT_MODE,
    payload: isLightMode
});


/**
 * Redux Action To Emit Boxed Layout
 * @param {*boolean} isBoxLayout
 */
export const boxLayoutAction = (isBoxLayout) => ({
    type: BOXED_LAYOUT,
    payload: isBoxLayout
});

/**
 * Redux Action To Emit Rtl Layout
 *  @param {*boolean} isRtlLayout
 */
export const rtlLayoutAction = (isRtlLayout) => ({
    type: RTL_LAYOUT,
    payload: isRtlLayout
});

/**
 * Redux Action To Toggle Sidebar Menus
 */
export const onToggleMenu = (selectedMenu) => ({
    type: TOGGLE_MENU,
    payload: selectedMenu
});

/**
 * Redux Action To Emit Mini Sidebar
 */
export const miniSidebarAction = (isMiniSidebar) => ({
    type: MINI_SIDEBAR,
    payload: isMiniSidebar
});

/**
 * Redux Action To Enable/Disable The Search Form
 */
export const toggleSearchForm = () => ({
    type: SEARCH_FORM_ENABLE
});

/**
 * Reduc Action To Change Theme Colors
 */
export const changeThemeColor = (theme) => ({
    type: CHANGE_THEME_COLOR,
    payload: theme
});

/**
 * Redux Action To Enable/Disable Sidebar Background Image
 */
export const toggleSidebarImage = () => ({
    type: TOGGLE_SIDEBAR_IMAGE
});

/**
 * Redux Action To Set Sidebar Background Image
 */
export const setSidebarBgImageAction = (sidebarImage) => ({
    type: SET_SIDEBAR_IMAGE,
    payload: sidebarImage
});

/**
 * Redux Action To Set Language
 */
export const setLanguage = (language) => ({
    type: SET_LANGUAGE,
    payload: language
});

/**
 * Redux Action To Toggle Dark Sidenav
 */
export const toggleDarkSidebar = () => ({
    type: TOGGLE_DARK_SIDENAV
})


export const getSessionTypeList = () => ({
    type: GET_SESSIONTYPE_LIST
});


export const getSessionTypeListSuccess = (response) => ({
    type: GET_SESSIONTYPE_LIST_SUCCESS,
    payload:response
});


export const getUserProfile = (requestData) => ({
    type: GET_USER_PROFILE,
    payload:requestData
});


export const getUserProfileSuccess = (response) => ({
    type: GET_USER_PROFILE_SUCCESS,
    payload:response
});

export const getClientProfile = (requestData) => ({
    type: GET_CLIENT_PROFILE,
    payload:requestData
});


export const getClientProfileSuccess = (response) => ({
    type: GET_CLIENT_PROFILE_SUCCESS,
    payload:response
});

export const getBranchProfile = (requestData) => ({
    type: GET_BRANCH_PROFILE,
    payload:requestData
});


export const getBranchProfileSuccess = (response) => ({
    type: GET_BRANCH_PROFILE_SUCCESS,
    payload:response
});


export const saveClientProfile = (data) => ({
    type: SAVE_CLIENT_PROFILE,
    payload : data
});
/**
 * Redux Action SAVE client profile SUCCESS
 */
export const saveClientProfileSuccess = () => ({
    type: SAVE_CLIENT_PROFILE_SUCCESS,
});
/**
 * Redux Action SAVE change password
 */

export const saveChangePassword = (data) => ({
    type: SAVE_CHANGE_PASSWORD,
    payload : data
});
/**
 * Redux Action SAVE change password
 */
export const saveChagePasswordSuccess = () => ({
    type: SAVE_CHANGE_PASSWORD_SUCCESS,
});

export const saveUserTheme = (data) => ({
    type: SAVE_USER_THEME,
    payload : data
});
export const saveUserThemeSuccess = () => ({
    type: SAVE_USER_THEME_SUCCESS,
});

export const setUserTheme = (data) => ({
    type: SET_USER_THEME,
    payload : data
});
export const saveConfiguration = (data) => ({
    type: SAVE_CONFIGURATION,
    payload : data
});
/**
 * Redux Action SAVE client profile SUCCESS
 */
export const saveConfigurationSuccess = () => ({
    type: SAVE_CONFIGURATION_SUCCESS,
});
export const viewconfigrationdetail = (requestData) => ({
    type: VIEW_CONFIGURATION_DETAIL,
    payload:requestData
});

export const viewconfigrationdetailSuccess = (response) => ({
    type: VIEW_CONFIGURATION_DETAIL_SUCCESS,
    payload: response
});

export const savePaymentGatewayConfiguration = (data) => ({
    type: SAVE_PAYMENTGATEWAY_CONFIGURATION,
    payload : data
});
/**
 * Redux Action SAVE client profile SUCCESS
 */
export const savePaymentGatewayConfigurationSuccess = () => ({
    type: SAVE_PAYMENTGATEWAY_CONFIGURATION_SUCCESS,
});


export const saveClientSocialMedia = (data) => ({
    type: SAVE_CLIENT_SOCIALMEDIA,
    payload : data
});

export const opnMemberUnitModel = (data) => ({
    type: OPEN_MEMBER_UNIT_MODEL,
    payload : data
});

export const clsMemberUnitModel = () => ({
    type: CLOSE_MEMBER_UNIT_MODEL
});
export const changeWeightUnit = (data) => ({
    type: CHANGE_WEIGHT_UNIT,
    payload : data
});
export const changeDistanceUnit = (data) => ({
    type: CHANGE_DISTANCE_UNIT,
    payload : data
});
export const changeLengthUnit = (data) => ({
    type: CHANGE_LENGTH_UNIT,
    payload : data
});
export const changeTemperatureUnit = (data) => ({
    type: CHANGE_TEMPERATURE_UNIT,
    payload : data
});
export const saveMemberUnit = (data) => ({
    type: SAVE_MEMBER_UNIT,
    payload : data
});
export const saveUserUnit = (data) => ({
    type: SAVE_USER_UNIT,
    payload : data
});
/**
 * Redux Action OPEN ADD NEW TAX Model
 */
export const opnAddNewTaxModel = (data) => ({
  type: OPEN_ADD_NEW_TAX_MODEL,
  payload : data
});
/**
 * Redux Action Open Model for new branch
 */
export const opnAddNewTaxModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_TAX_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close ADD NEW TAX Model Success
 */
export const clsAddNewTaxModel = () => ({
    type: CLOSE_ADD_NEW_TAX_MODEL,
});
/**
 * Redux Action SAVE CLIENT
 */
export const saveClientTax = (data) => ({
    type: SAVE_CLIENT_TAX,
    payload : data
});
/**
 * Redux Action SAVE CLIENT SUCCESS
 */
export const saveClientTaxSuccess = () => ({
    type: SAVE_CLIENT_TAX_SUCCESS,
});

export const getClientTax = (requestData) => ({
    type: GET_CLIENT_TAX,
    payload:requestData
});


export const getClientTaxSuccess = (response) => ({
    type: GET_CLIENT_TAX_SUCCESS,
    payload:response
});
export const saveClientTaxConfiguration = (data) => ({
    type: SAVE_CLIENT_TAX_CONFIGURATION,
    payload : data
});
/**
 * Redux Action Open Model to VIEW TAX
 */
export const opnViewClientTaxModel = (requestData) => ({
    type: OPEN_VIEW_CLIENT_TAX_MODEL,
    payload:requestData
});
/**
 * Redux Action View tax Success
 */
export const viewClientTaxSuccess = (response) => ({
    type: OPEN_VIEW_CLIENT_TAX_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close ADD NEW TAX Model Success
 */
export const clsViewClientTaxModel = () => ({
    type: CLOSE_VIEW_CLIENT_TAX_MODEL,
});
/**
 * Redux Action Delete tax
 */
export const deleteClientTax = (data) => ({
    type: DELETE_CLIENT_TAX,
    payload:data
});
/**
 * Redux Action OPEN ADD NEW TAX Model
 */
export const opnAddNewTaxCodeCategoryModel = (data) => ({
  type: OPEN_ADD_NEW_TAX_CODE_CATEGORY_MODEL,
  payload : data
});
/**
 * Redux Action Open Model for new branch
 */
export const opnAddNewTaxCodeCategoryModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_TAX_CODE_CATEGORY_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close ADD NEW TAX Model Success
 */
export const clsAddNewTaxCodeCategoryModel = () => ({
    type: CLOSE_ADD_NEW_TAX_CODE_CATEGORY_MODEL,
});
/**
 * Redux Action SAVE CLIENT
 */
export const saveTaxCodecategory = (data) => ({
    type: SAVE_TAX_CODE_CATEGORY,
    payload : data
});
/**
 * Redux Action SAVE CLIENT SUCCESS
 */
export const saveTaxCodecategorySuccess = () => ({
    type: SAVE_TAX_CODE_CATEGORY_SUCCESS,
});
export const getTaxCodeCategory = (requestData) => ({
    type: GET_TAX_CODE_CATEGORY,
    payload:requestData
});


export const getTaxCodeCategorySuccess = (response) => ({
    type: GET_TAX_CODE_CATEGORY_SUCCESS,
    payload:response
});
/**
 * Redux Action Open Model to VIEW TAX code CATEGORY
 */
export const opnViewTaxCodeCategoryModel = (requestData) => ({
    type: OPEN_VIEW_TAX_CODE_CATEGORY_MODEL,
    payload:requestData
});
/**
 * Redux Action View tax code CATEGORY SUCCESS
 */
export const viewTaxCodeCategoryModelSuccess = (response) => ({
    type: OPEN_VIEW_TAX_CODE_CATEGORY_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close view tax code category model SUCCESS
 */
export const clsViewTaxCodeCategoryModel = () => ({
    type: CLOSE_VIEW_TAX_CODE_CATEGORY_MODEL,
});
/**
 * Redux Action Delete tax
 */
export const deletTaxCodeCategory = (data) => ({
    type: DELETE_TAX_CODE_CATEGORY,
    payload:data
});
export const saveClientBiometricConfiguration = (data) => ({
    type: SAVE_CLIENT_BIOMETRIC_CONFIGURATION,
    payload : data
});


/**
 * Redux Action OPEN ADD NEW Biometric Model
 */
export const opnAddNewBiometricModel = (data) => ({
  type: OPEN_ADD_NEW_BIOMETRIC_MODEL,
  payload : data
});
/**
 * Redux Action close ADD NEW TAX Model Success
 */
export const clsAddNewBiometricModel = () => ({
    type: CLOSE_ADD_NEW_BIOMETRIC_MODEL,
});

/**
 * Redux Action SAVE CLIENT
 */
export const saveClientBiometric = (data) => ({
    type: SAVE_CLIENT_BIOMETRIC,
    payload : data
});
/**
 * Redux Action SAVE CLIENT SUCCESS
 */
export const saveClientBiometricSuccess = () => ({
    type: SAVE_CLIENT_BIOMETRIC_SUCCESS,
});
export const getClientBiometric = (requestData) => ({
    type: GET_CLIENT_BIOMETRIC,
    payload:requestData
});


export const getClientBiometricSuccess = (response) => ({
    type: GET_CLIENT_BIOMETRIC_SUCCESS,
    payload:response
});


/**
 * Redux Action Open Model to VIEW biometric
 */
export const opnViewClientBiometricModel = (requestData) => ({
    type: OPEN_VIEW_CLIENT_BIOMETRIC_MODEL,
    payload:requestData
});
/**
 * Redux Action View biometric Success
 */
export const viewClientBiometricSuccess = (response) => ({
    type: OPEN_VIEW_CLIENT_BIOMETRIC_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close ADD NEW biometric Model Success
 */
export const clsViewClientBiometricModel = () => ({
    type: CLOSE_VIEW_CLIENT_BIOMETRIC_MODEL,
});

export const onCancelAdvanceBookingofMember = (data) => ({
    type: ON_CANCEL_ADVANCEBOOKINGOFMEMBER,
    payload : data
});
/**
 * Redux Action SAVE PAYMENT GATEWAY Configuration
 */
export const savePaymentGatewayConfigurationStatus = (data) => ({
    type: SAVE_PAYMENTGATEWAY_CONFIGURATION_STATUS,
    payload : data
});
/**
 * Redux Action SAVE PAYMENT GATEWAY Configuration SUCCESS
 */
export const savePaymentGatewayConfigurationStatusSuccess = () => ({
    type: SAVE_PAYMENTGATEWAY_CONFIGURATION_STATUS_SUCCESS,
});
