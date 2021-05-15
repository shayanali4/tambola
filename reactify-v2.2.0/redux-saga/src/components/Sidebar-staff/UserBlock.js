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
      const   {profileDetail} = this.props;


      let gender =  profileDetail.genderId || 1;
        return (
            <div className="top-sidebar">
                <div className="sidebar-user-block media">
                    <div className="user-profile">

                      {profileDetail &&  <img src={profileDetail.image ? CustomConfig.serverUrl + profileDetail.image : (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}  alt = ""  className="img-fluid rounded-circle" width="60" height="129"
                      													onError={(e)=>{
                      															e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}/>}
                    </div>

                    <Dropdown isOpen={this.state.userDropdownMenu} toggle={() => this.toggleUserDropdownMenu()} className="rct-dropdown media-body pt-10">
                        <DropdownToggle nav className="d-flex align-items-center justify-content-between text-capitalize">

                            <div className="text-truncate" style ={{"width" : "100px"}}>
                                { profileDetail.name || ''}
                            </div>


                            <i className="ti-angle-down pull-right"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                            <ul className="list-unstyled mb-0">
                                <li className="p-15 border-bottom user-profile-top bg-primary rounded-top">
                                    <div className="text-truncate" style ={{"width" : "180px"}}>{profileDetail.emailid || ''}</div>
                                </li>
                                <li>
                                    <Link to={{
                                        pathname: '/app/change-password',
                                        state: { activeTab: 0 }
                                    }}>
                                        <i className="ti-key"></i>
                                        Change Password
                                    </Link>
                                </li>
                              {/*  <li>
                                    <Link to="/app/users/feedback">
                                        <i className="ti ti-pencil"></i>
                                        <IntlMessages id="sidebar.feedback" />
                                    </Link>
                                </li>*/}
                                <li className="border-top">
                                    <a href="#" onClick={(e) => {e.preventDefault(); this.logoutUser();} }>
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
