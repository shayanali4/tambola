

var randomize = require('randomatic');
var {defaultConfiguration} = require('../constants/AppConfig');
var moment = require('moment');

/**
* Convert Javascript Date Object To mysql date
*/

exports.convertToMysqlDatefromJSDateObject = function (date) {
     return date != null ? moment(date).format('YYYY-M-D HH:mm:ss') : '';
}

exports.convertToMysqlDatefromJSDate = function (date) {
    return date != null ? moment(new Date(date)).format('YYYY-M-D HH:mm:ss') : '';
}

exports.convertToMysqlTimefromJSDate = function (date) {
    return date != null ? moment(new Date(date)).format('HH:mm:ss') : '';
}


// use for export or download
exports.getFormtedDate = function (date, clientoffsetvalue ,format) {
  let client_timezoneoffsetvalue = clientoffsetvalue ? clientoffsetvalue : 330;
  let formatDate = format ? format :'MMM DD, YYYY';

  let newDate = '';
  if(date)
  {
    date = new Date(date);

   // convert to msec,add local time zone offset, get UTC time in msec
   let  utc = date.getTime() + (date.getTimezoneOffset() * 60000);
   // create new Date object for different city , using supplied offset
   date = new Date(utc + (60000*parseInt(client_timezoneoffsetvalue)));
   newDate = moment(date).format(formatDate);
  }

  return newDate;
}


// common date for all timezone like date of birth
exports.getFormtedUTCDate = function (date ,format)
{
   let newDate = null;
   let formatDate = format ? format : 'YYYY-MM-DD';

    if(date)
    {
      newDate = moment(date).format(formatDate);
    }
    return newDate;
}

exports.getFormtedUTCTime = function (date ,format)
{
   let newDate = null;
   let formatDate = format ? format : 'hh:mm A';

    if(date)
    {
      newDate = moment(date).format(formatDate);
    }
    return newDate;
}

exports.getFormtedDateTime = function (date,clientoffsetvalue,format) {
    let client_timezoneoffsetvalue = clientoffsetvalue ? clientoffsetvalue : 330;

    let formatDate = format ? format :  'MMM DD, YYYY' + ' ' + 'hh:mm A';
    let newDate = '';
    if(date)
    {
      date = new Date(date);

     // convert to msec ,add local time zone offset, get UTC time in msec
     let  utc = date.getTime() + (date.getTimezoneOffset() * 60000);
     // create new Date object for different city , using supplied offset
     date = new Date(utc + (60000*parseInt(client_timezoneoffsetvalue)));
     newDate = moment(date).format(formatDate);

    }
    return newDate;
}

exports.getFormtedFromTime = function (time, format)
{
    let formatDate = format ? format : 'hh:mm A';
    time = time && time.split(':');
    let date = null;
    if(time && time.length > 0 )
    {
      date = new Date( new Date().setHours(time[0] && parseInt(time[0]) ,time[1] && parseInt(time[1]), time[2] && parseInt(time[2])))
    }
    let newDate = date  ? moment(date).format(formatDate) : '';
    return newDate;
}

exports.getLocalDate= function (clientoffsetvalue,date) {
    let client_timezoneoffsetvalue = clientoffsetvalue ? clientoffsetvalue : 330;
    date = date ? date : new Date();
    let newDate = '';
    if(date)
    {
      date = new Date(date);

     // convert to msec , add local time zone offset get UTC time in msec
     let  utc = date.getTime() + (date.getTimezoneOffset() * 60000);
     // create new Date object for different city , using supplied offset
     newDate = new Date(utc + (60000*parseInt(client_timezoneoffsetvalue)));
    }
    return newDate;
}

exports.signupVerificationCode = function (){
     return randomize('0', 6);
}

exports.calculateExpiryDate = function (date,durationcount,duration){
      let monthcount = 0;
      let daycount = 0;
      durationcount = parseInt(durationcount);

      if (duration == "Year" || duration == "Month")
        {
            if(duration == "Year")
              {
                  monthcount = (durationcount * 12);
              }
            else {
                  monthcount = durationcount;
                }
            let newdate=new Date(date);
            return date != null ? (new Date(newdate.setMonth(newdate.getMonth() + monthcount))) : '';
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
              let newdate=new Date(date);
              return date != null ? (new Date(newdate.setDate(newdate.getDate() + daycount))) : '';

        }
}

exports.getClientURL = function (clienttype)
{
   if(clienttype == 1){
     return defaultConfiguration.domainName_enterprise ;
      }
    else if (clienttype == 2) {
      return  defaultConfiguration.domainName_professional ;
      }
    else {
      return defaultConfiguration.domainName_user;
    }
}

exports.checkModuleRights = function (client,user,alias,moduleoperation)
{
  let menus = user.rights;
  let clientid = client.id;
  let userid = user.id;
  let logintype = user.logintype;
  let modulename = alias;
  let ipaddress = user.ip;

    menus = menus ? JSON.parse(menus) : {};

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


exports.googleFitDataSourceName = function (){
     return randomize('A0', 16);
}

exports.checkModuleForChangedData = function (client,user,alias,moduleoperation,data)
{
  let clientid = client.id;
  let userid = user.id;
  let logintype = user.logintype;
  let modulename = alias;
  let ipaddress = user.ip;
  let deviceinfo = user.deviceinfo;

}

exports.unique = function (list)
 {
    var result = [];
    result = list.map(x => x).filter((value,index,self) => self.indexOf(value) === index);
    return result;
}

exports.groupBy = function (array , f )
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

exports.uniqueObjectArray = function (list , field ) {
    var processed = [];
   for (var i=list.length-1; i>=0; i--) {
       if (list[i].hasOwnProperty(field)) {
           if (processed.indexOf(list[i][field])<0) {
               processed.push(list[i][field]);
           } else {
               list.splice(i, 1);
           }
       }
   } return list;
}

exports.convertSecToHour = function (d) {

  d = d ? parseInt(d) : 0;

  let hh,mm,ss = 0;

  if(d > 0)
  {
     hh = Math.floor(d / 3600);
     mm = Math.floor(d % 3600 / 60);
     ss = Math.floor(d % 3600 % 60);


       hh = hh < 10 && hh >= 0 ? "0" + hh.toString(): hh;
       mm = mm < 10  && mm >= 0 ? "0" + mm.toString(): mm;
       ss = ss < 10  && ss >= 0 ? "0" + ss.toString(): ss;


  }

  return {hh : hh || "00",mm : mm || "00", ss : ss|| "00"};
}

  exports.getParams = function (search) {
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



exports.getDateFromCSV = function (date) {

  let newDate = '';
  let error = '';
  var pattern = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;

    if(date)
    {
      date = date.toString();
      var replacedate = date.replace(/"/g, "").replace(/=/g, "");

      if(pattern.test(replacedate))
      {
        var dateParts = replacedate.split("-");
        newDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        return {newDate};
      }
      else {
        error = "Import failed.Please enter valid date format.";
        return {error};
      }
    }
    return {newDate,error};
}

exports.getGameWinners = function (tickets, next_numbers) {

  var calling_number  = '', called_numbers = [] , winners = {};
  while(next_numbers.length > 0 && !(winners["quick_five"] && winners["star"] && winners["top_line"]
&& winners["middle_line"] && winners["bottom_line"] && winners["box_bonus"] && winners["full_sheet_bonus"]
&& winners["first_full_house"] && winners["second_full_house"] && winners["third_full_house"]))
  {
    calling_number = next_numbers.shift();

    if(calling_number && called_numbers.indexOf(calling_number) == -1)
    {
      called_numbers.push(calling_number);
    }

    if(!winners["quick_five"])
    {
    	let quick_five = [];
      tickets.map(x => {
    		let count =	x.ticket.map(y => y.filter(z => called_numbers.indexOf(z) > -1)).map(y => y.length).reduce((a,b) => a + b)
    		 if(count == 5)
    		 {
    			  quick_five.push(x.ticketid);
    				let winning_number = called_numbers[called_numbers.length - 1];
    				winners.quick_five = winning_number;
    			 winners["quick_five" + winning_number] = quick_five;
    		 }
    	});
    }

    if(!winners["star"])
    {
    	let star = [];
      tickets.map(x => {

        let firstRow = x.ticket[0].filter(x => x);
    		let firstRowCount = called_numbers.indexOf(firstRow[0]) > -1
    		 								 && called_numbers.indexOf(firstRow[4]) > -1;

        let middleRow = x.ticket[1].filter(x => x);
        let middleRowCount = called_numbers.indexOf(middleRow[2]) > -1;

        let lastRow = x.ticket[2].filter(x => x);
    		let lastRowCount = called_numbers.indexOf(lastRow[0]) > -1
    										 && called_numbers.indexOf(lastRow[4]) > -1;

    	   if(middleRowCount &&  firstRowCount && lastRowCount)
    		 {
    			  star.push(x.ticketid);
    				let winning_number = called_numbers[called_numbers.length - 1];
    				winners.star = winning_number;
    			 winners["star"+winning_number] = star;
    		 }
    	});
    }



    if(!winners["top_line"])
    {
    	let top_line = [];
      tickets.map(x => {
    		let firstRowCount = x.ticket[0].filter(z => called_numbers.indexOf(z) > -1).length;
    	   if(firstRowCount == 5)
    		 {
    			  top_line.push(x.ticketid);
    				let winning_number = called_numbers[called_numbers.length - 1];
    				winners.top_line = winning_number;
    			 winners["top_line"+winning_number] = top_line;
    		 }
    	});
    }

    if(!winners["middle_line"])
    {
    	let middle_line = [];
      tickets.map(x => {
    		let middleRowCount = x.ticket[1].filter(z => called_numbers.indexOf(z) > -1).length;
    	   if(middleRowCount == 5)
    		 {
    			  middle_line.push(x.ticketid);
    				let winning_number = called_numbers[called_numbers.length - 1];
    				winners.middle_line = winning_number;
    			 winners["middle_line" +winning_number] = middle_line;
    		 }
    	});
    }

    if(!winners["bottom_line"])
    {
    	let bottom_line = [];
      tickets.map(x => {
    		let lastRowCount = x.ticket[2].filter(z => called_numbers.indexOf(z) > -1).length;
    	   if(lastRowCount == 5)
    		 {
    			  bottom_line.push(x.ticketid);
    				let winning_number = called_numbers[called_numbers.length - 1];
    				winners.bottom_line = winning_number;
    			 winners["bottom_line" + winning_number] = bottom_line;
    		 }
    	});
    }

    if(!winners["box_bonus"])
    {
    	let box_bonus = [];
      tickets.map(x => {
    		let firstRowCount = x.ticket[0].filter(z => called_numbers.indexOf(z) > -1).length;
    		let middleRowCount = x.ticket[1].filter(z => called_numbers.indexOf(z) > -1).length;
    		let lastRowCount = x.ticket[2].filter(z => called_numbers.indexOf(z) > -1).length;
    	   if(firstRowCount >= 2 && middleRowCount >= 2 && lastRowCount >= 2)
    		 {
    			  box_bonus.push(x.ticketid);
    				let winning_number = called_numbers[called_numbers.length - 1];
    				winners.box_bonus = winning_number;
    			 winners["box_bonus" + winning_number] = box_bonus;
    		 }
    	});
    }
    if(!winners["first_full_house"])
    {
    	let first_full_house = [];
      tickets.map(x => {
    		let count =	x.ticket.map(y => y.filter(z => called_numbers.indexOf(z) > -1)).map(y => y.length).reduce((a,b) => a + b)
    		 if(count == 15)
    		 {
    			  first_full_house.push(x.ticketid);
    				let winning_number = called_numbers[called_numbers.length - 1];
    				winners.first_full_house = winning_number;
    			 winners["first_full_house" + winning_number] = first_full_house;
    		 }
    	});
    }


    if( winners.first_full_house && !winners["second_full_house"])
    {
    	let second_full_house = [];
      tickets.map(x => {

        if(winners["first_full_house" + winners.first_full_house].indexOf(x.ticketid) == -1)
        {
      		let count =	x.ticket.map(y => y.filter(z => called_numbers.indexOf(z) > -1)).map(y => y.length).reduce((a,b) => a + b)
      		 if(count == 15)
      		 {
      			  second_full_house.push(x.ticketid);
      				let winning_number = called_numbers[called_numbers.length - 1];
      				winners.second_full_house = winning_number;
      			 winners["second_full_house" + winning_number] = second_full_house;
      		 }
         }
    	});
    }


    if(winners.second_full_house && !winners["third_full_house"])
    {
    	let third_full_house = [];
      tickets.map(x => {

        if(winners["first_full_house" + winners.first_full_house].indexOf(x.ticketid) == -1 &&
      winners["second_full_house" + winners.second_full_house].indexOf(x.ticketid) == -1)
        {
    		let count =	x.ticket.map(y => y.filter(z => called_numbers.indexOf(z) > -1)).map(y => y.length).reduce((a,b) => a + b)
    		 if(count == 15)
    		 {
    			  third_full_house.push(x.ticketid);
    				let winning_number = called_numbers[called_numbers.length - 1];
    				winners.third_full_house = winning_number;
      			winners["third_full_house" +winning_number] = third_full_house;
    		 }
       }
    	});
    }


    if(!winners["full_sheet_bonus"])
    {
    	let full_sheet_bonus = [];
    for(var x = 0 ; x < tickets.length ; x = x + 6)
    {

    	if(tickets[x].customer  == tickets[x + 1].customer  && tickets[x + 1].customer == tickets[x + 2].customer &&
    	tickets[x + 2].customer	== tickets[x + 3].customer && tickets[x + 3].customer == tickets[x + 4].customer &&
    	tickets[x + 4].customer == tickets[x + 5].customer && tickets[x + 5].customer == tickets[x].customer)
    	{

    		let count1 =	tickets[x].ticket.map(y => y.filter(z => called_numbers.indexOf(z) > -1)).map(y => y.length).reduce((a,b) => a + b);
    		let count2 =	tickets[x + 1].ticket.map(y => y.filter(z => called_numbers.indexOf(z) > -1)).map(y => y.length).reduce((a,b) => a + b);
    		let count3 =	tickets[x + 2].ticket.map(y => y.filter(z => called_numbers.indexOf(z) > -1)).map(y => y.length).reduce((a,b) => a + b);
    		let count4 =	tickets[x + 3].ticket.map(y => y.filter(z => called_numbers.indexOf(z) > -1)).map(y => y.length).reduce((a,b) => a + b);
    		let count5 =	tickets[x + 4].ticket.map(y => y.filter(z => called_numbers.indexOf(z) > -1)).map(y => y.length).reduce((a,b) => a + b);
    		let count6 =	tickets[x + 5].ticket.map(y => y.filter(z => called_numbers.indexOf(z) > -1)).map(y => y.length).reduce((a,b) => a + b);

    		 if(count1 >= 2 && count2 >= 2 && count3 >= 2 && count4 >= 2 && count5 >= 2 && count6 >= 2)
    		 {

    			 full_sheet_bonus.push(tickets[x].ticketid);
    			 full_sheet_bonus.push(tickets[x + 1].ticketid);
    			 full_sheet_bonus.push(tickets[x + 2].ticketid);
    			 full_sheet_bonus.push(tickets[x + 3].ticketid);
    			 full_sheet_bonus.push(tickets[x + 4].ticketid);
    			 full_sheet_bonus.push(tickets[x + 5].ticketid);

    			 let winning_number = called_numbers[called_numbers.length - 1];
    			 winners.full_sheet_bonus = winning_number;
    			 winners["full_sheet_bonus" + winning_number] = full_sheet_bonus;
    		 }
    	}
    }

    }



  }

  return {winners , called_numbers};
}
