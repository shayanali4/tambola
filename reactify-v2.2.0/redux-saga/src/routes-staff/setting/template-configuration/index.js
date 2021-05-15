
  import React, { Component } from 'react';
  import AppBar from '@material-ui/core/AppBar';
  // rct card box
  import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

  // page title bar
  import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

  // intl messages
  import IntlMessages from 'Util/IntlMessages';
  import classNames from 'classnames';
  import { withRouter } from 'react-router-dom';
  import { connect } from 'react-redux';

  import TemplatConfigurationList from './component/TemplatConfigurationList';
  import NotificationConfigurationList from './component/NotificationConfigurationList';
  import AddTemplateConfiguration from './component/AddTemplateConfiguration';
  import ViewTemplateConfiguration from './component/ViewTemplateConfiguration';
  import NotificationGateway from './component/NotificationGateway';
  import Tabs from '@material-ui/core/Tabs';
  import Tab from '@material-ui/core/Tab';
  import Typography from '@material-ui/core/Typography';
  import { push } from 'connected-react-router';

  function TabContainer(props) {
    return (
      <Typography component="div" style={{ padding: 0 * 0 }}>
        {props.children}
      </Typography>
    );
  }

class TemplateConfiguration extends Component {


    shouldComponentUpdate(nextProps, nextState)
  	{
      const {pathname, hash, search} = nextProps.location;

    	if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
    	{
    			return true;
    	}
		return false;
	}


  	handleChange = ( value) => {
     this.props.push('/app/setting/template-configuration/'+ value);
	}
    render() {
      let activeTab = this.props.match && this.props.match.params && this.props.match.params.tab ? this.props.match.params.tab : 0;

      return (
        <div>
  			<PageTitleBar
  							title={<IntlMessages id="sidebar.templateConfiguration" />}
  							match={this.props.match}
  						/>
  						<RctCollapsibleCard fullBlock>
                <div className="rct-tabs">
                  <AppBar position="static">
                    <Tabs
                      value={activeTab ? parseInt(activeTab) : 0}
                      onChange={(e, value) => this.handleChange(value)}
                      variant = "scrollable"
                      scrollButtons="off"
                      indicatorColor="primary"
                    >
                      <Tab  label={"Templates"} />
                        <Tab  label={"Notification Gateway"} />
                        <Tab  label={"Notification Configuration"} />

                    </Tabs>
                  </AppBar>
                    {activeTab == 0 &&
                    <TabContainer>
                        <TemplatConfigurationList  history = {this.props.history} location = {this.props.location} />
                    </TabContainer>}
                    {activeTab == 1 &&
                    <TabContainer>
                        <NotificationGateway  history = {this.props.history} location = {this.props.location} />
                    </TabContainer>}
                    {activeTab == 2 &&
                    <TabContainer>
                        <NotificationConfigurationList history = {this.props.history} location = {this.props.location} />
                    </TabContainer>}



                </div>


  				     </RctCollapsibleCard>
               <AddTemplateConfiguration history = {this.props.history} location = {this.props.location}/>
               <ViewTemplateConfiguration history = {this.props.history} location = {this.props.location}/>

  	</div>
      );
    }
  }
export default connect(null, { push })(TemplateConfiguration);
