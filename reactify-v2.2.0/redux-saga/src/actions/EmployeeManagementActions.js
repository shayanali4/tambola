/**
 * Employee Management Actions
 */
import {
    GET_EMPLOYEES,
    GET_EMPLOYEES_SUCCESS,

    OPEN_ADD_NEW_EMPLOYEE_MODEL,
    OPEN_ADD_NEW_EMPLOYEE_MODEL_SUCCESS,
    CLOSE_ADD_NEW_EMPLOYEE_MODEL,

    OPEN_EDIT_EMPLOYEE_MODEL,
    OPEN_EDIT_EMPLOYEE_MODEL_SUCCESS,

    OPEN_VIEW_EMPLOYEE_MODEL,
    OPEN_VIEW_EMPLOYEE_MODEL_SUCCESS,
    CLOSE_VIEW_EMPLOYEE_MODEL,

    OPEN_STARTER_VIEW_EMPLOYEE_MODEL,
    OPEN_STARTER_VIEW_EMPLOYEE_MODEL_SUCCESS,
    CLOSE_STARTER_VIEW_EMPLOYEE_MODEL,

    DELETE_EMPLOYEE,

    SAVE_EMPLOYEE,
    SAVE_EMPLOYEES_SUCCESS,

    SET_EMPLOYEE_DEFAULT_BRANCH,
    SET_EMPLOYEE_DEFAULT_BRANCH_SUCCESS,

    SAVE_TERMSCONDITION,
    SAVE_TERMSCONDITION_SUCCESS
  } from './types';

/**
 * Redux Action Get Employees
 */
export const getEmployees = (data) => ({
    type: GET_EMPLOYEES,
    payload : data
});

/**
 * Redux Action Get Employees Success
 */
export const getEmployeesSuccess = (response) => ({
    type: GET_EMPLOYEES_SUCCESS,
    payload: response
});

/**
 * Redux Action Open Model for new employee
 */
export const opnAddNewEmployeeModel = () => ({
    type: OPEN_ADD_NEW_EMPLOYEE_MODEL
});
/**
 * Redux Action Open Model for new Member
 */
export const opnAddNewEmployeeModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_EMPLOYEE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close New Employee Model
 */
export const clsAddNewEmployeeModel = () => ({
    type: CLOSE_ADD_NEW_EMPLOYEE_MODEL
});



/**
 * Redux Action Open Model to view employee
 */
export const opnViewEmployeeModel = (requestData) => ({
    type: OPEN_VIEW_EMPLOYEE_MODEL,
    payload: requestData
});
/**
 * Redux Action Get Employees Success
 */
export const viewEmployeesSuccess = (response) => ({
    type: OPEN_VIEW_EMPLOYEE_MODEL_SUCCESS,
    payload: response
});

export const clsViewEmployeeModel = () => ({
    type: CLOSE_VIEW_EMPLOYEE_MODEL
});

/**
 * Redux Action Open Model to edit employee
 */
export const opnEditEmployeeModel = (requestData) => ({
    type: OPEN_EDIT_EMPLOYEE_MODEL,
    payload:requestData
});
/**
 * Redux Action Get Employees Success
 */
export const editEmployeesSuccess = (response) => ({
    type: OPEN_EDIT_EMPLOYEE_MODEL_SUCCESS,
    payload: response
});

/**
 * Redux Action Delete Employee
 */
export const deleteEmployee = (data) => ({
    type: DELETE_EMPLOYEE,
    payload:data
});

/**
 * Redux Action SAVE Employees
 */
export const saveEmployee = (data) => ({
    type: SAVE_EMPLOYEE,
    payload : data
});
/**
 * Redux Action SAVE Employees SUCCESS
 */
export const saveEmployeeSuccess = () => ({
    type: SAVE_EMPLOYEES_SUCCESS,
});


export const setEmployeeDefaultBranch = (data) => ({
    type: SET_EMPLOYEE_DEFAULT_BRANCH,
    payload : data
});

export const setEmployeeDefaultBranchSuccess = (response) => ({
    type: SET_EMPLOYEE_DEFAULT_BRANCH_SUCCESS,
    payload: response
});




export const opnViewStarterEmployeeModel = (requestData) => ({
    type: OPEN_STARTER_VIEW_EMPLOYEE_MODEL,
    payload: requestData
});

export const viewStarterEmployeesSuccess = (response) => ({
    type: OPEN_STARTER_VIEW_EMPLOYEE_MODEL_SUCCESS,
    payload: response
});

export const clsStarterViewEmployeeModel = () => ({
    type: CLOSE_STARTER_VIEW_EMPLOYEE_MODEL
});

/**
 * Redux Action SAVE termsCondition
 */
export const saveTermscondition = (data) => ({
    type: SAVE_TERMSCONDITION,
    payload : data
});
/**
 * Redux Action SAVE termsCondition SUCCESS
 */
export const saveTermsconditionSuccess = () => ({
    type: SAVE_TERMSCONDITION_SUCCESS,
});
