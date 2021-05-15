
  import React, { Component } from 'react';

  // rct card box
  import { RctCard } from 'Components/RctCard';

  // page title bar
  import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

  // intl messages
  import IntlMessages from 'Util/IntlMessages';
  import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
  import {isMobile} from 'react-device-detect';
  import Form from 'reactstrap/lib/Form';
  import { connect } from 'react-redux';
  import {checkModuleRights,cloneDeep,getParams,checkError} from 'Helpers/helpers';
  import Switch from '@material-ui/core/Switch';
  import Button from '@material-ui/core/Button';
  import AddBiometric from './AddBiometric';
  import Viewbiometric from './viewbiometric';
  import Status  from 'Assets/data/status';
  import ReactTable from "react-table";
  import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
  import { Link } from 'react-router-dom';
  import { saveClientBiometricConfiguration,opnAddNewBiometricModel,clsAddNewBiometricModel,getClientBiometric,opnViewClientBiometricModel,saveClientBiometric} from 'Actions';
  import PaymentGateway from './PaymentGateway';
  import InputLabel from '@material-ui/core/InputLabel';
  import Input from '@material-ui/core/Input';
  import FormControlLabel from '@material-ui/core/FormControlLabel';
  import InputAdornment from '@material-ui/core/InputAdornment';
  import FormHelperText from '@material-ui/core/FormHelperText';
  import  FormControl  from '@material-ui/core/FormControl';
  import {required} from 'Validations';
  import Tooltip from '@material-ui/core/Tooltip';
  import { NotificationManager } from 'react-notifications';


  class Integration extends Component {
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
                           isInbodyenable : 0,
                           errors : { },
                          validated : false,
                          dataToSave : null,
                          saveConfirmationDialog : false,
                          geofencingdetail :{
                            isgeofencingenable : 0,
                            geofencingarea :''
                          },
                          areachecker : null,
                         };
                 return cloneDeep(this.initialState);
      }

      onChange(key,value)
       {
         let {areachecker} = this.state;
         if(key == 'isbiometricenable')
         {
           value = (value ? 1 : 0);
           this.setState({
            biometricdetail: {
              ...this.state.biometricdetail,
                [key] : value,
              }
          });
         }
         else if(key == 'isgeofencingenable')
         {
           value = (value ? 1 : 0);
           if(!value)
           {
             this.state.geofencingdetail.geofencingarea = '';
           }

           this.setState({
            geofencingdetail: {
              ...this.state.geofencingdetail,
                [key] : value,
              }
          });
         }
         else if(key == 'geofencingarea')
         {
           areachecker = this.strengthObject(value);
           this.setState({
            areachecker : areachecker,
            geofencingdetail: {
              ...this.state.geofencingdetail,
                [key] : value,
              }
          });
         }
         if(key == 'isInbodyenable')
         {
           value = (value ? 1 : 0);
           this.setState({
              [key] : value,
          });
         }

       }
       onConfirm()
       {
         let {biometricdetail,isInbodyenable,geofencingdetail} = this.state;
         this.props.saveClientBiometricConfiguration({biometricdetail,isInbodyenable,geofencingdetail});
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
          let {biometricdetail,geofencingdetail,isInbodyenable,integration_old} = this.state;
         if(this.validate()){
           if((JSON.stringify(integration_old.biometricdetail) != JSON.stringify(biometricdetail)) ||
              (JSON.stringify(integration_old.geofencingdetail) != JSON.stringify(geofencingdetail)) ||
              (JSON.stringify(integration_old.isInbodyenable) != JSON.stringify(isInbodyenable)))
           {
               this.setState({ confirmationDialog : true });
           }
           else {
             NotificationManager.error('No changes detected');
           }
         }
       }
       validate()
         {
           let errors = {};
           const {biometricdetail,geofencingdetail} = this.state;

           if(geofencingdetail.isgeofencingenable)
           {
              errors.geofencingarea = required(geofencingdetail.geofencingarea);
           }


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
         const {clientProfileDetail} =  this.props;
         let {biometricdetail,geofencingdetail} = this.state;
            if(clientProfileDetail){
            let isInbodyenable = clientProfileDetail.isinbody;
            this.state.isInbodyenable = isInbodyenable;
               if(clientProfileDetail.biometric ){
                    biometricdetail.isbiometricenable = clientProfileDetail.biometric.isbiometricenable;
                    if(clientProfileDetail && clientProfileDetail.biometric && clientProfileDetail.biometric.isbiometricenable){
                       biometricdetail.url = clientProfileDetail.biometric.url;
                  }
              }
              if(clientProfileDetail.geofencing ){
                   geofencingdetail.isgeofencingenable = clientProfileDetail.geofencing.isgeofencingenable;
                   if(clientProfileDetail.geofencing.isgeofencingenable){
                      geofencingdetail.geofencingarea = clientProfileDetail.geofencing.geofencingarea;
                 }
             }
             this.state.integration_old = cloneDeep({biometricdetail,geofencingdetail,isInbodyenable});
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

         strengthObject(count){
            if (count > 0 && count < 50)
               return {
                           message:'Too Tight',
                           color : '#39c694'
                       };
           else if (count >= 50 && count <= 300)
               return {
                           message:'Normal',
                           color : '#D46B08'
                    };
           else if (count > 300)
               return {
                           message:'Too Wide',
                           color : '#bf3c23'
                     };
         }



    render() {
      const {userProfileDetail,biometrics,clientProfileDetail} = this.props;
      let {confirmationDialog,saveConfirmationDialog,dataToSave,biometricdetail,errors,isInbodyenable,
        geofencingdetail,areachecker} = this.state;
      let updateRights =  checkModuleRights(userProfileDetail.modules,"integration","update");
      let addRights =  checkModuleRights(userProfileDetail.modules,"integration","add");
      let columns = [
        {
          Header: "ACTION",
          Cell : data => (
            <div>
            {data.original.statusId == 2 ?
              <Button variant="contained" style={{minWidth : '80px'}}  onClick={() => this.initiateSave(data.original,"Active")}  className="text-white btn-primary">
                Active
              </Button>
              :
              <Button variant="contained" style={{minWidth : '65px'}} onClick={() => this.initiateSave(data.original,"Inactive")}  className="text-white btn-primary">
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
            <Link to= {"/app/setting/integration?id="+data.original.id+"#view"} >
              <h5 className = "text-uppercase">{ data.original.biometricname }</h5>
              </Link>
          ),
          minWidth:160
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
        <div className="userProfile-wrapper">
          <PageTitleBar title={<IntlMessages id="sidebar.integration" />} match={this.props.match} />
        {clientProfileDetail && clientProfileDetail.serviceprovidedId != 1 &&
          <RctCollapsibleCard
           heading= "Integration Configuration"
            headingCustomClasses="border-bottom"
            collapsible = {false}
            closeable = {false}
            fullBlock
          >
          <div className={"profile-wrapper w-100 py-20 px-20"}>
              <div  className= "row" >

                               <div className = "col-12 ">

                                       <div  className= "row" >
                                           <div className ="col-7 col-sm-7 col-md-3 col-xl-2 professionaldetail_padding">
                                              Enable Biometric
                                          </div>
                                          <div className = "col-5 col-sm-5 col-md-4 col-xl-8 d-inline pt-5">
                                            <Switch checked={biometricdetail.isbiometricenable==0?false:true} onChange={(e) => this.onChange('isbiometricenable', e.target.checked )} aria-label=""
                                             value="yes"		/>Yes
                                          </div>
                                      </div>

                                </div>
                                {clientProfileDetail && clientProfileDetail.packtypeId == 3 &&
                                <div className = "col-12 ">
                                        <div  className= "row" >
                                            <div className ="col-7 col-sm-7 col-md-3 col-xl-2 professionaldetail_padding">
                                                Enable InBody
                                           </div>
                                           <div className = "col-5 col-sm-5 col-md-4 col-xl-8 d-inline pt-5">
                                              <Switch checked={isInbodyenable==0?false:true} onChange={(e) => this.onChange('isInbodyenable', e.target.checked )} aria-label=""
                                              value="yes"		/>Yes
                                           </div>
                                       </div>

                                 </div>
                               }

                                 <div className = "col-12 ">

                                         <div  className= "row" >
                                             <div className ="col-7 col-sm-7 col-md-3 col-xl-2 professionaldetail_padding">
                                                 Enable Geofencing
                                            </div>
                                            <div className = {"col-5 col-sm-5 col-md-2 col-xl-1 d-inline pt-5 pr-0 " + (isMobile ? " " : " mr-20")}>
                                              <Switch checked={geofencingdetail.isgeofencingenable==0?false:true} onChange={(e) => this.onChange('isgeofencingenable', e.target.checked )} aria-label=""
                                              value="yes"		/>Yes
                                            </div>
                                            {geofencingdetail.isgeofencingenable == 1 &&
                                                <div className= {"col-10 col-sm-10 col-md-5 col-xl-3 " } >
                                                <FormControl fullWidth>
                                                 <InputLabel required htmlFor="geofencingarea" >Geofencing Area</InputLabel>
                                                     <Input
                                                       id="geofencingarea"
                                                       type= "number"
                                                       inputProps={{min:0,max :5000}}
                                                       value={geofencingdetail.geofencingarea}
                                                       onChange={(e) => this.onChange('geofencingarea',e.target.value > 5000 ? 5000 : e.target.value)}
                                                       endAdornment={'meters'}
                                                     />
                                                     {
                                                       areachecker ? <FormHelperText style = {{color: areachecker.color}}>{areachecker.message}</FormHelperText> : <FormHelperText  error>{errors.geofencingarea}</FormHelperText>
                                                     }

                                                    </FormControl>
                                                </div>
                                            }
                                        </div>

                                  </div>

                          {(updateRights && addRights) &&
                            <div className="pb-20 pt-20">
                                <div className="col-3">
                                    <Button  color="primary" variant="contained" onClick={() => this.onSave()} className="text-white">Save</Button>
                                  </div>
                            </div>
                        }

                </div>

                  {(biometricdetail.isbiometricenable == 1) &&
                  <div className = "col-12 col-md-6 col-xl-6 d-inline">
                           <div className="d-flex justify-content-between mb-10">
                                <div>
                                     <Link to="/app/setting/integration#addbiometricdevice"  className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Biometric Device</Link>
                                 </div>
                             </div>
                   <div className = "col-12 col-md-8 col-xl-6  p-0  mb-40 ">
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
              message= "This will change your integration settings."
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
            </RctCollapsibleCard>
          }
           {clientProfileDetail && clientProfileDetail.packtypeId == 3 &&
            <RctCollapsibleCard
             heading= "Payment Gateway"
              headingCustomClasses="border-bottom"
              collapsible = {false}
              closeable = {false}
              fullBlock
            >
            <PaymentGateway updateRights ={updateRights} addRights ={addRights}/>
            </RctCollapsibleCard>
          }
          </div>
      );
    }
  }
  const mapStateToProps = ({ settings }) => {
    const {  userProfileDetail,biometrics,clientProfileDetail} = settings;
    return {  userProfileDetail,biometrics ,clientProfileDetail};
  };

  export default connect(mapStateToProps,{saveClientBiometricConfiguration,opnAddNewBiometricModel,clsAddNewBiometricModel,
    getClientBiometric,opnViewClientBiometricModel,saveClientBiometric})(Integration);
