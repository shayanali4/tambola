/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import  Status from 'Assets/data/status';
import  ServiceValidity from 'Assets/data/servicevalidity';
import  Serviceunit from 'Assets/data/measurementunit';
import ServiceType from 'Assets/data/servicetype';

import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate, checkError,cloneDeep,getTaxValues,getCurrency,getFormtedFromTime} from 'Helpers/helpers';
import {convertSecToHour} from 'Helpers/unitconversion';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import classnames from 'classnames';
import DialogTitle from '@material-ui/core/DialogTitle';
import { push } from 'connected-react-router';
import {isMobile} from 'react-device-detect';
import { RctCard } from 'Components/RctCard';
import TaxType  from 'Assets/data/taxtype';
import DateTimePicker from 'Routes/advance-ui-components/dateTime-picker/components/DateTime';
import { NotificationManager } from 'react-notifications';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { saveEmployeeattendance} from 'Actions';

class EditAttendance extends Component {
	constructor(props) {
		 super(props);
			 this.state = this.getInitialState();
	 }

	 getInitialState()
	 {
		 this.initialState = {
       attendanceDetail : {
       intime : null,
       outtime : null,
       difference : null
     }
	};

			return cloneDeep(this.initialState);
	 }
   componentDidMount(){
     const	{data} = this.props;
     let	{attendanceDetail} = this.state;
     if(data){
       this.setState({
         attendanceDetail: {
           'intime' : getLocalDate(data.intime) ,
           'outtime' : getLocalDate(data.outtime),
           'difference': convertSecToHour(data.difference * 60)
         }
       });
     }
  }
  onChange(key,value){
    let {attendanceDetail} = this.state;
    let {difference,intime,outtime} = attendanceDetail;
    if(key == 'intime'){
      if(attendanceDetail.outtime && value)
      {
				if(value  < attendanceDetail.outtime)
				{
		        let diff =  Math.abs(getLocalDate(value) - new Date( attendanceDetail.outtime));
		        diff = convertSecToHour((Math.floor((diff/1000)/60)) * 60);

								difference = diff;
							  intime = value;

				 }
				 else{
					 NotificationManager.error('Check-in time should be less than Check-out time.');
				 }
       }
			 else {
			 	intime = value;
			 }
    }
    else if(key == 'outtime'){
			if(attendanceDetail.intime && value)
			{
		      if(value  > attendanceDetail.intime)
		      {
		        let diff =  Math.abs(new Date( attendanceDetail.intime) - getLocalDate(value));
		        diff = convertSecToHour((Math.floor((diff/1000)/60)) * 60);

							difference = diff;
							outtime = value;

		       }
			     else{
			       NotificationManager.error('Check-out time should be more than Check-in time.');
			     }
			 }
			 else {
				outtime = value;
			 }
    }
    this.setState({
      attendanceDetail: {
        ...this.state.attendanceDetail,
        'intime' : intime,
        'outtime' : outtime,
       'difference' : difference
      }
    });
  }
	onSave()
	{
		const {attendanceDetail} = this.state;
		const {data} = this.props;

		if(this.validate()){
			 attendanceDetail.id = data.id;
			 attendanceDetail.usercode = data.employeecode;
			 this.props.saveEmployeeattendance(attendanceDetail);
			 this.props.onClose();
		 }
	 }

	 validate()
 	 {
 		 	let errors = {};
 		 	const {attendanceDetail} = this.state;

 			if(!attendanceDetail.intime || (attendanceDetail.outtime && !attendanceDetail.intime))
 			{
 				NotificationManager.error('Check-in date is required');
 				errors.intime = 'Required';
 			}

 			if(attendanceDetail.intime && attendanceDetail.outtime && attendanceDetail.difference.hh >= 12 && attendanceDetail.difference.mm >= 0)
 			{
 				NotificationManager.error('Intime should not be more than 12 hours.');
 				errors.intime = 'Required';
 			}

 			 let validated = checkError(errors);

 				return validated;
 		 }

	render() {
	 const	{open, onClose,data } = this.props;
   const	{attendanceDetail } = this.state;

		return (
      <Dialog fullWidth fullScreen = {isMobile ? true : false}
          onClose={() => onClose()}
          open={open}
        >
				<DialogTitle >
							<span className="fw-bold text-capitalize"> {data.name}</span>
				</DialogTitle>

          <DialogContent>
            {data == null ? <RctSectionLoader /> :

				  <div className="clearfix d-flex">
					<div className="media-body">

 									<div className = "row">
													<div className = "col-6 col-sm-3 col-md-3">
																		<p>Employee Code:</p>
												</div>
												<div className = "col-6 col-sm-3 col-md-3">
																			<p><span className="badge badge-warning w-100">{data.employeecode}</span></p>

												</div>
					    	</div>
                <div className="row mb-20">
                               <div className="col-md-6">
                                 <div className="rct-picker">
                                     <DateTimePicker minDate ={new Date(getLocalDate(new Date()).setDate(getLocalDate(new Date()).getDate() - 60))} maxDate = {attendanceDetail.outtime ? attendanceDetail.outtime : getLocalDate(new Date())} label ="Check-in time *"  value ={attendanceDetail.intime} onChange = {(date) => this.onChange('intime',date) }/>
                                 </div>
                               </div>
                               <div className="col-md-6">
                                 <div className="rct-picker">
                                     <DateTimePicker disableFuture ={true} minDate={attendanceDetail.intime ? attendanceDetail.intime : getLocalDate(new Date())} label ="Check-out time"  value ={attendanceDetail.outtime} onChange = {(date) => this.onChange('outtime',date) }/>
                                 </div>
                              </div>
                  </div>
                   <div className="row">
									 {attendanceDetail.difference &&
                   <div className = "col-6 col-sm-3 col-md-3">
                             <p>In Time :</p>
                 </div>
							 }
							 {attendanceDetail.difference &&
                 <div className = "col-6 col-sm-3 col-md-3">
                               <p><span className="badge badge-warning w-100 fw-bold fs-16">{  attendanceDetail.difference.hh} : {attendanceDetail.difference.mm} : {attendanceDetail.difference.ss}</span></p>

                 </div>
							 }
                   </div>

          </div>
        </div>
      }
          </DialogContent>
					<DialogActions>
							<Button variant="contained" onClick={() => onClose()} className="btn-danger text-white">
								Cancel
							</Button>
							<Button variant="contained"  color="primary" onClick={() => this.onSave()}  className="text-white">
			              Save
			         </Button>
					</DialogActions>
			  </Dialog>

	);
  }
  }

  export default connect(null,{saveEmployeeattendance})(EditAttendance);
