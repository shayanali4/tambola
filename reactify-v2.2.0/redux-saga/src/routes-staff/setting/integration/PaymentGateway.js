
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
import { savePaymentGatewayConfiguration,savePaymentGatewayConfigurationStatus } from 'Actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// intlmessages
import FormHelperText from '@material-ui/core/FormHelperText';
import  Status from 'Assets/data/status';
import RadioGroup from '@material-ui/core/RadioGroup';
import PaymentConfiguration  from 'Assets/data/paymentconfiguration';
import {isMobile} from 'react-device-detect';
import ReactTable from "react-table";
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

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
                                  configurationvalue : '',
                                  status: '2',
                                },
                           errors : { },
                          validated : false,
                          confirmationDialog : false,
                          dataToSave : null,
                          saveConfirmationDialog : false,

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
        fields = Object.assign(fields,PaymentConfiguration.filter(x => x.name == value)[0].parameters);
        fields.configurationvalue = PaymentConfiguration.filter(x => x.name == value)[0].value;
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
           errors.configurationtype = required(fields.configurationtype);
           if(fields.configurationvalue == 1){
             errors.mid = required(fields.mid);
             errors.secretkey = required(fields.secretkey);
             errors.website = required(fields.website);
           }
           else if(fields.configurationvalue == 2){
             errors.client_id = required(fields.client_id);
             errors.secretkey = required(fields.secretkey);
           }

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
  initiateSave(data,status)
  {

    const {clientProfileDetail}  = this.props;
    let requestData = {};
    requestData.paymentgateway = cloneDeep(clientProfileDetail.paymentgateway);

    requestData.paymentgateway.forEach(x => {
      if(x.configurationvalue == data.configurationvalue )
      {
        x.status = status;
      }
    });
    requestData.status = status == 1 ? "Active" : "Inactive";
    requestData.configurationtype = data.configurationtype;


    this.setState({
      saveConfirmationDialog : true,
      dataToSave : requestData
    });
  }
  onSaveStatus(data)
  {
    this.setState({
      saveConfirmationDialog : false,
      dataToSave : null
    });
     data = data.paymentgateway;
    this.props.savePaymentGatewayConfigurationStatus(data);

  }
  cancelSave()
  {
    this.setState({
      saveConfirmationDialog : false,
      dataToSave : null
    });
  }
  render() {
    let { fields,errors} = this.state.paymentgateway;
    const {saveConfirmationDialog,dataToSave} = this.state;
    const {disabled, clientProfileDetail,updateRights,addRights} = this.props;
    let clientdetail = clientProfileDetail.paymentgateway;
    return (
      <div className="paymentgateway-wrapper w-50 p-20">
        <Form>
                <div className="row">
                         <Col sm={12} xl ={6}>
                             <div className ="row">
                                <label className="professionaldetail_padding" >Status</label>
                                         <RadioGroup row aria-label="status" className ={'pl-15'}   name="status"   value={fields.status} onChange={(e) => this.onChange('status', e.target.value)}>
                                         {
                                           Status.map((status, key) => ( <FormControlLabel value={status.value} key= {'statusOption' + key} control={<Radio />} label={status.name} />))
                                         }
                                       </RadioGroup>
                                 </div>
                           </Col>
                     </div>
                     <div className="row">
                           <Col sm={12} xl ={6}>
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
                    {fields.configurationtype  &&
                        <div className="row">
                        {PaymentConfiguration.filter(x => x.name == fields.configurationtype)[0].PaytmLables.map((data, key) => (
                           <Col sm={6} key ={key}>
                               <TextField required  autoFocus = {true} fullWidth label={Object.values(data)} value={fields[Object.keys(data)[0]] || ""} onChange={(e) =>this.onChange( Object.keys(data)[0],e.target.value)} />
                                <FormHelperText  error>{errors[Object.keys(data)[0]] || ""}</FormHelperText>
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
    <div className = "col-12 col-md-8 col-xl-8 p-0 pb-20 ">
        <ReactTable
           columns={[
             {
               Header: "ACTION",
               Cell : data => (
                 <div>
                 {data.original.status == 2 ?
                   <Button variant="contained" style={{minWidth : '80px'}}  onClick={() => this.initiateSave(data.original,1)}  className="text-white btn-primary">
                     Active
                   </Button>
                   :
                   <Button variant="contained" style={{minWidth : '65px'}} onClick={() => this.initiateSave(data.original,2)}  className="text-white btn-primary">
                       Inactive
                     </Button>
                   }
                 </div>
               ),
               filterable : false,
               sortable : false,
               minWidth:85,
               className : "text-center",
             },
             {
               Header: "Payment Gateway",
               accessor : 'configurationtype',
               minWidth:120

            },
            {
              Header: "Status",
              accessor : 'status',
              Cell : data => (
                  <h5>{ data.original.status == 1 ? "Active" : "Inactive" }</h5>
              ),
              minWidth:80
            }]
          }
              filterable = { false}
              manual // Forces table not to paginate or sort automatically, so we can handle it server-side
              sortable = { false }
              data = {clientdetail || []}
              minRows = {clientdetail && clientdetail.length}
             // Forces table not to paginate or sort automatically, so we can handle it server-side
              showPagination= {false}
              showPaginationTop = {false}
              loading={false} // Display the loading overlay when we need it
              defaultPageSize={4}
              className=" -highlight"
              freezeWhenExpanded = {true}
              />
        </div>
        {
          saveConfirmationDialog &&
          <DeleteConfirmationDialog
            openProps = {saveConfirmationDialog}
            title="Are You Sure Want To Change Status?"
            message= { <span className = 'text-capitalize'>{dataToSave.configurationtype + " New Status : " + dataToSave.status}  </span> }
            onConfirm={() => this.onSaveStatus(dataToSave)}
             onCancel={() => this.cancelSave()}
          />
        }
  </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const {disabled,clientProfileDetail} = settings;
  return {disabled,clientProfileDetail};
};
export default withRouter(connect(mapStateToProps, {savePaymentGatewayConfiguration,savePaymentGatewayConfigurationStatus
})(PaymentGateway));
