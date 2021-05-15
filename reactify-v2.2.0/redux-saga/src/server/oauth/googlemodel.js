
const {google} = require('googleapis');
var connection = require('../mysql/dbConnection');
const {googleConfiguration,googlefitDefaultScope,googleCalendarDefaultScope} = require('../constants/AppConfig');
var { writeLog } = require('../helpers/log');
var {googleFitDataSourceName} = require('../helpers/helpers');
/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
  clientId: googleConfiguration.clientId, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: googleConfiguration.clientSecret, // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: googleConfiguration.redirect, // this must match your google api settings
};

/*************/
/** Auth HELPERS  start**/
/*************/

function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function getConnectionUrl(isgooglecalendar) {
  let auth = google._options.auth;

  const defaultScope = isgooglecalendar == 1 ? googleCalendarDefaultScope : googlefitDefaultScope;

  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
}

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */

exports.urlGoogle = function (isgooglecalendar) {
  const auth = createConnection();

  google.options({
    auth: auth
  });
  const url = getConnectionUrl(isgooglecalendar);
  return url;
}




/*************/
/** Auth HELPERS  end**/
/*************/


exports.setGoogleCredentials = function ({code,client,user,isgooglefit}) {
      const auth = createConnection();
      google.options({
        auth: auth
      });

  auth.getToken(code).then(x => {
        var tokens = x.tokens;
        tokens.date = new Date();

        auth.setCredentials(tokens);

        if(isgooglefit == 1)
        {
          var fitness = getGoogleFitnessApi(auth);

          createMemberDataSource({tokens,fitness,user,client}).then((response) =>{  },
              (err) =>{ writeLog({data : err});
                 });
        }

      connection.executeQuery("call USPmembergoogletokensave('"+JSON.stringify(tokens)+"',"+user.id+",'"+client.id+"','"+user.logintype+"')").
      then((data) => { },(error) => {});
    },(error) =>{ writeLog({data : error});});

}


function getGoogleFitnessApi(auth) {
  return google.fitness({ version: 'v1', auth });
}

createMemberDataSource = function({tokens,fitness,user,client}) {

  return new Promise(function(resolve, reject) {

    let dataStreamName = googleFitDataSourceName();
    let requestBody = {

               "dataStreamName": dataStreamName + "Activity",
               "type": "derived",
               "application": {
                 "name": "Fitness App",
                 "version": "1"
               },
               "dataType": {
                 "field": [
                   {
                     "name": "activity",
                     "format": "integer"
                   }
                 ],
                 "name": "com.google.activity.segment"
               }
           }

     fitness.users.dataSources.create({ 'userId': 'me',requestBody : requestBody})
     .then((response) =>
      {
         tokens.dataSourceId = response.data.dataStreamId;
         connection.executeQuery("call USPmembergoogletokensave('"+JSON.stringify(tokens)+"',"+user.id+",'"+client.id+"','"+user.logintype+"')").
         then((data) => { resolve(response); },
         (error) => {    writeLog({data : error});  reject(error);});
      }).catch((error) => {    writeLog({data : error});  reject(error);})

  });
}

function getActivityType(recordtypeId) {
  if(recordtypeId == 1)
  {
    return 47;
  }
  else if (recordtypeId == 2) {
    return 58;
  }
  else if (recordtypeId == 3) {
    return 97;
  }
}

function createDataset({fitness,dataSourceId,client,user, exercisename , recordtypeId , starttime , endtime}) {
        var startTime = starttime;
        var endTime = endtime;
        var activityType = getActivityType(recordtypeId);
        var sessionid = exercisename + '-' + startTime;
        var name = exercisename;


        let requestBody =
        {
            "minStartTimeNs": startTime * 1000000,
            "maxEndTimeNs": endTime * 1000000,
            "dataSourceId": dataSourceId,
            "point": [
            {
              "startTimeNanos":startTime * 1000000,
              "endTimeNanos": endTime * 1000000,
              "dataTypeName": "com.google.activity.segment",
              "value": [
                {
                  "intVal": activityType
                }
              ]
            }
            ]
        }

        let requestBodySession =
        {
            "id": sessionid,
            "name": name,
            "description": name + " description",
            "startTimeMillis": startTime,
            "endTimeMillis": endTime,
            "application": {
            "name": "FPL",
            "version": "1.0"
            },
            "activityType": activityType
        }


    //  var dataSource = "derived:com.google.activity.segment:983312997222:Test1DataSource";
      var datasetId = (startTime * 1000000).toString() + '-' + (endTime * 1000000).toString();
      fitness.users.dataSources.datasets.patch({ 'userId': 'me' , 'dataSourceId' : dataSourceId , 'datasetId' : datasetId ,requestBody : requestBody})
      .then((response) =>
        {
          var fitlistresponse = response;
          //  writeLog({data : response});

                fitness.users.sessions.update({ 'userId': 'me' , 'sessionId' : sessionid ,requestBody : requestBodySession})
                .then((response1) =>
                  {
                    var fitsessionresponse = response1;
                //      writeLog({data : response1});
                  },(error) =>
                            {
                            writeLog({data : error});
                          }
                    );

        },(error) => {
                  writeLog({data : error});
                  }
          );
}

exports.storeDatatoGooglefit = function ({client,user, exercisename , recordtypeId , starttime , endtime}) {

  connection.executeQuery("call USPmembergoogletokenget("+user.id+",'"+client.id+"','"+user.logintype+"')").
  then((data) =>
  {
    if(!(data[0][0] && data[0][0].googletoken))
    {
      return false;
    }

     const auth = createConnection();
     let tokens = JSON.parse(data[0][0].googletoken);

     auth.setCredentials(tokens);

     var fitness = getGoogleFitnessApi(auth);

     if(!(tokens.dataSourceId))
     {
        createMemberDataSource({tokens,fitness,user,client}).then((response) =>
       {
            var dataSourceId = response.data.dataStreamId;
              createDataset({fitness,dataSourceId,client,user, exercisename , recordtypeId , starttime , endtime});
       },(err) =>
                 {
                 writeLog({data : err});
               });
     }
     else {
              var dataSourceId = tokens.dataSourceId;
              createDataset({fitness,dataSourceId,client,user, exercisename , recordtypeId , starttime , endtime});
     }

  },
  (error) => {
            writeLog({data : error});
            })
}

function getGoogleCalendarApi(auth) {
  return google.calendar({version: 'v3', auth});
}

createCalendarEvent = function({auth,calendar,client , user , starttime , endtime ,title, classid , classdate , trainerid, trainername}) {

  return new Promise(function(resolve, reject) {

    var requestid = classid + '|' + classdate + '|' + trainerid;

    var requestBody =
    {
      'summary': title,
      'description': title + ' with trainer ' + trainername,
      'start':
       {
         'dateTime': starttime,
       },
      'end':
       {
         'dateTime': endtime,
       },
       "conferenceData":
       {
         "createRequest":
         {
           "conferenceSolutionKey":
             {
               "type": "hangoutsMeet"
             },
           "requestId": requestid
         },
       },
    };

    calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: requestBody,
      conferenceDataVersion : 1,
     }).then((response) =>
      {
         resolve(response);
      }).catch((error) => {    writeLog({data : error});  reject(error);})

  });
}

exports.storeDatatoGoogleCalendar = function ({client , user , starttime , endtime ,title, classid , classdate , trainerid , trainername}) {

  return new Promise(function(resolve, reject) {

    connection.executeQuery("call USPmembergoogletokenget("+user.id+",'"+client.id+"','"+user.logintype+"')").
    then((data) =>
    {
      if(!(data[0][0] && data[0][0].googletoken))
      {
        return false;
      }

       const auth = createConnection();
       let tokens = JSON.parse(data[0][0].googletoken);

       auth.setCredentials(tokens);

       var calendar = getGoogleCalendarApi(auth);

         createCalendarEvent({auth,calendar,client , user , starttime , endtime, title, classid , classdate , trainerid , trainername}).then((data) =>
          {
            resolve(data);
          },(err) =>
          {
              writeLog({data : err});
              reject(err);
          });
    },
    (error) =>
     {
        writeLog({data : error});
        reject(error);
     })

  });
}


  // fitness.users.dataSources.list({ 'userId': 'me'})
  // .then((response) =>
  //   {
  //     var fitcreateresponse = response;
  //   })


// fitness.users.sessions.delete({ 'userId': 'me' , 'sessionId' : 'testsession'})
// .then((response1) =>
//   {
//     var fitsessionresponse = response1;
//       console.log(response1);
//   },(error) =>
//             console.log(error)
//     )


//  delete a dataSource
// fitness.users.dataSources.delete({ 'userId': 'me','dataSourceId' : dataSourceId})
// .then((response) =>
//   {
//     var fitcreateresponse = response;
//   })
