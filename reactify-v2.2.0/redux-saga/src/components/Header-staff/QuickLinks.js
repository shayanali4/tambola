/**
 * Quick Links
 */
import React, {PureComponent} from 'react';
import { connect } from 'react-redux';

import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Badge from 'reactstrap/lib/Badge';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

import {checkModuleRights,getParams} from 'Helpers/helpers';

// intl messages
import IntlMessages from 'Util/IntlMessages';

class QuickLinks extends PureComponent {

render() {
  let {clientProfileDetail} = this.props;
   let profileDetail = this.props.userProfileDetail;
return (
    <UncontrolledDropdown nav className="list-inline-item quicklink-wrapper rct-dropdown tour-step-1">
        <DropdownToggle nav className="header-icon p-0">
            <Tooltip title="Quick Links" placement="bottom">
                <i className="zmdi zmdi-apps"></i>
            </Tooltip>
        </DropdownToggle>
        {profileDetail && profileDetail.modules &&
        <DropdownMenu>
                <div className="quicklink-content">
                    <div className="quicklink-top d-flex justify-content-between rounded-top bg-primary">
                        <span className="text-white font-weight-bold">Quick Links</span>
                    </div>
                  <PerfectScrollbar style={{ height : '200px', width : '100%'}}>
                    <ul className="list-unstyled mb-0 quicklink-list">
                        {checkModuleRights(profileDetail.modules,"enquiry","add") && <li>
                        <Link to = "/app/enquiry/0#add"  className ="btn-outline-default mr-10 fw-bold text-primary" >Add Enquiry</Link>
                        </li>}
                        {/*checkModuleRights(profileDetail.modules,"membermanagement","add") && <li>
                        <Link to="/app/members/member-management#add"  className="btn-outline-default mr-10 fw-bold text-primary">Add Member</Link>
                        </li>*/}
                        {(checkModuleRights(profileDetail.modules,"memberattendance","view")) && <li>
                        <Link to="/app/members/member-attendance"  className="btn-outline-default mr-10 fw-bold text-primary">M-Attendance</Link>
                        </li> }
                        {(clientProfileDetail && clientProfileDetail.packtypeId != 1) && (checkModuleRights(profileDetail.modules,"classattendance","view")) &&  <li>
                        <Link to="/app/classes/class-attendance"  className="btn-outline-default mr-10 fw-bold text-primary">C-Attendance</Link>
                        </li> }
                        {(clientProfileDetail && clientProfileDetail.packtypeId != 1) && (checkModuleRights(profileDetail.modules,"servicesale","view") && checkModuleRights(profileDetail.modules,"productsale","view")) &&  <li>
                            <Link to="/app/ecommerce/express-sale"  className="btn-outline-default mr-10 fw-bold text-primary">Express-Sale</Link>
                            </li>}
                      {checkModuleRights(profileDetail.modules,"servicesale","view") &&  <li>
                      <Link to="/app/ecommerce/service"  className="btn-outline-default mr-10 fw-bold text-primary">Service-Sale</Link>
                      </li>}
                    {(clientProfileDetail && clientProfileDetail.clienttypeId != 2 &&  clientProfileDetail.packtypeId != 1) && (checkModuleRights(profileDetail.modules,"productsale","view")) &&  <li>
                    <Link to="/app/ecommerce/product"  className="btn-outline-default mr-10 fw-bold text-primary">Product-Sale</Link>
                    </li> }
                    {(clientProfileDetail && clientProfileDetail.packtypeId != 1) && (checkModuleRights(profileDetail.modules,"classschedules","view")) && <li>
                      <Link to="/app/classes/class-schedules"  className="btn-outline-default mr-10 fw-bold text-primary">C-Schedules</Link>
                      </li>}
                      {(clientProfileDetail && clientProfileDetail.packtypeId != 1) && (checkModuleRights(profileDetail.modules,"classperformance","view")) && <li>
                      <Link to="/app/classes/class-performance"  className="btn-outline-default mr-10 fw-bold text-primary">C-Performance</Link>
                      </li>}
                      {(clientProfileDetail && clientProfileDetail.packtypeId != 1) && (checkModuleRights(profileDetail.modules,"ptschedule","view")) && <li>
                      <Link to="/app/personal-training/pt-schedule"  className="btn-outline-default mr-10 fw-bold text-primary">PT Schedule</Link>
                      </li>}
                      {(clientProfileDetail && clientProfileDetail.packtypeId != 1) &&  (checkModuleRights(profileDetail.modules,"ptattendence","view")) && <li>
                      <Link to="/app/personal-training/pt-attendence"  className="btn-outline-default mr-10 fw-bold text-primary">PT Attendence</Link>
                      </li>}
                      {(clientProfileDetail && clientProfileDetail.clienttypeId != 2) && (checkModuleRights(profileDetail.modules,"staffattendance","view")) && <li>
                      <Link to="/app/users/staff-attendance"  className="btn-outline-default mr-10 fw-bold text-primary">Staff Attendence</Link>
                      </li>}

                    </ul>
                    </PerfectScrollbar>
                </div>
        </DropdownMenu>
        }
    </UncontrolledDropdown>
);
}
}

const mapStateToProps = ({ settings }) => {
  const {userProfileDetail,clientProfileDetail} = settings;
  return { userProfileDetail,clientProfileDetail}
}

export default connect(mapStateToProps, {})(QuickLinks);
