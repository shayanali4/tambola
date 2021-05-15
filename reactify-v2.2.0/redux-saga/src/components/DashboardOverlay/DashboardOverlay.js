/**
 * Dashboard Overlay
 */
import React, { Component } from 'react';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// component
import FootfallChart from './Footfall';
import UserFootfallChart from './UserFootfall';
// import RegistrationStatus from './Registration';
// import RenewalStatus from './Renewal';

class DashboardOverlay extends Component {

    render() {
        const { onClose ,clientProfileDetail,branchid} = this.props;
        return (
            <div className="dashboard-overlay p-4">
                <div className="overlay-head d-flex justify-content-between mb-40">
                  {  <div className="dash-user-info">
                        <h2 className="fw-bold mb-0 text-white">Footfall</h2>
                    </div>  }
                    <a href="javascript:void(0)" onClick={onClose} className="closed">
                        <i className="ti-close"></i>
                    </a>
                </div>
                <div className="dashboard-overlay-content mb-30">
                    <div className="row row-eq-height">
                        <div className="col-sm-6 col-md-6 col-xl-5">
                            <FootfallChart branchid = {branchid}/>
                        </div>
                          <div className="col-sm-6 col-md-6 col-xl-5">
                              <UserFootfallChart branchid = {branchid}/>
                          </div>
                          {/*<div className="col-sm-6 col-md-4">
                            <RegistrationStatus />
                        </div>
                        <div className="col-sm-6 col-md-4">
                            <RenewalStatus />
                        </div>*/}
                    </div>
                </div>
            </div>

        );
    }
}

export default DashboardOverlay;
