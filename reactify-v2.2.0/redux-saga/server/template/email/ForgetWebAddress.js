var helpers = require('../../helpers/helpers');

exports.getForgetWebAddressEmailTemplate = function(config)
{
  return {
    subject: 'Forget WebAddress',
    message: 'Please click below link to login.' + ' ' +  config.url + '.' + helpers.getClientURL(config.clienttype),
    title : 'Forget WebAddress'
  }
}

exports.getForgetPasswordEmailTemplate = function(config)
{
  return {
    subject: 'Forget Password',
    message: 'Please enter below password to login.' + ' ' + config.password,
    title : 'Forget Password'
  }
}
