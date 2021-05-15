/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import AddShift from './component/AddShift';
import ShiftList from './component/ShiftList';

export default class ManageShift extends Component {

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
							title={<IntlMessages id="sidebar.manageshift" />}
							match={this.props.match}
						/>
						<RctCollapsibleCard fullBlock>
						      <ShiftList history = {this.props.history} location = {this.props.location}/>
				     </RctCollapsibleCard>
             <AddShift  history = {this.props.history} location = {this.props.location} />

	</div>
	);
  }
  }
