/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import { getBiomaxUsersLogs} from 'Actions';
import {required,email,checkLength,checkMobileNo,checkPincode,checkAlpha} from 'Validations';

import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate, checkError,checkModuleRights,getParams,getFormtedDateTime, makePlaceholderRTFilter,getStatusColor ,cloneDeep} from 'Helpers/helpers';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import { Link } from 'react-router-dom';
import api from 'Api';
import { NotificationManager } from 'react-notifications';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { push } from 'connected-react-router';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Month from 'Assets/data/month';
import $ from 'jquery';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Checkbox from '@material-ui/core/Checkbox';
import BiometricBulkStaffAdd from './biometricbulkstaffadd';
import BiometricBulkStaffdelete from './biometricbulkstaffdelete';
import Status  from 'Assets/data/status';

class BiometricList extends Component {
	constructor(props) {
     super(props);
		 	this.state = {
        month: (getLocalDate(new Date()).getMonth() + 1).toString(),
        year : getLocalDate(new Date()).getFullYear()
		  };
   }


	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.users || !nextProps.users )
		{
			return true;
		}
		else {
			return false;
		}
	}


  onChangeActiveStateMonth({month ,year})
  {
    let {tableInfoLogs} = this.props;
    month = month == undefined ? this.state.month: month;
    year = year == undefined ? this.state.year: year;

    this.setState({ month,year });
    let state = tableInfoLogs;
      state.month = parseInt(month);
      state.year = year;

     this.props.getBiomaxUsersLogs({state});

  }


	render() {
	const	{  month,year} = this.state;
	 const	{ userslogs,tableInfoLogs} = this.props;


   var Year = [];

   for(let i = 2018; i <= getLocalDate(new Date()).getFullYear() ; i++ )
   {
       Year.push(i);
   }
   Year = $.unique(Year);

     let columns1 = [
           {
             Header: "EMPLOYEE",
             accessor: "firstname",
             minWidth : 150,
						 Filter : makePlaceholderRTFilter(),
             Cell : data =>
             (
               <Link to= {"/app/users/user-profileview?id="+data.original.id} >
               <div className="media">
                   <img src={data.original.image ? CustomConfig.serverUrl + data.original.image : CustomConfig.serverUrl + data.original.memberprofileimage} alt = ""
                   onError={(e)=>{
                        let gender = data.original.genderId || '1';
                       e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}
                       className="rounded-circle" width="50" height="50"/>
                 <div className="media-body pt-10">
                   <h5 className=" text-capitalize ">{data.original.firstname + " " + data.original.lastname}</h5>

                 </div>
               </div>
               </Link>
             )
           },
					 {
						Header : "Status",
						accessor : "status",
						 className : "text-center",
						minWidth:100,
						Filter: ({ filter, onChange }) =>
						( <select
							onChange={event => onChange(event.target.value)}
							style={{ width: "100%" }}
							value={filter ? filter.value : ""}
						 >
						 <option value="" >Show All</option>
						 {  Status.map((status, key) => (<option value={status.value} key = {'statusOption' + key }>{status.name}</option>  )) }

						 </select>
						),
						Cell : data => (
								 <h5>
									 <span className= "ml-5 px-10 py-5 fs-12 badge " style={{"backgroundColor": getStatusColor(data.original.statusId)}}>
										 {data.original.status}
									 </span>
								 </h5>
				 ),
					},
           {
             Header : "User id",
             accessor : "employeecode",
              className : "text-center",
							minWidth:150,
							Filter : makePlaceholderRTFilter(),
           },
           {
						 Header : "Check-in time",
						 accessor : "intime",
						 Filter: ({onChange,filter }) =>
							 (
								 <DatePicker  keyboard = {false}
									 onChange = {date => onChange( date) }
									 value = {filter ? filter.value : getLocalDate(new Date())}
								 />
								 ),
						 Cell : data =>
								(
									<h5 >{getFormtedDateTime(data.original.intime)}</h5>
								),
							className : "text-center",
							minWidth:150,
					 },
					 {
						 Header : "Check-out time",
						 accessor : "outtime",
							 Filter: ({onChange }) =>
								 (
									 <DatePicker  keyboard = {false}
										 onChange = {date => onChange( date) }
									 />
									 ),
							 Cell : data =>
									(
										<h5 >{getFormtedDateTime(data.original.outtime)}</h5>
									),
								className : "text-center",
								minWidth:150,
					 },
					 {
						 Header : "In Time(Min.)",
						 sortable : false,

						 accessor : "difference",
							className : "text-center",
							filterable : false,
							minWidth:160,
					 },

     ];
   	return (
			<div >

					<div className="d-flex justify-content-between  py-10 px-10">
							<div className="d-flex justify-content-between">

							</div>
   				    <div >

									<span className= "pr-10"> Total {tableInfoLogs.totalrecord} Records </span>

									<Select value={month} className = {'dropdown-chart'} onChange={(e) => this.onChangeActiveStateMonth({month : e.target.value})}
									inputProps={{name: 'month', id: 'month', }}>
									{
										Month.map((month, key) => ( <MenuItem value={month.value} key= {'monthOption' + key}>{month.short}</MenuItem> ))
									 }
									 </Select>


									 <Select value={year} className = {'dropdown-chart'} onChange={(e) => this.onChangeActiveStateMonth({year : e.target.value})}
										 inputProps={{name: 'year', id: 'year', }}>
										 {
										 Year.map((year, key) => ( <MenuItem value={year} key= {'yearOption' + key}>{year}</MenuItem> ))
										 }
										 </Select>

								<a href="javascript:void(0)" onClick={() =>  this.onChangeActiveStateMonth({})} className="btn-outline-default ml-10"><i className="ti-reload"></i> Refresh</a>
						 </div>
				</div>
				{ !userslogs   && <RctSectionLoader /> }


      <ReactTable
        columns={columns1}
        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
        showPaginationTop = {true}
        data={userslogs || []}
        pages={tableInfoLogs.pages} // Display the total number of pages
        loading={userslogs ? false: true} // Display the loading overlay when we need it
        filterable
        defaultPageSize={tableInfoLogs.pageSize}
        minRows = {1}
        className=" -highlight"
        onFetchData = {(state, instance) => {let tableState = cloneDeep(state);  tableState.month = parseInt(month);   tableState.year = year;  this.props.getBiomaxUsersLogs({state : tableState}) }}
      />

					</div>

	);
  }
  }
const mapStateToProps = ({ biomaxReducer }) => {
	const { userslogs,tableInfoLogs} =  biomaxReducer;
   return { userslogs,tableInfoLogs}
}

export default connect(mapStateToProps,{
	getBiomaxUsersLogs,push})(BiometricList);
