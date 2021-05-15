var connection = require('../mysql/dbConnection');

var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var helper = require('../helpers/helpers');
var {getPathToUpload} = require('../helpers/file');
var {encrypt, decrypt,encryptmobile} = require('../helpers/encryption');
var {gymSlotBookingNotification} = require('../helpers/notification');


exports.view = function(req, res){

        const {client , user} = res.locals.oauth.token;
        req.body.clientId = client.id;
        req.body.memberId = req.body.memberid || req.body.memberId ;
        req.body.bookingstatus = req.body.bookingstatus ? req.body.bookingstatus : 1;

            connection.executeQuery("call USPlistgymaccessslot('"+JSON.stringify(req.body)+"')").then((data) =>
              {
                if(data[0]  && data[0].length > 0){
                    data[0].map((x) => {
                      x.id = encrypt(x.id.toString());
                     x.branchname = unescape(x.branchname);
                     var mobileno =  encryptmobile(user,{mobile : x.mobile,emailid : x.personalemailid});
                     x.mobile = mobileno.mobile;
                     x.personalemailid = mobileno.emailid;
                   });
                }
                 res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

      };

exports.delete = function(req, res){
          const {client , user} = res.locals.oauth.token;
          user.ip = req.clientIp;
          user.deviceinfo = req.headers.deviceinfo;
          helper.checkModuleForChangedData(client,user,"gymaccessslot","delete",req.body);
          req.body.id = req.body.id ? (req.body.id.toString().length > 10 ? decrypt(req.body.id) : req.body.id)  : null;

          let memberId = '';

          let mobile = '';
          let emailid = '';
          let notificationdatetime = '';
          let gymbookingid = '';
          let branchid = req.body.branchid;

          if(user.logintype == 0)
          {
             memberId = req.body.memberid ? (req.body.memberid.toString().length > 10 ? decrypt(req.body.memberid) : req.body.memberid)  : null;
             mobile = req.body.membermobile;
             emailid = req.body.memberemailid;
             notificationdatetime = req.body.startdatetime;
             gymbookingid = req.body.id;
          }

          connection.executeQuery("call USPmembergymaccessslotdelete("+req.body.id+",'"+user.id+"','"+req.body.isMember+"','"+branchid+"')").then((data) =>
              {  res.send(data);
                if(user.logintype == 0)
                {
                  let notificationalias = "gymAccessSlotCancelBooking";
                  gymSlotBookingNotification({clientid : client.id,memberId,emailid,mobile,branchid,notificationdatetime,gymbookingid,notificationalias});
                }

              },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
      };

      exports.save = function(req, res){

        const {client , user} = res.locals.oauth.token;
        const gymsccessslots = req.body.data;

        gymsccessslots.id = gymsccessslots.id != "0" ?  decrypt(gymsccessslots.id) : 0;
        let onspotbooking = gymsccessslots.onspotbooking ? gymsccessslots.onspotbooking : 0;
        let memberId = '';
        memberId = gymsccessslots.memberid ? (gymsccessslots.memberid.toString().length > 10 ? decrypt(gymsccessslots.memberid) : gymsccessslots.memberid ) : 0;

        let branchid = req.body.branchid;

        var startdatetime = helper.convertToMysqlDatefromJSDate(gymsccessslots.startdatetime);
        startdatetime = startdatetime != '' ? "'" + startdatetime + "'" : null;

        var enddatetime = helper.convertToMysqlDatefromJSDate(gymsccessslots.enddatetime);
        enddatetime = enddatetime != '' ? "'" + enddatetime + "'" : null;

        let mobile = gymsccessslots.membermobile;
        let emailid = gymsccessslots.memberemailid;
        let notificationdatetime = gymsccessslots.notificationdatetime;
        //let bookingdate = gymsccessslots.date;
        let gymbookingid = gymsccessslots.id;

                  connection.executeQuery("call USPmembergymaccessslotsave("+gymsccessslots.id+","+memberId+",'"+user.id+"','"+user.logintype+"','"+onspotbooking+"','"+branchid+"',"+startdatetime+","+enddatetime+");")
                  .then((data) =>   {  res.send(data);

                    let notificationalias = "";
                    if(gymbookingid == 0 && data[0][0].booking_id)
                    {
                        gymbookingid = data[0][0].booking_id ;
                        notificationalias = "gymAccessSlotBooking";
                    }
                    else if(gymbookingid > 0) {
                        notificationalias = "gymAccessSlotUpdateBooking";
                    }
                     let url = '/member-app/gym-accessslot';

                    gymSlotBookingNotification({clientid : client.id,memberId,emailid,mobile,branchid,notificationdatetime,gymbookingid,url,notificationalias});

                   },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

          };

    exports.bulkgymaccessslotsdelete = function(req, res){
                    const {client , user} = res.locals.oauth.token;
                    user.ip = req.clientIp;
                    user.deviceinfo = req.headers.deviceinfo;
                    helper.checkModuleForChangedData(client,user,"gymaccessslot","bulkcanceladvancebooking",req.body);
                    let branchId = req.body.branchid ? decrypt(req.body.branchid) : 0;
                    let client_timezoneoffsetvalue = req.body.client_timezoneoffsetvalue;

                    connection.executeQuery("call USPbulkmembergymaccessslotdelete('"+client.id+"','"+user.id+"',"+branchId+",'"+client_timezoneoffsetvalue+"')").then((data) =>
                        {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                };
