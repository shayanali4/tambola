
import NotificationType  from 'Assets/data/notificationtype';
import { cloneDeep, getClientId} from 'Helpers/helpers';

const isDevelopment = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 80 ;
const devUrl  = 'example.com:8888';

const serverIp  = 'premiumtambola.com';
const testserverIp  = 'tambola.sslcouponcodes.com';

const serverUrl =  isDevelopment ? 'http://localhost:8888/api/' : location.protocol+ '//'+ serverIp + '/api/';
const testserverUrl =   isDevelopment ? 'http://localhost:8888/api/' : location.protocol+ '//'+ testserverIp + '/api/';
const socketurl =  isDevelopment ? 'http://localhost:8888' : location.protocol+ '//'+ serverIp ;
const testsocketurl = isDevelopment ? 'http://localhost:8888' : location.protocol+ '//'+ testserverIp ;

const CustomConfig = {
    react_code_input : { fields : 6, type : 'number'  },
    domainName : isDevelopment ? devUrl : 'signup.fitnessproleague.com' ,
    domainName_enterprise : isDevelopment ? devUrl : 'fitnezz.club' ,
    domainName_professional : isDevelopment ? devUrl : 'fitnezz.pro' ,
    domainName_user : isDevelopment ? devUrl : 'fitnezz.me' ,
    dateFormat : 'MMM DD, YYYY',
    timeFormat : 'hh:mm A',
    serverUrl :    getClientId().indexOf("qatest") >= 0 ? testserverUrl : serverUrl,
    socketurl :    getClientId().indexOf("qatest") >= 0 ? testsocketurl : socketurl,
}

export const FacebookConfig = {
  appId : '2370560653176533',
  href : 'https://www.fitnessproleague.com',
  hashtag : '#MyFitnessApp',
}

export const GoogleMapConfig = {
  Apikey : 'AIzaSyAmZa33NCQ1kVphoSU78l-_ZRpMeq7JOp4',
}


export function getPrimaryColor() {

  var primary_color = "primary";
  {
    var themes = document.body.getAttribute("class");
    themes = themes ?  themes.split(" ") : [];

  themes.map(x=> {
      if(x.indexOf("theme") > -1)
      {
       primary_color =  x.replace("theme-","")
      }
  });

  }
  primary_color = getComputedStyle(document.documentElement).getPropertyValue('--'+ primary_color);

  return primary_color;

}
export function getHumanBodyMap() {

  var primary_color = getPrimaryColor();


  return {
   URL : require('Assets/img/exercisedatabase_background_od.png'),
   MAP : {
   	name: 'human-mucels',
   	areas: [
   		{index: 0, name: 'rightneck', shape: 'poly', coords: [59,150,69,143,77,138,88,133,98,129,104,128,104,133,104,138,103,144,98,148,91,150,79,151,62,150,85,151],  fillColor: primary_color},
   		{index: 1, name: 'leftneck', shape: 'poly', coords: [165,128,172,131,178,133,184,136,190,139,196,143,200,145,204,149,196,149,188,149,179,149,171,148,166,147,163,143,161,135,160,127,200,145], fillColor: primary_color},
       {index: 2, name: 'rightshoulder', shape: 'poly', coords: [28,217,33,208,37,204,44,199,47,198,52,194,59,189,64,183,71,175,76,164,75,156,67,155,55,155,48,157,40,160,34,164,30,168,26,173,23,178,22,183,21,189,19,196,20,202,22,209], fillColor: primary_color},
       {index: 3, name: 'leftshoulder', shape: 'poly', coords: [236,215,232,208,226,201,217,197,211,192,203,186,197,179,193,172,189,163,189,157,194,154,200,154,205,154,211,153,215,156,221,158,226,160,231,163,236,167,239,171,241,176,243,181,245,187,245,192,246,198,245,205,242,211], fillColor: primary_color},
       {index: 4, name: 'chest', shape: 'poly', coords: [48,197,53,194,58,189,64,184,69,177,73,171,75,163,80,156,86,154,93,152,101,152,109,153,118,153,123,155,131,158,133,162,136,156,141,155,148,154,155,152,163,152,171,152,177,152,183,155,187,161,190,167,194,173,199,181,203,185,208,190,213,194,218,196,214,200,211,206,206,212,200,217,191,221,183,225,172,226,161,227,151,224,142,222,135,217,135,214,130,219,124,222,116,224,108,226,96,226,88,226,77,222,69,219,62,214,55,209,51,203], fillColor: primary_color},

       {index: 5, name: 'rightbiceps', shape: 'poly', coords: [49,198,53,203,58,215,58,223,58,228,58,234,58,243,56,250,54,257,51,262,47,267,41,271,36,272,31,264,29,257,27,251,21,253,19,246,18,238,17,227,17,220,22,211,25,214,28,217,33,209,37,204,42,200], fillColor: primary_color},
       {index: 6, name: 'leftbiceps', shape: 'poly', coords: [218,198,224,200,228,204,232,207,235,212,237,217,241,213,244,210,247,216,249,222,248,228,248,234,247,240,246,246,245,252,240,251,239,257,236,263,233,268,229,272,222,269,218,269,216,264,213,258,211,252,209,245,207,237,207,229,207,222,208,215,210,209,214,202], fillColor: primary_color},
       {index: 7, name: 'rightforearm', shape: 'poly', coords: [26,250,20,253,20,257,18,262,16,267,14,272,14,277,12,283,11,288,11,296,11,302,11,309,11,315,11,321,11,328,10,335,9,342,12,344,16,347,20,349,28,354,30,347,34,337,37,331,40,323,43,315,46,306,47,301,49,294,49,285,49,278,47,269,44,270,40,272,35,272,32,269,29,259,27,253], fillColor: primary_color},
       {index: 8, name: 'leftforearm', shape: 'poly', coords: [239,251,246,253,246,259,248,264,250,269,252,275,253,280,254,285,255,292,255,299,254,306,254,312,254,318,254,324,255,330,256,336,257,342,251,346,244,350,238,353,236,346,233,339,230,333,227,326,225,320,222,313,219,304,217,297,216,289,217,282,218,275,218,268,222,270,228,270,231,270,235,266,237,260], fillColor: primary_color},
       {index: 9, name: 'upperabs', shape: 'poly', coords: [68,220,64,227,62,235,61,245,63,252,68,257,72,265,75,272,73,280,72,286,81,288,88,288,96,288,106,289,115,289,125,290,134,297,145,291,156,289,169,288,178,287,187,287,194,287,192,279,192,270,195,264,198,257,204,250,205,245,202,237,200,228,196,220,189,223,180,225,169,227,157,225,146,223,139,221,131,215,123,222,117,224,109,226,101,227,92,226,80,223], fillColor: primary_color},
       {index: 10, name: 'lowerabs', shape: 'poly', coords: [134,303,144,299,157,292,167,287,176,288,189,288,194,289,196,295,196,301,196,307,197,314,197,322,191,327,185,333,179,337,174,340,172,333,169,324,168,315,166,305,163,313,162,323,160,331,158,339,156,347,154,354,150,358,143,360,135,361,127,361,119,360,113,356,110,349,108,342,106,335,105,327,103,320,101,312,99,304,97,312,97,320,96,329,94,337,91,339,82,334,76,328,70,323,69,316,69,309,69,302,70,296,77,294,84,292,91,290,98,288,100,287,108,290,116,294,124,298], fillColor: primary_color},
       {index: 11, name: 'waist', shape: 'poly', coords: [69,323,77,330,83,334,89,336,97,332,105,332,106,340,107,346,112,348,122,347,131,347,140,347,152,347,156,347,157,338,159,330,166,329,171,331,172,337,173,338,180,335,186,330,191,326,196,322,200,333,204,342,207,354,200,354,190,354,182,355,174,358,164,360,152,362,143,362,134,362,125,362,115,361,107,359,97,356,88,356,79,354,69,354,60,356,61,346,64,339,66,333], fillColor: primary_color},
       {index: 12, name: 'hip', shape: 'poly', coords: [57,395,64,398,73,399,80,400,92,400,99,401,107,402,114,402,120,403,125,402,131,398,133,393,136,397,141,401,147,401,157,401,163,401,173,402,182,400,187,399,194,396,203,392,209,389,208,377,208,365,207,357,205,348,190,349,169,354,147,360,117,360,100,356,89,353,78,352,67,352,60,355,58,365,57,376], fillColor: primary_color},
       {index: 13, name: 'rightthigh', shape: 'poly', coords: [57,407,69,403,83,403,94,402,105,402,116,404,125,406,127,409,128,415,128,421,128,431,127,438,126,448,125,455,123,463,121,470,120,478,114,481,109,480,103,478,98,476,93,472,89,465,87,461,86,468,85,473,82,475,77,474,75,472,72,466,69,459,65,452,62,443,59,434,58,426,57,417], fillColor: primary_color},
       {index: 14, name: 'leftthigh', shape: 'poly', coords: [138,408,158,405,175,404,187,405,201,405,210,407,209,416,208,424,207,435,204,443,200,454,196,461,192,469,188,473,186,475,182,474,179,469,179,462,176,469,172,473,167,477,162,479,157,480,152,480,148,480,145,474,143,467,142,458,140,449,139,439,138,431,138,422,137,416], fillColor: primary_color},
       {index: 15, name: 'rightcalf', shape: 'poly', coords: [77,508,86,506,100,508,108,508,115,508,119,515,121,522,124,526,125,536,127,545,126,552,125,558,124,563,123,570,121,576,119,583,117,589,115,595,115,600,114,605,114,611,114,618,114,628,107,630,100,631,93,631,91,630,90,621,88,613,87,606,86,597,84,589,83,580,80,573,77,565,75,553,73,545,72,537,72,526,74,515], fillColor: primary_color},
       {index: 16, name: 'leftcalf', shape: 'poly', coords: [151,507,159,508,167,507,177,507,191,509,192,514,192,520,194,525,194,533,193,544,192,551,190,558,189,564,187,570,186,577,185,582,182,591,181,597,180,603,179,609,178,617,178,624,176,629,167,628,157,628,154,628,153,617,152,600,151,592,149,585,147,578,145,569,143,561,141,552,141,543,142,532,144,523,147,515], fillColor: primary_color},

   	]
   }
 }



}




export const NotificationConfiguration =
    [
      {
        notificationAlias : 'newenquiry',
        notificationType:'New Enquiry',
        isEnable : 0 ,
        notificationthrough : cloneDeep(NotificationType),
        days:null,
      },
      {
        notificationAlias : 'newmember',
        notificationType:'New Member',
        isEnable : 0 ,
        notificationthrough : cloneDeep(NotificationType),
        days:null,
      },
    {
      notificationAlias : 'paymentNotification',
      notificationType:'Payment',
      isEnable : 0 ,
      notificationthrough : cloneDeep(NotificationType),
      days:null,
    },
    {
      notificationAlias : 'paymentDue',
      notificationType:'Payment Dues',
      isEnable : 0 ,
      notificationthrough : cloneDeep(NotificationType),
      days:null,
    },
     {
      notificationAlias :  'prepaymentDue',
      notificationType:'Pre-Payment Dues',
      isEnable : 0 ,
      notificationthrough : cloneDeep(NotificationType),
      days:[
            {
              checked : false,
              value : -10,
            },
            {
              checked : false,
              value : -5,
            },
            {
              checked : false,
              value : -3,
            },
            {
              checked : false,
              value : -1,
            },
      ],
      },
      {
       notificationAlias :  'postpaymentDue',
       notificationType:'Post-Payment Dues',
       isEnable : 0 ,
       notificationthrough : cloneDeep(NotificationType),
       days:[
         {
           checked : false,
           value : 1,
         },
         {
           checked : false,
           value : 3,
         },
         {
           checked : false,
           value : 5,
         },
         {
           checked : false,
           value : 10,
         },
       ],
       },
      {
        notificationAlias :  'memberExpiring',
        notificationType:'Membership Expired',
        isEnable : 0 ,
        notificationthrough : cloneDeep(NotificationType),
        days:null,
       },
       {
        notificationAlias :  'prememberExpiring',
        notificationType:'Pre-Membership Expired',
        isEnable : 0 ,
        notificationthrough : cloneDeep(NotificationType),
        days:[
          {
           checked : false,
           value : -1,
         },
         {
           checked : false,
           value : -3,
         },
         {
           checked : false,
           value : -5,
         },
         {
           checked : false,
           value : -10,
         },
        ],
       },
       {
        notificationAlias :  'postmemberExpiring',
        notificationType:'Post-Membership Expired',
        isEnable : 0 ,
        notificationthrough : cloneDeep(NotificationType),
        days:[
          {
           checked : false,
           value : 1,
         },
         {
           checked : false,
           value : 3,
         },
         {
           checked : false,
           value : 5,
         },
         {
           checked : false,
           value : 10,
         },
        ],
        },
        {
         notificationAlias :  'prePTExpiring',
         notificationType:'Pre-PT Expired',
         isEnable : 0 ,
         notificationthrough : cloneDeep(NotificationType),
         days:[
           {
            checked : false,
            value : -1,
          },
          {
            checked : false,
            value : -3,
          },
          {
            checked : false,
            value : -5,
          },
          {
            checked : false,
            value : -10,
          },
         ],
        },
       {
       notificationAlias :  'birthdayWishes',
       notificationType:'Birthday Wishes',
       isEnable : 0 ,
       notificationthrough : cloneDeep(NotificationType),
       days:null,
     },
     {
       notificationAlias :  'anniversaryWishes',
       notificationType:'Anniversary Wishes',
       isEnable : 0 ,
       notificationthrough : cloneDeep(NotificationType),
       days:null,
     },
     {
       notificationAlias :  'chequeBounce',
       notificationType:'Cheque Bounce',
       isEnable : 0 ,
       notificationthrough : cloneDeep(NotificationType),
       days:null,
   },
    ]

    export const InvoiceConfig = {
      termscondition : 'Goods once sold will not be accepted back. Our responsibility ceases as soon as goods leaves our premises',
      footermessge : 'Thank you! Come again',
    }

export const EmailGatewayConfiguration =
[
  {
    domain : 'gmail',
    host:'smtp.gmail.com',
    port : '465',
    secureconnection : 1,
  },
]

export default CustomConfig;
