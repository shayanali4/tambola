/**
* ALLOCATE DIET Actions
*/
import {
  OPEN_ADD_NEW_ALLOCATEDIET_MODEL,
  CLOSE_ADD_NEW_ALLOCATEDIET_MODEL,

  SAVE_ALLOCATEDIET,
  SAVE_ALLOCATEDIET_SUCCESS,

  GET_ALLOCATEDIETS,
  GET_ALLOCATEDIET_SUCCESS,

  SAVE_DIET_PHASE,

  OPEN_EDIT_ALLOCATEDIET_MODEL,
  OPEN_EDIT_ALLOCATEDIET_MODEL_SUCCESS,

  OPEN_VIEW_ALLOCATEDIET_MODEL,
  OPEN_VIEW_ALLOCATEDIET_MODEL_SUCCESS,
  CLOSE_VIEW_ALLOCATEDIET_MODEL,

  DELETE_ALLOCATEDIET,

  ON_DIETNOTALLOCATEDMEMBERFILTER_CHANGE,

  OPEN_ADD_NEW_DIET_NOT_ALLOCATED_MEMBER_MODEL,
  CLOSE_ADD_NEW_DIET_NOT_ALLOCATED_MEMBER_MODEL,

  OPEN_FILTER_WITH_DIETENDDATE_MEMBER_MODEL,
  CLOSE_FILTER_WITH_DIETENDDATE_MEMBER_MODEL
} from './types';

/**
 * Redux Action OPEN ADD ALLOCATE DIET Model
 */
export const opnAddNewAllocateDietModel = (data) => ({
  type: OPEN_ADD_NEW_ALLOCATEDIET_MODEL,
  payload : data
});
/**
 * Redux Action close allocate diet Model
 */
export const clsAddNewAllocateDietModel = () => ({
    type: CLOSE_ADD_NEW_ALLOCATEDIET_MODEL,
});

/**
 * Redux Action Get allocate diet
 */
export const getAllocateDiets = (data) => ({
    type: GET_ALLOCATEDIETS,
    payload : data
});

/**
 * Redux Action Get allocate diet Success
 */
export const getAllocateDietSuccess = (response) => ({
    type: GET_ALLOCATEDIET_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE allocate diet
 */
export const saveAllocateDiet = (data) => ({
    type: SAVE_ALLOCATEDIET,
    payload : data
});
/**
 * Redux Action SAVE allocate diet SUCCESS
 */
export const saveAllocateDietSuccess = () => ({
    type: SAVE_ALLOCATEDIET_SUCCESS,
});

/**
 * Redux Action SAVE phase
 */
export const saveDietPhase = (data) => ({
    type: SAVE_DIET_PHASE,
    payload : data
});
/**
 * Redux Action edit allocate diet  model
 */
export const opnEditAllocateDietModel = (requestData) => ({
    type: OPEN_EDIT_ALLOCATEDIET_MODEL,
      payload:requestData
});
/**
 * Redux Action edit allocate diet Success
 */
export const editAllocateDietSuccess = (response) => ({
    type: OPEN_EDIT_ALLOCATEDIET_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action Open Model to view allocatediet
 */
export const opnViewAllocateDietModel = (requestData) => ({
    type: OPEN_VIEW_ALLOCATEDIET_MODEL,
      payload:requestData
});
/**
 * Redux Action Get allocatediet Success
 */
export const viewAllocateDietSuccess = (response) => ({
    type: OPEN_VIEW_ALLOCATEDIET_MODEL_SUCCESS,
    payload: response
});
/**
 * Redux Action close View allocatediet Model
 */
export const clsViewAllocateDietModel = () => ({
    type: CLOSE_VIEW_ALLOCATEDIET_MODEL
});
/**
 * Redux Action delete WorkoutSchedule
 */
export const deleteAllocateDiet = (data) => ({
    type: DELETE_ALLOCATEDIET,
    payload:data
});
/**
 * Redux Action ON NOT ALLOCATED MEMBER Filter CHANGE
 */
export const onDietNotAllocatedMemberfilterChange = (key,value) => ({
   type: ON_DIETNOTALLOCATEDMEMBERFILTER_CHANGE,
   payload: { key,value }
});

/**
 * Redux Action OPEN ADD NEW DIET NOT ALLOCATED Member MODEL
 */
export const opnAddNewDietNotAllocatedMemberModel = (data) => ({
  type: OPEN_ADD_NEW_DIET_NOT_ALLOCATED_MEMBER_MODEL,
  payload : data
});
/**
 * Redux Action close ADD NEW DIET NOT ALLOCATED Member MODEL
 */
export const clsAddNewDietNotAllocatedMemberModel = () => ({
    type: CLOSE_ADD_NEW_DIET_NOT_ALLOCATED_MEMBER_MODEL,
});
/**
 * Redux Action OPEN ADD NEW ALLOCATED Member MODEL
 */
export const opnFilterWithDietEndDateMemberModel = (data) => ({
  type: OPEN_FILTER_WITH_DIETENDDATE_MEMBER_MODEL,
  payload : data
});
/**
 * Redux Action close ADD NEW ALLOCATED Member MODEL
 */
export const clsFilterWithDietEndDateMemberModel = () => ({
    type: CLOSE_FILTER_WITH_DIETENDDATE_MEMBER_MODEL,
});
