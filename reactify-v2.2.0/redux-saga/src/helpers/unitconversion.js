import CustomConfig from 'Constants/custom-config';


/**
 * Function to convert hex to rgba
 */
export function convertToSec({hh,mm,ss}) {

  hh = hh ? parseInt(hh) * 60 * 60 : 0;

  mm = mm ? parseInt(mm) * 60 : 0;

  ss = hh  + mm + (ss ? parseInt(ss) : 0);

  return ss;
}

export function convertSecToHour(d) {

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
export function convertkgTolbs(kg) {

      let lbs = "";

      kg = kg ? parseFloat(kg) : 0;

      if(kg > 0)
      {
        lbs = kg * 2.2046226218;
      }

  return lbs;
}
export function convertlbsTokg(lbs) {

        let kg = "";

        lbs = lbs ? parseFloat(lbs) : 0;

        if(lbs > 0)
        {
          kg = lbs * 0.45359237;
        }
    return kg;
}
export function convertkmTomiles(km) {

      let miles = "";
      km = km ? parseFloat(km) : 0;

      if(km > 0)
      {
        miles = km * 0.6213711922;
      }
      return miles;
}
export function convertmilesTokm(miles) {

    let km = "";
    miles = miles ? parseFloat(miles) : 0;

    if(miles > 0)
    {
      km = miles * 1.609344;
    }

    return km;
}
export function convertmphTokph(mph) {
    let kph = "";
    mph = mph ? parseFloat(mph) : 0;

    if(mph > 0)
    {
      kph = mph * 1.609344;
    }
    return kph;
}
export function convertkphTomph(kph) {
      let mph = "";
      kph = kph ? parseFloat(kph) : 0;

      if(kph > 0)
      {
        mph = kph * 0.6213711922;
      }
      return mph;
}
export function convertcmToinch(cm) {

      let inch = "";

      cm = cm ? parseFloat(cm) : 0;

      if(cm > 0)
      {
        inch = cm * 0.393701;
      }

  return inch;
}
export function convertinchTocm(inch) {

      let cm = "";

      inch = inch ? parseFloat(inch) : 0;

      if(inch > 0)
      {
        cm = inch * 2.54;
      }

  return cm;
}

export function convertcelciusTofahrenheit(celcius) {

      let fahrenheit = "";

      celcius = celcius ? parseFloat(celcius) : 0;

      if(celcius > 0)
      {
        fahrenheit = celcius * 1.8 + 32;
      }

  return fahrenheit;
}

export function convertfahrenheitTocelcius(fahrenheit) {

        let celcius = "";

        fahrenheit = fahrenheit ? parseFloat(fahrenheit) : 0;

        if(fahrenheit > 0)
        {
          celcius = (fahrenheit - 32) / 1.8;
        }
    return celcius;
}
export function convertMinToHourMin(m) {
  let hh,mm,ss = 0;

  if(m > 0)
  {
     hh = Math.floor(m /60);
     mm = m % 60;


       hh = hh < 10 && hh >= 0 ? "0" + hh.toString(): hh;
       mm = mm < 10  && mm >= 0 ? "0" + mm.toString(): mm;


  }

  return {hh : hh || "00",mm : mm || "00"};
}


export function convertinPercentage(value,number,isbreacket) {

        let percentage = 0;

        if(value == 0){

          if(number > 0)
          {
            percentage = 100;
          }
          if(isbreacket)
          {
            return " (" +percentage + " %)";

          }
          else {
                  return percentage + " %";
          }
        }

        value = value || 1;

        if(value && number){
          percentage =  ((number/value) * 100);
          percentage = percentage.toFixed(2);
        }
        if(isbreacket)
        {
          return " (" +percentage + " %)";

        }
        else {
                return percentage + " %";
        }
}
