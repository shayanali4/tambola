
/**
 * Profile Page
 */
import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import Col from 'reactstrap/lib/Col';

import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';



import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { NotificationManager } from 'react-notifications';

// intlmessages
import IntlMessages from 'Util/IntlMessages';
import {getLocalDate, getFormtedDate, checkError, cloneDeep} from 'Helpers/helpers';

export default class Profile extends Component {

  /**
   * On Update Profile
   */

  render() {
    const   {profileDetail} = this.props;
    return (
      <div className="profile-wrapper w-50">
        <h2 className="heading"><IntlMessages id="widgets.personalDetails" /></h2>
        <Form>
          <FormGroup row>
            <Label sm={3}>Full Name</Label>
            <Col sm={9}>
              <Input type="text" name="firstName" id="firstName" className="input-lg" value={profileDetail.firstname} readOnly/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={3}>Last Name</Label>
            <Col sm={9}>
              <Input type="text" name="lastName" id="lastName" className="input-lg" value={profileDetail.lastname} readOnly/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label  sm={3}>Phone No</Label>
            <Col sm={9}>
              <Input type="text" name="occupation" id="occupation" className="input-lg" value={profileDetail.phone ? profileDetail.phone : ''} readOnly/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={3}>Mobile No</Label>
            <Col sm={9}>
              <Input type="text" name="company" id="company" className="input-lg " value={profileDetail.mobile} readOnly/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={3}>Date of Birth</Label>
            <Col sm={9}>
              <Input type="text" name="telephone" id="telephone" className="input-lg" value={profileDetail.dateofbirth ? getFormtedDate(profileDetail.dateofbirth) : ''} readOnly/>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={3}>Blood Group</Label>
            <Col sm={9}>
              <Input type="text" name="telephone" id="telephone" className="input-lg" value={profileDetail.bloodgroup ? profileDetail.bloodgroup : ''} readOnly/>
            </Col>
          </FormGroup>
        </Form>
        <hr />
        <h2 className="heading">Professional Details</h2>
        <Form>
          <FormGroup row>
            <Label sm={3}>Date of Joining</Label>
            <Col sm={9}>
              <Input type="text" name="address" id="address" className="input-lg" value={profileDetail.dateofjoining ? getFormtedDate(profileDetail.dateofjoining) : ''} readOnly/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label  sm={3}>Assign Role</Label>
            <Col sm={9}>
              <Input type="text" name="city" id="city" className="input-lg" value={profileDetail.rolename ? profileDetail.rolename : ''} readOnly/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={3}>Specialization</Label>
            <Col sm={9}>
              <Input type="text" name="state" id="state" className="input-lg" value={profileDetail.specialization ? profileDetail.specialization : ''} readOnly/>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
