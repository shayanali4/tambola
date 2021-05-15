var connection = require('../mysql/dbConnection');

var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var helper = require('../helpers/helpers');
var {getPathToUpload} = require('../helpers/file');

exports.save = function(req, res){

  const {client , user} = res.locals.oauth.token;
  let feedback = JSON.parse(req.body.feedback);
  let memberId = null;
  let rating = feedback.rating;
  let pathForDB = [];

  if(req.files != null )
  {
        let file = req.files;
           file = file.files;

        let imageList = [];
          if(!file.length)
          {
            imageList.push(file)
          }
          else {
            imageList = file;
          }

        imageList && imageList.map((imagefile) =>
        {

             if(imagefile.mimetype == "image/jpeg" ||imagefile.mimetype == "image/png"||imagefile.mimetype == "image/gif" )
             {
               let pathObj = getPathToUpload(client, imagefile.name, 'FeedbackAttachment');
                    imagefile.mv(pathObj.pathForSave, function(err)
                    {
                      if (err)
                      {
                        err.errorMessage = "Internal server error";
                        return res.status(500).send(err);
                      }
                    });
                    pathForDB.push(pathObj.pathForDB);

                  if(imageList.length == pathForDB.length)
                  {
                      connection.executeQuery("call USPfeedbacksave('"+feedback.idea+"','"+escape(feedback.description)+"','"+
                      user.id+"','"+client.id+"','u','"+feedback.feedbackfor+"','"+feedback.average+"','"+rating.equipment+"','"+rating.facilities+"','"+
                      rating.trainer+"','"+rating.vibe+"','"+rating.valueformoney+"',"+memberId+",'"+feedback.feedbackStatus+"',"+user.id+",'"+
                      JSON.stringify(pathForDB)+"',"+JSON.parse(req.body.branchid)+");")
                      .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                  }
                }
               else {
                 err.errorMessage = "File type not supported.";
                 return res.status(500).send(err);
               }
         });
       }
       else {

       connection.executeQuery("call USPfeedbacksave('"+feedback.idea+"','"+escape(feedback.description)+"','"+
       user.id+"','"+client.id+"','u','"+feedback.feedbackfor+"','"+feedback.average+"','"+rating.equipment+"','"+rating.facilities+"','"+
       rating.trainer+"','"+rating.vibe+"','"+rating.valueformoney+"',"+memberId+",'"+feedback.feedbackStatus+"',"+user.id+","+null+","+JSON.parse(req.body.branchid)+");")
       .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

       }
 };

exports.list = function(req, res){

        const {client , user} = res.locals.oauth.token;
        req.body.clientId = req.body.clientid || client.id;
        req.body.loginType = 'u';
        req.body.userId = user.id;
        req.body.isfpl = client.id == 1 ? 1 : 0;

            connection.executeQuery("call USPfeedbacklist('"+JSON.stringify(req.body)+"')").then((data) =>
              {
                data[0].map((x) => {
                    x.description = x.description ? unescape(x.description) : '';
                })
                 res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

      };

  exports.commetssave = function(req, res){

        const {client , user} = res.locals.oauth.token;
        let {commentdata} = req.body;
        commentdata.date = helper.convertToMysqlDatefromJSDate(commentdata.date);
        let memberId = null;

            connection.executeQuery("call USPfeedbackcommentssave("+commentdata.feedbackid+",'"+escape(commentdata.comment)+"','"+commentdata.date+"',"+user.id+","+memberId+");")
             .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

          };


          exports.commetsview = function(req, res){

                const {client , user} = res.locals.oauth.token;

                req.body.clientId = req.body.clientid || client.id;
                    connection.executeQuery("call USPfeedbackview("+req.body.id+",'"+req.body.clientId+"');")
                     .then((data) =>   {
                       data[0].map((x) => {
                           x.description = x.description ? unescape(x.description) : '';
                       })
                       res.send(data);
                     },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

                  };
        exports.savefeedbackstatus = function(req, res){

            const {client , user} = res.locals.oauth.token;
            let data = req.body;

            user.ip = req.clientIp;
            user.deviceinfo = req.headers.deviceinfo;

            helper.checkModuleForChangedData(client,user,"feedback",'update',data);


              connection.executeQuery("call USPfeedbackstatussave('"+data.id+"','"+data.status+"');")
              .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

          };
