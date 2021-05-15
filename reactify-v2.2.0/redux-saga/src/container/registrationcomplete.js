import React, { Component } from 'react';
import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';import Input from 'reactstrap/lib/Input';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import {isMobile} from 'react-device-detect';
// app config
import AppConfig from 'Constants/AppConfig';
import Fab from '@material-ui/core/Fab';

export default class registrationcomplete extends Component {
  render() {
    return (
      <QueueAnim type="bottom" duration={2000}>
        <div className="rct-session-wrapper session-outer-wrapper" key="1">
          <AppBar position="static" className="session-header">
            <Toolbar>
              <div className="container">
                <div className="d-flex justify-content-between">
                  <div className="session-logo">
                    <Link to="/">
                      <img src={require('Assets/img/site-logo.jpg')} alt="session-logo" className="img-fluid" width="110" height="35" />
                    </Link>
                  </div>
                  <div className="list-action hover-action ">
                    <Fab className="btn-danger text-white m-5 pointer" component={Link}  to= "/client-signin" variant="round" mini= "true">
                      <i className="zmdi zmdi-close"></i>
                    </Fab>
										{/*<Button variant="contained" component={Link}  to= "/signup" className="btn-light" >Sign Up</Button> */}
									</div>
                </div>
              </div>
            </Toolbar>
          </AppBar>
          <div className="session-inner-wrapper mt-70 pt-70 mx-10">
            <div className="row">
              <div className="col-sm-8 col-md-8 col-lg-5 mx-auto">
                <div className="session-body text-center">
                  <div className="session-head mb-30 mt-30">
                    <p className=""><span className="fw-bold fs-18">Thanks for registration.</span></p>
                    <p><span className="fw-semi-bold fs-14"> We will contact you soon:)</span></p>
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
