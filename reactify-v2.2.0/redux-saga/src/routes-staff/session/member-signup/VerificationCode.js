
import React, { Fragment, Component } from "react";

import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';
import ReactCodeInput from 'react-code-input';

import CustomConfig from 'Constants/custom-config';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Timer from './timer';

export default class CodeVerification extends React.Component {

	render() {
		const {onChangeVerificationcode,emailid,OnsaveVerificationCode,onClose,mobile,emailVerificationCode,verificationDetail,disabled,onClickEnterVerificationCode,mobileVerificationCode} = this.props;
	return (
		<Dialog
				 open={open}
			>
			<DialogTitle >
		  	<CloseIcon onClick={() => onClose()} className = {"pull-right pointer"}/>
				<h2 className="font-weight-bold">{emailVerificationCode != '' ? 'Check your Email' : 'Check your SMS'}</h2>
				<p className="mb-0" style={{color: "#A5A7B2"}}>We sent a six-digit code to <b>{emailVerificationCode != '' ? emailid : mobile}</b></p>
				<p className="mb-0" style={{color: "#A5A7B2"}}>Enter it below to {emailVerificationCode != '' ? "Email" : "Mobile"} Verification.</p>

      </DialogTitle>
			   <DialogContent>
				 {emailVerificationCode != '' ?
									<FormGroup className="has-wrapper m-4">
									<ReactCodeInput type={CustomConfig.react_code_input.type} fields={CustomConfig.react_code_input.fields} value ={verificationDetail.verifyemailverificationcode}  ref = "verificationCode"
									 onChange= {(value) => onChangeVerificationcode('verifyemailverificationcode',value)}/>
									</FormGroup>

						:
						<FormGroup className="has-wrapper m-4">
						<ReactCodeInput type={CustomConfig.react_code_input.type} fields={CustomConfig.react_code_input.fields} value ={verificationDetail.verifymobileverificationcode}  ref = "verificationCode"
						 onChange= {(value) => onChangeVerificationcode('verifymobileverificationcode',value)}/>
						</FormGroup>
					}
					</DialogContent>
					<DialogActions>
								<Timer  onClickEnterVerificationCode = {onClickEnterVerificationCode.bind(this)} emailVerificationCode ={emailVerificationCode} disabled ={disabled} mobileVerificationCode ={mobileVerificationCode}/>
							  <Button variant="contained" disabled ={disabled} onClick={() => OnsaveVerificationCode()}  className="text-white btn-primary">
							        Save
							  </Button>
				</DialogActions>
			<div>

		 </div>
			</Dialog>
		);
	}
}
