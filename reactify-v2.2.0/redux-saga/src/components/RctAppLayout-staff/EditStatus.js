/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DateTimePicker from 'Routes/advance-ui-components/dateTime-picker/components/DateTime';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsViewEnquiryStatusModel ,saveEnquiryStatus} from 'Actions';
import {getLocalDate, getFormtedDate, checkError, cloneDeep ,calculateExpiryDate} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import EnquiryStatus  from 'Assets/data/enquirystatus';
import {required,restrictLength} from 'Validations';
import { push } from 'connected-react-router';
import  Duration from 'Assets/data/duration';
import {isMobile} from 'react-device-detect';
import ViewEnquiryHistory from 'Routes/enquiry/component/ViewEnquiryHistory';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import { NotificationManager } from 'react-notifications';
import {Link} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import ConversationType  from 'Assets/data/conversationtype';
import ConversationStatus  from 'Assets/data/conversationstatus';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Call from '@material-ui/icons/Call';
class EditStatus extends Component {

      constructor(props) {
         super(props);
		 	 this.state = this.getInitialState();
	  }
		   getInitialState()
        {
        this.initialState = {
                      enquiryData:{
                          fields : {
                                enquirystatus:'',
                                startdate : null,
                                enddate: null,
                                followupdate:null,
                                remark:'',
                                joinedperiod : '',
                                duration : '',
                                joineddate : null,
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
          let fields = this.state.enquiryData.fields;
          let error=required(value);
          let followupdate = fields.followupdate;

                if(key == "joineddate" )
                {
                    followupdate = calculateExpiryDate(value,fields.joinedperiod,fields.duration);
                }
                else if (key == "joinedperiod") {
                    value = restrictLength(value,3);
                    followupdate = calculateExpiryDate(fields.joineddate,value,fields.duration);
                }
                else if (key == "duration") {
                    followupdate = calculateExpiryDate(fields.joineddate,fields.joinedperiod,value);
                }
                else if(key == "followupdate" || key == "enddate")
                {
                  followupdate = value;
                }

          if (key == "enquirystatus" && (value == 2 || value == 7 || value == 1 || value == 6 || value == 8)) {
              fields.startdate = null;
              fields.enddate = null;
              fields.joinedperiod = '';
              fields.duration = '';
              fields.joineddate = null;
          }
          else if (key == "enquirystatus" && value == 3) {
              fields.joinedperiod = '';
              fields.duration = '';
              fields.joineddate = null;
          }
          else if (key == "enquirystatus" && value == 5) {
              fields.startdate = null;
              fields.enddate = null;
          }
          else if(key == "startdate"){
              if(fields.enddate && getLocalDate(value) > getLocalDate(fields.enddate)){
                NotificationManager.error('Start date should not be more then end date.');
                  value = null;
              }
          }
           else if(key == "enddate"){
               if(fields.startdate && getLocalDate(fields.startdate) > getLocalDate(value)){
                 NotificationManager.error('End date should not be less then start date.');
                 value = null;
               }
           }

           else if (key == "conversationtype" && value== 2){
             fields.conversationstatus= '1' ;
           }
           else if (key == "conversationtype" && value== 1){ 
             fields.conversationstatus= '' ;
           }


          this.setState({
            enquiryData: {
              ...this.state.enquiryData,
              fields : {...this.state.enquiryData.fields,
                [key] : value,
                  'followupdate' : followupdate
              },
              errors : {...this.state.enquiryData.errors,
                [key] : error
              }
            }
          });
        }
        validate()
    	 	{
    	 		let errors = {};

            const fields = this.state.enquiryData.fields;
            if(fields.enquirystatus == 3)
            {
                errors.startdate = required(fields.startdate);
                  errors.enddate = required(fields.enddate);
            }
            else if(fields.enquirystatus == 5)
            {
                errors.joineddate = required(fields.joineddate);
                errors.joinedperiod = required(fields.joinedperiod);
                errors.duration = required(fields.duration);
            }
            if(fields.enquirystatus != 6 && fields.enquirystatus != 8 )
            {
                errors.followupdate = required(fields.followupdate);
            }

            errors.enquirystatus = required(fields.enquirystatus);
            errors.remark = required(fields.remark);
            errors.conversationtype = required(fields.conversationtype);
            errors.conversationstatus = required(fields.conversationstatus);

            let validated = checkError(errors);
             this.setState({
               enquiryData: {	...this.state.enquiryData,
                 errors : errors, validated : validated
               }
             });

            return validated;
    	 }


        handleClose = () => {
          const {pathname, hash, search} = this.props.location;

          this.setState(this.initialState);
          this.props.clsViewEnquiryStatusModel();
          	this.props.push(pathname);

        };

        onSaveEnquiryStatus()
        {
           let enquiry = this.state.enquiryData.fields;

           if(this.validate())
           {
            enquiry.enquirystatusold = this.props.viewEnquiryStatus.enquirystatus;
            enquiry.enquiryid = this.props.viewEnquiryStatus.id;
            enquiry.enquirylistId = this.props.viewEnquiryStatus.enquirylistId;
            this.props.saveEnquiryStatus({enquiry});
          }
        }

        componentWillReceiveProps(nextProps){
          if( nextProps.isEnquiryFollowupsave){
              this.handleClose();
          }
        }


	render() {

	 const	{ viewEnquiryStatusDialog, viewEnquiryStatus  ,dialogLoading,userProfileDetail} = this.props;
   const {fields,errors} = this.state.enquiryData;
    return (
      <div>
      <Dialog fullWidth fullScreen = {isMobile ? true : false} maxWidth = 'md'
          onClose={this.handleClose}
          open={viewEnquiryStatus ? true : false}
          scroll = 'body'
        >

        <DialogTitle >
        <span className="fw-bold text-capitalize"> {viewEnquiryStatus ? (viewEnquiryStatus.firstname +  " " + viewEnquiryStatus.lastname) : ''}</span>
    {viewEnquiryStatus  &&
      <Tooltip title="View Enquiry Details" placement="bottom">
        <Link to={"/app/enquiry/0?id="+viewEnquiryStatus.id+"#view"} style = {{textTransform : "capitalize"}} className="fs-20"><i className="m-10 ti-eye"></i> </Link>
      </Tooltip>
    }
        </DialogTitle>
        <PerfectScrollbar style={{ height:  isMobile ? 'calc(100vh - 5px)' : 'calc(70vh - 5px)'  }}>
          <DialogContent>
          {(viewEnquiryStatus == null || dialogLoading) ? <RctSectionLoader /> :
              <div>
              <div className="clearfix d-flex">
                  <div className="media-body">
                    <div className = "row">

                      <div className = "col-6 col-sm-3 col-md-3">
                          <p>Mobile No : </p>
                      </div>
                      <div className = "col-6 col-sm-3 col-md-3">
                          <p><span className="badge badge-warning w-100">{   viewEnquiryStatus.mobile.indexOf('XXXXX') > -1  ? viewEnquiryStatus.mobile :
					                        <a href={"tel:" + viewEnquiryStatus.mobile}><Call className = "pointer square-20 "/> {viewEnquiryStatus.mobile}</a>}</span></p>
                      </div>

                      <div className = "col-6 col-sm-3 col-md-3">
                          <p>Current Enquiry Status : </p>
                      </div>
                      <div className = "col-6 col-sm-3 col-md-3">
                          <p><span className="badge badge-warning w-100">{viewEnquiryStatus.enquirystatus}</span></p>
                      </div>

					  {viewEnquiryStatus.emailid && 	
                      <div className = "col-6 col-sm-3 col-md-3">
                          <p>Email Id : </p>
                      </div>
					  }
					  {viewEnquiryStatus.emailid && 
                      <div className = "col-6 col-sm-3 col-md-3">
                          <p><span className="badge badge-warning w-100">{viewEnquiryStatus.emailid}</span></p>
                      </div>
					  }

                      {viewEnquiryStatus.enquirybudget && viewEnquiryStatus.enquirybudget > 0 &&
                        <div className = "col-6 col-sm-3 col-md-3">
                            <p>Enquiry Budget : </p>
                        </div>
                      }
                      {viewEnquiryStatus.enquirybudget && viewEnquiryStatus.enquirybudget > 0 &&
                        <div className = "col-6 col-sm-3 col-md-3">
                            <p><span className="badge badge-warning w-100">{viewEnquiryStatus.enquirybudget}</span></p>
                        </div>
                      }
               </div>

              <div className="row">
                          <div className="col-md-6">
                                       <FormControl fullWidth>
                                                <InputLabel required htmlFor="purpose">Enquiry Status</InputLabel>
                                                 <Select value={fields.enquirystatus} onChange={(e) => this.onChange(e.target.name,e.target.value)}

                                                   inputProps={{name: 'enquirystatus', id: 'enquirystatus', }}>
                                                   {
                                                     EnquiryStatus.filter(x => x.value != 4).map((enquirystatus, key) => ( <MenuItem value={enquirystatus.value} key= {'enquirystatusOption' + key}>{enquirystatus.name}</MenuItem> ))
                                                    }
                                                 </Select>
                                       </FormControl>
                                       <FormHelperText  error>{errors.enquirystatus}</FormHelperText>
                          </div>
                          {fields.enquirystatus > 0 &&
                                <div className="col-md-6">
                                  <div className="rct-picker">
                                      <DateTimePicker label = {fields.enquirystatus != "7" ? (fields.enquirystatus != "6" && fields.enquirystatus != "8" ?  "Next Follow Up Date & Time *" : "Next Follow Up Date & Time"): "Expected Join Date *"}  minDate = {getLocalDate(new Date())} value ={fields.followupdate} onChange = {(date) => this.onChange('followupdate',date) }/>
                                  </div>
                                  <FormHelperText  error>{errors.followupdate}</FormHelperText>
                                </div>
                            }
                </div>
                          {fields.enquirystatus== "3" &&  <div className="row">

                                  <div className=" col-md-6">
                                    <div className="rct-picker">
                                        <DatePicker label = "Trial Start Date *" minDate = {getLocalDate(new Date())} value ={fields.startdate} onChange = {(date) => this.onChange('startdate',date) }/>
                                    </div>
                                    <FormHelperText  error>{errors.startdate}</FormHelperText>
                                  </div>

                                  <div className="col-md-6">
                                      <div className="rct-picker">
                                          <DatePicker label  = "Trial End Date *" minDate = {getLocalDate(new Date())} value ={fields.enddate} onChange = {(date) =>this.onChange('enddate',date) }/>
                                      </div>
                                      <FormHelperText  error>{errors.enddate}</FormHelperText>
                                  </div>
                      </div>
                      }

                        {fields.enquirystatus== "5" &&  <div className="row">

                              <div className="col-md-12">
                                  <p className="mb-0">For how long period he/she have joined there?</p>
                              </div>
                              <div className="col-md-6">
                                  <TextField required inputProps={{maxLength:50}} type="number" id="joinedperiod" fullWidth label="Joined Period"  value={fields.joinedperiod} onChange={(e) => this.onChange('joinedperiod',e.target.value, true)} onBlur = {(e) => this.onChange('joinedperiod',e.target.value, true)}  />
                                  <FormHelperText  error>{errors.joinedperiod}</FormHelperText>
                              </div>
                              <div className="col-md-6">
                                     <FormControl fullWidth>
                                          <InputLabel  htmlFor="duration">Duration*</InputLabel>
                                             <Select value={fields.duration} onChange={(e) => this.onChange(e.target.name,e.target.value)}
                                               inputProps={{name: 'duration', id: 'duration', }}>
                                               {
                                                 Duration.map((duration, key) => ( <MenuItem value={duration.name} key = {'durationOption' + key }>{duration.name}</MenuItem> ))
                                               }
                                             </Select>
                                             <FormHelperText  error>{errors.duration}</FormHelperText>
                                       </FormControl>

                              </div>

                              <div className="col-md-12">
                                  <p className="mb-0">Which date he/she have joined?</p>
                              </div>

                              <div className="col-md-6">
                                  <div className="rct-picker">
                                      <DatePicker label  = "Joined Date *"   value ={fields.joineddate} onChange = {(date) =>this.onChange('joineddate',date) }/>
                                  </div>
                                  <FormHelperText  error>{errors.joineddate}</FormHelperText>
                              </div>
                  </div>
                  }
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
                           <TextField required  inputProps={{maxLength:300}} id="remark" fullWidth label="Remarks" multiline rows={1} rowsMax={4} value={fields.remark} onChange={(e) => this.onChange('remark',e.target.value)}/>
                          {errors.remark && <FormHelperText  error>{errors.remark}</FormHelperText>}
                          <FormHelperText  error>{'Total characters : ' + fields.remark.length + ' (Max. 300 characters allowed)'}</FormHelperText>
                    </div>
              </div>
                </div>
              </div>
              </div>
            }
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={this.handleClose} className="btn-danger text-white">
              Cancel
                </Button>
            <Button variant="contained" color="primary" onClick={() => this.onSaveEnquiryStatus()} className="text-white">
              Save
                </Button>
          </DialogActions>
          {viewEnquiryStatus == null ? <RctSectionLoader /> :
            <DialogContent>
               <ViewEnquiryHistory  id = {viewEnquiryStatus.id} branchid = {userProfileDetail.defaultbranchid} />
            </DialogContent>

         }
         </PerfectScrollbar>
        </Dialog>

</div>
	);
  }
  }
const mapStateToProps = ({ enquiryReducer ,settings}) => {
	const { viewEnquiryStatusDialog, viewEnquiryStatus ,dialogLoading,isEnquiryFollowupsave } =  enquiryReducer;
  	const { userProfileDetail  } =  settings;
  return { viewEnquiryStatusDialog, viewEnquiryStatus ,dialogLoading ,isEnquiryFollowupsave,userProfileDetail}
}

export default connect(mapStateToProps,{
	clsViewEnquiryStatusModel,saveEnquiryStatus,push})(EditStatus);
