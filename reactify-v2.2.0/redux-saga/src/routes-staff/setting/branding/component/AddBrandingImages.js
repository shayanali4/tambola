

import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Col from 'reactstrap/lib/Col';
import {cloneDeep ,checkError,checkModuleRights} from 'Helpers/helpers';
import Dropzone from 'react-dropzone';
import TextField  from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { NotificationManager } from 'react-notifications';
import CustomConfig from 'Constants/custom-config';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// intlmessages
import FormHelperText from '@material-ui/core/FormHelperText';
import IntlMessages from 'Util/IntlMessages';
import api, {fileUploadConfig ,fileDownloadConfig} from 'Api';
import FormData from 'form-data';
import {required} from 'Validations';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { RctCard } from 'Components/RctCard';
import { getClientProfile } from 'Actions';
import ImageCropper from 'Components/ImageCropper';
import ImageCompressor from 'Components/ImageCompressor';
import { push } from 'connected-react-router';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import ColorPicker from 'material-ui-color-picker';


const styles = theme => ({
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

  class AddBrandingImages extends Component {

   componentWillMount() {
     let userProfileDetail = this.props.userProfileDetail;
     if(checkModuleRights(userProfileDetail.modules,"branding","view")){
     }
     else{
       this.props.push('/app/dashboard/master-dashboard');
     }
     this.setBrandingDetails();
   }

   constructor(props) {
      super(props);
      this.state = this.getInitialState();
    }

    getInitialState()
     {
     this.initialState = {
                      loading : false,
                      confirmationDialog : false,
                      logoImageCompressed : null,
                      signinpotraitImageCropped : null,
                      signinlandscapeImageCropped : null,
                      memberprofileImageCropped : null,
                      sidebarImageCropped : null,
                      invoiceImageCropped : null,
                      imageHeightWidth : {},


                       brandingDetail: {
                          fields:{
                                  tagline : '',
                                  logoimageFiles : [],
                                  logoimage : '',
                                  signinpotraitimageFiles : [],
                                  signinlandscapeimageFiles : [],
                                  signinpotraitimages : [],
                                  signinlandscapeimages : [],
                                  memberprofileimageFiles : [],
                                  memberprofileimages : [],
                                  sidebarimageFiles : [],
                                  sidebarimages : [],
                                  invoiceimageFiles : [],
                                  invoiceimages : '',
                                  singninfontportrait: null,
                                  singninfontlandscap:null,
                                  brandname : ''
                              },
                           errors : { },
                           validated : false
                        },

                 }
                return cloneDeep(this.initialState);
     }

     componentWillReceiveProps(newProps)
     {
       const	{clientProfileDetail} = newProps;
       if(clientProfileDetail != this.props.clientProfileDetail)
       {
         this.setBrandingDetails(clientProfileDetail);
       }
     }

     setBrandingDetails(clientProfileDetail)
     {
       clientProfileDetail = clientProfileDetail == undefined ? this.props.clientProfileDetail: clientProfileDetail;
       if(clientProfileDetail)
       {
         let {brandingDetail} = this.state;
         brandingDetail = brandingDetail.fields;

         brandingDetail.id = clientProfileDetail.id;
         brandingDetail.tagline = clientProfileDetail.tagline;
         brandingDetail.logoimage = clientProfileDetail.logo;
         brandingDetail.brandname = clientProfileDetail.organizationbrandname;


        clientProfileDetail.signinbackgroundimage = clientProfileDetail.signinbackgroundimage;

         brandingDetail.signinpotraitimages = clientProfileDetail.signinbackgroundimage.filter(x => x.isMobile).length > 0 ? [clientProfileDetail.signinbackgroundimage.filter(x => x.isMobile)[0].file] : [];

         brandingDetail.signinlandscapeimages = clientProfileDetail.signinbackgroundimage.filter(x => !x.isMobile).length > 0 ? [clientProfileDetail.signinbackgroundimage.filter(x => !x.isMobile)[0].file] : [];

         brandingDetail.memberprofileimages = clientProfileDetail.memberprofilecoverimage;
         brandingDetail.sidebarimages = clientProfileDetail.sidebarimage ;
         brandingDetail.invoiceimages = clientProfileDetail.invoicebannerimage;

         brandingDetail.singninfontportrait = clientProfileDetail.singninfontportrait;
         brandingDetail.singninfontlandscap = clientProfileDetail.singninfontlandscap;


         this.state.branding_old = cloneDeep(brandingDetail);

       }
     }

     onChangeBranding(key,value, isRequired)
     	{

         let fields = this.state.brandingDetail.fields;
     		 let error= isRequired ? required(value) : '';

         let sidebarimagefiles = fields.sidebarimageFiles;

         if(key == "sidebarimageFiles")
         {
            let sidebartotal = sidebarimagefiles.length + fields.sidebarimages.length + value.length;
            if(sidebartotal <= 4)
             {
               value = sidebarimagefiles.concat(value);
             }
             else {
                      NotificationManager.error("Maximum 4 images can be uploaded");
                      return false;
                  }
          }

       		this.setState({
       			brandingDetail: {
       				...this.state.brandingDetail,
       				fields : {...this.state.brandingDetail.fields,
       					[key] : value,
            	},
       				errors : {...this.state.brandingDetail.errors,
       					[key] : error
       				},
       			}
         	});
      }



      getImageDefaultHeightWidth(value)
      {
        if(value == 1)
        {
          return {width : 768 ,height : 1080, size : 0.15};
        }
        else if (value == 2) {
          return {width : 1440 ,height : 800 , size : 0.15};
        }
        else if (value == 3) {
          return  {width : 1280 ,height : 265 , size : 0.12};
        }
        else if (value == 4) {
          return  {width : 365 ,height : 1000 , size : 0.12};
        }
        else if (value == 5) {
          return {width : 200 ,height : 200 , size : 0.1};
        }
      }
      onChangeImageToCrop(key,value)
      {
        if(key == "signinpotraitimageFiles")
        {
            this.setState({signinpotraitImageCropped : value[0] , imageHeightWidth : this.getImageDefaultHeightWidth(1)});
        }
        else if(key == "signinlandscapeimageFiles")
        {
            this.setState({signinlandscapeImageCropped : value[0], imageHeightWidth : this.getImageDefaultHeightWidth(2)});
        }
        else if(key == "memberprofileimageFiles")
        {
            this.setState({memberprofileImageCropped : value[0], imageHeightWidth : this.getImageDefaultHeightWidth(3)});
        }
        else if(key == "invoiceimageFiles")
        {
            this.setState({invoiceImageCropped : value[0], imageHeightWidth : this.getImageDefaultHeightWidth(3)});
        }
        else if(key == "sidebarimageFiles")
        {
            this.setState({sidebarImageCropped : value[0], imageHeightWidth : this.getImageDefaultHeightWidth(4)});
        }
        else if(key == "logoimageFiles")
        {
            this.setState({logoImageCompressed : value[0], imageHeightWidth : this.getImageDefaultHeightWidth(5)});
        }
      }

      onChangeCroppedImage(croppedimage)
      {
        if(this.state.signinpotraitImageCropped != null)
        {
            this.onChangeBranding("signinpotraitimageFiles",[croppedimage])
        }
        else if(this.state.signinlandscapeImageCropped != null)
        {
            this.onChangeBranding("signinlandscapeimageFiles",[croppedimage])
        }
        else if(this.state.memberprofileImageCropped != null)
        {
            this.onChangeBranding("memberprofileimageFiles",[croppedimage])
        }
        else if(this.state.invoiceImageCropped != null)
        {
            this.onChangeBranding("invoiceimageFiles",[croppedimage])
        }
        else if(this.state.sidebarImageCropped != null)
        {
            this.onChangeBranding("sidebarimageFiles",[croppedimage])
        }
        else if(this.state.logoImageCompressed != null)
        {
          if(croppedimage)
          {
            this.onChangeBranding("logoimageFiles",[croppedimage])
          }
        }

        this.onCloseImageCropperDialog();
      }

    saveBrandingDetails()
     {

       let data = this.state.brandingDetail.fields;

       var formData = new FormData();
       formData.append('brandingDetail', JSON.stringify(data));


       data.logoimageFiles.map((files) => formData.append("logofiles", files));
       data.signinpotraitimageFiles.map((files) => formData.append("signinfilespotrait", files));
       data.signinlandscapeimageFiles.map((files) => formData.append("signinfileslandscape", files));
       data.memberprofileimageFiles.map((files) => formData.append("memberprofilefiles", files));
       data.invoiceimageFiles.map((files) => formData.append("invoicefiles", files));
       data.sidebarimageFiles.map((files) => formData.append("sidebarfiles", files));

         this.setState({loading : true});

        api.post('save-client-branding', formData, fileUploadConfig)
        .then(response =>
           {
             NotificationManager.success("Details updated successfully");
             this.setState(this.getInitialState());
             this.props.getClientProfile();
           }
         ).catch(error =>{ console.log(error);  this.setState({loading : false});})
        }

    onRemoveImage(key,data)
    	{
               let imageFiles =  this.state.brandingDetail.fields[key];
                imageFiles.splice( imageFiles.indexOf(data), 1 );

                this.setState({
            			brandingDetail: {
            				...this.state.brandingDetail,
            				fields : {...this.state.brandingDetail.fields,
                        [key] : imageFiles},
            			}
              	});
       }

    onCloseImageCropperDialog()
       {
            this.setState({
                signinpotraitImageCropped : null,
                signinlandscapeImageCropped : null,
                memberprofileImageCropped : null,
                sidebarImageCropped : null,
                logoImageCompressed : null,
                invoiceImageCropped : null
            });
       }



  render() {

    const {fields, errors} = this.state.brandingDetail;
    let {confirmationDialog,signinpotraitImageCropped,signinlandscapeImageCropped,memberprofileImageCropped,sidebarImageCropped, logoImageCompressed ,imageHeightWidth,loading,branding_old,invoiceImageCropped} = this.state;
    const sidebarfiles = fields.sidebarimageFiles;
    let  dropzoneRefsidebar;
    const { classes, userProfileDetail } = this.props;
		const buttonClassname = classNames({
			[classes.buttonSuccess]: loading,
		});


console.log(fields);
    return (
      <div className="profile-wrapper w-100 px-20 py-20">

        <Form>
              <FormGroup row>
                <Col  sm={2}>Organization Logo</Col>
                  <Col sm={3}>
                  <div className="center-block d-flex">
                  <Dropzone  onDrop={(logoimageFiles) =>this.onChangeImageToCrop('logoimageFiles',logoimageFiles)} accept="image/jpeg, image/png" multiple={false} >
                                  {({getRootProps, getInputProps}) => (
                                    <section >
                                      <div
                                        {...getRootProps({
                                          className: 'rounded-circle border-primary center-block pointer'
                                        })}
                                      >
                                        <input {...getInputProps()} />

                        <div>
                          {fields.logoimageFiles != null && fields.logoimageFiles.length > 0 ?
                                 <img src={fields.logoimageFiles[0].preview} key= {'pro'} alt="" type="file" name="logoimageFiles" className="size-120 rounded-circle border-primary rct-notify" width="50" height="50" />
                               : <img src={fields.logoimage ? CustomConfig.serverUrl + fields.logoimage : (require('Assets/img/site-logo.jpg'))}  alt = ""  className="size-120 rounded-circle border-primary rct-notify" width="50" height="50"
                                onError={(e)=>{e.target.src = (require('Assets/img/site-logo.jpg'))}}/>
                          }
                          </div>
                          </div>
                        </section>
                      )}
                  </Dropzone>
                  <div >
                  <Fab className="btn-white text-primary ml-10" variant="round" mini= "true"  onClick={() =>
                        {
                            if(fields.logoimageFiles.length > 0)
                            {
                              this.setState({
                                brandingDetail: {
                                  ...this.state.brandingDetail,
                                  fields : {...this.state.brandingDetail.fields,
                                      'logoimageFiles' : []},
                                }
                              });
                            }
                            else if(fields.logoimage.length > 0)
                            {
                              this.setState({
                                brandingDetail: {
                                  ...this.state.brandingDetail,
                                  fields : {...this.state.brandingDetail.fields,
                                      'logoimage' : []},
                                }
                              });
                            }
                        }
                      } >
                        <i className="zmdi zmdi-delete pointer fs-20"></i>
                  </Fab>
              </div>
              </div>
            </Col>
            </FormGroup>

               <FormGroup row>
                  <Col sm={6}>
                  <TextField inputProps={{maxLength:50}}  id="tagline" fullWidth label="Organization Tagline"  value={fields.tagline} onChange={(e) =>this.onChangeBranding( 'tagline' ,e.target.value)} />
                  </Col>
                  <Col sm={6}>
                  <TextField inputProps={{maxLength:100}}  id="brandname" fullWidth label="Organization Brand Name"  value={fields.brandname} onChange={(e) =>this.onChangeBranding( 'brandname' ,e.target.value)} />
                  </Col>
               </FormGroup>
               <div className="row">
               <div className="col-12 col-md-6 col-xl-4 mb-10">
                  <ColorPicker
                    floatingLabelText='Select Signin form (Potrait) font color'
                    name='color1'
                    defaultValue={fields.tagline || "#000000"}
                    value={fields.singninfontportrait || "#000000"}
                    onChange={color => {if(color){ this.onChangeBranding('singninfontportrait', color);}  }}
                />
               </div>
               <div className="col-12 col-md-6 col-xl-4 mb-10">
                  <ColorPicker
                    label='Select Signin form(Landscape) font color'
                    name='color2'
                    value={fields.singninfontlandscap || "#000000"}
                    defaultValue={fields.tagline || "#000000"}
                    onChange={color =>{if(color){this.onChangeBranding('singninfontlandscap',color);}}}

                />
               </div>
               </div>
               <div className="row">
                <div className="col-12 col-md-6 col-xl-4 mb-10">
                    <div className = "row" style={{display: 'flex'}}>
                        <div className="col-11">
                            <span> Signin Background Image (Potrait) </span>
                        </div>
                        <div className="pull-right ">
                            <i className="ti-close text-danger pointer" onClick={() =>
                              {
                                  if(fields.signinpotraitimageFiles.length > 0)
                                  {
                                    this.setState({
                                      brandingDetail: {
                                        ...this.state.brandingDetail,
                                        fields : {...this.state.brandingDetail.fields,
                                            'signinpotraitimageFiles' : []},
                                      }
                                    });
                                  }
                                  else if(fields.signinpotraitimages.length > 0)
                                  {
                                    this.setState({
                                			brandingDetail: {
                                				...this.state.brandingDetail,
                                				fields : {...this.state.brandingDetail.fields,
                                            'signinpotraitimages' : []},
                                			}
                                  	});
                                  }
                              }
                              }></i>
                        </div>
                     </div>


                     <Dropzone  onDrop={(signinpotraitimageFiles) =>this.onChangeImageToCrop('signinpotraitimageFiles',signinpotraitimageFiles)} accept="image/jpeg, image/png" multiple={false} >
                                     {({getRootProps, getInputProps}) => (
                                       <section >
                                         <div
                                           {...getRootProps({
                                             className: 'dropzone'
                                           })}
                                         >
                                           <input {...getInputProps()} />
                                 <div className="col-12 pt-3" >
                                   <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
                                     <div className="overlay-wrap overflow-hidden" >
                                       <div className="text-center">

                                       {fields.signinpotraitimageFiles != null && fields.signinpotraitimageFiles.length > 0 ?
                                              <img src={fields.signinpotraitimageFiles[0].preview} key= {'pro1'} alt="" type="file" name="signinpotraitimageFiles"  width= "100%"/>
                                            : <img src={fields.signinpotraitimages ? CustomConfig.serverUrl + fields.signinpotraitimages : (require('Assets/img/signinbackground-potrait.jpg'))}  alt = ""   width= "100%"
                                              onError={(e)=>{e.target.src = (require('Assets/img/signinbackground-potrait.jpg'))}}/>
                                       }

                                        </div>
                                    </div>
                                 </RctCard>
                                 </div>
                        </div>
                      </section>
                    )}
                </Dropzone>

                  <p className = "text-danger fs-12 pt-5">Note : For better performance , image should be 400 x 800 pixels</p>

                </div>

                      <div className="col-12 col-md-6 col-xl-4 mb-10">
                          <div className = "row" style={{display: 'flex'}}>
                              <div className="col-11">
                                  <span>Signin Background Image (Landscape) </span>
                              </div>
                              <div className="pull-right">
                                  <i className="ti-close text-danger pointer"
                                  onClick={() =>
                                    {
                                        if(fields.signinlandscapeimageFiles.length > 0)
                                        {
                                          this.setState({
                                            brandingDetail: {
                                              ...this.state.brandingDetail,
                                              fields : {...this.state.brandingDetail.fields,
                                                  'signinlandscapeimageFiles' : []},
                                            }
                                          });
                                        }
                                        else if(fields.signinlandscapeimages.length > 0)
                                        {
                                          this.setState({
                                            brandingDetail: {
                                              ...this.state.brandingDetail,
                                              fields : {...this.state.brandingDetail.fields,
                                                  'signinlandscapeimages' : []},
                                            }
                                          });
                                        }
                                    }
                                    }></i>

                              </div>
                           </div>

                           <Dropzone  onDrop={(signinlandscapeimageFiles) =>this.onChangeImageToCrop('signinlandscapeimageFiles',signinlandscapeimageFiles)} accept="image/jpeg, image/png" multiple={false} >
                                           {({getRootProps, getInputProps}) => (
                                             <section >
                                               <div
                                                 {...getRootProps({
                                                   className: 'dropzone'
                                                 })}
                                               >
                                                 <input {...getInputProps()} />
                                  <div className="col-12 pt-3" >
                                    <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
                                      <div className="overlay-wrap overflow-hidden" >
                                        <div className="text-center p-4">

                                        {fields.signinlandscapeimageFiles != null && fields.signinlandscapeimageFiles.length > 0 ?
                                               <img src={fields.signinlandscapeimageFiles[0].preview} key= {'pro1'} alt="" type="file" name="signinlandscapeimageFiles"  width= "100%"/>
                                             : <img src={fields.signinlandscapeimages ? CustomConfig.serverUrl + fields.signinlandscapeimages : (require('Assets/img/signinbackground-landscape.jpg'))}  alt = ""   width= "100%"
                                                onError={(e)=>{e.target.src = (require('Assets/img/signinbackground-landscape.jpg'))}} />
                                        }

                                         </div>
                                     </div>
                                  </RctCard>
                                  </div>
                     </div>
                      <p className = "text-danger fs-12 pt-5">Note : For better performance , image should be 1200 x 800 pixels</p>
                   </section>
                 )}
             </Dropzone>


            </div>

                     <div className="col-12 col-md-6 col-xl-4 mb-10">
                            <div className = "row" style={{display: 'flex'}}>
                                <div className="col-11">
                                  <span>Member Profile Banner Image </span>
                                </div>
                                <div className="pull-right">

                                    <i className="ti-close text-danger pointer" onClick={() =>
                                      {
                                          if(fields.memberprofileimageFiles.length > 0)
                                          {
                                            this.setState({
                                              brandingDetail: {
                                                ...this.state.brandingDetail,
                                                fields : {...this.state.brandingDetail.fields,
                                                    'memberprofileimageFiles' : []},
                                              }
                                            });
                                          }
                                          else if(fields.memberprofileimages.length > 0)
                                          {
                                            this.setState({
                                              brandingDetail: {
                                                ...this.state.brandingDetail,
                                                fields : {...this.state.brandingDetail.fields,
                                                    'memberprofileimages' : []},
                                              }
                                            });
                                          }
                                      }}></i>

                                </div>
                             </div>

                             <Dropzone  onDrop={(memberprofileimageFiles) =>this.onChangeImageToCrop('memberprofileimageFiles',memberprofileimageFiles)} accept="image/jpeg, image/png" multiple={false} >
                                             {({getRootProps, getInputProps}) => (
                                               <section >
                                                 <div
                                                   {...getRootProps({
                                                     className: 'dropzone'
                                                   })}
                                                 >
                                                   <input {...getInputProps()} />

                                   <div className="col-12 pt-3" >
                                     <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
                                       <div className="overlay-wrap overflow-hidden" >
                                         <div className="text-center p-4">

                                         {fields.memberprofileimageFiles != null && fields.memberprofileimageFiles.length > 0 ?
                                                <img src={fields.memberprofileimageFiles[0].preview} key= {'pro1'} alt="" type="file" name="memberprofileimageFiles" width= "100%" />
                                              : <img src={fields.memberprofileimages ? CustomConfig.serverUrl + fields.memberprofileimages : (require('Assets/img/profile-banner.jpg'))}  alt = ""  width= "100%"
                                                 onError={(e)=>{e.target.src = (require('Assets/img/profile-banner.jpg'))}} />
                                         }

                                          </div>
                                      </div>
                                   </RctCard>
                                   </div>
                      </div>
                        <p className = "text-danger fs-12 pt-5">Note : For better performance , image should be 1200 x 200 pixels</p>
                    </section>
                  )}
              </Dropzone>


              </div>

                        <div className="col-12 col-md-6 col-xl-4 mb-10 mt-10">
                               <div className = "row" style={{display: 'flex'}}>
                                   <div className="col-11">
                                     <span>Invoice Banner Image </span>
                                   </div>
                                   <div className="pull-right">

                                       <i className="ti-close text-danger pointer" onClick={() =>
                                         {
                                             if(fields.invoiceimageFiles.length > 0)
                                             {
                                               this.setState({
                                                 brandingDetail: {
                                                   ...this.state.brandingDetail,
                                                   fields : {...this.state.brandingDetail.fields,
                                                       'invoiceimageFiles' : []},
                                                 }
                                               });
                                             }
                                             else if(fields.invoiceimages.length > 0)
                                             {
                                               this.setState({
                                                 brandingDetail: {
                                                   ...this.state.brandingDetail,
                                                   fields : {...this.state.brandingDetail.fields,
                                                       'invoiceimages' : []},
                                                 }
                                               });
                                             }
                                         }}></i>

                                   </div>
                                </div>

                                <Dropzone  onDrop={(invoiceimageFiles) =>this.onChangeImageToCrop('invoiceimageFiles',invoiceimageFiles)} accept="image/jpeg, image/png" multiple={false} >
                                                {({getRootProps, getInputProps}) => (
                                                  <section >
                                                    <div
                                                      {...getRootProps({
                                                        className: 'dropzone'
                                                      })}
                                                    >
                                                      <input {...getInputProps()} />

                                      <div className="col-12 pt-3" >
                                        <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
                                          <div className="overlay-wrap overflow-hidden" >
                                            <div className="text-center p-4">

                                            {fields.invoiceimageFiles != null && fields.invoiceimageFiles.length > 0 ?
                                                   <img src={fields.invoiceimageFiles[0].preview} key= {'pro1'} alt="" type="file" name="invoiceimageFiles" width= "100%" />
                                                 : <img src={fields.invoiceimages && CustomConfig.serverUrl + fields.invoiceimages }  alt = ""  width= "100%"
                                                    />
                                            }

                                             </div>
                                         </div>
                                      </RctCard>
                                      </div>
                         </div>
                       </section>
                     )}
                 </Dropzone>

                   <p className = "text-danger fs-12 pt-5">Note : For better performance , image should be 600 x 200 pixels</p>
                 </div>
                </div>

              <div className="row ">
                <div className="col-sm-12 col-md-12 col-xl-12 mb-10">
                     <div className = "row" style={{display: 'flex', justifyContent: 'center'}}>
                         <div className="col-sm-8 col-md-6 col-xl-4">
                           <a href="#" className="bg-primary  text-center cart-link text-white py-2 mb-2 pl-4" onClick={(e) => {  dropzoneRefsidebar.open();  e.preventDefault();} }>
                             Click here to upload Sidebar images
                           </a>
                         </ div>
                      </div>

                  <Dropzone  onDrop={(sidebarimageFiles) =>this.onChangeImageToCrop('sidebarimageFiles',sidebarimageFiles)} accept="image/jpeg, image/png" multiple={true} ref={(node) => { dropzoneRefsidebar = node; }}>
                      {({getRootProps, getInputProps}) => (
                        <section >
                          <div
                            {...getRootProps({
                              className: 'dropzone'
                            })}
                          >
                            <input {...getInputProps()} />
                            <div className = "row">

                                    { sidebarfiles  && sidebarfiles.map((filesidebar, key) =>
                                       (
                                         <div className="col-xs-4 col-sm-4 col-md-3 col-xl-2 p-3" key= {'pro-img' + key}>
                                           <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
                                             <div className="overlay-wrap overflow-hidden" >
                                               <div className="text-center">

                                                 <img src={filesidebar.preview}  alt="" type="file" name="sidebarimageFiles" width= "100%" />

                                                </div>
                                               <div className="overlay-content d-flex align-items-end">
                                               <a href="#" name="remove" className="bg-primary text-center w-100 cart-link text-white py-2" onClick={(e) => { this.onRemoveImage('sidebarimageFiles',filesidebar); e.preventDefault(); } }>
                                                 Remove
                                               </a>
                                               </div>
                                           </div>
                                         </RctCard>
                                       </div>
                                       )
                                     ) }

                                     { fields.sidebarimages && fields.sidebarimages.map((file, key) =>

                                        (
                                          <div className="col-xs-4 col-sm-4 col-md-3 col-xl-2 p-3" key= {'exist-img' + key}>
                                            <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
                                              <div className="overlay-wrap overflow-hidden" >
                                                <div className="text-center">

                                                  <img src={CustomConfig.serverUrl + file}  alt="" type="file" name="sidebarimageFiles" width= "100%" />

                                                 </div>
                                                <div className="overlay-content d-flex align-items-end">
                                                <a href="#" name="remove" className="bg-primary text-center w-100 cart-link text-white py-2" onClick={(e) => { this.onRemoveImage('sidebarimages',file); e.preventDefault(); } }>
                                                  Remove
                                                </a>
                                                </div>
                                            </div>
                                          </RctCard>
                                        </div>
                                        )
                                      ) }
                                      </div>
                      </div>
                    </section>
                  )}
              </Dropzone>

               <p className = "text-danger fs-12 pt-5">Note : For better performance , image should be 230 x 800 pixels</p>
                    </div>
                   </div>
            {(checkModuleRights(userProfileDetail.modules,"branding","update") && checkModuleRights(userProfileDetail.modules,"branding","add")) &&
               <FormGroup row>
                 <Col sm={3} >

                         <Button disabled = {loading ? true : false} variant="contained" color="primary"
                          onClick={()=>
                            {
                            if((JSON.stringify(branding_old) != JSON.stringify(fields)))
                             {
                               this.setState({ confirmationDialog : true })
                             }
                             else {
                               NotificationManager.error('No changes detected');
                              }
                            }
                          } className="text-white">
                            {loading ? <span className = "mb-0">Save <CircularProgress size={24} className={classes.buttonProgress} /> </span>: 'Save'}
                         </Button>


                 </Col>
               </FormGroup>
             }

        </Form>

        {(signinpotraitImageCropped || signinlandscapeImageCropped || memberprofileImageCropped || sidebarImageCropped || invoiceImageCropped) &&
       <ImageCropper onCancel = {this.onCloseImageCropperDialog.bind(this)}
                      imageforcrop = {signinpotraitImageCropped || signinlandscapeImageCropped || memberprofileImageCropped || sidebarImageCropped || invoiceImageCropped}
                      onCrop ={(croppedimage) => this.onChangeCroppedImage(croppedimage)}
                      imageHeightWidth = {imageHeightWidth}
                      />
                    }

          {logoImageCompressed &&
                   <ImageCompressor imageforcompress = {logoImageCompressed}
                                  onCompress ={(compressedimage) =>  this.onChangeCroppedImage(compressedimage)}
                                  imageHeightWidth = {imageHeightWidth}
                                  />
          }
        {confirmationDialog &&
           <DeleteConfirmationDialog
             openProps = {confirmationDialog}
             title="Are You Sure Want To Continue?"
             message="This will update your details."
             onConfirm={() => {
                          this.saveBrandingDetails();
                          this.setState({
                            confirmationDialog : false,
                          });
                        }}
             onCancel={() =>   this.setState({
                confirmationDialog : false,
              })}
           />
       }

      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { clientProfileDetail, userProfileDetail} = settings;
  return { clientProfileDetail, userProfileDetail };
};

export default withStyles(styles)(withRouter(connect(mapStateToProps, {
  getClientProfile,push
})(AddBrandingImages)));
