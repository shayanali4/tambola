/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import GameList from './component/GameList';
import AddGame from './component/AddGame';
import ViewGame from './component/ViewGame';
import {isMobile} from 'react-device-detect';

export default class Game extends Component {

	shouldComponentUpdate(nextProps, nextState)
	{

		return true;

	}

	render() {



		return (
			<div>
			<PageTitleBar
							title={<IntlMessages id="sidebar.game" />}
							match={this.props.match}
						/>

						<RctCollapsibleCard fullBlock>
							<GameList history = {this.props.history} location = {this.props.location}/>
						 </RctCollapsibleCard>
<AddGame history = {this.props.history} location = {this.props.location}/>
<ViewGame history = {this.props.history} location = {this.props.location}/>
	</div>
	);
  }
  }
