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
import Alert from 'reactstrap/lib/Alert';
import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import InputGroupText from 'reactstrap/lib/InputGroupText';

// app config
import AppConfig from 'Constants/AppConfig';
import CustomConfig from 'Constants/custom-config';
import {forgetWebAddress} from 'Actions';

 class ForgetWebAddress extends Component {

  state = {
								email : '',
					}

          onUserSend() {
            if(this.state.email)
              this.props.forgetWebAddress({email : this.state.email});
          }


	render() {
    const { email } = this.state;
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
											<p className="mb-0">Enter your email and we will send you your account URL</p>
										</div>
										{flag == 1 &&
										<Alert color="success">
											We have sent an email to : {email} with your login information
								        </Alert>
										}
										<Form>
                    <FormGroup className="has-wrapper">
                      <Input type="mail" name="user-mail" id="user-mail" className="has-input input-lg" placeholder="Enter Email Address" onChange={(event) => this.setState({ email: event.target.value })} />
                      <span className="has-icon"><i className="ti-email"></i></span>
                    </FormGroup>
                    <FormGroup>
                      <Button disabled = {disable} variant="contained" className="btn-info text-white btn-block btn-large" onClick={() => this.onUserSend()}>Send</Button>
                    </FormGroup>
                    <Button component={Link} to="/client-signin" outline = "true" className="btn-dark btn-block btn-large text-white">Already having account?  Login</Button>
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
	return {  loading ,flag,disable}
}

export default connect(mapStateToProps, {
	forgetWebAddress,
		})(ForgetWebAddress);
