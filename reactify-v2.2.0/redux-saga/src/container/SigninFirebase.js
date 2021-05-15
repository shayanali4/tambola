/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import LoginType  from 'Assets/data/logintype';
import RadioGroup from '@material-ui/core/RadioGroup';
import Label from 'reactstrap/lib/Label';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import api from 'Api';
import CustomConfig from 'Constants/custom-config';
import  ClientType from 'Assets/data/clienttype';
import { Offline, Online } from "react-detect-offline";
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Snackbar from '@material-ui/core/Snackbar';
import ErrorIcon from '@material-ui/icons/Error';
import { push } from 'connected-react-router';
import { getParams } from 'Helpers/helpers';


// components
/*import {
	SessionSlider
} from 'Components/Widgets';
*/
// app config
import AppConfig from 'Constants/AppConfig';
import {getClientId,checkError } from 'Helpers/helpers';
import {isMobile} from 'react-device-detect';
import FormHelperText from '@material-ui/core/FormHelperText';
import {required} from 'Validations';
import { NotificationManager } from 'react-notifications';

// redux action
import {
	signinUserInFirebase,
} from 'Actions';

//Auth File
import Auth from '../Auth/Auth';

const auth = new Auth();


const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
		paddingRight : 10
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
		fontSize : "14px",
    fontWeight : "bold",
		fontStyle : "italic"
  },
	anchorOriginBottomCenter	: {bottom : 0}
});


class Signin extends Component {
	constructor(props) {
    super(props);
	this.state = {
		email: '',
		password: '',
		logintype : '0',
		clientId : getClientId(),
		Organizationname : '',
		Logo :'',
		Tagline :'',
		SigninbackgroundImage : null,
		successResult : false,
		clienttype : '',
		facebook : '',
		instagram : '',
		packtypeId : 1,
		serviceprovidedId : '',
		errors : { },
		validated : false,
		singninfontportrait: "#ffffff" ,
		singninfontlandscap: "#ffffff",
		youtube : '',
		whatsapp : '',
		defaultbranchid :'',
		ismultiplebranchid :'',
		id:'',
		Organizationbrandname : '',
		enableloginpageenqiry : 0,
		enableloginpageservices : 0,
			brandedapp : 0,
			country:'',
			code:''
	}
}


	componentWillMount()
	{
		let logintype = localStorage.getItem('logintype');
		localStorage.clear();
		if(logintype){
			this.state.logintype = logintype;
			localStorage.setItem('logintype', logintype);
		}


		if(location.search)
		{
				let params = getParams(location.search);
				if(params && params.STATUS == "TXN_SUCCESS")
					{
						NotificationManager.success("Online payment done successfully.");
					}
				 else if(params && params.STATUS == "TXN_FAILURE")
					{
						NotificationManager.error("Online payment Failed.");
					}
					else{
						NotificationManager.error("If any amount debited please contact to administrative staff.");
	     	}
	    }
	}

	componentDidMount()
  {

		 let {clientId }  = this.state ;
		api.post('client-signindetail',{clientId })
	 .then(response =>
		 {
			 let socialmedia = JSON.parse(response.data[0][0].socialmedia);
			 let facebook = socialmedia != null && socialmedia.facebook;
			 let instagram = socialmedia != null && socialmedia.instagram;
			 let youtube = socialmedia != null && socialmedia.youtube;
			 let whatsapp = socialmedia != null && socialmedia.whatsapp;

		 		this.setState({Organizationname : response.data[0][0].organizationname,Logo:response.data[0][0].logo,Tagline:response.data[0][0].tagline ,
					clientId : clientId,SigninbackgroundImage :  response.data[0][0].signinbackgroundimage , successResult : true,
				clienttype : response.data[0][0].clienttypeId ,facebook : facebook , instagram : instagram , packtypeId : response.data[0][0].packtypeId,
			  serviceprovidedId : response.data[0][0].serviceprovidedId,singninfontportrait:response.data[0][0].singninfontportrait || "#ffffff",
				singninfontlandscap:response.data[0][0].singninfontlandscap || "#ffffff",youtube : youtube || {} , whatsapp : whatsapp || {} , defaultbranchid : response.data[0][0].branchid ,
				ismultiplebranchid: response.data[0][0].ishavemutliplebranch, id : response.data[0][0].id,Organizationbrandname :  response.data[0][0].organizationbrandname,
				enableloginpageenqiry: response.data[0][0].enableloginpageenqiry,enableloginpageservices: response.data[0][0].enableloginpageservices,brandedapp :response.data[0][0].brandedapp,
				country :response.data[0][0].country,	code :response.data[0][0].code,
				})
	 		}
	 ).catch(error => {
				 console.log(error);
				 let errorMessage = error.response.data.errorMessage;
				 if(errorMessage){
					 if(errorMessage == "Your account is expired."){
						this.setState({open : true})
					}
					NotificationManager.error(errorMessage);
				 }
	 })
   }



	/**
	 * On User Login
	 */
	onUserLogin() {
				if(this.validate()){
						if (this.state.email !== '' && this.state.password !== '' && this.state.clientId != '') {
							this.props.signinUserInFirebase(this.state, this.props.history);
						}
			}
			else{
				NotificationManager.error("All fields are required.");
			}
	}

	/**
	 * On User Sign Up
	 */
	onUserSignUp() {
			auth.signup();
	}
	onMemberSignUp(){
		this.props.push("/member-signup")
	}

	onBuyOurServices(){
		this.props.push("/ourservices")
	}

	//Auth0 Login
	loginAuth0() {
		auth.login();
	}

	onClick(){

  }
	validate()
		{
				let errors = {};

				const data = this.state;
		    if(data.packtypeId == 3){
						errors.logintype = required(data.logintype);
				}
				errors.email = required(data.email);
				errors.password = required(data.password);

				let validated = checkError(errors);

				 this.setState({
							errors : errors, validated : validated
				 });

				 return validated;
}




	render() {

		const { email, password,logintype,Organizationname,Logo,Tagline,SigninbackgroundImage,successResult,facebook,instagram,
			 packtypeId ,serviceprovidedId,errors,open,singninfontportrait,singninfontlandscap,youtube,whatsapp,clientId,id,Organizationbrandname,
			 enableloginpageenqiry,brandedapp,enableloginpageservices,defaultbranchid,ismultiplebranchid,country,code} = this.state;
		const { loading ,disabled, classes} = this.props;

		let image  = {};

		let potraitimage, landscapeimage;
		if(successResult)
		{
			if(SigninbackgroundImage != null)
			{
				image = SigninbackgroundImage ? JSON.parse(SigninbackgroundImage) : null;

				potraitimage = image && image.filter(x => x.isMobile).length > 0 ? [image.filter(x => x.isMobile)[0].file] : [];
				landscapeimage = image && image.filter(x => !x.isMobile).length > 0 ? [image.filter(x => !x.isMobile)[0].file] : [];

				if(isMobile)
				{
					image = potraitimage && potraitimage.length > 0 ?  {backgroundImage :  "url('"+CustomConfig.serverUrl + potraitimage[0]+"')"} : {backgroundImage :  "url('"+require('Assets/img/signinbackground-potrait.jpg') + "')"}
				}
				else {
					image = landscapeimage && landscapeimage.length > 0 ?  {backgroundImage :  "url('"+CustomConfig.serverUrl + landscapeimage[0]+"')"} : {backgroundImage :  "url('"+require('Assets/img/signinbackground-landscape.jpg') + "')"}
				}
			}
			else {
					image = isMobile ? {backgroundImage :  "url('"+require('Assets/img/signinbackground-potrait.jpg') + "')"} : {backgroundImage :  "url('"+require('Assets/img/signinbackground-landscape.jpg') + "')"}
			}
 		}

		return (
			<QueueAnim type="bottom" duration={2000}>
				<div className="rct-session-wrapper pb-40" style={ image }>
					{loading &&
						<LinearProgress />
					}
					{open == true &&
								<div className="d-flex justify-content-between px-10 text-white rounded py-2 mb-20 bg-danger ">
												<div className ="pr-10">
																	<p> Dear Valued Customer , <br/><span className = "ml-10"> {"Your account was expired. Please contact on 8980906939 for your renewal."} </span></p>
												</div>
												<div>
														 <a href="#" className = "text-white pull-right" onClick={() => {this.setState({open : false})}}>  <i className="ti-close" ></i></a>
												</div>
							 </div>
				 }
		

					<AppBar position="static" className="session-header">
							<Offline polling = {{enabled : false}}>
									<Snackbar
									className = {classes.anchorOriginBottomCenter}
										 open={true}
									 >
									<SnackbarContent
											className = {classes.error}
											 aria-describedby="client-snackbar"
											message={<span id="message-id" className = {classes.message} >
											 <ErrorIcon className={classes.icon} />
												Attempting to restore connection... <br /> Changes made now may not be saved.</span>}
										/>
										</Snackbar>
								</Offline>
						<Toolbar>
							<div className="container">
								<div className="d-flex justify-content-between">

								{
								/*{serviceprovidedId && serviceprovidedId != 2 &&
									<div>
										<Button variant="contained" className="btn-light" onClick={() => this.onMemberSignUp()}>Member Sign Up</Button>
									</div>
								}*/
							}

							{enableloginpageservices == 1 &&
								<div>
									<Button variant="contained" className="btn-light" onClick={() => this.onBuyOurServices()} >Our Services</Button>
								</div>
							}
							<div>
							{/*
								this.state.id && enableloginpageenqiry == 1 &&
								<EnquiryForm  id={this.state.id}  defaultbranchid = {this.state.defaultbranchid} ismultiplebranchid={this.state.ismultiplebranchid} country={this.state.country} code={this.state.code}/>
								*/
						}


							</div>
								</div>
							</div>
						</Toolbar>
					</AppBar>

					<div className="session-inner-wrapper pb-0 ">
						<div className="container">
							<div className="row">
								<div className="col-sm-7 col-md-7 col-lg-8">
									<div className="session-body text-center login-body pb-0 pt-10 text-white">

										<div className="session-head mb-10" style = {{color : isMobile ? singninfontportrait : singninfontlandscap  }}>
											<h2 className="font-weight-bold">Welcome to {Organizationname || AppConfig.brandName}</h2>
										</div>
										<Form onSubmit={(e) => e.preventDefault()}>


												<FormGroup className="has-wrapper">
												<Input type="mail" autoFocus={true} value={email} name="user-mail" id="user-mail" className="has-input input-lg" placeholder="Enter Email Address" onChange={(event) => this.setState({ email: event.target.value })} />
												<span className="has-icon"><i className="ti-email"></i></span>
												<FormHelperText  error className = "fw-bold">{errors.email}</FormHelperText>
											</FormGroup>
											<FormGroup className="has-wrapper">
												<Input value={password} type="Password" name="user-pwd" id="pwd" className="has-input input-lg" placeholder="Password" onChange={(event) => this.setState({ password: event.target.value })} />
												<span className="has-icon"><i className="ti-lock"></i></span>
												<FormHelperText  error className = "fw-bold">{errors.password}</FormHelperText>
											</FormGroup>
											<FormGroup className="mb-15">
											{successResult &&	<Button
													type="submit"
														disabled = {loading}
													style = {{backgroundColor :  (isMobile ? singninfontportrait : singninfontlandscap) == "#ffffff" ? "#2e8de1"  : (isMobile ? singninfontportrait : singninfontlandscap) }}
													className="btn-block text-white "
													variant="contained"
													size="large"
													onClick={() => this.onUserLogin()}>
													Sign In
                            			</Button>
												}
											</FormGroup>

										</Form>

									</div>
								</div>
								<div className="col-sm-5 col-md-5 col-lg-4">
							{/*		<SessionSlider /> */}
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
	const { user, loading,disabled } = authUser;
	return { user, loading ,disabled}
}


export default compose (withStyles(styles), connect(mapStateToProps, {
	signinUserInFirebase,
	push
})) (Signin);
