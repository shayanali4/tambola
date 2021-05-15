/**
 * Edit Address For
 */
import React from 'react';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';import Input from 'reactstrap/lib/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import PerfectScrollbar from 'Components/PerfectScrollbar';

const EditAddressForm = ({ selectedAddress, onUpdate, handleChangeDefaultAddress }) => (

    <PerfectScrollbar style={{ height: 'auto' , minHeight : '100px', maxHeight : '300px'  }}>
        <Form>
            <FormGroup>
                <Label for="city">City</Label>
                <Input
                    type="text"
                    name="city"
                    id="city"
                    value={selectedAddress.city}
                    onChange={(e) => onUpdate('city', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="zipcode">Zip Code</Label>
                <Input
                    type="text"
                    name="zipcode"
                    id="zipcode"
                    value={selectedAddress.zipCode}
                    onChange={(e) => onUpdate('zipCode', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="country">Country</Label>
                <Input
                    type="text"
                    name="country"
                    id="country"
                    value={selectedAddress.country}
                    onChange={(e) => onUpdate('country', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="state">State</Label>
                <Input
                    type="text"
                    name="state"
                    id="state"
                    value={selectedAddress.state}
                    onChange={(e) => onUpdate('state', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="addressLine1">Address Line 1</Label>
                <Input
                    type="text"
                    name="addressLine1"
                    id="addressLine1"
                    value={selectedAddress.addressLine1}
                    onChange={(e) => onUpdate('addressLine1', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="addressLine2">Address Line 2</Label>
                <Input
                    type="text"
                    name="addressLine2"
                    id="addressLine2"
                    value={selectedAddress.addressLine2}
                    onChange={(e) => onUpdate('addressLine2', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="apt">Apt</Label>
                <Input
                    type="text"
                    name="apt"
                    id="apt"
                    value={selectedAddress.apt}
                    onChange={(e) => onUpdate('apt', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="phone">Phone No.</Label>
                <Input
                    type="text"
                    name="phone"
                    id="phone"
                    value={selectedAddress.phone}
                    onChange={(e) => onUpdate('phone', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="altPhone">Alt Phone No.</Label>
                <Input
                    type="text"
                    name="altPhone"
                    id="altPhone"
                    value={selectedAddress.altPhone}
                    onChange={(e) => onUpdate('altPhone', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="email">Email Address</Label>
                <Input
                    type="email"
                    name="emailAddress"
                    id="emailAddress"
                    value={selectedAddress.email}
                    onChange={(e) => onUpdate('email', e.target.value)}
                />
            </FormGroup>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={selectedAddress.isDefault}
                        onChange={handleChangeDefaultAddress}
                        color="primary"
                    />
                }
                label="Default"
            />
        </Form>
    </PerfectScrollbar>
);

export default EditAddressForm;
