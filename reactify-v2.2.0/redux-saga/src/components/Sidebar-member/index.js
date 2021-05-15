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
import { collapsedSidebarAction } from 'Actions';

// components
import UserBlock from './UserBlock';
import SidebarContent from './SidebarContent';


class Sidebar extends Component {


	shouldComponentUpdate(nextProps) {

		const { enableSidebarBackgroundImage, selectedSidebarImage, isDarkSidenav, memberProfileDetail, clientProfileDetail } = this.props;

		if((memberProfileDetail != nextProps.memberProfileDetail) || (clientProfileDetail != nextProps.clientProfileDetail))

		{
			return true;
		}
		else if (enableSidebarBackgroundImage !== nextProps.enableSidebarBackgroundImage || selectedSidebarImage !== nextProps.selectedSidebarImage || isDarkSidenav !== nextProps.isDarkSidenav) {
			return true
		} else {
			return false
		}
	}

componentWillMount()
{
	this.updateDimensions();
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

		let { enableSidebarBackgroundImage, selectedSidebarImage, isDarkSidenav ,memberProfileDetail , clientProfileDetail } = this.props;


		let isgymaccessslot = clientProfileDetail.serviceprovidedId != 1 ? (clientProfileDetail.ishavemutliplebranch ? (memberProfileDetail.branchlist ? (memberProfileDetail.branchlist.filter(x => x.gymaccessslot).length > 0 ? 1 : 0) : clientProfileDetail.gymaccessslot) : clientProfileDetail.gymaccessslot) : 0;

		return (
			<Fragment>
				<div
					className={classNames('rct-sidebar', { 'background-none': !enableSidebarBackgroundImage })}
					style={{ backgroundImage: enableSidebarBackgroundImage ? `url(${selectedSidebarImage})` : 'none' }}
				>
					<div className="site-logo pr-0">
					<img src={clientProfileDetail.logo ? CustomConfig.serverUrl + clientProfileDetail.logo : (require('Assets/img/site-logo.jpg'))} alt="session-logo " className="mr-15 size-40"
						onError={(e)=>{
								e.target.src = (require('Assets/img/site-logo.jpg'))}}/>

							<span className = "text-white"> {clientProfileDetail.organizationname || "Fitness Pro League"}</span>

					</div>
					<div className={classNames("rct-sidebar-wrap", { "sidebar-overlay-dark": isDarkSidenav, 'sidebar-overlay-light': !isDarkSidenav})}>
				<PerfectScrollbar style={{ height: 'calc(100vh - 52px)' }}>
							<UserBlock  memberProfileDetail={memberProfileDetail}/>
							<SidebarContent packtypeId = {clientProfileDetail.packtypeId} professionaltypeId = {clientProfileDetail.professionaltypeId} clienttypeId ={clientProfileDetail.clienttypeId}
							serviceprovidedId = {clientProfileDetail.serviceprovidedId}
							isgymaccessslot = {isgymaccessslot} />
						</PerfectScrollbar>
					</div>
				</div>
			</Fragment>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings }) => {
	const { enableSidebarBackgroundImage, selectedSidebarImage, collapsedSidebar, isDarkSidenav } = settings;
	return { enableSidebarBackgroundImage, selectedSidebarImage, collapsedSidebar, isDarkSidenav};
};

export default withRouter(connect(mapStateToProps, {
	collapsedSidebarAction
})(Sidebar));
