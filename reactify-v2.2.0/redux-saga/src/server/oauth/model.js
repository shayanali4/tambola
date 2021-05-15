var connection = require('../mysql/dbConnection');
var Promise = require('bluebird');
var Helper = require('../helpers/helpers');
var helpers = require('../helpers/encryption');
var {sendPushNotificationLog} = require('../helpers/notification');

/*
 * Get access token.
 */

module.exports.getAccessToken = function* (bearerToken) {

  var someVar =  yield  connection.executeQuery("call USPtokenvalidate('"+bearerToken+"')").then(function(data)
      {
        var token = data[0].length > 0 ? data[0][0] : false

        return {
         accessToken: token.access_token,
         client: {id: token.client_id, clientCode : token.client_code,paymentgateway : token.paymentgateway ? JSON.parse(token.paymentgateway) : null,packtypeId : token.packtypeId,
           biometric : token.biometric ?  JSON.parse(token.biometric) : null, timezoneoffset : token.client_timezoneoffset, countrycode : token.client_countrycode,ishavemutliplebranch : token.ishavemutliplebranch,  ptslotmaxoccupancy : token.ptslotmaxoccupancy,
         clienttypeId : token.clienttypeId, ptattendancelimit : token.ptattendancelimit, generategstinvoice : token.generategstinvoice},
         accessTokenExpiresAt: token.access_token_expires_on,
         user: {id: token.user_id ,logintype : token.logintype , mobile_viewrights : token.mobile_viewrights ,
          emailid_viewrights : token.emailid_viewrights,rights:token.modules,defaultbranchid:token.defaultbranchid ? token.defaultbranchid : 0,zoneid:token.zoneid ? token.zoneid : null,
           enquirymobile_viewrights : token.enquirymobile_viewrights ,enquiryemailid_viewrights : token.enquiryemailid_viewrights,
           enablediscountlimit : token.enablediscountlimit,maxmonthlylimit : token.maxmonthlylimit,
           code : token.code,enablecomplimentarysale : token.enablecomplimentarysale,complimentarysalelimit : token.complimentarysalelimit}, // could be any object
       };
      });
      return someVar;
};



/**
 * Get client.
 */

module.exports.getClient = function* (clientId, clientSecret) {
    var someVar =  yield connection.executeQuery("call USPCgetClient('"+clientId+"')").then
       (function(data)
        {
          var oAuthClient = data[0].length > 0 ? data[0][0] : false;
          if (!oAuthClient) {
            return;
          }

        return {
            clientId: oAuthClient.id,
            id : oAuthClient.id,
            clientSecret: oAuthClient.clientcode,
            grants: ['password', 'refresh_token']
          };
        });
        return someVar;
};


/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function *(bearerToken) {
    var someVar =  yield  connection.executeQuery("call USPtokenrefresh('"+bearerToken+"')").then(function(data)
        {
        let token = data[0].length > 0 ? data[0][0] : false;

         return {
          refreshToken: token.access_token,
          client: {id: token.client_id},
          refreshTokenExpiresAt: token.refresh_token_expires_on,
          user: {id: token.user_id, logintype : token.logintype}, // could be any object
        };
        })
        return someVar;
};

/*
 * Get user.
 */

module.exports.getUser = function *(username, password) {
  password = password && password.trim();
  var userpassword = helpers.encrypt(password);

  var logintype = username.split('::');
    username = logintype[0];
  var clientid =  logintype.length > 1 ? logintype[2] : '';
  logintype = logintype.length > 1 ? logintype[1] : '0';

    var someVar =  yield  connection.executeQuery("call USPCgetUser('"+username+"','"+userpassword+"','"+password+"','"+logintype+"','"+clientid+"')").then(function(data)
        {
          return data[0].length > 0 ? data[0] : false;
        })
    return someVar;
};



/**
 * Save token.
 */

module.exports.saveToken = function *(token, client, user) {

  if(user.length != undefined)
  {
    user  = user.filter((x) => x.clientid == client.clientId);
    user = user.length > 0 ? user[0] : false;
  }

  var someVar =  yield  connection.executeQuery("call USPtokensave('"+token.accessToken+"','"+Helper.convertToMysqlDatefromJSDateObject(token.accessTokenExpiresAt)+"','"+client.clientId+"','"+token.refreshToken+"','"+Helper.convertToMysqlDatefromJSDateObject(token.refreshTokenExpiresAt)+"','"+user.id+"','"+user.logintype+"')").then(function(data)
      {
        if( user.logintype == 1 && data[0] && data[0][0].haslastlogin == 0)
        {
          let clientid = client.clientId;
          let fromuserid = null;
          let frommemberid =  user.logintype == 1 ? user.id : null;
          let notificationalias = "firstSignin";
          let branchid = user.defaultbranchid;
            sendPushNotificationLog({clientid,fromuserid,frommemberid,notificationalias,branchid});
        }
        return {accessToken : token.accessToken,refreshToken : token.refreshToken,accessTokenExpiresAt : token.accessTokenExpiresAt, client, user };
      })
      return someVar;
};


/**
 * Revoke token.
 */

module.exports.revokeToken = function *(token) {
  var someVar =  yield  connection.executeQuery("call USPtokenrevoke('"+token.user.id+"')").then(function(data)
      {
        return token;
      })
      return someVar;
};
