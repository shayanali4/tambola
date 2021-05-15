/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import AdvertisementList from './component/AdvertisementList';
import AddAdvertisement from './component/AddAdvertisement';
import ViewAdvertisement from './component/ViewAdvertisement';

export default class Advertisement extends Component {

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
							title={<IntlMessages id="sidebar.advertisement" />}
							match={this.props.match}
						/>

						<RctCollapsibleCard fullBlock>
				          		<AdvertisementList history = {this.props.history} location = {this.props.location} />
				     </RctCollapsibleCard>
						 <AddAdvertisement history = {this.props.history} location = {this.props.location}/>
						 <ViewAdvertisement history = {this.props.history} location = {this.props.location}/>

	</div>
	);
  }
  }
