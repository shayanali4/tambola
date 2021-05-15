/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import {Link} from 'react-router-dom';
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getShift, opnAddNewShiftModel, opnEditShiftModel, deleteShift , clsAddNewShiftModel} from 'Actions';

import CustomConfig from 'Constants/custom-config';
import {checkModuleRights, getParams, makePlaceholderRTFilter,getFormtedTimeFromJsonDate,cloneDeep} from 'Helpers/helpers';
import Fab from '@material-ui/core/Fab';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Shifttype  from 'Assets/data/shifttype';


class ShiftList extends Component {
	constructor(props) {
     super(props);
		 	this.state = {
				dataToDelete : null,
				deleteConfirmationDialog : false,
		  };
   }

   componentWillMount()
   {
			this.hashRedirect(location);
   }

  onAdd() {
		this.props.opnAddNewShiftModel();
	}

  initiateDelete(data)
  {

    let requestData = {};
    requestData.id = data.id;
		requestData.shiftname = data.shiftname;

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
		this.props.deleteShift(data);

  }
  cancelDelete()
  {
    this.setState({
			deleteConfirmationDialog : false,
      dataToDelete : null
		});
  }

	hashRedirect({pathname, hash, search})
	{
		if(hash == "#"+ "add")
		{
			this.onAdd();
		}
	 else if(hash == "#"+ "edit")
	 {
		 let params = getParams(search);
		 if(params && params.id)
		 {
					this.props.opnEditShiftModel({id : params.id});
		 }
	 }
	}

	componentWillReceiveProps(nextProps, nextState) {

		const {pathname, hash, search} = nextProps.location;

		if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
		{

			this.props.clsAddNewShiftModel();

			this.hashRedirect({pathname, hash, search});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(!nextProps.shifts || nextProps.shifts || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog   )
		{
			return true;
		}
		else {
			return false;
		}
	}

	render() {

	const	{ deleteConfirmationDialog, dataToDelete} = this.state;
	 const	{ shifts, tableInfo ,userProfileDetail} = this.props;

	 let updateRights = checkModuleRights(userProfileDetail.modules,"manageshift","update");
	 let deleteRights = checkModuleRights(userProfileDetail.modules,"manageshift","delete");

	 let columns = [
					 {
						 Header: "SHIFT NAME",
						 accessor: "shiftname",
						 Filter : makePlaceholderRTFilter(),
						 minWidth:170,
             className : "text-center",
					 },
					 {
						 Header: "SHIFT TYPE",
						 accessor: 'shifttype',
						 Filter: ({ filter, onChange }) =>
							 ( <select
									 onChange={event => onChange(event.target.value)}
									 style={{ width: "100%" }}
									 value={filter ? filter.value : ""}
								 >
								 <option value="" >Show All</option>
								 {  Shifttype.map((shifttype, key) => (<option value={shifttype.value} key = {'shifttypeOption' + key }>{shifttype.name}</option>  )) }
								 </select>
							 ),
							 minWidth:110,
							 className : "text-center",
					 },
					 {
	           Header: "PER DAY SLOT",
	           accessor: 'perdayslot',
	           filterable : false,
	           Cell : data => (
							 <h5>{data.original.perdayslot }</h5>
	           ),
	           className : "text-center",
						 minWidth:120,
	         },
	 		 ];

			 if(updateRights || deleteRights)
				 {
         columns.splice(0, 0, {
						Header: "ACTION",
						 Cell : data => (<div className="list-action d-inline hover-action">

		           { updateRights &&  <Fab component = {Link} to= {"/app/users/manageshift?id="+data.original.id+"#edit"}  className="btn-success text-white m-5" variant="round" mini= "true" >
		             <i className="ti-pencil"></i>
		           </Fab>}
		             {  deleteRights && <Fab className="btn-danger text-white m-5" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
		             <i className="zmdi zmdi-delete"></i>
		           </Fab>}
							 </div>
						 ),
						 filterable : false,
						 sortable : false,
					  	minWidth:90
					 });
				 }
		return (
			<div className="table-responsive">
				<div className="d-flex justify-content-between py-20 px-10">
					<div>
							{checkModuleRights(userProfileDetail.modules,"manageshift","add") &&
							  <Link to="/app/users/manageshift#add"  className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Shift</Link>
							}
					</div>
					<div >
						<span className = "pr-5"> Total {tableInfo.totalrecord} Records </span>

					</div>
				</div>
								<ReactTable
									columns={columns}
									manual // Forces table not to paginate or sort automatically, so we can handle it server-side
									showPaginationTop = {true}
									data={shifts || []}
									pages={tableInfo.pages} // Display the total number of pages
									loading={shifts ? false : true} // Display the loading overlay when we need it
									filterable
									defaultPageSize={tableInfo.pageSize}
									minRows = {1}
									className=" -highlight"
									onFetchData = {(state, instance) => {this.props.getShift({state}) }}
								/>

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
										message={ dataToDelete.shiftname}
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}


					</div>

	);
  }
  }
const mapStateToProps = ({ employeeShiftReducer , settings}) => {
	const {shifts , tableInfo } =  employeeShiftReducer;
	const { userProfileDetail} = settings;
  return {shifts , tableInfo ,userProfileDetail}
}

export default connect(mapStateToProps,{
	getShift,opnAddNewShiftModel, opnEditShiftModel, deleteShift, clsAddNewShiftModel})(ShiftList);
