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

import Horizontal from 'Routes/session/signup/components/HozAlternative';
// app config
import AppConfig from 'Constants/AppConfig';

class SignupFirebase extends Component {


	render() {
		return (
			<QueueAnim type="bottom" duration={2000}>
				<div className="rct-session-wrapper session-outer-wrapper">

					<AppBar position="static" className="session-header">
						<Toolbar>
							<div className="container">
								<div className="d-flex justify-content-between">
									<div className="session-logo">
										<Link to="/">

											<img src={AppConfig.appLogo} alt="session-logo" className = {"img-fluid"} width="110" height="35" />
										</Link>
									</div>
									<div>
										<Link to="/client-signin" className="mr-15 text-white">Already have an account?</Link>
										<Button component={Link} to="/client-signin" variant="contained" className="btn-light">Sign In</Button>
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
									<div className="session-head mb-30">
										<h2 className="font-weight-bold">Get Started with {AppConfig.brandName}</h2>
										<p className="mb-0">Most powerful Fitness Management Application</p>
									</div>

          					<Horizontal />
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</QueueAnim>
		);
	}
}


export default SignupFirebase;
