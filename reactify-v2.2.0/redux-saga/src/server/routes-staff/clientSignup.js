var connection = require('../mysql/dbConnection');
var helpers = require('../helpers/helpers');
var mail = require ('../helpers/mail');
var helper = require('../helpers/encryption');
var {defaultConfiguration} = require('../constants/AppConfig');
var {getSignupVerificationTemplate,getSignupConfirmationTemplate}  = require('../template/email/ClientSignup');
var {getForgetWebAddressEmailTemplate}  = require('../template/email/ForgetWebAddress');
var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');

exports.signup = function(req, res){

  const getstarted = req.body;
  const verificationCode =  helpers.signupVerificationCode();
  var password = helper.encrypt(getstarted.userpassword);

  var currentdate = new Date();
  var expirydate = new Date(currentdate.setMinutes(currentdate.getMinutes() + defaultConfiguration.verificationCodeExpiry));

    connection.executeQuery("call USPclientSignupRequest('"+getstarted.usermail+"' ,  '"+ password +"' , '"+verificationCode+"' , '"+helpers.convertToMysqlDatefromJSDateObject(expirydate)+"');")
    .then((data) =>
        {
          var template = getSignupVerificationTemplate({verificationcode : verificationCode})
          var options = {
                      to: getstarted.usermail,
                      subject: template.subject,
                      message: template.message ,
                      title : template.title,
                      clientid : 1,
                    }

          mail.sendMail(options);

           res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

};


exports.verify = function(req, res){

  const getstarted = req.body.getStarted;
  const code = req.body.codeVerification;

  var passwords = helper.encrypt(getstarted.userpassword);

    connection.executeQuery("call USPclientSignupVerification( '"+getstarted.usermail+"' , '"+passwords+"' ,'"+code.verificationcode+"');")
    .then((data) => {res.send(data);} ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

};

exports.establishment = function(req, res){

  const getstarted = req.body.getStarted;
  const info = req.body.establishmentForm;
  info.organizationtype = info.organizationtype || null;
  info.professionaltype = info.professionaltype || null;
    connection.executeQuery("call USPclientSignupEstablishmentInfo( '"+getstarted.usermail+"' ,'"+info.clienttype+"',"+info.organizationtype+",'"+
    info.multiplebranches+"' ,'"+info.branch+"' , "+(info.branchno != "" ? info.branchno : null)+","+info.professionaltype+");")
    .then((data) => { res.send(data); },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

};


exports.organization = function(req, res){

  const getstarted = req.body.getStarted;
  const info = req.body.organizationForm;
  info.organizationname = info.organizationname ? escape(info.organizationname) : '';

    connection.executeQuery("call USPclientSignupOrganizationInfo( '"+getstarted.usermail+"' ,'"+info.organizationname+"','"+info.firstname+"','"+info.lastname+"','"+info.mobileno+"');")
    .then((data) => { res.send(data); },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.url = function(req, res){

  const getstarted = req.body.getStarted;
  const customurl = req.body.customUrl;
  const org = req.body.organizationForm;
  org.organizationname = org.organizationname ? escape(org.organizationname) : '';
  org.gmapaddress = org.gmapaddress ? escape(org.gmapaddress) : '';
  org.address1 = org.address1 ? escape(org.address1) : '';
  org.address2 = org.address2 ? escape(org.address2) : '';
  org.city = org.city ? escape(org.city) : '';
  org.latitude = org.latitude || '';
  org.longitude = org.longitude || '';
  const clienttype = req.body.clientType;
  const packtype = req.body.packtype;
  var userpassword = helper.encrypt(getstarted.userpassword);
  org.ptslotdetail = {}
  org.ptslotdetail.ptslotdurationId = 1;
  org.ptslotdetail.ptslotdurationlabel = '60';
  org.ptslotdetail.ptslotmaxdays = 7;
  org.ptslotdetail.ptslotmaxoccupancy = 1;

    connection.executeQuery("call USPclientSignupURLCreation('"+getstarted.usermail+"','"+
    customurl.url+"','"+org.firstname+"','"+org.lastname+"','"+getstarted.usermail+"','"+
    userpassword +"','"+org.mobileno+"','"+org.organizationname+"','"+org.address1+"','"+
    org.address2+"','"+org.city+"','"+org.state+"','"+org.country+"','"+org.pincode+"','"+
    org.gmapaddress+"','"+org.latitude+"','"+org.longitude+"','"+JSON.stringify(org.ptslotdetail)+"','"+
    org.selectedtimezone+"',"+packtype+");")
    .then((data) =>
        {
               const clientid = data[0][0].id;
              //
              // connection.executeQuery("call USPusersave(0,null,'"+org.firstname+"','"+org.lastname+"',null,null,'"+
              //  getstarted.usermail+"','"+ userpassword +"','1','',null,'1',null,null,'"+
              //  org.mobileno+"','','',  '',null,null,'','','','','','','1','" +
              //  clientid+"',null,'1','1','1','0',null,null);").then((data) =>
              //  {
               var template = getSignupConfirmationTemplate({url:customurl.url,clienttype:clienttype});
               var options = {
                           to: getstarted.usermail,
                           subject: template.subject,
                           message: template.message ,
                           clientid:1,
                           title : template.title,
                         }

               mail.sendMail(options);

               res.send(data)

       },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};


exports.clientsignin = function(req, res){
  const {clientId} = req.body;
    connection.executeQuery("call USPCgetClient( '"+ clientId +"' );")
    .then((data) => { res.send(data);},
          (error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.clientforgetwebaddress = function(req, res){
  const {email} = req.body;
    connection.executeQuery("call getClientURL( '"+ email +"' );")
    .then((data) => {
            const clienttype = data[0][0].clienttype;
            const url = data[0][0].redirecturi;

            var template = getForgetWebAddressEmailTemplate({clienttype:clienttype,url:url});
            var options = {
                        to: email,
                        subject: template.subject,
                        message: template.message ,
                        title : template.title,
                        clientid : 1,
                      }

            mail.sendMail(options);

      res.send(data);},
          (error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};
exports.signindetail = function(req, res){

  const {clientId} = req.body;

    connection.executeQuery("call USPCgetClient( '"+clientId+"');")
    .then((data) => {


          if(data[0] && data[0][0])
          {
                  data[0][0].organizationname = unescape(data[0][0].organizationname);
                  data[0][0].tagline = data[0][0].tagline ? unescape(data[0][0].tagline) : null;
                  data[0][0].gmapaddress = data[0][0].gmapaddress ? unescape(data[0][0].gmapaddress) : '';
                  data[0][0].address1 = data[0][0].address1 ? unescape(data[0][0].address1) : '';
                  data[0][0].address2 = data[0][0].address2 ? unescape(data[0][0].address2) : '';
                  data[0][0].city = data[0][0].city ? unescape(data[0][0].city) : '';
                  data[0][0].paymentgateway =   data[0][0].paymentgateway ? JSON.parse(data[0][0].paymentgateway) : null ;
                  data[0][0].paymentgatewaydetail =  data[0][0].paymentgateway ? data[0][0].paymentgateway: null;
                 data[0][0].paymentgateway =  data[0][0].paymentgateway ? data[0][0].paymentgateway.map(x =>x.status)[0] : null;
                 data[0][0].invoicebannerimage =   data[0][0].invoicebannerimage ? JSON.parse(data[0][0].invoicebannerimage) : null ;
                 data[0][0].currency = data[0][0].currency ? unescape(data[0][0].currency) : '₹';
                 data[0][0].hidememberbalanceandtransactions = data[0][0].hidememberbalanceandtransactions ? data[0][0].hidememberbalanceandtransactions : 0;
                 data[0][0].organizationbrandname = data[0][0].organizationbrandname ?  unescape(data[0][0].organizationbrandname) : '';


          }

      res.send(data);} ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

};
