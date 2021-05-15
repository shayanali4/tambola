/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import BudgetList from './component/BudgetList';
import AddBudget from './component/AddBudget';
import ViewBudget from './component/ViewBudget';

export default class MemberManagement extends Component {

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
							title={<IntlMessages id="sidebar.budget" />}
							match={this.props.match}
						/>
						<RctCollapsibleCard fullBlock>
             <BudgetList history = {this.props.history} location = {this.props.location}/>
				     </RctCollapsibleCard>
             <AddBudget history = {this.props.history} location = {this.props.location}/>
						 <ViewBudget history = {this.props.history} location = {this.props.location}/>

	</div>
	);
  }
  }
