var connection = require('../mysql/dbConnection');
var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var helpers = require('../helpers/encryption');
var {encryptmobile,enquiryencryptmobile} = require('../helpers/encryption');
var helper = require('../helpers/helpers');


exports.dashboardtodayreminderenquiry = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    req.body.userId = req.body.staffid ? req.body.staffid : 0;


    connection.executeQuery("call USPdashboardtodayreminderenquiry('"+ JSON.stringify(req.body) +"')").then((data) =>
        {
          data[0].map((x) => {
              x.id = helpers.encrypt(x.id.toString());
              var mobileno = enquiryencryptmobile(user,{mobile : x.mobile,emailid : x.emailid});
              x.mobile = mobileno.mobile;
              x.emailid = mobileno.emailid;
          })
           res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.dashboardtodayremindermember = function(req, res){
    const {client , user} = res.locals.oauth.token;
    let staffid = req.body.staffid ? req.body.staffid : 0;

    connection.executeQuery("call USPdashboardtodayremindermember('"+ client.id +"',"+req.body.branchid+","+req.body.followupbyfilter+",'"+staffid+"','"+req.body.client_timezoneoffsetvalue+"')").then((data) =>
        {
          data[0].map((x) => {
              x.id = helpers.encrypt(x.id.toString());

              var mobileno = encryptmobile(user,{mobile : x.mobile,emailid : x.personalemailid});
              x.mobile = mobileno.mobile;
              x.personalemailid = mobileno.emailid;

              x.installmentid = x.installmentid ? helpers.encrypt(x.installmentid.toString()) : "";
          })
           res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.dashboardtodaybirthday = function(req, res){
    const {client , user} = res.locals.oauth.token;

    connection.executeQuery("call USPdashboardtodaybirthday('"+ client.id +"',"+req.body.branchid+",'"+req.body.client_timezoneoffsetvalue+"')").then((data) =>
        { data[0].map((x) => {
			
			x.memberid = x.memberid ? helpers.encrypt(x.memberid.toString()) : null;
              var mobileno = encryptmobile(user,{mobile : x.mobile});
              x.mobile = mobileno.mobile;

          })

        res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.dashboardchartdata = function(req, res){
    const {client , user} = res.locals.oauth.token;
    let filtertype = req.body.activeTab;
    let month = req.body.month ;
    let year = req.body.year;

    connection.executeQuery("call USPdashboardNewenquiryVsNewMember('"+ client.id +"','"+filtertype+"',"+month+",'"+year+"',"+req.body.branchid+",'"+req.body.client_timezoneoffsetvalue+"')").then((data) =>
        {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.dashboardfootfallchart = function(req, res){
    const {client , user} = res.locals.oauth.token;
    let date = req.body.date ;

    connection.executeQuery("call USPdashboardfootfallchart('"+ client.id +"','"+date+"','"+req.body.attendancetype+"',"+req.body.branchid+",'"+req.body.client_timezoneoffsetvalue+"')").then((data) =>
        {  res.send(data);  },(error) =>{error.sqlMessage =="Table is not exists." ? res.send([]): res.status(500).send(getErrorMessageFromDatabase(error))})
};
exports.dashboardfootfallchartuser = function(req, res){
    const {client , user} = res.locals.oauth.token;
    let date = req.body.date ;

    connection.executeQuery("call USPdashboardfootfallchartuser('"+ client.id +"','"+date+"','"+req.body.attendancetype+"',"+req.body.branchid+",'"+req.body.client_timezoneoffsetvalue+"')").then((data) =>
        {  res.send(data);  },(error) => {error.sqlMessage =="Table is not exists." ? res.send([]): res.status(500).send(getErrorMessageFromDatabase(error))})
};
exports.dashboardmemberactiveinactivecount = function(req, res){
    const {client , user} = res.locals.oauth.token;

    connection.executeQuery("call USPdashboardmemberactiveinactivecount('"+ client.id +"',"+req.body.branchid+")").then((data) =>
        {  res.send(data);  },(error) =>  res.status(500).send(getErrorMessageFromDatabase(error)))
};
exports.dashboardenquirycount = function(req, res){
    const {client , user} = res.locals.oauth.token;

    connection.executeQuery("call USPdashboardenquirycount('"+ client.id +"',"+req.body.branchid+",'"+req.body.client_timezoneoffsetvalue+"')").then((data) =>
        {  res.send(data);  },(error) =>  res.status(500).send(getErrorMessageFromDatabase(error)))
};
exports.dashboardmembercount = function(req, res){
    const {client , user} = res.locals.oauth.token;

    connection.executeQuery("call USPdashboardregistrationcount('"+ client.id +"',"+req.body.branchid+",'"+req.body.client_timezoneoffsetvalue+"')").then((data) =>
        {  res.send(data);  },(error) =>  res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.dashboardenquirytoregistrationcount = function(req, res){
    const {client , user} = res.locals.oauth.token;

    connection.executeQuery("call USPdashboardenquirytoregistrationcount('"+ client.id +"',"+req.body.branchid+",'"+req.body.client_timezoneoffsetvalue+"')").then((data) =>
        {  res.send(data);  },(error) =>  res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.dashboardenquirytolostcount = function(req, res){
    const {client , user} = res.locals.oauth.token;

    connection.executeQuery("call USPdashboardnewenquirytolostcount('"+ client.id +"',"+req.body.branchid+",'"+req.body.client_timezoneoffsetvalue+"')").then((data) =>
        {  res.send(data);  },(error) =>  res.status(500).send(getErrorMessageFromDatabase(error)))
};
