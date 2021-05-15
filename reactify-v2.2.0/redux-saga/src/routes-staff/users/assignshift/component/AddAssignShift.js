/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewAssignShiftModel, saveAssignShift } from 'Actions';

import { checkError, cloneDeep} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import AssignShiftDetail from './AssignShiftDetail';
import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import {required,email,checkLength,checkMobileNo,checkPincode,checkAlpha,restrictLength,allowAlphaNumeric,checkDecimal,convertToInt} from 'Validations';
import { push } from 'connected-react-router'

import {isMobile} from 'react-device-detect';
import { NotificationManager } from 'react-notifications';

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddAssignShift extends PureComponent {
  constructor(props) {
     super(props);
     this.state = this.getInitialState();
  }
   getInitialState()
   {
     this.initialState = {
             activeIndex : 0,
             shiftDetail:
             {
               fields : {
                           id :0,
                           employee:'',
                           shift : '',
                           startdate:null,
                           enddate:null,
                       },
               errors : { },
               validated : false,
           },
     };

      return cloneDeep(this.initialState);
   }

	 componentWillReceiveProps(newProps)
	 {
		 const	{editassignshift, editMode} = newProps;
		 let {shiftDetail} = this.state;

		 shiftDetail = shiftDetail.fields;

		 if(editMode && editassignshift && editassignshift.id && editassignshift.id != this.state.shiftDetail.fields.id)
		 {

			 shiftDetail.id = editassignshift.id;
			 shiftDetail.employee =  editassignshift.employeeid ? parseInt(editassignshift.employeeid) : '';
       shiftDetail.shift =  editassignshift.shiftid ? parseInt(editassignshift.shiftid) : '';
			 shiftDetail.startdate = editassignshift.startdate || null;
       shiftDetail.enddate = editassignshift.enddate || null;

       this.state.shiftdetail_old = cloneDeep(shiftDetail);

		 }
}

   componentWillUpdate(nextProps, nextState)
   {

     if((!nextProps.editMode && nextState.shiftDetail.fields.id != 0) || (this.props.addNewAssignShiftModal && !nextProps.addNewAssignShiftModal))
     {
        this.setState(this.getInitialState());
     }
   }


   onChange(key, value, isRequired , index)
   {
     let error= isRequired ? required(value) : '';

       this.setState({
         shiftDetail: {
           ...this.state.shiftDetail,
           fields : {...this.state.shiftDetail.fields,
             [key] : value,
           },
           errors : {...this.state.shiftDetail.errors,
             [key] :  error
           }
         }
       });

   }

	 	validate()
	 	{

	 		let errors = {};

      const fields = this.state.shiftDetail.fields;

      errors.employee = required(fields.employee);
      errors.shift = required(fields.shift);
      errors.startdate = required(fields.startdate);
      errors.enddate = required(fields.enddate);

      if(fields.startdate && fields.enddate && fields.startdate > fields.enddate)
       {
          NotificationManager.error("Please enter appropriate dates");
          errors.duration = "Please enter appropriate dates";
       }

	 			let validated = checkError(errors);

  	 		this.setState({
  	 				 shiftDetail: {	...this.state.shiftDetail,
  	 					 	errors : errors, validated : validated
  	 				 }
  	 		});

	 			 return validated;

	 }

	 	onSaveShift()
	 	{
	     const {shiftDetail ,shiftdetail_old} = this.state;
       const	{editassignshift, editMode,clientProfileDetail} = this.props;

      if(this.validate())
	 		{
        if(!editMode || (editassignshift && ((JSON.stringify(shiftdetail_old) != JSON.stringify(shiftDetail.fields)) )))
         {
            const shiftdetail  = shiftDetail.fields;
            this.props.saveAssignShift({shiftdetail});
          }
       else {
           NotificationManager.error('No changes detected');
        }
	 		}
	 	}
    onClose()
	 	{
      this.setState(this.getInitialState());
    	this.props.clsAddNewAssignShiftModel();
      this.props.push('/app/users/assignshift');
	 	}

	render() {

	 const	{ addNewAssignShiftModal, disabled , dialogLoading , editMode , editassignshift, clientProfileDetail,shiftList,employeeList} = this.props;
 	 const {shiftDetail,activeIndex } = this.state;


		return (
			<Dialog fullWidth fullScreen = {isMobile ? true : false}  open={addNewAssignShiftModal} onClose={() =>this.onClose()} >
					<AppBar position="static" className="bg-primary">
							<Toolbar className = {isMobile ? "px-0" : ""}>
									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-50 mb-0 ">ASSIGN SHIFT</h5>

                  <div className="w-50 mb-0">
                      <Tabs
                            value={activeIndex}
                            onChange={(e, value) => this.changeActiveIndex(value)}
                            variant = "fullWidth"
                            indicatorColor="secondary" >


                      </Tabs>
                  </div>

                 <Button onClick={() =>this.onSaveShift()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>

						</Toolbar>
				</AppBar>
				{((editMode && !editassignshift) || dialogLoading ) &&
					<RctSectionLoader />
				}
				<PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>

								{activeIndex === 0 && <TabContainer><AssignShiftDetail fields = {shiftDetail.fields} errors ={shiftDetail.errors}  onChange = {this.onChange.bind(this)}
                employeeList={employeeList} shiftList={shiftList}/> </TabContainer>}

				</PerfectScrollbar>
			</Dialog>

	);
  }
  }
const mapStateToProps = ({ employeeShiftReducer, settings }) => {
	const { addNewAssignShiftModal, disabled, dialogLoading, editassignshift, editMode ,employeeList,shiftList} =  employeeShiftReducer;
  const {clientProfileDetail,userProfileDetail} = settings;
  return { addNewAssignShiftModal, disabled , dialogLoading, editassignshift, editMode, clientProfileDetail,userProfileDetail,employeeList,shiftList}
}

export default connect(mapStateToProps,{
	clsAddNewAssignShiftModel, saveAssignShift, push })(AddAssignShift);
