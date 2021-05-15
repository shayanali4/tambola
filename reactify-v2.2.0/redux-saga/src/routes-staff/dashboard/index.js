/**
* Report Page
*/
import React, { Component } from 'react';
import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';import Label from 'reactstrap/lib/Label';import Input from 'reactstrap/lib/Input';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct collapsible card
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import {isMobile} from 'react-device-detect';
import classNames from 'classnames';
import { green, red } from '@material-ui/core/colors';
import classnames from 'classnames';
import Fab from '@material-ui/core/Fab';
import {cloneDeep,checkModuleRights } from 'Helpers/helpers';
import { connect } from 'react-redux';
import Membershiprenewalanalysis from './membershiprenewalanalysis';


class masterDashboard extends Component {

	constructor(props) {
     super(props);
     this.state = this.getInitialState();
  }
  getInitialState()
  {
    this.initialState = {
										loading : false,
                  }
                  return cloneDeep(this.initialState);
    }

	render() {
           let {userProfileDetail,clientProfileDetail} = this.props;
           userProfileDetail = userProfileDetail || {};

		return (
			<div >
				<PageTitleBar title={"Dashboard"} match={this.props.match} />
        <RctCollapsibleCard fullBlock>
        	<div className="table-responsive p-20">
                <h1>Welcome To Admin Panel</h1>
          </div>
         </RctCollapsibleCard>

				 <div className="row">
						 <div className="col-12 w-xs-full">
									 <Membershiprenewalanalysis />

						 </div>
				</div>
				</div>
		);
	}
}

const mapStateToProps = ({ settings }) => {
  const { userProfileDetail,clientProfileDetail} = settings;

  return {userProfileDetail,clientProfileDetail}
}

export default connect(mapStateToProps,{})(masterDashboard);
