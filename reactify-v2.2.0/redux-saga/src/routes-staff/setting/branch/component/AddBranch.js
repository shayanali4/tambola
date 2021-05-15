/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewBranchModel, saveBranch ,onCancelAdvanceBookingofMember} from 'Actions';

import Weekdays from 'Assets/data/weekdays';
import Ownership  from 'Assets/data/ownership';

import {getLocalTime, checkError, cloneDeep ,getFormtedFromTime,getFormtedTimeFromJsonDate,setDateTime,getLocalDate} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import BranchDetail from './branchDetail';

import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import Button from '@material-ui/core/Button';
import {required,email,checkLength,checkAlpha,restrictLength} from 'Validations';
import { NotificationManager } from 'react-notifications';
import { push } from 'connected-react-router';

import {isMobile} from 'react-device-detect';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import SlotDuration from 'Assets/data/slotduration';
import moment from 'moment';
import RestDuration from 'Assets/data/restduration';


import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddBranch extends PureComponent {
	constructor(props) {
     super(props);
        Weekdays.forEach(x => x.checked = true);
		   this.state = this.getInitialState();
   }

   getInitialState()
   {
     this.initialState = {
             activeIndex : 0,
             changeScheduleconfirmationDialog : false,
             branchData :
             {
               fields : {
                   id : 0,
                  branchname:'',
                  description:'',
                  address1:'',
                  address2:'',
                  pincode: '',
                  latitude:'',
                  longitude:'',
                  carpetarea:'',
                  ownership:'1',
                  manager:'',
                  duration : [
                    {
                      starttime:null,
                      endtime:null,
                    }
                  ],
                  schedule : Weekdays,
                  gmapaddress: '',
                  city : '',
                  state: '',
                  country : '',
                  phoneno : '',
                  isaddressSame : 0,
                  getcurrentlocation : 0,
                  gymaccessslot : 0,
                  slotduration : 1,
                  gapbetweentwogymaccessslot : '1',
                  slotmaxoccupancy : '',
                  slotmaxdays : 7,
                  countryArray : [],
                  stateArray : [],
                  ptslotduration : 1,
                  ptslotmaxdays : 7,
                  ptslotmaxoccupancy : 1,
                  cancelgymaccessslothour : '',
                  cancelptslothour : '',
                  cancelclassslothour : '',
                  classmaxdays : 7,
                  restbetweentwoptslot : '1'
                },
                errors : { },
               validated : false,
           },
    };
      return cloneDeep(this.initialState);
   }



	 componentWillReceiveProps(newProps)
	 {
		 const	{editbranch,editMode} = newProps;
		 let {branchData} = this.state;

     branchData =branchData. fields;

		 if(editMode && editbranch && editbranch.id && editbranch.id != this.state.branchData.fields.id)
		 {
       let ownership = Ownership.filter(value => value.name == editbranch.ownership)[0];

       branchData.id = editbranch.id;
       branchData.branchname =  editbranch.branchname;
       branchData.description =  editbranch.description;
       branchData.address1 =  editbranch.address1;
       branchData.address2 =  editbranch.address2;
       branchData.pincode =  editbranch.pincode;
       branchData.latitude =  editbranch.latitude;
       branchData.longitude =  editbranch.longitude;
       branchData.carpetarea =  editbranch.carpetarea;
       branchData.ownership = ownership ? ownership.value : '1';
       branchData.manager =  editbranch.manager ? parseInt(editbranch.manager) : '';
       // branchData.starttime =  getLocalTime(getFormtedFromTime(editbranch.starttime,'HH:mm:ss'));
       // branchData.endtime = getLocalTime(getFormtedFromTime(editbranch.endtime,'HH:mm:ss'));
       // branchData.starttime1 = getLocalTime(getFormtedFromTime(editbranch.starttime1,'HH:mm:ss'));
       // branchData.endtime1 = getLocalTime(getFormtedFromTime(editbranch.endtime1,'HH:mm:ss'));
       branchData.duration = editbranch.shifttiming || branchData.duration;
       branchData.schedule = editbranch.timing ?  editbranch.timing :branchData.schedule ;
       branchData.phoneno =  editbranch.phone ? editbranch.phone : '';
       branchData.city =  editbranch.city;
       branchData.state =  editbranch.state;
       branchData.country =  editbranch.country;
       branchData.gmapaddress =  editbranch.gmapaddress ? editbranch.gmapaddress : '';
       branchData.gymaccessslot = editbranch.gymaccessslot || 0;
       branchData.slotduration = editbranch.slotdurationId ? editbranch.slotdurationId : 1 ;
       branchData.slotmaxoccupancy = editbranch.slotmaxoccupancy ? editbranch.slotmaxoccupancy : '';
       branchData.slotmaxdays = editbranch.slotmaxdays ;
       editbranch.ptslotdetail = editbranch.ptslotdetail ? JSON.parse(editbranch.ptslotdetail) : null;
        if(editbranch.ptslotdetail){
            branchData.ptslotduration = editbranch.ptslotdetail.ptslotdurationId || 1 ;
            branchData.ptslotmaxdays = editbranch.ptslotdetail.ptslotmaxdays ;
            branchData.ptslotmaxoccupancy = editbranch.ptslotdetail.ptslotmaxoccupancy || 1;
            branchData.restbetweentwoptslot = editbranch.ptslotdetail.restbetweentwoptslotId || '1' ;
       }
       branchData.cancelgymaccessslothour = editbranch.cancelgymaccessslothour || '';
       branchData.cancelptslothour = editbranch.cancelptslothour || '';
       branchData.cancelclassslothour = editbranch.cancelclassslothour || '';
       branchData.classmaxdays = editbranch.classmaxdays || '' ;
       branchData.gapbetweentwogymaccessslot = editbranch.gapbetweentwogymaccessslotId || '1' ;

       branchData.schedule.map(x => {
         x.starttime = getLocalDate(x.starttime);
         x.endtime = getLocalDate(x.endtime);
         x.starttime1 = getLocalDate(x.starttime1);
         x.endtime1 = getLocalDate(x.endtime1);
         x.duration.map(y => {
           y.starttime = getLocalDate(y.starttime);
           y.endtime = getLocalDate(y.endtime);
         })
        });

        this.state.branch_old = cloneDeep(branchData);
		 }
	 }

   componentWillUpdate(nextProps, nextState)
   {
     if((!nextProps.editMode && nextState.branchData.fields.id != 0) || (this.props.addNewBranchModal && !nextProps.addNewBranchModal))
     {
        this.setState(this.getInitialState());
     }
   }


   onChangeZone(key,value, isRequired, index)
   {
     const {editbranch} = this.props;
     let error= isRequired ? required(value) : '';
     let {schedule,duration} = this.state.branchData.fields;
     let {fields} = this.state.branchData;
     if(key == "isaddressSame")
     {
       value = value?1:0;
       this.getAddressvalues(this.state.branchData.fields.gmapaddress,value);
     }
     else if (key == "getcurrentlocation")
      {
        value = value?1:0;
        this.getCurrentLocation(value);
      }
     else {
      if(key == "schedule")
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
                 x['duration'] = cloneDeep(this.state.branchData.fields.duration);

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

       else if(key == 'phoneno')
       {
         value = restrictLength(value,12);
       }
       else if(key == 'pincode')
       {
         value = restrictLength(value,10);
       }
       else if (key == "gymaccessslot") {
        value = value?1:0;
       }


       this.setState({
         branchData: {
           ...this.state.branchData,
           fields : {...this.state.branchData.fields,
             [key] : value,
             schedule : schedule
           },
           errors : {...this.state.branchData.errors,
             [key] : error
           }
         },
       });
     }

   }

	 	validate()
	 	{
	 		let errors = {};

        const fields = this.state.branchData.fields;

        errors.branchname = required(fields.branchname);
        //errors.zonename = required(fields.zonename);
        errors.gmapaddress = required(fields.gmapaddress);
        errors.phoneno = required(fields.phoneno);

        errors.address1 = required(fields.address1);
        errors.address2 = required(fields.address2);
        errors.city = required(fields.city);
        errors.state = required(fields.state);
        errors.country = required(fields.country);
        errors.pincode = required(fields.pincode);

        if(fields.gymaccessslot == 1){
          errors.slotduration = required(fields.slotduration);
          errors.slotmaxoccupancy = required(fields.slotmaxoccupancy);
          errors.slotmaxdays = required(fields.slotmaxdays);
        }
       //  if((fields.starttime && !fields.endtime) || (!fields.starttime && fields.endtime)){
       //    if(!fields.endtime){
       //      errors.endtime = required(fields.endtime);
       //    }
       //    else if(!fields.starttime){
       //      errors.starttime = required(fields.starttime);
       //    }
       // }
       // else if((fields.starttime1 && !fields.endtime1) || (!fields.starttime1 && fields.endtime1)){
       //       if(!fields.endtime1){
       //         errors.endtime1 = required(fields.endtime1);
       //       }
       //       else if(!fields.starttime1){
       //         errors.starttime1 = required(fields.starttime1);
       //       }
       //  }
        // if(fields.duration.filter(x => (x.starttime == '' || x.starttime == null) || ( x.endtime == '' || x.endtime == null)).length > 0)
        //  {
        //     NotificationManager.error("Please enter shift");
        //     errors.duration = "Please enter shift";
        //  }


        errors.ptslotduration = required(fields.ptslotduration);
        errors.ptslotmaxdays = required(fields.ptslotmaxdays);
        errors.classmaxdays = required(fields.classmaxdays);

         let validated = checkError(errors);

         this.setState({
           branchData: {	...this.state.branchData,
              errors : errors, validated : validated
           }
         });
	 			 return validated;

	 }

	 	onSaveBranch()
	 	{
      const {branchData,branch_old} = this.state;
      const	{editbranch,editMode} = this.props;
      const {clientProfileDetail} = this.props;

      if(this.validate())
      {
        if(!editMode || (editbranch && (JSON.stringify(branch_old) != JSON.stringify(branchData.fields))))
         {

           if(branchData.fields.schedule.length > 0 && branchData.fields.schedule.filter(x => (x.starttime && !x.endtime) || (!x.starttime && x.endtime) ||  (x.starttime1 && !x.endtime1) || (!x.starttime1 && x.endtime1)).length > 0){
                         let daysname  = branchData.fields.schedule.filter(x => (x.starttime && !x.endtime) || (!x.starttime && x.endtime) ||  (x.starttime1 && !x.endtime1) || (!x.starttime1 && x.endtime1))[0].name;
                          NotificationManager.error('In ' + daysname + ' please insert both time.')
            }

           else if(branchData.fields.schedule.length > 0 && branchData.fields.schedule.filter(x => x.starttime1 && x.endtime && moment(new Date(x.starttime1)) < moment(new Date(x.endtime))).length > 0){
                             let errordaysname  = branchData.fields.schedule.filter(x => moment(new Date(x.starttime1)) < moment(new Date(x.endtime)))[0].name;
                              NotificationManager.error('In ' + errordaysname + ' shift 2 opening time should be greater then shift 1 closing time.')
                }
               else{
                          if(editMode && editbranch && clientProfileDetail && clientProfileDetail.serviceprovidedId != 1 &&  JSON.stringify(branch_old.schedule) !=  JSON.stringify(branchData.fields.schedule))
                          {
                            this.state.changeScheduleconfirmationDialog = true;
                          }
                          else{
                            const branch  = branchData.fields;
                            branch.ptslotdurationlabel = SlotDuration.filter(x => x.value == branch.ptslotduration)[0].name;
                            branch.restbetweentwoptslotlabel = RestDuration.filter(x => x.value == branch.restbetweentwoptslot)[0].name;
                            this.props.saveBranch({branch});
                          }
              }
         }
         else {
           NotificationManager.error('No changes detected');
          }
	 		}
  }

    onClose()
	 	{
      this.setState(this.getInitialState());
	 		this.props.clsAddNewBranchModel();
      this.props.push('/app/setting/branch');
	 	}

    handleChange = address => {
      this.setState({
        branchData: {
          ...this.state.branchData,
          fields : {...this.state.branchData.fields,
            gmapaddress : address
          }
        }
      });
  };

  handleSelect = address => {
    this.setState({
      branchData: {
        ...this.state.branchData,
        fields : {...this.state.branchData.fields,
          gmapaddress: address
        }
      }
    });

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        this.setState({
          branchData: {
            ...this.state.branchData,
            fields : {...this.state.branchData.fields,
              latitude: lat,longitude: lng  }}
        });

      })
      .catch(error => console.error('Error', error));


  };

  getAddressvalues(address,value)
  {
    //let address = this.state.branchData.fields.gmapaddress;
    if(value)
    {
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
         address2 = newarray[newarray.length - 1];
      }
      // let address1 = arraylength > 3 ? addressarray.slice(0, -3) : '';
      // let address2 = '';
      // if(arraylength > 2)
      //   {
      //     address1 = address1
      //   }
        this.setState({
          branchData: {
            ...this.state.branchData,
            fields : {...this.state.branchData.fields,
              city : city,state: state,country: country ,address1 : address1, address2 :address2,isaddressSame : 1 }}
        });
    }
    else {
      this.setState({
        branchData: {
          ...this.state.branchData,
          fields : {...this.state.branchData.fields,
            isaddressSame : 0 }}
      });
    }
  }


  getCurrentLocation(value)
  {
    if(value)
    {
      window.navigator.geolocation.getCurrentPosition(
          success =>{
            this.setState({
              branchData: {
                ...this.state.branchData,
                fields : {...this.state.branchData.fields,
                  getcurrentlocation : 1,latitude : success.coords.latitude,longitude: success.coords.longitude}}
            });
            },
            () => {
                alert('Position could not be determined.');
            }
      );
    }
    else {

      let oldlatitude = this.state.branch_old ? this.state.branch_old.latitude : '';
      let oldlongitude = this.state.branch_old ? this.state.branch_old.longitude : '';

      this.setState({
        branchData: {
          ...this.state.branchData,
          fields : {...this.state.branchData.fields,
             getcurrentlocation : 0,latitude : oldlatitude, longitude : oldlongitude}}
        });
    }
  }
  onConfirmWithoutCancelAdvanceBooking(){
        const {branchData} = this.state;
        this.setState({
        changeScheduleconfirmationDialog : false,
      });
      const branch  = branchData.fields;
      branch.restbetweentwoptslotlabel = RestDuration.filter(x => x.value == branch.restbetweentwoptslot)[0].name;
      branch.ptslotdurationlabel = SlotDuration.filter(x => x.value == branch.ptslotduration)[0].name;
      this.props.saveBranch({branch});
  }
  onCancelAdvanceBookingConfirmationDialog(){
              this.setState({
                    changeScheduleconfirmationDialog : false,
                     });
  }
  onConfirmCancelAdvanceBooking(){
      const {branchData} = this.state;
      this.props.onCancelAdvanceBookingofMember({branchid : this.props.editbranch.id});
      this.setState({
      changeScheduleconfirmationDialog : false,
    });
    const branch  = branchData.fields;
    branch.restbetweentwoptslotlabel = RestDuration.filter(x => x.value == branch.restbetweentwoptslot)[0].name;
    branch.ptslotdurationlabel = SlotDuration.filter(x => x.value == branch.ptslotduration)[0].name;
    this.props.saveBranch({branch});
  }

  onAdd = () => {
        let {duration ,schedule} = this.state.branchData.fields;

          if(duration.length < 12)
          {
            duration.push(cloneDeep(duration[duration.length - 1]));
            let lastObject = duration[duration.length - 1];
            Object.keys(lastObject).forEach(key => lastObject[key] = null);

            schedule.forEach(x => {if(x.checked) {x.duration = cloneDeep(duration) } });
            //schedule.forEach(x => {x.duration = cloneDeep(duration) });

            this.setState({
              branchData: {
                ...this.state.branchData,
                fields : {...this.state.branchData.fields,
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
       let {duration,schedule} = this.state.branchData.fields;
       if(duration.length > 1)
       {
         duration.splice( duration.indexOf(data), 1 );

         schedule.forEach(x => {if(x.checked) {x.duration = cloneDeep(duration) } });

         this.setState({
           branchData: {
             ...this.state.branchData,
             fields : {...this.state.branchData.fields,
               duration : duration,
             },
           }
         });

       }
     }


	render() {

	 const	{ addNewBranchModal, disabled , dialogLoading , editMode , editbranch,employeeList,clientProfileDetail} = this.props;
 	 const {branchData,activeIndex,changeScheduleconfirmationDialog} = this.state;

		return (
			<Dialog fullScreen open={addNewBranchModal} onClose={() =>this.onClose()} >
					<AppBar position="static" className="bg-primary">
							<Toolbar>
									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-50 mb-0 ">{ editMode || branchData.fields.id != 0 ? 'UPDATE ' : 'ADD '  } BRANCH</h5>
									<div className="w-50 mb-0">
											<Tabs
														value={activeIndex}
														onChange={(e, value) => this.changeActiveIndex(value)}
														variant = "fullWidth"
														indicatorColor="secondary" >


											</Tabs>
								 </div>

                 <Button onClick={() =>this.onSaveBranch()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>

						</Toolbar>
				</AppBar>
				{((editMode && !editbranch) || dialogLoading ) &&
					<RctSectionLoader />
				}
	<PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>
        {activeIndex === 0 && <TabContainer> <BranchDetail fields = {branchData.fields} errors ={branchData.errors} employeeList={employeeList} onChange = { this.onChangeZone.bind(this)}
          handleChange = { this.handleChange.bind(this)}  handleSelect = { this.handleSelect.bind(this)} clientProfileDetail ={clientProfileDetail}
          onAdd = {this.onAdd.bind(this)} onRemove = {this.onRemove.bind(this)}/>  </TabContainer>}

				</PerfectScrollbar>

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
			</Dialog>


	);
  }
  }
const mapStateToProps = ({ branchReducer,settings }) => {
	const { addNewBranchModal, disabled, dialogLoading, editbranch, editMode,employeeList } =  branchReducer;
  const { clientProfileDetail} = settings;
  return { addNewBranchModal, disabled , dialogLoading, editbranch, editMode,employeeList,clientProfileDetail}
}

export default connect(mapStateToProps,{
	 clsAddNewBranchModel, saveBranch,onCancelAdvanceBookingofMember,push})(AddBranch);
