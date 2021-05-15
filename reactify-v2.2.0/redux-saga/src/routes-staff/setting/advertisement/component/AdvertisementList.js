/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getAdvertisements , opnAddNewAdvertisementModel,opnViewAdvertisementModel
  ,deleteAdvertisement,clsViewAdvertisementModel,clsAddNewAdvertisementModel,opnEditAdvertisementModel,advertisementHandlechangeSelectAll,
advertisementHandleSingleCheckboxChange} from 'Actions';
import {required,email,checkLength,checkMobileNo,checkPincode,checkAlpha} from 'Validations';

import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate,getFormtedDateTime ,checkError,checkModuleRights,getParams, makePlaceholderRTFilter,getStatusColor} from 'Helpers/helpers';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Advertisementcategory from 'Assets/data/advertisementcategory';
import IsTaxInvoice  from 'Assets/data/istaxinvoice';
import  Quoteofdaytype from 'Assets/data/quoteofdaytype';
import Checkbox from '@material-ui/core/Checkbox';
import BulkEnablePublishingStatus from './bulkenablepublishingstatus';
import BulkDisablePublishingStatus from './bulkdisablepublishingstatus';

class AdvertisementList extends Component {
	constructor(props) {
     super(props);
		 	this.state = {
				dataToDelete : null,
				deleteConfirmationDialog : false,
        exportBudgetDialog : false,
		  };
   }

 componentWillMount()
		 {
			 this.hashRedirect(location);
		 }

  initiateExport = () =>
  {
    this.setState({
      exportBudgetDialog : true
    });
  }
  cancelExportDialog = () =>
  {
    this.setState({
      exportBudgetDialog : false
    });
  }
  onAdd() {
    this.props.opnAddNewAdvertisementModel();
	}

  initiateDelete(data)
  {
    let requestData = {};
    requestData.id = data.id;
    requestData.title = data.title;

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
    this.props.deleteAdvertisement(data);

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
      else if(hash == "#"+ "view")
       {
         let params = getParams(search);
         if(params && params.id)
         {
              this.props.opnViewAdvertisementModel({id : params.id});
         }
       }
       else if(hash == "#"+ "edit")
  		 {
  			 let params = getParams(search);
  			 if(params && params.id)
  			 {
  						this.props.opnEditAdvertisementModel({id : params.id});
  			 }
  		 }
		}

		componentWillReceiveProps(nextProps, nextState) {
			const {pathname, hash, search} = nextProps.location;

			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
			{
				this.props.clsViewAdvertisementModel();
				this.props.clsAddNewAdvertisementModel();

				this.hashRedirect({pathname, hash, search});
			}
		}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.advertisements || !nextProps.advertisements || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog ||
     this.state.exportBudgetDialog != nextState.exportBudgetDialog )
		{
			return true;
		}
		else {
			return false;
		}
	}

  advertisementhandlechangeSelectAll = (value) => {
 		this.props.advertisementHandlechangeSelectAll(value);
 	 };

  advertisementhandleSingleCheckboxChange(value,data,id){
 		this.props.advertisementHandleSingleCheckboxChange(value,data,id);
 		};

	render() {
	const	{ deleteConfirmationDialog, dataToDelete,exportBudgetDialog} = this.state;
	const	{ advertisements, tableInfo ,userProfileDetail,clientProfileDetail,selectAll} = this.props;
  let updateRights = checkModuleRights(userProfileDetail.modules,"advertisement","update");
  let deleteRights = checkModuleRights(userProfileDetail.modules,"advertisement","delete");
  let addRights = checkModuleRights(userProfileDetail.modules,"advertisement","add");
  const {pathname, hash, search} = this.props.location;
	let params = getParams(search);
  let mobile = params && params.mo ? params && params.mo: null;

  let columns = [
    {
				Header: (
					<Checkbox
						color="primary"
						onChange={(e) => this.advertisementhandlechangeSelectAll(e.target.checked)}
						checked={selectAll}
						className ="p-0"
					/>
				),
				Cell: data => (
          <div>
          	<Checkbox
  					 color="primary"
  						defaultChecked={data.original.checked}
  						checked={data.original.checked || false}
  						onChange={(e) => this.advertisementhandleSingleCheckboxChange(e.target.checked,data.original,data.original.id)}
  					/>
          </div>
				),
				sortable: false,
				filterable: false,
				className : "text-center",
				minWidth:60,
  		},
      {
        Header: "TITLE",
        accessor: 'title',
        Filter : makePlaceholderRTFilter(),
        minWidth:110,
        Cell : data => (
          <Link to= {"/app/setting/advertisement?id="+data.original.id+"#view"} >
            <h5 className="fw-bold text-uppercase">{data.original.title }</h5>
          </Link>
        ),
      },
      {
        Header: "CATEGORY",
        accessor: "advertisementcategory",
        Filter: ({ filter, onChange }) =>
          ( <select
              onChange={event => onChange(event.target.value)}
              style={{ width: "100%" }}
              value={filter ? filter.value : ""}
            >
            <option value="" >Show All</option>
            {  Advertisementcategory.map((advertisementcategory, key) => (<option value={advertisementcategory.value} key = {'advertisementcategoryOption' + key }>{advertisementcategory.name}</option>  )) }
            </select>
          ),
        minWidth:120
      },
      {
        Header: "PUBLISHING STATUS",
        accessor: "publishingstatus",
        Filter: ({ filter, onChange }) =>
          ( <select
              onChange={event => onChange(event.target.value)}
              style={{ width: "100%" }}
              value={filter ? filter.value : ""}
            >
            <option value="" >Show All</option>
            {  IsTaxInvoice.map((publishingstatus, key) => (<option value={publishingstatus.value} key = {'publishingstatusOption' + key }>{publishingstatus.name}</option>  )) }
            </select>
          ),
        minWidth:90,
        className : "text-center",
        Cell : data => (
            <h5 >{data.original.publishingstatus}</h5>
        ),
      },
      {
        Header: "PUBLISHING DATE",
        accessor: "publishstartdate",
        className : "text-center",
        Filter: ({onChange }) =>
         (
           <DatePicker  keyboard = {false}
             onChange = {date => onChange( date) }
           />
           ),
        Cell : data => (getFormtedDate(data.original.publishstartdate)),
         minWidth:120,
      },
      {
        Header: "PUBLISH END DATE",
        accessor: "publishenddate",
        className : "text-center",
        Filter: ({onChange }) =>
         (
           <DatePicker  keyboard = {false}
             onChange = {date => onChange( date) }
           />
           ),
        Cell : data => (
          getFormtedDate(data.original.publishenddate)
        ),
         minWidth:120,
      },
      {
        Header: "ADVERTISEMENT AS",
        accessor: "quotetype",
        Filter: ({ filter, onChange }) =>
          ( <select
              onChange={event => onChange(event.target.value)}
              style={{ width: "100%" }}
              value={filter ? filter.value : ""}
            >
            <option value="" >Show All</option>
            {  Quoteofdaytype.map((quotetype, key) => (<option value={quotetype.value} key = {'quotetypeOption' + key }>{quotetype.name}</option>  )) }
            </select>
          ),
        minWidth:120,
        className : "text-center",
      },
  ];


  if(updateRights || deleteRights)
 {
   columns.splice(1, 0, {
       Header: "ACTION",
       Cell : data => (<div className="list-action d-inline hover-action">

       {updateRights &&
          <Fab component = {Link} to= {"/app/setting/advertisement?id="+data.original.id+"#edit"}  className="btn-success text-white m-5" variant="round" mini= "true" >
              <i className="ti-pencil"></i>
          </Fab>
       }
       {deleteRights &&
         <Fab className="btn-danger text-white m-5" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
           <i className="zmdi zmdi-delete"></i>
         </Fab>
       }
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
         {checkModuleRights(userProfileDetail.modules,"advertisement","add") &&	<Link to="/app/setting/advertisement#add"  className="btn-outline-default mr-10 fw-bold mt-5"><i className="ti-plus"></i> Add Advertisement</Link>}
        </div>
        <div >
             <span className = "pr-5"> Total {tableInfo.totalrecord} Records </span>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-between">
              {(updateRights && addRights) && advertisements && advertisements.filter(x => x.checked == true).length > 0 &&
                    <BulkEnablePublishingStatus />
              }
              {(updateRights && addRights) && advertisements && advertisements.filter(x => x.checked == true).length > 0 &&
                    <BulkDisablePublishingStatus />
              }
        </div>
        <div>  </div>
      </div>

        <ReactTable
          columns={columns}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          showPaginationTop = {true}
          data={advertisements ||  []}
          pages={tableInfo.pages} // Display the total number of pages
          loading={advertisements ? false: true} // Display the loading overlay when we need it
          filterable
          defaultPageSize={tableInfo.pageSize}
          minRows = {1}
          className=" -highlight"
          onFetchData = {(state, instance) => { this.props.getAdvertisements({state}) }}
        />

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
                    message= { <span className = 'text-capitalize'> {dataToDelete.title}  </span> }
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}


					</div>

	);
  }
  }
const mapStateToProps = ({ advertisementReducer , settings}) => {
	const {advertisements , tableInfo ,selectAll} =  advertisementReducer;
  const { userProfileDetail,clientProfileDetail } =  settings;
   return {advertisements , tableInfo ,userProfileDetail,clientProfileDetail,selectAll}
}

export default connect(mapStateToProps,{
	getAdvertisements,opnAddNewAdvertisementModel, opnViewAdvertisementModel, deleteAdvertisement,
  clsViewAdvertisementModel,clsAddNewAdvertisementModel,opnEditAdvertisementModel,advertisementHandlechangeSelectAll,
  advertisementHandleSingleCheckboxChange})(AdvertisementList);
