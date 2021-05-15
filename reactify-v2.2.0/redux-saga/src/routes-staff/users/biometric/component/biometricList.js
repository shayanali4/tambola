/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import { getBiomaxUsers,opnViewBioMaxmodel,clsViewBioMaxModel,userbiomaxhandleChangeSelectAll,userbiomaxhandleSingleCheckboxChange} from 'Actions';

import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate,checkModuleRights,getParams,getFormtedDateTime, makePlaceholderRTFilter,getStatusColor} from 'Helpers/helpers';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Fab from '@material-ui/core/Fab';
import { Link } from 'react-router-dom';
import api from 'Api';
import { NotificationManager } from 'react-notifications';
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

 componentWillMount()
		 {
			 this.hashRedirect(location);
		 }

	hashRedirect({pathname, hash, search,newusers})
		{
      let {users} = this.props;
			users = users || newusers;
		 if(hash == "#"+ "view")
		 {
			 let params = getParams(search);
			 if(params && params.id && users && users.length > 0)
			 {
         let data = users.filter(x => x.id == params.id)[0];
						this.props.opnViewBioMaxmodel({data});
			 }
		 }

		}

		componentWillReceiveProps(nextProps, nextState) {
			const {pathname, hash, search} = nextProps.location;
			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search ||
			(this.props.users != nextProps.users))
			{
				this.props.clsViewBioMaxModel();
				this.hashRedirect({pathname, hash, search,newusers : nextProps.users});
			}

		}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.users || !nextProps.users || (this.props.users != nextProps.users) )
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


	userbiomaxhandleChangeSelectAll = (value) => {
	 this.props.userbiomaxhandleChangeSelectAll(value);
	};

 userbiomaxhandleSingleCheckboxChange(value,data,id){
	 this.props.userbiomaxhandleSingleCheckboxChange(value,data,id);
	 };

	render() {
	const	{  month,year} = this.state;
	 const	{ users, tableInfo ,userProfileDetail,activeTab,userselectAll,biometricdevicelist} = this.props;

   let deleteRights = checkModuleRights(userProfileDetail.modules,"userbiometric","delete");
	 let addRights = checkModuleRights(userProfileDetail.modules,"userbiometric","add");
	 let exportRights = checkModuleRights(userProfileDetail.modules,"userbiometric","export");

   var Year = [];

   for(let i = 2018; i <= getLocalDate(new Date()).getFullYear() ; i++ )
   {
       Year.push(i);
   }
   Year = $.unique(Year);
	 let StaffBiometricCode = [
	 	{
	 			name: '-',
	 			value: '0'
	 	},
	 	{
	 		 name: 'Added',
	 		 value: '1'
	  },
	  {
	 		 name: 'Deleted',
	 		 value: '2'
	  },
	 ];
	 let isfpbiotype = [
	 {
	 		name: '-',
	 		value: '0'
	 },
	 {
	 	 name: 'Added',
	 	 value: '1'
	 }
	 ]
   let columns = [
         {
           Header: "EMPLOYEE",
           accessor: "firstname",
           minWidth : 140,
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
               <div className="media-body">
                 <h5 className={" text-capitalize " }>{data.original.firstname + " " + data.original.lastname}</h5>
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
           Header: "UserId in Biometric Device",
			     accessor: 'userid',
           className : "text-center",
					 minWidth:150,
					 Filter : makePlaceholderRTFilter(),
         },
         {
           Header : "User in Biometric Device",
					 accessor : "isuserinbiometricdevice",
					 Filter: ({ filter, onChange }) =>
						( <select
								onChange={event => onChange(event.target.value)}
								style={{ width: "100%" }}
								value={filter ? filter.value : ""}
							>
							<option value="" >Show All</option>
							{  isfpbiotype && StaffBiometricCode.map((StaffBiometricCode, key) => (<option value={StaffBiometricCode.value} key = {'StaffBiometricCodeOption' + key }>{StaffBiometricCode.name}</option>  )) }

							</select>
						),
						Cell : data => (
								 <h5>{ data.original.isuserinbiometricdevice }</h5>
						),
            className : "text-center",
						minWidth:150,
         },
         {
           Header : "FingerPrint",
           accessor : "isfpbiotype",
					 Filter: ({ filter, onChange }) =>
					 ( <select
							 onChange={event => onChange(event.target.value)}
							 style={{ width: "100%" }}
							 value={filter ? filter.value : ""}
						 >
						 <option value="" >Show All</option>
						 {  isfpbiotype && isfpbiotype.map((isfpbiotype, key) => (<option value={isfpbiotype.value} key = {'isfpbiotypeOption' + key }>{isfpbiotype.name}</option>  )) }

						 </select>
					 ),
           Cell : data => (
                <h5>{ data.original.isfpbiotype > 0 ? "Added" : "-" }</h5>
        ),
	        className : "text-center",
					minWidth:150,
         },
         {
           Header : "Face",
           accessor : "isFacebiotype",
					 Filter: ({ filter, onChange }) =>
				 ( <select
						 onChange={event => onChange(event.target.value)}
						 style={{ width: "100%" }}
						 value={filter ? filter.value : ""}
					 >
					 <option value="" >Show All</option>
					 {  isfpbiotype && isfpbiotype.map((isFacebiotype, key) => (<option value={isFacebiotype.value} key = {'isFacebiotypeOption' + key }>{isFacebiotype.name}</option>  )) }

					 </select>
				 ),
           Cell : data => (
                <h5>{data.original.isFacebiotype > 0 ? "Added" : "-" }</h5>
            ),
            className : "text-center",
						minWidth:150,
         },
				 {
					Header: "Last Check-in",
					accessor: 'lastcheckin',
					Filter: ({onChange }) =>
						(
							<DatePicker  keyboard = {false}
								onChange = {date => onChange( date) }
							/>
							),
					Cell : data => (
						<h5 >{getFormtedDateTime(data.original.lastcheckin) + this.getdatediff(data.original.lastcheckin)}</h5>
					),
					className : "text-center",
					 minWidth:250,
				}
   ];
   if( deleteRights || addRights)
  {
		columns.splice(0, 0, {
      Header: "ACTION",
      Cell : data => (<div className="list-action d-inline hover-action">
        {/*  <a href="javascript:void(0)" onClick={() => this.onView(data.original)}><i className="ti-eye"></i></a>*/}
              <Fab component = {Link} to = {"/app/users/biometric/0?id="+data.original.id+"#view"}  className="btn-success text-white m-5 pointer" variant="round" mini= "true" >
                <i className="material-icons">fingerprint</i>
              </Fab>
          {
         //  {  deleteRights &&
         //    <Fab className="btn-danger text-white m-5 pointer" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
         //      <i className="zmdi zmdi-delete"></i>
         //    </Fab>
         // }
       }

        </div>
      ),
      filterable : false,
      sortable : false,
       minWidth:70,
      className : "text-center",
    });
		if(exportRights){
		columns.splice(0, 0, {
							Header: (
								<Checkbox
									color="primary"
									onChange={(e) => this.userbiomaxhandleChangeSelectAll(e.target.checked)}
									checked={userselectAll}
									className ="p-0"
								/>
							),
							Cell: data => (
								<Checkbox
								 color="primary"
									defaultChecked={data.original.checked}
									checked={data.original.checked || false}
									onChange={(e) => this.userbiomaxhandleSingleCheckboxChange(e.target.checked,data.original,data.original.id)}
								/>
							),
							sortable: false,
							filterable: false,
							className : "text-center",
						});
					}
  }

   	return (
			<div >

					<div className="d-flex justify-content-between  py-10 px-10">
							<div className="d-flex justify-content-between p-10">
							{(exportRights && addRights) && users && users.filter(x => x.checked == true).length > 0 &&
										<BiometricBulkStaffAdd data = { users.filter(x => x.checked == true)} biometricdevicelist = {biometricdevicelist}/>
							}
							{(exportRights && deleteRights) && users && users.filter(x => x.checked == true).length > 0 &&
										<BiometricBulkStaffdelete data = { users.filter(x => x.checked == true)} biometricdevicelist = {biometricdevicelist}/>
							}
							</div>
   					<div >
								  <span className = "pr-10"> Total {tableInfo.totalrecord} Records </span>
								<a href="javascript:void(0)" onClick={() =>  this.props.getBiomaxUsers() } className="btn-outline-default ml-10"><i className="ti-reload"></i> Refresh</a>
						 </div>
				</div>
				{ !users   && <RctSectionLoader /> }

        <ReactTable
          columns={columns}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          showPaginationTop = {true}
          data={users || []}
          pages={tableInfo.pages} // Display the total number of pages
          loading={users ? false: true} // Display the loading overlay when we need it
          filterable
          defaultPageSize={tableInfo.pageSize}
          minRows = {1}
          className=" -highlight"
          onFetchData = {(state, instance) => {this.props.getBiomaxUsers({state}) }}
        />
		</div>

	);
  }
  }
const mapStateToProps = ({ biomaxReducer , settings}) => {
	const {users , tableInfo ,biometricdevicelist,userselectAll} =  biomaxReducer;
  const { userProfileDetail } =  settings;
   return {users , tableInfo ,userProfileDetail,biometricdevicelist,userselectAll}
}

export default connect(mapStateToProps,{
	getBiomaxUsers,opnViewBioMaxmodel,clsViewBioMaxModel,userbiomaxhandleChangeSelectAll,userbiomaxhandleSingleCheckboxChange,push})(BiometricList);
