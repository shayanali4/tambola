/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import DateTimePicker from 'Routes/advance-ui-components/dateTime-picker/components/DateTime';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import {saveSubcriptionFollowup,clsViewMemberFollowupModel} from 'Actions';
import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate , getFormtedDateTime, checkError, cloneDeep , getStatusColor} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Followuptype  from 'Assets/data/followuptype';
import {required} from 'Validations';
import api from 'Api';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import ReactTable from "react-table";
import {isMobile} from 'react-device-detect';
import { push } from 'connected-react-router';
import MemberFollowupHistory from 'Routes/members/member-management/component/MemberFollowupHistory';
import Tooltip from '@material-ui/core/Tooltip';
import {Link} from 'react-router-dom';
import Call from '@material-ui/icons/Call';
import ConversationType  from 'Assets/data/conversationtype';
import ConversationStatus  from 'Assets/data/conversationstatus';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';


class EditSubscriptionFollowup extends Component {

      constructor(props) {
         super(props);
		 	 this.state = this.getInitialState();
	  }
		   getInitialState()
        {
        this.initialState = {
                      subscriptionData:{
                          fields : {

                                followupdate:null,
                                remark:'',
                                followuptype:'',
                                isfollowupdaterequired : false,
                                conversationtype :'1',
                                conversationstatus : ''
                              },
                              errors : { },
                              validated : false
                      },
                    }
                   return cloneDeep(this.initialState);
        }

        onChange(key,value)
        {
          let fields = this.state.subscriptionData.fields;
          let error=required(value);
          if(key == 'followuptype')
          {
            fields.isfollowupdaterequired = this.getIsFollowupdateRequired(value);
          }

          else if (key == "conversationtype" && value== 2){
            fields.conversationstatus= '1' ;
          }
          else if (key == "conversationtype" && value== 1){
            fields.conversationstatus= '' ;
          }
          this.setState({
            subscriptionData: {
              ...this.state.subscriptionData,
              fields : {...this.state.subscriptionData.fields,
                [key] : value
              },
              errors : {...this.state.subscriptionData.errors,
                [key] : error
              }
            }
          });
        }

        validate()
    	 	{
    	 		let errors = {};

            const fields = this.state.subscriptionData.fields;

            errors.remark = required(fields.remark);
            errors.followuptype = required(fields.followuptype);

            if(fields.isfollowupdaterequired)
            {
              errors.followupdate = required(fields.followupdate);
            }

            errors.conversationtype = required(fields.conversationtype);
            errors.conversationstatus = required(fields.conversationstatus);

            let validated = checkError(errors);
             this.setState({
               subscriptionData: {	...this.state.subscriptionData,
                 errors : errors, validated : validated
               }
             });

            return validated;
    	 }

        handleClose = () => {
          const {pathname, hash, search} = this.props.location;

          this.setState(this.initialState);
          this.props.clsViewMemberFollowupModel();
          //this.props.push(pathname);

        };

        onSaveSubcriptionFollowup()
        {
           let subscription = this.state.subscriptionData.fields;

           if(this.validate())
           {
             subscription.memberid = this.props.viewMemberFollowup.memberid;
             subscription.id = this.props.viewMemberFollowup.id;
             subscription.memberfollowuplistId = this.props.viewMemberFollowup.memberfollowuplistId;
             this.props.saveSubcriptionFollowup({subscription});
             this.setState(this.initialState);
          }
          if(this.props.onSave)
          {
            this.props.onSave();
          }
        }

        componentWillReceiveProps(nextProps){
          if(!this.props.viewMemberFollowup && nextProps.viewMemberFollowup)
          {
            this.state.subscriptionData.fields.followuptype = nextProps.viewMemberFollowup.followuptype;
            this.state.subscriptionData.fields.isfollowupdaterequired = this.getIsFollowupdateRequired(nextProps.viewMemberFollowup.followuptype);
          }

          if( nextProps.isFollowupsave){
              this.handleClose();
          }
        }

        getIsFollowupdateRequired(followuptype)
        {
          if(followuptype == 1 || followuptype == 11 || followuptype == 12 || followuptype == 13 || followuptype == 2 || followuptype == 3)
          {
            return true;
          }
          else {
            return false;
          }
        }


	render() {

	 let	{ dialogLoading, viewMemberFollowup , userProfileDetail} = this.props;
   const {fields,errors} = this.state.subscriptionData;

    return (
      <Dialog fullWidth
        fullScreen = {isMobile ? true : false} maxWidth = 'md'
          onClose={this.handleClose}
          open={viewMemberFollowup ? true : false}
          scroll = 'body'
        >

        <DialogTitle >

        {
          viewMemberFollowup &&
          <div className="media">
              <img src={viewMemberFollowup.image ? CustomConfig.serverUrl + viewMemberFollowup.image : CustomConfig.serverUrl + viewMemberFollowup.memberprofileimage} alt = ""
              onError={(e)=>{
                   let gender = viewMemberFollowup.genderId || '1';
                  e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}
                  className="rounded-circle" width="50" height="50"/>
            <div className="media-body">
                 <span className={" fw-bold text-capitalize fs-14"}>{viewMemberFollowup.name + ' - ' + viewMemberFollowup.membercode}</span>
                 <Tooltip title="View Member Profile Details" placement="bottom">
                  <Link to={"/app/members/member-profile?id=" +viewMemberFollowup.memberid} style = {{textTransform : "capitalize"}} onClick={this.handleClose} className="mx-10 fs-20"><i className="ti-eye"></i> </Link>
                </Tooltip>
                <span className= {"ml-5 px-10 py-5 fs-12 badge "} style={{"backgroundColor": getStatusColor(viewMemberFollowup.statusId)}}>
                  {viewMemberFollowup.status}
                </span>
                {viewMemberFollowup.dues > 0 && <h5 className= {"ml-5 fs-16 fw-bold text-danger"}> {"Pending Dues : " + viewMemberFollowup.dues } </h5>}
            </div>
          </div>
         }

        </DialogTitle>
        <PerfectScrollbar style={{ height:  isMobile ? 'calc(100vh - 5px)' : 'calc(70vh - 5px)'  }}>
          <DialogContent>
          {(viewMemberFollowup == null || dialogLoading) ? <RctSectionLoader /> :
              <div>
              <div className="clearfix d-flex">
                  <div className="media-body">

                   <div className = "row">

                       <div className = "col-6 col-sm-3 col-md-3">
                           <p>Email Id : </p>
                       </div>
                       <div className = "col-6 col-sm-3 col-md-3">
                           <p><span className="badge badge-warning w-100">{viewMemberFollowup.personalemailid}</span></p>
                       </div>

                       <div className = "col-6 col-sm-3 col-md-3">
                           <p>Mobile No : </p>
                       </div>
                       <div className = "col-6 col-sm-3 col-md-3">
                           <p><span className="badge badge-warning w-100">{
                             viewMemberFollowup.mobile.indexOf('XXXXX') > -1  ? viewMemberFollowup.mobile :
					                        <a href={"tel:" + viewMemberFollowup.mobile}><Call className = "pointer square-20 "/> {viewMemberFollowup.mobile}</a>}</span></p>
                       </div>

                       <div className = "col-6 col-sm-3 col-md-3">
                           <p>Last Check-in : </p>
                       </div>
                       <div className = "col-6 col-sm-3 col-md-3">
                           <p><span className="badge badge-warning w-100">{getFormtedDateTime(viewMemberFollowup.lastcheckin)}</span></p>
                       </div>

                       <div className = "col-6 col-sm-3 col-md-3">
                           <p>Registration Date : </p>
                       </div>
                       <div className = "col-6 col-sm-3 col-md-3">
                           <p><span className="badge badge-warning w-100">{getFormtedDate(viewMemberFollowup.createdbydate)}</span></p>
                       </div>

                       {viewMemberFollowup.servicename &&
                         <div className = "col-6 col-sm-3 col-md-3">
                             <p>Subscription Plan : </p>
                         </div>
                       }
                       {viewMemberFollowup.servicename &&
                         <div className = "col-6 col-sm-3 col-md-3">
                             <p><span className="badge badge-warning w-100">{viewMemberFollowup.servicename}</span></p>
                         </div>
                       }

                       {viewMemberFollowup.expirydatesubscription &&
                         <div className = "col-6 col-sm-3 col-md-3">
                             <p>Expired On : </p>
                         </div>
                       }
                       {viewMemberFollowup.expirydatesubscription &&
                         <div className = "col-6 col-sm-3 col-md-3">
                             <p><span className="badge badge-warning w-100">{getFormtedDate(viewMemberFollowup.expirydatesubscription)}</span></p>
                         </div>
                       }

                       {viewMemberFollowup.amount > 0 &&
                         <div className = "col-6 col-sm-3 col-md-3">
                             <p>Amount : </p>
                         </div>
                       }
                       {viewMemberFollowup.amount > 0 &&
                         <div className = "col-6 col-sm-3 col-md-3">
                             <p><span className="badge badge-warning w-100">{viewMemberFollowup.amount}</span></p>
                         </div>
                       }

                       {viewMemberFollowup.paymentamount &&
                         <div className = "col-6 col-sm-3 col-md-3">
                             <p>Payable Amount : </p>
                         </div>
                       }
                       {viewMemberFollowup.paymentamount &&
                         <div className = "col-6 col-sm-3 col-md-3">
                             <p><span className="badge badge-warning w-100">{viewMemberFollowup.paymentamount}</span></p>
                         </div>
                       }

                       {viewMemberFollowup.date &&
                         <div className = "col-6 col-sm-3 col-md-3">
                             <p>Due On : </p>
                         </div>
                       }
                       {viewMemberFollowup.date &&
                         <div className = "col-6 col-sm-3 col-md-3">
                             <p><span className="badge badge-warning w-100">{getFormtedDate(viewMemberFollowup.date) }</span></p>
                         </div>
                       }


                   </div>

              <div className="row">
                              <div className="col-md-6">
                                 <FormControl fullWidth>
                                    <InputLabel required htmlFor="purpose">Followup For</InputLabel>
                                     <Select value={fields.followuptype} onChange={(e) => this.onChange(e.target.name,e.target.value)}

                                       inputProps={{name: 'followuptype', id: 'followuptype', }}>
                                       {
                                         Followuptype.map((followuptype, key) => ( <MenuItem value={followuptype.value} key= {'followuptypeOption' + key}>{followuptype.name}</MenuItem> ))
                                        }
                                     </Select>
                                 </FormControl>
                                 <FormHelperText  error>{errors.followuptype}</FormHelperText>
                              </div>

                                <div className="col-md-6">
                                  <div className="rct-picker">
                                      <DateTimePicker label ={fields.isfollowupdaterequired ? "Next FollowUp Date * " : "Next FollowUp Date"} minDate = {getLocalDate(new Date())} value ={fields.followupdate} onChange = {(date) => this.onChange('followupdate',date) }/>
                                  </div>
                                  <FormHelperText  error>{errors.followupdate}</FormHelperText>
                                </div>

                </div>
                <div className="row">
                              <div className="col-sm-12 col-md-12 col-xl-6">
                                  <div className = "row" >
                                      <label className="professionaldetail_padding" > Conversation Type *</label>
                                                <RadioGroup row aria-label="conversationtype"  className ={'pl-15'} id="conversationtype" name="conversationtype" value={fields.conversationtype} onChange={(e) => this.onChange('conversationtype',e.target.value)} >
                                                {
                                                  ConversationType.map((conversationtype, key) => ( <FormControlLabel value={conversationtype.value} key= {'conversationtypeOption' + key} control={<Radio />} label={conversationtype.name} />))
                                                }
                                                </RadioGroup>
                                                <FormHelperText  error>{errors.conversationtype}</FormHelperText>
                                  </div>
                              </div>
                              {fields.conversationtype != 2 &&
                              <div className="col-sm-12 col-md-12 col-xl-6">
                                  <div className = "row" >
                                      <label className="professionaldetail_padding" > Conversation Status *</label>
                                          <RadioGroup row aria-label="conversationstatus"  className ={'pl-15'} id="conversationstatus" name="conversationstatus" value={fields.conversationstatus} onChange={(e) => this.onChange( 'conversationstatus',e.target.value)} >

                                                {
                                                  ConversationStatus.map((conversationstatus, key) => ( <FormControlLabel value={conversationstatus.value} disabled = {fields.conversationtype==2 ? true : false} key= {'conversationstatusOption' + key} control={ <Radio />} label={conversationstatus.name} />))
                                                }
                                                </RadioGroup>
                                                <FormHelperText  error>{errors.conversationstatus}</FormHelperText>
                                  </div>
                              </div> }
                </div>

              <div className="row" >
                    <div className="col-12">
                           <TextField required  inputProps={{maxLength:300}} id="remark" fullWidth label="Remarks" multiline rows={1} rowsMax={4}  value={fields.remark} onChange={(e) => this.onChange('remark',e.target.value,true)}/>
                          {errors.remark && <FormHelperText  error>{errors.remark}</FormHelperText>}
                          <FormHelperText  error>{'Total characters : ' + fields.remark.length + ' (Max. 300 characters allowed)'}</FormHelperText>
                    </div>
              </div>
                </div>
              </div>
              </div>
            }

            <DialogActions>
              <Button variant="contained" onClick={this.handleClose} className="btn-danger text-white">
                Cancel
                  </Button>
              <Button variant="contained" color="primary" onClick={() => this.onSaveSubcriptionFollowup()} className="text-white">
                Save
                  </Button>
            </DialogActions>

            {viewMemberFollowup == null ? <RctSectionLoader /> :
              <DialogContent className = "px-5">
                 <MemberFollowupHistory  memberid = {viewMemberFollowup.memberid} branchid = {userProfileDetail.defaultbranchid} />
              </DialogContent>

           }

        </DialogContent>
        </PerfectScrollbar>
        </Dialog>

	);
  }
  }
const mapStateToProps = ({ memberSubscriptionReducer,settings }) => {
	const { dialogLoading ,isFollowupsave ,viewMemberFollowup,viewMemberFollowupDialog} =  memberSubscriptionReducer;
  const {userProfileDetail } =  settings;
  return { dialogLoading ,isFollowupsave,userProfileDetail,viewMemberFollowup,viewMemberFollowupDialog}
}

export default connect(mapStateToProps,{
	saveSubcriptionFollowup,clsViewMemberFollowupModel,push})(EditSubscriptionFollowup);
