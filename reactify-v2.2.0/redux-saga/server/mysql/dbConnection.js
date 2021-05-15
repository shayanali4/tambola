// Load module
var mysql = require('promise-mysql');
var {databaseConfiguration} = require('../constants/AppConfig');
var { writeLog } = require('../helpers/log');


// Initialize pool
var pool      =    mysql.createPool({
    connectionLimit : databaseConfiguration.connectionLimit,
    host     : databaseConfiguration.host,
    user     :  databaseConfiguration.user,
    password : databaseConfiguration.password,
    database : databaseConfiguration.database
});

exports.executeQuery = function (query){
    return new Promise(function(resolve, reject) {
    return  pool.then(x => { x.query(query).then(
            function (rows){
              resolve(rows);
            }
          ).catch(function(err) {

              writeLog({data : err});
              reject(err);
        })}
        ).catch(function(err) {

            writeLog({data : err});
            reject(err);
      })
    });
}
