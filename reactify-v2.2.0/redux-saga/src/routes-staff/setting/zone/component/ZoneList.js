/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import {opnAddNewZoneModel,getZones,opnViewZoneModel,opnEditZoneModel,deleteZone,
clsViewZoneModel,clsAddNewZoneModel} from 'Actions';
import Weekdays from 'Assets/data/weekdays';
import Ownership  from 'Assets/data/ownership';

import CustomConfig from 'Constants/custom-config';
import {Link} from 'react-router-dom';
import {getLocalDate, getFormtedDate, checkError,checkModuleRights,getParams, makePlaceholderRTFilter} from 'Helpers/helpers';
import Fab from '@material-ui/core/Fab';

class ZoneList extends Component {
	constructor(props) {
     super(props);
		 	this.state = {
				dataToDelete : null,
				deleteConfirmationDialog : false
		  };
   }
componentWillMount()
		 {
			 this.hashRedirect(location);
		 }
  onAdd() {
		this.props.opnAddNewZoneModel();
	}
  onView(data)
  {
     let requestData = {};
    requestData.id = data.id;
    this.props.opnViewZoneModel(requestData);
  }

  initiateDelete(data)
  {
    let requestData = {};
    requestData.id = data.id;
		requestData.zonename = data.zonename;

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
		this.props.deleteZone(data);

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
						this.props.opnEditZoneModel({id : params.id});
			 }
		 }
		 else if(hash == "#"+ "view")
			{
				let params = getParams(search);
				if(params && params.id)
				{
						 this.props.opnViewZoneModel({id : params.id});
				}
			}
		}

		componentWillReceiveProps(nextProps, nextState) {

			const {pathname, hash, search} = nextProps.location;

			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
			{

				this.props.clsViewZoneModel();
				this.props.clsAddNewZoneModel();

				this.hashRedirect({pathname, hash, search});
			}


		}

	shouldComponentUpdate(nextProps, nextState) {

		if(!nextProps.zones || nextProps.zones || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog)
		{
			return true;
		}
		else {
			return false;
		}
	}

	render() {

	const	{ deleteConfirmationDialog, dataToDelete} = this.state;
	 const	{zones, tableInfo ,userProfileDetail} = this.props;

	 let updateRights = checkModuleRights(userProfileDetail.modules,"zone","update");
	 let deleteRights = checkModuleRights(userProfileDetail.modules,"zone","delete");

	 let columns = [
				 {
					 Header: "ZONE NAME",
					 accessor: "zonename",
					 Cell : data => (


						 <Link to= {"/app/setting/zone?id="+data.original.id+"#view"} >
						 	 <h5 className="fw-bold text-uppercase">{data.original.zonename }</h5>
					 	 </Link>
				 ),
				 Filter : makePlaceholderRTFilter(),
				 minWidth:300
				 },

	 ];

	 if(updateRights || deleteRights)
	 {
		 columns.splice(0, 0, {
				 Header: "ACTION",
				 Cell : data => (<div className="list-action d-inline hover-action">

				 		{ updateRights &&
						  <Fab component = {Link} to= {"/app/setting/zone?id="+data.original.id+"#edit"}  className="btn-success text-white m-5" variant="round" mini= "true" >
						 			<i className="ti-pencil"></i>
					 		</Fab>
						}
						{  deleteRights &&
							<Fab className="btn-danger text-white m-5" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
						 			<i className="zmdi zmdi-delete"></i>
					 		</Fab>
						}
					 {/*  updateRights &&  <Link to= {"/app/setting/zone?id="+data.original.id+"#edit"} ><i className="ti-pencil"></i></Link> */}
					 {/*  deleteRights && <a href="javascript:void(0)" onClick={() => this.initiateDelete(data.original)}><i className="ti-close"></i></a> */}
					 </div>
				 ),
				 sortable : false,
				 filterable : false,
				 width:100
			 });
	 }
		return (
			<div className="table-responsive">
				<div className="d-flex justify-content-between py-20 px-10">
					<div>
						{checkModuleRights(userProfileDetail.modules,"zone","add") &&
								<Link to="/app/setting/zone#add" className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Zone</Link>
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
          data={zones || []}
          pages={tableInfo.pages} // Display the total number of pages
          loading={zones ? false : true} // Display the loading overlay when we need it
          filterable
          defaultPageSize={tableInfo.pageSize}
          minRows = {1}
          className=" -highlight"
          onFetchData = {(state, instance) => {this.props.getZones({state}) }}
        />

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
										message= { <span className = 'text-capitalize'>  {dataToDelete.zonename } </span> }
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}
					</div>

	);
  }
  }
const mapStateToProps = ({ zoneReducer,settings }) => {
	const {zones , tableInfo } =  zoneReducer;
	const { userProfileDetail} = settings;
  return {zones , tableInfo ,userProfileDetail}
}

export default connect(mapStateToProps,{
	getZones, opnAddNewZoneModel ,opnViewZoneModel, opnEditZoneModel, deleteZone,
  clsViewZoneModel,clsAddNewZoneModel})(ZoneList);
