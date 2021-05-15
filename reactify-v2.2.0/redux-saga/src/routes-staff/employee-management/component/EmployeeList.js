/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import {Link} from 'react-router-dom';
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getEmployees, opnAddNewEmployeeModel ,opnViewStarterEmployeeModel, opnEditEmployeeModel, deleteEmployee, clsViewEmployeeModel , clsAddNewEmployeeModel} from 'Actions';

import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate,getFormtedDateTime , checkError,checkModuleRights, getParams, makePlaceholderRTFilter,getStatusColor} from 'Helpers/helpers';
import EmployeeExport from './EmployeeExport';
import Fab from '@material-ui/core/Fab';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';

class EmployeeList extends Component {
	constructor(props) {
     super(props);
		 	this.state = {
				dataToDelete : null,
				deleteConfirmationDialog : false,
				exportemployeeialog : false,

		  };
   }

   componentWillMount()
   {
			this.hashRedirect(location);
   }

	 initiateExport = () =>
				{
					this.setState({
							exportemployeeialog : true
						});
					}
	cancelExportDialog = () =>
					{
						this.setState({
							exportemployeeialog : false
						});
					}

  onAdd() {
		this.props.opnAddNewEmployeeModel();
	}

  initiateDelete(data)
  {
		let {clientProfileDetail} = this.props;
    let requestData = {};
    requestData.id = data.id;
		requestData.emailid = data.emailid;
		requestData.name = data.firstname +" " + data.lastname;
		requestData.userid = clientProfileDetail.id + data.employeecode;;
		requestData.name = data.firstname +  " " + data.lastname;
		if(clientProfileDetail.biometriclist && clientProfileDetail.biometriclist.length > 0){
		requestData.SerialNumber = clientProfileDetail.biometriclist.map(x => x.serialnumber);
	}
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
		this.props.deleteEmployee(data);

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
					this.props.opnEditEmployeeModel({id : params.id});
		 }
	 }
	 else if(hash == "#"+ "view")
		{
			let params = getParams(search);
			if(params && params.id)
			{
					 this.props.opnViewStarterEmployeeModel({id : params.id});
			}
		}
	}

	componentWillReceiveProps(nextProps, nextState) {

		const {pathname, hash, search} = nextProps.location;

		if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
		{

			this.props.clsViewEmployeeModel();
			this.props.clsAddNewEmployeeModel();

			this.hashRedirect({pathname, hash, search});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(!nextProps.employees || nextProps.employees || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog ||
			this.state.exportemployeeialog != nextState.exportemployeeialog  )
		{
			return true;
		}
		else {
			return false;
		}
	}
	getdatediff(lastcheckin)
  {
      if(lastcheckin)
      {
          let datediff = Math.floor(( getLocalDate(new Date()) - getLocalDate(lastcheckin))/(1000 * 3600 * 24));
          if(datediff > 0)
          {
            return  " (" + datediff + " days)";
          }
      }
        return "";
  }

	render() {

	const	{ deleteConfirmationDialog, dataToDelete,exportemployeeialog} = this.state;
	 const	{ employees, tableInfo ,userProfileDetail,clientProfileDetail,sessiontypelist} = this.props;

	 let updateRights = checkModuleRights(userProfileDetail.modules,"employeemanagement","update");
	 let deleteRights = checkModuleRights(userProfileDetail.modules,"employeemanagement","delete");

	 if(employees && sessiontypelist){
		 		employees.forEach(x => {
				 			x.specilizationlist = sessiontypelist.filter(z => x.specialization.includes(z.value.toString()))
		 		});
 	}
	 let columns = [
					 {
						 Header: "EMPLOYEE",
						 accessor: "firstname",
						 Cell : data =>
						 (
						<Link to = { "/app/employee-management?id="+data.original.id+"#edit"} >
						{/* <Link to= {clientProfileDetail && clientProfileDetail.packtypeId == 3 ? "/app/users/user-profileview?id=" + data.original.id : "/app/users/employee-management?id="+data.original.id+"#view"}>*/}

							 <div className="media">
									 <img src={CustomConfig.serverUrl + data.original.image} alt = ""
									 onError={(e)=>{
												let gender = data.original.genderId || '1';
											 e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}
											 className="rounded-circle" width="50" height="50"/>
								 <div className="media-body">
									 <h5 className="fw-bold text-capitalize">{data.original.firstname + ' ' + data.original.lastname}</h5>
									 <span className= {"ml-5 px-10 py-5 fs-12 badge "} style={{"backgroundColor": getStatusColor(data.original.statusId)}}>
										 {data.original.status}
									 </span>
								 </div>
							 </div>
							 </Link>
						 ),
						 Filter : makePlaceholderRTFilter(),
						 minWidth:140,
					 },
					 {
						 Header: "EMPLOYEE CODE",
						 accessor: 'employeecode',
						 className : "text-center",
						 Filter : makePlaceholderRTFilter(),
					 	minWidth:110,
					 },
					 {
						 Header: " EMAIL ADDRESS",
						 accessor: 'emailid',
						 Filter : makePlaceholderRTFilter(),
						 minWidth:200,
					 },
					 {
						 Header: "MOBILE NO",
						 accessor: 'mobile',
						 className : "text-center",
						 Cell : data => (
								data.original.mobile.indexOf('XXXXX') > -1  ? data.original.mobile :
							 <a href={"tel:" + data.original.mobile}>{data.original.mobile}</a>
						),
						Filter : makePlaceholderRTFilter(),
						minWidth:120,
					 },
					 {
						 Header: "ROLE",
						 accessor: 'role',
						 Filter : makePlaceholderRTFilter(),
						 minWidth:140,
					 },

					 {
		         Header: "Last Login Date",
		         accessor: 'lastlogindate',
		         Filter: ({onChange }) =>
		           (
		             <DatePicker  keyboard = {false}
		               onChange = {date => onChange( date) }
		             />
		             ),
		         Cell : data => (
		           <h5>{getFormtedDateTime(data.original.lastlogindate) }</h5>
		         ),
		         className : "text-center",
		          minWidth:145,
		       },
	 		 ];

			 if(updateRights || deleteRights)
				 {
         columns.splice(0, 0, {
						Header: "ACTION",
						 Cell : data => (<div className="list-action d-inline hover-action">

		           { updateRights && (userProfileDetail.zoneid || (!data.original.zoneid && data.original.defaultbranchid == userProfileDetail.defaultbranchid)) &&  <Fab component = {Link} to= {"/app/employee-management?id="+data.original.id+"#edit"}  className="btn-success text-white m-5" variant="round" mini= "true" >
		             <i className="fa fa-pencil"></i>
		           </Fab>}
		             {  deleteRights && clientProfileDetail.clienttypeId != 2 && (userProfileDetail.zoneid || (!data.original.zoneid && data.original.defaultbranchid == userProfileDetail.defaultbranchid))  && <Fab className="btn-danger text-white m-5" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
		             <i className="zmdi zmdi-delete"></i>
		           </Fab>}
					 {/*	<a href="javascript:void(0)" onClick={() => this.onView(data.original)}><i className="ti-eye"></i></a>*/}
							 {/*  updateRights && 	<Link to= {"/app/users/employee-management?id="+data.original.id+"#edit"} ><i className="ti-pencil"></i></Link> */}
							 {/*  deleteRights && 	<a href="javascript:void(0)" onClick={() => this.initiateDelete(data.original)}><i className="ti-close"></i></a> */}
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
							{clientProfileDetail.clienttypeId != 2	&& checkModuleRights(userProfileDetail.modules,"employeemanagement","add") &&
							  <Link to="/app/employee-management#add"  className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Employee</Link>
							}
					</div>
					<div >
						{clientProfileDetail.clienttypeId != 2	&&
							<span className = "pr-5"> Total {tableInfo.totalrecord} Records </span>
						}
						{clientProfileDetail.clienttypeId != 2	&& checkModuleRights(userProfileDetail.modules,"employeemanagement","export") &&
							<a href="javascript:void(0)" onClick={() => this.initiateExport()} className="btn-outline-default mr-10 "><i className="fa fa-cloud-download"></i> Download</a>
						}
					</div>
				</div>
								<ReactTable
									columns={columns}
									manual // Forces table not to paginate or sort automatically, so we can handle it server-side
									showPaginationTop = {true}
									data={employees || []}
									pages={tableInfo.pages} // Display the total number of pages
									loading={employees ? false : true} // Display the loading overlay when we need it
									filterable
									defaultPageSize={tableInfo.pageSize}
									minRows = {1}
									className=" -highlight"
									onFetchData = {(state, instance) => {this.props.getEmployees({state}) }}
								/>

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
										message={ dataToDelete.name + " - " + dataToDelete.emailid}
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}
								<EmployeeExport exportemployeeialog = {exportemployeeialog}
								onCancel = {this.cancelExportDialog.bind(this)} branchid = {userProfileDetail.defaultbranchid}/>

					</div>

	);
  }
  }
const mapStateToProps = ({ employeeManagementReducer , settings}) => {
	const {employees , tableInfo } =  employeeManagementReducer;
	const { userProfileDetail,clientProfileDetail, sessiontypelist} = settings;
  return {employees , tableInfo ,userProfileDetail,clientProfileDetail,sessiontypelist}
}

export default connect(mapStateToProps,{
	getEmployees,opnAddNewEmployeeModel, opnViewStarterEmployeeModel, opnEditEmployeeModel, deleteEmployee, clsViewEmployeeModel, clsAddNewEmployeeModel})(EmployeeList);
