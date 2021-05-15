/**
 * Sign Up With Firebase
 */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';import Input from 'reactstrap/lib/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import PerfectScrollbar from 'Components/PerfectScrollbar';
// components
import { SessionSlider } from 'Components/Widgets';

import AddMemberSignUp from './AddMemberSignUp';
// app config
import AppConfig from 'Constants/AppConfig';

import {getClientId } from 'Helpers/helpers';
import api from 'Api';
import CustomConfig from 'Constants/custom-config';

class MemberSignUp extends Component {

	state = {

		clientId : getClientId(),
		Organizationname : '',
		Logo :'',
	}


	componentDidMount()
  {
		 let {clientId }  = this.state ;
				api.post('client-signindetail',{clientId })
			 .then(response =>
				 {
				 		this.setState({Organizationname : response.data[0][0].organizationname,Logo:response.data[0][0].logo,Tagline:response.data[0][0].tagline,clientId : clientId})
			 		}
	      )
   }

	render() {
		const {Organizationname,Logo,Tagline} = this.state;
		return (

			<QueueAnim type="bottom" duration={2000}>
				<div className="rct-session-wrapper session-outer-wrapper">

					<AppBar position="static" className="session-header">
						<Toolbar>
							<div className="container">
								<div className="d-flex justify-content-between align-items-center">
									<div className="session-logo">
									{/*
										<Link to="/">
											<img src={AppConfig.appLogo} alt="session-logo" className = {"img-fluid"} width="110" height="35" />
										</Link>
									*/}
									{Logo &&	<img src={CustomConfig.serverUrl + Logo} alt="session-logo" className=" my-10" width="70" height="80"
									onError={(e)=>{
											e.target.src = (require('Assets/img/site-logo.jpg'))}}/>}

									</div>
									<div>
										<Link to="/signin" className="mr-15 text-white">Already have an account?</Link>
										<Button component={Link} to="/signin" variant="contained" className="btn-light">Sign In</Button>
									</div>
								</div>
							</div>
						</Toolbar>
					</AppBar>
					<div className="session-inner-wrapper">
						<div className="container">
							<div className="row">
								<div className="col-md-12">
									<div className="session-body text-center">
									{
									// <div className="session-head mb-30">
									// 	<h2 className="font-weight-bold">Get Started with {AppConfig.brandName}</h2>
									// 	<p className="mb-0">Most powerful Fitness Management Application</p>
									// </div>
								}

										<div className="session-head mb-10">
										<h2 className="font-weight-bold">Welcome to {Organizationname || AppConfig.brandName}</h2>
										<p className="mb-0">{Tagline || "Most Powerful Fitness Management Application"} </p>
									</div>
          					<AddMemberSignUp />
									</div>
											<p className="text-white text-center mt-10"><span className = "fw-bold">By signing up </span> you agree to { AppConfig.brandName}
											<a href="#/terms-condition" className="text-white ml-2">Terms of Service</a></p>
								</div>

							</div>

						</div>
					</div>
				</div>
			</QueueAnim>
		);
	}
}


export default MemberSignUp;
