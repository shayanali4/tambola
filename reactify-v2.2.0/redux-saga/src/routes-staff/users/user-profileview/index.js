/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import UserProfileDetail from './component/UserProfileDetail';
import {getParams} from 'Helpers/helpers';

export default class MemberProfile extends Component {
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
   let {search} = this.props.location;
	 let params = getParams(search);
			return (
			<div>
			<PageTitleBar
							title={<IntlMessages id="sidebar.userProfileview" />}
							match={this.props.match}
						/>
            <UserProfileDetail id = {params ? params.id : 0}  history = {this.props.history} location = {this.props.location}/>

	</div>
	);
  }
  }
