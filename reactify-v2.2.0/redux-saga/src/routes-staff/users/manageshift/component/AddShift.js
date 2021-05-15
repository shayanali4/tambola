/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewShiftModel, saveShiftConfiguration } from 'Actions';

import {getLocalDate, getFormtedDate, checkError, cloneDeep} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import Shiftdetail from './Shiftdetail';
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
import {required,email,checkLength,checkMobileNo,checkPincode,checkAlpha,restrictLength,allowAlphaNumeric,checkDecimal,convertToInt} from 'Validations';
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

class AddShift extends PureComponent {
  constructor(props) {
     super(props);
     Weekdays.forEach(x => x.checked = false);
     this.state = this.getInitialState();
  }
   getInitialState()
   {
     this.initialState = {
             activeIndex : 0,
             shiftDetail:
             {
               fields : {
                           id :0,
                           schedule : Weekdays,
                           shiftname : '',
                           duration : [
                             {
                               starttime:null,
                               endtime:null,
                             }
                           ],
                           shifttype : '',
                       },
               errors : { },
               validated : false,
           },
     };

      return cloneDeep(this.initialState);
   }

	 componentWillReceiveProps(newProps)
	 {
		 const	{editshift, editMode} = newProps;
		 let {shiftDetail} = this.state;

		 shiftDetail = shiftDetail.fields;

		 if(editMode && editshift && editshift.id && editshift.id != this.state.shiftDetail.fields.id)
		 {

			 shiftDetail.id = editshift.id;
			 shiftDetail.shiftname =  editshift.shiftname;
       shiftDetail.schedule =  editshift.shiftschedule || [];
			 shiftDetail.duration = editshift.shiftduration || [];
       shiftDetail.shifttype = editshift.shifttypeId ? editshift.shifttypeId.toString() : '';

       this.state.shiftdetail_old = cloneDeep(shiftDetail);

		 }
}

   componentWillUpdate(nextProps, nextState)
   {

     if((!nextProps.editMode && nextState.shiftDetail.fields.id != 0) || (this.props.addNewShiftModal && !nextProps.addNewShiftModal))
     {
        this.setState(this.getInitialState());
     }
   }


   onChangeDuration(key, value, isRequired , index)
   {
     let error= isRequired ? required(value) : '';
       let {duration,schedule} = this.state.shiftDetail.fields;

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
                 x['duration'] = cloneDeep(this.state.shiftDetail.fields.duration);

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
           if(duration[index+1].starttime && value < duration[index+1].starttime )
           {
             NotificationManager.error('Shift time is overlapping.');
             return false;
           }
         }

           duration[index].endtime = value;

          schedule.forEach(x => {if(x.checked) {x.duration[index].endtime = value } });

       }


       this.setState({
         shiftDetail: {
           ...this.state.shiftDetail,
           fields : {...this.state.shiftDetail.fields,
             [key] : value,
             duration : duration,
           },
           errors : {...this.state.shiftDetail.errors,
             [key] :  error
           }
         }
       });

   }

	 	validate()
	 	{

	 		let errors = {};

      const fields = this.state.shiftDetail.fields;

      if(fields.duration.filter(x => (x.starttime == '') || ( x.endtime == '')).length > 0)
       {
          NotificationManager.error("Please enter duration");
          errors.duration = "Please enter duration";
       }

       if(fields.schedule.duration && fields.schedule.duration.filter(x => (x.starttime == '') || ( x.endtime == '')).length > 0)
        {
           NotificationManager.error("Please enter duration");
           errors.schedule = "Please enter duration";
        }

	 			errors.shiftname = required(fields.shiftname);
        errors.shifttype = required(fields.shifttype);

	 			let validated = checkError(errors);

  	 		this.setState({
  	 				 shiftDetail: {	...this.state.shiftDetail,
  	 					 	errors : errors, validated : validated
  	 				 }
  	 		});

	 			 return validated;

	 }

	 	onSaveShift()
	 	{
	     const {shiftDetail ,shiftdetail_old} = this.state;
       const	{editshift, editMode,clientProfileDetail} = this.props;

      if(this.validate())
	 		{
        if(!editMode || (editshift && ((JSON.stringify(shiftdetail_old) != JSON.stringify(shiftDetail.fields)) )))
         {
            const shiftdetail  = shiftDetail.fields;
            this.props.saveShiftConfiguration({shiftdetail});
          }
       else {
           NotificationManager.error('No changes detected');
        }
	 		}
	 	}
    onClose()
	 	{
      this.setState(this.getInitialState());
    	this.props.clsAddNewShiftModel();
      this.props.push('/app/users/manageshift');
	 	}

    onAdd = () => {
          let {duration ,schedule} = this.state.shiftDetail.fields;

            if(duration.length < 12)
            {
              duration.push(cloneDeep(duration[duration.length - 1]));
              let lastObject = duration[duration.length - 1];
              Object.keys(lastObject).forEach(key => lastObject[key] = null);

              schedule.forEach(x => {if(x.checked) {x.duration = cloneDeep(duration) } });
              //schedule.forEach(x => {x.duration = cloneDeep(duration) });

              this.setState({
                shiftDetail: {
                  ...this.state.shiftDetail,
                  fields : {...this.state.shiftDetail.fields,
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
         let {duration,schedule} = this.state.shiftDetail.fields;
         if(duration.length > 1)
         {
           duration.splice( duration.indexOf(data), 1 );

           schedule.forEach(x => {if(x.checked) {x.duration = cloneDeep(duration) } });

           this.setState({
             shiftDetail: {
               ...this.state.shiftDetail,
               fields : {...this.state.shiftDetail.fields,
                 duration : duration,
               },
             }
           });

         }
       }

	render() {

	 const	{ addNewShiftModal, disabled , dialogLoading , editMode , editshift, clientProfileDetail} = this.props;
 	 const {shiftDetail,activeIndex } = this.state;


		return (
			<Dialog fullScreen open={addNewShiftModal} onClose={() =>this.onClose()} >
					<AppBar position="static" className="bg-primary">
							<Toolbar className = {isMobile ? "px-0" : ""}>
									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-50 mb-0 ">{ editMode || shiftDetail.fields.id != 0 ? 'UPDATE ' : 'ADD '  } SHIFT</h5>

                  <div className="w-50 mb-0">
                      <Tabs
                            value={activeIndex}
                            onChange={(e, value) => this.changeActiveIndex(value)}
                            variant = "fullWidth"
                            indicatorColor="secondary" >


                      </Tabs>
                  </div>

                 <Button onClick={() =>this.onSaveShift()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>

						</Toolbar>
				</AppBar>
				{((editMode && !editshift) || dialogLoading ) &&
					<RctSectionLoader />
				}
				<PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>

								{activeIndex === 0 && <TabContainer><Shiftdetail fields = {shiftDetail.fields} errors ={shiftDetail.errors}  onChange = {this.onChangeDuration.bind(this)}
                onAdd = {this.onAdd.bind(this)} onRemove = {this.onRemove.bind(this)}/> </TabContainer>}

				</PerfectScrollbar>
			</Dialog>

	);
  }
  }
const mapStateToProps = ({ employeeShiftReducer, settings }) => {
	const { addNewShiftModal, disabled, dialogLoading, editshift, editMode } =  employeeShiftReducer;
  const {clientProfileDetail,userProfileDetail} = settings;
  return { addNewShiftModal, disabled , dialogLoading, editshift, editMode, clientProfileDetail,userProfileDetail}
}

export default connect(mapStateToProps,{
	clsAddNewShiftModel, saveShiftConfiguration, push })(AddShift);
