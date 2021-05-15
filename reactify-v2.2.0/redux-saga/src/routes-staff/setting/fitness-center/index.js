
  import React, { Component } from 'react';
  import AppBar from '@material-ui/core/AppBar';
  import Tabs from '@material-ui/core/Tabs';
  import Tab from '@material-ui/core/Tab';
  import Typography from '@material-ui/core/Typography';

  // Components
  import Profile from './component/Profile';
  import Address from './component/Address';
  import UserBlock from './component/UserBlock';
  //import Configuration from './component/Configuration';
  //import Holidays from './component/Holidays';

  // import Socialmedia from './component/Socialmedia';
  // import TaxeConfiguration from './component/TaxeConfiguration';
  // import Biometric from './component/Biometric';

  import {checkModuleRights} from 'Helpers/helpers';

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
  import { push } from 'connected-react-router';
  import Auth from '../../../Auth/Auth';


  const authObject = new Auth();


  // For Tab Content
  function TabContainer(props) {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }

  class FitnessCenter extends Component {

    handleChange = ( value) => {
     this.props.push('/app/setting/organization/'+ value);
	  }

    shouldComponentUpdate(nextProps, nextState)
  	{
      	const {pathname, hash, search} = nextProps.location;
      	if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
      	{
      		return true;
      	}
      		return false;
  	}

    render() {
      let activeTab = this.props.match && this.props.match.params && this.props.match.params.tab ? this.props.match.params.tab : 0;

      const {userProfileDetail,clientProfileDetail,location} = this.props;

    let updateRights =  checkModuleRights(userProfileDetail.modules,"organization","update");
    let addRights =  checkModuleRights(userProfileDetail.modules,"organization","add");
    let viewRights =  checkModuleRights(userProfileDetail.modules,"organization","view");
    let deleteRights = checkModuleRights(userProfileDetail.modules,"organization","delete");

      return (
        <div className="userProfile-wrapper">
          <PageTitleBar title={<IntlMessages id="sidebar.organization" />} match={this.props.match} />
          <RctCard>
            <div className="rct-tabs">
              <AppBar position="static">
                <Tabs
                  value={activeTab ? parseInt(activeTab) : 0}
                  onChange={(e, value) => this.handleChange(value)}
                  variant = "scrollable"
                  scrollButtons="off"
                  indicatorColor="primary"
                >
                  <Tab  label={"Organization Info"} value = {0}  />
                  {/*
                    <Tab  label={"Configuration"} value = {1}/>
                    <Tab  label={ "Invoice/Tax Configuration"} value = {2} />
                    <Tab  label={"Social Media"} value = {3} />
                    <Tab  label={"Holidays"} value = {4} />
                    */}

                 {
                  // <Tab  label={"Biometric"} value = {4} />
                }


                </Tabs>
              </AppBar>
              {activeTab == 0 &&
                <TabContainer >
                  <Profile updateRights ={updateRights} addRights ={addRights} viewRights ={viewRights}/>
                </TabContainer>}
                

            </div>
          </RctCard>
        </div>
      );
    }
  }

  const mapStateToProps = ({ settings }) => {
    const {  userProfileDetail,clientProfileDetail} = settings;
    return {  userProfileDetail,clientProfileDetail };
  };

  export default connect(mapStateToProps, { push })(FitnessCenter);
