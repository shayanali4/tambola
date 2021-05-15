/**
 * Todo App Actions
 */
import {
OPEN_ADD_NEW_BRANCH_MODEL,
OPEN_ADD_NEW_BRANCH_MODEL_SUCCESS,
CLOSE_ADD_NEW_BRANCH_MODEL,

GET_BRANCHES,
GET_BRANCHES_SUCCESS,

OPEN_VIEW_BRANCH_MODEL,
OPEN_VIEW_BRANCH_MODEL_SUCCESS,
CLOSE_VIEW_BRANCH_MODEL,

DELETE_BRANCH,

SAVE_BRANCH,
SAVE_BRANCH_SUCCESS,

OPEN_EDIT_BRANCH_MODEL,
OPEN_EDIT_BRANCH_MODEL_SUCCESS,
}from './types';
/**
 * Redux Action OPEN View branch Model
 */
export const opnAddNewBranchModel = () => ({
  type: OPEN_ADD_NEW_BRANCH_MODEL,
});
/**
 * Redux Action Open Model for new branch
 */
export const opnAddNewBranchModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_BRANCH_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View branch Model
 */
export const clsAddNewBranchModel = () => ({
    type: CLOSE_ADD_NEW_BRANCH_MODEL,
});

/**
 * Redux Action Get branches
 */
export const getBranches = (data) => ({
    type: GET_BRANCHES,
    payload : data
});

/**
 * Redux Action Get branches Success
 */
export const getBranchesSuccess = (response) => ({
    type: GET_BRANCHES_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE branch
 */
export const saveBranch = (data) => ({
    type: SAVE_BRANCH,
    payload : data
});
/**
 * Redux Action SAVE branch SUCCESS
 */
export const saveBranchSuccess = () => ({
    type: SAVE_BRANCH_SUCCESS,
});
/**
 * Redux Action Open Model to view brach
 */
export const opnViewBranchModel = (requestData) => ({
    type: OPEN_VIEW_BRANCH_MODEL,
      payload:requestData
});
/**
 * Redux Action Get  Success
 */
export const viewBranchSuccess = (response) => ({
    type: OPEN_VIEW_BRANCH_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View branch Model
 */
export const clsViewBranchModel = () => ({
    type: CLOSE_VIEW_BRANCH_MODEL
});
/**
 * Redux Action Delete Branch
 */
export const deleteBranch = (data) => ({
    type: DELETE_BRANCH,
    payload:data
});
/**
 * Redux Action edit branch  model
 */
export const opnEditBranchModel = (requestData) => ({
    type: OPEN_EDIT_BRANCH_MODEL,
      payload:requestData
});
/**
 * Redux Action edit branch Success
 */
export const editBranchSuccess = (response) => ({
    type: OPEN_EDIT_BRANCH_MODEL_SUCCESS,
    payload: response
});
