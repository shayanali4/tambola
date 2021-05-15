/**
 * Redux App Settings Actions
 */
import {
    OPEN_MEMBER_COVID19DISCLAIMER_MODEL,
    OPEN_MEMBER_COVID19DISCLAIMER_MODEL_SUCCESS,
    CLOSE_MEMBER_COVID19DISCLAIMER_MODEL,
    SAVE_MEMBER_COVID19DISCLAIMER,
    SAVE_MEMBER_COVID19DISCLAIMER_SUCCESS,
} from '../types';

export const opnMemberCovid19DisclaimerModel = () => ({
  type: OPEN_MEMBER_COVID19DISCLAIMER_MODEL,
});

export const opnMemberCovid19DisclaimerModelSuccess = (response) => ({
    type: OPEN_MEMBER_COVID19DISCLAIMER_MODEL_SUCCESS,
    payload: response
});

export const clsMemberCovid19DisclaimerModel = () => ({
  type: CLOSE_MEMBER_COVID19DISCLAIMER_MODEL,
});

export const saveMemberCovid19Disclaimer = (data) => ({
    type: SAVE_MEMBER_COVID19DISCLAIMER,
    payload : data
});

export const saveMemberCovid19DisclaimerSuccess = () => ({
    type: SAVE_MEMBER_COVID19DISCLAIMER_SUCCESS,
});
