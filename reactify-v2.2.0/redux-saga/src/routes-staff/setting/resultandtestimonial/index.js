/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import ResultAndTestimonialList from './component/ResultAndTestimonialList';
import AddResultAndTestimonial from './component/AddResultAndTestimonial';
import ViewResultAndTestimonial from './component/ViewResultAndTestimonial';

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
							title={<IntlMessages id="sidebar.resultandtestimonial" />}
							match={this.props.match}
						/>

            <RctCollapsibleCard fullBlock>
				          		<ResultAndTestimonialList history = {this.props.history} location = {this.props.location} />
				     </RctCollapsibleCard>
						 <AddResultAndTestimonial history = {this.props.history} location = {this.props.location}/>
						 <ViewResultAndTestimonial history = {this.props.history} location = {this.props.location}/>



	</div>
	);
  }
  }
