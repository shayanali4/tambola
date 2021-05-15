/**
 * User Block Component
 */
import React, { PureComponent } from 'react';

import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Dropdown from 'reactstrap/lib/Dropdown';

import Badge from 'reactstrap/lib/Badge';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';

// components
import SupportPage from '../Support/Support';

// redux action
import { logoutUserFromFirebase } from 'Actions';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import CustomConfig from 'Constants/custom-config';

class UserBlock extends PureComponent {

    state = {
        userDropdownMenu: false,
        isSupportModal: false
    }

    /**
     * Logout User
     */
    logoutUser() {
        this.props.logoutUserFromFirebase();
    }

    /**
     * Toggle User Dropdown Menu
     */
    toggleUserDropdownMenu() {
        this.setState({ userDropdownMenu: !this.state.userDropdownMenu });
    }

    /**
     * Open Support Modal
     */
    openSupportModal() {
        this.setState({ isSupportModal: true });
    }

    /**
     * On Close Support Page
     */
    onCloseSupportPage() {
        this.setState({ isSupportModal: false });
    }

    /**
     * On Submit Support Page
     */
    onSubmitSupport() {
        this.setState({ isSupportModal: false });
        NotificationManager.success('Message has been sent successfully!');
    }

    render() {
      const   {memberProfileDetail} = this.props;
        let gender =  memberProfileDetail.genderId;

       let profileimage = '';

       if(memberProfileDetail)
       {
         if(memberProfileDetail.memberprofileimage)
         {
            profileimage = CustomConfig.serverUrl + memberProfileDetail.memberprofileimage;
         }
         else if(memberProfileDetail.image) {
           profileimage = CustomConfig.serverUrl + memberProfileDetail.image;
         }
      }


        return (
            <div className="top-sidebar">
                <div className="sidebar-user-block media">
                    <div className="user-profile">

                      {memberProfileDetail &&  <img src={profileimage ? profileimage : (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}  alt = ""  className="img-fluid rounded-circle" width="60" height="129"
                      													onError={(e)=>{
                      															e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}/>}
                    </div>

                    <Dropdown isOpen={this.state.userDropdownMenu} toggle={() => this.toggleUserDropdownMenu()} className="rct-dropdown media-body pt-10">
                        <DropdownToggle nav className="d-flex align-items-center justify-content-between text-capitalize">
                        <div className="text-truncate" style ={{"width" : "100px"}}>
                            {memberProfileDetail ? memberProfileDetail.name : ''}
                        </div>
                            <i className="ti-angle-down pull-right"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                            <ul className="list-unstyled mb-0">
                                <li className="p-15 border-bottom user-profile-top bg-primary rounded-top">
                                    <div className="text-truncate" style ={{"width" : "180px"}}>{memberProfileDetail ? memberProfileDetail.personalemailid : ''}</div>
                                </li>
                                <li>
                                    <Link to={{
                                        pathname: '/member-app/changepassword',
                                        state: { activeTab: 0 }
                                    }}>
                                        <i className="ti-key"></i>
                                        Change Password
                                    </Link>
                                </li>
                              {/*  <li>
                                    <Link to={{
                                        pathname: '/app/users/user-profile-1',
                                        state: { activeTab: 2 }
                                    }}>
                                        <i className="ti ti-comment-alt"></i>
                                        <IntlMessages id="widgets.messages" />
                                        <Badge color="danger" className="pull-right">3</Badge>
                                    </Link>
                                </li> */}
                                <li>
                                    <Link to="/member-app/member-feedback">
                                        <i className="ti ti-pencil"></i>
                                        <IntlMessages id="sidebar.feedback" />

                                    </Link>
                                </li>
                                {/*<li>
                                    <a href="javascript:void(0)" onClick={() => this.openSupportModal()}>
                                        <i className="ti ti-headphone-alt"></i>
                                        <IntlMessages id="widgets.support" />
                                    </a>
                                </li>
                                <li>
                                    <Link to="/app/pages/faq">
                                        <i className="ti ti-help-alt"></i>
                                        <IntlMessages id="sidebar.faq(s)" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/app/pages/pricing">
                                        <i className="ti-package"></i>
                                        <IntlMessages id="widgets.upgradePlains" />
                                    </Link>
                                </li>*/}
                                <li className="border-top">
                                    <a href="#" onClick={(e) => {e.preventDefault(); this.logoutUser();}}>
                                        <i className="ti ti-power-off"></i>
                                        <IntlMessages id="widgets.logOut" />
                                    </a>
                                </li>
                            </ul>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <SupportPage
                    isOpen={this.state.isSupportModal}
                    onCloseSupportPage={() => this.onCloseSupportPage()}
                    onSubmit={() => this.onSubmitSupport()}
                />
            </div>
        );
    }
}


export default connect(null, {
    logoutUserFromFirebase
})(UserBlock);
