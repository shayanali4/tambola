/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsViewBioMaxModel,getBiomaxUsers } from 'Actions';
import Status from 'Assets/data/status';
import Bloodgroup  from 'Assets/data/bloodgroup';
import Title  from 'Assets/data/title';
import Gender  from 'Assets/data/gender';
import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate, checkError,checkModuleRights} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import classnames from 'classnames';
import DialogTitle from '@material-ui/core/DialogTitle';
import { push } from 'connected-react-router';
import QRCode from 'qrcode'
import api from 'Api';
import {cloneDeep } from 'Helpers/helpers';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { NotificationManager } from 'react-notifications';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

class Viewbiometric extends Component {
  constructor(props) {
     super(props);
     this.state = this.getInitialState();
  }
  getInitialState()
  {
    this.initialState = {
                    tableInfo : {
                      pageSize : 10,
                      pageIndex : 0,
                      pages : 1
                    },
                    loading : false
                  }
                  return cloneDeep(this.initialState);
    }
onClose()
		{
			this.props.clsViewBioMaxModel();
			this.props.push('/app/users/biometric/0');
		}
onAdd(selectedBiomaxdata){
  let {biometricdevicelist, tableInfo}= this.props;
  let data = {};
  data.name = selectedBiomaxdata.firstname +  " " + selectedBiomaxdata.lastname;
  data.userid = selectedBiomaxdata.userid;
  data.SerialNumber = biometricdevicelist.map(x => x.serialnumber);
  data.maxexpirydate = getFormtedDate(selectedBiomaxdata.maxexpirydate,"DD-MMM-YYYY");
  api.post('UploadUsersInBiometric',{data})
    .then(response =>
     {
       let data = response.data.Message;
      let index =  data && data.indexOf("Successfully");
       if(index > 0 ) {
         NotificationManager.success("User added in device successfully");
         this.setState({loading : false})
      }
      else{
        NotificationManager.error("Request failed");
        this.setState({loading : false})
      }
      let state = tableInfo;
      this.props.getBiomaxUsers({state});
       this.onClose();
     }
   ).catch(error => console.log(error) )
  }
  initiateDelete(data)
  {
    let {biometricdevicelist} = this.props;
    let requestData = {};
    requestData.userid = data.userid;
    requestData.SerialNumber = biometricdevicelist.map(x => x.serialnumber);
   requestData.name = data.firstname + " " + data.lastname  ;
    this.setState({
      deleteConfirmationDialog : true,
      dataToDelete : requestData
    });
  }
  onDelete(data)
  {
    let {biometricdevicelist,tableInfo}= this.props;
    this.setState({
       deleteConfirmationDialog : false,
       dataToDelete : null
     });

    api.post('DeleteUserinBiometric',{data})
      .then(response =>
       {
         let data = response.data.Message;
        let index =  data && data.indexOf("Successfully");
         if(index > 0 ) {
           NotificationManager.success("User deleted from device successfully");
           this.setState({loading : false})
        }
        else{
          NotificationManager.error("Request failed");
          this.setState({loading : false})
        }
        let state = tableInfo;
        this.props.getBiomaxUsers({state});
         this.onClose();
       }
     ).catch(error => console.log(error) )
  }
  cancelDelete()
  {
    this.setState({
      deleteConfirmationDialog : false,
      dataToDelete : null
    });
  }
  onChange (key,value){
    this.setState({
      [key] : value
    })
  }
	render() {

	 const	{ viewBiomaxDialog, selectedBiomaxdata,biometricdevicelist,userProfileDetail } = this.props;
   const {loading,deleteConfirmationDialog,dataToDelete} = this.state;

   let addRights = checkModuleRights(userProfileDetail.modules,"userbiometric","add");
   let deleteRights = checkModuleRights(userProfileDetail.modules,"userbiometric","delete");


		return (
      <Dialog fullWidth
           onClose={() => this.onClose()}
          open={viewBiomaxDialog}
        >
				<DialogTitle >
					{
					selectedBiomaxdata &&	<img src={CustomConfig.serverUrl + selectedBiomaxdata.image} alt = ""
						onError={(e)=>{
								 let gender = Gender.filter(value => value.name == selectedBiomaxdata.gender).map(x => x.value);
																gender = gender.length > 0 ? gender[0] : '1';
								e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}
								className="rounded-circle mr-15" width="50" height="50"/>

					}
					<span className="fw-bold text-capitalize">{selectedBiomaxdata && selectedBiomaxdata.firstname +  " " + selectedBiomaxdata.lastname}</span>


				</DialogTitle>

          <DialogContent>
            {(selectedBiomaxdata == null  || loading)  ? <RctSectionLoader /> :

              <div>
                <div className="clearfix d-flex">
                <div className="media-body">
                    <div className = "row">
                       <div className = "col-6 col-sm-3 col-md-3">
                            <p>Username: </p>
                        </div>
                        <div className = "col-6 col-sm-3 col-md-3">
                               <p><span className="badge badge-warning w-100">{ selectedBiomaxdata.emailid }</span></p>
                        </div>
                      <div className = "col-6 col-sm-3 col-md-3">
                         <p>Mobile no: </p>
                      </div>
                      <div className = "col-6 col-sm-3 col-md-3">
                            <p><span className="badge badge-warning w-100">{selectedBiomaxdata.mobile }</span></p>
                      </div>
                      </div>
                    	<div className = "row">
                      <div className = "col-6 col-sm-3 col-md-3">
                           <p>Biometric User id: </p>
                       </div>
                       <div className = "col-6 col-sm-3 col-md-3">
                              <p><span className="badge badge-warning w-100">{selectedBiomaxdata.userid }</span></p>
                       </div>
                        </div>
                        <div className="pt-20 text-center">
                            {(biometricdevicelist == null || biometricdevicelist.length == 0) &&
                              <h5 className = "text-primary">Please configure biometric device in settings</h5>
                            }
                            {(selectedBiomaxdata && selectedBiomaxdata.statusId == "2") &&
                              <h5 className = "text-danger">Staff status is inactive Please change status to active</h5>
                            }
                        </div>
							    </div>
                </div>
              </div>
            }
          </DialogContent>
          <DialogActions>
          {addRights &&(selectedBiomaxdata && selectedBiomaxdata.statusId == "1" && biometricdevicelist && biometricdevicelist.length > 0) &&
                     <Button variant="contained"  onClick={() => {this.onAdd(selectedBiomaxdata);this.setState({ loading : true })}}  className= {"text-white btn-primary py-5 "}  >
                       Add
                     </Button>
          }
          { deleteRights &&  biometricdevicelist && biometricdevicelist.length > 0 &&
                     <Button variant="contained" onClick={() => this.initiateDelete(selectedBiomaxdata)} className={"btn-danger text-white py-5 " } >
                       Delete
                     </Button>
          }
                     <Button variant="contained" onClick={() => this.onClose()} className={"btn-danger text-white py-5 " } >
                       Cancel
                     </Button>
              </DialogActions>
              {
                deleteConfirmationDialog &&
                <DeleteConfirmationDialog
                  openProps = {deleteConfirmationDialog}
                  title="Are You Sure Want To Delete?"
                  message= { <span className = 'text-capitalize'>  {dataToDelete.name } </span> }
                  onConfirm={() => {this.onDelete(dataToDelete);this.setState({ loading : true })}}
                   onCancel={() => this.cancelDelete()}
                />
              }

        </Dialog>

	);
  }
  }
const mapStateToProps = ({ biomaxReducer ,settings}) => {
	const { viewBiomaxDialog, selectedBiomaxdata ,biometricdevicelist,tableInfo} =  biomaxReducer;
  const { userProfileDetail } =  settings;
  return { viewBiomaxDialog, selectedBiomaxdata,biometricdevicelist ,tableInfo,userProfileDetail}
}

export default connect(mapStateToProps,{
	clsViewBioMaxModel,push,getBiomaxUsers})(Viewbiometric);
