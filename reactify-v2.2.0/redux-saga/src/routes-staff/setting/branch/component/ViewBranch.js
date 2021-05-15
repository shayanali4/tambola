/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsViewBranchModel } from 'Actions';
import Ownership  from 'Assets/data/ownership';
import {getLocalDate, getFormtedDate, checkError,getLocalTime,getFormtedFromTime,getFormtedTimeFromJsonDate} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import classnames from 'classnames';
import DialogTitle from '@material-ui/core/DialogTitle';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import { push } from 'connected-react-router';
import ReactTable from "react-table";
import {isMobile} from 'react-device-detect';
import CardContent from '@material-ui/core/CardContent';
import GoogleMap from 'Components/google-map-react';
import {GoogleMapConfig} from 'Constants/custom-config';

class ViewBranch extends Component {

	onClose()
		{
			this.props.clsViewBranchModel();
			this.props.push('/app/setting/branch');
		}
		renderMarkers(map, maps,brancheslist) {
			let title = brancheslist.branchname;
			let latitude = parseFloat(brancheslist.latitude);
			let longitude = parseFloat(brancheslist.longitude);
			new maps.Marker({
				position: { lat: latitude, lng: longitude },
				map,
				title: title
			});
		};
		static defaultProps = {
			center: {
				lat: 23.06,
				lng: 72.57
			},
			zoom: 13
		};


	render() {

	 const	{viewBranchDialog ,selectedBranch,selectedSchedule} = this.props;
		return (
      <Dialog fullWidth
           onClose={() => this.onClose()}
          open={viewBranchDialog}
					scroll = 'body'
					fullScreen = {isMobile ? true : false}
        >
				<DialogTitle >
						<span className="fw-bold text-capitalize"> {selectedBranch && selectedBranch.branchname}</span>
					  <CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>
				</DialogTitle>

		<PerfectScrollbar style={{ height:  isMobile ? 'calc(100vh - 5px)' : 'calc(70vh - 5px)'  }}>
          <DialogContent className = {"pt-0"}>
            {selectedBranch == null ? <RctSectionLoader /> :
                <div className="clearfix d-flex">
                  <div className="media-body">

									<CardContent>
													 <div className="w-100" style={{height: '250px'}}>
														 {selectedBranch.latitude && selectedBranch.longitude &&
																			 <GoogleMap
																						bootstrapURLKeys={{ key: GoogleMapConfig.Apikey  }}
																						yesIWantToUseGoogleMapApiInternals={true}
																						center={ {
																												 lat: parseFloat(selectedBranch.latitude),
																												 lng: parseFloat(selectedBranch.longitude)
																									 } }
																						zoom={this.props.zoom}
																						onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps,selectedBranch)}
																						/>
																					 }
														 </div>

									 </CardContent>
										<div className = "row">
													<div className = "col-6 col-sm-3 col-md-4" >
												 		<p>Branch Manager: </p>
													</div>
													<div className = "col-6 col-sm-3 col-md-3" >
														<p><span className="badge badge-warning">{selectedBranch.managername}</span></p>
													</div>
											</div>

										 <div className = "row">

													 <div className = "col-6 col-sm-3 col-md-4" >
														 <p>Phone no: </p>
													 </div>
													 <div className = "col-6 col-sm-3 col-md-3" >
															<p><span className="badge badge-warning">{selectedBranch.phone}</span></p>
													 </div>

														<div className = "col-6 col-sm-3 col-md-3" >
 															<p>Carpet Area: </p>
 													 </div>
 													 <div className = "col-6 col-sm-3 col-md-2" >
 															<p><span className="badge badge-warning">{selectedBranch.carpetarea}</span></p>
 													  </div>
									 </div>

									 <div className = "row">
										 <div className = "col-6 col-sm-3 col-md-4" >
												<p>Property Ownership: </p>
											</div>
											<div className = "col-6 col-sm-3 col-md-3" >
												<p><span className="badge badge-warning">{selectedBranch.ownership}</span></p>
											</div>
									 </div>

									 <div className = "row">
										 <div className = "col-6 col-sm-3 col-md-4" >
												<p>Gym Access Slot: </p>
											</div>
											<div className = "col-6 col-sm-3 col-md-3" >
												<p><span className="badge badge-warning">{selectedBranch.gymaccessslot == 1 ? 'Enable' : 'Disable'}</span></p>
											</div>
									 </div>

									 {selectedBranch.gymaccessslot == 1 &&
										 <div className = "row">
											 <div className = "col-6 col-sm-3 col-md-4" >
													<p>Slot Duration In Min: </p>
												</div>
												<div className = "col-6 col-sm-3 col-md-3" >
													<p><span className="badge badge-warning">{selectedBranch.slotduration}</span></p>
												</div>
										</div>
									  }
										{selectedBranch.gymaccessslot == 1 &&
 										 <div className = "row">
 											 <div className = "col-6 col-sm-3 col-md-6" >
 													<p>Gap Between two Gym access Slot In Min: </p>
 												</div>
 												<div className = "col-6 col-sm-3 col-md-3" >
 													<p><span className="badge badge-warning">{selectedBranch.gapbetweentwogymaccessslot}</span></p>
 												</div>
 										</div>
 									  }

										{selectedBranch.gymaccessslot == 1 &&
											<div className = "row">
												<div className = "col-9 col-sm-6 col-md-6" >
 													<p>Max Member Occupancy Per Slot: </p>
 												</div>
 												<div className = "col-3 col-sm-6 col-md-3" >
 													<p><span className="badge badge-warning">{selectedBranch.slotmaxoccupancy}</span></p>
 												</div>
											</div>
										 }

										 {selectedBranch.gymaccessslot == 1 &&
 											<div className = "row">
												<div className = "col-9 col-sm-6 col-md-6" >
 													<p>Max Days to Book Slot in Advance: </p>
 												</div>
 												<div className = "col-3 col-sm-6 col-md-3" >
 													<p><span className="badge badge-warning">{selectedBranch.slotmaxdays}</span></p>
 												</div>
										 </div>
								   }


									 <div className="address-wrapper">
								 					<div className="row row-eq-height">

								 										<div className="col-md-12" >
								 											<div className={classnames("card-base", { 'border-primary': true })}>
								 														<div className="d-flex justify-content-between">
								 																<h5 className="fw-bold"> Description</h5>
								 														</div>
								 														<address>
																									{selectedBranch.description}
																								</address>
								 												</div>
								 											</div>
								 		</div>
								 </div>
											<div className="address-wrapper">
															<div className="row row-eq-height">

																				<div className="col-md-12" >
																					<div className={classnames("card-base", { 'border-primary': true })}>
																								<div className="d-flex justify-content-between">
																										<h5 className="fw-bold"> Address</h5>
																								</div>
																								<address>
																									<span>{selectedBranch.address1}</span>
																									<span>{selectedBranch.address2 && `${selectedBranch.address2} `} {selectedBranch.pincode && ('-' + selectedBranch.pincode)}</span>
																								</address>
																						</div>
																					</div>
																</div>
									 		 </div>


											 <div className = "row">
	 												<div className = "col-md-8">
	 										<ReactTable

	 										columns={[
	 											{
	 												Header: "Days",
	 												accessor : 'name',
	 											},
	 											{
	 												Header: "Timing",
	 												Cell : data =>(
	 												 	<div>
														{data.original && data.original.duration && data.original.duration.length > 0 && data.original.duration.map((time, key) => (
																		<div className ="col-12" key = {key}>
																				{time.starttime &&
																				     <span >{getFormtedTimeFromJsonDate(time.starttime) + ' - ' + getFormtedTimeFromJsonDate(time.endtime)}</span>
																				}
																	</div>
													  ))
													}
														</div>
	 												)	,
	 											}

	 										]}

	 										          filterable = { false}
	 										          sortable = { false }
	 										          data = {selectedBranch.timing || []}
	 										         // Forces table not to paginate or sort automatically, so we can handle it server-side
	 										          showPagination= {false}
	 										          showPaginationTop = {false}
	 										          loading={false} // Display the loading overlay when we need it
	 										          defaultPageSize={7}
	 										          className=" -highlight"
	 										          freezeWhenExpanded = {true}
	 										          />
	   											</div>
	 									  </div>
                  </div>
                </div>

            }
          </DialogContent>
						</PerfectScrollbar>
        </Dialog>

	);
  }
  }
const mapStateToProps = ({ branchReducer }) => {
	const { viewBranchDialog, selectedBranch ,} =  branchReducer;
  return { viewBranchDialog, selectedBranch }
}

export default connect(mapStateToProps,{
	clsViewBranchModel,push})(ViewBranch);
