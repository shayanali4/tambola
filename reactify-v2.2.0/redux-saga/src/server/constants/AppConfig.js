/**
 * Server App Config File
 */

const isDevelopment = process.env.NODE_ENV !== "production";

const  basePathForUploadStaticFile = isDevelopment ? '../../../uploads/' : '../../../fplapps_sources/fpl/';
const  basePathForLogFile = isDevelopment ? '../../../logfiles/' : '../logs/premiumtambola.com/';
const serverIp  = 'app.fitnezz.club';




const  basePathForSampleFile = isDevelopment ? './sample-doc/' : './sample-doc/';
const  basePathForExternalSources = isDevelopment ? './sources/' : './sources/';

let databaseConfiguration = {
     connectionLimit : 1000,
     host     : 'localhost',
     user     :  'root',
     password : 'local@admin',
     database : 'db_tambola',
   };

if(!isDevelopment)
{

     databaseConfiguration = {
          connectionLimit : 50,
          host     : 'localhost',
          user     :  'premghos_tambola',
          password : 'ZL~pqE8sqPZ7',
          database : 'premghos_tambola',
        };
}

exports.databaseConfiguration = databaseConfiguration;

    exports.encryptionConfiguration ={
      secretkey:'fitnessproleague',
    };
``
    exports.defaultConfiguration ={
      basePathForUploadStaticFile : basePathForUploadStaticFile ,
      basePathForLogFile : basePathForLogFile,
      basePathForSampleFile : basePathForSampleFile,
      basePathForExternalSources : basePathForExternalSources,
      verificationCodeExpiry : 10,    //min
      domainName : isDevelopment ? 'example.com:8888' : 'fitnessproleague.com' ,
      domainName_enterprise : isDevelopment ? 'example.com:8888' : 'fitnezz.club' ,
      domainName_professional : isDevelopment ? 'example.com:8888' : 'fitnezz.pro' ,
      domainName_user : isDevelopment ? 'example.com:8888' : 'fitnezz.user' ,
      biometricurl : isDevelopment ? 'http://192.168.0.105:8888/iclock/api/WebAPI' : 'http://207.180.235.159:8888/iclock/api/WebAPI',
      inbodyurl : isDevelopment ? 'https://apiind.lookinbody.com' : 'https://apiind.lookinbody.com',
      inbodyapi : "yZLbiIxEZvzCeFIGgB3DHiutoqk5KxLNyqzl3/9UUv4=",
      inbodyAccount : "indiademo"

    };

    exports.googleConfiguration= {
        clientId: '60571846364-ba12kd91r46s8ctd5ugc6uc1ignkh2ad.apps.googleusercontent.com', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
        clientSecret: '1IJOS0DYJ5t6tQFLySWzGXex', // e.g. _ASDFA%DFASDFASDFASD#FAD-
        redirect: 'https://'+serverIp+'/', // this must match your google api settings
    };

    exports.googlefitDefaultScope =  [
          'https://www.googleapis.com/auth/fitness.activity.write',
          'https://www.googleapis.com/auth/fitness.activity.read',
          ];

    exports.googleCalendarDefaultScope= [
          'https://www.googleapis.com/auth/calendar.events',
          ];

    exports.activityPointConfiguration =[
        {
          activityid : '1',
          activity : 'Performing Exercise',
          point : [
                    {
                      option : 1,
                      point : 10,
                    },
                    {
                      option : 2,
                      point : 25,
                    },
                  ],
          duration :{
                          forduration: 45,
                          durationtype : 'min',
                    },
        },
        {
          activityid : '2',
          activity : 'Set Goal',
          point : [
                    {
                      option : 1,
                      point : 10,
                    },
                  ],
          duration :{
                          forduration: 1,
                          durationtype : 'month',
                    }
                    ,
        },
        {
          activityid : '3',
          activity : 'Set measurement',
          point : [
                    {
                      option : 1,
                      point : 10,
                    },
                  ],
          duration :{
                          forduration: 2,
                          durationtype : 'week',
                    },
        },
        {
          activityid : '4',
          activity : 'Check-in & Checkout',
          point : [
                    {
                      option : 1,
                      point : 25,
                    },
                  ],
          duration : {
                          forduration: 2,
                          durationtype : 'week',
                    },
        },
        {
          activityid : '5',
          activity : 'Group Session Attendance',
          point : [
                    {
                      option : 1,
                      point : 10,
                    },
                  ],
          duration :{
                          forduration: 0,
                          durationtype : '',
                    },
        },
        {
          activityid : '6',
          activity : 'PT Attendance & Confirmation',
          point : [
                    {
                      option : 1,
                      point : 25,
                    },
                  ],
          duration :{
                          forduration: 0,
                          durationtype : '',
                    },
        },
        {
          activityid : '7',
          activity : 'Progress Photo',
          point : [
                    {
                      option : 1,
                      point : 15,
                    },
                  ],
          duration :{
                          forduration: 1,
                          durationtype : 'week',
                    },
        },
        {
          activityid : '8',
          activity : 'Feedback on Attended Session',
          point : [
                    {
                      option : 1,
                      point : 5,
                    },
                    {
                      option : 2,
                      point : 10,
                    },
                  ],
          duration : {
                          forduration: 1,
                          durationtype : 'day',
                     },
        },
        {
          activityid : '9',
          activity : 'Social Media Share',
          point : [
                    {
                      option : 1,
                      point : 10,
                    },
                  ],
          duration : {
                          forduration: 1,
                          durationtype : 'day',
                    },
        }
      ];


  exports.enquiryImportHeader = {
          header : [,"FIRST NAME*", "LAST NAME*", "GENDER", "MOBILE NUMBER*", "PHONE NUMBER", "FITNESS GOAL", "ENQUIRY TYPE", "MEMBER TYPE", "ENQUIRY STATUS", "NEXT FOLLOWUP DATE", "INTERESTED SERVICE", "EMAIL ADDRESS", "ATTENDED BY"]
         };

  exports.memberImportHeader = {
          header : [,"FIRST NAME*", "LAST NAME*", "EMAIL ADDRESS*", "MOBILE NUMBER*", "GENDER", "PHONE NUMBER", "TAX ID NO.", "BLOODGROUP", "DATE OF BIRTH", "ADDRESS1", "ADDRESS2", "CITY", "STATE", "COUNTRY", "PINCODE", "MEMBERSHIP PLAN*", "ACTIVATION DATE*", "EXPIRY DATE*", "AMOUNT*", "CREDIT", "DUES", "DUE DATE", "MEMBER CODE"]
        };

  exports.expenseImportHeader = {
          header : [,"TITLE*", "CATEGORY*", "AMOUNT*", "PAYMENT MODE*", "EXPENSE DATE*", "EXPENSE PAID BY*", "REMARK"]
         };
