var axios = require ('axios');
var { writeLog } = require('../helpers/log');
var helper = require('../helpers/helpers');
var connection = require('../mysql/dbConnection');
var helper = require('../helpers/helpers');
var {encrypt, decrypt,encryptmobile} = require('../helpers/encryption');
var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var {defaultConfiguration} = require('../constants/AppConfig');
var Excel = require('exceljs');

exports.UploadUsersInBiometric = function(req, res){
                const {client , user} = res.locals.oauth.token;
                let {data} = req.body;
                uploadbiomaxuser(data,res)

      };
      exports.BulkUploadUsersInBiometric = function(req, res){
                      const {client , user} = res.locals.oauth.token;
                      let data = req.body.biometricdata;

                      if(data){
                         data.map(x => {
                           if(x.SerialNumber){
                           uploadbiomaxuser(x,res)
                         }
                         });
                       }

            };
      exports.DeleteUserinBiometric = function(req, res){
                const {client , user} = res.locals.oauth.token;
                let {data} = req.body;
                deletebiomaxuser(data,res)

            };
            exports.BulkDeleteUserinBiometric = function(req, res){
                            const {client , user} = res.locals.oauth.token;
                            let data = req.body.biometricdata;

                            if(data){
                               data.map(x => {
                                 if(x.SerialNumber){
                                 deletebiomaxuser(x,res)
                               }
                               });
                             }

                  };
            exports.SetUserExpiration = function(req, res){
                            const {client , user} = res.locals.oauth.token;
                            let {data} = req.body;
                             let url = defaultConfiguration.biometricurl + "/SetUserExpiration" ;
                             let count = data.SerialNumber.length;
                             let maxexpirydate =  data.maxexpirydate;
                             maxexpirydate = helper.getFormtedDate(maxexpirydate,"DD-MM-YYYY");
                             data.SerialNumber.map(x => {
                               let params = {
                                 StaffBiometricCode: data.userid,
                                 ExpirationDate :  maxexpirydate,
                                 SerialNumber :x
                               };
                               writeLog({message : url ,data : params});
                                  axios.get(url,{ params: params }).then(response =>
                                                        {
                                                             writeLog({data :response.data});
                                                              count = count - 1;
                                                              if(count == 0)
                                                              {
                                                                var date = helper.convertToMysqlDatefromJSDate(data.maxexpirydate);
                                                                    date = date != '' ? "'" + date + "'" : null;

                                                                connection.executeQuery("call USPmemberaccessdatesave("+ decrypt(data.memberid)+","+ date +",'"+user.id+"')")
                                                                 .then((data) => {
                                                                    res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                                                                    res.send(response.data);

                                                              }
                                                         })
                                                         .catch(function (error) {
                                                             writeLog({data :error});

                                                             count = count - 1;
                                                             if(count == 0)
                                                             {
                                                               res.send(error.message);
                                                             }
                                })
                              });


                  };
                  exports.FetchLiveUsersFromBiometric = function(req, res){
                                  const {client , user} = res.locals.oauth.token;
                                  let {data} = req.body;
                                   let url = defaultConfiguration.biometricurl + "/FetchLiveUsersFromBiometric" ;
                                   let count = data.SerialNumber.length;
                                   data.SerialNumber.map(x => {
                                        axios.get(url,{ params: {
                                          SerialNumber :x
                                        }
                                      }).then(response =>
                                                              {
                                                                    count = count - 1;
                                                                    if(count == 0)
                                                                    {
                                                                      res.send(response.data)
                                                                    }
                                                               })
                                      .catch(function (error) {
                                          writeLog({data :error})
                                      })
                                    });
                        };
                        exports.getbiomaxmember = function(req, res){

                            const {client , user} = res.locals.oauth.token;
                            req.body.clientId = client.id;

                            user.ip = req.clientIp;
                            user.deviceinfo = req.headers.deviceinfo;
                            var rights = helper.checkModuleRights(client,user,"biometric","view")

                            if(rights)
                            {
                                connection.executeQuery("call USPbiomaxmembersearch('"+ JSON.stringify(req.body) +"')").then((data) =>
                                  {

                                              data[0].map((x) => {
                                                var mobileno =  encryptmobile(user,{mobile : x.mobile,emailid : x.personalemailid});
                                                x.mobile = mobileno.mobile;
                                                x.personalemailid = mobileno.emailid;
                                                x.id = encrypt(x.id.toString());
                                              })

                                          res.send(data);

                                  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                              }
                              else {
                                res.status(401).send(getErrorMessageFromDatabase());
                              }
                        };
                        exports.getbiomaxmemberlogs = function(req, res){

                            const {client , user} = res.locals.oauth.token;
                            req.body.clientId = client.id;

                            user.ip = req.clientIp;
                            user.deviceinfo = req.headers.deviceinfo;
                            var rights = helper.checkModuleRights(client,user,"biometric","view");
                            let client_timezoneoffsetvalue = req.body.client_timezoneoffsetvalue;

                            if(rights)
                            {
                              connection.executeQuery("call USPbiomaxLogdataserach('"+ JSON.stringify(req.body) +"')").then((data) =>
                              {
                                helper.checkModuleForChangedData(client,user,"MemberAttendanceBiomaxLogsReport","export", req.body);
                                if(req.body.exportXLSX || req.body.sendMail)
                                {
                                  try {
                                          if(!(data && data[0] && data[0].length > 0))
                                          {
                                              return res.status(500).send({});
                                          }

                                          var workbook = new Excel.Workbook();

                                          data[0].map((x) => {
                                            x.intime = helper.getFormtedDateTime(x.intime,client_timezoneoffsetvalue);
                                            x.outtime = helper.getFormtedDateTime(x.outtime,client_timezoneoffsetvalue);
                                            let hours = helper.convertSecToHour(x.difference * 60);
                                            x.difference = hours ? (hours.hh + ':' + hours.mm + ':' + hours.ss) : '';
                                          });

                                          var worksheet = workbook.addWorksheet('MemberAttendanceReport');

                                          worksheet.columns = [
                                            { header: 'MEMBER NAME', key: 'name' , width: 30},
                                            { header: 'MEMBER CODE', key: 'membercode', width: 30 },
                                            { header: 'GENDER', key: 'gender', width: 16},
                                            { header: 'CHECK-IN TIME', key: 'intime', width: 15 },
                                            { header: 'CHECK-OUT TIME', key: 'outtime', width: 15 },
                                            { header: 'IN TIME', key: 'difference', width: 18 }
                                          ];
                                          worksheet.getRow(1).font = { bold: true };

                                          worksheet.addRows(data[0]);

                                          if(req.body.sendMail)
                                          {
                                            const pathObj = getPathToUpload(client, "MemberAttendanceReport.xlsx", 'ReportDownload');

                                                                workbook.xlsx.writeFile(pathObj.pathForSave)
                                                                .then(function() {
                                                                  let attachment = [{
                                                                            filename: 'Member Attendance Report.xlsx',
                                                                            path: pathObj.pathForSave,
                                                                            pathForDB : pathObj.pathForDB

                                                                  }];
                                                                      res.end();
                                                                });
                                          }
                                          else {
                                            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                            res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

                                            workbook.xlsx.write(res).then(function(){
                                                res.end();
                                            });
                                          }
                                      } catch(err) {
                                          writeLog({data : err});
                                          res.status(500).send(getErrorMessageFromDatabase());
                                      }
                                }
                                else {
                                  data[0].map((x) => {
                                    x.id = encrypt(x.id.toString());
                                  })
                                    res.send(data);
                                }
                              },(error) => {error.sqlMessage =="Table is not exists." ? res.send([]): res.status(500).send(getErrorMessageFromDatabase(error))})

                            }
                              else {
                                res.status(401).send(getErrorMessageFromDatabase());
                              }
                        };
                        exports.getbiomaxuser = function(req, res){

                            const {client , user} = res.locals.oauth.token;
                            req.body.clientId = client.id;

                            user.ip = req.clientIp;
                            user.deviceinfo = req.headers.deviceinfo;
                            var rights = helper.checkModuleRights(client,user,"userbiometric","view")

                            if(rights)
                            {
                                connection.executeQuery("call USPbiomaxusersearch('"+ JSON.stringify(req.body) +"')").then((data) =>
                                  {

                                              data[0].map((x) => {
                                                var mobileno =  encryptmobile(user,{mobile : x.mobile,emailid : x.personalemailid});
                                                x.mobile = mobileno.mobile;
                                                x.personalemailid = mobileno.emailid;
                                                x.id = encrypt(x.id.toString());
                                              })

                                          res.send(data);

                                  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                              }
                              else {
                                res.status(401).send(getErrorMessageFromDatabase());
                              }
                        };
                        exports.getbiomaxuserlogs = function(req, res){

                            const {client , user} = res.locals.oauth.token;
                            req.body.clientId = client.id;
                            user.ip = req.clientIp;

                            user.deviceinfo = req.headers.deviceinfo;
                            var rights = helper.checkModuleRights(client,user,"userbiometric","view");
                            let client_timezoneoffsetvalue = req.body.client_timezoneoffsetvalue;

                            if(rights)
                            {
                              connection.executeQuery("call USPbiomaxLogdatausersearch('"+ JSON.stringify(req.body) +"')").then((data) =>
                              {
                                helper.checkModuleForChangedData(client,user,"collectionReport","export", req.body);
                                if(req.body.exportXLSX || req.body.sendMail)
                                {
                                  try {
                                          if(!(data && data[0] && data[0].length > 0))
                                          {
                                              return res.status(500).send({});
                                          }

                                          var workbook = new Excel.Workbook();

                                          data[0].map((x) => {
                                            x.intime = helper.getFormtedDateTime(x.intime,client_timezoneoffsetvalue);
                                            x.outtime = helper.getFormtedDateTime(x.outtime,client_timezoneoffsetvalue);
                                            let hours = helper.convertSecToHour(x.difference * 60);
                                            x.difference = hours ? (hours.hh + ':' + hours.mm + ':' + hours.ss) : '';
                                          });

                                          var worksheet = workbook.addWorksheet('StaffAttendanceReport');

                                          worksheet.columns = [
                                            { header: 'EMPLOYEE NAME', key: 'name' , width: 30},
                                            { header: 'EMPLOYEE CODE', key: 'employeecode', width: 30 },
                                              { header: 'ROLE', key: 'rolename', width: 20 },
                                            { header: 'GENDER', key: 'gender', width: 16},
                                            { header: 'CHECK-IN TIME', key: 'intime', width: 15 },
                                            { header: 'CHECK-OUT TIME', key: 'outtime', width: 15 },
                                            { header: 'IN TIME', key: 'difference', width: 18 }
                                          ];
                                          worksheet.getRow(1).font = { bold: true };

                                          worksheet.addRows(data[0]);

                                          if(req.body.sendMail)
                                          {
                                            const pathObj = getPathToUpload(client, "StaffAttendanceReport.xlsx", 'ReportDownload');

                                                                workbook.xlsx.writeFile(pathObj.pathForSave)
                                                                .then(function() {
                                                                  let attachment = [{
                                                                            filename: 'Staff Report.xlsx',
                                                                            path: pathObj.pathForSave,
                                                                            pathForDB : pathObj.pathForDB

                                                                  }];
                                                                      res.end();
                                                                });
                                          }
                                          else {
                                            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                            res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

                                            workbook.xlsx.write(res).then(function(){
                                                res.end();
                                            });
                                          }
                                      } catch(err) {
                                          writeLog({data : err});
                                          res.status(500).send(getErrorMessageFromDatabase());
                                      }
                                }
                                else {
                                  data[0].map((x) => {
                                    x.id = encrypt(x.id.toString());
                                  })
                                    res.send(data);
                                }
                              },(error) => {error.sqlMessage =="Table is not exists." ? res.send([]): res.status(500).send(getErrorMessageFromDatabase(error))})
                            }
                            else {
                                res.status(401).send(getErrorMessageFromDatabase());
                              }
                          };
                        exports.getbiomaxunauthrisedlogs = function(req, res){

                            const {client , user} = res.locals.oauth.token;
                            req.body.clientId = client.id;

                            user.ip = req.clientIp;
                            user.deviceinfo = req.headers.deviceinfo;
                            var rights = helper.checkModuleRights(client,user,"biometric","view")

                            if(rights)
                            {
                                connection.executeQuery("call USPbiomaxunauthorisedLogdataserach('"+ JSON.stringify(req.body) +"')").then((data) =>
                                  {
                                          res.send(data);
                                  },(error) => {error.sqlMessage =="Table is not exists." ? res.send([]): res.status(500).send(getErrorMessageFromDatabase(error))})
                              }
                              else {
                                res.status(401).send(getErrorMessageFromDatabase());
                              }
                        };
                        exports.getbiomaxuserlogsdatewise = function(req, res){

                            const {client , user} = res.locals.oauth.token;
                            req.body.clientId = client.id;
                            user.ip = req.clientIp;

                            user.deviceinfo = req.headers.deviceinfo;
                            var rights = helper.checkModuleRights(client,user,"userbiometric","view");
                            let client_timezoneoffsetvalue = req.body.client_timezoneoffsetvalue;

                            if(rights)
                            {
                              connection.executeQuery("call USPbiomaxLogdatausersearchdatewise('"+ JSON.stringify(req.body) +"')").then((data) =>
                              {
                                helper.checkModuleForChangedData(client,user,"collectionReport","export", req.body);
                                if(req.body.exportXLSX || req.body.sendMail)
                                {
                                  try {
                                          if(!(data && data[0] && data[0].length > 0))
                                          {
                                              return res.status(500).send({});
                                          }

                                          var workbook = new Excel.Workbook();

                                          data[0].map((x) => {
                                            x.createdbydate = helper.getFormtedDateTime(x.createdbydate,client_timezoneoffsetvalue);
                                            let hours = helper.convertSecToHour(x.difference * 60);
                                            x.difference = hours ? (hours.hh + ':' + hours.mm + ':' + hours.ss) : '';
                                          });

                                          var worksheet = workbook.addWorksheet('StaffAttendanceDateWiseReport');

                                          worksheet.columns = [
                                            { header: 'EMPLOYEE NAME', key: 'name' , width: 30},
                                            { header: 'EMPLOYEE CODE', key: 'employeecode', width: 30 },
                                            { header: 'ROLE', key: 'rolename', width: 20 },
                                            { header: 'GENDER', key: 'gender', width: 16},
                                            { header: 'IN TIME', key: 'difference', width: 18 },
                                            { header: 'ATTENDANCE DATE', key: 'createdbydate', width: 20 }
                                          ];
                                          worksheet.getRow(1).font = { bold: true };

                                          worksheet.addRows(data[0]);

                                          if(req.body.sendMail)
                                          {
                                            const pathObj = getPathToUpload(client, "StaffAttendanceDateWiseReport.xlsx", 'ReportDownload');

                                                                workbook.xlsx.writeFile(pathObj.pathForSave)
                                                                .then(function() {
                                                                  let attachment = [{
                                                                            filename: 'StaffAttendance DateWise Report.xlsx',
                                                                            path: pathObj.pathForSave,
                                                                            pathForDB : pathObj.pathForDB

                                                                  }];
                                                                      res.end();
                                                                });
                                          }
                                          else {
                                            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                            res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

                                            workbook.xlsx.write(res).then(function(){
                                                res.end();
                                            });
                                          }
                                      } catch(err) {
                                          writeLog({data : err});
                                          res.status(500).send(getErrorMessageFromDatabase());
                                      }
                                }
                                else {
                                    res.send(data);
                                }
                              },(error) => {error.sqlMessage =="Table is not exists." ? res.send([]): res.status(500).send(getErrorMessageFromDatabase(error))})
                            }
                            else {
                                res.status(401).send(getErrorMessageFromDatabase());
                              }
                          };



                        exports.getbiomaxuserlogsstaffwise = function(req, res){

                              const {client , user} = res.locals.oauth.token;
                              req.body.clientId = client.id;
                              user.ip = req.clientIp;

                              user.deviceinfo = req.headers.deviceinfo;
                              var rights = helper.checkModuleRights(client,user,"userbiometric","view")

                              if(rights)
                              {
                                connection.executeQuery("call USPbiomaxLogdatausersearchstaffwise('"+ JSON.stringify(req.body) +"')").then((data) =>
                                {
                                  helper.checkModuleForChangedData(client,user,"collectionReport","export", req.body);
                                  if(req.body.exportXLSX || req.body.sendMail)
                                  {
                                    try {
                                            if(!(data && data[0] && data[0].length > 0))
                                            {
                                                return res.status(500).send({});
                                            }

                                            var workbook = new Excel.Workbook();

                                            data[0].map((x) => {
                                              let hours = helper.convertSecToHour(x.difference * 60);
                                              x.difference = hours ? (hours.hh + ':' + hours.mm + ':' + hours.ss) : '';
                                            });

                                            var worksheet = workbook.addWorksheet('StaffAttendanceStaffWiseReport');

                                            worksheet.columns = [
                                              { header: 'EMPLOYEE NAME', key: 'name' , width: 30},
                                              { header: 'EMPLOYEE CODE', key: 'employeecode', width: 30 },
                                              { header: 'ROLE', key: 'rolename', width: 20 },
                                              { header: 'GENDER', key: 'gender', width: 16},
                                              { header: 'IN TIME', key: 'difference', width: 18 },
                                            ];
                                            worksheet.getRow(1).font = { bold: true };

                                            worksheet.addRows(data[0]);

                                            if(req.body.sendMail)
                                            {
                                              const pathObj = getPathToUpload(client, "StaffAttendanceStaffWiseReport.xlsx", 'ReportDownload');

                                                                  workbook.xlsx.writeFile(pathObj.pathForSave)
                                                                  .then(function() {
                                                                    let attachment = [{
                                                                              filename: 'Staff Attendance Staff Wise Report.xlsx',
                                                                              path: pathObj.pathForSave,
                                                                              pathForDB : pathObj.pathForDB

                                                                    }];
                                                                        res.end();
                                                                  });
                                            }
                                            else {
                                              res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                              res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

                                              workbook.xlsx.write(res).then(function(){
                                                  res.end();
                                              });
                                            }
                                        } catch(err) {
                                            writeLog({data : err});
                                            res.status(500).send(getErrorMessageFromDatabase());
                                        }
                                  }
                                  else {
                                      res.send(data);
                                  }
                                },(error) => {error.sqlMessage =="Table is not exists." ? res.send([]): res.status(500).send(getErrorMessageFromDatabase(error))})
                              }
                              else {
                                  res.status(401).send(getErrorMessageFromDatabase());
                                }
                            };



                          exports.getbiomaxmemberlogsdatewise = function(req, res){

                              const {client , user} = res.locals.oauth.token;
                              req.body.clientId = client.id;
                              user.ip = req.clientIp;

                              user.deviceinfo = req.headers.deviceinfo;
                              var rights = helper.checkModuleRights(client,user,"biometric","view");
                              let client_timezoneoffsetvalue = req.body.client_timezoneoffsetvalue;

                              if(rights)
                              {
                                connection.executeQuery("call USPbiomaxLogdatamembersearchdatewise('"+ JSON.stringify(req.body) +"')").then((data) =>
                                {
                                  helper.checkModuleForChangedData(client,user,"biometric","export", req.body);
                                  if(req.body.exportXLSX || req.body.sendMail)
                                  {
                                    try {
                                            if(!(data && data[0] && data[0].length > 0))
                                            {
                                                return res.status(500).send({});
                                            }

                                            var workbook = new Excel.Workbook();

                                            data[0].map((x) => {
                                              x.createdbydate = helper.getFormtedDate(x.createdbydate,client_timezoneoffsetvalue);
                                              let hours = helper.convertSecToHour(x.difference * 60);
                                              x.difference = hours ? (hours.hh + ':' + hours.mm + ':' + hours.ss) : '';
                                            });

                                            var worksheet = workbook.addWorksheet('MemberAttendanceDateWiseReport');

                                            worksheet.columns = [
                                              { header: 'MEMBER NAME', key: 'name' , width: 30},
                                              { header: 'MEMBER CODE', key: 'membercode', width: 30 },
                                              { header: 'GENDER', key: 'gender', width: 16},
                                              { header: 'IN TIME', key: 'difference', width: 18 },
                                              { header: 'ATTENDANCE DATE', key: 'createdbydate', width: 20 }
                                            ];
                                            worksheet.getRow(1).font = { bold: true };

                                            worksheet.addRows(data[0]);

                                            if(req.body.sendMail)
                                            {
                                              const pathObj = getPathToUpload(client, "MemberAttendanceDateWiseReport.xlsx", 'ReportDownload');

                                                                  workbook.xlsx.writeFile(pathObj.pathForSave)
                                                                  .then(function() {
                                                                    let attachment = [{
                                                                              filename: 'MmmberAttendance DateWise Report.xlsx',
                                                                              path: pathObj.pathForSave,
                                                                              pathForDB : pathObj.pathForDB

                                                                    }];
                                                                        res.end();
                                                                  });
                                            }
                                            else {
                                              res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                              res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

                                              workbook.xlsx.write(res).then(function(){
                                                  res.end();
                                              });
                                            }
                                        } catch(err) {
                                            writeLog({data : err});
                                            res.status(500).send(getErrorMessageFromDatabase());
                                        }
                                  }
                                  else {
                                      res.send(data);
                                  }
                                },(error) => {error.sqlMessage =="Table is not exists." ? res.send([]): res.status(500).send(getErrorMessageFromDatabase(error))})
                              }
                              else {
                                  res.status(401).send(getErrorMessageFromDatabase());
                                }
                            };



                            deletebiomaxuser = function(data,res){
                                        let url = defaultConfiguration.biometricurl + "/DeleteUserinBiometric" ;
                                        let count = data.SerialNumber.length;
                                      data.SerialNumber.map(x => {
                                           let params = {
                                             StaffBiometricCode: data.userid,
                                             SerialNumber : x
                                           };
                                           writeLog({message : url ,data : params});
                                           axios.get(url,{ params: params  }).then(response =>
                                                                   {
                                                                     writeLog({data :response.data});

                                                                         count = count - 1;
                                                                         if(count == 0)
                                                                         {

                                                                           connection.executeQuery("call USPbiomaxdeletefpusersstaff('"+data.userid+"')").then((data) =>
                                                                               {
                                                                               });
                                                                                  if(res){
                                                                                    return res.send(response.data);
                                                                                  }
                                                                            };
                                                                    })
                                           .catch(function (error) {
                                               writeLog({data :error});

                                               count = count - 1;
                                               if(count == 0)
                                               {
                                                 if(res){
                                                  return res.send(error.message);
                                                }
                                               }
                                           })
                                         });

                                      };


                      uploadbiomaxuser = function(data,res){
                                                  let url = defaultConfiguration.biometricurl + "/UploadUsersInBiometric" ;
                                                  let count = data.SerialNumber.length;
                                                  data.SerialNumber.map(x => {
                                                       axios.get(url,{ params: {
                                                         StaffBiometricCode: data.userid,
                                                         StaffName : data.name,
                                                         IsAdmin : false,
                                                         SerialNumber :x
                                                       }
                                                     }).then(response =>
                                                                             {
                                                                                   count = count - 1;
                                                                                   if(count == 0)
                                                                                   {

                                                                                     connection.executeQuery("call USPbiomaxaddfpusersstaff('"+data.userid+"')").then((data) =>
                                                                                         {
                                                                                         })

                                                                                     res.send(response.data);
                                                                                   }
                                                                              })
                                                     .catch(function (error) {
                                                         writeLog({data :error});

                                                         count = count - 1;
                                                         if(count == 0)
                                                         {
                                                           res.send(error.message);
                                                         }
                                                     })
                                                   });
                          };
      exports.deletebiomaxuser = deletebiomaxuser;
      exports.uploadbiomaxuser = uploadbiomaxuser;
