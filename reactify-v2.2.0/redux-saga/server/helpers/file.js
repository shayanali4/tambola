const fs = require('fs-extra');

var {defaultConfiguration} = require('../constants/AppConfig');


var getFileExtension = function(filename)
{
    var pattern = /(?:\.([^.]+))?$/;
    return  pattern.exec(filename)[1];
}

var removeFileExtension = function(filename)
{
    return  filename.split('.').slice(0, -1).join('.');
}

/*
  Get Path to update client object , dubDirectory, filename

  return object with two value 1. pathForSave use to save file 2. pathForDB  to in Database
*/

var getPathToUpload = function (client, fileName , subDirectory){

  var data = {};
  var clientDirectory = client.id + '_' + client.clientCode;
  var d  = new Date();

  var replacedfileName = removeFileExtension(fileName);
  replacedfileName = replacedfileName.replace(/[^0-9a-zA-Z]/g, '');

  var fileNewName = replacedfileName + parseInt(d.getTime()/1000).toString() + '.' +  getFileExtension(fileName);

  data.pathForSave =  defaultConfiguration.basePathForUploadStaticFile;
  data.pathForDB = clientDirectory + (subDirectory ? '/' + subDirectory : '' ) + "/" + d.getFullYear().toString();
  data.pathForSave += data.pathForDB;

  fs.ensureDirSync(data.pathForSave);

  data.pathForSave += '/' + fileNewName;
  data.pathForDB += '/' + fileNewName;
  return data;
}

module.exports = { getPathToUpload };
