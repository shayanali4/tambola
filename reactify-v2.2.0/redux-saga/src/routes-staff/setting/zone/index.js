/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import ZoneList from './component/ZoneList';
import ViewZone from './component/ViewZone';
import AddZone from './component/AddZone';

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
              title={<IntlMessages id="sidebar.zone" />}
               match={this.props.match}
						/>

						<RctCollapsibleCard fullBlock>
                    <ZoneList history = {this.props.history} location = {this.props.location} />
				     </RctCollapsibleCard>
             <ViewZone history = {this.props.history} location = {this.props.location}/>
             <AddZone history = {this.props.history} location = {this.props.location}/>

	</div>
	);
  }
  }
