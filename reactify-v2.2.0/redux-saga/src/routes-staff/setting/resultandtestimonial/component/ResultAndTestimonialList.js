/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getResultAndTestimonial , opnAddNewResultAndTestimonialModel,opnViewResultAndTestimonialModel
  ,deleteResultAndTestimonial,clsViewResultAndTestimonialModel,clsAddNewResultAndTestimonialModel,opnEditResultAndTestimonialModel,resultAndTestimonialHandlechangeSelectAll,
resultAndTestimonialHandleSingleCheckboxChange} from 'Actions';

import {getLocalDate, getFormtedDate,getFormtedDateTime ,checkError,checkModuleRights,getParams, makePlaceholderRTFilter,getStatusColor} from 'Helpers/helpers';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import { Link } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import IsTaxInvoice  from 'Assets/data/istaxinvoice';
import Checkbox from '@material-ui/core/Checkbox';
import BulkEnablePublishingStatus from './bulkenablepublishingstatus';
import BulkDisablePublishingStatus from './bulkdisablepublishingstatus';
import Referby from 'Assets/data/referby';

class ResultAndTestimonialList extends Component {
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
    this.props.opnAddNewResultAndTestimonialModel();
	}

  initiateDelete(data)
  {
    let requestData = {};
    requestData.id = data.id;
    requestData.resultof = data.resultof;
    requestData.name = data.name;

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
    this.props.deleteResultAndTestimonial(data);

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
              this.props.opnViewResultAndTestimonialModel({id : params.id});
         }
       }
       else if(hash == "#"+ "edit")
  		 {
  			 let params = getParams(search);
  			 if(params && params.id)
  			 {
  						this.props.opnEditResultAndTestimonialModel({id : params.id});
  			 }
  		 }
		}

		componentWillReceiveProps(nextProps, nextState) {
			const {pathname, hash, search} = nextProps.location;

			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
			{
				this.props.clsViewResultAndTestimonialModel();
				this.props.clsAddNewResultAndTestimonialModel();

				this.hashRedirect({pathname, hash, search});
			}
		}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.resultandtestimonial || !nextProps.resultandtestimonial || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog  )
		{
			return true;
		}
		else {
			return false;
		}
	}

  resultandtestimonialhandlechangeSelectAll = (value) => {
 		this.props.resultAndTestimonialHandlechangeSelectAll(value);
 	 };

  resultandtestimonialhandleSingleCheckboxChange(value,data,id){
 		this.props.resultAndTestimonialHandleSingleCheckboxChange(value,data,id);
 		};

	render() {
	const	{ deleteConfirmationDialog, dataToDelete} = this.state;
	const	{ resultandtestimonial, tableInfo ,userProfileDetail,clientProfileDetail,selectAll} = this.props;
  let updateRights = checkModuleRights(userProfileDetail.modules,"resultandtestimonial","update");
  let deleteRights = checkModuleRights(userProfileDetail.modules,"resultandtestimonial","delete");
  let addRights = checkModuleRights(userProfileDetail.modules,"resultandtestimonial","add");
  const {pathname, hash, search} = this.props.location;
	let params = getParams(search);

  let columns = [
    {
				Header: (
					<Checkbox
						color="primary"
						onChange={(e) => this.resultandtestimonialhandlechangeSelectAll(e.target.checked)}
						checked={selectAll}
						className ="p-0"
					/>
				),
				Cell: data => (
  					<Checkbox
  					 color="primary"
  						defaultChecked={data.original.checked}
  						checked={data.original.checked || false}
  						onChange={(e) => this.resultandtestimonialhandleSingleCheckboxChange(e.target.checked,data.original,data.original.id)}
  					/>
				),
				sortable: false,
				filterable: false,
				className : "text-center",
				minWidth:60,
  		},
      {
        Header: "RESULT OF",
        accessor: "resultof",
        Cell : data => (
          <Link to= {"/app/setting/resultandtestimonial?id="+data.original.id+"#view"} >
            <h5 className="fw-bold text-uppercase">{data.original.resultof }</h5>
          </Link>
        ),
        Filter: ({ filter, onChange }) =>
          ( <select
              onChange={event => onChange(event.target.value)}
              style={{ width: "100%" }}
              value={filter ? filter.value : ""}
            >
            <option value="" >Show All</option>
            {  Referby.filter(x => clientProfileDetail && clientProfileDetail.clienttypeId == 2 ? x.value == 2 : (x.value != 3 && x.value != 4)).map((resultof, key) => (<option value={resultof.value} key = {'resultofOption' + key }>{resultof.name}</option>  )) }
            </select>
          ),
        minWidth:120,
        className : "text-center",
      },
      {
        Header: "NAME",
        accessor: "name",
        filterable : false,
        minWidth:90,
        className : "text-center",
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
      },
      {
        Header: "PUBLISH START DATE",
        accessor: "publishstartdate",
        className : "text-center",
        Filter: ({onChange }) =>
         (
           <DatePicker  keyboard = {false}
             onChange = {date => onChange( date) }
           />
           ),
        Cell : data => (
          getFormtedDate(data.original.publishstartdate)
        ),
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
  ];


  if(updateRights || deleteRights)
 {
   columns.splice(1, 0, {
       Header: "ACTION",
       Cell : data => (<div className="list-action d-inline hover-action">

       {updateRights &&
          <Fab component = {Link} to= {"/app/setting/resultandtestimonial?id="+data.original.id+"#edit"}  className="btn-success text-white m-5" variant="round" mini= "true" >
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
         {checkModuleRights(userProfileDetail.modules,"resultandtestimonial","add") &&	<Link to="/app/setting/resultandtestimonial#add"  className="btn-outline-default mr-10 fw-bold mt-5"><i className="ti-plus"></i> Add Result And Testimonial</Link>}
        </div>
        <div >
             <span className = "pr-5"> Total {tableInfo.totalrecord} Records </span>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-between">
              {(updateRights && addRights) && resultandtestimonial && resultandtestimonial.filter(x => x.checked == true).length > 0 &&
                    <BulkEnablePublishingStatus />
              }
              {(updateRights && addRights) && resultandtestimonial && resultandtestimonial.filter(x => x.checked == true).length > 0 &&
                    <BulkDisablePublishingStatus />
              }
        </div>
        <div>  </div>
      </div>

        <ReactTable
          columns={columns}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          showPaginationTop = {true}
          data={resultandtestimonial ||  []}
          pages={tableInfo.pages} // Display the total number of pages
          loading={resultandtestimonial ? false: true} // Display the loading overlay when we need it
          filterable
          defaultPageSize={tableInfo.pageSize}
          minRows = {1}
          className=" -highlight"
          onFetchData = {(state, instance) => { this.props.getResultAndTestimonial({state}) }}
        />

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
                    message= { <span className = 'text-capitalize'> {dataToDelete.name + ' ( ' + dataToDelete.resultof + ' )'} </span> }
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}


					</div>

	);
  }
  }
const mapStateToProps = ({ resultAndTestimonialReducer , settings}) => {
	const {resultandtestimonial , tableInfo ,selectAll} =  resultAndTestimonialReducer;
  const { userProfileDetail,clientProfileDetail } =  settings;
   return {resultandtestimonial , tableInfo ,userProfileDetail,clientProfileDetail,selectAll}
}

export default connect(mapStateToProps,{
	getResultAndTestimonial,opnAddNewResultAndTestimonialModel, opnViewResultAndTestimonialModel, deleteResultAndTestimonial,
  clsViewResultAndTestimonialModel,clsAddNewResultAndTestimonialModel,opnEditResultAndTestimonialModel,resultAndTestimonialHandlechangeSelectAll,
  resultAndTestimonialHandleSingleCheckboxChange})(ResultAndTestimonialList);
