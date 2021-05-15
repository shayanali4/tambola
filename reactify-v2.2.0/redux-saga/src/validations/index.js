import isEmail from 'validator/lib/isEmail';
import equals from 'validator/lib/equals';
import isLength from 'validator/lib/isLength';
import isPostalCode from 'validator/lib/isPostalCode';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isDecimal from 'validator/lib/isDecimal';
import isCurrency from 'validator/lib/isCurrency';

export const required = (value) => {

  if(value==null)
  {
    return 'Required.';
  }
  else if (!value.toString().trim().length) {
      // We can return string or jsx as the 'error' prop for the validated Component
      return 'Required.';
  }
  return '';
};


export const email = (value) => {

  value = value || '';

  if (!isEmail(value)) {
    return `${value} is not a valid email.`
  }
  return '';
};

export const compare = (value1,value2) => {
  if (!equals(value1,value2)) {
    return `Password and confirm password should match.`
  }
  return '';
};

export const checkLength = (value,{min:value2,max:value3}) => {

  if (!isLength(value,{min:value2,max:value3})) {

            if(value2 == value3)
                  return `Should have length ${value2}.`
            else
                  return `Should have length between ${value2} to ${value3}.`
  }
  return '';
};


export const checkMobileNo = (value, countryCode,countryName,languagecode) => {

   value = value  || "";

  let clientprofile = localStorage.getItem('client_profile');
  clientprofile =  JSON.parse(clientprofile) || null;
  let clientcountrycode = clientprofile && clientprofile.countrycode ? clientprofile.countrycode : '';

  countryCode = countryCode != null && countryCode != ''  ? countryCode :
   (clientcountrycode ? clientcountrycode : 'IN');

   let countrylabel = countryName ? countryName : 'your country';
   languagecode = languagecode ? languagecode : 'en';

   value = value.replace(/[^0-9]/g, '');
   try {
     if (value && clientcountrycode =='IN' ?  !isMobilePhone(value,languagecode + '-' + countryCode) : !isMobilePhone(value) ) {
       return `Please enter valid mobile number for ${countrylabel} .`
     }
   } catch (e) {

   }
   return '';

};

export const checkPincode = (value, countryCode,countryName) => {
  let clientprofile = localStorage.getItem('client_profile');
  clientprofile =  JSON.parse(clientprofile) || null;
  let clientcountrycode = clientprofile && clientprofile.countrycode ? clientprofile.countrycode : '';

  countryCode = countryCode != null && countryCode != ''  ? countryCode :
   (clientcountrycode ? clientcountrycode : 'IN');

  let countrylabel = countryName ? countryName : 'your country';
  try {
    if(value && (countryCode != 'AE' && countryCode != 'PH' && countryCode != 'RS'))
    {
      if (value && !isPostalCode(value,countryCode)) {
          return `Please enter valid Zip/Postal code for ${countrylabel}.`;
      }
    }
  } catch (e) {

  }
  return '';

};


export const checkURL = (value) => {
  if (new RegExp(/[!#@$%^&*)(+= ]/).test(value)) {

      return `Not allowed.`
  }
    return '';
};


export const restrictNumeric = (value) => {
      return value.replace(/[0-9]/g, '')
};

export const allowNumeric = (value) => {
      return value.replace(/[^0-9]/g, '');
};

export const allowAlphaNumeric = (value) => {
      return value.replace(/[^0-9 ^a-z ^A-Z ^&()-]/g, '')
};

export const allowAlphaNumericWithoutSpace = (value) => {
      return value.replace(/[^0-9a-zA-Z]/g, '')
};

export const restrictLength = (value,maxlength) => {
  if(value)
  {
      return value.toString().substring(0, maxlength)
  }
  else {
    return "";
  }
};


export const ValidateIPaddress = (ipaddress) =>
{
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
  {
    return '';
  }

  return 'Please enter valid ip-address.';
}


export const convertToInt = (value) => {

 value = Math.abs(parseInt(value));
  return value >= 0 ?  value : '';
};

export const checkDecimal = (value) => {

  value = value ? value.toString() : '';

  if(value && value.replace(/[^.]/g, '').length > 1)
  {
    return `Not Valid.`;
  }

  if (value && !isCurrency(value,{allow_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, allow_decimal: true, require_decimal: false, digits_after_decimal: [1,2], allow_space_after_digits: false})) {
    return `Not Valid.`;
  }

  return '';
};

/*
//!(new RegExp(/\d/).test(value) || new RegExp(/[!#@$%^&*)(+=]/).test(value) )  && (new RegExp(/\D/).test(value))
//\d to check for digits 1 to 9 , \D for non-digit
// the above expression validates digits and special characters , allowing only alphabets and space
// it is in two parts, first part check for digits or special characters and other for non-digits.
// if the first part is false then it returns error

// .replace(/[^0-9 ^a-z ^A-Z ^&()'-]/g, '') to allow only alphanumeric with &()'- special characters
*/
