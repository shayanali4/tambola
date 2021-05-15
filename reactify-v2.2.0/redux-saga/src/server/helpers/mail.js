'use strict';
const nodemailer = require('nodemailer');
var { writeLog } = require('../helpers/log');
var connection = require('../mysql/dbConnection');
var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var axios = require ('axios');
var {encrypt, decrypt} = require('../helpers/encryption');

      exports.sendMail = (params) => {
          var gateway = getEmailsenderdetail(params.clientid).then(x => {
             if(x && x.status == 1 && (params.to || params.bcc)){
             this.from = x.from ?  x.from :  x.emailid ;

            var options = {
                      from : this.from,
                      to : params.to,
                      subject : params.subject,
                      text : params.message,
                      attachments: params.attachment,
                      bcc : params.bcc
                  };
                  // {   // use URL as an attachment
                  //     filename: 'license.txt',
                  //     path: 'https://raw.github.com/andris9/Nodemailer/master/LICENSE'
                  // }

                  let transporter = nodemailer.createTransport({
                      // port: 587,
                      // secure: false, // true for 465, false for other ports
                      host: x.host, // hostname
                      secureConnection: x.secureconnection, // use SSL
                      port: x.port, // port for secure SMTP
                       auth: {
                              user: x.emailid,
                              pass: x.password
                          }
                  });

            transporter.sendMail(options, (error, info) => {
                writeLog({data :options});
                if (error) {
                   writeLog({data :error});
                }
                let pathForDB = null;

                params.userid = params.userid  ? "'" + JSON.stringify(params.userid) + "'" : null;
                params.memberid = params.memberid ? "'" + JSON.stringify(params.memberid) + "'" : null;
                params.enquiryid = params.enquiryid ? "'" + JSON.stringify(params.enquiryid) + "'" : null;
                params.mobile = params.mobile || null;

                params.fromuserid = params.fromuserid || null;
                params.broadcastid = params.broadcastid || null;
                let errormessage = error ? error.message : '';
                error = error ? JSON.stringify(escape(error)) : null;
                if(params.attachment) {
                          pathForDB =  params.attachment.map(x => x.pathForDB);
                          pathForDB = JSON.stringify(pathForDB);
                          }

                pathForDB = pathForDB ? "'" + pathForDB + "'" : pathForDB;
                params.bcc = params.bcc  ? "'" + JSON.stringify(params.bcc) + "'" : null;
                let to = params.to ? "'" + params.to + "'" : null;


                connection.executeQuery("call USPnotificationlogsave('"+params.clientid+"',"+params.userid+","+params
                .memberid+","+params.enquiryid+","+params.mobile+","+to+",'"+ escape(params.subject) +"','"+
                escape( params.message)+"',"+error+",'1',"+params.fromuserid+","+ pathForDB +",'"+escape(errormessage)+"','"+
                params.title+"',"+params.broadcastid+","+params.bcc+");")
                 .then(data => {}).catch(function(err) {

                        writeLog({data : err});
                  })

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        }
        });
    };

    function  getEmailsenderdetail  (clientid) {
            return new Promise(function(resolve, reject) {

              connection.executeQuery("call USPtemplatenotificationgateway('"+clientid+"')").then((data) =>
              {
                if(data[0] && data[0][0] && data[0][0].emailgateway)
                 {
                      data[0][0].emailgateway = JSON.parse(data[0][0].emailgateway);
                      data[0][0].emailgateway.password = decrypt(data[0][0].emailgateway.password);
                 }
                var result = data[0].length > 0 ? data[0] : '';
                if(result)
                {
                    result = result[0].emailgateway;
                }
                resolve(result);
              }).catch(function(err) {

                      writeLog({data : err});
                      reject(err);
                })
            });
        }
