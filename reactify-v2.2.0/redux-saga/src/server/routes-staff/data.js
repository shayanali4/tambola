var connection = require('../mysql/dbConnection');
var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var helper = require('../helpers/helpers');
var {encrypt, decrypt,encryptmobile} = require('../helpers/encryption');


exports.getEmployee = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;

    req.body.zoneid = user.zoneid;
    connection.executeQuery("call USPlistuser('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      data[0].map((x) => {
        x.specialization = x.specialization ? JSON.parse(x.specialization) : [] ;
        x.trainerid = encrypt(x.id.toString());
        if(x.dateofbirth)
        {
          x.age = new Date().getFullYear() - (x.dateofbirth).getFullYear();
        }
      })
      res.send(data);  });
};
exports.getZone = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    connection.executeQuery("call USPlistzone('"+ JSON.stringify(req.body) +"')").then((data) =>
    {  res.send(data);  });
};
exports.getSchedule = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    req.body.branchid = req.body.branchid || 0;
    req.body.logintype = user.logintype;

    connection.executeQuery("call USPSchedulesearch('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      data[0].map((x) => {
        x.id = encrypt(x.id.toString());
        x.classimage =  x.classimage ? JSON.parse(x.classimage) : [];
        x.trainer = encrypt(x.trainer.toString());
       })
       res.send(data);  });

};
exports.getExercise = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    req.body.userId = 0;
    req.body.memberId = 0;
    if(user.logintype == 0){
      req.body.userId = user.id
    }
    else{
      req.body.memberId = user.id
    }
    connection.executeQuery("call USPlistexercise('"+ JSON.stringify(req.body) +"')").then((data) =>
    {  res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};
exports.getRoutine = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    connection.executeQuery("call USPlistroutine('"+ JSON.stringify(req.body) +"')").then((data) =>
      {
        data[0].map((x) => {
          x.label = unescape(x.label);
        })
       res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};
exports.getClass = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    req.body.userId = user.id;

    connection.executeQuery("call USPclasslist('"+ JSON.stringify(req.body) +"')").then((data) =>
    {  res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};
exports.getTagnames = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    connection.executeQuery("call USPlisttagname()").then((data) =>
    {  res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};
exports.getRoles = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
connection.executeQuery("call USProlelist('"+ JSON.stringify(req.body) +"')").then((data) =>
{  res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};
exports.getRecipe = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
	req.body.Iscustomrecipe = req.body.Iscustomrecipe || 0;

    connection.executeQuery("call USPlistrecipe('"+ JSON.stringify(req.body) +"')").then((data) =>
    {  res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};
exports.getDietRoutine = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    connection.executeQuery("call USPlistdietroutine('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      // data[0].map((x) => {
      //   x.routinedays = x.routinedays.replace(new RegExp('"', 'g'), '');
      //   x.routinedays = unescape(x.routinedays);
      //     })

       res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};

exports.getBranch = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;

    if(user.logintype == 0){
      req.body.memberId = 0;
    }
    else{
      req.body.memberId = user.id
    }
    connection.executeQuery("call USPlistbranch('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      data[0].map((x) => {
        x.label = unescape(x.label);
      })
      res.send(data);  });
};


exports.getBasicQuestion = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    connection.executeQuery("call USPlistbasicquestion('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      // data[0].map((x) => {
      //   x.routinedays = x.routinedays.replace(new RegExp('"', 'g'), '');
      //   x.routinedays = unescape(x.routinedays);
      //     })

       res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};

exports.getGymRules = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    connection.executeQuery("call USPlistgymrules('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      data[0].map((x) => {
        x.rulename = unescape(x.rulename);
      })

       res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};
exports.gettax = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    connection.executeQuery("call USPlisttax('"+ JSON.stringify(req.body) +"')").then((data) =>
    {  res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};
exports.gettaxcodecategory = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    connection.executeQuery("call USPlisttaxcodecategory('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
        data[0].map((x) => {
          x.taxgroupitem = JSON.parse(x.taxgroupitem);
          x.percentage =  x.taxgroupitem.filter(z => z.checked).map(y => y.percentage).reduce((a, b) => parseFloat(a) + parseFloat(b));
          x.label = x.label + ' (' +x.percentage + '% Tax)';
        })
      res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};
exports.getBiometric = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;

    connection.executeQuery("call USPlistbiometric('"+ JSON.stringify(req.body) +"')").then((data) =>
    {  res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};

exports.getTimeZone = function(req, res){
    connection.executeQuery("call USPlisttimezone()").then((data) =>
    {  res.send(data);  });
};

exports.getbudget = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;

    connection.executeQuery("call USPlistbudget('"+ JSON.stringify(req.body) +"')").then((data) =>
    {  res.send(data);  });
};
exports.getclient = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;

    connection.executeQuery("call USPlistclient('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      data[0].map((x) => {
        x.label = unescape(x.label);
      });
       res.send(data);  });
};

exports.getserviceparallelplan = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    req.body.id = req.body.id && req.body.id != "0" ?  decrypt(req.body.id) : 0;
    req.body.servicetype = req.body.servicetype || '1';
    let activity = req.body.activity;
    req.body.activity = activity != undefined ? activity : null;
    connection.executeQuery("call USPlistserviceparallelplan('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
        data[0].map((x) => {
          x.label = unescape(x.label);
        })
      res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};
exports.getSessiontype = function(req, res){
    const {client , user} = res.locals.oauth.token;

    connection.executeQuery("call USPlistsessiontype()").then((data) =>
    {
       res.send(data);  });
};

exports.getShift = function(req, res){
    const {client , user} = res.locals.oauth.token;
    req.body.clientId = client.id;
    connection.executeQuery("call USPlistshift('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      data[0].map((x) => {
        x.label = x.label ? unescape(x.label) : '';
          })
      res.send(data);  });
};
exports.getFreeService = function(req, res){
    connection.executeQuery("call USPlistfreeserviceformembersignup('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
        data[0].map((x) => {
          x.label = unescape(x.label);
        })
      res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};
exports.getHolidayList = function(req, res){
  const {client , user} = res.locals.oauth.token;
  req.body.clientId = client.id;
    connection.executeQuery("call USPlistholiday('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      res.send(data);  } ,(error) => res.status(500).send(getErrorMessageFromDatabase(error)));
};




exports.getLoginBranch = function(req, res){

    req.body.clientId = req.body.id;
    connection.executeQuery("call USPlistbranch('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      data[0].map((x) => {
        x.label = unescape(x.label);
      })
      res.send(data);  });
};


exports.getStoreCategory = function(req, res){
  const {client , user} = res.locals.oauth.token;
  req.body.clientId = client.id;


    connection.executeQuery("call USPliststorecategory('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      data[0].map((x) => {
        x.label = unescape(x.label);
      })
      res.send(data);  });
};



exports.getDealType = function(req, res){
  const {client , user} = res.locals.oauth.token;
  req.body.clientId = client.id;


    connection.executeQuery("call USPlistdealtype('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      data[0].map((x) => {
        x.label = unescape(x.label);
      })
      res.send(data);  });
};


exports.getStore = function(req, res){
  const {client , user} = res.locals.oauth.token;
  req.body.clientId = client.id;


    connection.executeQuery("call USPliststore('"+ JSON.stringify(req.body) +"')").then((data) =>
    {
      data[0].map((x) => {
        x.label = unescape(x.label);
      })
      res.send(data);  });
};
