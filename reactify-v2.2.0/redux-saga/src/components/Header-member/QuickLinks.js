/**
 * Quick Links
 */
import React from 'react';

import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Badge from 'reactstrap/lib/Badge';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

// intl messages
import IntlMessages from 'Util/IntlMessages';

const QuickLinks = () => (
    <UncontrolledDropdown nav className="list-inline-item quicklink-wrapper rct-dropdown tour-step-1">
        <DropdownToggle nav className="header-icon p-0">
            <Tooltip title="Quick Links" placement="bottom">
                <i className="zmdi zmdi-apps"></i>
            </Tooltip>
        </DropdownToggle>
        <DropdownMenu>
            <PerfectScrollbar style={{ height: 'auto' , minHeight : '100px' ,maxHeight : '350px' }}>
                <div className="quicklink-content">
                    <div className="quicklink-top d-flex justify-content-between rounded-top bg-primary">
                        <span className="text-white font-weight-bold">Quick Links</span>

                    </div>
                    <ul className="list-unstyled mb-0 quicklink-list">
                        <li>
                            <Link to="/horizontal">
                                <i className="ti-notepad text-primary mr-10"></i>
                                <IntlMessages id="sidebar.horizontalMenu" />
                            </Link>
                        </li>
                        <li>
                            <Link to="/app/pages/report">
                                <i className="ti-notepad text-primary mr-10"></i>
                                <IntlMessages id="sidebar.report" />
                            </Link>
                        </li>

                    </ul>
                </div>
            </PerfectScrollbar>
        </DropdownMenu>
    </UncontrolledDropdown>
);

export default QuickLinks;
