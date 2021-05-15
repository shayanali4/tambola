import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';
import TextField from '@material-ui/core/TextField';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import FormHelperText from '@material-ui/core/FormHelperText';
import {strengthColor , strengthIndicator} from './strength-password';

export default class GetStarted extends React.Component {


	constructor() {
	      super();
	      this.state = {
	         password: ''
	      };
	      this.handlePasswordChanges = this.handlePasswordChanges.bind(this);
	}
	   handlePasswordChanges(event) {
	      this.setState({ password: event.target.value});
	   }


		handleOnChange = (e, key) => {
		this.props.onChange(key,e.target.value);
		}



	render() {
		const {fields, errors, passwordchecker} = this.props;
		return (

 			<RctCollapsibleCard>
        <div className="has-wrapper">

					<TextField required error={errors.usermail && errors.usermail !="" ? true : false} autoFocus={true} inputProps={{maxLength: 100}} id="usermail" fullWidth label="Email Address" value={fields.usermail}  onChange={(e) => this.handleOnChange(e, 'usermail')} onBlur = {(e) => this.handleOnChange(e, 'usermail')} />
					<FormHelperText  error>{errors.usermail}</FormHelperText>

          <span className="has-icon"><i className="ti-email"></i></span>
        </div>
        <div className="has-wrapper">

					<TextField required error={errors.userpassword && errors.userpassword !="" ? true : false} inputProps={{maxLength: 20}} id="userpwd"  type="password" fullWidth label="Password" value={fields.userpassword} onChange={(e) => this.handleOnChange(e, 'userpassword')} onBlur = {(e) => this.handleOnChange(e, 'userpassword')} ref = 'userpwd' />
					{
						passwordchecker ? <FormHelperText style = {{color: passwordchecker.color}}>{passwordchecker.message}</FormHelperText> : <FormHelperText  error>{errors.userpassword}</FormHelperText>
					}


          <span className="has-icon"><i className="ti-lock"></i></span>
        </div>
				<FormGroup className="has-wrapper">

					<TextField required error={errors.userconfirmpassword && errors.userconfirmpassword !="" ? true : false} inputProps={{maxLength: 20}} id="userconfirmpwd" type="password" fullWidth label="Confirm Password" value={fields.userconfirmpassword} onChange={(e) => this.handleOnChange(e, 'userconfirmpassword')} onBlur = {(e) => this.handleOnChange(e, 'userconfirmpassword')} />
					<FormHelperText  error>{errors.userconfirmpassword}</FormHelperText>

					<span className="has-icon"><i className="ti-lock"></i></span>
				</FormGroup>
				</RctCollapsibleCard>





		);
	}
}
