
/**
 * Profile Page
 */
import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';
import Col from 'reactstrap/lib/Col';
import {cloneDeep ,checkError,getLocalTime,timeSlots,getWeekDays,getFormtedTimeFromJsonDate,checkModuleRights,
getLocalDate,compareTime} from 'Helpers/helpers';
import TextField  from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { connect } from 'react-redux';
import { saveClientProfile,onCancelAdvanceBookingofMember } from 'Actions';
import { withRouter } from 'react-router-dom';
// intlmessages
import AutoSuggest from 'Routes/advance-ui-components/autoComplete/component/AutoSuggest';
import FormHelperText from '@material-ui/core/FormHelperText';
import api from 'Api';
import {required,email,checkLength,checkMobileNo,checkPincode,checkAlpha ,restrictLength} from 'Validations';
import { push } from 'connected-react-router';

import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { NotificationManager } from 'react-notifications';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green, red } from '@material-ui/core/colors';
import compose from 'recompose/compose';
import TimePicker from 'Routes/advance-ui-components/dateTime-picker/components/TimePicker';
import ReactTable from "react-table";
import Weekdays from 'Assets/data/weekdays';
import {isMobile} from 'react-device-detect';
import Switch from '@material-ui/core/Switch';
import SlotDuration from 'Assets/data/slotduration';
import FormGroup from 'reactstrap/lib/FormGroup';
import classnames from 'classnames';
import { RctCard } from 'Components/RctCard';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Label from 'reactstrap/lib/Label';
import moment from 'moment';
import RestDuration from 'Assets/data/restduration';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});


class Profile extends Component {

   constructor(props) {
      super(props);
    this.state = this.getInitialState();
 }
    getInitialState()
     {
     this.initialState = {
                      confirmationDialog : false,
                      changeScheduleconfirmationDialog : false,
                      weekdays : [],
                       profile: {
                          fields:{
                                  id : 0,
                                 organizationname:'',
                                 useremail : '',
                                 mobile: '',
                                 address1:'',
                                 address2:'',
                                 city : '',
                                 state:'',
                                 country : '',
                                 pincode : '',
                                 description:'',
                                 gmapaddress : '',
                                 countryArray : [],
                                 stateArray : [],
                                 isaddressSame : 0,
                                 getcurrentlocation : 0,
                                 latitude : '',
                                 longitude : '',
                                 schedule : Weekdays,
                                 duration : [
                                   {
                                     starttime:null,
                                     endtime:null,
                                   }
                                 ],
                                 gymaccessslot : 0,
                                 slotduration : 1,
                                 slotmaxoccupancy : '',
                                 slotmaxdays : 7,
                                 ptslotduration : 1,
                                 ptslotmaxdays : 7,
                                 ptslotmaxoccupancy : 1,
                                 cancelgymaccessslothour : '',
                                 cancelptslothour : '',
                                 cancelclassslothour : '',
                                 classmaxdays : 7,
                                 restbetweentwoptslot : '1',
                                 gapbetweentwogymaccessslot : '1',

                           },
                           errors : { },
                            validated : false,
                        },
                 }
                return cloneDeep(this.initialState);
     }

    componentWillReceiveProps(newProps)
    {
      const	{clientProfileDetail} = newProps;
      if(clientProfileDetail != this.props.clientProfileDetail)
      {
        let {profile} = this.state;
        profile = profile.fields;

        profile.id = clientProfileDetail.id;
        profile.organizationname = clientProfileDetail.organizationname;
        profile.useremail = clientProfileDetail.useremail;
        profile.mobile =  clientProfileDetail.mobile;
        profile.address1 =  clientProfileDetail.address1;
        profile.address2 = clientProfileDetail.address2;
        profile.city = clientProfileDetail.city;
        profile.state = clientProfileDetail.state;
        if(clientProfileDetail.country)
        {
          profile.country = {};
          profile.country.id = clientProfileDetail.countrycode;
          profile.country.label = clientProfileDetail.country;
          profile.country.languagecode = clientProfileDetail.languagecode;
        }else {
          profile.country = {};
        }
        profile.pincode = clientProfileDetail.pincode;
        profile.description = clientProfileDetail.description ? clientProfileDetail.description : '';
        profile.gmapaddress = clientProfileDetail.gmapaddress ? clientProfileDetail.gmapaddress : '';
        profile.latitude = clientProfileDetail.latitude ? clientProfileDetail.latitude : '';
        profile.longitude = clientProfileDetail.longitude ? clientProfileDetail.longitude : '';
        profile.duration = clientProfileDetail.shifttiming || profile.duration;
        //profile.schedule = clientProfileDetail.schedule || Weekdays;
        profile.schedule = clientProfileDetail.schedule && clientProfileDetail.schedule.filter(x => x && x.starttime).length > 0 ? clientProfileDetail.schedule : Weekdays;
        profile.duration.map(x => {
          x.starttime = getLocalDate(x.starttime);
          x.endtime = getLocalDate(x.endtime);
         });
        profile.schedule.map(x => {
          x.starttime = getLocalDate(x.starttime);
          x.endtime = getLocalDate(x.endtime);
          x.starttime1 = getLocalDate(x.starttime1);
          x.endtime1 = getLocalDate(x.endtime1);
          if(x.checked && x.duration && x.duration.length > 0)
          {
            x.duration.map(y => {
              y.starttime = getLocalDate(y.starttime);
              y.endtime = getLocalDate(y.endtime);
            })
          }
         });

        profile.gymaccessslot = clientProfileDetail.gymaccessslot || 0;
        profile.slotduration = clientProfileDetail.slotdurationId || 1 ;
        profile.slotmaxoccupancy = clientProfileDetail.slotmaxoccupancy ? clientProfileDetail.slotmaxoccupancy : '';
        profile.slotmaxdays = clientProfileDetail.slotmaxdays ;
        if(clientProfileDetail.ptslotdetail){
            profile.ptslotduration = clientProfileDetail.ptslotdetail.ptslotdurationId || 1 ;
            profile.ptslotmaxdays = clientProfileDetail.ptslotdetail.ptslotmaxdays ;
            profile.ptslotmaxoccupancy = clientProfileDetail.ptslotdetail.ptslotmaxoccupancy || 1;
            profile.restbetweentwoptslot = clientProfileDetail.ptslotdetail.restbetweentwoptslotId || '1' ;
       }
       profile.cancelgymaccessslothour = clientProfileDetail.cancelgymaccessslothour || '';
       profile.cancelptslothour = clientProfileDetail.cancelptslothour || '';
       profile.cancelclassslothour = clientProfileDetail.cancelclassslothour || '';
       profile.classmaxdays = clientProfileDetail.classmaxdays || '' ;
       profile.gapbetweentwogymaccessslot = clientProfileDetail.gapbetweentwogymaccessslotId || '1' ;

        this.state.profile_old = cloneDeep(profile);
      }
    }

    componentWillMount() {
      const {viewRights} =  this.props;
      if(viewRights){
        const	{clientProfileDetail} = this.props;
          if(clientProfileDetail)
          {
            let {profile} = this.state;
            profile = profile.fields;

            profile.id = clientProfileDetail.id;
            profile.organizationname = clientProfileDetail.organizationname;
            profile.useremail = clientProfileDetail.useremail;
            profile.mobile =  clientProfileDetail.mobile;
            profile.address1 =  clientProfileDetail.address1;
            profile.address2 = clientProfileDetail.address2;
            profile.city = clientProfileDetail.city;
            profile.state = clientProfileDetail.state;
            if(clientProfileDetail.country)
            {
              profile.country = {};
              profile.country.id = clientProfileDetail.countrycode;
              profile.country.label = clientProfileDetail.country;
              profile.country.languagecode = clientProfileDetail.languagecode;
            }else {
              profile.country = {};
            }
            profile.pincode = clientProfileDetail.pincode;
            profile.description = clientProfileDetail.description ? clientProfileDetail.description : '';
            profile.gmapaddress = clientProfileDetail.gmapaddress ? clientProfileDetail.gmapaddress : '';
            profile.latitude = clientProfileDetail.latitude ? clientProfileDetail.latitude : '';
            profile.longitude = clientProfileDetail.longitude ? clientProfileDetail.longitude : '';
            profile.duration = clientProfileDetail.shifttiming || profile.duration;
            //profile.schedule = clientProfileDetail.schedule || Weekdays;
            profile.schedule = clientProfileDetail.schedule && clientProfileDetail.schedule.filter(x => x && x.starttime).length > 0 ? clientProfileDetail.schedule : Weekdays;
            profile.duration.map(x => {
              x.starttime = getLocalDate(x.starttime);
              x.endtime = getLocalDate(x.endtime);
             });
            profile.schedule.map(x => {
              x.starttime = getLocalDate(x.starttime);
              x.endtime = getLocalDate(x.endtime);
              x.starttime1 = getLocalDate(x.starttime1);
              x.endtime1 = getLocalDate(x.endtime1);
              if(x.checked && x.duration && x.duration.length > 0)
              {
                x.duration.map(y => {
                  y.starttime = getLocalDate(y.starttime);
                  y.endtime = getLocalDate(y.endtime);
                })
              }
             });
            profile.gymaccessslot = clientProfileDetail.gymaccessslot || 0;
            profile.slotduration = clientProfileDetail.slotdurationId || 1 ;
            profile.slotmaxoccupancy = clientProfileDetail.slotmaxoccupancy ? clientProfileDetail.slotmaxoccupancy : '';
            profile.slotmaxdays = clientProfileDetail.slotmaxdays ;
            if(clientProfileDetail.ptslotdetail){
                profile.ptslotduration = clientProfileDetail.ptslotdetail.ptslotdurationId || 1 ;
                profile.ptslotmaxdays = clientProfileDetail.ptslotdetail.ptslotmaxdays ;
                profile.ptslotmaxoccupancy = clientProfileDetail.ptslotdetail.ptslotmaxoccupancy || 1 ;
                profile.restbetweentwoptslot = clientProfileDetail.ptslotdetail.restbetweentwoptslotId || '1' ;
           }
           profile.cancelgymaccessslothour = clientProfileDetail.cancelgymaccessslothour || ''; ;
           profile.cancelptslothour = clientProfileDetail.cancelptslothour || '';
           profile.cancelclassslothour = clientProfileDetail.cancelclassslothour || '';
           profile.classmaxdays = clientProfileDetail.classmaxdays || '' ;
           profile.gapbetweentwogymaccessslot = clientProfileDetail.gapbetweentwogymaccessslotId || '1' ;

            this.state.profile_old = cloneDeep(profile);
          }

      }
      else{
        this.props.push('/app/dashboard/master-dashboard');

      }
    }

    handleChangeSchedule = (id, key, value , isRequired,index) => {
      this.onChange('schedule', {id , key , value} , isRequired,index);
    }

    onChange(key,value,isRequired,index)
  {
    const {clientProfileDetail} = this.props;
    let error= isRequired ? required(value) : '';
    let {schedule,duration} = this.state.profile.fields;
    //let country = this.state.profile.fields.countryArray.filter(x => x.label == this.state.profile.fields.country)[0];
  //  let country = this.state.profile.fields.country;
    const timing = this.state.profile.fields;
    let {fields} = this.state.profile;
    if (key == "isaddressSame")
     {
       value = value?1:0;
       this.getAddressvalues(this.state.profile.fields.gmapaddress,value);
     }
     else if (key == "getcurrentlocation")
      {
        value = value?1:0;
        this.getCurrentLocation(value);
      }
      else if(key == 'country.label')
      {
        let country = this.state.profile.fields.country;
        country.label = value;
        value = country;
        key = 'country';
      }
      if(key == "schedule")
       {
         schedule.forEach(x => {

           if(x.value == value.id)
           {
             if(value.key == "starttime")
             {
               if(x.duration[index].endtime && compareTime(value.value,x.duration[index].endtime))
               {
                 //value.value > x.duration[index].endtime
                  NotificationManager.error('Start Time should be less then End Time.');
                  return false;
               }
               if(x.duration[index-1])
               {
                 if(x.duration[index-1].endtime && compareTime(x.duration[index-1].endtime,value))
                 {
                   //value < x.duration[index-1].endtime
                   NotificationManager.error('Shift time is overlapping.');
                   return false;
                 }
               }
               x.duration[index][value.key] = value.value;
             }
             else if(value.key == "endtime")
             {
               if(x.duration[index].starttime && compareTime(x.duration[index].starttime,value.value))
               {
                  //x.duration[index].starttime > value.value
                  NotificationManager.error('End Time should not be less then Start Time.');
                  return false;
               }
               if(x.duration[index+1])
               {
                 if(x.duration[index+1].starttime && compareTime(value , x.duration[index+1].starttime))
                 {
                   //value < x.duration[index+1].starttime
                   NotificationManager.error('Shift time is overlapping.');
                   return false;
                 }
               }
               x.duration[index][value.key] = value.value;
             }
             else if(value.key == 'checked')
             {
               x[value.key] = value.value;
               if(!value.value)
               {
                 x['duration'] = [];

               }
               else {
                 x['duration'] = cloneDeep(this.state.profile.fields.duration);

               }
             }
           }
         })
         value = schedule;
       }
     else if(key == "starttime")
            {
              //value > duration[index].endtime
                if(duration[index].endtime &&  compareTime(value,duration[index].endtime))
                    {
                       NotificationManager.error('Start Time should be less then End Time.');
                       return false;
                    }
                    if(duration[index-1])
                            {
                              if(duration[index-1].endtime && compareTime(duration[index-1].endtime,value) )
                              {
                                //value < duration[index-1].endtime
                                NotificationManager.error('Shift time is overlapping.');
                                return false;
                              }
                          }

                         duration[index].starttime = value;
                        schedule.forEach(x => {if(x.checked) {x.duration[index].starttime = value} });
              }
              else if(key == "endtime")
                    {
                      if(duration[index].starttime && compareTime(duration[index].starttime , value))
                            {
                              //duration[index].starttime > value
                               NotificationManager.error('End Time should not be less then Start Time.');
                               return false;
                            }
                            if(duration[index+1])
                            {
                              if(duration[index+1].starttime && compareTime(value,duration[index+1].starttime) )
                              {
                                //value < duration[index+1].starttime
                                NotificationManager.error('Shift time is overlapping.');
                                return false;
                              }
                            }
                          duration[index].endtime = value;
                          schedule.forEach(x => {if(x.checked) {x.duration[index].endtime = value } });
                  }


     else {
           if(!error && value)
          {
           if(key == 'mobile')
           {
             if(fields.country.id)
             {
               error = checkMobileNo(value, fields.country.id, fields.country.label,fields.country.languagecode);
             }
             else {
               error = checkMobileNo(value);
             }
             value = restrictLength(value,12);
           }
           else if(key == 'country')
           {
             if(fields.mobile)
             {
               this.state.profile.errors.mobile = checkMobileNo(fields.mobile, value.id , value.label,value.languagecode);
             }
             if(fields.pincode)
             {
               this.state.profile.errors.pincode = checkPincode(fields.phone, value.id , value.label);
             }
           }
           else if(key == 'pincode')
           {
             if(fields.country.id)
             {
                 error = value != '' ? checkPincode(value, fields.country.id , fields.country.label) : '';
             }
            else {
                error = value != '' ? checkPincode(value) : '';
            }
             value = restrictLength(value,7);
           }
           else if (key == "gymaccessslot") {
            value = value?1:0;
           }
           else if (key == "cancelgymaccessslothour" || key == "cancelptslothour" || key == "cancelclassslothour") {
             value = restrictLength(value,4);
           }
         }

       }


             this.setState({
               profile: {
                 ...this.state.profile,
                 fields : {...this.state.profile.fields,
                   [key] : value
                 },
                 errors : {...this.state.profile.errors,
                   [key] : error
                 }
               },
             });
  }

  validate()
    {
      let errors = {};

      const fields = this.state.profile.fields;
      const {clientProfileDetail} = this.props;
      let country = this.state.profile.fields.country;

      errors.organizationname = required(fields.organizationname);
      errors.mobile = required(fields.mobile);

            if(errors.mobile != '')
            {
                if(country.id)
                {
                    error = checkMobileNo(fields.mobile, country.id , country.label,country.languagecode);
                }
               else {
                   error = checkMobileNo(fields.mobile);
               }
            }
    if(clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1){

      //errors.firstName = (errors.firstName != '' ? errors.firstName : checkAlpha(fields.firstName));
      errors.state = required(fields.state);
    //	errors.lastName = (errors.lastName != '' ? errors.lastName : checkAlpha(fields.lastName));

      errors.country = required(fields.country);
      errors.gmapaddress = required(fields.gmapaddress);
      errors.pincode = required(fields.pincode);

      // errors.cancelgymaccessslothour = required(fields.cancelgymaccessslothour);
      // errors.cancelptslothour = required(fields.cancelptslothour);
      // errors.cancelclassslothour = required(fields.cancelclassslothour);

      if(fields.gymaccessslot == 1){
        errors.slotduration = required(fields.slotduration);
        errors.slotmaxoccupancy = required(fields.slotmaxoccupancy);
        errors.slotmaxdays = required(fields.slotmaxdays);
      }
        errors.ptslotduration = required(fields.ptslotduration);

        if(clientProfileDetail && clientProfileDetail.packtypeId != 1)
        {
          errors.ptslotmaxdays = required(fields.ptslotmaxdays);
          errors.classmaxdays = required(fields.classmaxdays);
        }

        // errors.ptslotmaxoccupancy = required(fields.ptslotmaxoccupancy);

        // if((fields.starttime && !fields.endtime) || (!fields.starttime && fields.endtime)){
        //   if(!fields.endtime){
        //     errors.endtime = required(fields.endtime);
        //   }
        //   else if(!fields.starttime){
        //     errors.starttime = required(fields.starttime);
        //   }
        // }
        // else if((fields.starttime1 && !fields.endtime1) || (!fields.starttime1 && fields.endtime1)){
        //      if(!fields.endtime1){
        //        errors.endtime1 = required(fields.endtime1);
        //      }
        //      else if(!fields.starttime1){
        //        errors.starttime1 = required(fields.starttime1);
        //      }
        // }
        // if(fields.starttime1 && fields.endtime1 && fields.starttime && fields.endtime){
        //      if(fields.starttime1 < fields.endtime){
        //        errors.starttime1 = "Shift 2 Opening Time should be greater then shift 1 Closing Time."
        //      }
        // }


      if(errors.pincode != '')
      {
          if(country.id)
          {
              error = checkPincode(fields.pincode, country.id , country.label);
          }
         else {
             error = checkPincode(fields.pincode);
         }
      }
      {
      // if(errors.cancelgymaccessslothour != ''){
      //     errors.cancelgymaccessslothour = fields.cancelgymaccessslothour < 3 && `Must be at least 3 hour`;
      // }
      // if(errors.cancelclassslothour != ''){
      //     errors.cancelclassslothour = fields.cancelclassslothour < 3 && `Must be at least 3 hour`;
      // }
      // if(errors.cancelptslothour != ''){
      //     errors.cancelptslothour = fields.cancelptslothour < 3 && `Must be at least 3 hour`;
      // }
    }
  }

  // if(fields.duration.filter(x => (x.starttime == '' || x.starttime == null) || ( x.endtime == '' || x.endtime == null)).length > 0)
  //  {
  //     NotificationManager.error("Please enter shift");
  //     errors.duration = "Please enter shift";
  //  }

   // if(fields.schedule && fields.schedule.filter(x => x.duration.filter(y => ((y.starttime == '' || y.starttime == null) && (y.endtime != '' || y.endtime != null))).length > 0))
   //  {
   //     NotificationManager.error("Please enter shift");
   //     errors.schedule = "Please enter shift";
   //  }

      let validated = checkError(errors);

       this.setState({
         profile: {	...this.state.profile,
            errors : errors, validated : validated
         }
       });

       return validated;
}

  getCountry = (value) =>
  {
          api.post('country-suggestion', {value})
          .then(response => {
            this.onChange('countryArray', response.data[0]);
          }).catch(error => console.log(error) )
  }

  getState = (value) =>
  {
          api.post('state-suggestion', {value})
          .then(response => {
            this.onChange('stateArray', response.data[0]);
          }).catch(error => console.log(error) )
  }

  onConfirm()
  {
    const {profile_old} = this.state;
    const {clientProfileDetail} = this.props;

    let profiledetail = cloneDeep(this.state.profile.fields);
      if(clientProfileDetail && clientProfileDetail.serviceprovidedId != 1 && JSON.stringify(profile_old.schedule) !=  JSON.stringify(profiledetail.schedule))
        {
          this.state.changeScheduleconfirmationDialog = true;
        }
        else{
          profiledetail.ptslotdurationlabel = SlotDuration.filter(x => x.value == profiledetail.ptslotduration)[0].name;
          profiledetail.restbetweentwoptslotlabel = RestDuration.filter(x => x.value == profiledetail.restbetweentwoptslot)[0].name;
          this.props.saveClientProfile({profiledetail});
       }
    this.setState({
      confirmationDialog : false,
    });
  }

  cancelConfirmation()
  {
    this.setState({
     confirmationDialog : false,
   });
  }


  onUpdateProfile()
 {
   if(this.validate())
   {
     let {profile_old} = this.state;
     const	{clientProfileDetail} = this.props;
     let profiledetail = this.state.profile.fields;
     if(clientProfileDetail && (JSON.stringify(profile_old) != JSON.stringify(profiledetail)))
      {
            if(profiledetail.schedule.length > 0 && profiledetail.schedule.filter(x => x.starttime1 && x.endtime &&  moment(getLocalDate(x.starttime1)) < moment(getLocalDate(x.endtime))).length > 0){

              let errordaysname  =  profiledetail.schedule.filter(x => moment(getLocalDate(x.starttime1)) < moment(getLocalDate(x.endtime)))[0].name;
               NotificationManager.error('In ' + errordaysname + ' Shift 2 opening time should be greater then shift 1 closing time.')
             }
            else{
              this.setState({
                confirmationDialog : true,
              });
            }
      }
      else {
        NotificationManager.error('No changes detected');
       }
    }
 }

 handleChange = address => {
   this.setState({
     profile: {
       ...this.state.profile,
       fields : {...this.state.profile.fields,
          gmapaddress : address,
          isaddressSame : 0
       }
     }
   });
};

handleSelect = address => {

  geocodeByAddress(address)
    .then(results => getLatLng(results[0]))
    .then(({ lat, lng }) => {

      this.setState({
        profile: {
          ...this.state.profile,
          fields : {...this.state.profile.fields,
             gmapaddress : address , latitude : lat,
             longitude : lng}}
        });
    })
    .catch(error => console.error('Error', error));

};

getCurrentLocation(value)
{
  if(value)
  {
    window.navigator.geolocation.getCurrentPosition(
        success =>{
          this.setState({
            profile: {
              ...this.state.profile,
              fields : {...this.state.profile.fields,
                 getcurrentlocation : 1,latitude : success.coords.latitude,longitude: success.coords.longitude}}
            });
          },
          () => {
              alert('Position could not be determined.');
          }
    );

    // navigator.geolocation.getCurrentPosition(
    //   function(position) {
    //     currentlocation.setcurrentlatitude = position.coords.latitude;
    //     currentlocation.setcurrentlongitude = position.coords.longitude;
    //   },
    //   () => {
    //       alert('Position could not be determined.');
    //   }
    //  );

  }
  else {
    let oldlatitude = this.state.profile_old.latitude;
    let oldlongitude = this.state.profile_old.longitude;
    this.setState({
      profile: {
        ...this.state.profile,
        fields : {...this.state.profile.fields,
           getcurrentlocation : 0,latitude : oldlatitude, longitude : oldlongitude}}
      });
  }
}

getAddressvalues(address,value)
{
  if(value)
  {
    //let address = this.state.profiledetail.gmapaddress;
    let addressarray = address.split(', ');
    let arraylength = addressarray.length;
    let country = arraylength > 0 ? addressarray[arraylength - 1] : '';
    let state = arraylength > 1 ? addressarray[arraylength - 2] : '';
    let city = arraylength > 2 ? addressarray[arraylength - 3] : '';
    let newarray = arraylength > 3 ? addressarray.slice(0, -3) : [];
    let address1 = '';
    let address2 = '';

    if(newarray.length == 1)
    {
      address1 = newarray[newarray.length - 1];
    }
    else {
      address1 = newarray.slice(0, -1);
      address1 = address1.join();
       address2 = newarray[newarray.length - 1];
    }
    this.setState({
      profile: {
        ...this.state.profile,
        fields : {...this.state.profile.fields,
           city : city,state: state,country: {label : country} ,address1 : address1, address2 :address2,isaddressSame : 1}}
      });
  }
  else {
    this.setState({
      profile: {
        ...this.state.profile,
        fields : {...this.state.profile.fields,
           isaddressSame : 0}}
      });
  }
}
onConfirmWithoutCancelAdvanceBooking(){
      let profiledetail = this.state.profile.fields;
      this.setState({
      changeScheduleconfirmationDialog : false,
    });
    profiledetail.ptslotdurationlabel = SlotDuration.filter(x => x.value == profiledetail.ptslotduration)[0].name;
    profiledetail.restbetweentwoptslotlabel = RestDuration.filter(x => x.value == profiledetail.restbetweentwoptslot)[0].name;

    this.props.saveClientProfile({profiledetail});
}
onCancelAdvanceBookingConfirmationDialog(){
      this.setState({
       changeScheduleconfirmationDialog : false,
      });
}
onConfirmCancelAdvanceBooking(){
      let profiledetail = this.state.profile.fields;
      this.setState({
      changeScheduleconfirmationDialog : false,
    });
    profiledetail.ptslotdurationlabel = SlotDuration.filter(x => x.value == profiledetail.ptslotduration)[0].name;
    profiledetail.restbetweentwoptslotlabel = RestDuration.filter(x => x.value == profiledetail.restbetweentwoptslot)[0].name;
    this.props.saveClientProfile({profiledetail});
    this.props.onCancelAdvanceBookingofMember();
}
onAdd = () => {
      let {duration ,schedule} = this.state.profile.fields;

        if(duration.length < 12)
        {
          duration.push(cloneDeep(duration[duration.length - 1]));
          let lastObject = duration[duration.length - 1];
          Object.keys(lastObject).forEach(key => lastObject[key] = null);

          schedule.forEach(x => {if(x.checked) {x.duration = cloneDeep(duration) } });
          //schedule.forEach(x => {x.duration = cloneDeep(duration) });

          this.setState({
            profile: {
              ...this.state.profile,
              fields : {...this.state.profile.fields,
                duration : duration,
              },
            }
          });
        }
        else {
          NotificationManager.error('Maximum 12 allowed');
        }
}

onRemove = (data) => {
     let {duration,schedule} = this.state.profile.fields;
     if(duration.length > 1)
     {
       duration.splice( duration.indexOf(data), 1 );

       schedule.forEach(x => {if(x.checked) {x.duration = cloneDeep(duration) } });

       this.setState({
         profile: {
           ...this.state.profile,
           fields : {...this.state.profile.fields,
             duration : duration,
           },
         }
       });

     }
   }


  render() {
    const { clientProfileDetail,updateRights,addRights,disabled,classes,userProfileDetail} = this.props;
    let {profile,confirmationDialog,changeScheduleconfirmationDialog} = this.state;
    profile = profile.fields;

    let selectCountry = profile.countryArray && profile.countryArray.filter(x => x.label == profile.country)[0];

		selectCountry = selectCountry || {};

    let {errors} = this.state.profile;

    const buttonClassname = classNames({
      [classes.buttonSuccess]: disabled,
    });
    profile.schedule = profile.schedule || [];
    let viewRights =  checkModuleRights(userProfileDetail.modules,"branch","view");

    return (
      <div className="profile-wrapper w-50">

        <Form>

         <div className="row">
            <Col sm={12}>
                <TextField required inputProps={{maxLength:50}}  id="organizationname" autoFocus = {true} fullWidth label="Organization Name" value={profile.organizationname} onChange={(e) =>this.onChange( 'organizationname' ,e.target.value,true)} />
                 <FormHelperText  error>{errors.organizationname}</FormHelperText>
            </Col>
          </div>

          <div className="row">
            <Col sm={6}>
                  <TextField inputProps={{maxLength:50}}  id="useremail" fullWidth label="Email ID" value={profile.useremail} onChange={(e) =>this.onChange( 'useremail' ,  e.target.value)} />
                   <FormHelperText  error></FormHelperText>
            </Col>
            <Col sm={6}>
                <TextField required inputProps={{maxLength:50}} type="number" id="mobile"  fullWidth label="Mobile No"   value={profile.mobile} onChange={(e) =>this.onChange( 'mobile' ,e.target.value,true)} />
                 <FormHelperText  error>{errors.mobile}</FormHelperText>
            </Col>
          </div>
          {clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1 &&
          <div className="row">
              {/*
                <div className="col-sm-12 col-md-12 col-xl-8 pb-5">
                    <PlacesAutocomplete
                        value={profile.gmapaddress}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}
                        searchOptions={{
                              location: new window.google.maps.LatLng(profile.latitude,profile.longitude),
                              radius: 10000
                            }}
                      >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                          <div>
                            <TextField required inputProps={{maxLength:500}} fullWidth label="Google Map Address" multiline rows={1} rowsMax={4}
                              {...getInputProps({
                                placeholder: 'Search Google Map Location ...',
                                className: 'location-search-input',
                              })}
                              InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton className = "p-5" onClick = {() => this.onChange('gmapaddress', '') }>
                                          <CloseIcon />
                                      </IconButton>
                                    </InputAdornment>
                                  )
                                }}
                            />

                             <FormHelperText  error>{errors.gmapaddress}</FormHelperText>
                            <div className="autocomplete-dropdown-container">
                              {loading && <div>Loading...</div>}
                              {suggestions.map(suggestion => {
                                const className = suggestion.active
                                  ? 'suggestion-item--active'
                                  : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                  ? { backgroundColor: '#d3d3d3', cursor: 'pointer' }
                                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                  <div
                                    {...getSuggestionItemProps(suggestion, {
                                      className,
                                      style,
                                    })}
                                  >
                                    <span>{suggestion.description}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </PlacesAutocomplete>
                 </div>


                */}
               <div className="col-sm-12 col-md-12 col-xl-4">
                  <FormControlLabel  control={
                    <Checkbox color="primary" checked={profile.getcurrentlocation==0?false:true} onChange={(e) => this.onChange('getcurrentlocation', e.target.checked )} />
                  }  label="Set current location"
                  />
               </div>

               <div className="col-sm-12 col-md-6 col-xl-6">
                   <TextField inputProps={{maxLength:20}} disabled = {true}  id="latitude"  fullWidth label="Latitude" value={profile.latitude} onChange={(e) =>this.onChange( 'latitude' ,e.target.value)} />
                    <FormHelperText  error>{errors.latitude}</FormHelperText>
               </div>
               <div className="col-sm-12 col-md-6 col-xl-6">
                   <TextField inputProps={{maxLength:20}} disabled = {true} id="longitude"  fullWidth label="Longitude" value={profile.longitude} onChange={(e) =>this.onChange( 'longitude' ,e.target.value)} />
                    <FormHelperText  error>{errors.longitude}</FormHelperText>
               </div>

              {profile.gmapaddress &&
                <div className="col-sm-12 col-md-12 col-xl-12">
                   <FormControlLabel  control={
                     <Checkbox color="primary" checked={profile.isaddressSame==0?false:true} onChange={(e) => this.onChange('isaddressSame', e.target.checked )} />
                   }  label="Same as Google Map Address"
                   />
                </div>
              }
          </div>
    }
    {clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1 &&
          <div className="row">
            <Col sm={6}>
                <TextField inputProps={{maxLength:50}}  id="address1"  fullWidth label="Address Lane1" value={profile.address1} onChange={(e) =>this.onChange( 'address1' ,e.target.value)} />
                 <FormHelperText  error></FormHelperText>
            </Col>
            <Col sm={6}>
                <TextField inputProps={{maxLength:50}}  id="address2"  fullWidth label="Area" value={profile.address2} onChange={(e) =>this.onChange( 'address2' ,e.target.value)} />
                 <FormHelperText  error></FormHelperText>
            </Col>
          </div>
    }
    {clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1 &&
          <div className="row">
            <Col sm={6}>
                  <TextField inputProps={{maxLength:50}}  id="city"  fullWidth label="City" value={profile.city} onChange={(e) =>this.onChange( 'city' ,e.target.value)} />
                   <FormHelperText  error></FormHelperText>
            </Col>
            <Col sm={6}>
                  <AutoSuggest  value = {profile.state} suggestions = {profile.stateArray} getSuggetion= {(value) => this.getState(value)}  label = "State/Region *" onChange= {(value) => this.onChange('state', value,true) }/>
                   {errors.state && <FormHelperText  error>{errors.state}</FormHelperText>}
            </Col>
          </div>
  }
  {clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1 &&
          <div className="row">
            <Col sm={6}>
                  <AutoSuggest  value = {profile.country.label} suggestions = {profile.countryArray} getSuggetion= {(value) => this.getCountry(value)}  label = "Country *"
                  onChange= {(value) => this.onChange('country.label', value,true) } onValueChange= {(value) => this.onChange('country', value , true) }/>
                   {errors.country && <FormHelperText  error>{errors.country}</FormHelperText>}
            </Col>
            <Col sm={6}>
                  <TextField required inputProps={{maxLength:50}} id="pincode"  fullWidth label="ZIP/Postal code" value={profile.pincode} onChange={(e) =>this.onChange( 'pincode' ,e.target.value,true)} />
                   <FormHelperText  error>{errors.pincode}</FormHelperText>
            </Col>
          </div>
    }

       {
          // <div className="row">
          //   <Col sm={12}>
          //         <TextField inputProps={{maxLength:50}}  id="description" fullWidth label="Description" value={profile.description} onChange={(e) =>this.onChange( 'description' ,e.target.value)} />
          //          <FormHelperText  error></FormHelperText>
          //    </Col>
          //
          // </div>
        }
  {clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1 && clientProfileDetail.clienttypeId != 2 &&
    <div className="row">
            <div className="col-12 col-md-12">
                    {profile.duration.map((x,key) =>  (
                     <div className="col-12 d-flex pl-0 pt-5" key = {"list-duration" + key}>
                       <div className="col-6 col-sm-6 col-xl-4 pl-0">
                         <div className="rct-picker">
                           <TimePicker label = "Start Time" value ={x.starttime} onChange = {(date) => {this.onChange('starttime',date,true,key)} }/>
                           {errors.starttime &&	<FormHelperText  error>{errors.starttime}</FormHelperText> }
                         </div>
                       </div>
                       <div className="col-6 col-sm-6 col-xl-4">
                         <div className="rct-picker">
                           <TimePicker label = "End Time" value ={x.endtime} onChange = {(date) => {this.onChange('endtime',date,true,key)} } />
                           {errors.endtime &&	<FormHelperText  error>{errors.endtime}</FormHelperText>}
                         </div>
                      </div>
                       <a href="#" className= "mt-20" onClick={(e) =>{e.preventDefault(); this.onRemove(x);}} ><i className="ti-close"></i></a>
                 </div>
                  ))}
                  <div className="pt-10 pb-10">
                    <a className="btn-outline-default mr-10 fw-bold" onClick = {() => { this.onAdd(); }}>
                    <i className="ti-plus"></i>Add Shift</a>
                  </div>
       </div>
       </div>
      }

      {clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1 && clientProfileDetail.clienttypeId != 2 &&
         <div className="row">
         <Col sm={12}>
         <ReactTable

                   columns={[
                     {
                       Header: "Days",
                       accessor : 'name',
                       Cell : data =>
                       (
                       <div className="row">
                             <Checkbox color="primary"
                             checked = {data.original.checked || false}

                           onChange = {(e) => this.handleChangeSchedule(data.original.value, 'checked' , e.target.checked , true , 0) }
                              />
                              <label className="professionaldetail_padding" > {isMobile && data.original.short ? data.original.short : data.original.name } </label>
                        </div>
                      )},
                      {
                        Header: "SHIFT TIMING",
                        accessor : 'duration',
                        Cell : data =>
                        (
                          <div>
                              {data.original.duration && data.original.duration.map((x,key) =>  (
                               <div className="col-12 d-flex pl-0" key = {"table-duration" + key}>
                                  <div className="col-6 pl-0">
                                    <div className="rct-picker">
                                      <TimePicker label = "Start Time" value ={x.starttime} onChange = {(date) => {this.handleChangeSchedule(data.original.value,'starttime',date,true,key)} }/>
                                      <FormHelperText  error></FormHelperText>
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="rct-picker">
                                      <TimePicker label = "End Time" value ={x.endtime} onChange = {(date) => { this.handleChangeSchedule(data.original.value,'endtime',date,true,key)} } />
                                      <FormHelperText  error></FormHelperText>
                                    </div>
                                 </div>
                            </div>
                            ))
                          }
                          </div>
                          ),
                          minWidth:140,
                      },
                   ]}
                   filterable = { false}
                   sortable = { false }
                   data = {profile.schedule}
                  // Forces table not to paginate or sort automatically, so we can handle it server-side
                   showPagination= {false}
                   showPaginationTop = {false}
                   loading={false} // Display the loading overlay when we need it
                   defaultPageSize={7}
                   className=" -highlight"
                   freezeWhenExpanded = {true}
                   />
            </Col>
                </div>
        }
                {clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1 && clientProfileDetail.serviceprovidedId != 1 && clientProfileDetail.gymaccessslot == 1 &&
                <div className="row">
                    <Col md={6} xl = {3} className = "d-inline mt-5">
                      <span className = "pr-10">Gym Access Slot</span>
                    </Col>
                    <Col sm={6} className = "d-inline">
                      <span className ={ profile.gymaccessslot == 0 ? 'fw-bold' : '' } >Disable</span>
                       <FormControlLabel
                           className="m-0"
                           control={
                               <Switch
                                   checked={profile.gymaccessslot==0?false:true}
                                   onClick={(e) => this.onChange('gymaccessslot', e.target.checked )}
                                   color="primary"
                                   className="switch-btn"
                               />
                           }
                       />
                      <span className ={ profile.gymaccessslot == 1 ? 'fw-bold' : '' } >Enable</span>
                      </Col>
                </div>
                }
                {clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1 && profile.gymaccessslot == 1 &&
                      <div className="row">
                        <Col md={12} xl={4}>
                             <FormGroup className="has-wrapper">
                                   <FormControl fullWidth>
                                   <InputLabel htmlFor="slotduration">Slot Duration In Min*</InputLabel>
                                       <Select value={profile.slotduration}  onChange={(e) => this.onChange('slotduration', e.target.value,true)}
                                         inputProps={{name: 'slotduration'}}>
                                         {
                                           SlotDuration.map((slotduration, key) => ( <MenuItem value={slotduration.value} key = {'slotdurationOption' + key }>{slotduration.name}</MenuItem> ))
                                         }
                                       </Select>
                                 </FormControl>
                               {errors.slotduration && <FormHelperText  error>{errors.slotduration}</FormHelperText>}
                            </FormGroup>
                          </Col>
                          <Col md={12} xl={8}>
                               <FormGroup className="has-wrapper">
                                  <FormControl fullWidth>
                                   <InputLabel htmlFor="gapbetweentwogymaccessslot">Gap Between two Gym access Slot In Min</InputLabel>
                                         <Select value={profile.gapbetweentwogymaccessslot}  onChange={(e) => this.onChange('gapbetweentwogymaccessslot', e.target.value)}
                                           inputProps={{name: 'gapbetweentwogymaccessslot'}}>
                                           {
                                             RestDuration.map((gapbetweentwogymaccessslot, key) => ( <MenuItem value={gapbetweentwogymaccessslot.value} key = {'gapbetweentwogymaccessslotOption' + key }>{gapbetweentwogymaccessslot.name}</MenuItem> ))
                                           }
                                         </Select>
                                   </FormControl>
                                 {errors.gapbetweentwogymaccessslot && <FormHelperText  error>{errors.gapbetweentwogymaccessslot}</FormHelperText>}
                               </FormGroup>
                               </Col>
                          <Col md={12} xl={6}>
                                      <TextField required type = "number" inputProps={{maxLength:500}} id="slotmaxoccupancy" fullWidth label="Max Member Occupancy Per Slot"  value={profile.slotmaxoccupancy} onChange={(e) => this.onChange('slotmaxoccupancy',e.target.value < 500 ? (e.target.value < 0 ? 0 : e.target.value ) : 500,true)}/>
                                      <FormHelperText  error>{errors.slotmaxoccupancy}</FormHelperText>
                        </Col>
                        <Col md={12} xl={6}>
                                    <TextField required type = "number" inputProps={{maxLength:30}} id="slotmaxdays" fullWidth label="Max Days to Book Gym Slot in Advance"  value={profile.slotmaxdays} onChange={(e) => this.onChange('slotmaxdays',e.target.value < 30 ? (e.target.value < 0 ? 0 : e.target.value ) : 30,true)}/>
                                    <FormHelperText  error>{errors.slotmaxdays}</FormHelperText>
                      </Col>
                      </div>
                }
                {clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1 && clientProfileDetail.packtypeId != 1 &&
                      <div className="row">
                      <Col md={12} xl={4}>
                             <FormGroup className="has-wrapper">
                                   <FormControl fullWidth>
                                   <InputLabel htmlFor="ptslotduration">PT Slot Duration In Min*</InputLabel>
                                       <Select value={profile.ptslotduration}  onChange={(e) => this.onChange('ptslotduration', e.target.value,true)}
                                         inputProps={{name: 'ptslotduration'}}>
                                         {
                                           SlotDuration.map((ptslotduration, key) => ( <MenuItem value={ptslotduration.value} key = {'ptslotdurationOption' + key }>{ptslotduration.name}</MenuItem> ))
                                         }
                                       </Select>
                                 </FormControl>
                               {errors.slotduration && <FormHelperText  error>{errors.ptslotduration}</FormHelperText>}
                            </FormGroup>
                          </Col>
                          <Col md={12} xl={8}>
                               <FormGroup className="has-wrapper">
                                  <FormControl fullWidth>
                                   <InputLabel htmlFor="restbetweentwoptslot">Rest Between two PT Slot In Min</InputLabel>
                                         <Select value={profile.restbetweentwoptslot}  onChange={(e) => this.onChange('restbetweentwoptslot', e.target.value)}
                                           inputProps={{name: 'restbetweentwoptslot'}}>
                                           {
                                             RestDuration.map((restbetweentwoptslot, key) => ( <MenuItem value={restbetweentwoptslot.value} key = {'restbetweentwoptslotOption' + key }>{restbetweentwoptslot.name}</MenuItem> ))
                                           }
                                         </Select>
                                   </FormControl>
                                 {errors.restbetweentwoptslot && <FormHelperText  error>{errors.restbetweentwoptslot}</FormHelperText>}
                               </FormGroup>
                          </Col>
                          {
                            //   <Col sm={6}>
                            //               <TextField required type = "number" inputProps={{maxLength:500}} id="slotmaxoccupancy" fullWidth label="Max Member Occupancy Per PT Slot"  value={profile.ptslotmaxoccupancy} onChange={(e) => this.onChange('ptslotmaxoccupancy',e.target.value < 500 ? (e.target.value < 0 ? 0 : e.target.value ) : 500,true)}/>
                            //               <FormHelperText  error>{errors.ptslotmaxoccupancy}</FormHelperText>
                            // </Col>
                        }
                        <Col md={12} xl={6}>
                                    <TextField required type = "number" inputProps={{maxLength:30}} id="ptslotmaxdays" fullWidth label="Max Days to Book PT Slot in Advance"  value={profile.ptslotmaxdays} onChange={(e) => this.onChange('ptslotmaxdays',e.target.value < 30 ? (e.target.value < 0 ? 0 : e.target.value ) : 30,true)}/>
                                    <FormHelperText  error>{errors.ptslotmaxdays}</FormHelperText>
                      </Col>
                      </div>
                  }
                  {clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1 && clientProfileDetail.packtypeId != 1 &&
                      <div className="row">
                      <Col md={12} xl={6}>
                          <TextField required type = "number" inputProps={{maxLength:30}} id="classmaxdays" fullWidth label="Max Days to Book Class in Advance"  value={profile.classmaxdays} onChange={(e) => this.onChange('classmaxdays',e.target.value < 30 ? (e.target.value < 0 ? 0 : e.target.value ) : 30,true)}/>
                          <FormHelperText  error>{errors.classmaxdays}</FormHelperText>
                        </Col>
                      </div>
                    }
                    {clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1 && clientProfileDetail.packtypeId == 3 &&
                      <h4 className ="pt-5"> Booking Cancel Policy Configuration In Member App :- </h4>
                    }
                    {clientProfileDetail && clientProfileDetail.ishavemutliplebranch != 1 && clientProfileDetail.packtypeId == 3 &&
                      <div className="row">
                      {clientProfileDetail && clientProfileDetail.serviceprovidedId != 1 && clientProfileDetail.gymaccessslot == 1 &&
                        <Col md={12} xl={6}>
                                <TextField  type = "number" inputProps={{maxLength:500}} id="cancelgymaccessslothour" fullWidth label="Gym Access Slot Before In Hours"  value={profile.cancelgymaccessslothour} onChange={(e) => this.onChange('cancelgymaccessslothour',e.target.value < 500 ? (e.target.value < 0 ? 0 : e.target.value ) : 500)}/>
                                <FormHelperText  error>{errors.cancelgymaccessslothour}</FormHelperText>

                          </Col>
                        }
                        <Col md={12} xl={6}>
                                <TextField type = "number" inputProps={{maxLength:500}} id="cancelptslothour" fullWidth label="PT Slot Before In Hours"  value={profile.cancelptslothour} onChange={(e) => this.onChange('cancelptslothour',e.target.value < 500 ? (e.target.value < 0 ? 0 : e.target.value ) : 500)}/>
                                <FormHelperText  error>{errors.cancelptslothour}</FormHelperText>
                            </Col>
                            <Col md={12} xl={6}>
                                    <TextField type = "number" inputProps={{maxLength:500}} id="cancelclassslothour" fullWidth label="Class Slot Before In Hours"  value={profile.cancelclassslothour} onChange={(e) => this.onChange('cancelclassslothour',e.target.value < 500 ? (e.target.value < 0 ? 0 : e.target.value ) : 500)}/>
                                    <FormHelperText  error>{errors.cancelclassslothour}</FormHelperText>
                              </Col>
                      </div>
                    }
                      {(updateRights && addRights) &&
                      <div className={classes.root + " " + "row"}>
                       <Col sm={6} className={classes.wrapper + " " + "col-sm-3"}>
                         <Button variant="contained" color="primary" disabled = {disabled} onClick={()=>this.onUpdateProfile()} className="text-white">
                           Save
                         </Button>
                         {disabled && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </Col>
                      </div>}
                      {clientProfileDetail && clientProfileDetail.ishavemutliplebranch == 1 && viewRights &&
                      <div className={classes.root + " " + "row pt-10"}>
                       <Col sm={12}>
                             <div  className= "row" >
                             <label className="professionaldetail_padding" > For more configuration go to </label>

                                     <Button variant="contained" color="primary" className="text-white text-capitalize" href={"/app/setting/branch"}>
                                       Branch
                                     </Button>
                            </div>
                        </Col>
                      </div>}

        </Form>
        {
           confirmationDialog &&
         <DeleteConfirmationDialog
           openProps = {confirmationDialog}
           title="Are You Sure Want To Continue?"
           message="This will update your details."
           onConfirm={() => this.onConfirm()}
            onCancel={() => this.cancelConfirmation()}
         />
         }
         {
            changeScheduleconfirmationDialog &&
          <DeleteConfirmationDialog
            openProps = {changeScheduleconfirmationDialog}
            title="Are You Sure Want To Continue?"
            message="This will cancel the advance gym slots bookings of members."
            onConfirm={() => this.onConfirmWithoutCancelAdvanceBooking()}
             onCancel={() => this.onCancelAdvanceBookingConfirmationDialog()}
             onContinue = {() => this.onConfirmCancelAdvanceBooking()}
             continuelabel= "Save With Booking cancellation"
              confirmlabel="Save"
          />
          }
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { clientProfileDetail,disabled,userProfileDetail} = settings;
  return { clientProfileDetail ,disabled,userProfileDetail};
};

export default compose (withStyles(styles),connect(mapStateToProps,{  saveClientProfile,onCancelAdvanceBookingofMember,push}))(Profile);
