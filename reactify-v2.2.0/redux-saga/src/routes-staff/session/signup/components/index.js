/**
 * Sign Up With Firebase
 */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import Form from 'reactstrap/lib/Form';
import QueueAnim from 'rc-queue-anim';
// components
//import { SessionSlider } from 'Components/Widgets';

import Horizontal from '../routes/session/signup/components/HozAlternative';
// app config
import AppConfig from 'Constants/AppConfig';


class Signup extends Component {


	render() {
		return (
			<QueueAnim type="bottom" duration={2000}>
				<div className="rct-session-wrapper">

					<AppBar position="static" className="session-header">
						<Toolbar>
							<div className="container">
								<div className="d-flex justify-content-between">
									<div className="session-logo">
										<Link to="/">

											<img src={AppConfig.appLogo} alt="session-logo" width="110" height="35" />
										</Link>
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
