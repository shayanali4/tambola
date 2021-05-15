/**
 * Reactify Sidebar
 */
import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import $ from 'jquery';
import CustomConfig from 'Constants/custom-config';
// redux actions
import { collapsedSidebarAction} from 'Actions';

// components
import UserBlock from './UserBlock';
import SidebarContent from './SidebarContent';

class Sidebar extends Component {


componentWillMount()
{
	this.updateDimensions();
}

	shouldComponentUpdate(nextProps) {
		const { enableSidebarBackgroundImage, selectedSidebarImage, isDarkSidenav, userProfileDetail, clientProfileDetail  } = this.props;
		if((userProfileDetail != nextProps.userProfileDetail) || (clientProfileDetail != nextProps.clientProfileDetail && nextProps.isbranchprofileupdated == 1))
		{
			return true;
		}
		else if (enableSidebarBackgroundImage !== nextProps.enableSidebarBackgroundImage || selectedSidebarImage !== nextProps.selectedSidebarImage || isDarkSidenav !== nextProps.isDarkSidenav) {
			return true
		} else {
			return false
		}
	}

	componentDidMount() {

  	window.addEventListener("resize", this.updateDimensions);
  }

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
	}

	componentWillReceiveProps(nextProps) {
		const { windowWidth } = this.state;
		const { collapsedSidebar } = this.props;
		if (nextProps.location !== this.props.location) {
			if (windowWidth <= 1199) {
				this.props.collapsedSidebarAction(false);
			}
		}
	}

	updateDimensions = () => {
		this.setState({ windowWidth: $(window).width(), windowHeight: $(window).height() });
	}


	render() {

		let { enableSidebarBackgroundImage, selectedSidebarImage, isDarkSidenav , userProfileDetail,clientProfileDetail } = this.props;

		userProfileDetail = userProfileDetail ;
		clientProfileDetail = clientProfileDetail ;

		return (
			<Fragment>
				<div
					className={classNames('rct-sidebar', { 'background-none': !enableSidebarBackgroundImage })}
					style={{ backgroundImage: enableSidebarBackgroundImage ? `url(${selectedSidebarImage})` : 'none' }}
				>
					<div className="site-logo pr-0">
				{/*
					<img src ={clientProfileDetail.logo ? CustomConfig.serverUrl + clientProfileDetail.logo : (require('Assets/img/site-logo.jpg'))} className="mr-15 size-40" alt="site logo"
					onError={(e)=>{
							e.target.src = (require('Assets/img/site-logo.jpg'))}}/>
							*/}

							<span className = "text-white"> {clientProfileDetail.organizationbrandname || clientProfileDetail.organizationname || "Fitness Pro League" }</span>
					</div>
					<div className={classNames("rct-sidebar-wrap", { "sidebar-overlay-dark": isDarkSidenav, 'sidebar-overlay-light': !isDarkSidenav})}>
					<PerfectScrollbar style={{ height: 'calc(100vh - 65px)' }}>
							<UserBlock  profileDetail={userProfileDetail}/>
							<SidebarContent menus={userProfileDetail.modules}
							packtypeId = {clientProfileDetail.packtypeId}
							clienttypeId = {clientProfileDetail.clienttypeId}
							professionaltypeId = {clientProfileDetail.professionaltypeId}
							serviceprovidedId= {clientProfileDetail.serviceprovidedId}
							gymaccessslot = {clientProfileDetail.gymaccessslot}
							biometric = {clientProfileDetail.biometric}
							 iscovid19memberdisclaimerenable = {clientProfileDetail.enablecovid19disclaimertomember}
							 iscovid19staffdisclaimerenable = {clientProfileDetail.enablecovid19disclaimertostaff}
							 ishavemutliplebranch = {clientProfileDetail.ishavemutliplebranch}/>
						</PerfectScrollbar>
					</div>
				</div>
			</Fragment>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings }) => {
	const { enableSidebarBackgroundImage, selectedSidebarImage, collapsedSidebar, isDarkSidenav,isbranchprofileupdated } = settings;
	return { enableSidebarBackgroundImage, selectedSidebarImage, collapsedSidebar, isDarkSidenav ,isbranchprofileupdated};
};

export default withRouter(connect(mapStateToProps, {
	collapsedSidebarAction
})(Sidebar));
