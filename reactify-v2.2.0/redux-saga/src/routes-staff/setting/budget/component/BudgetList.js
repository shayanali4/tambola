/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getBudgets , opnAddNewBudgetModel,opnViewBudgetModel
  ,deleteBudget,clsViewBudgetModel,clsAddNewBudgetModel,opnEditBudgetModel} from 'Actions';
import {required,email,checkLength,checkMobileNo,checkPincode,checkAlpha} from 'Validations';

import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate,getFormtedDateTime ,checkError,checkModuleRights,getParams, makePlaceholderRTFilter} from 'Helpers/helpers';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import BugetExport from './BugetExport';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Search from '@material-ui/icons/Search';
import BudgetPeriod  from 'Assets/data/budgetperiod';

class BudgetList extends Component {
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
    this.props.opnAddNewBudgetModel();
	}

  initiateDelete(data)
  {
    let requestData = {};
    requestData.id = data.id;
    requestData.name = data.budgetperiod + " " + getFormtedDate(data.month,('MMM, YYYY'))  ;

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
    this.props.deleteBudget(data);

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
              this.props.opnViewBudgetModel({id : params.id});
         }
       }
       else if(hash == "#"+ "edit")
  		 {
  			 let params = getParams(search);
  			 if(params && params.id)
  			 {
  						this.props.opnEditBudgetModel({id : params.id});
  			 }
  		 }
		}

		componentWillReceiveProps(nextProps, nextState) {
			const {pathname, hash, search} = nextProps.location;

			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
			{
				this.props.clsViewBudgetModel();
				this.props.clsAddNewBudgetModel();

				this.hashRedirect({pathname, hash, search});
			}
		}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.budgets || !nextProps.budgets || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog ||
     this.state.exportBudgetDialog != nextState.exportBudgetDialog )
		{
			return true;
		}
		else {
			return false;
		}
	}

	render() {
	const	{ deleteConfirmationDialog, dataToDelete,exportBudgetDialog} = this.state;
	const	{ budgets, tableInfo ,userProfileDetail,clientProfileDetail} = this.props;
  let updateRights = checkModuleRights(userProfileDetail.modules,"budget","update");
  let deleteRights = checkModuleRights(userProfileDetail.modules,"budget","delete");
  const {pathname, hash, search} = this.props.location;
	let params = getParams(search);
  let mobile = params && params.mo ? params && params.mo: null;

   let columns = [
         {
           Header: "Budget period",
           accessor: "budgetperiod",
           Filter: ({ filter, onChange }) =>
             ( <select
                 onChange={event => onChange(event.target.value)}
                 style={{ width: "100%" }}
                 value={filter ? filter.value : ""}
               >
               <option value="" >Show All</option>
               {  BudgetPeriod.map((budgetperiod, key) => (<option value={budgetperiod.value} key = {'budgetperiodOption' + key }>{budgetperiod.name}</option>  )) }
               </select>
             ),
           Cell : data => (
               <Link to= {"/app/setting/budget?id="+data.original.id+"#view"} >
               <h5 className=" text-uppercase">{data.original.budgetperiod }</h5>
          </Link>
        ),
           minWidth:120
         },
         {
           Header: "Start Month",
           accessor: 'month',
           Filter: ({onChange }) =>
            (
              <DatePicker  keyboard = {false}
              format = {'MMM, YYYY'} placeholder = {'MMM, YYYY'}
                onChange = {date => onChange( date) }
              />
            ),
            Cell : data => (
              getFormtedDate(data.original.startDate,('MMM, YYYY'))
            ),
           className : "text-center",
           minWidth:110,
         },
         {
           Header: "start Date",
           accessor: 'startDate',
           Filter: ({onChange }) =>
            (
              <DatePicker  keyboard = {false}
                onChange = {date => onChange( date) }
              />
              ),
           Cell : data => (
             getFormtedDate(data.original.startDate)
           ),
           minWidth:80,
           className : "text-center",
         },
         {
           Header: "End Date",
           accessor: 'endDate',
           Filter: ({onChange }) =>
            (
              <DatePicker  keyboard = {false}
                onChange = {date => onChange( date) }
              />
              ),
           Cell : data => (
             getFormtedDate(data.original.endDate)
           ),
           className : "text-center",
          minWidth:100,
         },
         {
           Header: "Total Budget",
           accessor: 'totalbudget',
     			Filter : makePlaceholderRTFilter(),
           minWidth:100,
           className : "text-right"
         }
   ];

   if(updateRights || deleteRights)
  {
    columns.splice(0, 0, {
      Header: "ACTION",
      Cell : data => (<div className="list-action d-inline hover-action">
        {/*  <a href="javascript:void(0)" onClick={() => this.onView(data.original)}><i className="ti-eye"></i></a>*/}
        {updateRights &&
           <Fab component = {Link} to = {"/app/setting/budget?id="+data.original.id+"#edit"}  className="btn-success text-white m-5 pointer" variant="round" mini= "true" >
              <i className="zmdi zmdi-edit"></i>
           </Fab>
        }
        {deleteRights &&
          <Fab className="btn-danger text-white m-5 pointer" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
            <i className="zmdi zmdi-delete"></i>
          </Fab>
        }
        </div>
        ),
        filterable : false,
        sortable : false,
        minWidth:60,
        className : "text-center",
      });
    }
   	return (
			<div className="table-responsive">
      <div className="d-flex justify-content-between py-20 px-10 border-bottom">
        <div>
         {checkModuleRights(userProfileDetail.modules,"budget","add") &&	<Link to="/app/setting/budget#add"  className="btn-outline-default mr-10 fw-bold mt-5"><i className="ti-plus"></i> Add Budget</Link>}
        </div>
        <div >
             <span className = "pr-5"> Total {tableInfo.totalrecord} Records </span>
             {checkModuleRights(userProfileDetail.modules,"budget","export") &&

                     <a href="javascript:void(0)" onClick={() => this.initiateExport()} className="btn-outline-default mr-10"><i className="fa fa-cloud-download"></i> Download</a>

         }

        </div>
      </div>

        <ReactTable
          columns={columns}
          defaultFiltered = {mobile ? [{"id":"mobile","value": mobile}] : []}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          showPaginationTop = {true}
          data={budgets ||  []}
          pages={tableInfo.pages} // Display the total number of pages
          loading={budgets ? false: true} // Display the loading overlay when we need it
          filterable
          defaultPageSize={tableInfo.pageSize}
          minRows = {1}
          className=" -highlight"
          onFetchData = {(state, instance) => { this.props.getBudgets({state}) }}
        />

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
                    message= { <span className = 'text-capitalize'>  {dataToDelete.name } </span> }
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}

                   <BugetExport exportBudgetDialog = {exportBudgetDialog} onCancel = {this.cancelExportDialog.bind(this)}/>

					</div>

	);
  }
  }
const mapStateToProps = ({ budgetReducer , settings}) => {
	const {budgets , tableInfo } =  budgetReducer;
  const { userProfileDetail,clientProfileDetail } =  settings;
   return {budgets , tableInfo ,userProfileDetail,clientProfileDetail}
}

export default connect(mapStateToProps,{
	getBudgets,opnAddNewBudgetModel, opnViewBudgetModel, deleteBudget,
  clsViewBudgetModel,clsAddNewBudgetModel,opnEditBudgetModel})(BudgetList);
