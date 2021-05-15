/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import AttendanceDetail from './component/Attendancedetail';

export default class Attendance extends Component {

	shouldComponentUpdate(nextProps, nextState)
	{
		return false;
	}

	render() {
		return (
			<div>
			<PageTitleBar
							title={<IntlMessages id="sidebar.staffAttendance" />}
							match={this.props.match}
						/>
						<RctCollapsibleCard>
						<AttendanceDetail/>
				     </RctCollapsibleCard>

	</div>
	);
  }
  }
