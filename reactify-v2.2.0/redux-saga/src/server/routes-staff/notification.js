var connection = require('../mysql/dbConnection');
var Helper = require('../helpers/helpers');
var Helpers = require('../helpers/encryption');
var helper = require('../helpers/helpers');
var {encrypt, decrypt} = require('../helpers/encryption');
var {getMemberActivityPoint} = require('../helpers/activitypoint');

var {getErrorMessageFromDatabase} = require('../constants/ErrorMessage');

exports.staffnotificationlist = function(req, res){

        const {client , user} = res.locals.oauth.token;
          const id = req.body.id || null;
          connection.executeQuery("call USPpushnotificationlogget('"+client.id+"',"+user.id+","+1+","+id+")").then((data) =>
              {
                 res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};


exports.staffnotificationcount = function(req, res){

        const {client , user} = res.locals.oauth.token;
          connection.executeQuery("call USPpushnotificationloggetnotificationcount('"+client.id+"',"+user.id+","+1+")").then((data) =>
              {
                 res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};

exports.staffnotificationread = function(req, res){

        const {client , user} = res.locals.oauth.token;
          connection.executeQuery("call USPpushnotificationlogread('"+client.id+"',"+user.id+","+1+")").then((data) =>
              {
                 res.send(data);  },(error) => res.status(500).send(getErrorMessageFromDatabase(error)))
};
