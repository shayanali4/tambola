/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import  Status from 'Assets/data/status';
import {getLocalDate, getFormtedDate, checkError,checkModuleRights, getParams, makePlaceholderRTFilter, getFormtedDateTime} from 'Helpers/helpers';
import Refresh from '@material-ui/icons/Refresh';
import Fab from '@material-ui/core/Fab';
import Membershiprenewalanalysis from './membershiprenewalanalysis';

class BookTicketList extends Component {
	constructor(props) {
     super(props);
		 	this.state = {
				dataToDelete : null,
				deleteConfirmationDialog : false,
				exportBookTicketDialog : false,

		  };
   }

	 componentWillMount()
		 {
		 }
	 initiateExport = () =>
	 {
		 this.setState({
			 exportBookTicketDialog : true
		 });
	 }
	 cancelExportDialog = () =>
	 {
		 this.setState({
			 exportBookTicketDialog : false
		 });
	 }
  noofsheets(x) {
		this.props.opnAddNewBookTicketModel(x);
	}
	onChangeIndexColor(key)
	    {
	      if(key.customer)
				{  return "bg-warning";    }
	      else { return "bg-primary";   }
	    }
  initiateDelete(data)
  {
    let requestData = {};
    requestData.id = data.id;
		requestData.BookTicketname = data.BookTicketname;
    this.setState({
			deleteConfirmationDialog : true,
      dataToDelete : requestData
		});
  }

  onDelete(data)
  {
    this.setState({
      deleteConfirmationDialog : false,
      dataToDelete : null
    });
		this.props.deleteBookTicket(data);
  }

  cancelDelete()
  {
    this.setState({
			deleteConfirmationDialog : false,
      dataToDelete : null
		});
  }

		componentWillReceiveProps(nextProps, nextState) {

			const {pathname, hash, search} = nextProps.location;

			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
			{

				this.props.clsViewBookTicketModel();
				this.props.clsAddNewBookTicketModel();

			}
		}

	shouldComponentUpdate(nextProps, nextState) {

		if(!nextProps.BookTickets || nextProps.BookTickets || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog ||
		 this.state.exportBookTicketDialog != nextState.exportBookTicketDialog )
		{
			return true;
		}
		else {
			return false;
		}
	}

	inactiveHighlight(statusId)
	{
			if(statusId == 2)
			{
						return " text-danger";
			}
				return "";
	}
	BookTickethandlechangeSelectAll = (value) => {
 		this.props.BookTickethandlechangeSelectAll(value);
 	 };
  BookTickethandleSingleCheckboxChange(value,data,id){
 		this.props.BookTickethandleSingleCheckboxChange(value,data,id);
 		};

	render() {
	const	{ deleteConfirmationDialog, dataToDelete,exportBookTicketDialog} = this.state;
	 const	{ booktickets,game, tableInfo ,userProfileDetail, clientProfileDetail} = this.props;

	 let updateRights = checkModuleRights(userProfileDetail.modules,"bookticket","update");
	 let deleteRights = checkModuleRights(userProfileDetail.modules,"bookticket","delete");
	 let addRights = checkModuleRights(userProfileDetail.modules,"bookticket","add");


		return (
			<div className="table-responsive pb-20">

							<div className="d-flex justify-content-between py-20 px-10 pl-20 fs-20 fw-bold">
							<div>
									{game && game.salescount ?	"Your Total Sales : " + game.salescount : ""}
							</div>
							<div >

							</div>
							</div>





					<Membershiprenewalanalysis />

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
										message= { <span className = 'text-capitalize'>  {dataToDelete.BookTicketname } </span> }
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}

									</div>

	);
  }
  }
const mapStateToProps = ({ bookticketReducer ,settings}) => {
	const { booktickets, game, tableInfo } =  bookticketReducer;
	const { userProfileDetail,clientProfileDetail} = settings;
  return { booktickets,game, tableInfo ,userProfileDetail,clientProfileDetail}
}

export default connect(mapStateToProps,{})(BookTicketList);
