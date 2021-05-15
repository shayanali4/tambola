var connection = require('../mysql/dbConnection');
var Helper = require('../helpers/helpers');
var helper = require('../helpers/helpers');
var {encrypt, decrypt} = require('../helpers/encryption');

var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');

exports.list = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    user.ip = req.clientIp;
    user.deviceinfo = req.headers.deviceinfo;
    var rights = helper.checkModuleRights(client,user,"zone","view")

    if(rights)
    {
        connection.executeQuery("call USPzonesearch('"+ JSON.stringify(req.body) +"')").then((data) =>
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

  const zone = req.body.zone;
  const {client , user} = res.locals.oauth.token;
  user.ip = req.clientIp;
  user.deviceinfo = req.headers.deviceinfo;

      zone.id = zone.id != "0" ?  decrypt(zone.id) : 0;
      let moduleoperation = zone.id != "0" ? 'update' :'add';
      helper.checkModuleForChangedData(client,user,"zone",moduleoperation,zone);

      zone.name =zone.name.trim();

      connection.executeQuery("call USPzonesave('"+zone.id+"','"+zone.name+"','"+user.id+"','"+client.id+"','"+JSON.stringify(zone.selectedbranches)+"')")
       .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

    };

    exports.view = function(req, res){

            const {client , user} = res.locals.oauth.token;
              connection.executeQuery("call USPzoneview("+decrypt(req.body.id)+",'"+client.id+"')").then((data) =>
            {
              if(data[0] && data[0][0])
               {
                       data[0][0].id = encrypt(data[0][0].id.toString());
                       data[0][0].branchlist = data[0][0].branchlist ? JSON.parse(data[0][0].branchlist) : [];
               }

               res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
  };

    exports.delete = function(req, res){

          const {client , user} = res.locals.oauth.token;
          user.ip = req.clientIp;
          user.deviceinfo = req.headers.deviceinfo;
          req.body.id = decrypt(req.body.id);
          helper.checkModuleForChangedData(client,user,"zone","delete",req.body);

            connection.executeQuery("call USPzonedelete("+req.body.id+", "+ client.id +" ,'"+user.id+"')").then((data) =>
                {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
        };
