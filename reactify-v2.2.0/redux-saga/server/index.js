const path = require("path"), express = require("express"),oauthServer = require('express-oauth-server');
const cors = require('cors'), bodyParser= require('body-parser'), app = express();
const fileUpload = require('express-fileupload'), DIST_DIR = path.join(__dirname, "../dist");
const HTML_FILE = path.join(DIST_DIR, "index.html"), DEFAULT_PORT  = 8888;
const isDevelopment = process.env.NODE_ENV !== "production";
const {defaultConfiguration} = require('./constants/AppConfig');
const { writeLog } = require('./helpers/log');


var connection = require('./mysql/dbConnection');
const requestIp = require('request-ip');

const compression = require('compression')

var {databaseConfiguration} = require('./constants/AppConfig');
var {encrypt} = require('./helpers/encryption');
const fs = require('fs');

var clients = [];


if (!isDevelopment) {
  app.set("port", process.env.PORT || 443);
}
else {
    app.set("port", process.env.PORT || DEFAULT_PORT);
}

var util = require('util');
app.use(cors());
app.use(compression());

const server = require("http").createServer(app);


app.use(requestIp.mw());


if (!isDevelopment) {

  app.get('*', function (req, res, next) {

    if(req.url.indexOf("/apple") && req.url.indexOf("x") && req.url.indexOf(".png"))
          req.url = req.url.substring(req.url.indexOf("/apple"));

    else if(req.url.indexOf("/icon_") && req.url.indexOf("x") && req.url.indexOf(".png"))
          req.url = req.url.substring(req.url.indexOf("/icon_"));

    else if(req.url.indexOf("/manifest"))
  		  req.url = req.url.substring(req.url.indexOf("/manifest"));

    else if(req.url.indexOf("/static"))
    		 req.url = req.url.substring(req.url.indexOf("/static"));

    next();
  });






  app.get('*.js', function (req, res, next) {
    if(req.url.indexOf('tgp-sw')< 0)
    {
         req.url = req.url.replace('.js','.js.gz');
         res.set('Content-type', 'application/javascript; charset: UTF-8');
         res.set('Content-Encoding', 'gzip');
    }
   next();
 });

 app.get('*.css', function (req, res, next) {
   req.url = req.url.replace('.css','.css.gz');
   res.set('Content-type', 'text/css; charset: UTF-8');
   res.set('Content-Encoding', 'gzip');
   next();
 });

 app.use("/api/" , express.static(defaultConfiguration.basePathForExternalSources));


  app.use(express.static(DIST_DIR));

  app.use("/api/" , express.static(defaultConfiguration.basePathForUploadStaticFile));
  app.use("/api/" , express.static(defaultConfiguration.basePathForSampleFile));

  app.get("*", (req, res) =>  res.sendFile(HTML_FILE));
}
else
{
	app.use("/api/" , express.static(defaultConfiguration.basePathForUploadStaticFile));
  app.use("/api/" , express.static(defaultConfiguration.basePathForSampleFile));

  app.get('*.css', function (req, res, next) {
    req.url = req.url.replace('.css','.css.gz');
    res.set('Content-type', 'text/css; charset: UTF-8');
    res.set('Content-Encoding', 'gzip');
    next();
  });

  app.get('*.js', function (req, res, next) {
    if(req.url.indexOf('tgp-sw')< 0)
    {
         req.url = req.url.replace('.js','.js.gz');
         res.set('Content-type', 'application/javascript; charset: UTF-8');
         res.set('Content-Encoding', 'gzip');
    }
   next();
 });


  app.use("/api/" , express.static(defaultConfiguration.basePathForExternalSources));

}


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());





const { client, employee,  service, store,storecategory,deal,game, bookticket,dealtype,classes, member, autocomplete, holidays,

   dataservice,zones,branches,measurements,exercises ,workoutroutines,workoutschedules,templateConfigurations ,reports ,revenue,staffPerformance}  =  require('./routes-staff');
const { subscription ,dues , product , expense , staffpay ,dashboard,role,feedback,performance,equipment,personaltraining,recipe,
  dietroutine,allocatediet,staffnotification,investment,disclaimer/*,biometricerestfulapi,biometriccallbackapi*/,biomax,trainersfeedbackbymember,
  budget,broadcast,budgetdashboard,changesale,competition,memberprofiledashboard,gymaccessslot,visitorbook,poster,employeeshift,
  resultandtestimonial,followupdashboard,followupanalysis,package,memberdisclaimerlist,inductionchecklist,loginenquiryform} =  require('./routes-staff');




// Add OAuth server.
app.oauth = new oauthServer({
  debug: true,
  model: require('./oauth/model'),
});

app.post("/api/view-gamepage", game.viewgamepage);
app.post("/api/error-logs", game.errorlogs);


app.post("/api/client-signup", client.signup);
app.post("/api/verify-client-signup", client.verify);
app.post("/api/save-establishmentinfo", client.establishment);
app.post("/api/save-organizationinfo", client.organization);
app.post("/api/save-url", client.url);
app.post("/api/client-signin", client.clientsignin);
app.post("/api/client-forgetwebaddress", client.clientforgetwebaddress);
app.post("/api/client-signindetail", client.signindetail);
app.post("/api/client-forgetpassword",employee.clientforgetpassword);

//auto- complete
app.post("/api/country-suggestion" , autocomplete.getCountry);
app.post("/api/state-suggestion" , autocomplete.getState);
app.post("/api/timezone-list", dataservice.getTimeZone);
app.post("/api/freeservice-list", dataservice.getFreeService);


app.post("/api/login-branch-list",dataservice.getLoginBranch);




// Post token.
app.post('/api/oauth/token', app.oauth.token({accessTokenLifetime : 60 * 60 * 30, refreshTokenLifetime: 60 * 60 * 24 * 30 }));

app.use(app.oauth.authenticate());

app.post('*', function (req, res, next) {

  let client = null;
  if(res.locals.oauth)
      client  = res.locals.oauth.token.client;

          writeLog ({client : client ? res.locals.oauth.token.user.code + ' ' +  client.clientCode : '',  url : req.url,  data : req.body });

  next();});



  app.post("/api/push-subscribe-withoath", (req, res) => {

      const {subscription, urlid , logintype }  = req.body;
      const {client , user} = res.locals.oauth.token;


      connection.executeQuery("call USPpushsubscriptionsave('"+ JSON.stringify(subscription) +"','" + urlid +"','"+logintype+"','"+client.id+"','"+user.id+"',1)").then((data) =>
          {  res.send({});  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
  });



//auto- complete
app.post("/api/allmember-suggestion" , autocomplete.getMemberAll);
app.post("/api/member-suggestion" , autocomplete.getMember);
app.post("/api/enquiry-suggestion" , autocomplete.getEnquiry);
app.post("/api/equipment-suggestion" , autocomplete.getEquipment);
app.post("/api/equipmentbrand-suggestion" , autocomplete.getEquipmentBrand);
app.post("/api/membercode-suggestion" , autocomplete.getMemberCode);
app.post("/api/member-suggestion-visitorbook" , autocomplete.getMemberVisitorBook);


// get database data list
app.post("/api/employee-list", dataservice.getEmployee);
app.post("/api/zone-list", dataservice.getZone);
app.post("/api/schedule-list", dataservice.getSchedule);
app.post("/api/exercise-list", dataservice.getExercise);
app.post("/api/routine-list", dataservice.getRoutine);
app.post("/api/class-list", dataservice.getClass);
app.post("/api/tagnames-list", dataservice.getTagnames);
app.post("/api/role-list", dataservice.getRoles);
app.post("/api/recipe-list", dataservice.getRecipe);
app.post("/api/diet-routine-list", dataservice.getDietRoutine);
app.post("/api/branch-list", dataservice.getBranch);
app.post("/api/basicquestion-list", dataservice.getBasicQuestion);
app.post("/api/gymrules-list", dataservice.getGymRules);
app.post("/api/tax-list", dataservice.gettax);
app.post("/api/taxcodecategory-list", dataservice.gettaxcodecategory);
app.post("/api/biometric-list", dataservice.getBiometric);
app.post("/api/budget-list", dataservice.getbudget);
app.post("/api/client-list", dataservice.getclient);
app.post("/api/serviceparallelplan-list", dataservice.getserviceparallelplan);
app.post("/api/session-list", dataservice.getSessiontype);
app.post("/api/shift-list", dataservice.getShift);
app.post("/api/holiday-list", dataservice.getHolidayList);
app.post("/api/storecategory-list",dataservice.getStoreCategory);
app.post("/api/dealtype-list",dataservice.getDealType);
app.post("/api/store-list",dataservice.getStore);

app.post("/api/get-employees", employee.list);
app.post("/api/delete-employee", employee.delete);
app.post("/api/save-employee", employee.save);
app.post("/api/view-employee", employee.view);
app.post("/api/get-profile-detail", employee.getuserprofile);
app.post("/api/save-employeeattendance", employee.saveattendance);
app.post("/api/get-employeeattendance", employee.getattendance);
app.post("/api/delete-employeeattendance", employee.deleteattendance);
app.post("/api/get-employeepersonaltraining", employee.employeepersonaltraininglist);
app.post("/api/get-employeegroupsession", employee.employeegroupsessionlist);
app.post("/api/get-employeegroupsessionclasswise", employee.employeegroupsessionlistclasswise);
app.post("/api/user-profile-staffpay", employee.userprofilestaffpay);
app.post("/api/set-user-default-branch", employee.setemployeedefaultbranch);
app.post("/api/save-employeetermscondition", employee.savetermscondition);


app.post("/api/get-client-profile-detail", employee.getclientprofile);
app.post("/api/get-branch-profile-detail", employee.getbranchprofile);
app.post("/api/save-client-profile", employee.saveclientprofile);
app.post("/api/save-changepassword", employee.savechangepassword);
app.post("/api/save-user-theme", employee.saveusertheme);
app.post("/api/save-configuration", employee.saveconfiguration);
app.post("/api/view-configuration", employee.viewconfiguration);
app.post("/api/save-paymentgateay-configuration", employee.savepaymentgatewayconfiguration);
app.post("/api/save-user-unit", employee.userunitsave);
app.post("/api/save-client-socialmedia", employee.saveclientsocialmedia);
app.post("/api/save-client-branding", employee.saveclientbranding);
app.post("/api/save-paymentgateay-configuration-status", employee.savepaymentgatewayconfigurationsave);

app.post("/api/save-tax", employee.savetax);
app.post("/api/get-taxes", employee.gettaxes);
app.post("/api/save-taxconfiguration", employee.savetaxconfiguration);
app.post("/api/view-tax", employee.viewtax);
app.post("/api/delete-tax", employee.deletetax);
app.post("/api/save-code-Category", employee.savetaxcodecategory);
app.post("/api/get-taxcodecategories", employee.gettaxcodecategories);
app.post("/api/view-taxcodecategory", employee.viewtaxcodecategory);
app.post("/api/delete-taxcodecategory", employee.deletetaxcodecategory);
app.post("/api/save-biometricconfiquration", employee.savebiometricconfiguration);


app.post("/api/save-game", game.save);
app.post("/api/get-games", game.list);
app.post("/api/view-game", game.view)
app.post("/api/delete-game", game.delete);
app.post("/api/staffwise-sales", game.staffwisesales);
app.post("/api/my-sales", game.mysales);
app.post("/api/total-sales", game.totalsales);

app.post("/api/save-role", role.save);
app.post("/api/get-roles", role.list);
app.post("/api/delete-role", role.delete);
app.post("/api/restore-role", role.restorerole);


app.post("/api/delete-bookticket", bookticket.delete);
app.post("/api/save-bookticket", bookticket.save);
app.post("/api/get-booktickets", bookticket.list);



app.post("/api/get-biometric", employee.getbiometrics);
app.post("/api/save-biometric", employee.savebiometric);
app.post("/api/view-biometric", employee.viewbiometric);
app.post("/api/userprofile-view", employee.userprofileview);
app.post("/api/user-referral-list", employee.userreferrallist);

server.listen(app.get("port"), () => console.log("Listening on port "+ app.get("port") +"!"));
