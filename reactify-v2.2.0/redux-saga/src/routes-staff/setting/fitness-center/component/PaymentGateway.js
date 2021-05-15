
/**
 * Profile Page
 */
import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import Col from 'reactstrap/lib/Col';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import InputLabel from '@material-ui/core/InputLabel';

import {cloneDeep ,checkError} from 'Helpers/helpers';
import TextField  from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {required} from 'Validations';
import { savePaymentGatewayConfiguration } from 'Actions';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// intlmessages
import FormHelperText from '@material-ui/core/FormHelperText';
import  Status from 'Assets/data/status';
import RadioGroup from '@material-ui/core/RadioGroup';
import PaymentConfiguration  from 'Assets/data/paymentconfiguration';
import Auth from '../../../../Auth/Auth';
const authObject = new Auth();

class PaymentGateway extends Component {

   constructor(props) {
      super(props);
    this.state = this.getInitialState();
 }
    getInitialState()
     {
     this.initialState = {
                       paymentgateway: {
                                fields :
                                {
                                  configurationtype :'',
                                  status: '2',
                                },
                           errors : { },
                            validated : false,
                          confirmationDialog : false,
                        }
                        };
                return cloneDeep(this.initialState);
     }
  onChange(key,value)
   {
     let error= required(value);
     const {paymentgateway} = this.state;
     let {fields} = this.state.paymentgateway;

     if(key == "configurationtype"){
        fields = Object.assign(fields,PaymentConfiguration.filter(x => x.name == value)[0].parameters)
       }

       this.setState({
         paymentgateway: {
           ...this.state.paymentgateway,
           fields : {...this.state.paymentgateway.fields,
             [key] : value,
           },
           errors : {...this.state.paymentgateway.errors,
             [key] : error
           },
         },
         "fields" : fields
       });
   }

   validate()
     {
         let errors = {};
           const {fields}  = this.state.paymentgateway;
               errors.mid = required(fields.mid);
               errors.secretkey = required(fields.secretkey);
               errors.configurationtype = required(fields.configurationtype);
               errors.website = required(fields.website);

               let validated = checkError(errors);

                this.setState({
                  paymentgateway: {	...this.state.paymentgateway,
                     errors : errors, validated : validated
                  }
                });
                   return validated;


      }

  onSave()
  {
    let fields = this.state.paymentgateway.fields;
    let paymentgatewaydetail = [];
    paymentgatewaydetail.push(fields);
    if(this.validate())
    {
      this.props.savePaymentGatewayConfiguration(paymentgatewaydetail);
    }
        this.setState({
      confirmationDialog : false,
    });
  }


  render() {
    let { fields} = this.state.paymentgateway;
    const {errors} = this.state.paymentgateway;
    const {disabled, clientProfileDetail} = this.props;
    let clientdetail = clientProfileDetail.paymentgateway;
    if(clientdetail){
     clientdetail.status = clientdetail.map(x => Status.filter(value => value.value == x.status)[0])[0];
     clientdetail.configurationtype = clientdetail.map(x => x.configurationtype)[0];
    }
    const {updateRights,addRights} = this.props;

    return (
      <div className="paymentgateway-wrapper w-50">
        <Form>
              {clientdetail && clientdetail.status &&clientdetail.status.value == "1" &&
              <div>
              <span className= "px-10 py-5 fs-15 fw-bold">
                {clientdetail.configurationtype}
              </span>
              <span className= "ml-5 px-10 py-5 fs-12 badge badge-success">
                {clientdetail.status.name}
              </span>
              </div>
              }

        <div className="row">
               <Col sm={6}>
               <div className ="row">
                  <label className="professionaldetail_padding mt-5" >Status</label>
                           <RadioGroup row aria-label="status" className ={'pl-15'}   name="status"   value={fields.status} onChange={(e) => this.onChange('status', e.target.value)}>
                           {
                             Status.map((status, key) => ( <FormControlLabel value={status.value} key= {'statusOption' + key} control={<Radio />} label={status.name} />))
                           }
                         </RadioGroup>
                   </div>
                 </Col>
                    <Col sm={6}>
                              <FormControl fullWidth>
                        <InputLabel htmlFor="configurationtype"></InputLabel>
                                  <Select displayEmpty value={fields.configurationtype} onChange={(e) => this.onChange('configurationtype', e.target.value,  true)}
                                    inputProps={{name: 'configurationtype', id: 'configurationtype', }}>
                                    <MenuItem value="" >
                                    Select Payment Gateway
                                    </MenuItem>
                                    {
                                      PaymentConfiguration.map((configurationtype, key) => ( <MenuItem value={configurationtype.name} key = {'idOption' + key }>{configurationtype.name}</MenuItem> ))
                                    }
                                  </Select>
                                  <FormHelperText  error>{errors.configurationtype}</FormHelperText>
                              </FormControl>
                       </Col>
           </div>
           {
          // <div className="row">
          //    <Col sm={6}>
          //        <TextField required  id="mid" autoFocus = {true} fullWidth label="Merchant ID" value={fields.mid} onChange={(e) =>this.onChange( 'mid' ,e.target.value)} />
          //         <FormHelperText  error>{errors.mid}</FormHelperText>
          //    </Col>
          //     <Col sm={6}>
          //       <TextField required  id="secretkey" fullWidth label="Secret Key"  value={fields.secretkey} onChange={(e) =>this.onChange( 'secretkey' , e.target.value)} />
          //        <FormHelperText  error>{errors.secretkey}</FormHelperText>
          //   </Col>
          //   <Col sm={6}>
          //     <TextField required  id="website" fullWidth label="Website" value={fields.website} onChange={(e) =>this.onChange( 'website' , e.target.value)} />
          //      <FormHelperText  error>{errors.website}</FormHelperText>
          // </Col>
          // </div>
        }

      {fields.configurationtype  &&
          <div className="row">
          {PaymentConfiguration.filter(x => x.name == fields.configurationtype)[0].PaytmLables.map((data, key) => (
             <Col sm={6} key ={key}>
                 <TextField required  autoFocus = {true} fullWidth label={Object.values(data)} value={fields[Object.keys(data)[0]] || ""} onChange={(e) =>this.onChange( Object.keys(data)[0],e.target.value)} />
                  <FormHelperText  error>{errors.mid}</FormHelperText>
             </Col>
           ))}
          </div>
        }

        </Form>
        <hr />
        {(updateRights && addRights) &&
        <Form>
            <FormGroup row>
                  <Col sm={3}>
                      <Button variant="contained"  disabled = {disabled} color="primary"  className="text-white" onClick={()=>this.onSave()}>
                      Save
                      </Button>
                  </Col>
            </FormGroup>
      </Form>
    }

  </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const {disabled, clientProfileDetail} = settings;
  return {  disabled, clientProfileDetail};
};

export default withRouter(connect(mapStateToProps, {savePaymentGatewayConfiguration
})(PaymentGateway));
