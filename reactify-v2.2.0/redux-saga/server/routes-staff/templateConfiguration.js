var connection = require('../mysql/dbConnection');
var Helper = require('../helpers/helpers');
var helper = require('../helpers/encryption');
var helpers = require('../helpers/helpers');
var {encrypt, decrypt} = require('../helpers/encryption');

var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');

exports.list = function(req, res){

    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    user.ip = req.clientIp;
    user.deviceinfo = req.headers.deviceinfo;
    var rights = helpers.checkModuleRights(client,user,"templateconfiguration","view")

    if(rights)
    {
        connection.executeQuery("call USPtemplatesearch('"+ JSON.stringify(req.body) +"')").then((data) =>
          {
              data[0].map((x) => {
                x.id = encrypt(x.id.toString());
              })

               res.send(data);
            },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
      }
      else {
        res.status(401).send(getErrorMessageFromDatabase());
      }
};


exports.save = function(req, res){

  const template = req.body.template;
  const {client , user} = res.locals.oauth.token;
  user.ip = req.clientIp;
  user.deviceinfo = req.headers.deviceinfo;
  template.id = template.id != "0" ?  decrypt(template.id) : 0;
  template.subject = template.subject || "";
  template.content = escape(template.content);
  template.predefinedtags = template.predefinedtags || "";
  let moduleoperation = template.id != "0" ? 'update' :'add';
  helpers.checkModuleForChangedData(client,user,"templateconfiguration",moduleoperation,template);

  template.templatetitle = template.templatetitle.trim();

      connection.executeQuery("call USPtemplatesave('"+template.id+"','"+template.templatetype+"','"+template.templatetitle+
      "','"+template.subject+"','"+template.content+"','"+user.id+"','"+client.id+"', '" + template.notificationalias +"','"+template.activeTab+"','"+template.predefinedtags+"');")
       .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

    };
    exports.view = function(req, res){
        const {client , user} = res.locals.oauth.token;
        connection.executeQuery("call USPtemplateview("+decrypt(req.body.id)+",'"+client.id+"','',"+0+")").then((data) =>
{
              if(data[0] && data[0][0])
               {
                       data[0][0].id = encrypt(data[0][0].id.toString());
                       data[0][0].content = unescape(data[0][0].content);
               }

               res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
  };

    exports.delete = function(req, res){

          const {client , user} = res.locals.oauth.token;
          user.ip = req.clientIp;
          user.deviceinfo = req.headers.deviceinfo;
          req.body.id = decrypt(req.body.id);
          helpers.checkModuleForChangedData(client,user,"templateconfiguration","delete",req.body);

            connection.executeQuery("call USPtemplatedelete("+req.body.id+ ", '"+user.id+"' ,"   + client.id +")").then((data) =>
                {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
        };

    exports.savenotificationconfiguration = function(req, res){

            const {client , user} = res.locals.oauth.token;
            user.ip = req.clientIp;
            user.deviceinfo = req.headers.deviceinfo;
            req.body.clientId = client.id;
            req.body.userId = user.id;

            helpers.checkModuleForChangedData(client,user,"templateconfiguration",'savenotificationconfiguration',req.body);

            connection.executeQuery("call USPclientnotificationconfigurationsave('"+ JSON.stringify(req.body) +"')").then((data) =>
                {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
        };

    exports.viewnotificationconfiguration = function(req, res){
            const {client , user} = res.locals.oauth.token;
            connection.executeQuery("call USPclientnotificationconfigurationview('"+client.id+"')").then((data) =>
                {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
        };

    exports.savenotificationemailgateway = function(req, res){

          // const {template,sms} = req.body;
            const {client , user} = res.locals.oauth.token;
            user.ip = req.clientIp;
            user.deviceinfo = req.headers.deviceinfo;
            req.body.template =  req.body.template || null;
            if(req.body.template)
            {
              req.body.template.password = encrypt(req.body.template.password);
            }
            req.body.sms =  req.body.sms || null;
            if(req.body.sms){
              req.body.sms.transactionalurl = escape(req.body.sms.transactionalurl);
              req.body.sms.promotionalurl = escape(req.body.sms.promotionalurl);
              req.body.sms.headers = escape(req.body.sms.headers);
            }
            helpers.checkModuleForChangedData(client,user,"templateconfiguration",'savenotificationgateway',req.body);

            req.body.template = req.body.template  ? "'" + JSON.stringify(req.body.template) + "'" : null;
            req.body.sms = req.body.sms ? "'" + JSON.stringify(req.body.sms) + "'" : null;

            connection.executeQuery("call USPclientemailgatewaysave('"+client.id+"',"+req.body.template+","+req.body.sms+"  );")
               .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
        };

    exports.viewgatewayinformation = function(req, res){
          const {client , user} = res.locals.oauth.token;
          connection.executeQuery("call USPclientgatewayinformation('"+client.id+"')").then((data) =>
          {
              if(data[0] && data[0][0])
               {
                 if(data[0][0].emailgateway)
                 {
                   data[0][0].emailgateway = JSON.parse(data[0][0].emailgateway);
                   data[0][0].emailgateway.password = decrypt(data[0][0].emailgateway.password);
                 }

                 if(data[0][0].smsgateway)
                 {
                   data[0][0].smsgateway = JSON.parse(data[0][0].smsgateway);
                   data[0][0].smsgateway.transactionalurl = unescape(data[0][0].smsgateway.transactionalurl)
                   data[0][0].smsgateway.promotionalurl = unescape(data[0][0].smsgateway.promotionalurl)
                   data[0][0].smsgateway.headers = unescape(data[0][0].smsgateway.headers)

                 }
               }
                      res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
            };
