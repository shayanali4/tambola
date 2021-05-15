/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewBookTicketModel, saveBookTicket, deleteBookTicket  } from 'Actions';
import {getLocalDate, checkError, cloneDeep,getTaxValues} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import DialogContent from '@material-ui/core/DialogContent';
import BookTicketDetail from './BookTicketDetail';
import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import { EditorState } from 'draft-js';

import {required,checkMobileNo,restrictLength,allowAlphaNumeric, convertToInt, checkDecimal} from 'Validations';
import { push } from 'connected-react-router';
import { NotificationManager } from 'react-notifications';

import {isMobile} from 'react-device-detect';
import Button from '@material-ui/core/Button';


function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddBookTicket extends PureComponent {
	constructor(props) {
     super(props);
		   this.state = this.getInitialState();
   }

   getInitialState()
   {
     this.initialState = {
             activeIndex : 0,

             BookTicketData :
             {
               fields : {
                  id : 0,
                  ticketid:'',
                  gameid :'',
                  customer : '',
                  mobile:''
                },
                errors : { },
               validated : false
           },
     };

      return cloneDeep(this.initialState);
   }

	 componentWillReceiveProps(newProps)
	 {
		 const	{editBookTicket, editMode} = newProps;
		 let {BookTicketData} = this.state;

     BookTicketData= BookTicketData.fields;

		 if(editMode && editBookTicket && editBookTicket.id && editBookTicket.id != this.state.BookTicketData.fields.id)
		 {

       BookTicketData = cloneDeep(editBookTicket);
       this.state.BookTicketData.fields = BookTicketData;
       this.state.BookTicket_old = cloneDeep(BookTicketData);

     }
	 }



   componentWillUpdate(nextProps, nextState)
   {
     if((!nextProps.editMode && nextState.BookTicketData.fields.id != 0) || (this.props.addNewBookTicketModal && !nextProps.addNewBookTicketModal))
     {
        this.setState(this.getInitialState());
     }
   }



   onChangeBookTicket(key,value, isRequired)
   {

     let error= isRequired ? required(value) : '';
     const fields = this.state.BookTicketData.fields;
      const { clientProfileDetail} = this.props;
      if(key == 'mobile')
      {
        if(value)
        {
          error = checkMobileNo(value);
        }
          value = restrictLength(value,12);
      }

     this.setState({
       BookTicketData: {
         ...this.state.BookTicketData,
         fields : {...this.state.BookTicketData.fields,
           [key] : value,
         },
         errors : {...this.state.BookTicketData.errors,
           [key] : error
         }
       }
     });
   }



   validate()
   {
       let errors = {};
       const fields = this.state.BookTicketData.fields;
       errors.customer = required(fields.customer);

      if(fields.mobile)
      {
          errors.mobile = checkMobileNo(fields.mobile);
      }

                   let validated = checkError(errors);


        this.setState({
          BookTicketData: {	...this.state.BookTicketData,
             errors : errors, validated : validated
          }
        });

        return validated;
   }
   onSaveBookTicket()
   {
     const {BookTicketData,BookTicket_old} = this.state;
     const	{editBookTicket, editMode} = this.props;

     if(this.validate())
     {
            let bookticket  = BookTicketData.fields;
            this.props.saveBookTicket({bookticket});

    }
  }

  onDeleteBookTicket()
  {
    const {BookTicketData,BookTicket_old} = this.state;

           let bookticket  = BookTicketData.fields;
           this.props.deleteBookTicket({bookticket});

 }

    onClose()
	 	{
      this.setState(this.getInitialState());
	 		this.props.clsAddNewBookTicketModel();

	 	}

	render() {

	 const	{ addNewBookTicketModal, disabled , dialogLoading , editMode , editBookTicket,booktickettypelist ,storelist,clientProfileDetail, deleteRights} = this.props;
 	 const {BookTicketData ,activeIndex} = this.state;

		return (
			<Dialog fullScreen = {false} maxWidth = 'md' open={addNewBookTicketModal} onClose={() =>this.onClose()} >

        <DialogTitle >
        <span className="fw-bold text-capitalize">
        {BookTicketData.fields && BookTicketData.fields.sheetid ? "SHEET NO. " + BookTicketData.fields.sheetid : (BookTicketData.fields ? "TICKET NO. " + BookTicketData.fields.ticketid : '')} </span>
        </DialogTitle>
    <DialogContent>
				{((editMode && !editBookTicket) || dialogLoading ) &&
					<RctSectionLoader />
				}

             <BookTicketDetail fields = {BookTicketData.fields} errors ={BookTicketData.errors}  onChange = {this.onChangeBookTicket.bind(this)}
           clientprofile ={clientProfileDetail} editMode = {editMode}
            />

        </DialogContent>
        <DialogActions className = " d-flex justify-content-between align-items-center">
          <div>
          {deleteRights && BookTicketData.fields && BookTicketData.fields.customer &&
        <Button variant="contained" onClick={() =>this.onDeleteBookTicket()}  disabled = {disabled} className="btn-warning text-white">
          {BookTicketData.fields && BookTicketData.fields.sheetid ? "Cancel Sheet" : "Cancel Ticket"}
            </Button>
          }
          </div>
          <div>
          <Button variant="contained" onClick={() =>this.onClose()}  className="btn-danger text-white">
            Cancel
              </Button>
          <Button variant="contained" color="primary" onClick={() =>this.onSaveBookTicket()} disabled = {disabled} className="text-white ml-10">
            Save
              </Button>
              </div>
        </DialogActions>
			</Dialog>

	);
  }
  }
const mapStateToProps = ({ bookticketReducer,settings }) => {
	const { addNewBookTicketModal, disabled, dialogLoading, editBookTicket, editMode,booktickettypelist, storelist } =  bookticketReducer;
  const { clientProfileDetail,userProfileDetail} = settings;
  return { addNewBookTicketModal, disabled , dialogLoading, editBookTicket, editMode,booktickettypelist,storelist, clientProfileDetail,userProfileDetail}
}

export default connect(mapStateToProps,{
	clsAddNewBookTicketModel, saveBookTicket,deleteBookTicket , push})(AddBookTicket);
