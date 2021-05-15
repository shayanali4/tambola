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
    var rights = helper.checkModuleRights(client,user,"branch","view")

    if(rights)
    {
        connection.executeQuery("call USPbranchsearch('"+ JSON.stringify(req.body) +"')").then((data) =>
        {
              data[0].map((x) => {
                x.gmapaddress = x.gmapaddress ? unescape(x.gmapaddress) : '';
                x.address1 = x.address1 ? unescape(x.address1) : '';
                x.address2 = x.address2 ? unescape(x.address2) : '';
                x.city = x.city ? unescape(x.city) : '';
                x.branchname = x.branchname ? unescape(x.branchname) : '';
                x.description = x.description ? unescape(x.description) : '';
                x.branchid = x.id;
                x.id = encrypt(x.id.toString());

              })
               res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
      }
      else {
        res.status(401).send(getErrorMessageFromDatabase());
      }
};

exports.save = function(req, res){

  const branch = req.body.branch;
  const {client , user} = res.locals.oauth.token;
  user.ip = req.clientIp;
  user.deviceinfo = req.headers.deviceinfo;

  branch.branchname =branch.branchname.trim();
  branch.ownership =  branch.ownership || null;
  branch.manager = branch.manager || null;
  branch.phoneno = branch.phoneno || '';
  branch.gmapaddress = branch.gmapaddress ? escape(branch.gmapaddress) : '';
  branch.description = branch.description ? escape(branch.description) : '';
  branch.address1 = branch.address1 ? escape(branch.address1) : '';
  branch.address2 = branch.address2 ? escape(branch.address2) : '';
  branch.city = branch.city ? escape(branch.city) : '';
  branch.branchname = branch.branchname ? escape(branch.branchname) : '';
  branch.id = branch.id != "0" ?  decrypt(branch.id) : 0;
  branch.slotduration = branch.slotduration || null;
  branch.slotmaxoccupancy = branch.slotmaxoccupancy || 0;

  branch.cancelgymaccessslothour = branch.cancelgymaccessslothour || null;
  branch.cancelptslothour = branch.cancelptslothour || null;
  branch.cancelclassslothour = branch.cancelclassslothour || null;
  branch.ptslotdetail = {};
  branch.ptslotdetail.ptslotdurationId = branch.ptslotduration;
  branch.ptslotdetail.ptslotdurationlabel = branch.ptslotdurationlabel;
  branch.ptslotdetail.ptslotmaxdays = branch.ptslotmaxdays;
  branch.ptslotdetail.ptslotmaxoccupancy = branch.ptslotmaxoccupancy;
  branch.ptslotdetail.restbetweentwoptslotId = branch.restbetweentwoptslot;
  branch.ptslotdetail.restbetweentwoptslotlabel = branch.restbetweentwoptslotlabel;


  let branchschedule = branch.schedule;


  let moduleoperation = branch.id != "0" ? 'update' :'add';
  helper.checkModuleForChangedData(client,user,"branch",moduleoperation,{branch,branchschedule});

      connection.executeQuery("call USPbranchsave('"+branch.id+"','"+branch.branchname+"','"+branch.description+"','"+branch.address1+"','"+branch.address2+"','"+branch.pincode+"','"+
      branch.latitude+"','"+branch.longitude+"','"+branch.carpetarea+"',"+branch.ownership+","+
       branch.manager+",'"+JSON.stringify(branch.schedule)+"','"+user.id+"','"+client.id+"','"+
       branch.phoneno+"','"+branch.city+"','"+branch.state+"','"+branch.country+"','"+branch.gmapaddress+"',"+branch.gymaccessslot+","+
       branch.slotduration+","+branch.slotmaxoccupancy+","+branch.slotmaxdays+",'"+JSON.stringify(branch.ptslotdetail)+"',"+branch.cancelgymaccessslothour+","+
       branch.cancelptslothour+","+branch.cancelclassslothour+","+branch.classmaxdays+","+branch.gapbetweentwogymaccessslot+",'"+JSON.stringify(branch.duration)+"');")
       .then((data) =>   {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))

    };
    exports.view = function(req, res){
                  const {client , user} = res.locals.oauth.token;
                   req.body.id = req.body.id && req.body.id.toString().length > 10 ? decrypt(req.body.id) : req.body.id ;
                  connection.executeQuery("call USPbranchview("+req.body.id+",'"+client.id+"')").then((data) =>
 {
              if(data[0] && data[0][0])
               {
                       data[0][0].address1 = data[0][0].address1 ? unescape(data[0][0].address1) : '';
                       data[0][0].gmapaddress = data[0][0].gmapaddress ? unescape(data[0][0].gmapaddress) : '';
                       data[0][0].description = data[0][0].description ? unescape(data[0][0].description) : '';
                       data[0][0].address2 = data[0][0].address2 ? unescape(data[0][0].address2) : '';
                       data[0][0].city = data[0][0].city ? unescape(data[0][0].city) : '';
                       data[0][0].branchname = data[0][0].branchname ? unescape(data[0][0].branchname) : '';
                       data[0][0].id = encrypt(data[0][0].id.toString());
               }

               res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
  };

        exports.delete = function(req, res){

                  const {client , user} = res.locals.oauth.token;
                  user.ip = req.clientIp;
                  user.deviceinfo = req.headers.deviceinfo;
                  req.body.id = req.body.id && req.body.id.toString().length > 10 ? decrypt(req.body.id) : req.body.id ;

                  helper.checkModuleForChangedData(client,user,"branch","delete",req.body);

                    connection.executeQuery("call USPbranchdelete("+req.body.id+", "+ client.id +" , "+ user.id +")").then((data) =>
                        {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
                };
