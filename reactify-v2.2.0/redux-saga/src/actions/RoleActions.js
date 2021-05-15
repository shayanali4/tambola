/**
 * ENQUIRY Actions
 */

import {

OPEN_ADD_NEW_ROLE_MODEL,
OPEN_ADD_NEW_ROLE_MODEL_SUCCESS,
CLOSE_ADD_NEW_ROLE_MODEL,

SAVE_ROLE,
SAVE_ROLE_SUCCESS,

GET_ROLES,
GET_ROLES_SUCCESS,

OPEN_EDIT_ROLE_MODEL,
DELETE_ROLE,
} from './types';
/**
 * Redux Action OPEN View Role Model
 */
export const opnAddNewRoleModel = () => ({
  type: OPEN_ADD_NEW_ROLE_MODEL,
});
/**
 * Redux Action Open Model for new ROLE
 */
export const opnAddNewRoleModelSuccess = (response) => ({
    type: OPEN_ADD_NEW_ROLE_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View ROLE Model
 */
export const clsAddNewRoleModel = () => ({
    type: CLOSE_ADD_NEW_ROLE_MODEL,
});

/**
 * Redux Action Get ROLE
 */
export const getRoles = (requestData) => ({
    type: GET_ROLES,
    payload : requestData
});
/**
 * Redux Action Get ROLE Success
 */
export const getRolessSuccess = (response) => ({
    type: GET_ROLES_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE ROLE
 */
export const saveRole = (data) => ({
    type: SAVE_ROLE,
    payload : data
});
/**
 * Redux Action SAVE ROLE SUCCESS
 */
export const saveRoleSuccess = () => ({
    type: SAVE_ROLE_SUCCESS,
});
export const opnEditRoleModel = (response) => ({
    type: OPEN_EDIT_ROLE_MODEL,
    payload: response
});
/**
 * Redux Action Delete role
 */
export const deleteRole = (data) => ({
    type: DELETE_ROLE,
    payload:data
});
