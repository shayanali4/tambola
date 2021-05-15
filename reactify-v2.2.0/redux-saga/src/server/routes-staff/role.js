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
    var rights = helper.checkModuleRights(client,user,"role","view")

    if(rights)
    {
        connection.executeQuery("call USProlesearch('"+ JSON.stringify(req.body) +"')").then((data) =>
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

  const {client , user} = res.locals.oauth.token;
  const role = req.body;
  user.ip = req.clientIp;
  user.deviceinfo = req.headers.deviceinfo;
  let moduleoperation = role.id != "0" ? 'update' :'add';
  helper.checkModuleForChangedData(client,user,"role",moduleoperation,role);

  role.role = role.role.trim();

    role.alias =  role.alias ?  "'" + role.alias + "'" : null;
  role.id = role.id != "0" ?  decrypt(role.id) : 0;
      connection.executeQuery("call USProlesave('"+role.id+"','"+role.role+"',"+role.alias +",'"+JSON.stringify(role.modules)+"','"+JSON.stringify(role.additionalrights)+"','"+user.id+"','"+client.id+"');")
       .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

    };
    exports.delete = function(req, res){

          const {client , user} = res.locals.oauth.token;
          user.ip = req.clientIp;
          user.deviceinfo = req.headers.deviceinfo;
          req.body.id = decrypt(req.body.id);
          helper.checkModuleForChangedData(client,user,"role","delete",req.body);

            connection.executeQuery("call USProledelete("+req.body.id+", "+ client.id +" , '"+user.id+"')").then((data) =>
                {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
        };

    exports.restorerole = function(req, res){

              const {client , user} = res.locals.oauth.token;
              user.ip = req.clientIp;
              user.deviceinfo = req.headers.deviceinfo;

              helper.checkModuleForChangedData(client,user,"role","restore",req.body);

                connection.executeQuery("call USProlerestore('"+req.body.alias+"')").then((data) =>
                    {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
            };
