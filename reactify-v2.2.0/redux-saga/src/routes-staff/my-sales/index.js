/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import MySalesList from './component/MySalesList';
import {isMobile} from 'react-device-detect';

export default class BookTicket extends Component {

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
							title={<IntlMessages id="sidebar.mySales" />}
							match={this.props.match}
						/>

						<RctCollapsibleCard fullBlock>
							<MySalesList history = {this.props.history} location = {this.props.location}/>
						 </RctCollapsibleCard>
	</div>
	);
  }
  }
