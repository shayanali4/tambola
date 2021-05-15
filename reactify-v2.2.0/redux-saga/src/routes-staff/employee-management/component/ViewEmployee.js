/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsStarterViewEmployeeModel } from 'Actions';
import Gender  from 'Assets/data/gender';
import Specialization  from 'Assets/data/specialization';
import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate, checkError,getCurrency} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import classnames from 'classnames';
import DialogTitle from '@material-ui/core/DialogTitle';
import { push } from 'connected-react-router';
import {isMobile} from 'react-device-detect';
import QRCode from 'qrcode';

class ViewEmployee extends Component {
	onClose()
	{
		this.props.clsStarterViewEmployeeModel();
		this.props.push('/app/employee-management');
	}


	render() {

	 const	{ viewEmployeeDialog, selectedstarteremployee , clientProfileDetail} = this.props;
	 if(selectedstarteremployee){
		 QRCode.toDataURL(selectedstarteremployee.employeecode, function (err, url) {
			 selectedstarteremployee.qrcode = url;
		});
  }

		return (
      <Dialog fullWidth  fullScreen = {isMobile ? true : false}
          onClose={() => this.onClose()}
          open={viewEmployeeDialog}
					fullWidth = {true} maxWidth = 'md'
        >
				<DialogTitle >

			{ selectedstarteremployee &&	<img src={CustomConfig.serverUrl + selectedstarteremployee.image} alt = ""
				onError={(e)=>{
						 let gender = Gender.filter(value => value.name == selectedstarteremployee.gender).map(x => x.value);
														gender = gender.length > 0 ? gender[0] : '1';
						e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}
						className="rounded-circle mr-15" width="50" height="50"/> }
			<span className="fw-bold text-capitalize">{selectedstarteremployee && selectedstarteremployee.title + " " +  selectedstarteremployee.firstname +  " " + selectedstarteremployee.lastname}</span>

				<CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>
				</DialogTitle>

          <DialogContent>
            {selectedstarteremployee == null ? <RctSectionLoader /> :

              <div>


                <div className="clearfix d-flex">
      					    <div className="media-body">

										<div className = "row">

										<div className = "col-6 col-sm-3 col-md-3">
													<p>Gender: </p>
										 </div>
										 <div className = "col-6 col-sm-3 col-md-3">
														 <p><span className="badge badge-warning w-100">{selectedstarteremployee.gender}</span></p>
										 </div>

										 <div className = "col-6 col-sm-3 col-md-3">
													 <p>Middle Name: </p>
											</div>
											<div className = "col-6 col-sm-3 col-md-3">
															<p><span className="badge badge-warning w-100">{selectedstarteremployee.fathername}</span></p>
											</div>

											<div className = "col-6 col-sm-3 col-md-3">
														<p>Joining Date: </p>
											 </div>
											 <div className = "col-6 col-sm-3 col-md-3">
															 <p><span className="badge badge-warning w-100">{ getFormtedDate(selectedstarteremployee.dateofjoining) }</span></p>
											 </div>

											<div className = "col-6 col-sm-3 col-md-3">
														<p>Resignation Date: </p>
											 </div>
											 <div className = "col-6 col-sm-3 col-md-3">
															 <p><span className="badge badge-warning w-100">{ getFormtedDate(selectedstarteremployee.dateofresigning) }</span></p>
											 </div>

											 <div className = "col-6 col-sm-3 col-md-3">
														 <p>Assigned Role: </p>
												</div>
												<div className = "col-6 col-sm-3 col-md-3">
																<p><span className="badge badge-warning w-100">{selectedstarteremployee.rolename}</span></p>
												</div>

											{/*	<div className = "col-6 col-sm-3 col-md-3">
													{selectedstarteremployee.rolealias == "trainer" &&
															<p>Specialization: </p>
														}
												 </div>*/}
												{/* <div className = "col-6 col-sm-3 col-md-3">
												 {selectedstarteremployee.rolealias == "trainer" &&
																 <p><span className="badge badge-warning w-100">{selectedstarteremployee.specialization}</span></p>
													}
												 </div>*/}

												 </div>
												 	<div className = "row">
												 <div className = "col-6 col-sm-3 col-md-3">
												 			<p>Username: </p>
												  </div>
												  <div className = "col-6 col-sm-3 col-md-3">
												 				 <p><span className="badge badge-warning w-100">{selectedstarteremployee.encryptemailid || selectedstarteremployee.emailid }</span></p>
												  </div>
													 </div>



											<div className = "row">
											<div className = "col-6 col-sm-3 col-md-3">
													 <p>Mobile no: </p>
											 </div>
											 <div className = "col-6 col-sm-3 col-md-3">
															<p><span className="badge badge-warning w-100">{selectedstarteremployee.encryptmobile || selectedstarteremployee.mobile }</span></p>
											 </div>

											 <div className = "col-6 col-sm-3 col-md-3">
 													 <p>Phone no: </p>
 											 </div>
 											 <div className = "col-6 col-sm-3 col-md-3">
 															<p><span className="badge badge-warning w-100">{selectedstarteremployee.encryptphone || selectedstarteremployee.phone }</span></p>
 											 </div>

											 <div className = "col-6 col-sm-3 col-md-3">
													 <p>Emergency contact no: </p>
											 </div>
											 <div className = "col-6 col-sm-3 col-md-3">
															<p><span className="badge badge-warning w-100">{selectedstarteremployee.contactnumber }</span></p>
											 </div>

											 <div className = "col-6 col-sm-3 col-md-3">
													 <p>Personal Email-id: </p>
											 </div>
											 <div className = "col-6 col-sm-3 col-md-3">
															<p><span className="badge badge-warning w-100">{selectedstarteremployee.personalemailid }</span></p>
											 </div>

											 <div className = "col-6 col-sm-3 col-md-3">
											 		<p>Blood Group: </p>
											 </div>
											 <div className = "col-6 col-sm-3 col-md-3">
											 			 <p><span className="badge badge-warning w-100">{selectedstarteremployee.bloodgroup }</span></p>
											 </div>

											 <div className = "col-6 col-sm-3 col-md-3">
													 <p>Date of Birth: </p>
											 </div>
											 <div className = "col-6 col-sm-3 col-md-3">
															<p><span className="badge badge-warning w-100">{ getFormtedDate(selectedstarteremployee.dateofbirth) }</span></p>
											 </div>

											 <div className = "col-6 col-sm-3 col-md-3">
													<p>Tax Id Number: </p>
											</div>
											<div className = "col-6 col-sm-3 col-md-3">
														 <p><span className="badge badge-warning w-100">{selectedstarteremployee.panno }</span></p>
											</div>

											<div className = "col-6 col-sm-3 col-md-3">
													<p>Salary: </p>
											</div>
											<div className = "col-6 col-sm-3 col-md-3">
														 <p><span className="badge badge-warning w-100">{selectedstarteremployee.salary ? getCurrency() + selectedstarteremployee.salary : '-' }</span></p>
											</div>

											{clientProfileDetail && clientProfileDetail.ishavemutliplebranch == 1 &&
											<div className = "col-6 col-sm-3 col-md-3">
													<p>Associate with: </p>
											</div>
											}
											{clientProfileDetail && clientProfileDetail.ishavemutliplebranch == 1 &&
											<div className = "col-6 col-sm-3 col-md-3">
														 <p><span className="badge badge-warning w-100">{selectedstarteremployee.zoneid ? 'Zone' : 'Branch' }{selectedstarteremployee.zoneid ? ' ('+ selectedstarteremployee.zonename +' )' : ' ('+ selectedstarteremployee.defaultbranchname +' )' }</span></p>
											</div>
										  }

											<div className = "col-6 col-sm-3 col-md-3">
													<p>App Access: </p>
											</div>
											<div className = "col-6 col-sm-3 col-md-3">
														 <p><span className="badge badge-warning w-100">{selectedstarteremployee.appaccess }</span></p>
											</div>

											<div className = "col-6 col-sm-3 col-md-3">
													<p>Is Trainer: </p>
											</div>
											<div className = "col-6 col-sm-3 col-md-3">
														 <p><span className="badge badge-warning w-100">{selectedstarteremployee.isTrainer == 1 ? 'Yes' : 'No' }</span></p>
											</div>

											<div className = "col-6 col-sm-3 col-md-3">
													<p>{clientProfileDetail && clientProfileDetail.packtypeId != 1 ? 'Sale Complimentary Service/Product: ' : 'Sale Complimentary Service: '}</p>
											</div>
											<div className = "col-6 col-sm-3 col-md-3">
														 <p><span className="badge badge-warning w-100">{selectedstarteremployee.enablecomplimentarysale == 1 ? 'Yes' : 'No' }</span></p>
											</div>

											{selectedstarteremployee.complimentarysalelimit &&
												<div className = "col-6 col-sm-3 col-md-3">
														<p>Complimentary Sale Limit: </p>
												</div>
										  }
											{selectedstarteremployee.complimentarysalelimit &&
												<div className = "col-6 col-sm-3 col-md-3">
															 <p><span className="badge badge-warning w-100">{selectedstarteremployee.complimentarysalelimit}</span></p>
												</div>
										  }


											<div className = "col-6 col-sm-3 col-md-3">
													<p>Sales With Discount: </p>
											</div>
											<div className = "col-6 col-sm-3 col-md-3">
														 <p><span className="badge badge-warning w-100">{selectedstarteremployee.enablediscount == 1 ? 'Yes' : 'No' }</span></p>
											</div>

											{selectedstarteremployee.enablediscount == 1 &&
												<div className = "col-6 col-sm-3 col-md-3">
														<p>Sales With Discount Limit: </p>
												</div>
										  }
											{selectedstarteremployee.enablediscount == 1 &&
												<div className = "col-6 col-sm-3 col-md-3">
															 <p><span className="badge badge-warning w-100">{selectedstarteremployee.enablediscountlimit == 1 ? 'Yes' : 'No' }</span></p>
												</div>
										  }

											{selectedstarteremployee.maxdiscountperitem &&
												<div className = "col-6 col-sm-3 col-md-3">
														<p>Max Discount Per Item: </p>
												</div>
										  }
											{selectedstarteremployee.maxdiscountperitem &&
												<div className = "col-6 col-sm-3 col-md-3">
															 <p><span className="badge badge-warning w-100">{selectedstarteremployee.maxdiscountperitem + '%' }</span></p>
												</div>
										  }

											{selectedstarteremployee.maxdiscountperinvoice &&
												<div className = "col-6 col-sm-3 col-md-3">
														<p>Max Discount Per Invoice: </p>
												</div>
										  }
											{selectedstarteremployee.maxdiscountperinvoice &&
												<div className = "col-6 col-sm-3 col-md-3">
															 <p><span className="badge badge-warning w-100">{getCurrency() + selectedstarteremployee.maxdiscountperinvoice}</span></p>
												</div>
										  }


											{selectedstarteremployee.maxmonthlylimit &&
												<div className = "col-6 col-sm-3 col-md-3">
														<p>Max Monthly Discount: </p>
												</div>
											}
											{selectedstarteremployee.maxmonthlylimit &&
												<div className = "col-6 col-sm-3 col-md-3">
															 <p><span className="badge badge-warning w-100">{getCurrency() + selectedstarteremployee.maxmonthlylimit}</span></p>
												</div>
											}



											</div>

											{selectedstarteremployee.professionaldetails &&
												<div className="address-wrapper">
															 <div className="row row-eq-height">

																	 <div className="col-md-12" >
																		 <div className={classnames("card-base", { 'border-primary': true })}>
																					 <div className="d-flex justify-content-between">
																							 <h5 className="fw-bold"> Professional Details</h5>
																					 </div>
																					 <address>
																								 {selectedstarteremployee.professionaldetails}
																							 </address>
																			 </div>
																		 </div>
												         </div>
											  </div>
										  }

    		<div className="address-wrapper">
															<div className="row row-eq-height">

															<div className="col-md-6" >
																	{selectedstarteremployee && selectedstarteremployee.qrcode && <img src={selectedstarteremployee.qrcode} alt = "" />}
															</div>
																			<div className="col-md-6" >
																					<div className={classnames("card-base", { 'border-primary': true })}>
																						<div className="d-flex justify-content-between">
																								<h5 className="fw-bold">Resident Address</h5>
																						</div>
																						<address>
																							<span>{selectedstarteremployee.address1}</span>
																							<span>{selectedstarteremployee.address2 && `${selectedstarteremployee.address2}, `} {selectedstarteremployee.city}</span>
																							<span>{selectedstarteremployee.state && `${selectedstarteremployee.state}, `}{selectedstarteremployee.country} - {selectedstarteremployee.pincode && selectedstarteremployee.pincode}  </span>
																						</address>
																						</div>
																					</div>
																</div>
												</div>
									 </div>
                  </div>
              </div>
            }
          </DialogContent>
        </Dialog>

	);
  }
  }
const mapStateToProps = ({ employeeManagementReducer ,settings}) => {
	const { viewEmployeeDialog, selectedstarteremployee } =  employeeManagementReducer;
	const {clientProfileDetail} = settings;
  return { viewEmployeeDialog, selectedstarteremployee ,clientProfileDetail}
}

export default connect(mapStateToProps,{
	clsStarterViewEmployeeModel, push})(ViewEmployee);
