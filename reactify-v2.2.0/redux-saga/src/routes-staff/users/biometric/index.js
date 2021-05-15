/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import BiometricList from './component/biometricList';
import Biometricview from './component/biometricview';
import Biometriclogs from './component/biometriclogs';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';


function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 0 * 0 }}>
			{props.children}
		</Typography>
	);
}

 class Biometric extends Component {

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
		this.props.push('/app/users/biometric/'+ value);
}

	render() {
		let activeTab = this.props.match && this.props.match.params && this.props.match.params.tab ? this.props.match.params.tab : null;

		return (
			<div>
			<PageTitleBar
							title={<IntlMessages id="sidebar.biometric" />}
							match={this.props.match}
						/>
						<RctCollapsibleCard fullBlock>

								<div className="table-responsive">
									 <div className="rct-tabs" >
											<AppBar position="static">
												<Tabs
													value={activeTab ? parseInt(activeTab) : 0}
													onChange={(e, value) => this.handleChange(value)}
													variant="scrollable"
													scrollButtons="off"
													indicatorColor="primary"
												 >
														 <Tab  label={"Users"} />
														 <Tab  label={"Logs"} />
												</Tabs>
											</AppBar>
									</div>
									{activeTab == 0 &&
									<TabContainer>
											 <BiometricList activeTab = {activeTab}  history = {this.props.history} location = {this.props.location}/>
									</TabContainer>}
									{activeTab == 1 &&
									<TabContainer>
											<Biometriclogs activeTab = {activeTab}/>
									</TabContainer>}
								</div>
				     </RctCollapsibleCard>
						 <Biometricview />
	</div>
	);
  }
  }



	export default connect(null, { push })(Biometric);
