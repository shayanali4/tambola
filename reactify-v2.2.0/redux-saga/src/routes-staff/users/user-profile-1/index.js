/**
 * User Profile Page
 */
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

// Components

import Address from './component/Address';
import UserBlock from './component/UserBlock';
import ChangePassword from './component/ChangePassword';
import MyPerformance from './component/MyPerformance';

// rct card box
import { RctCard } from 'Components/RctCard';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserProfile } from 'Actions';

// For Tab Content
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

 class UserProfile extends Component {


  state = {
    activeTab: this.props.location.state ? this.props.location.state.activeTab : 0
  }

  handleChange = (event, value) => {
    this.setState({ activeTab: value });
  }

  render() {
    const { activeTab } = this.state;
    const { userProfileDetail,sessiontypelist,clientProfileDetail} = this.props;

    return (
      <div>
        <PageTitleBar title={<IntlMessages id="widgets.changePassword" />} match={this.props.match} />
        <RctCard>


                  <ChangePassword/>

        </RctCard>
      </div>
    );
  }
}
// map state to props
const mapStateToProps = ({ settings }) => {
	const { userProfileDetail,sessiontypelist,clientProfileDetail} = settings;
	return { userProfileDetail,sessiontypelist ,clientProfileDetail};
};

export default withRouter(connect(mapStateToProps, {
	getUserProfile
})(UserProfile));
