var crypto = require("crypto")

var {encryptionConfiguration} = require('../constants/AppConfig');


/*

example
https://repl.it/languages/nodejs

const crypto = require('crypto');

const encrypt = function (plaintext) {
    var cipher = crypto.createCipher('aes-256-cbc','fitnessproleague');
     var crypted = cipher.update(plaintext, 'utf-8', 'hex');
     crypted += cipher.final('hex');

     return crypted;
}

const  decrypt = function (ciphertext) {
         var decipher = crypto.createDecipher('aes-256-cbc', 'fitnessproleague');
         var decrypted = decipher.update(ciphertext, 'hex', 'utf-8');
         decrypted += decipher.final('utf-8');

         return decrypted;
}



// alice_secret and bob_secret should be the same
console.log(decrypt("f89526e6d39f830ef4464fa3e5afa774"));

*/

exports.encrypt = function (plaintext) {
    var cipher = crypto.createCipher('aes-256-cbc', encryptionConfiguration.secretkey);
     var crypted = cipher.update(plaintext, 'utf-8', 'hex');
     crypted += cipher.final('hex');

     return crypted;
}

exports.decrypt = function (ciphertext) {
         var decipher = crypto.createDecipher('aes-256-cbc', encryptionConfiguration.secretkey);
         var decrypted = decipher.update(ciphertext, 'hex', 'utf-8');
         decrypted += decipher.final('utf-8');

         return decrypted;
}

exports.encryptmobile = function (user,{mobile,emailid,phone}) {

    if(!user.mobile_viewrights)
    {
        if(mobile){
            mobile = mobile.substr(0,2) + 'XXXXX' +  mobile.substr(7) ;
        }
         if(phone){
           phone = phone.substr(0,2) + 'XXXXX' +  phone.substr(7) ;
        }
    }

    if(!user.emailid_viewrights && emailid)
    {
      var emailtoreplace = emailid.split('@');
      if(emailtoreplace.length > 0)
      {
        var emailid = emailid.replace(emailtoreplace[0],'XXXXX');

      }
    }

      return {mobile,emailid,phone};
}



exports.enquiryencryptmobile = function (user,{mobile,emailid,phone}) {

    if(!user.enquirymobile_viewrights)
    {
        if(mobile){
            mobile = mobile.substr(0,2) + 'XXXXX' +  mobile.substr(7) ;
        }
         if(phone){
           phone = phone.substr(0,2) + 'XXXXX' +  phone.substr(7) ;
        }
    }

    if(!user.enquiryemailid_viewrights && emailid)
    {
      var emailtoreplace = emailid.split('@');
      if(emailtoreplace.length > 0)
      {
        var emailid = emailid.replace(emailtoreplace[0],'XXXXX');

      }
    }

      return {mobile,emailid,phone};
}
