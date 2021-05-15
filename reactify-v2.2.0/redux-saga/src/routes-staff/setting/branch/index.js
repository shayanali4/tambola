/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import BranchList from './component/BranchList';
import AddBranch from './component/AddBranch';
import ViewBranch from './component/ViewBranch';


export default class Branch extends Component {


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
							title={<IntlMessages id="sidebar.branch" />}
							match={this.props.match}
						/>

						<RctCollapsibleCard fullBlock>
                    <BranchList history = {this.props.history} location = {this.props.location} />
				     </RctCollapsibleCard>

<AddBranch history = {this.props.history} location = {this.props.location} />
<ViewBranch history = {this.props.history} location = {this.props.location}/>
	</div>
	);
  }
  }
