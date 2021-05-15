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
import { checkModuleRights} from 'Helpers/helpers';
import $ from 'jquery';
// actions
import { collapsedSidebarAction } from 'Actions';

// components
// import Notifications from './Notifications';
// //import ChatSidebar from '../ChatSidebar/ChatSidebar';
// import DashboardOverlay from '../DashboardOverlay/DashboardOverlay';
// import LanguageProvider from './LanguageProvider';
// import SearchForm from './SearchForm';
// import QuickLinks from './QuickLinks';
// import MobileSearchForm from './MobileSearchForm';
// import Cart from './Cart';
// import BranchList from './BranchList';
import {isMobile} from 'react-device-detect';
// import BranchListOverlay from './BranchListOverlay';
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
		fontSize : "14px",
    fontWeight : "bold",
		fontStyle : "italic"
  },
	anchorOriginBottomCenter	: {bottom : 0}
});



// intl messages
import IntlMessages from 'Util/IntlMessages';

class Header extends Component {

	state = {
		customizer: false,
		isMobileSearchOverlayOpen: false,
		isDashboardOverlayOpen : false,
		isBranchListOverlayOpen : false,
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
		this.setState({ isDashboardOverlayOpen: true });
	}

	// close dashboard overlay
	closeDashboardOverlay() {
		$('.dashboard-overlay').removeClass('show');
		$('.dashboard-overlay').addClass('d-none');
		$('body').css('overflow', '');
		this.setState({ isDashboardOverlayOpen: false });
	}

	// open branchlist overlay
	openBranchListOverlay() {
		$('.branchlist-overlay').toggleClass('d-none');
		$('.branchlist-overlay').toggleClass('show');
		if ($('.branchlist-overlay').hasClass('show')) {
			$('body').css('overflow', 'hidden');
		} else {
			$('body').css('overflow', '');
		}
		this.setState({ isBranchListOverlayOpen: true });
	}

	// close branchlist overlay
	closeBranchListOverlay() {
		$('.branchlist-overlay').removeClass('show');
		$('.branchlist-overlay').addClass('d-none');
		$('body').css('overflow', '');
		this.setState({ isBranchListOverlayOpen: false });
	}



  	// open mobilesearch overlay
  	openMobileSearchOverlay() {
  		$('.mobilesearch-overlay').toggleClass('d-none');
  		$('.mobilesearch-overlay').toggleClass('show');
  		if ($('.mobilesearch-overlay').hasClass('show')) {
  			$('body').css('overflow', 'hidden');
  		} else {
  			$('body').css('overflow', '');
  		}
  		this.setState({ isMobileSearchOverlayOpen: true });
  	}

  	// close mobilesearch overlay
  	closeMobileSearchOverlay() {
  		$('.mobilesearch-overlay').removeClass('show');
  		$('.mobilesearch-overlay').addClass('d-none');
  		$('body').css('overflow', '');
  		this.setState({ isMobileSearchOverlayOpen: false });
  	}

	// toggle screen full
	toggleScreenFull() {
		screenfull.toggle();
	}



	render() {
		const { isMobileSearchOverlayOpen ,isDashboardOverlayOpen,isBranchListOverlayOpen} = this.state;

		// $('body').click(function () {
		// 	$('.dashboard-overlay').removeClass('show');
		// 	$('.dashboard-overlay').addClass('d-none');
		// 	$('body').css('overflow', '');
		// });
		const { horizontalMenu, clientProfileDetail , userProfileDetail, classes} = this.props;
    let memberview =userProfileDetail &&  checkModuleRights(userProfileDetail.modules,"membermanagement","view");
    let enquiryview =userProfileDetail && checkModuleRights(userProfileDetail.modules,"enquiry","view");

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
							{/*
                !horizontalMenu && clientProfileDetail && clientProfileDetail.packtypeId == 3 &&
                      <QuickLinks />
                */
              }
							{/*
                memberview && enquiryview &&
                <li className="list-inline-item search-icon d-inline-block">
                  {!isMobile && <SearchForm defaultbranchid = {userProfileDetail.defaultbranchid}/>}
                  {isMobile &&
                  <a href="#" onClick = {(e) => {e.preventDefault(); this.openMobileSearchOverlay();}} className="header-icon">
                    <i className="zmdi zmdi-search"></i>
                  </a>
                  }
                </li>

                */
            }
						</ul>
					</div>
					<ul className="navbar-right list-inline">

					{/* !isMobile && userProfileDetail && !userProfileDetail.zoneid && clientProfileDetail && clientProfileDetail.ishavemutliplebranch == 1 &&
						<li className="list-inline-item">
							<span className = {"bg-primary text-white"} style = {{padding: '5px 20px 6px 12px', borderRadius: 4,border: '1px solid #EBEDF2'}}> {userProfileDetail.defaultbranchname} </span>
						</li>
            */
					}

					{/* isMobile && userProfileDetail && !userProfileDetail.zoneid && clientProfileDetail && clientProfileDetail.ishavemutliplebranch == 1 &&
						<li className="list-inline-item">
							<Tooltip title={userProfileDetail.defaultbranchname} placement="bottom" disableFocusListener disableTouchListener>
								<a href="#" onClick = {(e) => e.preventDefault()} className="header-icon">
									<i className="fa fa-university"></i>
								</a>
							</Tooltip>
						</li>
            */
					}

					{/* !isMobile && userProfileDetail && userProfileDetail.zoneid && clientProfileDetail && clientProfileDetail.ishavemutliplebranch == 1 &&
						<BranchList/>

            */
				  }

					{/*isMobile && userProfileDetail && userProfileDetail.zoneid && clientProfileDetail && clientProfileDetail.ishavemutliplebranch == 1 &&
						<li className="list-inline-item">
							<Tooltip title="Default Branch" placement="bottom">
								<a href="#" className="header-icon tour-step-3" onClick={(e) => {e.preventDefault(); this.openBranchListOverlay();}}>
									<i className="fa fa-university"></i>
								</a>
							</Tooltip>
						</li>

            */
					}

					{/* clientProfileDetail && clientProfileDetail.clienttypeId == 1 &&
						<li className="list-inline-item">
							<Tooltip title="Footfall" placement="bottom">
								<a href="#" className="header-icon tour-step-3" onClick={(e) => {e.preventDefault(); this.openDashboardOverlay(); }}>
									<i className="zmdi zmdi-info-outline"></i>
								</a>
							</Tooltip>
						</li>
            */
					}
							{/*<li className="list-inline-item">
								<Tooltip title="Upgrade" placement="bottom">
									<Button component={Link} to="/app/pages/pricing" variant="contained" className="tour-step-4 text-white bg-primary" >
										<IntlMessages id="widgets.upgrade" />
									</Button>
								</Tooltip>
							</li>
						<LanguageProvider />*/}
            {/*
						<Cart />
						<Notifications />
            	<li className="list-inline-item setting-icon">
							<Tooltip title="Chat" placement="bottom">
								<IconButton aria-label="settings" onClick={() => this.setState({ customizer: true })}>
									<i className="zmdi zmdi-comment"></i>
								</IconButton>
							</Tooltip>
						</li>
						*/}
						<li className="list-inline-item">
							<Tooltip title="Full Screen" placement="bottom">
								<IconButton aria-label="settings" onClick={() => this.toggleScreenFull()}>
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
					</Drawer> */}
				</Toolbar>
				{clientProfileDetail &&  clientProfileDetail.clienttypeId == 1
					 && isDashboardOverlayOpen && userProfileDetail && userProfileDetail.defaultbranchid && <DashboardOverlay
					onClose={() => this.openDashboardOverlay()}  clientProfileDetail = {clientProfileDetail} branchid = {userProfileDetail.defaultbranchid}
				/>}

				{isMobile && userProfileDetail && userProfileDetail.zoneid && isBranchListOverlayOpen && <BranchListOverlay
					onClose={() => this.openBranchListOverlay()}  isMobile = {isMobile}
				/>}

        {isMobile && isMobileSearchOverlayOpen && userProfileDetail && userProfileDetail.defaultbranchid &&  <MobileSearchForm		onClose={() => this.closeMobileSearchOverlay()}	defaultbranchid = {userProfileDetail.defaultbranchid}	/>}

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
	const {horizontalMenu, clientProfileDetail , navCollapsed , userProfileDetail} = settings;
	return {horizontalMenu, clientProfileDetail , navCollapsed , userProfileDetail};
};

export default compose (withStyles(styles), connect(mapStateToProps, {
	collapsedSidebarAction
})) (Header);
