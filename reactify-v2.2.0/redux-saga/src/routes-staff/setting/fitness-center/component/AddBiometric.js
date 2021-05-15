import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewBiometricModel,saveClientBiometric } from 'Actions';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { push } from 'connected-react-router';
import {isMobile} from 'react-device-detect';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import {checkError, cloneDeep} from 'Helpers/helpers';
import FormHelperText from '@material-ui/core/FormHelperText';
import {required,checkDecimal} from 'Validations';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { NotificationManager } from 'react-notifications';
import ReactTable from "react-table";
import   Checkbox  from '@material-ui/core/Checkbox';
import PerfectScrollbar from 'Components/PerfectScrollbar';
class AddBiometric extends Component {
  constructor(props) {
       super(props);
               this.state = this.getInitialState();
          }

   getInitialState()
    {
          this.initialState = {
                      biometricDetail:
                      {
                        fields : {
                                      id:0,
                                      biometricname: '',
                                      serialnumber :'',
                                    },
                                    errors : { },
                                    validated : false,
                                },
                            };
                        return cloneDeep(this.initialState);
                    }
                    onChange(key,value, isRequired)
                      {
                        let {taxgroupitem} = this.state.biometricDetail.fields;
                        let error= isRequired ? required(value) : '';

                        this.setState({
                          biometricDetail: {
                            ...this.state.biometricDetail,
                            fields : {...this.state.biometricDetail.fields,
                              [key] : value,
                              taxgroupitem : taxgroupitem
                            },
                            errors : {...this.state.biometricDetail.errors,
                              [key] : error
                            },

                          }
                        });
                       }

                       validate()
                        {
                            let errors = {};
                            const fields = this.state.biometricDetail.fields;

                            errors.biometricname = required(fields.biometricname);
                            errors.serialnumber = required(fields.serialnumber);

                            let validated = checkError(errors);

                             this.setState({
                               biometricDetail: {	...this.state.biometricDetail,
                                  errors : errors, validated : validated
                               }
                             });
                             return validated;
                         }
                         onSave()
                         {
                           const {biometricDetail} = this.state;
                                 if(this.validate())
                                 {
                                       let biometric  = biometricDetail.fields;
                                       this.props.saveClientBiometric({biometric});
                                    }
                                }

	onClose()
		{
      this.setState(this.getInitialState());
			this.props.clsAddNewBiometricModel();
			this.props.push('/app/setting/organization/4');
		}
    // componentWillReceiveProps(newProps)
    //     {
    //         const	{taxlist} = newProps;
    //         let {biometricDetail} = this.state;
    //         biometricDetail = biometricDetail.fields;
    //           if(taxlist  && !biometricDetail.taxgroupitem)
    //           {
    //             biometricDetail.taxgroupitem = taxlist;
    //             biometricDetail.taxgroupitem.forEach(x =>x.checked = false);
    //           }
    //
    //     }
        componentWillUpdate(nextProps, nextState)
              {
                  if((this.props.addNewBiometricModal != nextProps.addNewBiometricModal))
                    {
                         this.setState(this.getInitialState());
                    }
              }

	render() {
	 const	{ addNewBiometricModal } = this.props;
   const {fields,errors} = this.state.biometricDetail;
		return (
      <Dialog  fullWidth fullScreen = {isMobile ? true : false}
          onClose={() => this.onClose()}
          open={addNewBiometricModal}
        >
        <DialogTitle >
              <CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>
              <span className="fw-bold text-capitalize">ADD BIOMETRIC DEVICE</span>
        </DialogTitle>
          <DialogContent>
          <RctCollapsibleCard >
             <form noValidate autoComplete="off">
                   <div className="row">
                       <div className="col-sm-6 col-md-6 col-xl-6">
                             <TextField  required inputProps={{maxLength:50}}  id="biometricname" autoFocus = {true} fullWidth label= "Biometric Device Name"  value={fields.biometricname} onChange={(e) => this.onChange('biometricname',e.target.value, true)} onBlur = {(e) => this.onChange('biometricname',e.target.value, true)}/>
                             <FormHelperText  error>{errors.biometricname}</FormHelperText>
                        </div>
                        <div className="col-sm-6 col-md-6 col-xl-6">
                              <TextField  required inputProps={{maxLength:50}}  id="serialnumber" fullWidth label= "Serial Number"  value={fields.serialnumber} onChange={(e) => this.onChange('serialnumber',e.target.value, true)} onBlur = {(e) => this.onChange('serialnumber',e.target.value, true)}/>
                              <FormHelperText  error>{errors.serialnumber}</FormHelperText>
                         </div>

                  </div>
                  </form>
             </RctCollapsibleCard>
          </DialogContent>
          <DialogActions>
           <Button variant="contained" onClick={() => this.onSave()} className="btn-primary text-white">
                Save
            </Button>
           <Button variant="contained"  onClick={() => this.onClose()}  className="btn-danger text-white">
                Cancel
            </Button>
            </DialogActions>

        </Dialog>

	);
  }
  }
const mapStateToProps = ({ settings }) => {
	const {addNewBiometricModal} =  settings;
  return { addNewBiometricModal}
}

export default connect(mapStateToProps,{
	clsAddNewBiometricModel,saveClientBiometric,push})(AddBiometric);
