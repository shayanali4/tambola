/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import {opnAddNewTemplateConfigurationModel ,getTemplateConfigurations ,opnViewTemplateConfigurationModel ,
	opnEditTemplateConfigurationModel,deleteTemplateConfiguration,clsViewTemplateConfigurationModel,
  clsAddNewTemplateConfigurationModel} from 'Actions';
import {required,email,checkLength,checkMobileNo,checkPincode,checkAlpha} from 'Validations';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import PageSize from 'Components/GridView/PageSizes';
import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate, checkError,checkModuleRights,getParams, makePlaceholderRTFilter} from 'Helpers/helpers';
import TemplateType  from 'Assets/data/templateType';
import {Link} from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TagnameList from './TagnameList';


class TemplatConfigurationList extends Component {
	constructor(props) {
     super(props);
		 	this.state = {
				activeTab : 1,
				dataToDelete : null,
				deleteConfirmationDialog : false,
		  };
   }

componentWillMount()
		 {
			 this.hashRedirect(location);
		 }

  onAdd() {
    this.props.opnAddNewTemplateConfigurationModel();
	}

  onEdit(data) {
   let requestData = {};
   requestData.id = data.id;
		this.props.opnEditTemplateConfigurationModel(requestData);
	}
	initiateDelete(data)
	{
		let requestData = {};
		requestData.id = data.id;
		requestData.templatetitle = data.templatetitle;

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
		this.props.deleteTemplateConfiguration(data);

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
						this.props.opnEditTemplateConfigurationModel({id : params.id});
			 }
		 }
		 else if(hash == "#"+ "view")
			{
				let params = getParams(search);
				if(params && params.id)
				{
						 this.props.opnViewTemplateConfigurationModel({id : params.id});
				}
			}
		}

		componentWillReceiveProps(nextProps, nextState) {

			const {pathname, hash, search} = nextProps.location;

			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
			{

				this.props.clsViewTemplateConfigurationModel();
				this.props.clsAddNewTemplateConfigurationModel();

				this.hashRedirect({pathname, hash, search});
			}


		}

	shouldComponentUpdate(nextProps, nextState) {

		if(!nextProps.templates || nextProps.templates || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog)
		{
			return true;
		}
		else {
			return false;
		}
	}

	handleChange(value) {
			this.setState({ activeTab: value });
			this.props.getTemplateConfigurations({activeTab : value});
	}

	render() {

	const	{ deleteConfirmationDialog, dataToDelete ,activeTab} = this.state;
	 const	{templates, tableInfo, mobile ,userProfileDetail,clientProfileDetail} = this.props;

	 let updateRights = checkModuleRights(userProfileDetail.modules,"templateconfiguration","update");
	 let columns = [
		 {
			 Header: "TEMPLATE TITLE",
			 accessor : "templatetitle",
			 Cell : data => (
				 <Link to= {"/app/setting/template-configuration/0?id="+data.original.id+"#view"} >
					 <h5 className=" text-uppercase">{data.original.templatetitle }</h5>
				 </Link>
			 ),
			 Filter : makePlaceholderRTFilter(),
				minWidth:200,
		 },
		 {
			 Header: "TEMPLATE TYPE",
				 accessor : "templatetype",
				 Filter: ({ filter, onChange }) =>
					 ( <select
							 onChange={event => onChange(event.target.value)}
							 style={{ width: "100%" }}
							 value={filter ? filter.value : ""}
						 >
						 <option value="" >Show All</option>
						 {  TemplateType.map((templatetype, key) => (<option value={templatetype.value} key = {'templatetypeOption' + key }>{templatetype.name}</option>  )) }
						 </select>
					 ),
					 className : "text-center",
					 minWidth:150,
		 },
		 {
			 Header: "SUBJECT",
				 accessor : "subject",
				 filterable : false,
				 sortable : false,
				 Filter : makePlaceholderRTFilter(),
					minWidth:300,
		 }
	 ];

	 if(updateRights )
	 {
		 columns.splice(0, 0, {
 			 Header: "ACTION",
 			 Cell : data => (<div className="list-action d-inline hover-action">

 				 { updateRights &&  <Fab component = {Link} to= {"/app/setting/template-configuration/0?id="+data.original.id+"&tab="+activeTab+"#edit"}  className="btn-success text-white m-5" variant="round" mini= "true" >
 					 <i className="ti-pencil"></i>
 				 </Fab>}

 				 {/*  <a href="javascript:void(0)" onClick={() => this.onView(data.original)}><i className="ti-eye"></i></a>*/}
 				 {/*  updateRights &&  	<Link to= {"/app/setting/template-configuration/0?id="+data.original.id+"#edit"}><i className="ti-pencil"></i></Link> */}
 			 {/* <a href="javascript:void(0)" onClick={() => this.initiateDelete(data.original)}><i className="ti-close"></i></a>*/}
 				 </div>
 			 ),
 			 filterable : false,
 			 sortable : false,
 				width:80
 		 });
	 }
   	return (
			<div className="rct-tabs">
		{	/*	<Tabs
					value={activeTab}
					onChange={(e, value) => this.handleChange(value)}
					variant = "scrollable"
					scrollButtons="off"
					indicatorColor="primary"
				>
				{clientProfileDetail && clientProfileDetail.clienttypeId !=2 && clientProfileDetail.packtypeId != 1 &&
				  <Tab  label={"Staff Notification"} value = {0}/>
			}
					<Tab  label={"Member Notification"} value = {1}/>

			  </Tabs>

    */}


			<div className="table-responsive">
				<div className="d-flex justify-content-between py-10 px-10">
						<div>
						</div>
						<div>
							<span  className = "pr-10 pt-10 d-inline"> Total {tableInfo.totalrecord} Records </span>
							<TagnameList  />
						</div>
				</div>


        <ReactTable
          columns={columns}
          defaultFiltered = {mobile ? [{"id":"mobile","value": mobile}] : []}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          showPaginationTop = {true}
          pages={tableInfo.pages} // Display the total number of pages
					data={templates || []}
          loading={templates ? false :true} // Display the loading overlay when we need it
          filterable = {true}
					sortable = {false}
          defaultPageSize={tableInfo.pageSize}
          minRows = {1}
          className=" -highlight"
					onFetchData = {(state, instance) => { state.activeTab = activeTab; this.props.getTemplateConfigurations({state}) }}

        />

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
										message= { <span className = 'text-capitalize'>  {dataToDelete.templatetitle } </span> }
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}

					</div>
			</div>

	);
  }
  }
const mapStateToProps = ({ templateconfigurationReducer , settings}) => {
	const {templates, tableInfo } =  templateconfigurationReducer;
	const { userProfileDetail,clientProfileDetail} = settings;
   return {templates, tableInfo ,userProfileDetail,clientProfileDetail}
}

export default connect(mapStateToProps,{
	opnAddNewTemplateConfigurationModel ,getTemplateConfigurations ,opnViewTemplateConfigurationModel,
	opnEditTemplateConfigurationModel,deleteTemplateConfiguration,clsViewTemplateConfigurationModel,
  clsAddNewTemplateConfigurationModel})(TemplatConfigurationList);
