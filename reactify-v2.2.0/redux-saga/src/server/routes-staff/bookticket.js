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
    var rights = helper.checkModuleRights(client,user,"bookticket","view");
    if(rights)
    {
        connection.executeQuery("call USPgamebookticketsearch('"+user.id+"','2')").then((data) =>
          {
              data[0].map((x) => {
                x.id = encrypt(x.id.toString());
              })
              data[1].map((x) => {
                x.customer = x.customer ? unescape(x.customer) : x.customer;
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
  const bookticket = JSON.parse(req.body.bookticket);
  user.ip = req.clientIp;
  user.deviceinfo = req.headers.deviceinfo;
  let pathForDB = [];


      bookticket.customer = escape(bookticket.customer);
      bookticket.sheetid = bookticket.sheetid || 0;
      let moduleoperation = bookticket.id != "0" ? 'update' :'add';
      helper.checkModuleForChangedData(client,user,"bookticket",moduleoperation,bookticket);



      connection.executeQuery("call USPgamebookticketsave('"+bookticket.id+"','"+bookticket.gameid+ "','"+bookticket.ticketid+  "','"+bookticket.sheetid+ "','"+bookticket.customer+  "','"+bookticket.mobile+  "','"+user.id+"','"+client.id+"')").then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

    };



    exports.delete = function(req, res){

      const {client , user} = res.locals.oauth.token;
      const bookticket = req.body.bookticket;
      user.ip = req.clientIp;
      user.deviceinfo = req.headers.deviceinfo;
      let pathForDB = [];


          bookticket.customer = escape(bookticket.customer);
          bookticket.sheetid = bookticket.sheetid || 0;

          helper.checkModuleForChangedData(client,user,"bookticket","delete",bookticket);

          connection.executeQuery("call USPgamebookticketdelete('"+bookticket.id+"','"+bookticket.gameid+ "','"+bookticket.ticketid+  "','"+bookticket.sheetid+ "','"+bookticket.customer+  "','"+bookticket.mobile+  "','"+user.id+"','"+client.id+"')").then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

        };
