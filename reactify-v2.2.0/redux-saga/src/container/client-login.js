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
import DomainName  from 'Assets/data/domainname';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// components
import {
	SessionSlider
} from 'Components/Widgets';

// app config
import AppConfig from 'Constants/AppConfig';
import CustomConfig from 'Constants/custom-config';

import {clientSignin} from 'Actions';
import {required,checkURL} from 'Validations';

//Auth File
import Auth from '../Auth/Auth';

const auth = new Auth();

class ClientSignin extends Component {

	state = {
								clientId : '',
								domainname :'1',
					}

	/**
	 * On User Sign Up
	 */
	onUserSignUp() {
		auth.signup();
	}

	onUserLogin() {
		if(this.state.clientId)
			this.props.clientSignin({clientId : this.state.clientId});
	}

	onSubmit(e) {
    e.preventDefault();
  }

	handleOnChange = (e, key) =>
	{
 		this.setState({ [key]: e.target.value });
	}

	render() {
		const { clientId,domainname } = this.state;
		const { loading } = this.props;

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
									<div>
										<Link className="mr-15 text-white" to= "/signup">Create New account?</Link>
										<Button variant="contained" component={Link}  to= "/signup" className="btn-light" >Sign Up</Button>
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
											<h2 className="font-weight-bold">Get your {AppConfig.brandName} App</h2>
											<p className="mb-0">Enter your accounts web address</p>
										</div>
										<Form onSubmit={this.onSubmit}>
											<FormGroup className="has-wrapper">
											<div className="row">
										         <div className="col-sm-12 col-md-4 col-xl-6">
											<Input type="text" autoFocus={true} value={clientId} name="clientId" id="clientId" className="has-input input-lg" placeholder="e.g app"
											 onChange={(e) =>  {this.handleOnChange(e, 'clientId')}} />
											 </div>
											 <div className="col-sm-12 col-md-8 col-xl-6">
												<RadioGroup row aria-label="domainname"  id="domainname" name="domainname" value={domainname} onChange={(e) => this.handleOnChange(e,'domainname')} >
							          {
							            DomainName.map((domainname, key) => ( <FormControlLabel value={domainname.value} key= {'domainnameOption' + key} control={<Radio />} label={domainname.name} />))
							          }
							          </RadioGroup>
											 </div>
											  </div>
											</FormGroup>




											<FormGroup className="mb-15">
												<Button
													type="submit"
													color="primary"
													className="btn-block text-white"
													variant="contained"
													size="large"
													onClick={() => this.onUserLogin()}>
													Sign In
                            			</Button>
											</FormGroup>
										{/*	<FormGroup className="mb-15">
												<Button
													variant="contained"
													className="btn-info btn-block text-white"
													size="large"
													onClick={() => this.loginAuth0()}
												>
													Sign In With Auth0
                            					</Button>
											</FormGroup> */}
										</Form>
											{/*		<p className="mb-20">or sign in with</p>
										<Button
											variant="fab"
											mini
											className="btn-facebook mr-15 mb-20 text-white"
											onClick={() => this.props.signinUserWithFacebook(this.props.history)}
										>
											<i className="zmdi zmdi-facebook"></i>
										</Button>
										<Button
											variant="fab"
											mini
											className="btn-google mr-15 mb-20 text-white"
											onClick={() => this.props.signinUserWithGoogle(this.props.history)}>
											<i className="zmdi zmdi-google"></i>
										</Button>
										<Button
											variant="fab"
											mini
											className="btn-twitter mr-15 mb-20 text-white"
											onClick={() => this.props.signinUserWithTwitter(this.props.history)}
										>
											<i className="zmdi zmdi-twitter"></i>
										</Button>
										<Button
											variant="fab"
											mini
											className="btn-instagram mr-15 mb-20 text-white"
											onClick={() => this.props.signinUserWithGithub(this.props.history)}>
											<i className="zmdi zmdi-github-alt"></i>
										</Button>*/}
										<p className="text-muted"><Link  to="/forget-webaddress" className="text-muted">Forgot your account web address?</Link></p>
										<p className="text-muted ">By signing up you agree to {AppConfig.brandName}
										<a href="/terms-condition" className="text-muted ml-2">Terms of Service</a></p>

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

// map state to props
const mapStateToProps = ({ authUser }) => {
	const {  loading } = authUser;
	return {  loading }
}

export default connect(mapStateToProps, {
	clientSignin,
		})(ClientSignin);
