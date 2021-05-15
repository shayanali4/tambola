/**
 * Address Page
 */
import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';

import Collapse from 'reactstrap/lib/Collapse';

import classnames from 'classnames';

import CircularProgress from '@material-ui/core/CircularProgress';
import { NotificationManager } from 'react-notifications';

// intl messages
import IntlMessages from 'Util/IntlMessages';

export default class Address extends Component {

	render() {
		const   {profileDetail} = this.props;
		return (
			<div className="address-wrapper">
				<h2 className="heading">Resident Address</h2>
							<div className="row row-eq-height">

												<div className="col-sm-6 col-md-4 col-lg-3" >
													<div className={classnames("card-base", { 'border-primary': true })}>
														<div className="d-flex justify-content-between">
															<h5 className="fw-bold">{profileDetail.name}</h5>
														</div>
														<address>
															<span>{profileDetail.address1}</span>
															<span>{profileDetail.address2 && `${profileDetail.address2}, `} {profileDetail.city}</span>
															<span>{profileDetail.state && `${profileDetail.state}, `}{profileDetail.country} - {profileDetail.pincode && profileDetail.pincode}  </span>
														</address>
														</div>
													</div>
								</div>
				</div>

		);
	}
}
