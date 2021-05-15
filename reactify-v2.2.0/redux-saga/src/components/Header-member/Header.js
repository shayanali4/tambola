/**
 * App Header
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
//import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import screenfull from 'Components/Screenfull';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';

import $ from 'jquery';

// actions
import { collapsedSidebarAction } from 'Actions';

// components
import Notifications from './Notifications';
//import ChatSidebar from '../ChatSidebar/ChatSidebar';
//import DashboardOverlay from '../DashboardOverlay/DashboardOverlay';
import LanguageProvider from './LanguageProvider';
import SearchForm from './SearchForm';
import QuickLinks from './QuickLinks';
import MobileSearchForm from './MobileSearchForm';
import Cart from './Cart';
import ExerciseSession from './ExerciseSession';
import { Offline, Online } from "react-detect-offline";
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Snackbar from '@material-ui/core/Snackbar';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import ErrorIcon from '@material-ui/icons/Error';

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
		fontSize : "13px",
		fontStyle : "italic"
  },
	anchorOriginBottomCenter	: {bottom : 0}
});

// intl messages
import IntlMessages from 'Util/IntlMessages';

class Header extends Component {

	state = {
		customizer: false,
		isMobileSearchFormVisible: false
	}

	// function to change the state of collapsed sidebar
	onToggleNavCollapsed = (event) => {
		const val = !this.props.navCollapsed;
		this.props.collapsedSidebarAction(val);
	}

	// open dashboard overlay
	openDashboardOverlay() {
		$('.dashboard-overlay').toggleClass('d-none');
		$('.dashboard-overlay').toggleClass('show');
		if ($('.dashboard-overlay').hasClass('show')) {
			$('body').css('overflow', 'hidden');
		} else {
			$('body').css('overflow', '');
		}
	}

	// close dashboard overlay
	closeDashboardOverlay() {
		$('.dashboard-overlay').removeClass('show');
		$('.dashboard-overlay').addClass('d-none');
		$('body').css('overflow', '');
	}

	// toggle screen full
	toggleScreenFull() {
		screenfull.toggle();
	}

	// mobile search form
	openMobileSearchForm() {
		this.setState({ isMobileSearchFormVisible: true });
	}

	render() {
		const { exerciseSession,weightunit,distanceunit ,history, location} = this.props;
		const { isMobileSearchFormVisible } = this.state;
		$('body').click(function () {
			$('.dashboard-overlay').removeClass('show');
			$('.dashboard-overlay').addClass('d-none');
			$('body').css('overflow', '');
		});
		const { horizontalMenu , classes} = this.props;
		return (
			<AppBar position="static" className="rct-header">
				<Toolbar className="d-flex justify-content-between w-100 pl-0">
					<div className="d-flex align-items-center">
						{/*horizontalMenu &&
							<div className="site-logo bg-primary">
								<Link to="/" className="logo-mini">
									<img src={require('Assets/img/appLogo.png')} className="mr-15 size-40" alt="site logo" />
								</Link>
								<Link to="/" className="logo-normal">
									<img src={require('Assets/img/appLogoText.png')} className="img-fluid" alt="site-logo" width="67" height="17" />
								</Link>
							</div> */
						}
						<ul className="list-inline mb-0 navbar-left">
							{!horizontalMenu ?
								<li className="list-inline-item" onClick={(e) => this.onToggleNavCollapsed(e)}>
									<Tooltip title="Sidebar Toggle" placement="bottom">
										<IconButton color="inherit" mini="true" aria-label="Menu" className="humburger">
											<MenuIcon />
										</IconButton>
									</Tooltip>
								</li> :
								<li className="list-inline-item">
									<Tooltip title="Sidebar Toggle" placement="bottom">
										<IconButton color="inherit" aria-label="Menu" className="humburger" component={Link} to="/">
											<i className="ti-layout-sidebar-left"></i>
										</IconButton>
									</Tooltip>
								</li>
							}
						</ul>
					</div>
					<ul className="navbar-right list-inline">
						<li className="list-inline-item">

										<ExerciseSession  history = {this.props.history} location = {this.props.location}/>

						</li>
                <Cart />
								<Notifications />


						<li className="list-inline-item">


							<Tooltip title="Full Screen" placement="bottom">
								<IconButton aria-label="settings " onClick={() => this.toggleScreenFull()}>
									<i className="zmdi zmdi-crop-free"></i>
								</IconButton>
							</Tooltip>
						</li>
					</ul>
				{/*	<Drawer
						anchor={'right'}
						open={this.state.customizer}
						onClose={() => this.setState({ customizer: false })}>
						<ChatSidebar />
					</Drawer>*/}
				</Toolbar>
			{/*	<DashboardOverlay
					onClose={() => this.closeDashboardOverlay()}
				/>*/}
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
			</AppBar>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings }) => {
	return settings;
};

export default compose (withStyles(styles), connect(mapStateToProps, {
	collapsedSidebarAction
})) (Header);
