
  import React, { Component } from 'react';
  import AppBar from '@material-ui/core/AppBar';
  import Tabs from '@material-ui/core/Tabs';
  import Tab from '@material-ui/core/Tab';
  import Typography from '@material-ui/core/Typography';

  // Components
   import DisclaimerForm from './Disclaimercomponent/DisclaimerForm';
   import Questions from './Questioncomponent/Questions';
   import RuleForm from './Rulecomponent/RuleForm';

  // import Configuration from './component/Configuration';
  // import Socialmedia from './component/Socialmedia';
  import {checkModuleRights} from 'Helpers/helpers';

  // rct card box
  import { RctCard } from 'Components/RctCard';

  // page title bar
  import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

  // intl messages
  import IntlMessages from 'Util/IntlMessages';
  import { connect } from 'react-redux';
  import { push } from 'connected-react-router';

  // For Tab Content
  function TabContainer(props) {
    return (
      <Typography component="div" style={{ padding: '12px 24px 5px' }}>
        {props.children}
      </Typography>
    );
  }

  class Disclaimer extends Component {

    handleChange = ( value) => {
     this.props.push('/app/setting/disclaimer/'+ value);
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
      let {userProfileDetail} = this.props;
    let updateRights =  checkModuleRights(userProfileDetail.modules,"disclaimer","update");
    let addRights =  checkModuleRights(userProfileDetail.modules,"disclaimer","add");
    let viewRights =  checkModuleRights(userProfileDetail.modules,"disclaimer","view");

      return (
        <div className="userProfile-wrapper">
          <PageTitleBar title={<IntlMessages id="sidebar.disclaimer" />} match={this.props.match} />
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
                  <Tab  label={"Disclaimer"} />
                  <Tab  label={"Questions"} />
                  <Tab  label={"Rules"} />
                </Tabs>
              </AppBar>
              {activeTab == 0 &&
                <TabContainer>
                  <DisclaimerForm updateRights ={updateRights} addRights ={addRights} viewRights ={viewRights}/>
                </TabContainer>}
                {activeTab == 1 &&
                  <TabContainer>
                    <Questions updateRights={updateRights} addRights ={addRights} history = {this.props.history} location = {this.props.location}/>
                  </TabContainer>}
                  {activeTab == 2 &&
                    <TabContainer>
                      <RuleForm updateRights={updateRights} addRights ={addRights} viewRights ={viewRights} history = {this.props.history} location = {this.props.location}/>
                    </TabContainer>}

            </div>
          </RctCard>
        </div>
      );
    }
  }

  const mapStateToProps = ({ settings }) => {
  	const { userProfileDetail} = settings;
    return { userProfileDetail}
  }

  export default connect(mapStateToProps, { push })(Disclaimer);
