import React from 'react';
var FileSaver = require('file-saver');
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
/**
 * Helpers Functions
 */
import moment from 'moment';
import CustomConfig from 'Constants/custom-config';

import cloneDeep from 'lodash/cloneDeep';
import {ValidateIPaddress}  from 'Validations';
import {convertkgTolbs} from 'Helpers/unitconversion';


export {cloneDeep};
/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    throw new Error('Bad Hex');
}

/**
 * Text Truncate
 */
export function textTruncate(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
}




 export function setDateTime(date)
 {

   let client_timezoneoffsetvalue = localStorage.getItem('client_timezoneoffsetvalue') || 330;

     let newDate = null;
     if(date)
     {
       date = new Date(date);

      // convert to msec   , add local time zone offset , get UTC time in msec
      let  utc = date.getTime() - (60000*parseInt(client_timezoneoffsetvalue));
      // create new Date object for different city , using supplied offset
      newDate = new Date(utc - (date.getTimezoneOffset() * 60000));
     }
     return newDate;
 }


 export function setLocalDate(date,format)
 {
    let newDate = '';
    let formatDate = format ? format : 'YYYY-MM-DD';

     if(date)
     {
       newDate = moment(date).format(formatDate);
     }
     return newDate;
 }

 export function setLocalTime(date,format)
 {
    let newDate = '';
    let formatDate = format ? format : 'hh:mm A';

     if(date)
     {
       newDate = moment(date).format(formatDate);
     }
     return newDate;
 }

 export function setLocalDateTime(date,format)
 {
    let newDate = '';
    let formatDate = format ? format : CustomConfig.dateFormat + ' ' + CustomConfig.timeFormat;

     if(date)
     {
       newDate = moment(date).format(formatDate);
     }
     return newDate;
 }


export function getLocalDate(date)
{

   let client_timezoneoffsetvalue = localStorage.getItem('client_timezoneoffsetvalue') || 330;

   let onlyDate = typeof(date) == "string" && date.indexOf("T18:30:00.000Z") > 0 ? true : false;

    let newDate = null;
    if(date)
    {
      date = new Date(date);

     // convert to msec , add local time zone offset get UTC time in msec
     let  utc = date.getTime() + (date.getTimezoneOffset() * 60000);
     // create new Date object for different city , using supplied offset
     newDate = new Date(utc + ( 60000* (onlyDate ? 330 :  parseInt(client_timezoneoffsetvalue))  ));
    }
    return newDate;
}

export function getFormtedDate(date, format)
{

   let client_timezoneoffsetvalue = localStorage.getItem('client_timezoneoffsetvalue') || 330;

  let onlyDate = typeof(date) == "string" && date.indexOf("T18:30:00.000Z") > 0 ? true : false;

  let formatDate = format ? format : CustomConfig.dateFormat;
  let newDate = '';
  if(date)
  {
    date = new Date(date);

   // convert to msec , add local time zone offset,  get UTC time in msec
   let  utc = date.getTime() + ( date.getTimezoneOffset() * 60000);
   // create new Date object for different city , using supplied offset

   date = new Date(utc + ( 60000* (onlyDate ? 330 :  parseInt(client_timezoneoffsetvalue))  ));
   newDate = moment(date).format(formatDate);
  }
  return newDate;
}

export function getFormtedDateTime(date, format)
{

   let client_timezoneoffsetvalue = localStorage.getItem('client_timezoneoffsetvalue') || 330;

  let formatDate = format ? format : CustomConfig.dateFormat + ' ' + CustomConfig.timeFormat;
  let newDate = '';
  if(date)
  {
    date = new Date(date);

   // convert to msec, add local time zone offset, get UTC time in msec
   let  utc = date.getTime() + (date.getTimezoneOffset() * 60000);
   // create new Date object for different city, using supplied offset

   date = new Date(utc + (60000*parseInt(client_timezoneoffsetvalue)));
   newDate = moment(date).format(formatDate);
  }
  return newDate;
}

export function getFormtedTime(date, format)
{

   let client_timezoneoffsetvalue = localStorage.getItem('client_timezoneoffsetvalue') || 330;

  let formatDate = format ? format : CustomConfig.timeFormat;
  let newDate = '';
  if(date)
  {
    date = new Date(date);

   // convert to msec, add local time zone offset, get UTC time in msec
   let  utc = date.getTime() + (date.getTimezoneOffset() * 60000);
   // create new Date object for different city, using supplied offset

   date = new Date(utc + (60000*parseInt(client_timezoneoffsetvalue)));
   newDate = moment(date).format(formatDate);
  }
  return newDate;
}


export function getFormtedFromTime(time, format)
{
      let client_timezoneoffsetvalue = localStorage.getItem('client_timezoneoffsetvalue') || 330;

    let formatDate = format ? format : CustomConfig.timeFormat;
    let date  = getLocalTime(time);
    let newDate = null;

    if(date)
    {
      date = new Date(date);

     // convert to msec , add local time zone offset , get UTC time in msec
     let  utc = date.getTime() + (-330 * 60000);
     // create new Date object for different city , using supplied offset
     date = new Date(utc + (60000*parseInt(client_timezoneoffsetvalue)));

     newDate = moment(date).format(formatDate);
    }

    return newDate;
}

export function getLocalTime(time)
{
  time = time && time.split(':');
  let newDate = null;
  if(time && time.length > 0 )
  {
    newDate = new Date((new Date()).setHours(time[0] && parseInt(time[0]) ,time[1] && parseInt(time[1]), time[2] && parseInt(time[2])))
  }
  return  newDate;
}


export function getFormtedTimeFromJsonDate(date, format)
{

   let client_timezoneoffsetvalue = localStorage.getItem('client_timezoneoffsetvalue') || 330;


  let formatDate = format ? format : CustomConfig.timeFormat;
  let newDate = '';
  if(date)
  {
    date = new Date(date);

   // convert to msec , add local time zone offset , get UTC time in msec
   let  utc = date.getTime() + (date.getTimezoneOffset() * 60000);
   // create new Date object for different city , using supplied offset
   date = new Date(utc + (60000*parseInt(client_timezoneoffsetvalue)));
   newDate = moment(date).format(formatDate);
  }
  return newDate;
}



export function getMontEndDays(date)
{
  date = new Date(date || new Date());

  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {firstDay, lastDay}
}

export function getYearEndDays(date)
{
  date = new Date(date || new Date());

  var firstDay = new Date(date.getFullYear(), 0, 1);
  var lastDay = new Date(date.getFullYear(), 12, 0);

  return {firstDay, lastDay}
}




//Form error object will return form valid or not;
export function checkError(errors)
{
  let validated = true;
  for(let val in errors) {
      if(errors[val] != '')
      {
        validated = false;
      }
   }
 return validated;
}

export function calculateExpiryDate(date,durationcount,duration){

      let monthcount = 0;
      let daycount = 0;
      durationcount = durationcount ? parseInt(durationcount) : 0;

      if (duration == "Year" || duration == "Month")
        {
            if(duration == "Year")
              {
                  monthcount = (durationcount * 12);
              }
            else {
                  monthcount = durationcount;
                }

            if(date)
            {
              let newdate=new Date(date);
               newdate = new Date(newdate.setMonth(newdate.getMonth() + monthcount));
              return new Date(newdate.setDate(newdate.getDate() - 1));
            }
            else {
              return null;
            }
        }
      else
        {
              if(duration == "Week")
                {
                    daycount = (durationcount * 7);
                }
              else {
                    daycount = durationcount;
                  }

              if(date)
              {
                let newdate=new Date(date);
                return new Date(newdate.setDate(newdate.getDate() + (daycount - 1)));
              }
              else {
                return null;
              }
        }
}

export function getWeekDays(date,fromGivenDate)
{
    let weekdays = [];
    date = date ? date : new Date();
    date = new Date(date.setHours(0, 0, 0, 0));;

    if(fromGivenDate)
    {
      let startday = cloneDeep(date);
      weekdays.push({weekday : startday.getDay() ,date : startday });
    }
    else {
      var startday =  date.getDate() - date.getDay();
      startday = new Date(date.setDate(startday));
      weekdays.push({weekday : startday.getDay() ,date : startday});
    }

    for(let i = 1; i < 7; i++)
    {
        let currentDay = new Date(date.setDate(date.getDate() + 1));
        weekdays.push({weekday : currentDay.getDay() ,date : currentDay });
    }
    return weekdays;
}

/*
 * @param {int} The month number, 0 based
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
export function getDaysInMonth(month, year) {

    month = parseInt(month) - 1;
    year  = parseInt(year);

     var date = new Date(year, month, 1);
     var days = [];
     while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
     }
     return days;
}

export function getClientURL(clienttype)
{

   if(clienttype == 1){
     return CustomConfig.domainName_enterprise ;
      }
    else if (clienttype == 2) {
      return  CustomConfig.domainName_professional ;
      }
    else {
      return CustomConfig.domainName_user;
    }
}

export function getClientId()
{
  let clientid = location.hostname.replace('www.','');
  clientid = clientid.split('.');
  if(clientid.length >= 4 && !ValidateIPaddress(clientid.slice(0,4).join('.')))
  {
    return '';
  }

  return clientid.length > 2 ? (clientid[0] != 'signup' ?  clientid[0] : "tambola") : "tambola";
}

export const delay = (ms) => new Promise(res => setTimeout(res,ms))


export function downloadFile(blob, filename, type) {
  FileSaver.saveAs(blob, filename);
}

export function downloadFileByUrl(url, filename) {
  FileSaver.saveAs(url, filename);
}

export function checkModuleRights(menus,alias,moduleoperation)
{

    menus = menus || [];

    let response = false;


    let  module  = menus.filter(y => y.alias == alias && y[moduleoperation] == true)[0];
    if(module && !module.child_routes)
    {
      response = true;
    }

    if(!response)
    {
        menus.map(x => {
                if(x.child_routes){
                         let  ch_module  = x.child_routes.filter(cy => cy.alias == alias && cy[moduleoperation] == true)[0];
                         if (ch_module) {
                           response = true;
                         }
                 }
        }) ;
    }



    return response;
}

export function calculateBMI(height,weight){

  //height in cm ;
  //weight in kg;

  height = height ? parseInt(height) : 0;
  weight = weight ? parseInt(weight) : 0;

  let bmi = 0;

   if(height > 0 && weight > 0 )
   {
     bmi =  weight/((height/100)*(height/100));
   }
   return bmi.toFixed(2);
}


export function dataURItoBlob(dataURI, callback) {
// convert base64 to raw binary data held in a string
// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
var byteString = atob(dataURI.split(',')[1]);

// separate out the mime component
var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

// write the bytes of the string to an ArrayBuffer
var ab = new ArrayBuffer(byteString.length);
var ia = new Uint8Array(ab);
for (var i = 0; i < byteString.length; i++) {
ia[i] = byteString.charCodeAt(i);
}

// write the ArrayBuffer to a blob, and you're done
var bb = new Blob([ab], {type: mimeString});
return bb;
}

export function  base64ToFile(dataURI, tempfilename) {

    var sliceSize = 1024;
    var byteCharacters = atob(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]


    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    var file = new File(byteArrays, tempfilename, { type: mimeString});

    file.preview = window.URL.createObjectURL(file)
    return file;
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}


export function getParams(search)
{
  var a = search.split("&");
  var o = a.reduce(function(o, v) {
    var kv = v.split("=");
    kv[0] = kv[0].replace("?", "");
    o[kv[0]] = kv[1];
    return o;
    },
  {});

return o;
}

export function unique(list) {
    var result = [];

    result = list.map(x => x).filter((value,index,self) => self.indexOf(value) === index);

    return result;
}

export function calculateCaloriesBurned({age,weight,time,genderid,heartratePer}){
//totaltime in min
//weight in lbs
  let caloriesburned = 0;
  age = age ? age : 25;
  weight = weight || 70;
  weight = convertkgTolbs(weight);
  time = time/60;
  heartratePer == heartratePer || 50;
  let heartrate = calculateMaximumHeartRate(age,heartratePer);
  if(genderid == 2)
  {
    caloriesburned = [(age * 0.074) - (weight * 0.05741) + (heartrate * 0.4472) - 20.4022] * time / 4.184;
  }
  else {
    caloriesburned = [(age * 0.2017) - (weight * 0.09036) + (heartrate * 0.6309) - 55.0969] * time / 4.184;
  }

   return caloriesburned;
}

export function calculatetotalwater({weight,height,age,workouttime}){
  age = age;
  if(age < 30){
    age = 40;
  }
  else if(age >= 30 && age <= 55 ){
    age = 35;
  }
  else {
    age = 30;
  }
  let totalwater = (weight * age /28.3) + (workouttime/30 * 12);
  totalwater = totalwater * 29.57;
  totalwater = Math.round(totalwater)
   return totalwater;
}

export function calculateMaximumHeartRate(age,heartratePer) {
    var mhr = 0;

    mhr = heartratePer/100 * (230 - age)

    return mhr;
}


export function calculateSpeed(distance,time){

  //diatnce in km/miles ;
  //time in s;

// speed in   kph or mph
  if(distance && time)
  {
      return (distance/(time/3600)).toFixed(2);
  }
  else {
    return  "";
  }
}

export function getRandomInclusive(min, max) {
  //min = Math.ceil(min);
  //max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

export function getTaxValuesFromCategory(price, taxcategory , taxcodecategorylist, clientprofile )
{
  let priceDetailData = {};

  if(price && taxcategory && taxcodecategorylist){
     let percentage = taxcodecategorylist.filter(x => x.id == taxcategory ).map(y => y.percentage)[0];
       let {basePrice ,tax , totalPrice } =  getTaxValues(clientprofile && clientprofile.taxtypeId ? clientprofile.taxtypeId : 1 , percentage , price )

       priceDetailData.percentage = percentage;
       priceDetailData.taxamount = tax.toString();
       priceDetailData.basePrice = basePrice.toString();
       priceDetailData.totalPrice = totalPrice.toString();
   }
   return priceDetailData;
}

export function getTaxValues(taxType, taxPer , configuredPrice )
{
	let basePrice ,tax, totalPrice;

  if(taxType == 1)
	{
			basePrice =  configuredPrice ? parseFloat(parseFloat(configuredPrice).toFixed(2)) : "";
			tax = basePrice && taxPer ? (basePrice * taxPer /100) : "";

			totalPrice = basePrice && tax ? parseFloat((basePrice + tax).toFixed(2)) : (basePrice ||"");
      tax = tax ? parseFloat(tax.toFixed(2)) : "";
	}
	else {
		tax = configuredPrice && taxPer ?  (((configuredPrice * 100) / (100 +  taxPer)) * taxPer / 100) : "";
		tax = tax ? parseFloat(tax.toFixed(2)) : "";

		totalPrice = configuredPrice ? parseFloat(parseFloat(configuredPrice).toFixed(2)) : "";
		basePrice = totalPrice && tax ? parseFloat((totalPrice - tax).toFixed(2)) : (totalPrice || "");
	}

	return {basePrice ,tax , totalPrice };
}

export function getDiscount(discountType, value, discountOn , qty)
{
	let discount,discountedprice;
	value = value || 0;
	discountOn = discountOn || 0;
	discountOn = discountOn * qty;

	if(discountType == 2 && discountOn > 0 && value > 0)
	{
		discount =  parseFloat((discountOn * value / 100).toFixed(2));
		discountedprice = parseFloat((discountOn - discount).toFixed(2));
	}
	else {
		discount = parseFloat(parseFloat(value).toFixed(2));;
		discountedprice = 	parseFloat((discountOn - value).toFixed(2));
	}
	return {discount ,discountedprice};
}


export function groupBy( array , f )
{
 var groups = {};
 array.forEach( function( o )
 {
    var group = JSON.stringify( f(o) );
   groups[group] = groups[group] || [];
   groups[group].push( o );
 });
 return Object.keys(groups).map( function( group )
 {
   return groups[group];
 })
}


export function makePlaceholderRTFilter()
{
  return ({filter, onChange}) =>
  (
<Input   type= "search" name = {filter ? filter.value : ''} placeholder = '&#xF002;' value = {filter ? filter.value : ''}
    onChange = {(event) =>  {let value = event.target.value;
    value = value.replace("  "," ").replace("'","").replace('"',"").replace("\\","");
    value = value == " " ? "" : value;
    if(value.length > 20)
    {
      value = value.substring(0,20);
    }

    if(event.target.name != value)
    {
          onChange(value);
    }
} }
                       endAdornment={<InputAdornment required  = {false} position="end">
                        {filter && filter.value ? <IconButton className = "p-0" onClick = {() => onChange("") }>
                           <CloseIcon />
                       </IconButton>  : <div></div>}
                       </InputAdornment>
                      }
                    />
)
}

export function makePlaceholderRTFilterNumber()
{
  return ({filter, onChange}) =>
  (
<Input   type= "number" name = {filter ? filter.value : ''} placeholder = '&#xF002;' value = {filter ? filter.value : ''}
    onChange = {(event) =>  {let value = event.target.value;
    value = value.replace("  "," ").replace("'","").replace('"',"").replace("\\","");
    value = value == " " ? "" : value;
    if(value.length > 20)
    {
      value = value.substring(0,20);
    }

    if(event.target.name != value)
    {
          onChange(value);
    }
} }
                       endAdornment={<InputAdornment required  = {false} position="end">
                        {filter && filter.value ? <IconButton className = "p-0" onClick = {() => onChange("") }>
                           <CloseIcon />
                       </IconButton>  : <div></div>}
                       </InputAdornment>
                      }
                    />
)
}

export function makePlaceholderRTFilterNumberG()
{
  return ({filter, onChange}) =>
  (
<Input   type= "number" name = {filter ? filter.value : ''} placeholder = '&#xF002;>=' value = {filter ? filter.value : ''}
    onChange = {(event) =>  {let value = event.target.value;
    value = value.replace("  "," ").replace("'","").replace('"',"").replace("\\","");
    value = value == " " ? "" : value;
    if(value.length > 20)
    {
      value = value.substring(0,20);
    }

    if(event.target.name != value)
    {
          onChange(value);
    }
} }
                       endAdornment={<InputAdornment required  = {false} position="end">
                        {filter && filter.value ? <IconButton className = "p-0" onClick = {() => onChange("") }>
                           <CloseIcon />
                       </IconButton>  : <div></div>}
                       </InputAdornment>
                      }
                    />
)
}

export function makePlaceholderRTFilterNumberL()
{
  return ({filter, onChange}) =>
  (
<Input   type= "number" name = {filter ? filter.value : ''} placeholder = '&#xF002;<=' value = {filter ? filter.value : ''}
    onChange = {(event) =>  {let value = event.target.value;
    value = value.replace("  "," ").replace("'","").replace('"',"").replace("\\","");
    value = value == " " ? "" : value;
    if(value.length > 20)
    {
      value = value.substring(0,20);
    }

    if(event.target.name != value)
    {
          onChange(value);
    }
} }
                       endAdornment={<InputAdornment required  = {false} position="end">
                        {filter && filter.value ? <IconButton className = "p-0" onClick = {() => onChange("") }>
                           <CloseIcon />
                       </IconButton>  : <div></div>}
                       </InputAdornment>
                      }
                    />
)
}



export function readableBytes(bytes) {
    var i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
}

export function getCurrency()
{
  return localStorage.getItem('client_currency');
}


export function getStatusColor(statusId)
{
    if(statusId == 1)
    {
      return "#39c694";
    }
    else if(statusId == 2)
    {
      return "#ee316b";
    }
    else if(statusId == 3)
    {
      return "#2e8de1";
    }
    else if(statusId == 4)
    {
      return "#00D0BD";
    }
    else if(statusId == 5)
    {
      return "#f9c929";
    }
    return "";
}

export function getDateDifference(startdate,expirydate)
{
  if(startdate && expirydate)
  {
    let calculatedDays = Math.ceil((getLocalDate(expirydate).setHours(0,0,0,0) - getLocalDate(startdate).setHours(0,0,0,0))/(1000*3600*24)) + 1;
    return calculatedDays;
  }
  else {
    return 0;
  }

}

export function checkOverlapDate(itemlist)
{
  let ascending = true;
  itemlist.map((x, key)  =>
    {       if(key > 0)
            ascending = ascending && (itemlist[key - 1].expiryDate < itemlist[key].startDate)
    }
  );
  return ascending;
}



// export function timeSlots(starttime, endtime,duration,interval){
//
//   var timeStops = [];
//   let day = new Date(new Date().setHours(0,0,0,0));
//
//   let start = new Date(starttime);
//   start = new Date(day.setHours(start.getHours(), start.getMinutes()));
//   let end = new Date(endtime);
//   end =  new Date(day.setHours(end.getHours(), end.getMinutes()));
//
//     if(!start  || !end || !duration)
//     {
//           return timeStops;
//     }
//
//   var startTime = moment(start, 'HH:mm');
//   var endTime = moment(end, 'HH:mm');
//
//   if( endTime.isBefore(startTime) ){
//     endTime.add(1, 'day');
//   }
//
//   while(startTime < endTime){
//       //timeStops.push({"starttime" : new moment(startTime).format('HH:mm:ss'),"endtime" : new moment((startTime.add(duration, 'minutes'))).format('HH:mm:ss')});
//
//       timeStops.push({"starttime" : startTime,"endtime" : new Date(starttime.setMinutes( starttime.getMinutes() + duration ))});
//
//         if(interval > 0){
//          startTime = new moment(startTime.add(interval, 'minutes'));
//         }
//     }
//
//   return timeStops;
// }


export function timeSlots(slotdate,starttime, endtime,duration,interval){

  var timeStops = [];

  let day = new Date(slotdate.setHours(0, 0, 0, 0));

    let start = new Date(starttime);
    start = new Date(day.setHours(start.getHours(), start.getMinutes()));
    let end = new Date(endtime);
    end =  new Date(day.setHours(end.getHours(), end.getMinutes()));

    if(!start  || !end || !duration)
    {
          return timeStops;
    }

  var startTime = cloneDeep(start);

  while(startTime < end){
      //timeStops.push({"starttime" : new moment(startTime).format('HH:mm:ss'),"endtime" : new moment((startTime.add(duration, 'minutes'))).format('HH:mm:ss')});
      var currentStartTime = cloneDeep(startTime);
      var currentEndTime = cloneDeep(startTime);

      timeStops.push({"starttime" : currentStartTime,"endtime" : new Date(currentEndTime.setMinutes(currentEndTime.getMinutes() + parseInt(duration) ))});

        if(parseInt(interval) > 0){
         startTime =  new Date(currentEndTime.setMinutes( currentEndTime.getMinutes() + parseInt(interval) ));
        }
        else {
         startTime =  currentEndTime;
        }
    }

  return timeStops;
}


export function getDatesBetweenTwoDates(startDate, stopDate) {
    let dateArray = [];

    while (startDate < stopDate) {
        dateArray.push( {weekday : startDate.getDay(), date : cloneDeep(startDate)});
        startDate = new Date(startDate.setDate(startDate.getDate() + 1));
    }
    return dateArray;
}

export function getDateDifferenceInHour(enddate, startdate)
 {
   if(enddate && startdate)
   {
     var diff =(new Date(enddate).getTime() - new Date(startdate).getTime()) / (1000 * 60 * 60);
     return Math.abs(Math.floor(diff));
   }
 }


 export function getCovidRiskStatusColor(covidrisk)
 {
     if(covidrisk == 2  || covidrisk == 3)
     {
           return " text-danger";
     }
     else if(covidrisk == 4)
     {
           return " text-success";
     }
     else if(covidrisk == 1)
     {
           return " text-warning";
     }
     return "";
 }


 export function compareDates(firstDate,secondDate)
 {
     if(firstDate.getDate() == secondDate.getDate() && firstDate.getMonth() == secondDate.getMonth() && firstDate.getFullYear() == secondDate.getFullYear())
     {
       return true;
     }
     else {
       return false;
     }
 }


 export function compareTime(firstTime,secondTime)
 {
   //validate secondTime is greater than firstTime
    if(new Date(firstTime).getHours() > new Date(secondTime).getHours())
    {
      return true;
    }
    else if (new Date(firstTime).getHours() == new Date(secondTime).getHours() && new Date(firstTime).getMinutes() > new Date(secondTime).getMinutes()) {
      return true;
    }
    else {
      return false;
    }
 }


 export function calculateMealNutrients(recipenutrition , recipeunit , recipequantity)
{
	let calories,protein,fat,carbs,fiber,water;
	let totalcalories,totalprotein,totalfat,totalcarbs,totalfiber,totalwater;
	let unit = recipeunit || '';
	let quantity = recipequantity || 0;
	let unitid = recipeunit || '';

	if(!unit)
	{
	  unitid = recipenutrition && recipenutrition.filter(x => x.checked).map(x => x.value)[0];
	  if(unitid == "1"){
		unit = "1";
		quantity = "1";
	  }
	  else if(unitid == "2"){
		unit = "2";
		quantity = "100";
	  }
	  else{
		unit = "3";
		quantity = "100";
	  }
	 }

	  if(recipenutrition)
	  {
		  let recipefilterbyunit = recipenutrition.filter(x =>x.value == unit);
		  if(recipefilterbyunit && recipefilterbyunit.length > 0)
		  {
			  calories = recipefilterbyunit.map(x =>x.calories)[0];
			  protein = recipefilterbyunit.map(x =>x.protein)[0];
			  fat = recipefilterbyunit.map(x =>x.fats)[0];
			  carbs = recipefilterbyunit.map(x =>x.carbs)[0];
			  fiber = recipefilterbyunit.map(x =>x.fiber)[0];
			  water = recipefilterbyunit.map(x =>x.water)[0];

			  let divideunit = 1;
			  if(unitid != "1")
			  {
				  divideunit = 100;
			  }

			  if(quantity > 0){
				totalcalories = quantity * calories / divideunit;
				totalprotein = protein ? quantity * protein / divideunit : 0;
				totalfat = fat ? quantity * fat / divideunit : 0;
				totalcarbs = carbs ? quantity * carbs / divideunit : 0;
				totalfiber = fiber ? quantity * fiber / divideunit : 0;
				totalwater = water ? quantity * water / divideunit : 0;
			  }
		  }
	  }

	return {totalcalories,totalprotein,totalfat,totalcarbs,totalfiber,totalwater,unit,quantity,calories};
}
