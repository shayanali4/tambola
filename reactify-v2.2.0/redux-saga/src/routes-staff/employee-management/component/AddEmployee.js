/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewEmployeeModel, saveEmployee } from 'Actions';

import Bloodgroup  from 'Assets/data/bloodgroup';
import Title  from 'Assets/data/title';
import Gender  from 'Assets/data/gender';
import Status  from 'Assets/data/status';

import {getLocalDate, checkError, cloneDeep} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import PersonalDetail from './PersonalDetails';
import ProfessionalDetail from './ProfessionalDetails';
import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import {required,email,checkLength,checkMobileNo,checkPincode,restrictLength,allowAlphaNumeric,checkDecimal,convertToInt} from 'Validations';
import {strengthObject,strengthIndicator } from 'Routes/session/signup/components/strength-password';
import { push } from 'connected-react-router'
import {isMobile} from 'react-device-detect';
import { NotificationManager } from 'react-notifications';
import Weekdays from 'Assets/data/weekdays';


function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddEmployee extends PureComponent {
	constructor(props) {
     super(props);
       Weekdays.forEach(x => x.checked = false);
		   this.state = this.getInitialState();
   }
   getInitialState()
   {
     let profile = this.props.clientProfileDetail;
     this.initialState = {
             activeIndex : 0,
             professionalDetail:
             {
               fields : {
                           id :0,
                           title:'1',
                           firstname:'',
                           lastname : '',
                           fathername:'',
                           gender : "1",
                           status : "1",
                           emailid : '',
                           password : '',
                           assignrole: '',
                           specialization: '',
                           mobile:'',
                           phone:'',
                           dateofjoining : null,
                           dateofresigning: null,
                           image:'',
                           imageFiles: [],
                           salary:0,
                           ismembermobilevisible : 0,
                           ismemberemailidvisible : 0,
                           isenquirymobilevisible : 0,
                           isenquiryemailidvisible : 0,
                           selectedbranch : this.props.userProfileDetail && this.props.userProfileDetail.defaultbranchid,
                           selectedzone : '',
                           associatewith : '1',
                           appaccess : '1',
                           istrainer : 0,
                           enablecomplimentarysale : 0,
                           complimentarysalelimit : '',
                           enablediscount : 0,
                           enablediscountlimit : 0,
                           maxdiscountperitem : '',
                           maxdiscountperinvoice : '',
                           maxmonthlylimit : '',
                           isbiometriclogs : 0,
                           enableonlinelisting : 0,
                           enablecommission : 0,
                           ptcommssion : '',
                           enableonlinetraining : 0,
                           professionaldetails : '',
                           commissiontypeId : '',
                           daysforbackdatedinvoice:'7',
                           selectedtimezone : this.props.userProfileDetail && this.props.userProfileDetail.timezoneoffsetvalue,
                       },
               errors : { },
               validated : false,
              passwordchecker : null,
           },
           personalDetail :
           {
             fields : {
                         contactnumber:'',
                         personalemailid : '',
                         panno:'',
                         bloodgroup : '',
                         dateofbirth: null,
                         address1:'',
                         address2:'',
                         city:''  ,
                         state: '',
                         country:profile && profile.country ? {label : profile.country,id : profile.countrycode,languagecode :profile.languagecode } : {},
                         countryArray : [],
                         stateArray : [],
                         pincode: '',
                         duration : [
                           {
                             starttime:null,
                             endtime:null,
                           },
                         ],
                           schedule : Weekdays,
                     },
             errors : { },
             validated : false,

         }
     };

      return cloneDeep(this.initialState);
   }

	 componentWillReceiveProps(newProps)
	 {
		 const	{editemployee, editMode} = newProps;
		 let {professionalDetail ,personalDetail} = this.state;

		 professionalDetail = professionalDetail.fields;
		 personalDetail = personalDetail.fields;

		 if(editMode && editemployee && editemployee.id && editemployee.id != this.state.professionalDetail.fields.id)
		 {
			 let title = Title.filter(value => value.name == editemployee.title)[0];
			 let gender = Gender.filter(value => value.name == editemployee.gender)[0];
			 let status = Status.filter(value => value.name == editemployee.status)[0];
			 let bloodgroup = Bloodgroup.filter(value => value.name == editemployee.bloodgroup)[0];

			 professionalDetail.id = editemployee.id;
			 professionalDetail.title =  title ? title.value : '1';
			 professionalDetail.firstname =  editemployee.firstname;
       professionalDetail.fathername =  editemployee.fathername || '';
			 professionalDetail.lastname = editemployee.lastname;
			 professionalDetail.gender = gender ? gender.value : '1';
			 professionalDetail.status =  status ? status.value : '1';
			 professionalDetail.emailid = editemployee.emailid;
			 professionalDetail.password = editemployee.password;
       professionalDetail.assignrole = editemployee.role ;
			 professionalDetail.specialization = editemployee.specialization ? JSON.parse(editemployee.specialization).toString() : '';
			 professionalDetail.mobile = editemployee.mobile || '';
			 professionalDetail.phone = editemployee.phone || '';
			 professionalDetail.dateofjoining = getLocalDate(editemployee.dateofjoining);
			 professionalDetail.dateofresigning =  getLocalDate(editemployee.dateofresigning);
			 professionalDetail.image = editemployee.image;
       professionalDetail.salary = editemployee.salary || 0;
       professionalDetail.ismembermobilevisible = editemployee.ismembermobilevisible;
       professionalDetail.ismemberemailidvisible = editemployee.ismemberemailidvisible;
       professionalDetail.isenquirymobilevisible = editemployee.isenquirymobilevisible;
       professionalDetail.isenquiryemailidvisible = editemployee.isenquiryemailidvisible;
       professionalDetail.selectedzone = editemployee.zoneid || '';
       professionalDetail.selectedbranch = editemployee.defaultbranchid || '';
       professionalDetail.associatewith = (editemployee.zoneid ? '2' : '1');
       professionalDetail.appaccess = editemployee.appaccessId ? editemployee.appaccessId.toString() : "1";
       professionalDetail.istrainer = editemployee.isTrainer;
       professionalDetail.enablecomplimentarysale = editemployee.enablecomplimentarysale;
       professionalDetail.enablediscount = editemployee.enablediscount;
       professionalDetail.enablediscountlimit = editemployee.enablediscountlimit;
       professionalDetail.maxdiscountperitem = editemployee.maxdiscountperitem || '';
       professionalDetail.maxdiscountperinvoice = editemployee.maxdiscountperinvoice || '';
       professionalDetail.maxmonthlylimit = editemployee.maxmonthlylimit || '';
       professionalDetail.isbiometriclogs = editemployee.isbiometriclogs;
       professionalDetail.complimentarysalelimit = editemployee.complimentarysalelimit || '';
       professionalDetail.enableonlinelisting = editemployee.enableonlinelisting;
       professionalDetail.enableonlinetraining = editemployee.enableonlinetraining || 0;
       professionalDetail.ptcommssion = editemployee.ptcommssion || '';
       professionalDetail.commissiontypeId = editemployee.ptcommissiontypeId ? editemployee.ptcommissiontypeId.toString() : '';
       professionalDetail.professionaldetails = editemployee.professionaldetails || '';
       if(professionalDetail.ptcommssion > 0 ){
         professionalDetail.enablecommission = 1;
       }
       professionalDetail.daysforbackdatedinvoice = editemployee.daysforbackdatedinvoice  || '0';
       professionalDetail.selectedtimezone = editemployee.timezoneoffsetvalue ? editemployee.timezoneoffsetvalue : (this.props.userProfileDetail && this.props.userProfileDetail.timezoneoffsetvalue ? this.props.userProfileDetail.timezoneoffsetvalue : '');

			 personalDetail.contactnumber = editemployee.contactnumber || '';
			 personalDetail.personalemailid = editemployee.personalemailid || '';
			 personalDetail.panno = editemployee.panno || '';
			 personalDetail.bloodgroup = bloodgroup ? bloodgroup.value : '';
			 personalDetail.dateofbirth = getLocalDate(editemployee.dateofbirth);
			 personalDetail.address1 = editemployee.address1 || '';
			 personalDetail.address2 = editemployee.address2 || '';
			 personalDetail.city = editemployee.city || '';
			 personalDetail.state = editemployee.state ? editemployee.state : '';

       if(editemployee.country)
       {
         personalDetail.country = {};
         personalDetail.country.id = editemployee.countrycode;
         personalDetail.country.label = editemployee.country;
         personalDetail.country.languagecode = editemployee.languagecode;
       }else {
         personalDetail.country = {};
       }

			 personalDetail.pincode = editemployee.pincode  || '';

       personalDetail.schedule = editemployee.schedule ?  editemployee.schedule :personalDetail.schedule ;
       personalDetail.duration = editemployee.shifttiming || personalDetail.duration;

       if(personalDetail.duration)
       {
         personalDetail.duration.map(x => {
           x.starttime = getLocalDate(x.starttime);
           x.endtime = getLocalDate(x.endtime);
          });
       }
       if(personalDetail.schedule)
       {
         personalDetail.schedule.map(x => {
           if(x.checked && x.duration && x.duration.length > 0)
           {
             x.duration.map(y => {
               y.starttime = getLocalDate(y.starttime);
               y.endtime = getLocalDate(y.endtime);
             })
           }
          });
       }

       this.state.personaldetail_old = cloneDeep(personalDetail);
       this.state.professionaldetail_old = cloneDeep(professionalDetail);

		 }
}




   componentWillUpdate(nextProps, nextState)
   {

     if((!nextProps.editMode && nextState.professionalDetail.fields.id != 0) || (this.props.addNewEmployeeModal && !nextProps.addNewEmployeeModal))
     {
        this.setState(this.getInitialState());
     }
   }


	 	onChangeProfessionalDetail(key,value, isRequired)
	 	{
	 		let error= isRequired ? required(value) : '';
      let {ismembermobilevisible, ismemberemailidvisible,isenquirymobilevisible,isenquiryemailidvisible,ptcommssion} = this.state.professionalDetail.fields;
      let {countryArray,country} = this.state.personalDetail.fields;
      let {passwordChecker} = this.state.professionalDetail;

      if(key == 'ismembermobilevisible' || key == 'ismemberemailidvisible' || key == 'isenquirymobilevisible' ||
      key == 'isenquiryemailidvisible' || key == 'istrainer' || key == 'enablecomplimentarysale' || key == 'enablediscount'
      || key == 'enablediscountlimit' || key == 'isbiometriclogs' || key == "enableonlinelisting" || key == "enableonlinetraining")
      {
        value = (value ? 1 : 0);
        if((key == 'enablediscount' && !value) || (key == 'enablediscountlimit' && !value))
        {
          if(key == 'enablediscount')
          {
            this.state.professionalDetail.fields.enablediscountlimit = 0;
          }
          this.state.professionalDetail.fields.maxdiscountperitem = '';
          this.state.professionalDetail.fields.maxdiscountperinvoice = '';
          this.state.professionalDetail.fields.maxmonthlylimit = '';
        }
        if(key == "enableonlinelisting" && !value){
            this.state.professionalDetail.fields.enableonlinetraining = 0;
        }
      }
      else if (key == "associatewith") {
        if(value == 1)
        {
          this.state.professionalDetail.fields.selectedzone = '';
        }
        else if(value == 2) {
          this.state.professionalDetail.fields.selectedbranch = '';
        }
      }
      else if (key == "status" && value == 2) {
          this.state.professionalDetail.fields.appaccess = '2';
      }
      else  if(key == "enablecommission"){
        value = value?1:0;
     }
     else if (key == "commissiontypeId" && value == "2") {
       ptcommssion = ptcommssion > 100 ? '' : ptcommssion;
     }
     else if (key == "ptcommssion") {
       ptcommssion = value;
     }


	     if(!error && value)
	     {
  	      if(key == 'emailid'){
  	   			error =email(value);
  	   		}
  	      else if(error == '' && key == 'password'){
             passwordChecker = strengthObject(strengthIndicator(value));
             value = restrictLength(value,30);
  	   			error =checkLength(value,{min:8,max:16});
  	   		}
          else if(key == 'mobile')
          {
            if(country.id)
            {
              error = checkMobileNo(value, country.id ,  country.label,country.languagecode);
            }
            else {
              error = checkMobileNo(value);
            }
            value = restrictLength(value,12);
          }
          else if(key == 'phone')
          {
            value = restrictLength(value,12);
          }
          else if(key == 'salary'){
            value = restrictLength(value,12);
  	   		}
          else if( key == 'firstname' || key == 'lastname' || key == 'fathername')
           {
               value = allowAlphaNumeric(value);
           }
           else if(key == "maxdiscountperitem" || key == "maxdiscountperinvoice" || key == "maxmonthlylimit")
           {
               value = restrictLength(value,7);
               error = error ? error : checkDecimal(value);
           }
           else if(key == "complimentarysalelimit")
           {
               value = restrictLength(value,7);
               value = convertToInt(value);
           }

           else  if(key == "ptcommssion")
            {
                value = restrictLength(value,6);
            }
        }
	 		this.setState({
	 			professionalDetail: {
	 				...this.state.professionalDetail,
	 				fields : {...this.state.professionalDetail.fields,
	 					[key] : value,
            ptcommssion : ptcommssion
	 				},
            passwordchecker : passwordChecker,
	 				errors : {...this.state.professionalDetail.errors,
	 					[key] : error
	 				}
	 			}
	 		});
	 	}


	 	onChangePersonalDetail(key,value, isRequired,index)
	 	{
	 		let error= isRequired ? required(value) : '';
      let {countryArray,country,schedule,duration} = this.state.personalDetail.fields;
      const fields = this.state.personalDetail.fields;

      if(key == 'country.label')
      {
        let country = this.state.personalDetail.fields.country;
        country.label = value;
        value = country;
        key = 'country';
      }
      else if(key == 'country')
      {
        if(fields.contactnumber)
        {
          this.state.personalDetail.errors.contactnumber = checkMobileNo(fields.contactnumber, value.id , value.label,value.languagecode);
        }
      }

	     if(!error && value)
	     {
	         if(key == 'personalemailid'){
	             error = email(value)
	         }
	         else if(key == 'contactnumber'){
             if(country.id)
             {
               error = checkMobileNo(value, country.id ,  country.label,country.languagecode);
             }
             else {
               error = checkMobileNo(value);
             }
              value = restrictLength(value,12);
	         }
	         else if(key == 'pincode'){
             if(country.id)
             {
               error = checkPincode(value,country.id ,  country.label);
             }
             else {
                error = checkPincode(value);
             }
             value = restrictLength(value,10);
	         }
	         else if(key == 'panno'){
	             error = checkLength(value,{min:8,max:16});
	         }
          else if(key == "schedule")
            {
              schedule.forEach(x => {

                if(x.value == value.id)
                {
                  if(value.key == "starttime")
                  {
                    if(x.duration[index].endtime && value.value > x.duration[index].endtime)
                    {
                       NotificationManager.error('Start Time should be less then End Time.');
                       return false;
                    }
                    if(x.duration[index-1])
                    {
                      if(x.duration[index-1].endtime && value < x.duration[index-1].endtime )
                      {
                        NotificationManager.error('Shift time is overlapping.');
                        return false;
                      }
                    }
                    x.duration[index][value.key] = value.value;
                  }
                  else if(value.key == "endtime")
                  {
                    if(x.duration[index].starttime && x.duration[index].starttime > value.value)
                    {
                       NotificationManager.error('End Time should not be less then Start Time.');
                       return false;
                    }
                    if(x.duration[index+1])
                    {
                      if(x.duration[index+1].starttime && value < x.duration[index+1].starttime )
                      {
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
                      x['duration'] = cloneDeep(this.state.personalDetail.fields.duration);

                    }
                  }
                }
              })
              value = schedule;
            }
          else if(key == "starttime")
                 {
                     if(duration[index].endtime && value > duration[index].endtime)
                         {
                            NotificationManager.error('Start Time should be less then End Time.');
                            return false;
                         }
                         if(duration[index-1])
                                 {
                                   if(duration[index-1].endtime && value < duration[index-1].endtime )
                                   {
                                     NotificationManager.error('Shift time is overlapping.');
                                     return false;
                                   }
                               }

                              duration[index].starttime = value;
                             schedule.forEach(x => {if(x.checked) {x.duration[index].starttime = value} });
                   }
                   else if(key == "endtime")
                         {
                           if(duration[index].starttime && duration[index].starttime > value)
                                 {
                                    NotificationManager.error('End Time should not be less then Start Time.');
                                    return false;
                                 }
                                 if(duration[index+1])
                                 {
                                   if(duration[index+1].starttime && value >= duration[index+1].starttime )
                                   {
                                     NotificationManager.error('Shift time is overlapping.');
                                     return false;
                                   }
                                 }
                               duration[index].endtime = value;
                               schedule.forEach(x => {if(x.checked) {x.duration[index].endtime = value } });
                       }
                     }

	 			this.setState({
	 				personalDetail: {
	 					...this.state.personalDetail,
	 					fields : {...this.state.personalDetail.fields,
	 						[key] : value
	 					},
	 					errors : {...this.state.personalDetail.errors,
	 						[key] :  error
	 					}
	 				}
	 			});
	 	}

	 	validate(ActiveIndex)
	 	{

	 		let errors = {};
      let {countryArray,country} = this.state.personalDetail.fields;

	 		if(ActiveIndex == 0)
	 		{

	 			const fields = this.state.professionalDetail.fields;

        if(this.props.clientProfileDetail.ishavemutliplebranch == 1 && fields.associatewith == 2)
        {
                errors.selectedzone = required(fields.selectedzone);
        }
        else if (this.props.clientProfileDetail.ishavemutliplebranch == 1 && fields.associatewith == 1) {
                errors.selectedbranch = required(fields.selectedbranch);
        }
	 			errors.firstname = required(fields.firstname);
	 			errors.lastname = required(fields.lastname);
	 			errors.emailid = required(fields.emailid);
	 			errors.emailid = (errors.emailid != '' ? errors.emailid : email(fields.emailid));
	 			errors.password = required(fields.password);
	 			errors.mobile = required(fields.mobile);
        errors.salary = required(fields.salary);
        errors.assignrole = required(fields.assignrole);
        errors.daysforbackdatedinvoice = required(fields.daysforbackdatedinvoice);
        errors.selectedtimezone = required(fields.selectedtimezone);

        if(fields.mobile != '')
        {
          if(country.id)
          {
            errors.mobile = checkMobileNo(fields.mobile, country.id ,  country.label,country.languagecode);
          }
          else {
            errors.mobile = checkMobileNo(fields.mobile);
          }
        }

        if(fields.enablediscountlimit == 1 && (!fields.maxdiscountperitem && !fields.maxdiscountperinvoice && !fields.maxmonthlylimit) )
        {
          fields.enablediscountlimit = 0;
        }
        else if (fields.enablediscountlimit == 1 ) {
          errors.maxdiscountperitem =errors.maxdiscountperitem ? errors.maxdiscountperitem : checkDecimal(fields.maxdiscountperitem);
          errors.maxdiscountperinvoice =errors.maxdiscountperinvoice ? errors.maxdiscountperinvoice : checkDecimal(fields.maxdiscountperinvoice);
          errors.maxmonthlylimit =errors.maxmonthlylimit ? errors.maxmonthlylimit : checkDecimal(fields.maxmonthlylimit);
        }
        if(fields.enablecommission == 1){
             errors.ptcommssion = required(fields.ptcommssion);
             errors.commissiontypeId = required(fields.commissiontypeId);
             if(fields.commissiontypeId == 2 && fields.ptcommssion && fields.ptcommssion > 100 ){
                 errors.ptcommssion = "Percentage Not more than 100";
             }
          }

	 			let validated = checkError(errors);

  	 		this.setState({
  	 				 professionalDetail: {	...this.state.professionalDetail,
  	 					 	errors : errors, validated : validated
  	 				 }
  	 		});

	 			 return validated;
	 		}

	 }

	 	changeActiveIndex(value)
	 	{
	     const {activeIndex} = this.state;
	 		if(activeIndex > value)
	 		{
	       this.setState({activeIndex : value});
	 		}
	 		else if(this.validate(activeIndex))
	 		{
	       this.setState({activeIndex : value});
	 		}
	 	}

	 	onSaveEmployee()
	 	{
	     const {professionalDetail, personalDetail ,personaldetail_old ,professionaldetail_old} = this.state;
       const	{editemployee, editMode,clientProfileDetail,userProfileDetail} = this.props;

      if(!this.validate(0))
      {
        this.changeActiveIndex(0);
      }
	 		else
	 		{
        if(!editMode || (editemployee && ((JSON.stringify(professionaldetail_old) != JSON.stringify(professionalDetail.fields)) || (JSON.stringify(personaldetail_old) != JSON.stringify(personalDetail.fields)))))
         {
            const professionaldetail  = professionalDetail.fields;
            const  personaldetail = personalDetail.fields;
            let member = {};
            if(!professionaldetail.enablecommission){
             professionaldetail.ptcommssion = '';
             professionaldetail.commissiontypeId = '';
           }
            member.userid = clientProfileDetail.id;
            member.name = professionalDetail.fields.firstname +  " " + professionalDetail.fields.lastname;
            member.oldStatus = editemployee && editemployee.statusId;
            let reloadrequired = false;
            if(editemployee && userProfileDetail.encryptid == professionalDetail.fields.id && professionaldetail_old.selectedtimezone != professionalDetail.fields.selectedtimezone)
            {
              reloadrequired = true;
            }
            if(clientProfileDetail.biometriclist && clientProfileDetail.biometriclist.length > 0){
            member.SerialNumber = clientProfileDetail.biometriclist.map(x => x.serialnumber);
          }
            this.props.saveEmployee({professionaldetail, personaldetail,member,reloadrequired});
          }
       else {
           NotificationManager.error('No changes detected');
        }
	 		}
	 	}
    onClose()
	 	{
      this.setState(this.getInitialState());
    	this.props.clsAddNewEmployeeModel();
      if(this.props.clientProfileDetail && this.props.clientProfileDetail.clienttypeId == 2)
      {
        this.props.push('/app/dashboard');
      }
      else {
        this.props.push('/app/employee-management');
      }
	 	}

    onAdd = () => {
          let {duration ,schedule} = this.state.personalDetail.fields;

            if(duration.length < 12)
            {
              duration.push(cloneDeep(duration[duration.length - 1]));
              let lastObject = duration[duration.length - 1];
              Object.keys(lastObject).forEach(key => lastObject[key] = null);

              schedule.forEach(x => {if(x.checked) {x.duration = cloneDeep(duration) } });
              //schedule.forEach(x => {x.duration = cloneDeep(duration) });

              this.setState({
                personalDetail: {
                  ...this.state.personalDetail,
                  fields : {...this.state.personalDetail.fields,
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
         let {duration,schedule} = this.state.personalDetail.fields;
         if(duration.length > 1)
         {
           duration.splice( duration.indexOf(data), 1 );

           schedule.forEach(x => {if(x.checked) {x.duration = cloneDeep(duration) } });

           this.setState({
             personalDetail: {
               ...this.state.personalDetail,
               fields : {...this.state.personalDetail.fields,
                 duration : duration,
               },
             }
           });

         }
       }


	render() {

	 const	{ addNewEmployeeModal, disabled , dialogLoading , editMode , editemployee,rolelist, clientProfileDetail,zonelist,branchlist,sessiontypelist,userProfileDetail,timezonelist} = this.props;
 	 const {professionalDetail, personalDetail,activeIndex } = this.state;


		return (
			<Dialog fullScreen open={addNewEmployeeModal} onClose={() =>this.onClose()} >
					<AppBar position="static" className="bg-primary">
							<Toolbar className = {isMobile ? "px-0" : ""}>
									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-100 mb-0 ">{ editMode || professionalDetail.fields.id != 0 ? 'UPDATE ' : 'ADD '  } EMPLOYEE</h5>



                 <Button onClick={() =>this.onSaveEmployee()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>

						</Toolbar>
				</AppBar>
				{((editMode && !editemployee) || dialogLoading ) &&
					<RctSectionLoader />
				}
				<PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>

								{activeIndex === 0 && <TabContainer><ProfessionalDetail fields = {professionalDetail.fields} errors ={professionalDetail.errors} isMultipleBranch = {clientProfileDetail.ishavemutliplebranch}
                rolelist={rolelist} zonelist={zonelist} branchlist={branchlist} passwordchecker={professionalDetail.passwordchecker}  onChange = {this.onChangeProfessionalDetail.bind(this)} sessiontypelist = {sessiontypelist}
                userProfileDetail = {userProfileDetail} clientProfileDetail = {clientProfileDetail}
                timezonelist = {timezonelist} /> </TabContainer>}
								{activeIndex === 1 && <TabContainer>  <PersonalDetail fields = {personalDetail.fields} errors ={personalDetail.errors}  onChange = {this.onChangePersonalDetail.bind(this)}
                onAdd = {this.onAdd.bind(this)} onRemove = {this.onRemove.bind(this)} /> </TabContainer>}
				</PerfectScrollbar>
			</Dialog>

	);
  }
  }
const mapStateToProps = ({ employeeManagementReducer, settings }) => {
	const { addNewEmployeeModal, disabled, dialogLoading, editemployee, editMode,rolelist,zonelist,branchlist,timezonelist } =  employeeManagementReducer;
  const {clientProfileDetail,userProfileDetail, sessiontypelist} = settings;
  return { addNewEmployeeModal, disabled , dialogLoading, editemployee, editMode,rolelist, clientProfileDetail,zonelist,userProfileDetail,branchlist,sessiontypelist,timezonelist}
}

export default connect(mapStateToProps,{
	clsAddNewEmployeeModel, saveEmployee, push })(AddEmployee);
