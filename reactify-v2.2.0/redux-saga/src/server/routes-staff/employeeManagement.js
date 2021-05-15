var connection = require('../mysql/dbConnection');
var Helper = require('../helpers/helpers');
var helpers = require('../helpers/encryption');
var {getPathToUpload} = require('../helpers/file');
var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var {getForgetPasswordEmailTemplate}  = require('../template/email/ForgetWebAddress');
var mail = require ('../helpers/mail');
var Helpers = require('../helpers/encryption');
var Excel = require('exceljs');
var helper = require('../helpers/helpers');
var {deletebiomaxuser,uploadbiomaxuser} = require('../routes-staff/biomax');

var { writeLog } = require('../helpers/log');

exports.list = function(req, res){

    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;

    user.ip = req.clientIp;
    user.deviceinfo = req.headers.deviceinfo;
    var rights = helper.checkModuleRights(client,user, "employeemanagement","view")

    if(rights)
    {
    connection.executeQuery("call USPusersearch('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      if(req.body.exportXLSX)
      {
        try {
                if(!(data && data[0] && data[0].length > 0))
                {
                    return res.status(500).send({});
                }
                helper.checkModuleForChangedData(client,user,"employeemanagement","export", req.body);
                var workbook = new Excel.Workbook();
                var worksheet = workbook.addWorksheet('EmployeeReport');

                data[0].map((x) => {
                  x.dateofjoining = helper.getFormtedUTCDate(x.dateofjoining,'DD-MM-YYYY');
                  x.dateofresigning = helper.getFormtedUTCDate(x.dateofresigning,'DD-MM-YYYY');
                  x.address1 =  x.address1 ? unescape(x.address1) : '';
                  x.address2 =  x.address2 ? unescape(x.address2) : '';
                  x.city =  x.city ? unescape(x.city) : '';
                });

                var columns = [
                  { header: 'FIRST NAME', key: 'firstname' , width: 20},
                  { header: 'LAST NAME', key: 'lastname' , width: 20},
                  { header: 'EMPLOYEE CODE', key: 'employeecode', width: 15},
                  { header: 'ASSIGN ROLE', key: 'role' , width: 25},
                //  { header: 'SPECIALIZATION', key: 'specialization' , width: 25},
                  { header: 'SALARY', key: 'salary' , width:10},
                  { header: 'GENDER', key: 'gender' , width: 10},

                  { header: 'JOINING DATE', key: 'dateofjoining' , width: 13},
                  { header: 'RESIGNING DATE', key: 'dateofresigning' , width: 13},



                  { header: 'ADDRESS1', key: 'address1' , width: 30},
                  { header: 'ADDRESS2', key: 'address2' , width: 30},
                  { header: 'CITY', key: 'city' , width:20 },

                  { header: 'PINCODE', key: 'pincode' , width: 10},
                ];

                if(user.emailid_viewrights )
                {
                  columns.splice(3, 0,
                    { header: 'EMAILID', key: 'emailid' , width: 30});
                    columns.splice(10, 0,
                      { header: 'PERSONAL EMAILID', key: 'personalemailid' , width: 30});
                }

                if(user.mobile_viewrights)
                {
                   columns.splice(4, 0,
                     { header: 'MOBILE NO', key: 'mobile' , width: 13});
                   columns.splice(11, 0,
                       { header: 'PHONE NO', key: 'phone' , width: 13});
                }

                worksheet.columns = columns;


                worksheet.getRow(1).font = { bold: true };

                worksheet.addRows(data[0]);

                res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

                workbook.xlsx.write(res).then(function(){
                    res.end();
                });
            } catch(err) {
                writeLog({data : err});
                res.status(500).send(getErrorMessageFromDatabase());
            }
      }

    else {
        data[0].map((x) => {
          // var mobileno = Helpers.encryptmobile(user,{mobile : x.mobile,emailid : x.emailid});
          // x.mobile = mobileno.mobile;
          // x.emailid = mobileno.emailid;
          x.id = helpers.encrypt(x.id.toString());
          x.address1 =  x.address1 ? unescape(x.address1) : '';
          x.address2 =  x.address2 ? unescape(x.address2) : '';
          x.city =  x.city ? unescape(x.city) : '';
        })

          res.send(data); }
         },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
        }
      else {
            res.status(401).send(getErrorMessageFromDatabase());
          }
};

exports.delete = function(req, res){

  const {client , user} = res.locals.oauth.token;
  user.ip = req.clientIp;
  user.deviceinfo = req.headers.deviceinfo;
  req.body.id = helpers.decrypt(req.body.id);
  helper.checkModuleForChangedData(client,user,"employeemanagement","delete",req.body);

    connection.executeQuery("call USPuserdelete("+req.body.id+", "+ client.id +")").then((data) =>
        {
          if(req.body && req.body.SerialNumber)
          {
             deletebiomaxuser(req.body,res);
          }

           res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.view = function(req, res){
    const {client , user} = res.locals.oauth.token;

    connection.executeQuery("call USPuserviewedit("+helpers.decrypt(req.body.id)+",'"+client.id+"')").then((data) =>
        {
          if(data[0] && data[0][0])
          {
              data[0][0].password = helpers.decrypt(data[0][0].password);
              data[0][0].id = helpers.encrypt(data[0][0].id.toString());
              var mobileno = Helpers.encryptmobile(user,{mobile : data[0][0].mobile,emailid : data[0][0].emailid,phone : data[0][0].phone});
              data[0][0].encryptmobile =  mobileno.mobile;
              data[0][0].encryptemailid = mobileno.emailid;
              data[0][0].encryptphone = mobileno.phone;
              data[0][0].address1 =  data[0][0].address1 ? unescape(data[0][0].address1) : '';
              data[0][0].address2 =  data[0][0].address2 ? unescape(data[0][0].address2) : '';
              data[0][0].city =  data[0][0].city ? unescape(data[0][0].city) : '';
              data[0][0].defaultbranchname =  data[0][0].defaultbranchname ? unescape(data[0][0].defaultbranchname) : '';
              data[0][0].zonename =  data[0][0].zonename ? unescape(data[0][0].zonename) : '';
              data[0][0].professionaldetails =  data[0][0].professionaldetails ? unescape(data[0][0].professionaldetails) : '';
          }

           res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.save = function(req, res){

  const professionaldetail = JSON.parse(req.body.professionaldetail);
  const personaldetail = JSON.parse(req.body.personaldetail);
  const member = JSON.parse(req.body.member);
  const {client , user} = res.locals.oauth.token;
  user.ip = req.clientIp;
  user.deviceinfo = req.headers.deviceinfo;
  professionaldetail.firstname = professionaldetail.firstname.trim();
  professionaldetail.lastname = professionaldetail.lastname.trim();
  professionaldetail.fathername = professionaldetail.fathername.trim();
  professionaldetail.id = professionaldetail.id != "0" ?  helpers.decrypt(professionaldetail.id) : 0;
  professionaldetail.professionaldetails =  professionaldetail.professionaldetails ? escape(professionaldetail.professionaldetails) : '';
  professionaldetail.password = professionaldetail.password && professionaldetail.password.trim();


  personaldetail.address1 =  personaldetail.address1 ? escape(personaldetail.address1) : '';
  personaldetail.address2 =  personaldetail.address2 ? escape(personaldetail.address2) : '';
  personaldetail.city =  personaldetail.city ? escape(personaldetail.city) : '';

  var countryName = null;

       if(personaldetail.country.label)
       {
         if(personaldetail.country.id)
         {
               countryName = "'" + personaldetail.country.label  + "'" ;
         }
         else {
           let err = {};
           err.errorMessage = "Please select valid country from suggestion.";
           return res.status(500).send(err);
         }
       }


    let moduleoperation = professionaldetail.id != "0" ? 'update' :'add';
    helper.checkModuleForChangedData(client,user,"employeemanagement",moduleoperation,{professionaldetail,personaldetail});

  var dateofjoining = professionaldetail.dateofjoining;
  dateofjoining = dateofjoining != '' ? "'" + dateofjoining + "'" : null;
  var dateofresigning = professionaldetail.dateofresigning;
  dateofresigning = dateofresigning != '' ? "'" + dateofresigning + "'" : null;
  var dateofbirth = personaldetail.dateofbirth;
  dateofbirth = dateofbirth != '' ? "'" + dateofbirth + "'" : null;

personaldetail.bloodgroup =  personaldetail.bloodgroup || null;
professionaldetail.phone =  professionaldetail.phone || '';
professionaldetail.selectedzone =  professionaldetail.selectedzone != '' ? "'" + professionaldetail.selectedzone + "'" : null;
professionaldetail.selectedbranch =  professionaldetail.selectedbranch != '' ? professionaldetail.selectedbranch  :  req.body.branchid ;
professionaldetail.maxdiscountperitem = professionaldetail.maxdiscountperitem || null ;
professionaldetail.maxdiscountperinvoice = professionaldetail.maxdiscountperinvoice || null ;
professionaldetail.maxmonthlylimit = professionaldetail.maxmonthlylimit || null ;
professionaldetail.complimentarysalelimit = professionaldetail.complimentarysalelimit || null ;
professionaldetail.specialization =  professionaldetail.specialization || '';
professionaldetail.specialization = professionaldetail.specialization.split(",");
professionaldetail.ptcommssion = professionaldetail.ptcommssion || 0;
professionaldetail.enableonlinelisting = professionaldetail.enableonlinelisting || 0;
professionaldetail.enableonlinetraining = professionaldetail.enableonlinetraining || 0;
professionaldetail.commissiontypeId = professionaldetail.commissiontypeId || null ;
professionaldetail.daysforbackdatedinvoice = professionaldetail.daysforbackdatedinvoice || 0 ;
professionaldetail.selectedtimezone =  professionaldetail.selectedtimezone || '';

  var password = helpers.encrypt(professionaldetail.password);
  let err = {};

  if(req.files != null)
  {
        let file = req.files;
            file = file.files;

            const pathObj = getPathToUpload(client, file.name, 'UserProfile');

      	  	 if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
             file.mv(pathObj.pathForSave, function(err) {
      	              if (err)
                      {
                        err.errorMessage = "Internal server error";
                        writeLog({message : "Internal server erro " , data : err});
      	                return res.status(500).send(err);
                      }
                      connection.executeQuery("call USPusersave("+professionaldetail.id+","+professionaldetail.title+",'"+professionaldetail.firstname+"','"+
                       professionaldetail.lastname + "',"+ dateofjoining +","+ dateofresigning +",'"+
                       professionaldetail.emailid+"','"+ password +"',"+professionaldetail.gender+",'"+
                       personaldetail.panno+"','"+ pathObj.pathForDB +"','"+professionaldetail.assignrole+"','"+ JSON.stringify(professionaldetail.specialization) +"','"+
                       professionaldetail.phone+"','"+professionaldetail.mobile+"','"+professionaldetail.fathername+"','"+personaldetail.contactnumber+"',  '"+
                       personaldetail.personalemailid+"',"+ personaldetail.bloodgroup +","+ dateofbirth +",'"+
                       personaldetail.address1+"','"+personaldetail.address2+"','"+
                       personaldetail.city+"','"+ personaldetail.state +"',"+countryName+",'"+personaldetail.pincode+"','"+ professionaldetail.status +"','" +
                       client.id+"',"+professionaldetail.salary+",'0','"+professionaldetail.ismembermobilevisible+"','"+professionaldetail.ismemberemailidvisible+"',"+
                       professionaldetail.selectedbranch+","+professionaldetail.selectedzone+",'" +user.id+"','"+professionaldetail.isenquirymobilevisible+"','"+
                       professionaldetail.isenquiryemailidvisible+"','"+professionaldetail.appaccess+"','"+professionaldetail.istrainer+"','"+
                       professionaldetail.enablecomplimentarysale+"','"+professionaldetail.enablediscount+"','"+professionaldetail.enablediscountlimit+"',"+
                       professionaldetail.maxdiscountperitem+","+professionaldetail.maxdiscountperinvoice+","+professionaldetail.maxmonthlylimit+","+professionaldetail.isbiometriclogs+","+
                       professionaldetail.complimentarysalelimit+","+professionaldetail.enableonlinelisting+","+professionaldetail.ptcommssion+","+
                       professionaldetail.enableonlinetraining+",'"+professionaldetail.professionaldetails+"',"+professionaldetail.commissiontypeId+","+
                       professionaldetail.daysforbackdatedinvoice+",'"+JSON.stringify(personaldetail.duration)+"','"+JSON.stringify(personaldetail.schedule)+"','"+
                       professionaldetail.selectedtimezone+"');").then((data) =>
                       {
                           if(data[0] && data[0][0]){
                             member.userid = member.userid + data[0][0].employeecode;
                           }
                           if(member && member.SerialNumber)
                           {
                                 if(professionaldetail.id == 0){
                                   uploadbiomaxuser(member,res)
                                 }
                                 else if (professionaldetail.id != 0 && professionaldetail.status == 2 && member.oldStatus != professionaldetail.status) {
                                   deletebiomaxuser(member,res)
                                 }
                                 else if (professionaldetail.id != 0 && professionaldetail.status == 1 && member.oldStatus != professionaldetail.status) {
                                   uploadbiomaxuser(member,res)
                                 }
                                res.send(data);
                             }
                           else {
                              res.send(data);
                           }
                         },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))


          });
      }
      else {
        err.errorMessage = "File type not supported.";
        writeLog({message : "File type not supported. " , data : file.mimetype});
        return res.status(500).send(err);
      }
    }
    else {
      let pathForImage = professionaldetail.image ? "'" + professionaldetail.image + "'" : null;

      connection.executeQuery("call USPusersave("+professionaldetail.id+","+professionaldetail.title+",'"+professionaldetail.firstname+"','"+
       professionaldetail.lastname + "',"+ dateofjoining +","+ dateofresigning +",'"+
       professionaldetail.emailid+"','"+ password +"',"+professionaldetail.gender+",'"+
       personaldetail.panno+"',"+ pathForImage +",'"+professionaldetail.assignrole+"','"+JSON.stringify(professionaldetail.specialization) +"','"+
       professionaldetail.phone+"','"+professionaldetail.mobile+"','"+professionaldetail.fathername+"','"+personaldetail.contactnumber+"',  '"+
       personaldetail.personalemailid+"',"+ personaldetail.bloodgroup +","+ dateofbirth +",'"+
       personaldetail.address1+"','"+personaldetail.address2+"','"+
       personaldetail.city+"','"+ personaldetail.state +"',"+countryName+",'"+personaldetail.pincode+"','"+ professionaldetail.status +"','" +
       client.id+"',"+professionaldetail.salary+",'0','"+professionaldetail.ismembermobilevisible+"','"+professionaldetail.ismemberemailidvisible+"',"+professionaldetail.selectedbranch+","+professionaldetail.selectedzone+",'" +
       user.id+"','"+professionaldetail.isenquirymobilevisible+"','"+professionaldetail.isenquiryemailidvisible+"','"+professionaldetail.appaccess+"','"+professionaldetail.istrainer+"','"+
       professionaldetail.enablecomplimentarysale+"','"+professionaldetail.enablediscount+"','"+professionaldetail.enablediscountlimit+"',"+
       professionaldetail.maxdiscountperitem+","+professionaldetail.maxdiscountperinvoice+","+professionaldetail.maxmonthlylimit+","+professionaldetail.isbiometriclogs+","+
       professionaldetail.complimentarysalelimit+","+professionaldetail.enableonlinelisting+","+professionaldetail.ptcommssion+","+professionaldetail.enableonlinetraining+",'"+
       professionaldetail.professionaldetails+"',"+professionaldetail.commissiontypeId+","+professionaldetail.daysforbackdatedinvoice+",'"+
       JSON.stringify(personaldetail.duration)+"','"+JSON.stringify(personaldetail.schedule)+"','"+
       professionaldetail.selectedtimezone+"');").then((data) =>
       {
         if(data[0] && data[0][0]){
           member.userid = member.userid + data[0][0].employeecode;
         }
         if(member && member.SerialNumber)
         {
           if(professionaldetail.id == 0){
             uploadbiomaxuser(member,res)
           }
           else if (professionaldetail.id != 0 && professionaldetail.status == 2 && member.oldStatus != professionaldetail.status) {
             deletebiomaxuser(member,res)
           }
           else if (professionaldetail.id != 0 && professionaldetail.status == 1 && member.oldStatus != professionaldetail.status) {
             uploadbiomaxuser(member,res)
           }
              res.send(data);
         }
         else {
            res.send(data);
         }
       },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

    }
}

exports.getuserprofile = function(req, res){
    const {client , user} = res.locals.oauth.token;
    connection.executeQuery("call USPuserviewprofile('"+user.id+"','"+client.id+"')").then((data) =>
        {

            if(data[0] && data[0][0])
            {

                  data[0][0].encryptid = helpers.encrypt(data[0][0].id.toString());
                  data[0][0].address1 =  data[0][0].address1 ? unescape(data[0][0].address1) : '';
                  data[0][0].address2 =  data[0][0].address2 ? unescape(data[0][0].address2) : '';
                  data[0][0].city =  data[0][0].city ? unescape(data[0][0].city) : '';
                  data[0][0].defaultbranchname =  data[0][0].defaultbranchname ? unescape(data[0][0].defaultbranchname) : '';
                  data[0][0].professionaldetails =  data[0][0].professionaldetails ? unescape(data[0][0].professionaldetails) : '';
                  data[0][0].daysforbackdatedinvoice =  data[0][0].daysforbackdatedinvoice;

              }
           res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.clientforgetpassword = function(req, res){
  const {email} = req.body;
  const {clientId,logintype} = req.body;
    connection.executeQuery("call USPgetuserforgetpassword('"+clientId+"' ,'"+ email +"','"+logintype+"' );")
    .then((data) => {
          const password = data[0][0].userpassword ?  helpers.decrypt(data[0][0].userpassword) : '' ;

            var template = getForgetPasswordEmailTemplate({password:password});
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

exports.getclientprofile = function(req, res){
    const {client , user} = res.locals.oauth.token;
    var rights = true;
    req.body.branchid = req.body.branchid ? req.body.branchid : user.defaultbranchid;

    if(rights)
    {
    connection.executeQuery("call USPclientview('"+client.id+"',"+req.body.branchid+")").then((data) =>
        {
          if(data[0] && data[0][0])
           {
                   data[0][0].organizationname = unescape(data[0][0].organizationname);
                   data[0][0].tagline = data[0][0].tagline ? unescape(data[0][0].tagline) : '';
                   data[0][0].paymentgateway =   data[0][0].paymentgateway ? JSON.parse(data[0][0].paymentgateway) : null ;
                   // data[0][0].paymentgateway =  data[0][0].paymentgateway ? data[0][0].paymentgateway.map(x => {return {"status" : x.status,"configurationtype" : x.configurationtype, "configurationvalue" : x.configurationvalue}}) : null;
                   data[0][0].invoicebannerimage =   data[0][0].invoicebannerimage ? JSON.parse(data[0][0].invoicebannerimage) : null ;
                   data[0][0].termsconditions = data[0][0].termsconditions ? unescape(data[0][0].termsconditions) : '';
                   data[0][0].footermessge = data[0][0].footermessge ? unescape(data[0][0].footermessge) : '';
                   data[0][0].organizationbrandname = data[0][0].organizationbrandname ?  unescape(data[0][0].organizationbrandname) : '';

           }
           res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
         }
     else {
             res.status(401).send(getErrorMessageFromDatabase());
           }
};

exports.getbranchprofile = function(req, res){
    const {client , user} = res.locals.oauth.token;
    var rights = true;
    req.body.branchid = req.body.branchid ? req.body.branchid : user.defaultbranchid;

    if(rights)
    {
    connection.executeQuery("call USPbranchprofileview('"+client.id+"',"+req.body.branchid+")").then((data) =>
        {
          if(data[0] && data[0][0])
           {
                   data[0][0].gmapaddress = data[0][0].gmapaddress ? unescape(data[0][0].gmapaddress) : '';
                   data[0][0].address1 = data[0][0].address1 ? unescape(data[0][0].address1) : '';
                   data[0][0].address2 = data[0][0].address2 ? unescape(data[0][0].address2) : '';
                   data[0][0].city = data[0][0].city ? unescape(data[0][0].city) : '';
                   data[0][0].description = data[0][0].description ? unescape(data[0][0].description) : '';

           }
           res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
         }
     else {
             res.status(401).send(getErrorMessageFromDatabase());
           }
};

exports.saveclientprofile = function(req, res){

  const profiledetail = req.body.profiledetail;
  profiledetail.organizationname = profiledetail.organizationname.trim();
  profiledetail.description =  profiledetail.description ? escape(profiledetail.description) : '';
  profiledetail.gmapaddress =  profiledetail.gmapaddress ? escape(profiledetail.gmapaddress) : '';
  profiledetail.organizationname = profiledetail.organizationname ? escape(profiledetail.organizationname) : '';
  profiledetail.address1 = profiledetail.address1 ? escape(profiledetail.address1) : '';
  profiledetail.address2 = profiledetail.address2 ? escape(profiledetail.address2) : '';
  profiledetail.city = profiledetail.city ? escape(profiledetail.city) : '';
  profiledetail.latitude = profiledetail.latitude ? profiledetail.latitude : '';
  profiledetail.longitude = profiledetail.longitude ? profiledetail.longitude : '';
  profiledetail.slotduration = profiledetail.slotduration || null;
  profiledetail.slotmaxoccupancy = profiledetail.slotmaxoccupancy || 0;
  profiledetail.cancelgymaccessslothour = profiledetail.cancelgymaccessslothour || null;
  profiledetail.cancelptslothour = profiledetail.cancelptslothour || null;
  profiledetail.cancelclassslothour = profiledetail.cancelclassslothour || null;
  profiledetail.ptslotdetail = {};
  profiledetail.ptslotdetail.ptslotdurationId = profiledetail.ptslotduration;
  profiledetail.ptslotdetail.ptslotdurationlabel = profiledetail.ptslotdurationlabel;
  profiledetail.ptslotdetail.ptslotmaxdays = profiledetail.ptslotmaxdays;
  profiledetail.ptslotdetail.ptslotmaxoccupancy = profiledetail.ptslotmaxoccupancy;
  profiledetail.classmaxdays = profiledetail.classmaxdays || null;
  profiledetail.ptslotdetail.restbetweentwoptslotId = profiledetail.restbetweentwoptslot;
  profiledetail.ptslotdetail.restbetweentwoptslotlabel = profiledetail.restbetweentwoptslotlabel;

  var countryName = null;

       if(profiledetail.country.label)
       {
         if(profiledetail.country.id)
         {
               countryName = "'" + profiledetail.country.label  + "'" ;
         }
         else {
           let err = {};
           err.errorMessage = "Please select valid country from suggestion.";
           return res.status(500).send(err);
         }
       }

  var starttime = Helper.convertToMysqlTimefromJSDate(profiledetail.starttime);
  starttime = starttime != '' ? "'" + starttime + "'" : null;
  var endtime = Helper.convertToMysqlTimefromJSDate(profiledetail.endtime);
  endtime = endtime != '' ? "'" + endtime + "'" : null;

  var starttime1 = Helper.convertToMysqlTimefromJSDate(profiledetail.starttime1);
  starttime1 = starttime1 != '' ? "'" + starttime1 + "'" : null;
  var endtime1 = Helper.convertToMysqlTimefromJSDate(profiledetail.endtime1);
  endtime1 = endtime1 != '' ? "'" + endtime1 + "'" : null;


  const {client , user} = res.locals.oauth.token;
  user.ip = req.clientIp;
  user.deviceinfo = req.headers.deviceinfo;

  helper.checkModuleForChangedData(client,user,"organization",'saveclientprofile',profiledetail);

       connection.executeQuery("call USPclientsave("+profiledetail.id+",'"+profiledetail.organizationname+"','"+profiledetail.useremail+"','"+
       profiledetail.mobile + "','"+
       profiledetail.address1+"','"+profiledetail.address2+"','"+
       profiledetail.city+"','"+ profiledetail.state +"',"+countryName+",'"+profiledetail.pincode+"','"+
       profiledetail.description +"','"+ profiledetail.gmapaddress +"','"+profiledetail.latitude+"','"+
       profiledetail.longitude+"','"+user.id+"','"+JSON.stringify(profiledetail.schedule)+"',"+profiledetail.gymaccessslot+","+
       profiledetail.slotduration+","+profiledetail.slotmaxoccupancy+","+profiledetail.slotmaxdays+",'"+JSON.stringify(profiledetail.ptslotdetail)+"',"+profiledetail.cancelgymaccessslothour+","+
       profiledetail.cancelptslothour+","+profiledetail.cancelclassslothour+","+profiledetail.classmaxdays+","+profiledetail.gapbetweentwogymaccessslot+",'"+JSON.stringify(profiledetail.duration)+"');").then((data) => res.send(data),(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

}

exports.savechangepassword = function(req, res){

  const { changePassword } = req.body;

  const {client , user} = res.locals.oauth.token;
  user.ip = req.clientIp;
  user.deviceinfo = req.headers.deviceinfo;
  helper.checkModuleForChangedData(client,user,"organization",'changepassword',changePassword);
  var oldpassword = helpers.encrypt(changePassword.oldpassword);
  var newpassword = helpers.encrypt(changePassword.newpassword);

      connection.executeQuery("call USPuserchangepassword('"+user.id+"','"+oldpassword+"','"+newpassword+"','"+client.id+"');")
       .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

    };

    exports.saveusertheme = function(req, res){
        const {client , user} = res.locals.oauth.token;
        connection.executeQuery("call USPusersettheme('"+ JSON.stringify(req.body) +"','"+user.id+"','"+client.id+"')").then((data) =>
            {
               res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
    };
    exports.saveconfiguration = function(req, res){

      const configurationdetail = req.body.configurationdetail;
      const {client , user} = res.locals.oauth.token;
      user.ip = req.clientIp;
      user.deviceinfo = req.headers.deviceinfo;
      helper.checkModuleForChangedData(client,user,"organization",'savebasicconfiguration',configurationdetail);
          connection.executeQuery("call USPsequencesave('"+configurationdetail.employeecode+"','"+configurationdetail.membercode+"','"+configurationdetail.enquirycode+"',"+configurationdetail.hidememberbalanceandtransactions+",'"+client.id+"');")
           .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

        };
  exports.viewconfiguration = function(req, res){

                const {client , user} = res.locals.oauth.token;
                user.ip = req.clientIp;
                user.deviceinfo = req.headers.deviceinfo;

                var rights = helper.checkModuleRights(client,user,"organization","view")

                if(rights){
                  connection.executeQuery("call USPsequenceview('"+client.id+"')").then((data) =>
                      {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

                }
                        else {
                        res.status(401).send(getErrorMessageFromDatabase());
                      }
               };
        exports.savepaymentgatewayconfiguration = function(req, res){

          const paymentgatewaydetail = req.body;

          const {client , user} = res.locals.oauth.token;
          user.ip = req.clientIp;
          user.deviceinfo = req.headers.deviceinfo;
          helper.checkModuleForChangedData(client,user,"organization",'savepaymentgateway',paymentgatewaydetail);
              connection.executeQuery("call USPclientpaymentgatewaysave('"+JSON.stringify(paymentgatewaydetail)+"','"+client.id+"');")
               .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

            };
            exports.savepaymentgatewayconfigurationsave = function(req, res){

              const paymentgatewaydetail = req.body;

              const {client , user} = res.locals.oauth.token;
              user.ip = req.clientIp;
              user.deviceinfo = req.headers.deviceinfo;
              helper.checkModuleForChangedData(client,user,"organization",'savepaymentgatewaysstatus',paymentgatewaydetail);
                  connection.executeQuery("call USPclientpaymentgatewaystatussave('"+JSON.stringify(paymentgatewaydetail)+"','"+client.id+"');")
                   .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

                };
        exports.userunitsave = function(req, res){
            const {client , user} = res.locals.oauth.token;
            connection.executeQuery("call USPuserunitsave('"+JSON.stringify(req.body)+"','"+user.id+"','"+client.id+"')").then((data) =>
                {
                   res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
        };

        exports.saveclientsocialmedia = function(req, res){
          const {client , user} = res.locals.oauth.token;
          user.ip = req.clientIp;
          user.deviceinfo = req.headers.deviceinfo;
          helper.checkModuleForChangedData(client,user,"organization",'savesocialmedia',req.body);

              connection.executeQuery("call USPclientsocialmediasave('"+client.id+"','"+JSON.stringify(req.body.configuration)+"');")
               .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

            };

    exports.saveclientbranding = function(req, res){

        const brandingdetail = JSON.parse(req.body.brandingDetail);
        brandingdetail.tagline = brandingdetail.tagline || '' ;

        const {client , user} = res.locals.oauth.token;
        user.ip = req.clientIp;
        user.deviceinfo = req.headers.deviceinfo;
        helper.checkModuleForChangedData(client,user,"branding",'update',brandingdetail);
             let pathForDBsignin = [];
             let pathObjlogo = [];
             let pathForDBmemberprofile = [];
             let pathForDBsidebar = [];
             let pathForDBInvoice = [];

              if((req.files && req.files.logofiles && req.files.logofiles != null) || (brandingdetail.logoimage))
              {
                if(req.files && req.files.logofiles)
                {
                  let logofile = req.files.logofiles;

                       pathObjlogo = getPathToUpload(client, logofile.name, 'ClientLogo');

                       if(logofile.mimetype == "image/jpeg" ||logofile.mimetype == "image/png"||logofile.mimetype == "image/gif" ){
                       logofile.mv(pathObjlogo.pathForSave, function(err) {
                                if (err)
                                {
                                  err.errorMessage = "Internal server error";
                                  return res.status(500).send(err);
                                }
                          });
                        }
                        else {
                          err.errorMessage = "File type not supported.";
                          return res.status(500).send(err);
                        }
                  }
                  else {
                      brandingdetail.logoimage = brandingdetail.logoimage ? "'" + brandingdetail.logoimage + "'" : null;
                  }
               }

                 if((req.files && req.files.signinfilespotrait) || (brandingdetail.signinpotraitimages))
                 {
                   if(req.files && req.files.signinfilespotrait)
                   {
                      let signinfilepotrait = req.files.signinfilespotrait;

                        let pathObjsigninpotrait = getPathToUpload(client, signinfilepotrait.name, 'ClientSigninBackgroundPotrait');

                         if(signinfilepotrait.mimetype == "image/jpeg" ||signinfilepotrait.mimetype == "image/png"||signinfilepotrait.mimetype == "image/gif" ){
                          signinfilepotrait.mv(pathObjsigninpotrait.pathForSave, function(err) {
                                  if (err)
                                   {
                                     err.errorMessage = "Internal server error";
                                    return res.status(500).send(err);
                                   }
                             });
                               pathForDBsignin.push({file : pathObjsigninpotrait.pathForDB , isMobile : true});
                           }
                           else {
                             err.errorMessage = "File type not supported.";
                             return res.status(500).send(err);
                           }
                      }
                      else {
                            brandingdetail.signinpotraitimages && brandingdetail.signinpotraitimages.map((existingImage) => pathForDBsignin.push({file : existingImage , isMobile : true}));
                      }
                    }

                   if (req.files && req.files.signinfileslandscape || (brandingdetail.signinlandscapeimages)) {
                     if(req.files && req.files.signinfileslandscape)
                     {
                        let signinfilelandscape = req.files.signinfileslandscape;

                          let pathObjsigninlandscape = getPathToUpload(client, signinfilelandscape.name, 'ClientSigninBackgroundLandcape');

                           if(signinfilelandscape.mimetype == "image/jpeg" ||signinfilelandscape.mimetype == "image/png"||signinfilelandscape.mimetype == "image/gif" ){
                            signinfilelandscape.mv(pathObjsigninlandscape.pathForSave, function(err) {
                                    if (err)
                                     {
                                       err.errorMessage = "Internal server error";
                                      return res.status(500).send(err);
                                     }
                               });
                                 pathForDBsignin.push({file : pathObjsigninlandscape.pathForDB , isMobile : false});
                             }
                             else {
                               err.errorMessage = "File type not supported.";
                               return res.status(500).send(err);
                             }
                       }
                       else {
                              brandingdetail.signinlandscapeimages && brandingdetail.signinlandscapeimages.map((existingImage) => pathForDBsignin.push({file : existingImage , isMobile : false}));
                       }
                    }

                  if((req.files && req.files.memberprofilefiles && req.files.memberprofilefiles != null) || (brandingdetail.memberprofileimages))
                    {
                      if(req.files && req.files.memberprofilefiles)
                      {
                         let memberprofilefile = req.files.memberprofilefiles;

                           let pathObjmemberprofile = getPathToUpload(client, memberprofilefile.name, 'ClientMemberProfileBanner');

                            if(memberprofilefile.mimetype == "image/jpeg" ||memberprofilefile.mimetype == "image/png"||memberprofilefile.mimetype == "image/gif" ){
                             memberprofilefile.mv(pathObjmemberprofile.pathForSave, function(err) {
                                     if (err)
                                      {
                                        err.errorMessage = "Internal server error";
                                       return res.status(500).send(err);
                                      }
                                });
                                  pathForDBmemberprofile.push(pathObjmemberprofile.pathForDB);
                              }
                              else {
                                err.errorMessage = "File type not supported.";
                                return res.status(500).send(err);
                              }
                         }
                         else {
                                 brandingdetail.memberprofileimages && brandingdetail.memberprofileimages.map((existingImage) => pathForDBmemberprofile.push(existingImage));
                             }
                       }


                       if((req.files && req.files.invoicefiles && req.files.invoicefiles != null) || (brandingdetail.invoiceimages))
                         {
                           if(req.files && req.files.invoicefiles)
                           {
                              let invoicefiles = req.files.invoicefiles;

                                let pathObjinvoice = getPathToUpload(client, invoicefiles.name, 'ClientInvoiceBanner');

                                 if(invoicefiles.mimetype == "image/jpeg" ||invoicefiles.mimetype == "image/png"||invoicefiles.mimetype == "image/gif" ){
                                  invoicefiles.mv(pathObjinvoice.pathForSave, function(err) {
                                          if (err)
                                           {
                                             err.errorMessage = "Internal server error";
                                            return res.status(500).send(err);
                                           }
                                     });
                                       pathForDBInvoice.push(pathObjinvoice.pathForDB);
                                   }
                                   else {
                                     err.errorMessage = "File type not supported.";
                                     return res.status(500).send(err);
                                   }
                              }
                              else {
                                      brandingdetail.invoiceimages && brandingdetail.invoiceimages.map((existingImage) => pathForDBInvoice.push(existingImage));
                                  }
                            }

                if((req.files && req.files.sidebarfiles && req.files.sidebarfiles != null) || (brandingdetail.sidebarimages))
                  {
                    if(req.files && req.files.sidebarfiles)
                    {
                      let filessidebar = req.files.sidebarfiles;

                          let imageList = [];
                            if(!filessidebar.length)
                            {
                              imageList.push(filessidebar)
                            }
                            else {
                              imageList = filessidebar;
                            }

                          imageList && imageList.map((imagefile) =>
                          {
                               if(imagefile.mimetype == "image/jpeg" ||imagefile.mimetype == "image/png"||imagefile.mimetype == "image/gif" )
                               {
                                 let pathObjsidebar = getPathToUpload(client, imagefile.name, 'ClientMemberSidebar');
                                      imagefile.mv(pathObjsidebar.pathForSave, function(err)
                                      {
                                        if (err)
                                        {
                                          err.errorMessage = "Internal server error";
                                          return res.status(500).send(err);
                                        }
                                      });
                                      pathForDBsidebar.push(pathObjsidebar.pathForDB);

                                    if(imageList.length == pathForDBsidebar.length)
                                    {
                                      brandingdetail.sidebarimages && brandingdetail.sidebarimages.map((existingImage) => pathForDBsidebar.push(existingImage));
                                    }
                                }
                                else {
                                  err.errorMessage = "File type not supported.";
                                  return res.status(500).send(err);
                                }
                          });
                      }
                     else {
                        brandingdetail.sidebarimages && brandingdetail.sidebarimages.map((existingImage) => pathForDBsidebar.push(existingImage));
                     }
                 }

                  let logo = pathObjlogo.pathForDB ? "'" + pathObjlogo.pathForDB  + "'"  : (brandingdetail.logoimage ? brandingdetail.logoimage : null);

                     connection.executeQuery("call USPclientbrandsave("+client.id+","+logo+",'" +
                     escape(brandingdetail.tagline)+"','"+JSON.stringify(pathForDBsignin)+"','"+JSON.stringify(pathForDBmemberprofile)+"','"+JSON.stringify(pathForDBsidebar)+"','"+
                     JSON.stringify(pathForDBInvoice)+"','"+brandingdetail.singninfontportrait+"','"+brandingdetail.singninfontlandscap +"','" +escape(brandingdetail.brandname)+"');").then((data) => res.send(data),(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
        };

        exports.saveattendance = function(req, res){

          const {client , user} = res.locals.oauth.token;
          const data = req.body;
          data.attendancetype =  data.attendancetype || null;
          data.id = data.id ? helpers.decrypt(data.id) : 0;
          data.distance = data.distance ? data.distance : null;
          var intime =  data.id > 0 ? Helper.convertToMysqlDatefromJSDate(data.intime) :  Helper.convertToMysqlDatefromJSDate(data.attendenceDate);
          intime = intime != '' ? "'" + intime + "'" : null;

          var outtime = Helper.convertToMysqlDatefromJSDate(data.outtime);
          outtime = outtime != '' ? "'" + outtime + "'" : null;

          let attendanceType = data.attendancetype;

          var usercode = data.usercode;


          connection.executeQuery("call USPuserattendanceSave("+data.id+",'"+usercode+"','"+user.id+"','"+
          client.id+"',"+intime+","+outtime+","+data.branchid+","+data.distance+");")
           .then((data) =>   {
              let userid = data[0][0]._userid;
               data[0].map((x) => {
                 x.id = helpers.encrypt(x.id.toString());
               })
             res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

            };


            exports.getattendance = function(req, res){

                const {client , user} = res.locals.oauth.token;
                req.body.clientId = client.id;
                req.body.userId = user.id;

                user.ip = req.clientIp;
                user.deviceinfo = req.headers.deviceinfo;
                var rights = helper.checkModuleRights(client,user,"staffattendance","view")

                if(rights)
                {
                connection.executeQuery("call USPreportuserattendance('"+ JSON.stringify(req.body) +"')").then((data) =>

                {
                    data[0].map((x) => {
                      var mobileno =  Helpers.encryptmobile(user,{mobile : x.mobile});
                      x.mobile = mobileno.mobile;
                         x.id = helpers.encrypt(x.id.toString());
                    })
                     res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                   }
                   else {
                     res.status(401).send(getErrorMessageFromDatabase());
                   }
            };

            exports.deleteattendance = function(req, res){
                const {client , user} = res.locals.oauth.token;
                connection.executeQuery("call USPuserattendancedelete("+helpers.decrypt(req.body.id)+",'"+client.id+"','"+user.id+"')").then((data) =>
                    {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
            };
            exports.savetax = function(req, res){
                const {client , user} = res.locals.oauth.token;
                user.ip = req.ip;
                const taxdetail = req.body.taxdetail;
                taxdetail.taxname = taxdetail.taxname.trim();
                taxdetail.id = taxdetail.id != "0" ?  helpers.decrypt(taxdetail.id) : 0;
                if(taxdetail.istextgroup){
                    taxdetail.taxgroupitem =  taxdetail.taxgroupitem;
                }
                else{
                    taxdetail.taxgroupitem = null;
                }
                user.deviceinfo = req.headers.deviceinfo;
                helper.checkModuleForChangedData(client,user,"organization",'savetax',req.body);

                taxdetail.taxpercentage =  taxdetail.taxpercentage || null;
                taxdetail.taxgroupitem = taxdetail.taxgroupitem != null ? "'" +  JSON.stringify(taxdetail.taxgroupitem) + "'" : null;
                taxdetail.country =  taxdetail.country || '';

                    connection.executeQuery("call USPtaxsave("+taxdetail.id+",'"+client.id+"','"+taxdetail.taxname+"',"+taxdetail.taxpercentage+","+taxdetail.taxgroupitem+",'"+taxdetail.country+"');")
                       .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                  };
            exports.gettaxes = function(req, res){
                const {client , user} = res.locals.oauth.token;
                  req.body.clientId = client.id;
                  connection.executeQuery("call USPtaxsearch('"+ JSON.stringify(req.body) +"')").then((data) =>
                      {  data[0].map((x) => {
                        x.id = helpers.encrypt(x.id.toString());
                        x.taxgroupitem = x.taxgroupitem ? JSON.parse(x.taxgroupitem) : null
                        })
                        res.send(data);  });
                  };
              exports.savetaxconfiguration = function(req, res){
                      const {client , user} = res.locals.oauth.token;
                      user.ip = req.ip;
                      user.deviceinfo = req.headers.deviceinfo;
                      const taxdetail = JSON.parse(req.body.taxdetail);
                      let err = {};

                      taxdetail.termsconditions = taxdetail.termsconditions ? escape(taxdetail.termsconditions) : '';
                      taxdetail.footermessge = taxdetail.footermessge ? escape(taxdetail.footermessge) : '';

                      helper.checkModuleForChangedData(client,user,"organization",'savetaxconfiguration',{taxdetail});


                      if(req.files != null)
                      {
                            let file = req.files;
                                file = file.files;

                                const pathObj = getPathToUpload(client, file.name, 'AuthrisedSignature');

                                 if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                 file.mv(pathObj.pathForSave, function(err) {
                                          if (err)
                                          {
                                            err.errorMessage = "Internal server error";
                                            writeLog({message : "Internal server erro " , data : err});
                                            return res.status(500).send(err);
                                          }

                                          connection.executeQuery("call USPclienttaxconfigurationsave('"+client.id+"','"+taxdetail.istaxenable+"','"+taxdetail.taxtype+"','"+
                                          taxdetail.gstin+"','"+taxdetail.printtype+"','"+taxdetail.discounttype+"','"+taxdetail.termsconditions+"','"+taxdetail.footermessge+"','"+
                                          pathObj.pathForDB+"','"+JSON.stringify(taxdetail.cardswipedetail)+"','"+taxdetail.termsconditionstype+"',"+
                                          taxdetail.isshowpaymentdetailingstinvoice+","+taxdetail.showbenefitininvoice+");")
                                             .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))


                              });
                          }
                          else {
                            err.errorMessage = "File type not supported.";
                            writeLog({message : "File type not supported. " , data : file.mimetype});
                            return res.status(500).send(err);
                          }
                        }
                        else {
                          let pathForImage = taxdetail.signimage ? "'" + taxdetail.signimage + "'" : null;

                          connection.executeQuery("call USPclienttaxconfigurationsave('"+client.id+"','"+taxdetail.istaxenable+"','"+taxdetail.taxtype+"','"+
                          taxdetail.gstin+"','"+taxdetail.printtype+"','"+taxdetail.discounttype+"','"+taxdetail.termsconditions+"','"+taxdetail.footermessge+"',"+
                          pathForImage+",'"+JSON.stringify(taxdetail.cardswipedetail)+"','"+taxdetail.termsconditionstype+"',"+
                          taxdetail.isshowpaymentdetailingstinvoice+","+taxdetail.showbenefitininvoice+");")
                             .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

                        }



                                  };
              exports.viewtax = function(req, res){
                      const {client , user} = res.locals.oauth.token;

                      connection.executeQuery("call USPtaxview("+helpers.decrypt(req.body.id)+",'"+client.id+"')").then((data) =>
                                {
                                  if(data[0] && data[0][0])
                                  {
                                    data[0][0].id = helpers.encrypt(data[0][0].id.toString());
                                    data[0][0].taxgroupitem = data[0][0].taxgroupitem ? JSON.parse(data[0][0].taxgroupitem) : null

                                    }
                                   res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                        };
              exports.deletetax = function(req, res){

                          const {client , user} = res.locals.oauth.token;
                          user.ip = req.ip;
                          user.deviceinfo = req.headers.deviceinfo;
                          req.body.id = helpers.decrypt(req.body.id);
                          helper.checkModuleForChangedData(client,user,"organization","delete",req.body);

                            connection.executeQuery("call USPtaxdelete("+req.body.id+", "+ client.id +")").then((data) =>
                                {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                        };
              exports.savetaxcodecategory = function(req, res){
                            const {client , user} = res.locals.oauth.token;
                            user.ip = req.ip;
                            const {taxCategorydetail} = req.body;
                            taxCategorydetail.id = taxCategorydetail.id != "0" ?  helpers.decrypt(taxCategorydetail.id) : 0;
                            taxCategorydetail.taxcategoryname = taxCategorydetail.taxcategoryname.trim();
                            user.deviceinfo = req.headers.deviceinfo;
                            helper.checkModuleForChangedData(client,user,"organization",'savetaxcodecategory',req.body);

                            taxCategorydetail.taxcode =  taxCategorydetail.taxcode || null;
                            taxCategorydetail.taxcodecategorytype =  taxCategorydetail.taxcodecategorytype || null;
                            taxCategorydetail.country =  taxCategorydetail.country || '';

                                connection.executeQuery("call USPtaxcodecategorysave("+taxCategorydetail.id+",'"+taxCategorydetail.taxcategoryname+"',"+taxCategorydetail.taxcode+","+taxCategorydetail.taxgroup+",'"+client.id+"','"+user.id+"','"+taxCategorydetail.taxcodecategorytype+"','"+taxCategorydetail.country+"');")
                                   .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
              };
              exports.gettaxcodecategories = function(req, res){
                  const {client , user} = res.locals.oauth.token;
                    req.body.clientId = client.id;
                    connection.executeQuery("call USPtaxcodecategorysearch('"+ JSON.stringify(req.body) +"')").then((data) =>
                        {  data[0].map((x) => {
                          x.id = helpers.encrypt(x.id.toString());
                          })
                          res.send(data);  });
                    };
            exports.viewtaxcodecategory = function(req, res){
                    const {client , user} = res.locals.oauth.token;

                      connection.executeQuery("call USPtaxcodecategoryview("+helpers.decrypt(req.body.id)+",'"+client.id+"')").then((data) =>
                                  {
                                    if(data[0] && data[0][0])
                                      {
                                        data[0][0].id = helpers.encrypt(data[0][0].id.toString());

                                        }
                        res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                              };
              exports.deletetaxcodecategory = function(req, res){

                        const {client , user} = res.locals.oauth.token;
                        user.ip = req.ip;
                       user.deviceinfo = req.headers.deviceinfo;
                       req.body.id = helpers.decrypt(req.body.id);
                        helper.checkModuleForChangedData(client,user,"organization","deletet",req.body);

                          connection.executeQuery("call USPtaxcodecategorydelete("+req.body.id+", "+ client.id +")").then((data) =>
                                  {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                      };
                      exports.savebiometricconfiguration = function(req, res){
                              const {client , user} = res.locals.oauth.token;
                              user.ip = req.ip;
                              user.deviceinfo = req.headers.deviceinfo;
                              const biometricdetail = req.body.biometricdetail;
                              const geofencingdetail = req.body.geofencingdetail;

                              helper.checkModuleForChangedData(client,user,"organization",'savebiometricconfiguration',{biometricdetail,geofencingdetail});

                                  connection.executeQuery("call USPclientbiometricconfigurationsave('"+client.id+"','"+JSON.stringify(biometricdetail)+"',"+req.body.isInbodyenable+",'"+JSON.stringify(geofencingdetail)+"');")
                                     .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

                                          };
            exports.getbiometrics = function(req, res){
                        const {client , user} = res.locals.oauth.token;
                              req.body.clientId = client.id;

                                connection.executeQuery("call USPbiometricsearch('"+ JSON.stringify(req.body) +"')").then((data) =>
                                        {  data[0].map((x) => {
                                              x.id = helpers.encrypt(x.id.toString());
                                          })
                                        res.send(data);  });
                };
                exports.savebiometric = function(req, res){
                        const {client , user} = res.locals.oauth.token;
                        user.ip = req.ip;
                        user.deviceinfo = req.headers.deviceinfo;
                        const biometric = req.body.biometric;

                        biometric.biometricname = biometric.biometricname.trim();

                        biometric.id = biometric.id != "0" ?  helpers.decrypt(biometric.id) : 0;
                        biometric.status = biometric.status ? biometric.status : 1;
                        helper.checkModuleForChangedData(client,user,"organization",'savebiometricdevice',{biometric});

                            connection.executeQuery("call USPbiometricsave("+biometric.id +",'"+biometric.biometricname+"','"+biometric.serialnumber+"','"+user.id+"','"+client.id+"',"+req.body.branchid+",'"+biometric.status+"');")
                               .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

                                    };
                exports.viewbiometric = function(req, res){
                            const {client , user} = res.locals.oauth.token;

                                connection.executeQuery("call USPbiometricview("+helpers.decrypt(req.body.id)+",'"+client.id+"')").then((data) =>
                                              {
                                                  if(data[0] && data[0][0])
                                                      {
                                                          data[0][0].id = helpers.encrypt(data[0][0].id.toString());

                                                  }
                              res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
            };

exports.userprofileview = function(req, res){
          const {client , user} = res.locals.oauth.token;
          let {month,year,id,client_timezoneoffsetvalue} = req.body ;
          let filtertype = req.body.activeIndex;

                  connection.executeQuery("call USPuserviewperformance('"+ client.id +"',"+month+",'"+year+"','"+filtertype+"','"+helpers.decrypt(id)+"','"+client_timezoneoffsetvalue+"')").then((data) =>
                  {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
    };

    exports.employeepersonaltraininglist = function(req, res){
      const {client , user} = res.locals.oauth.token;
      user.ip = req.clientIp;
      user.deviceinfo = req.headers.deviceinfo;
      req.body.clientId = client.id;
      req.body.branchid = user.defaultbranchid;
      req.body.userId = helpers.decrypt(req.body.userId);

          connection.executeQuery("call USPuserprofilepersonaltariningsearch('"+ JSON.stringify(req.body) +"');")
           .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

        };

        exports.employeegroupsessionlist = function(req, res){
          const {client , user} = res.locals.oauth.token;
          user.ip = req.clientIp;
          user.deviceinfo = req.headers.deviceinfo;
          req.body.clientId = client.id;
          req.body.userId = helpers.decrypt(req.body.userId);

              connection.executeQuery("call USPuserprofilegroupsessionsearch('"+ JSON.stringify(req.body) +"');")
               .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

            };
            exports.employeegroupsessionlistclasswise = function(req, res){
              const {client , user} = res.locals.oauth.token;
              user.ip = req.clientIp;
              user.deviceinfo = req.headers.deviceinfo;
              req.body.clientId = client.id;
              req.body.userId = helpers.decrypt(req.body.userId);

                  connection.executeQuery("call USPuserprofilegroupsessionclasswisesearch('"+ JSON.stringify(req.body) +"');")
                   .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

                };

            exports.userprofilestaffpay = function(req, res){
              const {client , user} = res.locals.oauth.token;
              user.ip = req.clientIp;
              user.deviceinfo = req.headers.deviceinfo;
              req.body.clientId = client.id;
              req.body.userId = helpers.decrypt(req.body.userId);

                  connection.executeQuery("call USPuserprofilestaffpaysearch('"+ JSON.stringify(req.body) +"');")
                   .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

                };

            exports.setemployeedefaultbranch = function(req, res){

                  const {client , user} = res.locals.oauth.token;
                  user.ip = req.clientIp;
                  user.deviceinfo = req.headers.deviceinfo;
                  helper.checkModuleForChangedData(client,user,"userdefaultbranch","update",req.body);

                    connection.executeQuery("call USPusersetdefaultbranch("+client.id +","+ user.id +","+req.body.defaultbranchid+")").then((data) =>
                        {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                };

                exports.savetermscondition = function(req, res){

                  const {client , user} = res.locals.oauth.token;
                  let data = new Date();
                  user.ip = req.clientIp;
                  user.deviceinfo = req.headers.deviceinfo;
                  helper.checkModuleForChangedData(client,user,"savetermscondition",'update',{data});


                  connection.executeQuery("call USPuseragreedatesave("+user.id+","+client.id+");")
                   .then((data) =>   {
                     res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

                    };
                exports.userreferrallist = function(req, res){
                    const {client , user} = res.locals.oauth.token;
                    let data = req.body;
                    var UserId = req.body.id && req.body.id.toString().length > 10 ?Helpers.decrypt(req.body.id) : req.body.id ;
                    connection.executeQuery("call USPuserreferrallist('"+data.month+"','"+data.year+"','"+data.activeTab+"','"+ client.id +"',"+UserId+",'"+data.client_timezoneoffsetvalue+"')").then((data) =>
                    {   data[0].map((x) => {
                        x.createdmemberdetail = x.createdmemberdetail ? JSON.parse( x.createdmemberdetail) : null;
                          });

                        res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                };
