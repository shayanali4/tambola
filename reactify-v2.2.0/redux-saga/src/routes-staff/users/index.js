/**
 * Users Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
    //AsyncUsersListComponent,
    AsyncUserProfileComponent,
    AsyncUserProfile1Component,
  //  AsyncEmployeeManagementComponent,
    // AsyncEmployeeFeedbackComponent,
    // AsyncStaffAttendanceComponent,
    // AsyncUsersBiometricComponent,
    AsyncUserProfileViewComponent,
    // AsyncUserManageShiftComponent,
    // AsyncUserAssignShiftComponent,
} from 'Components/AsyncComponent/AsyncComponent';

const Forms = ({ match }) => (
    <div className="content-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/user-profile`} />
            <Route path={`${match.url}/user-profile-1`} component={AsyncUserProfile1Component} />
            <Route path={`${match.url}/user-profileview`} component={AsyncUserProfileViewComponent} />

{/*
  <Route path={`${match.url}/feedback`} component={AsyncEmployeeFeedbackComponent} />
  <Route path={`${match.url}/staff-attendance`} component={AsyncStaffAttendanceComponent} />
  <Route path={`${match.url}/biometric/:tab?`} component={AsyncUsersBiometricComponent} />
  <Route path={`${match.url}/manageshift`} component={AsyncUserManageShiftComponent} />
  <Route path={`${match.url}/assignshift`} component={AsyncUserAssignShiftComponent} />

  */}
        </Switch>
    </div>
);

export default Forms;
