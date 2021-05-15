var connection = require('../mysql/dbConnection');
var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var { writeLog } = require('../helpers/log');
var mail = require ('../helpers/mail');
var sms = require ('../helpers/sms');
const webpush = require("web-push");
var {convertToMysqlDatefromJSDate,getFormtedDate,unique,groupBy,uniqueObjectArray,getFormtedDateTime,getFormtedFromTime,getFormtedUTCDate,getFormtedUTCTime} = require('../helpers/helpers');

replaceTagname = function (options)
{

  let {clientid, memberid, content ,subject,enquiryid ,subscriptionid,installmentid,branchid,paymentid,gymbookingid} = options;

  let newcontent = unescape(content);

  let replacetag =  newcontent.match(/\{\$\S*\$\}/g) || [];
  let subjecttag = subject ? subject.match(/\{\$\S*\$\}/g) : [];


  replacetag = subjecttag ? replacetag.concat(subjecttag) : replacetag;

  var reqObj = {replacetag, memberid, clientid,enquiryid ,subscriptionid,installmentid,branchid,paymentid,gymbookingid};

  return new Promise(function(resolve, reject) {


    connection.executeQuery("call USPtemplatecontentget('"+ JSON.stringify(reqObj) +"')").then((data) =>
    {
      var result = data[0].length > 0 ? data[0][0] : '';
      if(result)
      {
               result = JSON.parse(data[0][0].newcontent);
               result.map((x) => {

                 x.value = unescape(x.value)
                newcontent =  newcontent.replace(x.key,x.value);
                subject =subject ? subject.replace(x.key,x.value) : '';
            })

      }
      resolve({subject , newcontent});
    },(error) => {  writeLog({data : error});  reject(error)})

})
}



exports.paymentNotification = function (options)
{
  let {clientid, memberid ,emailid,branchid,paymentamount} = options;

  let fromuserid = null;
  let frommemberid =  memberid;


 connection.executeQuery("call USPtemplatefornotification('"+clientid+"','paymentNotification')").then((data) =>
  {
        let templateDetail = data[0] || [];
        let notificationalias = "paymentNotification";
          sendPushNotificationLog({clientid,fromuserid,frommemberid,notificationalias,branchid,paymentamount});

        templateDetail.map((template) =>{
            if (template.templatetype == 1)
            {
              var content = unescape(template.content);
              var subject = template.subject;
              var title = template.templatetitle;
               content = content.replace('{$M_LASTPAYAMOUNT$}',paymentamount);
             content = replaceTagname({content,subject,clientid,memberid,branchid}).then(x => {

               mail.sendMail({
                           to: options.emailid,
                           subject: x.subject,
                           message: x.newcontent ,
                           clientid : clientid,
                           memberid : memberid,
                           title : title
                         });
              },(error) => writeLog({data : error}));
            }
            else  if (template.templatetype == 2){
              var content = unescape(template.content);
              var title = template.templatetitle;
               content = content.replace('{$M_LASTPAYAMOUNT$}',paymentamount);
             content = replaceTagname({content,clientid,memberid,branchid}).then(x => {

               sms.sendSMS({
                           mobile : options.mobile,
                           message: x.newcontent ,
                           clientid : clientid,
                           memberid : memberid,
                           title : title
                         });
              },(error) => writeLog({data : error}));
            }
        })

  },(error) => writeLog({data : error}));
}

exports.NewEnquiryNotification = function (options)
{
  let {clientid ,emailid,enquiryid,branchid} = options;
 connection.executeQuery("call USPtemplatefornotification('"+clientid+"','newenquiry')").then((data) =>
  {
        let templateDetail = data[0] || [];

        templateDetail.map((template) =>{
            if (template.templatetype == 1)
            {
              var content = template.content;
              var subject = template.subject;
              var title = template.templatetitle;
             content = replaceTagname({content,subject,clientid,enquiryid,branchid}).then(x => {

               mail.sendMail({
                           to: options.emailid,
                           subject: x.subject,
                           message: x.newcontent ,
                          clientid : clientid,
                          enquiryid : enquiryid,
                          title : title
                         });
             },(error) => writeLog({data : error}));
            }
            else  if (template.templatetype == 2){
              var content = template.content;
              var title = template.templatetitle;
             content = replaceTagname({content,clientid,enquiryid,branchid}).then(x => {

               sms.sendSMS({
                           mobile : options.mobile,
                           message: x.newcontent ,
                           clientid : clientid,
                           enquiryid : enquiryid,
                           title : title
                         });
              },(error) => writeLog({data : error}));
            }
        })

  },(error) => writeLog({data : error}));
}


exports.NewMemberNotification = function (options)
{
  let {clientid ,emailid,memberid,branchid} = options;
 connection.executeQuery("call USPtemplatefornotification('"+clientid+"','newmember')").then((data) =>
  {
        let templateDetail = data[0] || [];

        templateDetail.map((template) =>{
            if (template.templatetype == 1)
            {
              var content = template.content;
              var subject = template.subject;
              var title = template.templatetitle;
             content = replaceTagname({content,subject,clientid,memberid,branchid}).then(x => {

               mail.sendMail({
                           to: options.emailid,
                           subject: x.subject,
                           message: x.newcontent ,
                          clientid : clientid,
                          memberid : memberid,
                          title : title
                         });
             },(error) => writeLog({data : error}));
            }
            else  if (template.templatetype == 2){
              var content = template.content;
              var title = template.templatetitle;
             content = replaceTagname({content,clientid,memberid,branchid}).then(x => {

               sms.sendSMS({
                           mobile : options.mobile,
                           message: x.newcontent ,
                           clientid : clientid,
                           memberid : memberid,
                           title : title
                         });
              },(error) => writeLog({data : error}));
            }
        })

  },(error) => writeLog({data : error}));
}


exports.BirthdayWishesNotification = function (options)
{
  let {members,clientid} = options;
 connection.executeQuery("call USPtemplatefornotification('"+clientid+"','birthdayWishes')").then((data) =>
  {
        let templateDetail = data[0] || [];

          members.map(value => {
          var memberid = value.id;
          let branchid = value.defaultbranchid;

          let fromuserid = null;
          let frommemberid =  value.id;
          let notificationalias = "birthdayWishes";
            sendPushNotificationLog({clientid,fromuserid,frommemberid,notificationalias,branchid});

        templateDetail.map((template) =>{
            if (template.templatetype == 1)
            {
              var content = template.content;
              var subject = template.subject;
              var title = template.templatetitle;
             content = replaceTagname({content,subject,clientid,memberid,branchid}).then(x => {

               mail.sendMail({
                           to: value.personalemailid,
                           subject: x.subject,
                           message: x.newcontent ,
                          clientid : clientid,
                          memberid : memberid,
                          title : title
                         });
                },(error) => writeLog({data : error}));
            }
            else  if (template.templatetype == 2){
              var content = template.content;
              var title = template.templatetitle;
             content = replaceTagname({content,clientid,memberid,branchid}).then(x => {

               sms.sendSMS({
                           mobile : value.mobile,
                           message: x.newcontent ,
                           clientid : clientid,
                           memberid : memberid,
                           title : title
                         });
                  },(error) => writeLog({data : error}));
            }
        })
    })
  },(error) => writeLog({data : error}));
}

exports.AnniversaryWishesNotification = function (options)
{
  let {members,clientid} = options;
 connection.executeQuery("call USPtemplatefornotification('"+clientid+"','anniversaryWishes')").then((data) =>
  {
        let templateDetail = data[0] || [];

          members.map(value => {
          var memberid = value.id;
          let branchid = value.defaultbranchid;
          let fromuserid = null;
          let frommemberid =  value.id;
          let notificationalias = "anniversaryWishes";
            sendPushNotificationLog({clientid,fromuserid,frommemberid,notificationalias,branchid});

        templateDetail.map((template) =>{
            if (template.templatetype == 1)
            {
              var content = template.content;
              var subject = template.subject;
              var title = template.templatetitle;
             content = replaceTagname({content,subject,clientid,memberid,branchid}).then(x => {

               mail.sendMail({
                           to: value.personalemailid,
                           subject: x.subject,
                           message: x.newcontent ,
                          clientid : clientid,
                          memberid : memberid,
                          title : title
                         });
                },(error) => writeLog({data : error}));
            }
            else  if (template.templatetype == 2){
              var content = template.content;
              var title = template.templatetitle;
             content = replaceTagname({content,clientid,memberid,branchid}).then(x => {

               sms.sendSMS({
                           mobile : value.mobile,
                           message: x.newcontent ,
                           clientid : clientid,
                           memberid : memberid,
                           title : title
                         });
                  },(error) => writeLog({data : error}));
            }
        })
    })
  },(error) => writeLog({data : error}));
}


exports.PaymentDueNotification = function (options)
{
  let {members,clientid,days} = options;
  var notification_alias = '';

        if (days > 0){
          notification_alias = 'postpaymentDue';
        }
        else if (days < 0){
          notification_alias = 'prepaymentDue';
        }
        else {
          notification_alias = 'paymentDue';
       }

 connection.executeQuery("call USPtemplatefornotification('"+clientid+"','"+notification_alias+"')").then((data) =>
  {
        let templateDetail = data[0] || [];

          members.map(value => {
          var memberid = value.memberid;
          var installmentid = value.id;
          let branchid = value.branchid;
          let fromuserid = null;
          let frommemberid = value.memberid;

            sendPushNotificationLog({clientid,fromuserid,frommemberid,notification_alias,branchid});

        templateDetail.map((template) =>{
            if (template.templatetype == 1)
            {
              var content = template.content;
              var subject = template.subject;
              var title = template.templatetitle;
             content = replaceTagname({content,subject,clientid,memberid,installmentid,branchid}).then(x => {

               mail.sendMail({
                           to: value.personalemailid,
                           subject: x.subject,
                           message: x.newcontent ,
                          clientid : clientid,
                          memberid : memberid,
                          installmentid : installmentid,
                          title : title
                         });
                },(error) => writeLog({data : error}));
            }
            else  if (template.templatetype == 2){
              var content = template.content;
              var title = template.templatetitle;
             content = replaceTagname({content,clientid,memberid,installmentid,branchid}).then(x => {

               sms.sendSMS({
                           mobile : value.mobile,
                           message: x.newcontent ,
                           clientid : clientid,
                           memberid : memberid,
                           installmentid : installmentid,
                           title : title
                         });
                  },(error) => writeLog({data : error}));
            }
        })
    })
  },(error) => writeLog({data : error}));
}

exports.MemberExpiringNotification = function (options)
{
  let {members,clientid,days} = options;
  var notification_alias = '';

        if (days > 0){
          notification_alias = 'postmemberExpiring';
        }
        else if (days < 0){
          notification_alias = 'prememberExpiring';
        }
        else {
          notification_alias = 'memberExpiring';
       }

 connection.executeQuery("call USPtemplatefornotification('"+clientid+"','"+notification_alias+"')").then((data) =>
  {
        let templateDetail = data[0] || [];

          members.map(value => {
          var memberid = value.member;
          var subscriptionid = value.id;
          let branchid = value.branchid;
          let fromuserid = null;
          let frommemberid = value.member;

            sendPushNotificationLog({clientid,fromuserid,frommemberid,notification_alias,branchid});


        templateDetail.map((template) =>{
            if (template.templatetype == 1)
            {
              var content = template.content;
              var subject = template.subject;
              var title = template.templatetitle;
             content = replaceTagname({content,subject,clientid,memberid,subscriptionid,branchid}).then(x => {

               mail.sendMail({
                           to: value.personalemailid,
                           subject: x.subject,
                           message: x.newcontent ,
                          clientid : clientid,
                          memberid : memberid,
                          subscriptionid : subscriptionid,
                          title : title
                         });
                },(error) => writeLog({data : error}));
            }
            else  if (template.templatetype == 2){
              var content = template.content;
              var title = template.templatetitle;
             content = replaceTagname({content,clientid,memberid,subscriptionid,branchid}).then(x => {

               sms.sendSMS({
                           mobile : value.mobile,
                           message: x.newcontent ,
                           clientid : clientid,
                           memberid : memberid,
                           subscriptionid : subscriptionid,
                           title : title
                         });
                  },(error) => writeLog({data : error}));
            }
        })
    })
  },(error) => writeLog({data : error}));
}


exports.reportNotification = function (options)
{
  let {clientid,fromuserid,emailid,startdate,enddate,attachment,notificationalias} = options;
  let id = null;
   startdate = getFormtedDate(options.startdate);
   enddate = getFormtedDate(options.enddate);

 connection.executeQuery("call USPtemplateview("+id+","+options.clientid+",'"+options.notificationalias+"',"+0+")").then((data) =>
  {

        let templateDetail = data[0] || [];

        templateDetail.map((template) =>{

              var content = template.content;
              var subject = template.subject;
              var title = template.templatetitle;

               content = replaceTagname({content,subject,clientid}).then(x => {
                // let subjecttag = x.subject ? subject.match(/\{\$\S*\$\}/g) : [];

                  x.subject = x.subject.replace('{$R_STARTDATE$}',startdate).replace('{$R_ENDDATE$}',enddate);
                  x.newcontent = x.newcontent.replace('{$R_STARTDATE$}',startdate).replace('{$R_ENDDATE$}',enddate);
                   options.emailid.map(y => {
                        mail.sendMail({
                                    to: y.emailid,
                                    subject: x.subject,
                                    message: x.newcontent ,
                                   clientid : options.clientid,
                                   userid : y.id,
                                   fromuserid : options.fromuserid,
                                   attachment : options.attachment,
                                   title : title
                                  });

                           });
                },(error) => writeLog({data : error}));
        })

  },(error) => writeLog({data : error}));
}


const sendPushNotificationLog = function (options)
{
  let {clientid,fromuserid,frommemberid,notificationalias,branchid,paymentamount} = options;
  let id = null;

  connection.executeQuery("call USPtemplateview("+id+","+clientid+",'"+notificationalias+"',"+0+")").then((data) =>
   {

         let templateDetail = data[0] || [];

         templateDetail.map((template) =>{

               var content = unescape(template.content);
               var subject = template.subject;
               var memberid = frommemberid;
               var title = template.templatetitle;

               if(notificationalias == 'paymentNotification')
               {
                 content = content.replace('{$M_LASTPAYAMOUNT$}',paymentamount);
               }

                content = replaceTagname({content,subject,clientid,memberid,branchid}).then(x => {

                 webpushsendNotification({clientid : clientid,fromuserid : fromuserid,frommemberid :frommemberid,subject : x.subject,content : x.newcontent,title : title});

                 },(error) => writeLog({data : error}));
         })

   },(error) => writeLog({data : error}));

}

module.exports.sendPushNotificationLog = sendPushNotificationLog;

const webpushsendNotification = function (options)
{
  let {clientid,fromuserid,frommemberid,subject,content,istemp,title,broadcastid,url} = options;
  istemp = istemp ? istemp : 0;
  title = title ? title : '';
  broadcastid = broadcastid ? broadcastid : null;
  url = url ? url : (frommemberid ? '/member-app' : '/app');
  connection.executeQuery("call USPpushnotificationlogsave('"+clientid+"',"+fromuserid+","+frommemberid+",'"+  escape(subject) +"','"+ escape(content)+"','"+istemp+"','"+title+"',"+broadcastid+");")
   .then((data) =>   {
        if(data[0] && data[0][0])
        {
            let subscription = JSON.parse(data[0][0].subscriptionobject);
            const payload = JSON.stringify({ title :  unescape(subject) ,body : unescape(content) , data: {  openUrl : url, }});
            webpush
           .sendNotification(subscription, payload)
           .catch(err =>   writeLog({message : "webpush -error from googleapi"}));
        }
     },(error) => writeLog({data : error}))
}
//exports.webpushsendNotification;
module.exports.webpushsendNotification = webpushsendNotification;



exports.MemberPTExpiringNotification = function (options)
{
  let {members,clientid,days} = options;
  var notification_alias = 'prePTExpiring';

 connection.executeQuery("call USPtemplatefornotification('"+clientid+"','"+notification_alias+"')").then((data) =>
  {
        let templateDetail = data[0] || [];

          members.map(value => {
          var memberid = value.member;
          var subscriptionid = value.id;
          let branchid = value.branchid;
          let fromuserid = null;
          let frommemberid = value.member;

            sendPushNotificationLog({clientid,fromuserid,frommemberid,notification_alias,branchid});


        templateDetail.map((template) =>{
            if (template.templatetype == 1)
            {
              var content = template.content;
              var subject = template.subject;
              var title = template.templatetitle;
             content = replaceTagname({content,subject,clientid,memberid,subscriptionid,branchid}).then(x => {

               mail.sendMail({
                           to: value.personalemailid,
                           subject: x.subject,
                           message: x.newcontent ,
                          clientid : clientid,
                          memberid : memberid,
                          subscriptionid : subscriptionid,
                          title : title
                         });
                },(error) => writeLog({data : error}));
            }
            else  if (template.templatetype == 2){
              var content = template.content;
              var title = template.templatetitle;
             content = replaceTagname({content,clientid,memberid,subscriptionid,branchid}).then(x => {

               sms.sendSMS({
                           mobile : value.mobile,
                           message: x.newcontent ,
                           clientid : clientid,
                           memberid : memberid,
                           subscriptionid : subscriptionid,
                           title : title
                         });
                  },(error) => writeLog({data : error}));
            }
        })
    })
  },(error) => writeLog({data : error}));
}



exports.broadcastNotification = function (options)
{
  let {clientId,broadcastto,possiblevaluesfilter,title,message,broadcastid,userId,memberstartDate,memberendDate,enquirystartDate,enquiryendDate,defaultbranchId,subject,broadcastthrough,client_timezoneoffsetvalue} = options;
  let tableInfo = {};

  tableInfo.broadcastto = broadcastto;
  tableInfo.possiblevaluesfilter = possiblevaluesfilter;
  tableInfo.startDate 	=  broadcastto == 2 ? memberstartDate : (broadcastto == 3 ? enquirystartDate : null);
  tableInfo.endDate 	= broadcastto == 2 ? memberendDate : (broadcastto == 3 ? enquiryendDate : null);;
  tableInfo.exportXLSX 	= true;
  tableInfo.clientId 	= clientId;
  tableInfo.branchid = defaultbranchId || 0;
  tableInfo.broadcastthrough = broadcastthrough;
  tableInfo.client_timezoneoffsetvalue = client_timezoneoffsetvalue;

 connection.executeQuery("call USPbroadcastfiltersearch('"+JSON.stringify(tableInfo)+"')").then((data) =>
  {
        let broadcastdata = data[0] || [];
        if(broadcastthrough == 1)
        {
          broadcastNotificationViaEmail({broadcastdata,clientId,broadcastto,title,message,broadcastid,userId,defaultbranchId,subject});
        }
        else if (broadcastthrough == 2) {
          broadcastNotificationViaSMS({broadcastdata,clientId,broadcastto,title,message,broadcastid,userId,defaultbranchId,subject});
        }
        else if (broadcastthrough == 3) {
          broadcastNotificationViaPushNotification({broadcastdata,clientId,broadcastto,title,message,broadcastid,userId,defaultbranchId,subject});
        }

  },(error) => writeLog({data : error}));
}


const broadcastNotificationViaEmail = function (options)
{
   let {broadcastdata,clientId,broadcastto,title,message,broadcastid,userId,defaultbranchId,subject} = options;
   let emailid = broadcastdata.map(x => {return {id : x.id,email : x.emailid}});

   emailid = uniqueObjectArray(emailid ,'email');

    let  emails  =  emailid.map(x => x.email).join(',');

    mail.sendMail({
                  bcc : emails,
                  subject : subject,
                  message : message ,
                  clientid : clientId,
                  broadcastid : broadcastid,
                  title : title,
                  fromuserid : userId,
                });

    // emailid.map(x => {
    //
    //   let touser = broadcastto == 1 ? x.id : null;
    //   let tomember = broadcastto == 2 ? x.id : null;
    //   let toenquiry = broadcastto == 3 ? x.id : null;
    //
    //   mail.sendMail({
    //               to : x.email,
    //               subject : subject,
    //               message : message ,
    //               clientid : clientId,
    //               broadcastid : broadcastid,
    //               title : title,
    //               userid : touser,
    //               memberid : tomember,
    //               enquiryid : toenquiry,
    //               fromuserid : userId,
    //             });
      // });

}

module.exports.broadcastNotificationViaEmail = broadcastNotificationViaEmail;


const broadcastNotificationViaSMS = function (options)
{
  let {broadcastdata,clientId,broadcastto,title,message,broadcastid,userId,defaultbranchId,subject} = options;
      //let mobileno = broadcastdata.map(x => {return x.mobile});
      let mobileno = broadcastdata.map(x => {return {id : x.id,mobile : x.mobile}});

    //  mobileno = unique(mobileno);

      // mobileno = groupBy(mobileno, function(item)
      //                        {
      //                          return [item.mobile || ''];
      //                        });

      mobileno = uniqueObjectArray(mobileno ,'mobile');

      if(mobileno.length < 51)
      {
        let mobilestring = mobileno.map(x =>{ return x.mobile}).toString();
        let touser = broadcastto == 1 ? mobileno.map(x =>{ return x.id}) : null;
        let tomember = broadcastto == 2 ? mobileno.map(x =>{ return x.id}) : null;
        let toenquiry = broadcastto == 3 ? mobileno.map(x =>{ return x.id}) : null;
          sms.sendSMS({
                    mobile : mobilestring,
                    message: message ,
                    clientid : clientId,
                    title : title,
                    isPromotional : 1,
                    broadcastid : broadcastid,
                    fromuserid : userId,
                    userid : touser,
                    memberid : tomember,
                    enquiryid : toenquiry
                  });
      }
      else {

        // let touser = broadcastto == 1 ? mobileno.map(x =>{ return x.id}).toString() : null;
        // let tomember = broadcastto == 2 ? mobileno.map(x =>{ return x.id}).toString() : null;
        // let toenquiry = broadcastto == 3 ? mobileno.map(x =>{ return x.id}).toString() : null;

        let totalid = mobileno.map(x =>{ return x.id});

        mobileno = mobileno.map(x =>{ return x.mobile});


        while (mobileno.length > 0) {
        //   let mobilestring = mobileno.map(x =>{ return x.mobile});
        // //  mobileno = mobileno.map(x =>{ return x.mobile});
          let newmobileno = mobileno.splice(0,50);
            let newids = totalid.splice(0,50);
          newmobileno = newmobileno.toString();

          let touser = broadcastto == 1 ? newids : null;
          let tomember = broadcastto == 2 ? newids : null;
          let toenquiry = broadcastto == 3 ? newids : null;

          sms.sendSMS({
                    mobile : newmobileno,
                    message: message ,
                    clientid : clientId,
                    title : title,
                    isPromotional : 1,
                    broadcastid : broadcastid,
                    fromuserid : userId,
                    userid : touser,
                    memberid : tomember,
                    enquiryid : toenquiry
                  });
        }

      }
}

module.exports.broadcastNotificationViaSMS = broadcastNotificationViaSMS;


const broadcastNotificationViaPushNotification = function (options)
{
   let {broadcastdata,clientId,broadcastto,title,message,broadcastid,userId,defaultbranchId,subject} = options;
   let data = broadcastdata.map(x => {return {id : x.id}});

   data = uniqueObjectArray(data ,'id');

    data.map(x => {

      let fromuserid = broadcastto == 1 ? x.id : null;
      let frommemberid = broadcastto == 2 ? x.id : null;

      webpushsendNotification({clientid : clientId,fromuserid : fromuserid,frommemberid :frommemberid,subject : subject,content : message,title : title,broadcastid : broadcastid});

    });

}

module.exports.broadcastNotificationViaPushNotification = broadcastNotificationViaPushNotification;


exports.MemberChequeBounceNotification = function (options)
{
  let {clientid,memberid,emailid,mobile,branchid,paymentid} = options;

  let fromuserid = null;
  let frommemberid =  memberid;


 connection.executeQuery("call USPtemplatefornotification('"+clientid+"','chequeBounce')").then((data) =>
  {
        let templateDetail = data[0] || [];
        let notificationalias = "chequeBounce";

        templateDetail.map((template) =>{
            if (template.templatetype == 1)
            {
              var content = template.content;
              var subject = template.subject;
              var title = template.templatetitle;
             content = replaceTagname({content,subject,clientid,memberid,branchid,paymentid}).then(x => {

               mail.sendMail({
                           to: options.emailid,
                           subject: x.subject,
                           message: x.newcontent ,
                           clientid : clientid,
                           memberid : memberid,
                           title : title
                         });
              },(error) => writeLog({data : error}));
            }
            else  if (template.templatetype == 2){
              var content = template.content;
              var title = template.templatetitle;
             content = replaceTagname({content,clientid,memberid,branchid,paymentid}).then(x => {

               sms.sendSMS({
                           mobile : options.mobile,
                           message: x.newcontent ,
                           clientid : clientid,
                           memberid : memberid,
                           title : title
                         });
              },(error) => writeLog({data : error}));
            }
        })

  },(error) => writeLog({data : error}));
}
exports.linkpayNotification = function (options)
{
  let {clientid,fromuserid,emailid,startdate,enddate,attachment,notificationalias,mobile,branchid} = options;
  let id = null;
   startdate = getFormtedDateTime(startdate);
   enddate = getFormtedDateTime(enddate);

 connection.executeQuery("call USPtemplateview("+id+","+clientid+",'"+notificationalias+"',"+1+")").then((data) =>
  {

        let templateDetail = data[0] || [];

        templateDetail.map((template) =>{
              var content = template.content;
              var subject = template.subject;
              var title = template.templatetitle;
              content = unescape(content).replace("{$PAY_LINK}",attachment).replace('{$R_ENDDATE$}',enddate);
              content = escape(content);
              if(template.templatetype == 1){
                    subject = subject.replace('{$R_ENDDATE$}',enddate);
                     content = replaceTagname({content,subject,clientid,branchid}).then(x => {
                            mail.sendMail({
                                        to: emailid,
                                        subject: x.subject,
                                        message: x.newcontent,
                                       clientid : clientid,
                                       userid :fromuserid,
                                       fromuserid : fromuserid,
                                       title : title
                               });
                    },(error) => writeLog({data : error}));
              }
              else if(template.templatetype == 2){

                 content = replaceTagname({content,subject,clientid,branchid}).then(x => {
                  // let subjecttag = x.subject ? subject.match(/\{\$\S*\$\}/g) : [];
                    // console.log(x.newcontent);
                    sms.sendSMS({
                                mobile : mobile,
                                message: x.newcontent,
                                clientid : clientid,
                                title : title
                             });
                  },(error) => writeLog({data : error}));
          }
          })

  },(error) => writeLog({data : error}));
}


exports.gymSlotBookingNotification = function (options)
{
  let {clientid,memberId,emailid,mobile,branchid,notificationdatetime,gymbookingid,url,notificationalias} = options;

  let id = null;
  let fromuserid = null;

   bookingdate = getFormtedUTCDate(notificationdatetime,'MMM DD, YYYY');
   starttime = getFormtedUTCTime(notificationdatetime,'hh:mm A');

 connection.executeQuery("call USPtemplateview("+id+","+clientid+",'"+notificationalias+"',"+1+")").then((data) =>
  {

        let templateDetail = data[0] || [];

        templateDetail.map((template) =>{

          var content = template.content;
          var subject = template.subject;
          var title = template.templatetitle;


          subject = subject ? subject.replace('{$BG_BOOKINGDATE$}',bookingdate).replace('{$BG_BOOKINGSTARTTIME$}',starttime) : '';
          content = content ? unescape(content) : ''
          content = content.replace('{$BG_BOOKINGDATE$}',bookingdate).replace('{$BG_BOOKINGSTARTTIME$}',starttime);


          if (template.templatetype == 1)
          {

           content = replaceTagname({content,subject,clientid,branchid,gymbookingid,memberid : memberId}).then(x => {

             mail.sendMail({
                         to: options.emailid,
                         subject: x.subject,
                         message: x.newcontent ,
                         clientid : clientid,
                         memberid : memberId,
                         title : title
                       });
            },(error) => writeLog({data : error}));
          }
          else  if (template.templatetype == 2){

           content = replaceTagname({content,clientid,branchid,gymbookingid,memberid : memberId}).then(x => {

             sms.sendSMS({
                         mobile : options.mobile,
                         message: x.newcontent ,
                         clientid : clientid,
                         memberid : memberId,
                         title : title
                       });
            },(error) => writeLog({data : error}));
          }
          else  if (template.templatetype == 3){

           content = replaceTagname({content,subject,clientid,branchid,gymbookingid,memberid : memberId}).then(x => {

             webpushsendNotification({clientid,fromuserid : null,frommemberid :memberId,subject : x.subject,content :  x.newcontent,title : title,url : url});

            },(error) => writeLog({data : error}));
          }

        })

  },(error) => writeLog({data : error}));
}


exports.bookingReminderNotification = function (options)
{
  let {members,clientid,notificationalias,client_timezoneoffsetvalue} = options;

  let id = null;
  let fromuserid = null;

 connection.executeQuery("call USPtemplateview("+id+","+clientid+",'"+notificationalias+"',"+1+")").then((data) =>
  {
        let templateDetail = data[0] || [];

          members.map(value => {
          var memberid = value.id;
          let branchid = value.defaultbranchid;

          let fromuserid = null;
          let frommemberid =  value.id;
          let gymbookingid = value.bookingid;
          let bookingdate = getFormtedDate(value.bookingstartdatetime,client_timezoneoffsetvalue);
          let starttime = getFormtedDate(value.bookingstartdatetime,client_timezoneoffsetvalue,'hh:mm A');

          //  sendPushNotificationLog({clientid,fromuserid,frommemberid,notificationalias,branchid,gymbookingid});

        templateDetail.map((template) =>{
            var content = template.content;
            var subject = template.subject;
            var title = template.templatetitle;

            subject = subject ? subject.replace('{$BG_BOOKINGDATE$}',bookingdate).replace('{$BG_BOOKINGSTARTTIME$}',starttime) : '';
            content = content ? unescape(content) : ''
            content = content.replace('{$BG_BOOKINGDATE$}',bookingdate).replace('{$BG_BOOKINGSTARTTIME$}',starttime);

            if (template.templatetype == 1)
            {

             content = replaceTagname({content,subject,clientid,memberid,branchid,gymbookingid}).then(x => {

               mail.sendMail({
                           to: value.personalemailid,
                           subject: x.subject,
                           message: x.newcontent ,
                           clientid : clientid,
                           memberid : memberid,
                           title : title
                         });
                },(error) => writeLog({data : error}));
            }
            else  if (template.templatetype == 2){

             content = replaceTagname({content,clientid,memberid,branchid,gymbookingid}).then(x => {

               sms.sendSMS({
                           mobile : value.mobile,
                           message: x.newcontent ,
                           clientid : clientid,
                           memberid : memberid,
                           title : title
                         });
                  },(error) => writeLog({data : error}));
            }
            else  if (template.templatetype == 3){

             content = replaceTagname({content,subject,clientid,memberid,branchid,gymbookingid}).then(x => {

               webpushsendNotification({clientid,fromuserid : null,frommemberid :memberid,subject : x.subject,content :  x.newcontent,title : title});

              },(error) => writeLog({data : error}));
            }
        })
    })
  },(error) => writeLog({data : error}));
}
