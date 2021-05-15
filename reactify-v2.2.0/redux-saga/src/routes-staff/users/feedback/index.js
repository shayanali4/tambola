/**
* Feedback Page
*/
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

// components
import FeedbacksListing from './components/FeedbacksListings';
import AddNewFeedback from './components/AddNewFeedback';
import SearchIdeas from './components/SearchIdeas';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// actions
import { onChangeFeedbackPageTabs } from 'Actions';
import {checkModuleRights} from 'Helpers/helpers';

// For Tab Content
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class FeedbackPage extends Component {

  handleChange = (event, value) => {
    this.props.onChangeFeedbackPageTabs(value);
  }



  render() {
    const { selectedTab, selectedFeedback, loading ,userProfileDetail} = this.props;

    let updateRights = checkModuleRights(userProfileDetail.modules,"memberfeedback","update");
    return (
      <div className="feedback-wrapper">
        <PageTitleBar title={<IntlMessages id="sidebar.feedback" />} match={this.props.match} />
          <div>
          {updateRights ?
            <RctCollapsibleCard customClasses="rct-tabs">
            {/*  {loading &&
                <div className="d-flex justify-content-center loader-overlay">
                  <CircularProgress />
                </div>
              }*/}
              <AppBar position="static">
                <Tabs
                  value={selectedTab}
                  onChange={this.handleChange}
                  variant="scrollable"
                  scrollButtons="off"
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab label="Add New" />
                  <Tab label={`All`} />

                </Tabs>
              </AppBar>
              {selectedTab === 0 &&
                <TabContainer>
                  <AddNewFeedback />
                </TabContainer>}
              { updateRights && selectedTab === 1 && <TabContainer><FeedbacksListing ismember = {false}/></TabContainer>}

            </RctCollapsibleCard>

            :
            <RctCollapsibleCard customClasses="rct-tabs">
              <AddNewFeedback />
              </RctCollapsibleCard>
          }
          </div>

      </div>
    );
  }
}

// map state to props
const mapStateToProps = ({ feedback,settings }) => {
  const { selectedTab, selectedFeedback, loading} =  feedback;
  const { userProfileDetail} =  settings;
  return {userProfileDetail,selectedTab, selectedFeedback, loading};
}

export default connect(mapStateToProps, {
  onChangeFeedbackPageTabs
})(FeedbackPage);
