import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import OrganizationType  from 'Assets/data/organizationtype';
import Switch from '@material-ui/core/Switch';
import Clienttype from 'Assets/data/clienttype';
import Packtype from 'Assets/data/packtype';
import Packtypeplan from './packtypeplan';
import Professionaltype from 'Assets/data/professionaltype';

export default class EstablishmentForm extends React.Component {


				handleChange = name => event => {
				this.props.onChange([name] , event.target.checked );
				};


				handleChangeRadio = (e, key) => {
					this.props.onChange(key,e.target.value);
				}

	render() {
		const {fields, errors} = this.props;
		return (
					<RctCollapsibleCard>
					<h2 className="font-weight-bold">Welcome</h2>
						<p className="mb-0" style={{color: "#A5A7B2"}}>We are so glad you are here.Now,tell us bit about yourself :)</p>
						<div className="row">
							<div className="establishment-padding">
														<Label for="Branches" className ="col-md-12">You are an</Label>
							</div>
							<div>
											  <RadioGroup required row aria-label="Branches" id="Branches" name="Branches" value={fields.clienttype} onChange={(e) => this.handleChangeRadio(e, 'clienttype')}>
														{
																Clienttype.map((service, key) => ( <FormControlLabel value={service.value} key= {'serviceOption' + key} control={<Radio />} label={service.name} />))
														}
												</RadioGroup>
											{errors.clienttype && <FormHelperText  error>{errors.clienttype}</FormHelperText>}
								</div>
						</div>
						{fields.clienttype == 2 &&
						<div className="row">
							<div className="establishment-padding">
														<Label for="Branches" className ="col-md-12">Service Provided by Professionals</Label>
							</div>
							<div>
												<RadioGroup required row aria-label="professionaltype" id="professionaltype" name="professionaltype" value={fields.professionaltype} onChange={(e) => this.handleChangeRadio(e, 'professionaltype')}>
														{
																Professionaltype.map((professionaltype, key) => ( <FormControlLabel value={professionaltype.value} key= {'professionaltypeOption' + key} control={<Radio />} label={professionaltype.name} />))
														}
												</RadioGroup>
											{errors.professionaltype && <FormHelperText  error>{errors.professionaltype}</FormHelperText>}
								</div>
						</div>
					}
						{(fields.clienttype == 1  || fields.clienttype == 2) &&
							<div className="row">
									<div className="col-sm-6 col-md-6">
									<FormControl fullWidth>
										 <InputLabel htmlFor="organizationtype">You run</InputLabel>
											<Select value={fields.organizationtype || ''} onChange={(e) => this.handleChangeRadio(e,'organizationtype')}
												inputProps={{name: 'organizationtype', id: 'organizationtype', }}>
												{
													OrganizationType.map((organizationtype, key) => ( <MenuItem value={organizationtype.value} key = {'organizationtypeOption' + key }>{organizationtype.name}</MenuItem> ))
												}
											</Select>
									</FormControl>
									<FormHelperText  error>{errors.organizationtype}</FormHelperText>
									</div>
							</div>
						}


					{ fields.clienttype == 1 &&
						<div className="row">
								<FormGroup className="has-wrapper">
								<div className="pull-left ml-3">  Do you have multiple branches?   No

									<Switch checked={fields.multiplebranches==0?false:true} onChange={this.handleChange('multiplebranches')} aria-label="multiplebranches"
					    			 value="yes"		/>Yes</div>
										 	<FormHelperText  error>{errors.multiplebranches}</FormHelperText>
								</FormGroup>
						</div>
					}

					{ fields.multiplebranches == 1 && <div className="row">
										<div className="col-sm-6 col-md-6">
													  <FormGroup className="has-wrapper">
													      	<FormControl required fullWidth error={errors.branch && errors.branch !="" ? true : false}>
																			<InputLabel htmlFor="Branches">You have branches</InputLabel>
																			<Select value={fields.branch} onChange={(e) => this.handleChangeRadio(e, 'branch')}
																				inputProps={{name: 'branch', id: 'Branches', }}>

																				<MenuItem value="Worldwide">Worldwide</MenuItem>
																				<MenuItem value="Countrywide">Countrywide</MenuItem>
																				<MenuItem value="Statewide">Statewide</MenuItem>
																				<MenuItem value="Citywide">Citywide</MenuItem>
																			</Select>
													      	</FormControl>
																	<FormHelperText  error>{errors.branch}</FormHelperText>
													 </FormGroup>
										</div>

										<div className="col-sm-6 col-md-6">
										        <FormGroup className="has-wrapper">
																<TextField required error={errors.branchno && errors.branchno !="" ? true : false} id="user-branches" inputProps={{ min: 0 , max : 1000}} type="number" fullWidth label="No of branches" value={fields.branchno}  onChange={(e) => this.handleChangeRadio(e, 'branchno')} onBlur = {(e) => this.handleChangeRadio(e, 'branchno')} />
																 <FormHelperText  error>{errors.branchno}</FormHelperText>
														</FormGroup>
										</div>
						</div>
					}
					{ fields.clienttype == 1 &&
							<div className="row">
								<div className="establishment-padding">
															<Label for="Branches" className ="col-md-12">Package Type</Label>
								</div>
								<div>
																<RadioGroup required row aria-label="Branches" id="packtype" name="packtype" value={fields.packtype} onChange={(e) => this.handleChangeRadio(e, 'packtype')}>
																	{
																		Packtype.map((packtype, key) => ( <FormControlLabel value={packtype.value} key= {'packtypeOption' + key} control={<Radio />} label={packtype.name} />))
																	}
														</RadioGroup>
														{errors.packtype && <FormHelperText  error>{errors.packtype}</FormHelperText>}
									</div>
							</div>
						}
						{ fields.clienttype == 1 &&
							<Packtypeplan/>
						}
								</RctCollapsibleCard>
		);
	}
}
