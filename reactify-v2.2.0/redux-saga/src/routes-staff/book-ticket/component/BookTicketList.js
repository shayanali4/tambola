/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getBookTickets, opnAddNewBookTicketModel ,opnViewBookTicketModel, opnEditBookTicketModel, deleteBookTicket,
clsViewBookTicketModel,clsAddNewBookTicketModel,BookTickethandlechangeSelectAll,BookTickethandleSingleCheckboxChange } from 'Actions';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import  Status from 'Assets/data/status';
import {getLocalDate, getFormtedDate, checkError,checkModuleRights, getParams, makePlaceholderRTFilter, getFormtedDateTime} from 'Helpers/helpers';
import Refresh from '@material-ui/icons/Refresh';
import Fab from '@material-ui/core/Fab';
import { NotificationManager } from 'react-notifications';
import AddBookTicket from './AddBookTicket';


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
			 this.props.getBookTickets();
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

	onChangeIndexColor(key)
	    {

				let {userProfileDetail}  = this.props;

				if(key.customer && userProfileDetail && userProfileDetail.id == key.salesbyid) {
					return "bg-warning";
				}
				else if(key.customer)
				{  return "bg-success";    }
	      else { return "bg-primary";   }
	    }
			onChangeSheetColor(key)
					{
						let {userProfileDetail}  = this.props;


						if(key[0].customer && userProfileDetail && userProfileDetail.id == key[0].salesbyid &&
							key[0].customer == key[1].customer &&
							key[1].customer == key[2].customer &&
							key[2].customer == key[3].customer &&
							key[3].customer == key[4].customer &&
							key[4].customer == key[5].customer &&
							key[5].customer == key[0].customer)
						{  return "bg-warning";    }
						else if(key[0].customer &&
							key[0].customer == key[1].customer &&
							key[1].customer == key[2].customer &&
							key[2].customer == key[3].customer &&
							key[3].customer == key[4].customer &&
							key[4].customer == key[5].customer &&
							key[5].customer == key[0].customer)
						{  return "bg-success";    }
						else { return "bg-secondary";   }
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
							<Button variant="contained"  onClick={() => this.props.getBookTickets()}  className= {" py-5 "  }  >
												<Refresh />  Refresh
											</Button>
							</div>
							</div>





					{booktickets &&
					booktickets.map((sheet,key)=>(
							<div className = "d-flex p-0 offset-md-1 offset-lg-1 " key = {"ticket-key-" + key}>



							 <div style ={{"borderRadius" : 10,  "width" : 120 }}	onClick ={()=>
								 {
									 let sameCustomer = sheet[0].customer == sheet[1].customer && sheet[1].customer == sheet[2].customer &&
									  sheet[2].customer == sheet[3].customer && sheet[3].customer == sheet[4].customer &&
									  sheet[4].customer == sheet[5].customer && sheet[5].customer == sheet[0].customer;

									 if(sheet[0].customer && sameCustomer && userProfileDetail && userProfileDetail.rolealias == "sales"
							 												 &&  sheet[0].salesbyid != userProfileDetail.id)
									 {
										 	NotificationManager.error("This sheet can't be updated.");
									 }
									 else if(!sameCustomer)
									 {
									 	 NotificationManager.error("This sheet can't be sold.");
									 }
							 	 	 else {
										 	let ticketToBook = sheet[0];
						         ticketToBook.sheetid  = Math.ceil(ticketToBook.ticketid/6);
										 this.props.opnAddNewBookTicketModel(ticketToBook);
									 }}}	 className ={"  text-center pt-15 text-white " + this.onChangeSheetColor(sheet)}>
				 							<span className="fw-bold my-auto  text-uppercase pointer">{"Sheet : " + (key + 1)}</span>
				 				</div>


						{sheet && sheet.map((ticket, tkey) =>
								(

									<div style ={{"height" : 40, "width" : 40 }}
									onClick ={()=> {
										if(ticket.customer && userProfileDetail && userProfileDetail.rolealias == "sales"
										&&  ticket.salesbyid != userProfileDetail.id)
										{NotificationManager.error("This ticket can't be updated.");}
										else {this.props.opnAddNewBookTicketModel(ticket);}
									}}
									 className ={" rounded-circle pointer text-center pt-10 "  + this.onChangeIndexColor(ticket)}>

																<span className="fw-bold my-auto  text-uppercase">{ticket.ticketid}</span>
															</div>

								)

						)

						}
							</div>
					))
					}

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
								<AddBookTicket history = {this.props.history} location = {this.props.location} deleteRights = {deleteRights}/>

									</div>

	);
  }
  }
const mapStateToProps = ({ bookticketReducer ,settings}) => {
	const { booktickets, game, tableInfo } =  bookticketReducer;
	const { userProfileDetail,clientProfileDetail} = settings;
  return { booktickets,game, tableInfo ,userProfileDetail,clientProfileDetail}
}

export default connect(mapStateToProps,{
	getBookTickets, opnAddNewBookTicketModel ,opnViewBookTicketModel, opnEditBookTicketModel, deleteBookTicket,
clsViewBookTicketModel,clsAddNewBookTicketModel})(BookTicketList);
