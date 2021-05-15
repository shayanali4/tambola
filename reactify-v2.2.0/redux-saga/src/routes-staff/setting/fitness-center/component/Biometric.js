
/**
 * Profile Page
 */
import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Col from 'reactstrap/lib/Col';
import {cloneDeep,checkModuleRights,getParams,checkError } from 'Helpers/helpers';
import FormHelperText from '@material-ui/core/FormHelperText';
import {required} from 'Validations';

import TextField  from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dropzone from 'react-dropzone';
import { RctCard } from 'Components/RctCard';
import ImageCropper from 'Components/ImageCropper';
import CustomConfig from 'Constants/custom-config';

import ReactTable from "react-table";
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';

import { saveClientBiometricConfiguration,opnAddNewBiometricModel,clsAddNewBiometricModel,getClientBiometric,opnViewClientBiometricModel,saveClientBiometric} from 'Actions';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import Switch from '@material-ui/core/Switch';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {isMobile} from 'react-device-detect';
import { push } from 'connected-react-router';

import {InvoiceConfig} from 'Constants/custom-config';
import AddBiometric from './AddBiometric';
import Viewbiometric from './viewbiometric';
import Status  from 'Assets/data/status';

class Biometric extends Component {

  constructor(props) {
     super(props);
   this.state = this.getInitialState();
}
   getInitialState()
    {
    this.initialState = {
                                   confirmationDialog : false,
                                   biometricdetail :{
                                     isbiometricenable : 0,
                                     url :''
                                   },

                                   errors : { },
                                  validated : false,
                                  dataToSave : null,
                                  saveConfirmationDialog : false,


                       };
               return cloneDeep(this.initialState);
    }
    onChange(key,value)
     {
       if(key == 'isbiometricenable')
       {
         value = (value ? 1 : 0);
       }
            this.setState({
             biometricdetail: {
               ...this.state.biometricdetail,
                 [key] : value,
               }
           });
     }

     onConfirm()
     {
       let {biometricdetail} = this.state;
       this.props.saveClientBiometricConfiguration({biometricdetail});
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
     onSave()
     {
       if(this.validate()){
         this.setState({
           confirmationDialog : true,
         });
       }

     }
     validate()
       {
         let errors = {};
         const {biometricdetail} = this.state;

         // if(biometricdetail.isbiometricenable == 1)
         // {
         //     errors.url = required(biometricdetail.url);
         // }

         let validated = checkError(errors);

          this.setState({
            biometricdetail: {	...this.state.biometricdetail,
            },
               errors : errors, validated : validated
          });

          return validated;
     }
     componentWillMount()
     {
       const {viewRights,clientProfileDetail} =  this.props;
       let {biometricdetail} = this.state;
       if(viewRights){
          if(clientProfileDetail && clientProfileDetail.biometric ){
                  biometricdetail.isbiometricenable = clientProfileDetail.biometric.isbiometricenable;
                }
          if(clientProfileDetail && clientProfileDetail.biometric && clientProfileDetail.biometric.isbiometricenable){
                biometricdetail.url = clientProfileDetail.biometric.url;
            }
          }
     }
     onAdd() {
   		this.props.opnAddNewBiometricModel();
   	}
     hashRedirect({pathname, hash, search })
       {
         if(hash == "#"+ "addbiometricdevice")
         {
           this.onAdd();
         }
         else if(hash == "#"+ "view")
          {
             let params = getParams(search);
             if(params && params.id)
             {
                  this.props.opnViewClientBiometricModel({id : params.id});
             }
         }
       }

       componentWillReceiveProps(nextProps, nextState) {

         const {pathname, hash, search} = nextProps.location;

          if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
         {
               this.props.clsAddNewBiometricModel();
               this.hashRedirect({pathname, hash, search});
         }
       }

       initiateSave(data,status)
       {
         let requestData = cloneDeep(data);
         requestData.status = status;

         this.setState({
           saveConfirmationDialog : true,
           dataToSave : requestData
         });
       }
       onSaveStatus(biometric)
       {
         this.setState({
           saveConfirmationDialog : false,
           dataToSave : null
         });
         this.props.saveClientBiometric({biometric});

       }
       cancelSave()
       {
         this.setState({
           saveConfirmationDialog : false,
           dataToSave : null
         });
       }

       // onSaveStatus(data,status){
       //   let biometric  = data;
       //   biometric.status = status;
       //   this.props.saveClientBiometric({biometric});
       // }
  render() {
    let {confirmationDialog,saveConfirmationDialog,dataToSave,biometricdetail,errors} = this.state;
    const {updateRights,addRights,deleteRights,clientProfileDetail,biometrics} = this.props;
    let columns = [
      {
        Header: "ACTION",
        Cell : data => (
          <div>
          {data.original.statusId == 2 ?
            <Button variant="contained"  onClick={() => this.initiateSave(data.original,"Active")}  className="text-white btn-primary">
              Active
            </Button>
            :
            <Button variant="contained"  onClick={() => this.initiateSave(data.original,"Inactive")}  className="text-white btn-primary">
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
        Header: "Biometric Device Name",
        accessor : 'biometricname',
        Cell : data => (
          <Link to= {"/app/setting/organization/4?id="+data.original.id+"#view"} >
            <h5 className = "text-uppercase">{ data.original.biometricname }</h5>
            </Link>
        )
     },
     {
       Header: "Serial number",
       accessor : 'serialnumber',
     },
     {
       Header: "Status",
       accessor : 'status',
     }
    ];

    return (
      <div className="textbiometricdetail-wrapper mb-10">
      <div  className= "row" >
      <div className = "col-12 col-md-6 col-xl-6 d-inline">
                   <div className = "col-12 ">

                           <div  className= "row" >
                               <div className ="professionaldetail_padding">Enable Biometric
                                  <Switch checked={biometricdetail.isbiometricenable==false?false:true} onChange={(e) => this.onChange('isbiometricenable', e.target.checked )} aria-label=""
                                     value="yes"		/>Yes
                              </div>
                          </div>

                    </div>
              {
                // (clientProfileDetail && clientProfileDetail.packtypeId == 3 && biometricdetail.isbiometricenable == 1) &&
                //   <div className = "col-12">
                //       <TextField required inputProps={{maxLength:50}}   id="url" autoFocus = {true} fullWidth label="url" value={biometricdetail.url} onChange={(e) =>this.onChange( 'url' ,e.target.value)} />
                //        <FormHelperText  error>{errors.url}</FormHelperText>
                //   </div>
            }
            {(updateRights && addRights) &&
            <div className="pb-20">
            <div className="col-4">
                <Button  color="primary" variant="contained" onClick={() => this.onSave()} className="text-white">Save</Button>
              </div>
            </div>
          }
    </div>
         {(biometricdetail.isbiometricenable == 1) &&
         <div className = "col-12 col-md-6 col-xl-6 d-inline">
                  <div className="d-flex justify-content-between mb-10">
                       <div>
                            <Link to="/app/setting/organization/4#addbiometricdevice"  className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Biometric Device</Link>
                        </div>
                    </div>
          <div className = "col-12  p-0  mb-40 ">
              <ReactTable
                 columns={columns}
                    filterable = { false}
                    manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                    sortable = { false }
                    data = {biometrics || []}
                    minRows = {biometrics && biometrics.length}
                   // Forces table not to paginate or sort automatically, so we can handle it server-side
                    showPagination= {false}
                    showPaginationTop = {false}
                    loading={false} // Display the loading overlay when we need it
                    defaultPageSize={4}
                    className=" -highlight"
                    freezeWhenExpanded = {true}
                    onFetchData = {(state, instance) => {this.props.getClientBiometric({state}) }}
                    />
          </div>
          </div>

        }

  </div>
  {
     confirmationDialog &&
   <DeleteConfirmationDialog
     openProps = {confirmationDialog}
     title="Are You Sure Want To Continue?"
     message= "This will change your biometric detail"
     onConfirm={() => this.onConfirm()}
      onCancel={() => this.cancelConfirmation()}
   />
   }
   {
     saveConfirmationDialog &&
     <DeleteConfirmationDialog
       openProps = {saveConfirmationDialog}
       title="Are You Sure Want To Change Status?"
       message= { <span className = 'text-capitalize'>{"New Status : " + dataToSave.status} <br/> {dataToSave.biometricname + " - " + dataToSave.serialnumber } </span> }
       onConfirm={() => this.onSaveStatus(dataToSave)}
        onCancel={() => this.cancelSave()}
     />
   }
   <AddBiometric/>
   <Viewbiometric/>
  </div>

    );
  }
}

const mapStateToProps = ({ settings }) => {
  const {clientProfileDetail,biometrics } = settings;
  return { clientProfileDetail,biometrics};
};

export default withRouter(connect(mapStateToProps, {saveClientBiometricConfiguration,opnAddNewBiometricModel,clsAddNewBiometricModel,
  getClientBiometric,opnViewClientBiometricModel,saveClientBiometric,push})(Biometric));
