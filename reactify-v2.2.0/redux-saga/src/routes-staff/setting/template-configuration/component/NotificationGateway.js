import React, { Fragment, PureComponent,Component } from 'react';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';

import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import NotificationType  from 'Assets/data/notificationtype';
import SMSConfiguration  from 'Assets/data/smsconfiguration';

import {required ,email ,restrictLength} from 'Validations';
import {checkError, cloneDeep,checkModuleRights} from 'Helpers/helpers';
import Button from '@material-ui/core/Button';
import { saveNotificationEmailGateway ,viewNotificationGatewayInformation } from 'Actions';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import  Status from 'Assets/data/status';
import Checkbox from '@material-ui/core/Checkbox';
import { NotificationManager } from 'react-notifications';
import {EmailGatewayConfiguration} from 'Constants/custom-config';

class NotificationGateway extends Component {

  constructor(props) {
     super(props);
   this.state = this.getInitialState();
   }
   getInitialState()
   {
     this.initialState = {
                        templatetype : '1',
                        smsgateway : {
                              fields : {
                                  status: '2',
                                  transactionalurl:'',
                                  promotionalurl:'',
                                  headers : ''
                            },
                        errors : {},
                        validated : false,
                      },
                      emailgateway : {
                            fields : {
                                    emailid : '',
                                    password : '',
                                    status :'2',
                                    secureconnection : '0',
                                    host : '',
                                    port :'',
                                    from : '',
                                  },
                            errors : {},
                            validated : false,
                          },
                }
                  return cloneDeep(this.initialState);
          }

   componentWillMount() {
     this.props.viewNotificationGatewayInformation();
   }

   componentWillReceiveProps(newProps)
    {
      const	{selectedGatewayInformation} = newProps;
      let {emailgateway,smsgateway } = this.state;

      if(selectedGatewayInformation)
      {
        if(selectedGatewayInformation.emailgateway){
          emailgateway.fields = selectedGatewayInformation.emailgateway;
        }
        if(selectedGatewayInformation.smsgateway){
           smsgateway.fields = selectedGatewayInformation.smsgateway;
        }
      }
      this.state.emailgateway_old = cloneDeep(emailgateway.fields);
      this.state.smsgateway_old = cloneDeep(smsgateway.fields);
    }

   onChange(key,value, isRequired)
    {
        this.setState({
           	[key] : value
      });
      }

   onChangeEmailgateway(key,value, isRequired)
   	{
   		let error= isRequired ? required(value) : '';
      if(key == 'emailid')
       {
         error =  email(value);
       }
      else if(key == 'port')
        {
          value = restrictLength(value,5);
        }
      else if(key == 'from')
        {
            error =  email(value);
        }

   		this.setState({
   			emailgateway: {
   				...this.state.emailgateway,
   				fields : {...this.state.emailgateway.fields,
   					[key] : value
   				},
   				errors : {...this.state.emailgateway.errors,
   					[key] : error
   				},
   			}
     	});
      }

      onBlurEmailgateway(key,value)
      {
        if(key == 'emailid' && value && value.split('@').length > 1)
        {
          let gateway = value.split('@')[1].split('.')[0];
          if(EmailGatewayConfiguration.filter(x => x.domain == gateway).length > 0)
          {
            let gatewayconfiguration = EmailGatewayConfiguration.filter(x => x.domain == gateway)[0];
            this.setState({
         			emailgateway: {
         				...this.state.emailgateway,
         				fields : {...this.state.emailgateway.fields,
         					host : gatewayconfiguration.host,
                  port : gatewayconfiguration.port ,
                  secureconnection : gatewayconfiguration.secureconnection
         				},
         			}
           	});
          }
        }
      }

      onChangeSMSgateway(key,value, isRequired)
       {
         let error= isRequired ? required(value) : '';

         this.setState({
           smsgateway: {
             ...this.state.smsgateway,
             fields : {...this.state.smsgateway.fields,
               [key] : value
             },
             errors : {...this.state.smsgateway.errors,
               [key] : error
             },
           }
         });
         }

      validate()
        {
            let errors = {};
              const {emailgateway,templatetype,smsgateway}  = this.state;
              if(templatetype == 1){
                  errors.emailid = required(emailgateway.fields.emailid);
                  errors.emailid = (errors.emailid != '' ? errors.emailid : email(emailgateway.fields.emailid));
                  errors.password = required(emailgateway.fields.password);
                  errors.host = required(emailgateway.fields.host);
                  errors.port = required(emailgateway.fields.port);

                  let validated = checkError(errors);

                   this.setState({
                     emailgateway: {	...this.state.emailgateway,
                        errors : errors, validated : validated
                     }
                   });
                      return validated;
           }
           else {

                     errors.transactionalurl = required(smsgateway.fields.transactionalurl);

                     let validated = checkError(errors);

                      this.setState({
                        smsgateway: {	...this.state.smsgateway,
                           errors : errors, validated : validated
                        }
                      });
                         return validated;

            }
         }

         confirmSave()
         {
           const {emailgateway,smsgateway,emailgateway_old,smsgateway_old} = this.state;
           const	{selectedGatewayInformation} = this.props;

           if(this.validate())
           {
             if(selectedGatewayInformation && ((JSON.stringify(emailgateway_old) != JSON.stringify(emailgateway.fields)) || (JSON.stringify(smsgateway_old) != JSON.stringify(smsgateway.fields))))
             {
               let template  = '';
               let sms = '';
               if(smsgateway.fields.transactionalurl || smsgateway.fields.promotionalurl)
               {
                 sms = smsgateway.fields;
               }
               else {
                 sms = null
               }

               if(emailgateway.fields.emailid && emailgateway.fields.password)
               {
                 template = emailgateway.fields;
               }
               else {
                 template = null
               }
                   if(smsgateway.fields.headers){
                     try {
                      if(typeof(JSON.parse(smsgateway.fields.headers)) == "object"){
                        this.props.saveNotificationEmailGateway({template,sms});
                      }
                     } catch (e) {
                       NotificationManager.error('Please enter valid header.');
                     }
                  }
                  else {
                    this.props.saveNotificationEmailGateway({template,sms});
                  }
             }
             else {
               NotificationManager.error('No changes detected');
              }
           }
         }


  render() {
    	let	{emailgateway,templatetype,smsgateway} = this.state;
      const {selectedGatewayInformation,userProfileDetail , clientProfileDetail} = this.props;

      let updateRights = checkModuleRights(userProfileDetail.modules,"templateconfiguration","update");

    return (
    <div className="textfields-wrapper">
   <RctCollapsibleCard >
   <form noValidate autoComplete="off">
     <div className="row">
             <div className="col-sm-6 col-md-5 col-xl-4">
             <div className = "row" >
                  <label className="professionaldetail_padding" > Configuration For </label>
                   <RadioGroup row aria-label="templatetype"  id="templatetype" name="templatetype" value={templatetype} onChange={(e) => this.onChange('templatetype',e.target.value)} onBlur = {(e) => this.onChange('templatetype',e.target.value)}>
                   {
                     NotificationType.filter(x => x.value != 3).map((templatetype, key) => ( <FormControlLabel value={templatetype.value} key= {'templatetypeOption' + key} control={<Radio />} label={templatetype.name} />))
                   }
                   </RadioGroup>
             </div>
            </div>
      </div>
   <div className="row">
       {templatetype== "1" &&
            <div className="col-sm-12 col-md-6 col-xl-3">
                  <div className ="row">
                  <label className="professionaldetail_padding" >Status</label>
                           <RadioGroup row aria-label="status" className ={'pl-15'}   name="status"   value={emailgateway.fields.status} onChange={(e) => this.onChangeEmailgateway('status', e.target.value)}>
                           {
                             Status.map((status, key) => ( <FormControlLabel value={status.value} key= {'statusOption' + key} control={<Radio />} label={status.name} />))
                           }
                         </RadioGroup>
                  </div>
            </div>
          }
          {templatetype== "2" &&
        <div className="col-sm-12 col-md-6 col-xl-3">
              <div className ="row">
              <label className="professionaldetail_padding" >Status</label>
                       <RadioGroup row aria-label="status" className ={'pl-15'}   name="status"   value={smsgateway.fields.status} onChange={(e) => this.onChangeSMSgateway('status', e.target.value)}>
                       {
                         Status.map((status, key) => ( <FormControlLabel value={status.value} key= {'statusOption' + key} control={<Radio />} label={status.name} />))
                       }
                     </RadioGroup>
              </div>
        </div>
      }
    </div>
{
    // {templatetype== "2" &&
    //        <div className="row">
    //             <div className="col-sm-6 col-md-6 col-xl-3">
    //               <FormGroup className="has-wrapper">
    //                     <FormControl fullWidth>
    //               <InputLabel htmlFor="id"></InputLabel>
    //                         <Select displayEmpty value={smsgateway.fields.id} onChange={(e) => this.onChangeSMSgateway('id', e.target.value,  true)}
    //                           inputProps={{name: 'id', id: 'id', }}>
    //                           <MenuItem value="" >
    //                           Select SMS Gateway
    //                           </MenuItem>
    //                           {
    //                             SMSConfiguration.map((id, key) => ( <MenuItem value={id.value} key = {'idOption' + key }>{id.name}</MenuItem> ))
    //                           }
    //                         </Select>
    //                     </FormControl>
    //              </FormGroup>
    //             </div>
    //             <div className="col-sm-6 col-md-6 col-xl-3">
    //               <TextField required id="senderid" inputProps={{maxLength:50}} fullWidth  label="Senderid" value={smsgateway.fields.senderid} onChange={(e) => this.onChangeSMSgateway('senderid',e.target.value, true)} />
    //               <FormHelperText  error>{smsgateway.errors.senderid}</FormHelperText>
    //             </div>
    //     </div>
    //   }
      // {templatetype== "2" &&
      //        <div className="row">
      //         <div className="col-sm-6 col-md-6 col-xl-3">
      //           <TextField required id="apikey" inputProps={{maxLength:50}} fullWidth  label="Apikey"  value={smsgateway.fields.apikey} onChange={(e) => this.onChangeSMSgateway('apikey',e.target.value, true)} />
      //           <FormHelperText  error>{smsgateway.errors.apikey}</FormHelperText>
      //         </div>
      //         {smsgateway.fields.id == "3" &&
      //             <div className="col-sm-6 col-md-6 col-xl-3">
      //               <TextField required id="apikey" inputProps={{maxLength:1000}} fullWidth  label="url"  value={smsgateway.fields.url} onChange={(e) => this.onChangeSMSgateway('url',e.target.value, true)} />
      //               <FormHelperText  error>{smsgateway.errors.url}</FormHelperText>
      //             </div>
      //           }
      //         </div>
      //       }
    }
        {templatetype== "2" &&
           <div className="row">
                <div className="col-sm-6 col-md-6 col-xl-6">
                  <TextField required id="transactionalurl" inputProps={{maxLength:1000}} multiline rows={3} rowsMax={3} inputProps={{maxLength:1000}} fullWidth  label="SMS API(Transactional)"  value={smsgateway.fields.transactionalurl} onChange={(e) => this.onChangeSMSgateway('transactionalurl',e.target.value, true)} />
                  <FormHelperText  error>{smsgateway.errors.transactionalurl}</FormHelperText>
                </div>
            </div>
          }
          {templatetype== "2" && clientProfileDetail && clientProfileDetail.packtypeId == 3 &&
          <div className="row">
               <div className="col-sm-6 col-md-6 col-xl-6">
                 <TextField id="promotionalurl" inputProps={{maxLength:1000}} multiline rows={3} rowsMax={3} inputProps={{maxLength:1000}} fullWidth  label="SMS API(Promotional)"  value={smsgateway.fields.promotionalurl} onChange={(e) => this.onChangeSMSgateway('promotionalurl',e.target.value)} />
                 <FormHelperText  error>{smsgateway.errors.promotionalurl}</FormHelperText>
               </div>
           </div>
         }
         {templatetype== "2" &&
            <div className="row">
                 <div className="col-sm-6 col-md-6 col-xl-6">
                   <TextField id="headers" inputProps={{maxLength:1000}} multiline rows={3} rowsMax={3} inputProps={{maxLength:1000}} fullWidth  label="Headers"  value={smsgateway.fields.headers} onChange={(e) => this.onChangeSMSgateway('headers',e.target.value, true)} />
                   <FormHelperText  error>{smsgateway.errors.headers}</FormHelperText>
                 </div>
             </div>
           }
          {templatetype== "2" &&
            <p className = "mt-10">{'Note : @mobile , @message will replace by member mobile number and message.'}</p>
          }
    {templatetype== "1" &&
     <div className="row">
                <div className="col-sm-6 col-md-6 col-xl-3">
                {/* please do not change in below two lines */}
                      <input id="username" style={{display:'none'}} type="email" name="fakeusernameremembered" />
                      <input id="password" style={{display:'none'}} type="password" name="fakepasswordremembered" />

                  <TextField required inputProps={{maxLength:50}} autoComplete = "nope" fullWidth autoFocus = {true} label="Email-Id" value={emailgateway.fields.emailid} onChange={(e) => this.onChangeEmailgateway('emailid',e.target.value, true)}  onBlur={(e) => this.onBlurEmailgateway('emailid',e.target.value)} />
                  <FormHelperText  error>{emailgateway.errors.emailid}</FormHelperText>
                </div>
                    <div className="col-sm-6 col-md-6 col-xl-3">
                      <TextField required autoComplete = "new-password" inputProps={{maxLength:50}} type = "password" fullWidth  label="Password"  value={emailgateway.fields.password} onChange={(e) => this.onChangeEmailgateway('password',e.target.value, true)} />
                      <FormHelperText  error>{emailgateway.errors.password}</FormHelperText>
                    </div>
        </div>
      }
      {templatetype== "1" &&
       <div className="row">
                    <div className="col-sm-6 col-md-6 col-xl-3">
                      <TextField required id="host" inputProps={{maxLength:50}} fullWidth  label="Host" value={emailgateway.fields.host} onChange={(e) => this.onChangeEmailgateway('host',e.target.value, true)} />
                      <FormHelperText  error>{emailgateway.errors.host}</FormHelperText>
                    </div>
                    <div className="col-sm-6 col-md-6 col-xl-3">
                      <TextField type = "number" required id="port" inputProps={{min:1}} fullWidth  label="Port" value={emailgateway.fields.port} onChange={(e) => this.onChangeEmailgateway('port',e.target.value, true)} />
                      <FormHelperText  error>{emailgateway.errors.port}</FormHelperText>
                    </div>
      </div>
    }
    {templatetype== "1" &&
     <div className="row">
            <div className="col-sm-6 col-md-6 col-xl-3">
              <TextField  id="from" inputProps={{maxLength:50}} fullWidth  label="From" value={emailgateway.fields.from} onChange={(e) => this.onChangeEmailgateway('from',e.target.value, true)} />
              <FormHelperText  error>{emailgateway.errors.from}</FormHelperText>
            </div>
            <div className="col-6 col-xl-3">
            <FormControlLabel control={
              <Checkbox color="primary" checked={emailgateway.fields.secureconnection == 0?false:true} onChange={(e) =>  this.onChangeEmailgateway('secureconnection', e.target.checked )}  />
            } label = "Use SSL"
            />
            </div>
      </div>
      }
      {
      // {templatetype== "2" &&
      //        <div className="row">
      //                   <div className="col-sm-6 col-md-6 col-xl-3">
      //                     <TextField required inputProps={{maxLength:50}} fullWidth autoFocus = {true} label="Userid" value={smsgateway.fields.userid} onChange={(e) => this.onChangeSMSgateway('userid',e.target.value, true)} />
      //                     <FormHelperText  error>{smsgateway.errors.userid}</FormHelperText>
      //                   </div>
      //
      //                       <div className="col-sm-6 col-md-6 col-xl-3">
      //                         <TextField required  inputProps={{maxLength:50}} type = "password" fullWidth  label="Password" value={smsgateway.fields.password} onChange={(e) => this.onChangeSMSgateway('password',e.target.value, true)} />
      //                         <FormHelperText  error>{smsgateway.errors.password}</FormHelperText>
      //                       </div>
      //
      //       </div>
      //   }
    }

  </form>

        <div className = "pt-2">
        {  updateRights &&  <Button variant="contained" size="large" color="primary"  onClick={() =>this.confirmSave()} className="text-white">
            Save
        </Button> }
        </div>
 </RctCollapsibleCard>
 </div>
);
}
}

const mapStateToProps = ({ templateconfigurationReducer , settings}) => {
	const {selectedGatewayInformation, disabled, dialogLoading ,editTemplate } =  templateconfigurationReducer;
  const { userProfileDetail, clientProfileDetail} = settings;
  return {selectedGatewayInformation,disabled , dialogLoading ,editTemplate,userProfileDetail , clientProfileDetail}
  }

  export default connect(mapStateToProps,{
  saveNotificationEmailGateway,viewNotificationGatewayInformation})(NotificationGateway);
