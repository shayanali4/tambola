/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import {Link} from 'react-router-dom';
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getAssignShift, opnAddNewAssignShiftModel, opnEditAssignShiftModel, deleteAssignShift , clsAddNewAssignShiftModel} from 'Actions';

import CustomConfig from 'Constants/custom-config';
import {checkModuleRights, getParams, makePlaceholderRTFilter,getFormtedTimeFromJsonDate,getFormtedDate,cloneDeep} from 'Helpers/helpers';
import Fab from '@material-ui/core/Fab';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import { push } from 'connected-react-router';

class AssignShiftList extends Component {
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
		this.props.opnAddNewAssignShiftModel();
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
		this.props.deleteAssignShift(data);

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
     const	{ assignshift } = this.props;
     let params = getParams(search);
     if(params && params.id)
     {
			 let shiftdetail = cloneDeep(assignshift);
        let data = shiftdetail ? shiftdetail.filter(x => x.id == params.id)[0] : '';
				if(data)
				 {
					 this.props.opnEditAssignShiftModel({data : data});
				 }
				else {
				 	 this.props.push('/app/users/assignshift');
				 }
     }
	 }
	}

	componentWillReceiveProps(nextProps, nextState) {

		const {pathname, hash, search} = nextProps.location;

		if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
		{

			this.props.clsAddNewAssignShiftModel();

			this.hashRedirect({pathname, hash, search});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(!nextProps.assignshift || nextProps.assignshift || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog   )
		{
			return true;
		}
		else {
			return false;
		}
	}

	render() {

	const	{ deleteConfirmationDialog, dataToDelete} = this.state;
	 const	{ assignshift, assignShifTableInfo ,userProfileDetail,employeeList} = this.props;

	 let updateRights = checkModuleRights(userProfileDetail.modules,"assignshift","update");
	 let deleteRights = checkModuleRights(userProfileDetail.modules,"assignshift","delete");

	 let columns = [
					 {
						 Header: "STAFF NAME",
						 accessor: "employeename",
						 Filter : makePlaceholderRTFilter(),
						 minWidth:170,
             className : "text-center",
						 Filter: ({ filter, onChange }) =>
						 ( <select
								 onChange={event => onChange(event.target.value)}
								 style={{ width: "100%" }}
								 value={filter ? filter.value : ""}
							 >
							 <option value="" >Show All</option>
							 {  employeeList && employeeList.map((employee, key) => (<option value={employee.id} key = {'employeeOption' + key }>{employee.label}</option>  )) }

							 </select>
						 )
					 },
					 {
						 Header: "SHIFT NAME",
						 accessor: "shiftname",
						 Filter : makePlaceholderRTFilter(),
						 minWidth:170,
             className : "text-center",
					 },
					 {
	           Header: "START DATE",
	           accessor: 'startdate',
	           Cell : data => (
							 <h5>{getFormtedDate(data.original.startdate) }</h5>
	           ),
	           className : "text-center",
						 minWidth:120,
						 Filter: ({filter,onChange }) =>
							 (
								 <DatePicker  keyboard = {false}
								 	value ={filter ? filter.value : null}
									 onChange = {date =>  onChange( date) }
								 />
								 ),
	         },
           {
	           Header: "END DATE",
	           accessor: 'enddate',
	           Cell : data => (
							 <h5>{getFormtedDate(data.original.enddate) }</h5>
	           ),
	           className : "text-center",
						 minWidth:120,
						 Filter: ({filter,onChange }) =>
							 (
								 <DatePicker  keyboard = {false}
								 	value ={filter ? filter.value : null}
									 onChange = {date =>  onChange( date) }
								 />
								 ),
	         },
	 		 ];

			 if(updateRights || deleteRights)
				 {
         columns.splice(0, 0, {
						Header: "ACTION",
						 Cell : data => (<div className="list-action d-inline hover-action">

		           { updateRights &&  <Fab component = {Link} to= {"/app/users/assignshift?id="+data.original.id+"#edit"}  className="btn-success text-white m-5" variant="round" mini= "true" >
		             <i className="ti-pencil"></i>
		           </Fab>}
		             {  deleteRights && <Fab className="btn-danger text-white m-5" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
		             <i className="zmdi zmdi-delete"></i>
		           </Fab>}
							 </div>
						 ),
						 filterable : false,
						 sortable : false,
					  	minWidth:50
					 });
				 }
		return (
			<div className="table-responsive">
				<div className="d-flex justify-content-between py-20 px-10">
					<div>
							{checkModuleRights(userProfileDetail.modules,"assignshift","add") &&
							  <Link to="/app/users/assignshift#add"  className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Assign Shift</Link>
							}
					</div>
					<div >
						<span className = "pr-5"> Total {assignShifTableInfo.totalrecord} Records </span>

					</div>
				</div>
								<ReactTable
									columns={columns}
									manual // Forces table not to paginate or sort automatically, so we can handle it server-side
									showPaginationTop = {true}
									data={assignshift || []}
									pages={assignShifTableInfo.pages} // Display the total number of pages
									loading={assignshift ? false : true} // Display the loading overlay when we need it
									filterable
									defaultPageSize={assignShifTableInfo.pageSize}
									minRows = {1}
									className=" -highlight"
									onFetchData = {(state, instance) => {this.props.getAssignShift({state}) }}
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
	const {assignshift , assignShifTableInfo ,employeeList} =  employeeShiftReducer;
	const { userProfileDetail} = settings;
  return {assignshift , assignShifTableInfo ,userProfileDetail,employeeList}
}

export default connect(mapStateToProps,{
	getAssignShift,opnAddNewAssignShiftModel, opnEditAssignShiftModel, deleteAssignShift, clsAddNewAssignShiftModel,push})(AssignShiftList);
