/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { NotificationManager } from 'react-notifications';

import {
    LOGIN_USER,
    LOGIN_FACEBOOK_USER,
    LOGIN_GOOGLE_USER,
    LOGIN_TWITTER_USER,
    LOGIN_GITHUB_USER,
    LOGOUT_USER,
    SIGNUP_USER,
    SIGNUP_URL,
    CLIENT_SIGNIN_REQUEST,
    FORGET_WEBADDRESS,
    FORGET_PASSWORD,
} from 'Actions/types';

import {
    signinUserSuccess,
    signinUserFailure,
    signUpUserInFirebaseSuccess,
    signUpUserInFirebaseFailure,
    logoutUserFromFirebaseSuccess,
    logoutUserFromFirebaseFailure,
    signUpUrlInFirebaseSuccess,
    signUpUrlInFirebaseFailure,
    clientSigninSuccess,
    requestFailure,
    requestSuccess
} from 'Actions';

// api
import api from 'Api';
import Auth from '../Auth/Auth';
import { replace } from 'connected-react-router';


const authObject = new Auth();
/**
 * Sigin User With Email and Password Request
 */
const signInUserWithEmailPasswordRequest = function* (data)
{
    let requestData = new URLSearchParams();
    data.logintype = data.logintype != '' ? data.logintype : "0";
    requestData.append('client_id', data.clientId);
    requestData.append('client_secret',data.clientId);
    requestData.append('grant_type' , 'password');
    requestData.append('username', data.email + '::' + data.logintype + '::' + data.clientId);
    requestData.append('password', data.password);

    let response = yield api.post('oauth/token', requestData)
        .then(authUser => authUser.data)
        .catch(error => error);
    return response;
}

/**
 * Signin User With Facebook Request
 */
const signInUserWithFacebookRequest = async () =>
    await auth.signInWithPopup(facebookAuthProvider)
        .then(authUser => authUser)
        .catch(error => error);

/**
* Signin User With Facebook Request
*/
const signInUserWithGoogleRequest = async () =>
    await auth.signInWithPopup(googleAuthProvider)
        .then(authUser => authUser)
        .catch(error => error);

/**
* Signin User With Twitter Request
*/
const signInUserWithTwitterRequest = async () =>
    await auth.signInWithPopup(twitterAuthProvider)
        .then(authUser => authUser)
        .catch(error => error);

/**
* Signin User With Github Request
*/
const signInUserWithGithubRequest = async () =>
    await auth.signInWithPopup(githubAuthProvider)
        .then(authUser => authUser)
        .catch(error => error);

/**
 * Signout Request
 */
const signOutRequest = async () =>
    await auth.signOut().then(authUser => authUser).catch(error => error);

/**
 * Create User
 */
const createUserWithEmailPasswordRequest = async (email, password) =>
    await auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);


        /**
         * Create Url
         */
        const createUrlRequest = async (url) =>
            await auth.createUrl(url)
                .then(authUser =>  authUser)
                .catch(error => error);


/**
 * Signin User With Email & Password
 */
function* signInUserWithEmailPassword({ payload }) {
    const { history } = payload;
    try {
        const signInUser = yield call(signInUserWithEmailPasswordRequest, payload.user);

        if (signInUser.message ) {
            yield put(signinUserFailure("Username or Password not valid."));
        } else {

          NotificationManager.listNotify.forEach(n => NotificationManager.remove({ id: n.id }));
          signInUser.clientId = payload.user.clientId;
          signInUser.loginType = payload.user.logintype;
          signInUser.clientType = payload.user.clienttype;
          authObject.setSession(signInUser);
          yield put(signinUserSuccess(signInUser.access_token));
          history.replace('/');

        }
    } catch (error) {
        yield put(signinUserFailure(error));
    }
}


/**
 * Signin User With Facebook Account
 */
function* signinUserWithFacebookAccount({ payload }) {
    try {
        const signUpUser = yield call(signInUserWithFacebookRequest);
        if (signUpUser.message) {
            yield put(signinUserFailure(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.uid);
            yield put(signinUserSuccess(signUpUser));
            payload.push('/')
        }
    } catch (error) {
        yield put(signinUserFailure(error));
    }
}

/**
 * Signin User With Google Account
 */
function* signinUserWithGoogleAccount({ payload }) {
    try {
        const signUpUser = yield call(signInUserWithGoogleRequest);
        if (signUpUser.message) {
            yield put(signinUserFailure(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.uid);
            yield put(signinUserSuccess(signUpUser));
            payload.push('/')
        }
    } catch (error) {
        yield put(signinUserFailure(error));
    }
}

/**
 * Signin User With Twitter Account
 */
function* signinUserWithTwitterAccount({ payload }) {
    try {
        const signUpUser = yield call(signInUserWithTwitterRequest);
        if (signUpUser.message) {
            yield put(signinUserFailure(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.uid);
            yield put(signinUserSuccess(signUpUser));
            payload.push('/')
        }
    } catch (error) {
        yield put(signinUserFailure(error));
    }
}

/**
 * Signin User With Github Account
 */
function* signinUserWithGithubAccount({ payload }) {
    try {
        const signUpUser = yield call(signInUserWithGithubRequest);
        if (signUpUser.message) {
            yield put(signinUserFailure(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.uid);
            yield put(signinUserSuccess(signUpUser));
            payload.push('/')
        }
    } catch (error) {
        yield put(signinUserFailure(error));
    }
}

/**
 * Signout User
 */
function* signOut() {
    try {
      authObject.logout();
    } catch (error) {
        yield put(logoutUserFromFirebaseFailure());
    }
}

/**
 * Create User In Firebase
 */
function* createUserWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload
    try {
        const signUpUser = yield call(createUserWithEmailPasswordRequest, email, password);
        if (signUpUser.message) {
            yield put(signUpUserInFirebaseFailure(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.uid);
            yield put(signUpUserInFirebaseSuccess(signUpUser));
            history.push('/')
        }
    } catch (error) {
        yield put(signUpUserInFirebaseFailure(error));
    }
}



/**
 * Create Url In Firebase
 */
function* createUrl({ payload }) {
    const { url } = payload.url;
    const { history } = payload
    try {
        const signUpUrl = yield call(createUrlRequest, url);
        if (signUpUrl.message) {
            yield put(signUpUrlInFirebaseFailure(signUpUrl.message));
        } else {

            localStorage.setItem('url_id', signUpUrl.urlid);
              yield put(signUpUrlInFirebaseSuccess(signUpUrl));
            history.push('/signin')
}
    } catch (error) {
        yield put(signUpUrlInFirebaseFailure(error));
    }
}


/**
 * Signin User In Firebase
 */
export function* signinUserInFirebase() {
    yield takeEvery(LOGIN_USER, signInUserWithEmailPassword);
}

/**
 * Signin User With Facebook
 */
export function* signInWithFacebook() {
    yield takeEvery(LOGIN_FACEBOOK_USER, signinUserWithFacebookAccount);
}

/**
 * Signin User With Google
 */
export function* signInWithGoogle() {
    yield takeEvery(LOGIN_GOOGLE_USER, signinUserWithGoogleAccount);
}

/**
 * Signin User With Twitter
 */
export function* signInWithTwitter() {
    yield takeEvery(LOGIN_TWITTER_USER, signinUserWithTwitterAccount);
}

/**
 * Signin User With Github
 */
export function* signInWithGithub() {
    yield takeEvery(LOGIN_GITHUB_USER, signinUserWithGithubAccount);
}

/**
 * Signout User From Firebase
 */
export function* signOutUser() {
    yield takeEvery(LOGOUT_USER, signOut);
}

/**
 * Create User
 */
export function* createUserAccount() {
    yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}



/**
 * Check URL From Server
 */

const clientSigninRequestServer = function* (data)
{

    let response = yield api.post('client-signin', data)
        .then(response => response.data)
        .catch(error => error.response.data);

    return response;
}

function* clientSigninFromServer(action) {
    try {
        const response = yield call(clientSigninRequestServer, action.payload);

          if(!(response.errorMessage  || response.ORAT)){

            if(response[0][0].clienttypeId)
            {
              authObject.login({clientId : action.payload.clientId, clientType : response[0][0].clienttypeId});
            }
            else {
                  yield put(requestFailure(""));
            }
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }
    } catch (error) {
            yield put(requestFailure(response.errorMessage));
        }
}


export function* clientSignin() {
    yield takeEvery(CLIENT_SIGNIN_REQUEST, clientSigninFromServer);
}

const clientForgetWebaddressRequestServer = function* (data)
{
    let response = yield api.post('client-forgetwebaddress', data)
        .then(response => response.data)
        .catch(error => error.response.data);
    return response;
}

function* forgetwebaddress(action) {
    try {
        const response= yield call(clientForgetWebaddressRequestServer ,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess());
        }
        else {

          yield put(requestFailure(response.errorMessage));
        }
    } catch (error) {
        console.log(error);
    }
}


export function* forgetWebAddress() {
    yield takeEvery(FORGET_WEBADDRESS, forgetwebaddress);
}

const clientForgetPasswordRequestServer = function* (data)
{
    let response = yield api.post('client-forgetpassword', data)
        .then(response => response.data)
        .catch(error => error.response.data);
    return response;
}

function* forgetwebpassword(action) {
    try {
        const response= yield call(clientForgetPasswordRequestServer ,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
          yield put(requestSuccess());
        }
        else {

          yield put(requestFailure(response.errorMessage));
        }
    } catch (error) {
        console.log(error);
    }
}


export function* forgetPassord() {
    yield takeEvery(FORGET_PASSWORD, forgetwebpassword);
}


/**
 * Auth Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(signinUserInFirebase),
        fork(signInWithFacebook),
        fork(signInWithGoogle),
        fork(signInWithTwitter),
        fork(signInWithGithub),
        fork(signOutUser),
        fork(createUserAccount),
        fork(clientSignin),
        fork(forgetWebAddress),
        fork(forgetPassord),
    ]);
}
