var { writeLog } = require('../helpers/log');
var connection = require('../mysql/dbConnection');
var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var axios = require ('axios');

exports.sendSMS = (params) => {
  var gateway = getSMSsenderdetail(params.clientid).then(x => {
     if(x && x.status == 1){
      var options = {
                mobile : params.mobile,
                message : params.message,
            };
        var smscareerurl = params.isPromotional ? x.promotionalurl :  x.transactionalurl ;

                    if(smscareerurl)
                    {
                      smscareerurl =  smscareerurl.replace("@mobile",options.mobile);
                      smscareerurl =  smscareerurl.replace("@message",options.message);

                    writeLog({data : smscareerurl});
                  smscareerurl = encodeURI(smscareerurl);

                  params.userid = params.userid  ? "'" + JSON.stringify(params.userid) + "'" : null;
                  params.memberid = params.memberid  ? "'" + JSON.stringify(params.memberid) + "'" : null;
                  params.enquiryid = params.enquiryid  ? "'" + JSON.stringify(params.enquiryid) + "'" : null;
                  //params.to = params.to || null;
                  params.subject = params.subject ? "'" + escape(params.subject) + "'" : null;
                  params.fromuserid = params.fromuserid || null;
                  params.broadcastid = params.broadcastid || null;
                  let headers  = {};
                  headers = x.headers ? JSON.parse(unescape(x.headers)) : {};

                  axios.get(smscareerurl,{headers: headers}).then(response =>
                      { writeLog({data :response ? response.data : {}});
                       let responsemessage = response ? response.data : '';
                       if(responsemessage != ''){
                        responsemessage = typeof(responsemessage) == "string" ?  responsemessage : JSON.stringify(responsemessage);
                        responsemessage =  escape(responsemessage);
                        }
                      connection.executeQuery("call USPnotificationlogsave('"+params.clientid+"',"+params.userid+","+params
                      .memberid+","+params.enquiryid+",'"+params.mobile+"',null,"+params.subject+",'"+ escape( params.message)+"',null,'2',"+
                      params.fromuserid+",null,'"+responsemessage+"','"+escape(params.title)+"',"+params.broadcastid+",null);")
                       .then(data => {}).catch(function(err) {

                              writeLog({data : err});
                        })

                     }).catch(error =>
                      {
                        writeLog({data : error});

                        let responsemessage = error ? error.data : '';
                         responsemessage = typeof(responsemessage) == "string" ?  responsemessage : JSON.stringify(responsemessage);


                        connection.executeQuery("call USPnotificationlogsave('"+params.clientid+"',"+params.userid+","+params
                        .memberid+","+params.enquiryid+",'"+params.mobile+"',null,"+params.subject+",'"+ escape(params.message)+"','"+error.data+"','2',"+params.fromuserid+",null,'"+
                        escape(responsemessage)+"','"+escape(params.title)+"',"+params.broadcastid+",null);")
                         .then(data => {}).catch(function(err) {

                                writeLog({data : err});
                          })
                      })

            }
}
  });
};



    getSMSsenderdetail = function (clientid){
        return new Promise(function(resolve, reject) {

          connection.executeQuery("call USPtemplatenotificationgateway('"+clientid+"')").then((data) =>
          {
            var result = data[0].length > 0 ? data[0] : '';
            if(result)
            {
              result = result[0].smsgateway ? JSON.parse(result[0].smsgateway) : null;
              if(result){
                result.transactionalurl = unescape(result.transactionalurl);
                result.promotionalurl = unescape(result.promotionalurl);
              }

            }
            resolve(result);
          }).catch(function(err) {

                  writeLog({data : err});
                  reject(err);
            })
        });
    }
