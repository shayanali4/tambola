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
import { clsAddMemberConsultationnoteModel ,saveMemberConsultationNote} from 'Actions';
import {getLocalDate, getFormtedDate, checkError, cloneDeep ,calculateExpiryDate} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import EnquiryStatus  from 'Assets/data/enquirystatus';
import {required,restrictLength} from 'Validations';
import { push } from 'connected-react-router';
import  Consultationtype from 'Assets/data/consultationtype';
import {isMobile} from 'react-device-detect';
import ViewConsultationNoteHistory from 'Routes/members/member-disclaimer/component/ViewConsultationNoteHistory';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import { NotificationManager } from 'react-notifications';
import {Link} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';


class EditConsultationNote extends Component {

      constructor(props) {
         super(props);
		 	 this.state = this.getInitialState();
	  }
		   getInitialState()
        {
        this.initialState = {
                      memberData:{
                          fields : {
                                consultationtype:'',
                                consultationnote:'',
                              },
                              errors : { },
                              validated : false
                      },
                    }
                   return cloneDeep(this.initialState);
        }

        onChange(key,value)
        {
          let fields = this.state.memberData.fields;
          let error=required(value);

          this.setState({
            memberData: {
              ...this.state.memberData,
              fields : {...this.state.memberData.fields,
                [key] : value,
              },
              errors : {...this.state.memberData.errors,
                [key] : error
              }
            }
          });
        }
        validate()
    	 	{
    	 		let errors = {};

            const fields = this.state.memberData.fields;

            errors.consultationtype = required(fields.consultationtype);
            errors.consultationnote = required(fields.consultationnote);

            let validated = checkError(errors);
             this.setState({
               memberData: {	...this.state.memberData,
                 errors : errors, validated : validated
               }
             });

            return validated;
    	 }


        handleClose = () => {
          const {pathname, hash, search} = this.props.location;

          this.setState(this.initialState);
          this.props.clsAddMemberConsultationnoteModel();
          	//this.props.push(pathname);

        };

        onSaveConsultationNote()
        {
           let consultationnote = this.state.memberData.fields;

           if(this.validate())
           {
            consultationnote.memberid = this.props.addMemberConsultationNote.memberid;
            this.props.saveMemberConsultationNote({consultationnote});
          }
        }

        componentWillReceiveProps(nextProps){
	      if(!this.props.addMemberConsultationNote && nextProps.addMemberConsultationNote)
          {
            this.state.memberData.fields.consultationtype = nextProps.addMemberConsultationNote.consultationtype || '';
          }	
			
          if( nextProps.isMemberConsultationNoteSave){
              this.handleClose();
          }
        }


	render() {

	 const	{ addMemberConsultationNoteDialog, addMemberConsultationNote  ,dialogLoading,userProfileDetail} = this.props;
   const {fields,errors} = this.state.memberData;
    return (
      <div>
      <Dialog fullWidth fullScreen = {isMobile ? true : false} maxWidth = 'md'
          onClose={this.handleClose}
          open={addMemberConsultationNote ? true : false}
          scroll = 'body'
        >

        <DialogTitle >
        <span className="fw-bold text-capitalize"> {addMemberConsultationNote ? (addMemberConsultationNote.membername +  " - " + addMemberConsultationNote.membercode) : ''}</span>
    {addMemberConsultationNote  &&
      <Tooltip title="View Member Details" placement="bottom">
        <Link to={"/app/members/member-profile?id="+addMemberConsultationNote.memberid}  onClick={this.handleClose}
		style = {{textTransform : "capitalize"}} className="fs-20"><i className="m-10 ti-eye"></i> </Link>
      </Tooltip>
    }
        </DialogTitle>
        <PerfectScrollbar style={{ height:  isMobile ? 'calc(100vh - 5px)' : 'calc(70vh - 5px)'  }}>
          <DialogContent>
          {(addMemberConsultationNote == null || dialogLoading) ? <RctSectionLoader /> :
              <div>
              <div className="clearfix d-flex">
                  <div className="media-body">
                    <div className = "row">

                      <div className = "col-4 col-sm-3 col-md-2">
                          <p>Mobile No : </p>
                      </div>
                      <div className = "col-6 col-sm-3 col-md-4">
                          <p><span className="badge badge-warning w-100">{addMemberConsultationNote.mobile}</span></p>
                      </div>

                      <div className = "col-4 col-sm-3 col-md-2">
                          <p>Email Id : </p>
                      </div>
                      <div className = "col-6 col-sm-3 col-md-4">
                          <p><span className="badge badge-warning w-100">{addMemberConsultationNote.personalemailid}</span></p>
                      </div>
               </div>

              <div className="row">
                          <div className="col-12">
                              <div  className= "row" >
								<label className="professionaldetail_padding" > Consultation Type </label>
								   <RadioGroup row aria-label="consultationtype" className ={'pl-15'}  id="consultationtype" name="consultationtype" value={fields.consultationtype} onChange={(e) => this.onChange('consultationtype', e.target.value)}>
								   {
									 Consultationtype.map((consultationtype, key) => ( <FormControlLabel value={consultationtype.value}
										key= {'consultationtypeOption' + key} control={<Radio />} label={ consultationtype.name } />))
								   }
								   </RadioGroup>
								   <FormHelperText className="pl-15 mt-0"  error> {errors.consultationtype}  </FormHelperText>
							  </div>
                          </div>
                </div>

              <div className="row" >
                    <div className="col-12">
                           <TextField required  inputProps={{maxLength:500}} id="consultationnote" fullWidth label="Consultation Note" multiline rows={2} rowsMax={4} value={fields.consultationnote} onChange={(e) => this.onChange('consultationnote',e.target.value)}/>
                          {errors.consultationnote && <FormHelperText  error>{errors.consultationnote}</FormHelperText>}
                          <FormHelperText  error>{'Total characters : ' + fields.consultationnote.length + ' (Max. 500 characters allowed)'}</FormHelperText>
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
            <Button variant="contained" color="primary" onClick={() => this.onSaveConsultationNote()} className="text-white">
              Save
                </Button>
          </DialogActions>
          {addMemberConsultationNote == null ? <RctSectionLoader /> :
            <DialogContent>
               <ViewConsultationNoteHistory  id = {addMemberConsultationNote.memberid} branchid = {userProfileDetail.defaultbranchid} />
            </DialogContent>

         }
         </PerfectScrollbar>
        </Dialog>

</div>
	);
  }
  }
const mapStateToProps = ({ memberDisclaimerListReducer ,settings}) => {
	const { addMemberConsultationNoteDialog, addMemberConsultationNote ,dialogLoading,isMemberConsultationNoteSave } =  memberDisclaimerListReducer;
  	const { userProfileDetail  } =  settings;
  return { addMemberConsultationNoteDialog, addMemberConsultationNote ,dialogLoading ,isMemberConsultationNoteSave,userProfileDetail}
}

export default connect(mapStateToProps,{
	clsAddMemberConsultationnoteModel,saveMemberConsultationNote,push})(EditConsultationNote);
