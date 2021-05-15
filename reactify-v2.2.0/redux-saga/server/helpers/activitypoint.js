var connection = require('../mysql/dbConnection');
var {activityPointConfiguration} = require('../constants/AppConfig');
var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var { writeLog } = require('./log');
var {webpushsendNotification} = require ('../helpers/notification');

exports.getMemberActivityPoint = function (info){
  connection.executeQuery("call USPmemberappactivitypointcheckeligibility('"+info.clientId+"','"+info.userId+"','"+info.activityId+"','"+JSON.stringify(info.data)+"')").then((data) =>
  {
    let pointoption = data[0][0].pointoption;
    if(pointoption)
    {
      let point = activityPointConfiguration.filter(x => x.activityid == info.activityId)[0].point.filter(y => y.option == pointoption);
      let activityname = activityPointConfiguration.filter(x => x.activityid == info.activityId)[0].activity;
      activityname = activityname.toLowerCase();
      if(point && point.length > 0)
      {
          point = point[0].point
          connection.executeQuery("call USPmemberappactivitypointsave('"+info.clientId+"','"+info.userId+"','"+info.activityId+"','"+point+"')").then((data) =>
          {
            let subject = "Reward points earned";
            let content = "Congrats!! You have earned " + point + " reward points for " + activityname + ".";
            let title = "Reward Points";

            webpushsendNotification({clientid : info.clientId,fromuserid : null,frommemberid :info.userId,subject : subject,content : content,title : title});

            //res.send(data);
          },(error) => writeLog({data : error,message : "Activity Point Save Error"}))
      }
    }

  },(error) => writeLog({data : error,message : "Activity Point Check Eligibility Error"}))
}


exports.sendPushNotificationForActivityPoint = function (info){
  connection.executeQuery("call USPmemberappactivitypointcheckeligibility('"+info.clientId+"','"+info.userId+"','"+info.activityId+"','"+JSON.stringify(info.data)+"')").then((data) =>
  {
    let pointoption = data[0][0].pointoption;
    if(pointoption)
    {
      let subject = "Chance to earn reward points";
      let title = "Reward Points";
      //let subject = "You're close to earn another 25 reward points."

      webpushsendNotification({clientid : info.clientId,fromuserid : null,frommemberid :info.userId,subject : subject,content : info.content,istemp : info.istemp,title : title});

    }

  },(error) => writeLog({data : error,message : "Activity Point Check Eligibility Error"}))
}
