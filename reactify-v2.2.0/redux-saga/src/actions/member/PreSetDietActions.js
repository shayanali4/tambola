/**
* ALLOCATE DIET Actions
*/
import {
  SAVE_MEMBER_DIET_PHASE,
  SAVE_MEMBER_DIET_PHASE_SUCCESS,

  GET_MEMBER_ALLOCATEDIETS,
  GET_MEMBER_ALLOCATEDIET_SUCCESS,

  OPEN_MEMBER_VIEW_ALLOCATEDIETS_MODEL,
  OPEN_MEMBER_VIEW_ALLOCATEDIETS_MODEL_SUCCESS,
  CLOSE_MEMBER_VIEW_ALLOCATEDIETS_MODEL
} from '../types';


/**
 * Redux Action Get allocate diet
 */
export const getMemberAllocateDiets = (data) => ({
    type: GET_MEMBER_ALLOCATEDIETS,
    payload : data
});

/**
 * Redux Action Get allocate diet Success
 */
export const getMemberAllocateDietSuccess = (response) => ({
    type: GET_MEMBER_ALLOCATEDIET_SUCCESS,
    payload: response
});
/**
 * Redux Action SAVE allocate diet
 */
export const saveMemberDietPhase = (data) => ({
    type: SAVE_MEMBER_DIET_PHASE,
    payload : data
});
/**
 * Redux Action SAVE allocate diet SUCCESS
 */
export const saveMemberDietPhaseSuccess = () => ({
    type: SAVE_MEMBER_DIET_PHASE_SUCCESS,
});
export const opnMemberViewAllocateModel = (requestData) => ({
    type: OPEN_MEMBER_VIEW_ALLOCATEDIETS_MODEL,
    payload: requestData
});

export const viewMemberAllocateSuccess = (response) => ({
    type: OPEN_MEMBER_VIEW_ALLOCATEDIETS_MODEL_SUCCESS,
    payload: response
});

export const clsMemberViewAllocateModel = () => ({
    type: CLOSE_MEMBER_VIEW_ALLOCATEDIETS_MODEL
});
