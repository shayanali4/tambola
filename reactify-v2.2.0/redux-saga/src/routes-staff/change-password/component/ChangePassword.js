
/**
 * Profile Page
 */
import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import Col from 'reactstrap/lib/Col';
import { saveChangePassword,saveChagePasswordSuccess } from 'Actions';
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { NotificationManager } from 'react-notifications';
import FormHelperText from '@material-ui/core/FormHelperText';
import {strengthObject,strengthIndicator } from 'Routes/session/signup/components/strength-password';

// intlmessages
import IntlMessages from 'Util/IntlMessages';
import {getLocalDate, getFormtedDate, checkError, cloneDeep} from 'Helpers/helpers';
import {required,email,compare,checkLength,checkMobileNo,checkPincode,checkURL,restrictNumeric,restrictLength} from 'Validations';

 class ChangePassword extends Component {
  constructor(props) {
     super(props);
       this.state = this.getInitialState();
   }

   getInitialState()
   {
     this.initialState = {
             changePassword:{
                           id :0,
                           oldpassword: '',
                           newpassword :'',
                           confirmpassword:'',
              },
              errors : { },
              validated : false,
             passwordchecker : null,
            confirmationDialog : false,
           };
      return cloneDeep(this.initialState);
   }
   onChangePasswordDetail(key,value, isRequired)
   {
     let error= isRequired ? required(value) : '';
     let passwordChecker = this.state.passwordchecker;

     if(error == '' && key == 'newpassword')
     {
         passwordChecker = strengthObject(strengthIndicator(value));
          error =checkLength(value,{min:8,max:16});
          value = restrictLength(value,30);
     }
     else if(error == '' && key == 'confirmpassword')
     {
       error =  compare(value,this.state.changePassword.newpassword);
     }
     this.setState({
        changePassword: {	...this.state.changePassword,
          [key]: value,
        },
        passwordchecker : passwordChecker,
        errors : {...this.state.errors,
          [key] :  error
        },
     });
   }

   validate()
     {
       let errors = {};

      const {oldpassword} = this.state.changePassword;
      const {confirmpassword} = this.state.changePassword;
      const {newpassword} = this.state.changePassword;
      errors.oldpassword = required(oldpassword);
      errors.confirmpassword = required(confirmpassword);
      errors.newpassword = required(newpassword);

       let validated = checkError(errors);

        this.setState({
          changePassword: {	...this.state.changePassword
              },
             errors : errors, validated : validated
        });

        return validated;
 }

      onConfirm()
      {
        const {changePassword} = this.state;
        if(this.validate())
        {
          this.props.saveChangePassword({changePassword});
        }
            this.setState({
          confirmationDialog : false,
        });
      }

      cancelConfirmation()
      {
        this.setState({
         confirmationDialog : false,
       });
      }


      onSaveChangePassword()
     {
       if(this.validate())
       {
         this.setState({
           confirmationDialog : true,
         });
        }
     }
  componentWillReceiveProps(newProps)
    {
      let	{changePasswordsuccess} = newProps;
      if(changePasswordsuccess)
      {
              this.setState(this.getInitialState());
      }
  }

  render() {
    const   {changePassword,passwordchecker ,errors ,confirmationDialog} = this.state;
    const	{disabled} = this.props;

    return (
      <div className="profile-wrapper p-20">

      <p>  To change your password, please provide your current password and your new password. </p>
        <Form>
          <div className="row">
                <Label sm={4}>Current password *</Label>
                <Col sm={8}>
                  <Input  autoFocus={true} type="password" name="oldpassword" id="oldpassword" className="input-lg" value={changePassword.oldpassword}
                   onChange={(e) =>this.onChangePasswordDetail( 'oldpassword' ,e.target.value)}/>
                   	<FormHelperText  error>{errors.oldpassword}</FormHelperText>
                </Col>
          </div>
        <div className="row">
              <Label sm={4}>New password *</Label>
              <Col sm={8}>
                <Input  type="password"  name="newpassword"  id="newpassword" className="input-lg" value={changePassword.newpassword}
                 onChange={(e) =>this.onChangePasswordDetail( 'newpassword' ,e.target.value)} onBlur = {(e) => this.onChangePasswordDetail('newpassword', e.target.value)}ref = 'userpwd'/>
                 {
                   passwordchecker ? <FormHelperText style = {{color: passwordchecker.color}}>{passwordchecker.message}</FormHelperText> : <FormHelperText  error>{errors.newpassword}</FormHelperText>
                 }

              </Col>
          </div>
        <div className="row">
              <Label  sm={4}>Confirm new password *</Label>
              <Col sm={8}>
                <Input type="password"  name="confirmpassword" id="confirmpassword" className="input-lg" value={changePassword.confirmpassword}
                 onChange={(e) =>this.onChangePasswordDetail( 'confirmpassword' ,e.target.value)} onBlur = {(e) => this.onChangePasswordDetail( 'confirmpassword',  e.target.value)} />
                 	<FormHelperText  error>{errors.confirmpassword}</FormHelperText>
              </Col>
        </div>
        <div className="row">
          <Col sm={3}>
          <Button variant="contained"  disabled = {disabled} color="primary" onClick={()=>this.onSaveChangePassword()} className="text-white">
            Save
              </Button>
          </Col>
          </div>
          </Form>
          {
             confirmationDialog &&
           <DeleteConfirmationDialog
             openProps = {confirmationDialog}
             title="Are You Sure Want To Continue?"
             message="This will change your password ."
             onConfirm={() => this.onConfirm()}
              onCancel={() => this.cancelConfirmation()}
           />
           }
      </div>

    );
  }
}

const mapStateToProps = ({ settings }) => {
	const {  disabled ,changePasswordsuccess} =  settings;
  return {disabled  ,changePasswordsuccess}
}
export default connect(mapStateToProps,{saveChangePassword,saveChagePasswordSuccess
})(ChangePassword);
