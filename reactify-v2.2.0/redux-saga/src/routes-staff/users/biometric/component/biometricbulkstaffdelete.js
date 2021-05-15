/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { getBiomaxUsers } from 'Actions';
import Title  from 'Assets/data/title';
import Gender  from 'Assets/data/gender';
import Status  from 'Assets/data/status';
import Referby  from 'Assets/data/referby';
import {getLocalDate, getFormtedDate, checkError, getFormtedDateTime,unique} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import { push } from 'connected-react-router';
import {isMobile} from 'react-device-detect';
import {cloneDeep} from 'Helpers/helpers';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import {required} from 'Validations';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { NotificationManager } from 'react-notifications';
import api from 'Api';

class BiometricBulkUserDelete extends Component {


	constructor(props) {
			super(props);
							this.state = this.getInitialState();
				 }

				 getInitialState()
					{
							this.initialState = {
							  opnbulkuploadmemberdialog : false,
                loading : false
						};
							return cloneDeep(this.initialState);
					}
  onclickAdd(){
    this.setState({
      opnbulkuploadmemberdialog : true
    })
  }
  onClose(){
    this.setState({
      opnbulkuploadmemberdialog : false
    })
  }


  onAdd(){
    let {data,biometricdevicelist}= this.props;
              let biometricdata = data;

              let SerialNumber = biometricdevicelist && biometricdevicelist.map(x => x.serialnumber);
              biometricdata = biometricdata.filter(x => x.checked == true).map(y => {return {name : y.firstname +  " " + y.lastname,userid : y.userid,SerialNumber:SerialNumber}});

              api.post('BulkDeleteUserinBiometric',{biometricdata})
                .then(response =>
                 {
                   let data = response.data.Message;
                  let index =  data && data.indexOf("Successfully");
                   if(index > 0 ) {
                     NotificationManager.success("User deleted in device successfully");
                     this.setState({loading : false,opnbulkuploadmemberdialog : false})
                  }
                  else{
                    NotificationManager.error("Request failed");
                    this.setState({loading : false,opnbulkuploadmemberdialog : false})
                  }
                  this.props.getBiomaxUsers();
                   this.onClose();
                 }
               ).catch(error => console.log(error) )
        }
	render() {

	 const	{ opnbulkuploadmemberdialog } = this.state;
   const {data,biometricdevicelist} = this.props;
		return (
			<div>
					<div className="d-flex justify-content-between p-10">
             <Button color="primary" variant="contained" onClick={() => this.onclickAdd()}  className="mr-10 text-white">Delete Users From Biometric Device</Button>
					</div>
      <Dialog fullScreen = {isMobile ? true : false} fullWidth = {true} maxWidth = 'md'
           onClose={() => this.onClose()}
          open={opnbulkuploadmemberdialog}
					scroll = 'body'
        >
				<DialogTitle >
									{data &&		<span className="text-capitalize"> Total {data.length} Users to Delete From Biometric Device</span>}
				</DialogTitle>

				{data != null &&
          <DialogContent>
								<div>
								<h4 className = "fw-bold pb-10 pt-10">Users:</h4>
								<PerfectScrollbar style={{ height: 'auto' , minHeight : '120px'  }}>
										{data && data.map(x => x.firstname + " " + x.lastname).join(", ")}
									</PerfectScrollbar>
								</div>
								<div className="pt-20 text-center">
										{(biometricdevicelist == null || biometricdevicelist.length == 0) &&
											<h5 className = "text-danger">Please configure biometric device in settings</h5>
										}
								</div>

				  </DialogContent>
				}

						<DialogActions>
								 <Button variant="contained" onClick={() => this.onClose()} className="btn-danger text-white">Cancel</Button>
								 {(biometricdevicelist && biometricdevicelist.length > 0) &&
									<Button variant="contained"  color="primary" onClick={() => this.onAdd()}  className="text-white"> Save </Button>
							 }
					  </DialogActions>
			</Dialog>
			</div>

	);
  }
  }
const mapStateToProps = ({ biomaxReducer }) => {
	const { } =  biomaxReducer;
  return { }
}

export default connect(mapStateToProps,{push,getBiomaxUsers})(BiometricBulkUserDelete);
