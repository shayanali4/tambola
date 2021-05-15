/**
 * Client Signin
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';import Input from 'reactstrap/lib/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import FormHelperText from '@material-ui/core/FormHelperText';

import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import InputGroupText from 'reactstrap/lib/InputGroupText';

// app config
import AppConfig from 'Constants/AppConfig';
import CustomConfig from 'Constants/custom-config';
import {forgetPassord} from 'Actions';
import Alert from 'reactstrap/lib/Alert';
import {getClientId } from 'Helpers/helpers';
import LoginType  from 'Assets/data/logintype';
import RadioGroup from '@material-ui/core/RadioGroup';
import Label from 'reactstrap/lib/Label';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

class ForgetPassword extends Component {

	state = {
								email : '',
								logintype : '0',
								clientId : getClientId()
					}

					onUserSend() {
						if(this.state.email)
							this.props.forgetPassord({email : this.state.email,clientId : this.state.clientId,logintype : this.state.logintype});
					}


	render() {
		const { email,clientId,logintype } = this.state;
    	const { loading ,flag,disable} = this.props;
		return (
			<QueueAnim type="bottom" duration={2000}>

				<div className="rct-session-wrapper session-outer-wrapper">
				{loading &&
					<LinearProgress />
				}

					<AppBar position="static" className="session-header">
						<Toolbar>
							<div className="container">
								<div className="d-flex justify-content-between">
									<div className="session-logo">
										<Link to="/">
											<img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
										</Link>
									</div>

								</div>
							</div>
						</Toolbar>
					</AppBar>

					<div className="session-inner-wrapper">
						<div className="container">
							<div className="row">
								<div className="col-sm-7 col-md-7 col-lg-8">
									<div className="session-body text-center">
										<div className="session-head mb-30">
											<h2 className="font-weight-bold">{AppConfig.brandName} - The Fitnezz App</h2>
											<p className="mb-0">Enter your email to get password.</p>
										</div>
										{flag == 1 &&
										<Alert color="success">
											We have sent an email to : {email} with your login information
												</Alert>
										}
										<Form>
										<div  className= "row" >
										 <label className="professionaldetail_padding text-white" > </label>
													<RadioGroup row aria-label="logintype"   id="logintype" name="logintype" value={logintype} onChange={(event) => this.setState({ logintype: event.target.value })}>
													{
														LoginType.map((login, key) => ( <FormControlLabel value={login.value}
															 key= {'loginOption' + key} control={<Radio />} label={login.name} />))
													}
													</RadioGroup>
										</div>
                    <FormGroup className="has-wrapper">
                      <Input type="mail" name="user-mail" id="user-mail" className="has-input input-lg" placeholder="Enter Email Address" onChange={(event) => this.setState({ email: event.target.value })} />
                      <span className="has-icon"><i className="ti-email"></i></span>
                    </FormGroup>
                    <FormGroup>
                      <Button disabled = {disable} variant="contained" className="btn-info text-white btn-block btn-large" onClick={() => this.onUserSend()}>Send</Button>
                    </FormGroup>
                    <Button component={Link} to="/signin" outline="true" className="btn-dark btn-block btn-large text-white">Already having account?  Login</Button>
										</Form>

							</div>
								</div>
								<div className="col-sm-5 col-md-5 col-lg-4">

								</div>
							</div>
						</div>
					</div>

				</div>

			</QueueAnim>
		);
	}
}

const mapStateToProps = ({ forgetpasswordReducer }) => {
	const {  loading ,flag,disable} = forgetpasswordReducer;
	return {  loading ,flag ,disable}
}

export default connect(mapStateToProps, {
	forgetPassord,
		})(ForgetPassword);
