
var connection = require('../mysql/dbConnection');
var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var { writeLog } = require('./log');

exports.savelogaccessmodule = function ({clientid,userid,logintype,modulename,ipaddress}){

      connection.executeQuery("call USPlogaccessmodulesave('"+clientid+"','"+userid+"','"+logintype+"','"+ipaddress+"','"+modulename+"')").then((data) =>
      {
        //res.send(data);
      },(error) => writeLog({data : error,message : "Access Log Error"}))

}


exports.savelogmodulechangeddata = function ({clientid,userid,logintype,modulename,ipaddress,deviceinfo,moduleoperation,data}){

      connection.executeQuery("call USPlogmodulechangeddatasave('"+clientid+"','"+userid+"','"+logintype+"','"+ipaddress+"','"+deviceinfo+"','"+modulename+"','"+moduleoperation+"','"+JSON.stringify(data)+"')").then((data) =>
      {
        //res.send(data);
      },(error) => writeLog({data : error,message : "Access Log Error"}))

}
