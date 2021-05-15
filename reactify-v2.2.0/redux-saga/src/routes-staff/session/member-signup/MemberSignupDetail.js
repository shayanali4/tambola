import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';
import TextField from '@material-ui/core/TextField';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import FormHelperText from '@material-ui/core/FormHelperText';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Gender  from 'Assets/data/gender';
import AutoSuggest from 'Routes/advance-ui-components/autoComplete/component/AutoSuggest';
import {isMobile} from 'react-device-detect';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import api from 'Api';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FitnessGoal  from 'Assets/data/purpose';

export default class GetStarted extends React.Component {

		 getCountry = (value) =>
		 {
		 				api.post('country-suggestion', {value})
		 				.then(response => {
		 					this.props.onChange('countryArray', response.data[0]);
		 				}).catch(error => console.log(error) )
		 }

		 getState = (value) =>
		 {
		 				api.post('state-suggestion', {value})
		 				.then(response => {
		 					this.props.onChange('stateArray', response.data[0]);
		 				}).catch(error => console.log(error) )
		 }

	render() {
		const {fields, errors,onChange,onClickverifymobileno,serviceList,mobileverificationcode,emailverificationcode,onClickEnterVerificationCode,verificationDetail,verifyemail,verifymobile} = this.props;
		return (

 			<RctCollapsibleCard>
        <div className="has-wrapper">
				<div className="row">
							 <div className="col-6 col-sm-12 col-md-12 col-xl-6">
										 <TextField  required inputProps={{maxLength:100}}  id="firstName" autoFocus = {true} fullWidth label="First Name"  value={fields.firstName} onChange={(e) => onChange('firstName',e.target.value , true)} onBlur = {(e) => onChange('firstName',e.target.value, true)}/>
										 <FormHelperText  error>{errors.firstName}</FormHelperText>
								</div>
								<div className="col-6 col-sm-12 col-md-12 col-xl-6">
										 <TextField required inputProps={{maxLength:100}} id="lastName" fullWidth label="Last Name" value={fields.lastName} onChange={(e) => onChange('lastName',e.target.value , true)} onBlur = {(e) => onChange('lastName',e.target.value, true)}/>
										 <FormHelperText  error>{errors.lastName}</FormHelperText>
								</div>
								<div className="col-6 col-sm-12 col-md-12 col-xl-4">
			              <div className="rct-picker">
			                        <DatePicker
			                        label="Date of Birth" disableFuture = {true} value ={fields.dateOfBirth} onChange={(date) => onChange('dateOfBirth', date,  false)}
			                        />
			                        <FormHelperText  error>{errors.dateOfBirth}</FormHelperText>
			             </div>
			        </div>
							<div className="col-8  col-md-6 col-xl-4">
									  <TextField required id="mobile" inputProps={{max: 12 }} disabled = {verifymobile} type="number" fullWidth label="Mobile Number"   value={fields.mobile} onChange={(e) => onChange('mobile', e.target.value, true)} onBlur = {(e) => {onChange('mobile', e.target.value, true);}}/>
										<FormHelperText  error>{errors.mobile}</FormHelperText>
										{fields.mobile != '' &&  verifymobile == 0 && !errors.mobile &&
										<Button variant="contained" className='text-white btn btn-primary mr-10 mb-10' onClick={() => onClickEnterVerificationCode(0)}>Click to Enter OTP</Button>
									  }
										{verifymobile == 1  &&
										  <i className="fa fa-check-circle fa-2x"></i>
									  }
							</div>
							<div className="col-sm-6 col-md-6 col-xl-4">
								<TextField required id="personalemailid" inputProps={{maxLength:100}} disabled = {verifyemail} fullWidth label="Email-Id "  value={fields.personalemailid} onChange={(e) => onChange('personalemailid', e.target.value,  true)} onBlur = {(e) => onChange('personalemailid',e.target.value , true)} />
								<FormHelperText  error>{errors.personalemailid}</FormHelperText>
								{fields.personalemailid != '' &&  verifyemail == 0 && !errors.personalemailid  &&
								<Button variant="contained" className='text-white btn btn-primary mr-10 mb-10' onClick={() => onClickEnterVerificationCode(1)}>Click to Enter OTP</Button>
							}
							{ verifyemail== 1  &&
						   <i className="fa fa-check-circle fa-2x"></i>
							}
							</div>
							<div className="col-6 col-sm-6 col-md-4 col-xl-4">
					           <TextField   inputProps={{maxLength:100}} id="city" fullWidth label="City" value={fields.city} onChange={(e) => onChange( 'city',e.target.value)} onBlur = {(e) => onChange( 'city',e.target.value)} />
					           <FormHelperText  error>{errors.city}</FormHelperText>
					     </div>
						  <div className="col-6 col-sm-6 col-md-4 col-xl-4">
						        <AutoSuggest  value = {fields.state}  suggestions = {fields.stateArray} getSuggetion= {(value) => this.getState(value)}  label = "State/Region *" onChange= {(value) => onChange('state', value, true) }/>
						        <FormHelperText  error>{errors.state}</FormHelperText>
						  </div>
					    <div className="col-6 col-sm-6 col-md-4 col-xl-4">
					             <AutoSuggest  value = {fields.country.label ? fields.country.label : ''} suggestions = {fields.countryArray} getSuggetion= {(value) => this.getCountry(value)}  label = "Country *"
					              onChange= {(value) => onChange('country.label', value , true) } onValueChange= {(value) => onChange('country', value , true) }/>
					             <FormHelperText  error>{errors.country}</FormHelperText>
					     </div>
        </div>
				<div  className= "row" >
									<div className="col-sm-6 col-md-6 col-xl-4">
										 <FormGroup className="has-wrapper">
												<FormControl fullWidth>
													<InputLabel required htmlFor="title">Select Service</InputLabel>
														<Select value={fields.service} onChange={(e) => onChange('service', e.target.value)}
															inputProps={{name: 'service', id: 'service' }}>
																	{
																		serviceList && serviceList.map((service, key) => ( <MenuItem value={service.id} key= {'serviceOption' + key}>{service.label}</MenuItem> ))
																	 }
														 </Select>
														 <FormHelperText  error>{errors.service}</FormHelperText>
												</FormControl>
											</FormGroup>
									</div>
									<div className="col-sm-6 col-md-6 col-xl-4">
																 <FormControl fullWidth>
																		 <InputLabel htmlFor="fitnessgoal">Fitness Goal</InputLabel>
																		 <Select displayEmpty value={fields.fitnessgoal} onChange={(e) => onChange(e.target.name,e.target.value)}
																			 inputProps={{name: 'fitnessgoal', id: 'fitnessgoal', }}>
																			 <MenuItem value="0">
																					None
																			 </MenuItem>
																			 {
																				 FitnessGoal.map((fitnessgoal, key) => ( <MenuItem value={fitnessgoal.value} key= {'fitnessgoalOption' + key}>{fitnessgoal.name}</MenuItem> ))
																				}
																		 </Select>
																		 <FormHelperText  error>{errors.fitnessgoal}</FormHelperText>
																 </FormControl>
									</div>
				</div>
				<div  className= "row" >
							<div className="col-sm-12 col-md-6 col-xl-5">
											 <div  className= "row" >
													<label className={isMobile ? "professionaldetail_padding mt-0" : "professionaldetail_padding mt-5"} > Gender * </label>
															 <RadioGroup row aria-label="gender" className ={'pl-15'}  id="gender" name="gender" value={fields.gender} onChange={(e) => onChange('gender', e.target.value)} onBlur = {(e) => onChange('gender', e.target.value)}>
															 {
																 Gender.map((gender, key) => ( <FormControlLabel value={gender.value}
																		key= {'genderOption' + key} control={<Radio />} label={
																		<img key = {'genderImgOPrion' + key} src={gender.value == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png')}  alt = ""  className="rounded-circle mr-15" width="50" height="50"/>

																		} />))
															 }
															 </RadioGroup>
							        	</div>
								<FormHelperText  error>{errors.gender}</FormHelperText>
			      </div>
      </div>
		</div>
	</RctCollapsibleCard>
		);
	}
}
