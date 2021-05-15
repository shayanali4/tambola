/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import RoleList from './component/RoleList';
import AddRole from './component/AddRole';


export default class Role extends Component {

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

		return (
			<div>
			<PageTitleBar
							title={<IntlMessages id="sidebar.role" />}
							match={this.props.match}
						/>

						<RctCollapsibleCard fullBlock>
							<RoleList history = {this.props.history} location = {this.props.location}/>
				     </RctCollapsibleCard>
						 <AddRole history = {this.props.history} location = {this.props.location}/>

	</div>
	);
  }
  }
