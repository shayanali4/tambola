
import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';
import ReactCodeInput from 'react-code-input';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import CustomConfig from 'Constants/custom-config';
import FormHelperText from '@material-ui/core/FormHelperText';

export default class CodeVerification extends React.Component {

	getVerificationCode()
	{
		return	this.refs.verificationCode.state.value;
	}

	handleChangeCodeInput = (key, value) => {
		this.props.onChange(key, value);
	}

	render() {
			const {fields, errors, emailid} = this.props;
	return (

<RctCollapsibleCard>
<h2 className="font-weight-bold">Check your email</h2>
	<p className="mb-0" style={{color: "#A5A7B2"}}>We sent a six-digit code to <b>{emailid}</b></p>
			<p className="mb-0" style={{color: "#A5A7B2"}}>Enter it below to move ahead.</p>


			<FormGroup className="has-wrapper m-4">

			<ReactCodeInput type={CustomConfig.react_code_input.type} fields={CustomConfig.react_code_input.fields} value ={fields.verificationcode}  ref = "verificationCode"
			 onChange= {(value) => this.handleChangeCodeInput('verificationcode',value)}/>
			 	<FormHelperText  error>{errors.verificationcode}</FormHelperText>
			</FormGroup>



	</RctCollapsibleCard>
		);
	}
}
