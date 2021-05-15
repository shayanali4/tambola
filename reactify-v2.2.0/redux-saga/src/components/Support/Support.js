/**
 * Support Page Modal
 */
import React from 'react';
import Button from '@material-ui/core/Button';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';

const SupportPage = ({ isOpen, onCloseSupportPage, onSubmit }) => (
    <Modal isOpen={isOpen} toggle={onCloseSupportPage}>
        <ModalHeader toggle={onCloseSupportPage}>Support</ModalHeader>
        <ModalBody>
            <FormGroup>
                <Label for="email">Email</Label>
                <Input type="email" name="email" id="email" disabled defaultValue="support@theironnetwork.org" />
            </FormGroup>
            <FormGroup>
                <Label for="subject">Subject</Label>
                <Input type="text" name="subject" id="subject" placeholder="Enter Subject" />
            </FormGroup>
            <FormGroup>
                <Label for="message">Enter Message</Label>
                <Input type="textarea" name="message" id="message" />
            </FormGroup>
        </ModalBody>
        <ModalFooter>
            <Button variant="contained" color="primary" className="text-white" onClick={onSubmit}>Submit</Button>{' '}
            <Button variant="contained" className="btn-danger text-white" onClick={onCloseSupportPage}>Cancel</Button>
        </ModalFooter>
    </Modal>
);

export default SupportPage;
