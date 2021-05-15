/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import PosterList from './component/PosterList';
import AddPoster from './component/AddPoster';

export default class Poster extends Component {

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
							title={<IntlMessages id="sidebar.poster" />}
							match={this.props.match}
						/>

						<RctCollapsibleCard fullBlock>
				          		<PosterList history = {this.props.history} location = {this.props.location} />
				     </RctCollapsibleCard>
						 <AddPoster history = {this.props.history} location = {this.props.location}/>

	</div>
	);
  }
  }
