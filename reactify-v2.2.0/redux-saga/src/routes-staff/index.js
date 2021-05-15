/**
 * App Routes
 */
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

// app default layout
import RctAppLayout from 'Components/RctAppLayout-staff';
// routes
import Pages from './pages';

// import Users from './users';
// import Members from './members';
// import PersonalTraining from './Personal-training';
// import SeedData from './masterdata';
// import Classes from './classes';
 import Setting from './setting';
// import Report from './report';
// import Ecommerce from './ecommerce';

// import Workouts from './workouts';
// import Diets from './diets';
// import ExpenseManagement from './expense-management';
// import Broadcast from './broadcast';
// import Covid19disclaimer from './covid19disclaimer';
// import Equipment from './equipment';


// async component
import {
	// AsyncAboutUsComponent,
	// AsyncServiceComponent,
	// AsyncStoreComponent,
	// AsyncStoreCategoryComponent,
  // AsyncDealComponent,
	// AsyncDealTypeComponent,

  AsyncGameComponent,
AsyncBookTicketComponent,
AsyncMySalesComponent,
AsyncEmployeeManagementComponent,
	// AsyncWorkoutRoutineComponent,
	// AsyncEnquiryComponent,
	AsyncDashboardComponent,
	AsyncChangePasswordComponent,
//	AsyncProductComponent,
//  AsyncEquipmentComponent,
//	AsyncBroadcastComponent,
//	AsyncTermsAndConditionComponent,
//	AsyncCompetitionComponent,
//	AsyncStaffCovid19DisclaimerFormComponent,
//	AsyncVisitorBookComponent,
//	AsyncPackageComponent,
} from 'Components/AsyncComponent/AsyncComponent';

class MainApp extends Component {
	render() {

		const { match, location, history } = this.props;
		return (
			<RctAppLayout location = {location}  history = {history}>
				<Route path={`${match.url}/dashboard`} component={AsyncDashboardComponent} />
{/*

  <Route path={`${match.url}/store`} component={AsyncStoreComponent} />
  <Route path={`${match.url}/store-category`} component={AsyncStoreCategoryComponent} />
  <Route path={`${match.url}/deal`} component={AsyncDealComponent} />
  <Route path={`${match.url}/deal-type`} component={AsyncDealTypeComponent} />

  */}
        <Route path={`${match.url}/game`} component={AsyncGameComponent} />

        <Route path={`${match.url}/book-ticket`} component={AsyncBookTicketComponent} />

        <Route path={`${match.url}/my-sales`} component={AsyncMySalesComponent} />


        <Route path={`${match.url}/employee-management`} component={AsyncEmployeeManagementComponent} />

				<Route path={`${match.url}/change-password`} component={AsyncChangePasswordComponent} />
			{/*	<Route path={`${match.url}/pages`} component={Pages} />
				<Route path={`${match.url}/ecommerce`} component={Ecommerce} />
				<Route path={`${match.url}/service`} component={AsyncServiceComponent} />
				<Route path={`${match.url}/workouts`} component={Workouts} />
        <Route path={`${match.url}/diets`} component={Diets} />
				<Route path={`${match.url}/enquiry/:tab?`} component={AsyncEnquiryComponent} />
				<Route path={`${match.url}/class`} component={Classes} />
				<Route path={`${match.url}/product`} component={AsyncProductComponent} />

				<Route path={`${match.url}/report`} component={Report} />
				<Route path={`${match.url}/about-us`} component={AsyncAboutUsComponent} />

        */}
						<Route path={`${match.url}/setting`} component={Setting} />

    {/*
			<Route path={`${match.url}/members`} component={Members} />
			<Route path={`${match.url}/personal-training`} component={PersonalTraining} />
			<Route path={`${match.url}/package`} component={AsyncPackageComponent} />

			*/}
			{/*	<Route path={`${match.url}/masterdata`} component={SeedData} /> */}
			{/*
				<Route path={`${match.url}/classes`} component={Classes} />
				<Route path={`${match.url}/expense-management`} component={ExpenseManagement} />
				<Route path={`${match.url}/equipment`} component={Equipment} />
				<Route path={`${match.url}/broadcast`} component={AsyncBroadcastComponent} />

				<Route path={`${match.url}/terms-condition`} component={AsyncTermsAndConditionComponent} />

			<Route path={`${match.url}/covid19disclaimer`} component={Covid19disclaimer} />

			<Route path={`${match.url}/covid19staffdisclaimerform`} component={AsyncStaffCovid19DisclaimerFormComponent} />
			<Route path={`${match.url}/visitorbook`} component={AsyncVisitorBookComponent} />
			*/}
				{/* <Route path={`${match.url}/competition`} component={AsyncCompetitionComponent} /> */}
			</RctAppLayout>
		);
	}
}

export default withRouter(connect(null)(MainApp));
