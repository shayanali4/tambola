import React, { Component } from 'react';
import Form from 'reactstrap/lib/Form';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import FormHelperText from '@material-ui/core/FormHelperText';
import {numberInput} from 'Validations';
import AutoSuggest from 'Routes/advance-ui-components/autoComplete/component/AutoSuggest';
import api from 'Api';

import PlacesAutocomplete from 'react-places-autocomplete';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

export default class OrganizationForm extends React.Component {


	handleOnChange = (e, key,isrequired) => {
	this.props.onChange(key,e.target.value,isrequired);
	}

	handleChange = (key, value, isrequired) => {
		this.props.onChange(key, value , isrequired);
	}

	handleChangeAddress = address => {
		this.props.onChange('gmapaddress', address);
};

	handleSelectAddress = address => {
		this.props.handleSelectAddress(address);
	};

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
		const {fields, errors ,clienttype} = this.props;
		let selectCountry = fields.countryArray.filter(x => x.label == fields.country)[0];
		selectCountry = selectCountry || {};
		return (

<RctCollapsibleCard>

			{(clienttype == 1 || clienttype == 2) &&
			<div className="row">
			<div className="col-sm-6 col-md-6">
	     <TextField  required  error={errors.organizationname && errors.organizationname !="" ? true : false} autoFocus={true} id="orgname"  inputProps={{maxLength: 200}} fullWidth label="Organization Name" value={fields.organizationname} onChange={(e) => this.handleOnChange(e, 'organizationname',true)} onBlur = {(e) => this.handleOnChange(e, 'organizationname',true)}/>
			 <FormHelperText  error>{errors.organizationname}</FormHelperText>
			 </div>
			</div>
		 }

				<div className="row">
						<div className=" col-sm-6 col-md-6">

							 <TextField id="org-firstname" required error={errors.firstname && errors.firstname !="" ? true : false} inputProps={{maxLength: 100}} fullWidth label="First Name" value={fields.firstname} onChange={(e) => this.handleOnChange(e, 'firstname',true)} onBlur = {(e) => this.handleOnChange(e, 'firstname',true)} />
							 <FormHelperText  error>{errors.firstname}</FormHelperText>

							</div>
						<div className="col-sm-6 col-md-6">
							 <TextField id="org-lastname" required error={errors.lastname && errors.lastname !="" ? true : false} inputProps={{maxLength: 100}} fullWidth label="Last Name" value={fields.lastname} onChange={(e) => this.handleOnChange(e, 'lastname',true)} onBlur = {(e) => this.handleOnChange(e, 'lastname',true)} />
							 <FormHelperText  error>{errors.lastname}</FormHelperText>
							</div>
			</div>

			<div className="row">
          <div className="col-sm-12 col-md-12 col-xl-6 pb-5">
              <PlacesAutocomplete
                  value={fields.gmapaddress}
                  onChange={this.handleChangeAddress}
                  onSelect={this.handleSelectAddress}
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
																<IconButton className = "p-5" onClick = {() => this.handleChange('gmapaddress', '') }>
																		<CloseIcon />
																</IconButton>
															</InputAdornment>
														)
													}}
                      />
                      {errors.gmapaddress && <FormHelperText  error>{errors.gmapaddress}</FormHelperText>}
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                          const className = suggestion.active
                            ? 'suggestion-item--active'
                            : 'suggestion-item';
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
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
					 {fields.gmapaddress &&
             <div className="col-sm-12 col-md-12 col-xl-7">
                <FormControlLabel  control={
                  <Checkbox color="primary" checked={fields.isaddressSame==0?false:true} onChange={(e) => this.handleChange('isaddressSame', e.target.checked )} />
                }  label="Same as Google Map Address"
                />
             </div>
					 }

      </div>


				<div className="row">
						<div className="col-sm-6 col-md-6">

				         <TextField id="org-address1" inputProps={{maxLength: 100}} fullWidth label="Address Line1" value={fields.address1} onChange={(e) => this.handleOnChange(e, 'address1')} onBlur = {(e) => this.handleOnChange(e, 'address1')} />
								 <FormHelperText  error>{errors.address1}</FormHelperText>

						 </div>
						 <div className="col-sm-6 col-md-6">

						       <TextField id="org-address2" inputProps={{maxLength: 100}} fullWidth label="Address Line2" value={fields.address2} onChange={(e) => this.handleOnChange(e, 'address2')} onBlur = {(e) => this.handleOnChange(e, 'address2')} />
									 <FormHelperText  error>{errors.address2}</FormHelperText>

							</div>
					</div>

					<div className="row">
							<div className="col-sm-4 col-md-4">
									<TextField id="org-city" fullWidth label="City" value={fields.city} onChange={(e) => this.handleOnChange(e, 'city' ,true)} onBlur = {(e) => this.handleOnChange(e, 'city')} />
									<FormHelperText  error>{errors.city}</FormHelperText>
							</div>
						  <div className="col-sm-4 col-md-4">
							  	<AutoSuggest error = {errors.state && errors.state !="" ? true : false} value = {fields.state} suggestions = {fields.stateArray} getSuggetion= {(value) => this.getState(value)}  label = "State/Region *" onChange= {(value) => this.handleChange('state', value, true) }/>

							</div>
							<div className="col-sm-4 col-md-4">
							<AutoSuggest error = {errors.country && errors.country !="" ? true : false} value = {fields.country} suggestions = {fields.countryArray} getSuggetion= {(value) => this.getCountry(value)}  label = "Country *" onChange= {(value) => this.handleChange('country', value, true) }/>

							</div>
					</div>


<div className="row">
<div className="col-sm-6 col-md-6">
<TextField  id="org-pincode" required error={errors.pincode && errors.pincode !="" ? true : false} fullWidth label="ZIP/Postal Code" value={fields.pincode} onChange={(e) => this.handleOnChange(e, 'pincode' ,true)} onBlur = {(e) => this.handleOnChange(e, 'pincode' ,true)}/>
<FormHelperText  error>{errors.pincode}</FormHelperText>

</div>

<div className="col-sm-6 col-md-6">

				<TextField required error={errors.mobileno && errors.mobileno !="" ? true : false} type="number" id="org-mobileno" fullWidth label="Mobile Number" value={fields.mobileno} onChange={(e) => this.handleOnChange(e, 'mobileno',true)} onBlur = {(e) => this.handleOnChange(e, 'mobileno' ,true)}/>
				<FormHelperText  error>{errors.mobileno}</FormHelperText>


</div>
</div>

<div className="row">
	<div className="col-sm-6 col-md-6">
		<FormControl fullWidth>
			<InputLabel  required htmlFor="selectedtimezone">Select Time Zone</InputLabel>
				<Select value={fields.selectedtimezone} onChange={(e) => this.handleChange('selectedtimezone' ,e.target.value,true)}
						inputProps={{name: 'selectedtimezone', id: 'selectedtimezone', }}>
							{
								fields.timeZoneList &&
							  fields.timeZoneList.filter(x => x.countrycode == selectCountry.id || (!selectCountry.id && x.countrycode)).
								map((timezone, key) => ( <MenuItem value={timezone.offsetvalue} key = {'timezoneOption' + key }>{timezone.label}</MenuItem> ))
							}
					</Select>
					<FormHelperText  error>{errors.selectedtimezone}</FormHelperText>
		</FormControl>
	</div>
</div>

			</RctCollapsibleCard>
		);
	}
}
