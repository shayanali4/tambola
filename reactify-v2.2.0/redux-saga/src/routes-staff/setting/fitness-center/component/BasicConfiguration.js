
/**
 * Profile Page
 */
import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Col from 'reactstrap/lib/Col';
import {cloneDeep ,checkError} from 'Helpers/helpers';
import TextField  from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {required,allowAlphaNumericWithoutSpace} from 'Validations';
import { saveConfiguration,viewconfigrationdetail } from 'Actions';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// intlmessages
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';


class BasicConfiguration extends Component {
  componentWillMount() {
    this.props.viewconfigrationdetail();
  }
   constructor(props) {
      super(props);
    this.state = this.getInitialState();
 }
    getInitialState()
     {
     this.initialState = {
                       configuration: {
                                  employeecode :'',
                                  membercode :'',
                                  enquirycode : '',
                                  hidememberbalanceandtransactions : 0,
                          },
                           errors : { },
                            validated : false,
                          confirmationDialog : false,
                        };
                return cloneDeep(this.initialState);
     }
  onChange(key,value)
   {
     let error= required(value);
     const {configuration} = this.state;
     if(key == 'employeecode' || key == 'membercode' || key == 'enquirycode')
     {
       value =  value.toUpperCase();
       value = allowAlphaNumericWithoutSpace(value);
     }
     else if (key == "hidememberbalanceandtransactions") {
       value = value?1:0;
       this.onSaveHideMemberBalance(value);
     }

       this.setState({
         configuration: {
           ...this.state.configuration,
             [key] : value
           },
           errors : {...this.state.configuration.errors,
             [key] : error
           }
       });
   }

   validate()
     {
       let errors = {};

       const configuration = this.state.configuration;

       errors.employeecode = required(configuration.employeecode);
       errors.membercode = required(configuration.membercode);
       errors.enquirycode = required(configuration.enquirycode);


       let validated = checkError(errors);

        this.setState({
          configuration: {	...this.state.configuration,
          },
             errors : errors, validated : validated
        });

        return validated;
   }

  onConfirm()
  {
    let configurationdetail = cloneDeep(this.state.configuration);
    if(this.validate())
    {
      this.props.saveConfiguration({configurationdetail});
    }
        this.setState({
      confirmationDialog : false,
    });
  }

  onSaveHideMemberBalance(value)
  {
    let configurationdetail = cloneDeep(this.state.configuration);

    configurationdetail.hidememberbalanceandtransactions = value;

      this.props.saveConfiguration({configurationdetail});

  }

  cancelConfirmation()
  {
    this.setState({
     confirmationDialog : false,
   });
  }

  onSave()
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

      let	{configurationsuccess,membercode,employeecode,enquirycode,hidememberbalanceandtransactions} = newProps;
      let {configuration} = this.state;
      if(!configurationsuccess && employeecode && membercode && enquirycode)
      {
        configuration.employeecode = employeecode;
        configuration.membercode = membercode;
        configuration.enquirycode = enquirycode;
      }

      if(!configurationsuccess)
      {
        configuration.hidememberbalanceandtransactions = hidememberbalanceandtransactions != null ? hidememberbalanceandtransactions : 0;
      }

  }

  render() {
    let {configuration} = this.state;
    const {errors,confirmationDialog} = this.state;
    const {disabled,employeecode,membercode, configurationsuccess,enquirycode,updateRights,addRights,clientProfileDetail,hidememberbalanceandtransactions} = this.props;

    return (
      <div className="configuration-wrapper w-50 p-20">
        <Form>
        {clientProfileDetail && clientProfileDetail.clienttypeId !=2 &&
        <div className="row">
           <Col sm={12}>
               <TextField required inputProps={{maxLength:5}}  disabled = {configurationsuccess || employeecode ? true:false} placeholder = "Example:EMP"  id="employeecode" autoFocus = {true} fullWidth label="Employee Code" value={configuration.employeecode} onChange={(e) =>this.onChange( 'employeecode' ,configurationsuccess || employeecode ? fields.employeecode :e.target.value)} />
                <FormHelperText  error> NOTE: Once defined can't be changed   </FormHelperText>
                 <FormHelperText  error> { configuration.employeecode ? "    Example: " + configuration.employeecode + "00001," +configuration.employeecode + "00002"  : ""} </FormHelperText>
                <FormHelperText  error>{errors.employeecode}</FormHelperText>
           </Col>
         </div>
       }
         <div className="row">
            <Col sm={12}>
                <TextField required inputProps={{maxLength:5}}  disabled = {configurationsuccess || membercode ? true:false} placeholder = "Example:MBR"  id="membercode" fullWidth label="Member Code"  value={configuration.membercode} onChange={(e) =>this.onChange( 'membercode' ,configurationsuccess || membercode ? fields.membercode :e.target.value)} />
                <FormHelperText  error>NOTE: Once defined can't be changed</FormHelperText>
                <FormHelperText  error> { configuration.membercode ? "    Example: " + configuration.membercode + "00001," +configuration.membercode + "00002"  : ""} </FormHelperText>
                 <FormHelperText  error>{errors.membercode}</FormHelperText>
            </Col>
          </div>
          <div className="row">
             <Col sm={12}>
                 <TextField required inputProps={{maxLength:5}}  disabled = {configurationsuccess || enquirycode ? true:false} placeholder = "Example:ENQ"  id="enquirycode" fullWidth label="Enquiry Code" value={configuration.enquirycode} onChange={(e) =>this.onChange( 'enquirycode' ,configurationsuccess || enquirycode ? fields.enquirycode :e.target.value)} />
                 <FormHelperText  error>NOTE: Once defined can't be changed</FormHelperText>
                 <FormHelperText  error> { configuration.enquirycode ? "    Example: " + configuration.enquirycode + "00001," +configuration.enquirycode + "00002"  : ""} </FormHelperText>
                  <FormHelperText  error>{errors.enquirycode}</FormHelperText>
             </Col>
           </div>

           <div className="row">
            {(updateRights && addRights) &&
               <Col sm={3}>
               <Button variant="contained"  disabled = {disabled} color="primary"  className="text-white" onClick={()=>this.onSave()}>
                 Save
                   </Button>
               </Col>
             }
           </div>
        </Form>
        <hr />

        <Form>
          {clientProfileDetail && clientProfileDetail.packtypeId == 3 && 
            <FormGroup row>
                <Col sm={12}>
                    <FormControlLabel  control={
                      <Checkbox color="primary"
                       checked={configuration.hidememberbalanceandtransactions==0?false:true}

                       onChange={(e) => this.onChange('hidememberbalanceandtransactions', e.target.checked )} />
                    }  label="Hide balance and transaction details from member in Member App"
                    />
                </Col>
            </FormGroup>
          }
       </Form>

      {
         confirmationDialog &&
       <DeleteConfirmationDialog
         openProps = {confirmationDialog}
         title="Are You Sure Want To Continue?"
         message="This will change your configurations ."
         onConfirm={() => this.onConfirm()}
          onCancel={() => this.cancelConfirmation()}
       />
       }
  </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const {disabled,configurationsuccess,employeecode,membercode,enquirycode,clientProfileDetail,hidememberbalanceandtransactions } = settings;
  return {  disabled,configurationsuccess,employeecode,membercode,enquirycode,clientProfileDetail,hidememberbalanceandtransactions};
};

export default withRouter(connect(mapStateToProps, {saveConfiguration,viewconfigrationdetail
})(BasicConfiguration));
