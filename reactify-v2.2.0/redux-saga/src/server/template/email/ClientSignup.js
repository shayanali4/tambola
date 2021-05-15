var helpers = require('../../helpers/helpers');

exports.getSignupVerificationTemplate = function(config)
{
  return {
    subject: 'Your Verification Code',
    message: 'Please confirm below code to register!!!  '+ config.verificationcode,
    title : 'Signup Verification'
  }
}

exports.getSignupConfirmationTemplate = function(config)
{
  return {
    subject: 'Successfully Registered',
    message: 'You have successfully registered to FitnessProLeague. We will contact you soon.',
    title : 'Signup Registered'
  }
  // message: 'You have successfully registered to FitnessProLeague. Please click below link to login.' + ' ' +
  // config.url + '.' + helpers.getClientURL(config.clienttype)
}
exports.getMemberSignUpMobileNumberVerificationTemplate = function(config)
{
  return {
    subject: 'Your Verification Code',
    message: config.verificationcode +  ' is the One Time Password For Your Mobile Number Verification!!!  ',
    title : 'Mobile Number Verification For Member Signup'
  }
}
exports.getMemberSignUpEmailVerificationTemplate = function(config)
{
  return {
    subject: 'Your Verification Code',
    message: config.verificationcode +  ' is the One Time Password For Your Email Verification!!!  ',
    title : 'Email Verification For Member Signup'
  }
}
