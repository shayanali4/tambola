/**
 * Employee Management Page
 */
import React, { Component } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { saveEmployeeattendance , getEmployeeAttendanceList ,deleteEmployeeAttendance ,deleteEmployeeLastAttendance} from 'Actions';
import CustomConfig from 'Constants/custom-config';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Gender from 'Assets/data/gender';
import QrScanner from 'react-qr-reader';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {convertSecToHour} from 'Helpers/unitconversion';
import AttendanceType from 'Assets/data/attendancetype';
import Fab from '@material-ui/core/Fab';
import {getLocalDate, getFormtedDate, checkError ,getFormtedDateTime,checkModuleRights, makePlaceholderRTFilter, cloneDeep} from 'Helpers/helpers';
import {isMobile,isIOS,isSafari} from 'react-device-detect';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import AutoSuggest from 'Routes/advance-ui-components/autoComplete/component/AutoSuggest';
import api from 'Api';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import EditAttendance from './EditAttendance';
import Combobox from 'Routes/advance-ui-components/autoComplete/component/Combobox';
import CameraFront from '@material-ui/icons/CameraFront';
import CameraRear from '@material-ui/icons/CameraRear';
import { getDistance } from 'geolib';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


let currentlocation = {
  setcurrentlatitude : '',
  setcurrentlongitude : '',
  distancediff : '',
  isattendanceallowed : 0,
  loading : false
};

class AttendanceDetail extends Component {
  constructor(props){
      super(props)
      this.state = {
        attendancetype:'1',
        manual :'',
        usercode :'',
        dataToDelete : null,
				deleteConfirmationDialog : false,
        employeeList : [],
        dataToEdit : null,
        editDialog : false,
        startDate : getLocalDate(new Date()),
        endDate : getLocalDate(new Date()),
        attendenceDate : getLocalDate(new Date()),
        safaribrowserConfirmationDialog : false,
        facingMode : 'environment',
        openGeolocationDialog : false,
      }
    }

    componentWillReceiveProps(newProps)
    {
      if(newProps.attendencesaved)
      {
        this.setState({ usercode : {} });
      }
    }

    componentDidMount()
    {
      if(isIOS && !isSafari)
      {
        this.setState({safaribrowserConfirmationDialog : true})
      }
      else {
        let {clientProfileDetail} = this.props;

        if(clientProfileDetail && clientProfileDetail.geofencing && clientProfileDetail.geofencing.isgeofencingenable == 1)
        {
          currentlocation.loading = true;
          navigator.geolocation.getCurrentPosition(
            function(position) {
              currentlocation.setcurrentlatitude = position.coords.latitude;
              currentlocation.setcurrentlongitude = position.coords.longitude;

              currentlocation.distancediff = getDistance({latitude: parseFloat(currentlocation.setcurrentlatitude),
                                 longitude: parseFloat(currentlocation.setcurrentlongitude)}, {
                                 latitude: parseFloat(clientProfileDetail.latitude),
                                 longitude: parseFloat(clientProfileDetail.longitude),
                               });
              currentlocation.isattendanceallowed = clientProfileDetail.geofencing.geofencingarea >= currentlocation.distancediff ? 1 : 0;
              currentlocation.loading = false;
            },
            () => {
                currentlocation.loading = false;
                alert('Position could not be determined.');
            }
           );
        }
        else {
              currentlocation.isattendanceallowed = 1;
        }
      }
    }


    componentWillMount()
    {
      this.getEmployees();
    }

    onChangeAttendanceDetail(key, value) {
      if (key == "manual") {
       value = value?1:0;
     }
      else if(key == 'startDate'){
          this.props.getEmployeeAttendanceList({startDate : value,endDate : value });
        }
        else if(key == 'attendenceDate' && !value){
              value = getLocalDate(new Date());
              this.state.startDate = getLocalDate(new Date());
            }
        else if(key == 'attendenceDate' && value){
              this.state.startDate = value;
              this.props.getEmployeeAttendanceList({startDate : value,endDate : value });
            }

      this.setState({
        [key]: value
      });
    }

  handleScan(data){
        if(data){
          let {attendancetype,attendenceDate} = this.state;
          const {lastattendence, loading} = this.props;
          let currentdatetime = getLocalDate(new Date());
          attendenceDate = new Date(new Date(attendenceDate).setHours(currentdatetime.getHours(), currentdatetime.getMinutes()));

          if((!lastattendence || lastattendence.usercode != data) && !loading)
          {
            this.props.saveEmployeeattendance({usercode : data, attendancetype : attendancetype,attendenceDate : attendenceDate,distance : currentlocation.distancediff});
          }
      }
    }
    handleSave(){
      let {usercode,attendenceDate,attendancetype} = this.state;
      let distance = currentlocation.distancediff;

      let currentdatetime = getLocalDate(new Date());
      attendenceDate = new Date(new Date(attendenceDate).setHours(currentdatetime.getHours(), currentdatetime.getMinutes()));

      this.props.saveEmployeeattendance({usercode,attendancetype,attendenceDate,distance});
    }
    handleError(err){
      console.error(err)
    }
    initiateDelete(data)
    {
      let requestData = {};
      requestData.id = data.id;
      requestData.name = data.name ;

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
      this.props.deleteEmployeeAttendance(data);
    }
    cancelDelete()
    {
      this.setState({
  			deleteConfirmationDialog : false,
        dataToDelete : null
  		});
    }

    onDeleteLastAttendence()
    {
      this.props.deleteEmployeeLastAttendance();
      this.setState({ usercode : '' });
    }

    getEmployees = (value) =>
         {
           let branchid = this.props.userProfileDetail.defaultbranchid;
                 api.post('employee-list', {value,branchid})
                 .then(response => {
                   this.setState({employeeList : response.data[0]})

                 }).catch(error => console.log(error) )
         }
         onEdit(data){
           this.setState({
             dataToEdit : data,
             editDialog : true
           })
         }
         onCancelEdit(){
           this.setState({
             dataToEdit : null,
             editDialog : false
           })
         }

	render() {
    const {attendancetype ,deleteConfirmationDialog, dataToDelete ,manual,
    usercode,employeeList,dataToEdit,editDialog,startDate,endDate,attendenceDate,safaribrowserConfirmationDialog,
    facingMode,openGeolocationDialog} = this.state;
    const {lastattendence, attendencelist , tableInfo , userProfileDetail, loading,clientProfileDetail } = this.props;
    let deleteRights = checkModuleRights(userProfileDetail.modules,"staffattendance","delete");
    let updateRights = checkModuleRights(userProfileDetail.modules,"staffattendance","update");
    let addRights = checkModuleRights(userProfileDetail.modules,"staffattendance","add");

    let columns=[
      {
        Header: "EMPLOYEE NAME",
        accessor: "name",
        Cell : data =>
        (
          <div >
            <h5 className=" text-capitalize ">{data.original.name}</h5>
          </div>
        ),
          Filter : makePlaceholderRTFilter(),
          minWidth:120,
      },
      {
        Header : "Check-in time",
        accessor : "intime",
        Filter: ({onChange }) =>
          (
            <DatePicker  keyboard = {false}
              onChange = {date => onChange( date) }
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
        Header : "In Time",
        accessor : "difference",
        Cell : data =>
           {
             let hours =convertSecToHour(data.original.difference * 60);
            return (
             <div>
             {hours &&
                 <h5 >{hours.hh} : {hours.mm} : {hours.ss}</h5>
              }
             </div>
           )},
         className : "text-center",
         filterable : false,
         sortable : false,
         minWidth:100,
      },
    ];
    if(updateRights || deleteRights)
   {
     columns.splice(0, 0, {
         Header:<RemoveCircleIcon/>,
         Cell : data => (
           <div className="list-action d-inline hover-action">
           { updateRights &&  <Fab onClick={() =>{this.onEdit(data.original)}}  className="btn-success text-white m-5" variant="round" mini= "true" >
             <i className="ti-pencil"></i>
           </Fab>}
           {  deleteRights && <Fab className="btn-danger text-white m-5" variant="round" mini= "true" onClick={() =>{this.initiateDelete(data.original)}}>
           <i className="zmdi zmdi-delete"></i>
         </Fab>}
           </div>
         ),
         filterable : false,
         sortable : false,
          width:100
       });
   }
    if(!isMobile)
    {
      columns.splice(2, 0, {
          Header: "EMPLOYEE CODE",
          accessor: 'employeecode',
          Cell : data => (
            <h5 >{data.original.employeecode}</h5>
          ),
          className : "text-center",
          minWidth:150,
          Filter : makePlaceholderRTFilter(),
        });
    }

    if(clientProfileDetail && clientProfileDetail.geofencing && clientProfileDetail.geofencing.isgeofencingenable == 1)
    {
      columns.splice(6, 0, {
          Header: "DISTANCE",
          accessor: 'distance',
          Cell : data => (
            <h5 >{data.original.distance}</h5>
          ),
          className : "text-center",
          minWidth:90,
          filterable : false,
          sortable : false,
        });
    }

    let employeeNewList = employeeList ? cloneDeep(employeeList) : [];
    employeeNewList.map(x => { x.value = x.id;  x.label = x.label + " - " + x.employeecode; return x; });

		return (
	<div className="row">
    <div className="col-sm-12 col-md-6 col-xl-4 justify-content-between d-inline">

    {  currentlocation.loading &&  <RctSectionLoader /> }
    {clientProfileDetail && clientProfileDetail.geofencing && clientProfileDetail.geofencing.isgeofencingenable == 1 &&
      <div className = "row">

        {currentlocation.isattendanceallowed == 0 && !currentlocation.loading &&
           <span>{'Note : You are not allowed to take attendance because your current location is not in geofencing area.'}{<i className="fa fa-info-circle ml-10 size-20 pointer" onClick={() => this.setState({openGeolocationDialog : true})}></i>}</span>
         }


      </div>
    }

    <div className = "row" >
        <div className="col-3 pl-10 pr-40">
          {addRights && currentlocation.isattendanceallowed == 1 &&
            <FormControlLabel control={
              <Checkbox   color="primary" checked={manual==0?false:true} onChange={(e) =>this.onChangeAttendanceDetail('manual', e.target.checked ,true)}  />
            } label= "Manual"
            />
          }
         </div>
         {
         // <div className="col-9 pr-0">
         //       <RadioGroup row aria-label="attendancetype" className ={'pl-10'} name="attendancetype" value={attendancetype} onChange={(e) => this.onChangeAttendanceDetail('attendancetype', e.target.value)}>
         //      {
         //        AttendanceType.map((attendancetype, key) => ( <FormControlLabel value={attendancetype.value} key= {'attendancetypeOption' + key} control={<Radio />} label={attendancetype.name} />))
         //      }
         //      </RadioGroup>
         //
         //  </div>
       }
      </div>
      {manual == true  &&
      <div className = "row">
            <div className ="col-6 pb-10 ml-5">
                <DatePicker
                label="Attendance Date" minDate ={new Date(getLocalDate(new Date()).setDate(getLocalDate(new Date()).getDate() - 60))} disableFuture = {true} value ={attendenceDate || getLocalDate(new Date())} onChange = {(date) => this.onChangeAttendanceDetail('attendenceDate', date)}
                />
             </div>

             <div className = "col-12 col-sm-12 col-md-9 col-xl-9 ">
                     <div className="clearfix">

                             <FormControl fullWidth>
                                     <Combobox
                                   										onChange={(value) => this.onChangeAttendanceDetail('usercode',value)}
                                   										value={usercode} label = {"Select Employee"} options = {employeeNewList && employeeNewList.map(x => {
                                   											x.value = x.employeecode;
                                   											x.label = x.label; return x; })}/>


                               </FormControl>
                     </div>
               </div>
             <div className="col-3">
                     <div className={"clearfix " + (isMobile ? "p-10" : "pt-5")}>
                          <Button color="primary" variant="contained" onClick={() => this.handleSave()}  className="mr-10 text-white">Save</Button>
                       </div>
               </div>
     </div>
   }
        <div className = "row" >
                 <div className="col-12 py-10">
                 {
                 lastattendence &&
                 <div className ="row ">
                    <div className = "col-2">
                      <img src={CustomConfig.serverUrl + lastattendence.image} alt = ""
                      onError={(e)=>{
                           let gender = Gender.filter(value => value.name == lastattendence.gender).map(x => x.value);
                                          gender = gender.length > 0 ? gender[0] : '1';
                          e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}
                          className="rounded-circle mr-15" width="50" height="50"/>
                    </div>
                    <div className = "col-7">
                    <span className="fw-bold text-capitalize">{ lastattendence.firstname +  " " + lastattendence.lastname}</span>
                    <p><span className="badge badge-warning">{lastattendence.usercode}</span></p>
                    </div>
                      <IconButton color="inherit" onClick={() =>this.onDeleteLastAttendence()}  aria-label="Close">
                           <CloseIcon/>
                      </IconButton>
                  </div>
                }
                 </div>
              {manual == false && currentlocation.isattendanceallowed == 1 &&
                               <div className="col-12 pb-10 ">
                                    {      loading &&  <RctSectionLoader /> }

                                    { facingMode == "user"  ?
                                     <CameraRear className = {" pointer pb-5"} onClick = {() => this.setState({ facingMode : "environment" })} />
                                      :
                                     <CameraFront className = {" pointer pb-5"} onClick = {() => this.setState({ facingMode: "user" })} />
                                    }
                                     <QrScanner  style={{ height: 'auto', width: '90%', }}
                                      onError={this.handleError}  showViewFinder = {true}  delay = {300}
                                      onScan={(data) => this.handleScan(data)}
                                      facingMode = {facingMode}/>
                               </div>
              }
          </div>
          </div>
          <div className="col-sm-12 col-md-6 col-xl-8 d-inline">
          <div className = "ml-20 mb-20 d-flex justify-content-between">

                <DatePicker
                label="Filter By Check-in Date" value ={startDate} onChange={(date) => this.onChangeAttendanceDetail('startDate', date,  false)}
                />

                <span className = "pt-10"> Total {tableInfo.totalrecord} Records </span>
        </div>
          <ReactTable
            columns={columns}
            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
            showPaginationTop = {false}
            data={attendencelist || []}
            pages={tableInfo.pages} // Display the total number of pages
            loading={attendencelist ? false : true} // Display the loading overlay when we need it
            filterable
            defaultPageSize={tableInfo.pageSize}
            minRows = {5}
            className=" -highlight"
            onFetchData = {(state, instance) => {state.startDate = startDate;state.endDate = endDate; this.props.getEmployeeAttendanceList({state}) }}
          />
          {
            deleteConfirmationDialog &&
            <DeleteConfirmationDialog
              openProps = {deleteConfirmationDialog}
              title="Are You Sure Want To Delete?"
              message="This will delete user permanently."
              message= { <span className = 'text-capitalize'>  {dataToDelete.name} </span> }
              onConfirm={() => this.onDelete(dataToDelete)}
               onCancel={() => this.cancelDelete()}
            />
          }

          {
            safaribrowserConfirmationDialog &&
            <DeleteConfirmationDialog
              openProps = {safaribrowserConfirmationDialog}
              title=""
              message={"In non-safari browser, camera access is not allowed so switch to safari browser to get camera access"}
              onConfirm={() => this.setState({safaribrowserConfirmationDialog : false})}
               showcancel = {false}
               confirmlabel = {"Ok"}
            />
          }

          {openGeolocationDialog &&
              <Dialog fullWidth = {true} maxWidth = 'sm'
                 open={openGeolocationDialog}
                 aria-labelledby="alert-dialog-title"
                 aria-describedby="alert-dialog-description"
              >
                 <DialogTitle id="alert-dialog-title">
                   <span className="fw-bold text-capitalize"> {"Your Location"}</span>
                           <CloseIcon onClick={() => this.setState({openGeolocationDialog : false})} className = {"pull-right pointer"}/>
                 </DialogTitle>
                 <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <div >
                        <p>{'Current Latitude : ' + currentlocation.setcurrentlatitude} </p>
                        <p>{'Current Longitude : ' + currentlocation.setcurrentlongitude} </p>
                        <p>{'Branch Latitude : ' + parseFloat(clientProfileDetail.latitude)} </p>
                        <p>{'Branch Longitude : ' + parseFloat(clientProfileDetail.longitude)} </p>
                        <p>{'Distance : ' + currentlocation.distancediff + ' meters'} </p>
                        <p>{'Geofencing Area : ' + clientProfileDetail.geofencing.geofencingarea + ' meters'} </p>
                      </div>

                    </DialogContentText>
                 </DialogContent>
              </Dialog>
          }

          { editDialog &&
            <EditAttendance open ={editDialog} data ={dataToEdit} onClose ={this.onCancelEdit.bind(this)}/>
          }
          </div>
    </div>
	);
  }
  }
  const mapStateToProps = ({ employeeattendanceReducer , settings}) => {
  const {attendancetype, lastattendence,  attendencelist ,tableInfo, loading,attendencesaved } = employeeattendanceReducer;
  const {userProfileDetail,clientProfileDetail} = settings;
  return {attendancetype, lastattendence, attendencelist ,tableInfo, userProfileDetail, loading,attendencesaved,clientProfileDetail};
  }
  export default connect(mapStateToProps,{saveEmployeeattendance , getEmployeeAttendanceList,deleteEmployeeAttendance,
  deleteEmployeeLastAttendance})(AttendanceDetail);
