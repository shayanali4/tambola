/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import {opnAddNewRoleModel,getRoles,opnEditRoleModel,deleteRole,clsAddNewRoleModel } from 'Actions';

import CustomConfig from 'Constants/custom-config';
import {Link} from 'react-router-dom';

import {getLocalDate, getFormtedDate, checkError,checkModuleRights,getParams, makePlaceholderRTFilter} from 'Helpers/helpers';

import Fab from '@material-ui/core/Fab';

class RoleList extends Component {
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
		this.props.opnAddNewRoleModel();
	}

	initiateDelete(data)
	{
		let requestData = {};
		requestData.id = data.id;
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
		this.props.deleteRole(data);
	}

	cancelDelete()
	{
		this.setState({
			deleteConfirmationDialog : false,
			dataToDelete : null
		});
	}

hashRedirect({pathname, hash, search,newrole})
		{
			if(hash == "#"+ "add")
			{
				this.onAdd();
			}
		 else if(hash == "#"+ "edit")
		 {
			 const {role} = this.props;

			 let params = getParams(search);
			 newrole = role || newrole;

			 if(newrole && params && params.id)
			 {
				 		let data = newrole && newrole.filter(x => x.id == params.id)[0]
						this.props.opnEditRoleModel(data || {});
			 }
		 }
		}

		componentWillReceiveProps(nextProps, nextState) {

			const {pathname, hash, search} = nextProps.location;

			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search ||
			(!this.props.role && nextProps.role))
			{
				this.props.clsAddNewRoleModel();

				this.hashRedirect({pathname, hash, search,newrole : nextProps.role});
			}
		}

	shouldComponentUpdate(nextProps, nextState) {
		if(!nextProps.role || nextProps.role || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog  || (!this.props.role && nextProps.role))
		{
			return true;
		}
		else {
			return false;
		}
	}

	render() {
	const	{ deleteConfirmationDialog, dataToDelete} = this.state;
	 const	{tableInfo,role ,userProfileDetail,clientProfileDetail} = this.props;

	 let updateRights = checkModuleRights(userProfileDetail.modules,"role","update");
	 let deleteRights = checkModuleRights(userProfileDetail.modules,"role","delete");

	 let columns = [
				 {
					 Header: "Role",
					 accessor: "role",
					 Filter : makePlaceholderRTFilter(),
					 minWidth:300
				 }
	 ];

	 if(updateRights || deleteRights)
	{
		columns.splice(0, 0, {
				Header: "ACTION",
				Cell : data => (<div className="list-action d-inline hover-action">

          { updateRights &&  <Fab component = {Link} to= {"/app/setting/role?id="+data.original.id+"#edit"}  className="btn-success text-white m-5" variant="round" mini= "true" >
            <i className="fa fa-pencil"></i>
          </Fab>}
            {  data.original.alias == null && deleteRights && <Fab className="btn-danger text-white m-5" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
            <i className="zmdi zmdi-delete"></i>
          </Fab>}
				{/*  updateRights &&   <Link to= {"/app/setting/role?id="+data.original.id+"#edit"} ><i className="ti-pencil"></i></Link> */}
						 {/*data.original.alias == null && deleteRights &&
					<a href="javascript:void(0)" onClick={() =>{ this.initiateDelete(data.original)}}><i className="ti-close"></i></a>
					*/}
					</div>
				),
				sortable : false,
				filterable : false,
				width:120,
				 className : "text-center",
			});
	}
		return (
			<div className="table-responsive">
				<div className="d-flex justify-content-between py-20 px-10">
					<div>
						{clientProfileDetail && clientProfileDetail.packtypeId != 1 && checkModuleRights(userProfileDetail.modules,"role","add") &&
								<Link to="/app/setting/role#add"  className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Role</Link>
						}
					</div>
					<div className = "pt-5">
							<span > Total {tableInfo.totalrecord} Records </span>
					</div>
				</div>
        <ReactTable
          columns={columns}
      	           manual // Forces table not to paginate or sort automatically, so we can handle it server-side
									showPaginationTop = {true}
									pages={tableInfo.pages} // Display the total number of pages
									loading={role ? false : true} // Display the loading overlay when we need it
									filterable
									defaultPageSize={tableInfo.pageSize}
									data={role || []}
									minRows = {1}
									className=" -highlight"
									onFetchData = {(state, instance) => {this.props.getRoles({state}) }}
								/>

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
										message="This will delete user permanently."
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}
					</div>

	);
  }
  }
const mapStateToProps = ({ roleReducer , settings}) => {
	const { tableInfo,role } =  roleReducer;
	const { userProfileDetail,clientProfileDetail} = settings;
  return { tableInfo,role ,userProfileDetail,clientProfileDetail}
}

export default connect(mapStateToProps,{
opnAddNewRoleModel,getRoles,opnEditRoleModel,deleteRole,clsAddNewRoleModel})(RoleList);
