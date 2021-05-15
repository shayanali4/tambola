/**
 * Address Page
 */
import React, { Component } from 'react';
import BasicList from './BasicList';
import WorkoutHistoryList from './WorkoutHistoryList';
import MedicalHistoryList from './MedicalHistoryList';
import RulesList from './RulesList';
import ConsentForm from './ConsentForm';
import { viewDisclaimer } from 'Actions';
import { connect } from 'react-redux';

 class DisclaimerForm extends Component {

	 componentWillMount()
	 		 {
	 			 this.props.viewDisclaimer();
	 		 }

	render() {
		return (
			<div className="address-wrapper">

					<BasicList />
					<WorkoutHistoryList/>
					<MedicalHistoryList/>
					<RulesList/>
					<ConsentForm/>
		  </div>

		);
	}
}


export default connect(null,{viewDisclaimer})(DisclaimerForm);
