/**
 * Search Form
 */
import React, { Component } from 'react'
import AutoSuggest from 'Routes/advance-ui-components/autoComplete/component/AutoSuggest';
import api from 'Api';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import {cloneDeep} from 'Helpers/helpers';



class SearchForm extends Component {


	constructor(props) {
	     super(props);
			 this.state = this.getInitialState();
}


   getInitialState()
   {

     this.initialState = {
			 member:{},
			 memberArray:[],
		 };

		   return cloneDeep(this.initialState);
	 }


	handleOnOthersChange = (key, value) => {

		if(key == 'member.label')
		{
			let member = this.state.member;
			member.label = value;
			value = member;
			key = 'member';
		}

		this.setState({
				[key]: value
		})
	}
	handleOnSelect = (key, value) => {
			let {cart} = this.props;

				this.setState(this.getInitialState());
				if(value.isEnquiry == "1")
				{
					this.props.push("/app/enquiry/0?id="+value.id+"#view");
				}
				else {
					this.props.push("/app/members/member-profile?id=" + value.id);
				}
				if(this.props.onClose)
				{
					this.props.onClose();
				}
	}

	getMemberAll = (value) =>
	{
		let branchid = this.props.defaultbranchid;
					api.post('allmember-suggestion', {value,branchid})
					.then(response => {;
						this.handleOnOthersChange('memberArray', response.data[0]);
					}).catch(error => console.log(error) )
	}

	render() {

		let {member ,memberArray } = this.state;

		return (
			<div className="search-wrapper">
				<AutoSuggest  value = {member.label ? member.label : ''} suggestions = {memberArray } textboxtype = {1}
				 getSuggetion= {(value) => this.getMemberAll(value)}
				 autoFocus = {true}
				 inputtype="search" className="search-input-lg bg-primary text-white" placeholder="Search by Name, Mobile or Member Code"
				 onChange= {(value) => this.handleOnOthersChange('member.label', value,true) }
				 onValueChange= {(value) => this.handleOnSelect('member', value) }/>
			</div>
		)
	}
}


export default connect(null,{ push})(SearchForm);
