var connection = require('../mysql/dbConnection');
var helper = require('../helpers/helpers');
var {encrypt, decrypt} = require('../helpers/encryption');
var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var Excel = require('exceljs');
var {getPathToUpload} = require('../helpers/file');

var { writeLog } = require('../helpers/log');
exports.list = function(req, res){

    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    user.ip = req.clientIp;
    user.deviceinfo = req.headers.deviceinfo;
    var rights = helper.checkModuleRights(client,user,"game","view");
    if(rights)
    {
        connection.executeQuery("call USPgamesearch('"+ JSON.stringify(req.body) +"')").then((data) =>
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
  const game = JSON.parse(req.body.game);
  user.ip = req.clientIp;
  user.deviceinfo = req.headers.deviceinfo;
  let pathForDB = [];


  var launchdate = helper.convertToMysqlDatefromJSDate(game.launchdate);
  launchdate = launchdate != '' ? "'" + launchdate + "'" : null;


      game.id = game.id != "0" ?  decrypt(game.id) : 0;
      let moduleoperation = game.id != "0" ? 'update' :'add';
      helper.checkModuleForChangedData(client,user,"game",moduleoperation,game);

    var winnersObj = game.id == 0 ? helper.getGameWinners(game.tickets,game.drawsequence) : {};

          connection.executeQuery("call USPgamesave('"+game.id+"','"+game.status+ "','"+user.id+"','"+client.id+
            "',"+launchdate+",'"+JSON.stringify(game.drawsequence)+"','"+JSON.stringify(game.tickets)+"','"+JSON.stringify(winnersObj.winners)+"','"+JSON.stringify(winnersObj.called_numbers)+"','" +JSON.stringify(game.gameprice) + "')").then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

    };
exports.view = function(req, res){
        const {client , user} = res.locals.oauth.token;
        connection.executeQuery("call USPgameview("+ decrypt(req.body.id)+",'"+client.id+"')").then((data) =>
            {
              if(data[0] && data[0][0])
               {
                       data[0][0].id = encrypt(data[0][0].id.toString());

               }
               if(data[1])
               {
                 data[1].map((x) => {
                   x.customer = x.customer ? unescape(x.customer) : x.customer;
                 })
               }

               res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
  };



exports.delete = function(req, res){

      const {client , user} = res.locals.oauth.token;
      user.ip = req.clientIp;
      user.deviceinfo = req.headers.deviceinfo;
      req.body.id = decrypt(req.body.id);
      helper.checkModuleForChangedData(client,user,"game","delete",req.body);

        connection.executeQuery("call USPgamedelete("+req.body.id+", "+ client.id +" , '"+user.id+"')").then((data) =>
            {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
    };





    exports.viewgamepage = function(req, res){
            connection.executeQuery("call USPgamepageview(2)").then((data) =>
                {
                  if(data[0] && data[0][0])
                   {
                           data[0][0].id = data[0][0].id ? encrypt(data[0][0].id.toString()) : data[0][0].id;

                   }

                   if(data[1])
                   {
                     data[1].map((x) => {
                       x.customer = x.customer ? unescape(x.customer) : x.customer;
                     })
                   }
                   res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
      };


      exports.staffwisesales = function(req, res){
              connection.executeQuery("call USPgamestaffwisesales(2)").then((data) =>
                  {

                     res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
        };


        exports.mysales = function(req, res){
          const {client , user} = res.locals.oauth.token;
                connection.executeQuery("call USPgamemysalessearch(2,"+user.id+")").then((data) =>
                    {

                      data[0].map((x) => {
                        x.customer = x.customer ? unescape(x.customer) : x.customer;
                      })
                       res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
          };



          exports.totalsales = function(req, res){
            const {client , user} = res.locals.oauth.token;
                  connection.executeQuery("call USPgameallsalessearch(2,"+user.id+")").then((data) =>
                      {

                        data[0].map((x) => {
                          x.customer = x.customer ? unescape(x.customer) : x.customer;
                        })
                         res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
            };


          exports.errorlogs = function(req, res){
                        const errorlogs = req.body;
                          errorlogs.info = escape(errorlogs.info.componentStack);
                          errorlogs.error;

                          let logs = {info : errorlogs.info , error : errorlogs.error};

                          writeLog({  data : logs });

                          res.send("success");
                    }
