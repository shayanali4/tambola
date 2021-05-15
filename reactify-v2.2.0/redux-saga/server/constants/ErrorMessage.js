
exports.getErrorMessageFromDatabase = function(error)
{
  error = error || {};


  error.errorMessage =  error.errno && error.errno == 9999 ? error.sqlMessage : 'A server error occurred. Please try again or contact the administrator.'

  if(error.sqlMessage && error.sqlMessage.indexOf('Internal') > 0 && error.sqlMessage.indexOf('Server') > 0 && error.sqlMessage.indexOf('Error') > 0)
  {
      error.errorMessage = 'A server error occurred. Please try again or contact the administrator.';
  }

  return error;
}
