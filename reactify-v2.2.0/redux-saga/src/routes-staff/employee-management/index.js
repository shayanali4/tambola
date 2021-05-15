/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import EmployeeList from './component/EmployeeList';
import AddEmployee from './component/AddEmployee';
import ViewEmployee from './component/ViewEmployee';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { opnEditEmployeeModel } from 'Actions';

class EmployeeManagement extends Component {

	shouldComponentUpdate(nextProps, nextState)
	{

		const {pathname, hash, search} = nextProps.location;
		if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
		{
			return true;
		}

		return false;
	}

	componentWillMount()
	{
		if(this.props.clientProfileDetail && this.props.clientProfileDetail.clienttypeId == 2 && this.props.userProfileDetail)
		{
			this.props.opnEditEmployeeModel({id : this.props.userProfileDetail.encryptid});
			this.props.push("/app/employee-management?id="+this.props.userProfileDetail.encryptid+"#edit");
		}
	}

	render() {
		return (
			<div>
			<PageTitleBar
							title={<IntlMessages id="sidebar.employeeManagement" />}
							match={this.props.match}
						/>

						<RctCollapsibleCard fullBlock>
                    <EmployeeList history = {this.props.history} location = {this.props.location} />
				     </RctCollapsibleCard>
					<ViewEmployee  history = {this.props.history} location = {this.props.location} />
	        <AddEmployee  history = {this.props.history} location = {this.props.location} />
	</div>
	);
  }
  }

	const mapStateToProps = ({ settings }) => {
		const {  userProfileDetail,clientProfileDetail} = settings;
		return {  userProfileDetail,clientProfileDetail };
	};

	export default connect(mapStateToProps, { push , opnEditEmployeeModel})(EmployeeManagement);
