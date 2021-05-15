var connection = require('../mysql/dbConnection');
var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');
var {encrypt,decrypt} = require('../helpers/encryption');

exports.getCountry = function(req, res){

    connection.executeQuery("call USPsuggestioncountry('"+req.body.value+"')").then((data) =>
        {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};
exports.getState = function(req, res){


    connection.executeQuery("call USPsuggestionstate('"+req.body.value+"')").then((data) =>
        {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.getMemberAll = function(req, res){

  const {client , user} = res.locals.oauth.token;

  let requestData = {};
  requestData.clientId = client.id;
  requestData.value = req.body.value;
  requestData.branchid = req.body.branchid;

    connection.executeQuery("call USPsuggestionallmember('"+ JSON.stringify(requestData) +"')").then((data) =>
        {
             data[0].map((x) => {
               x.id = encrypt(x.id.toString());
             })
            res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};


exports.getMember = function(req, res){

  const {client , user} = res.locals.oauth.token;

  let requestData = {};
  requestData.clientId = client.id;
  requestData.value = req.body.value;
  requestData.branchid = req.body.branchid;

    connection.executeQuery("call USPsuggestionmember('"+ JSON.stringify(requestData) +"')").then((data) =>
        {
             data[0].map((x) => {
               x.id = encrypt(x.id.toString());
             })
            res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.getEnquiry = function(req, res){

  const {client , user} = res.locals.oauth.token;

  let requestData = {};
  requestData.clientId = client.id;
  requestData.value = req.body.value;
  requestData.branchid = req.body.branchid;

    connection.executeQuery("call USPsuggestionenquiry('"+ JSON.stringify(requestData) +"')").then((data) =>
        {  res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};
exports.getEquipment = function(req, res){

  const {client , user} = res.locals.oauth.token;

  let requestData = {};
  requestData.clientId = client.id;
  requestData.value = escape(req.body.value);

    connection.executeQuery("call USPsuggestionequipment('"+ JSON.stringify(requestData) +"')").then((data) =>
        {
          if(data && data[0])
          {
          data[0].map((x) => {
              x.label=  unescape( x.label);
          })
         }
          res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.getEquipmentBrand = function(req, res){

  const {client , user} = res.locals.oauth.token;

  let requestData = {};
  requestData.value = req.body.value;
  requestData.clientId = client.id;

    connection.executeQuery("call USPsuggestionequipmentbrand('"+ JSON.stringify(requestData) +"')").then((data) =>
        {
            res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.getMemberCode = function(req, res){

  const {client , user} = res.locals.oauth.token;

  let requestData = {};
  requestData.clientId = client.id;
  requestData.value = req.body.value;
  requestData.branchid = req.body.branchid;

    connection.executeQuery("call USPsuggestionmembercode('"+ JSON.stringify(requestData) +"')").then((data) =>
        {
            res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};


exports.getMemberVisitorBook = function(req, res){

  const {client , user} = res.locals.oauth.token;

  let requestData = {};
  requestData.clientId = client.id;
  requestData.value = req.body.value;
  requestData.branchid = req.body.branchid;

    connection.executeQuery("call USPsuggestionmembervisitorbook('"+ JSON.stringify(requestData) +"')").then((data) =>
        {
          if(data && data[0])
          {
            data[0].map((x) => {
                x.id = encrypt(x.id.toString());
                x.label=  unescape( x.label);
                if(x.dateofbirth)
                {
                  x.age = new Date().getFullYear() - (x.dateofbirth).getFullYear();
                }
            })
          }
            res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};
