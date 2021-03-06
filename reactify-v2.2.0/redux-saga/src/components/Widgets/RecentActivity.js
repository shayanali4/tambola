/**
 * Recent Activities
 */
import React, { Component } from 'react';
import PerfectScrollbar from 'Components/PerfectScrollbar';

// api
import api from 'Api';

class RecentActivity extends Component {

	state = {
		activities: null
	}

	componentDidMount() {
		api.get('recentActivities.js')
			.then((response) => {
				this.setState({ activities: response.data });
			})
			.catch(error => {
				// error handling
			})
	}

	render() {
		const { activities } = this.state;
		return (
			<PerfectScrollbar style={{ height: 'auto' , minHeight : '100px' ,maxHeight : '380px' }}>
				<div className="timeline-wrapper">
					<ul className="list-unstyled">
						{activities && activities.map((activity, key) => (
							<li className="d-flex justify-content-start" key={key}>
								<span className={`timeline-ring border-${activity.status}`}></span>
								<div className="timeline-content">
									<span className="text-muted fs-12 d-block">{activity.date}</span>
									<p className="mb-0" dangerouslySetInnerHTML={{ __html: activity.activity }} />
								</div>
							</li>
						))}
					</ul>
				</div>
			</PerfectScrollbar>
		);
	}
}

export default RecentActivity;
