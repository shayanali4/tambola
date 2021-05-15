/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsViewResultAndTestimonialModel } from 'Actions';
import DialogTitle from '@material-ui/core/DialogTitle';

import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate, checkError,getStatusColor} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import classnames from 'classnames';
import { RctCard } from 'Components/RctCard';
import ReactPlayer from 'react-player';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import { push } from 'connected-react-router';
import {isMobile} from 'react-device-detect';

class ViewResultAndTestimonial extends Component {

	constructor(props) {
		 super(props);
		 this.state = {
			          			imgsrc :null,
								 };
	         }

	onClose()
		{
			this.props.clsViewResultAndTestimonialModel();
			this.props.push(this.props.location.pathname);
		}

		onPhotoClick(image)
		{
				 let {imgsrc} = this.state;
				 imgsrc = image;
				 this.setState({ imgsrc:imgsrc});
		}
		handleClose = () => {
				 this.setState({ imgsrc: null});
			};

	render() {

	 const	{ viewResultAndTestimonialDialog, selectedResultAndTestimonial } = this.props;
	 const {imgsrc} = this.state;

		return (
			<div>
      <Dialog fullWidth fullScreen = {isMobile ? true : false}
          onClose={() => this.onClose()}
          open={viewResultAndTestimonialDialog}
        >
				<DialogTitle >
					<span className="fw-bold text-capitalize"> {selectedResultAndTestimonial ? ((selectedResultAndTestimonial.resultofId == 1 ? selectedResultAndTestimonial.staffname : selectedResultAndTestimonial.membername) + ' ( ' + selectedResultAndTestimonial.resultof + ' ) ' )  : '' }</span>

					<CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>
				</DialogTitle>

				<PerfectScrollbar style={{ height: 'calc(70vh - 5px)' }}>

          <DialogContent className = {"pt-0"}>
            {selectedResultAndTestimonial == null ? <RctSectionLoader /> :

                <div className="clearfix d-flex">
								  <div className="media-body">

									<div className = "row">
										<div className = "col-5 col-sm-5 col-md-3">
											    <p>Result Of : </p>
										</div>

									  <div className = "col-7 col-sm-7 col-md-3">
													<p><span className="badge badge-warning w-100">{selectedResultAndTestimonial.resultof}</span></p>
										</div>
										<div className = "col-5 col-sm-5 col-md-3">
											    <p>Name : </p>
										</div>

									  <div className = "col-7 col-sm-7 col-md-3">
													<p><span className="badge badge-warning w-100">{selectedResultAndTestimonial.resultofId == 1 ? selectedResultAndTestimonial.staffname : selectedResultAndTestimonial.membername}</span></p>
										</div>

										<div className = "col-5 col-sm-5 col-md-4">
													<p>Result Achieved In Days : </p>
										</div>

										<div className = "col-7 col-sm-7 col-md-3">
													<p><span className="badge badge-warning w-100">{selectedResultAndTestimonial.resultachieveindays}</span></p>
										</div>
									</div>


										<div className = "row">
											<div className = "col-5 col-sm-5 col-md-3">
														<p>Publishing Status : </p>
											</div>
											<div className = "col-7 col-sm-7 col-md-3">
													 <p><span className="badge badge-warning w-100">{selectedResultAndTestimonial.publishingstatus == 1 ? 'On' : 'Off'}</span></p>
										 </div>
										</div>


										<div className = "row">
											<div className = "col-5 col-sm-5 col-md-3">
														<p>Publish Start Date : </p>
											</div>
											<div className = "col-7 col-sm-7 col-md-3">
													 <p><span className="badge badge-warning w-100">{getFormtedDate(selectedResultAndTestimonial.publishstartdate) }</span></p>
										  </div>
										  <div className = "col-5 col-sm-5 col-md-3">
													 <p>Publish End Date : </p>
										  </div>
										  <div className = "col-7 col-sm-7 col-md-3">
													<p><span className="badge badge-warning w-100">{getFormtedDate(selectedResultAndTestimonial.publishenddate) }</span></p>
									   	</div>
										</div>
							


										{selectedResultAndTestimonial.resulttype &&
											<div className="address-wrapper">
														 <div className="row row-eq-height">

																			 <div className="col-md-12" >
																				 <div className={classnames("card-base", { 'border-primary': true })}>
																							 <div className="d-flex justify-content-between">
																									 <h5 className="fw-bold">Result Type</h5>
																							 </div>
																							 <address style = {{whiteSpace: 'pre-line'}}>
																										 { selectedResultAndTestimonial.resulttype}
																									 </address>
																					 </div>
																				 </div>
										     	 </div>
										</div>
									}

									{selectedResultAndTestimonial.resultdata &&
										<div className="address-wrapper">
													 <div className="row row-eq-height">

																		 <div className="col-md-12" >
																			 <div className={classnames("card-base", { 'border-primary': true })}>
																						 <div className="d-flex justify-content-between">
																								 <h5 className="fw-bold">Result Data</h5>
																						 </div>
																						 <address style = {{whiteSpace: 'pre-line'}}>
																									 { selectedResultAndTestimonial.resultdata}
																								 </address>
																				 </div>
																			 </div>
												 </div>
									</div>
								}


										{selectedResultAndTestimonial.testimonialwords &&
											<div className="address-wrapper">
														 <div className="row row-eq-height">

																			 <div className="col-md-12" >
																				 <div className={classnames("card-base", { 'border-primary': true })}>
																							 <div className="d-flex justify-content-between">
																									 <h5 className="fw-bold">Testimonial Words</h5>
																							 </div>
																							 <address style = {{whiteSpace: 'pre-line'}}>
																										 { selectedResultAndTestimonial.testimonialwords}
																									 </address>
																					 </div>
																				 </div>
										     	 </div>
										</div>
									}





										<div className = "row pb-10">
												{selectedResultAndTestimonial.beforeimage &&
	 													<div className="col-6 col-sm-4 col-md-3 col-xl-4 pointer" key= {'exist-img' + selectedResultAndTestimonial.beforeimage }  onClick={() => this.onPhotoClick(selectedResultAndTestimonial.beforeimage)}>
															<span className = "fw-bold"> Before  </span>
	 														<RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden " >
	 															<div className="overlay-wrap overflow-hidden" >
	 																<div className="text-center p-4">
	 																   	<img src={CustomConfig.serverUrl + selectedResultAndTestimonial.beforeimage}  alt="" type="file" name="imageFiles" className="w-100  img-fluid" />
	 																 </div>
	 																<div className="overlay-content d-flex align-items-end">
	 																</div>
	 														</div>
	 													</RctCard>
	 												</div>
												}
												{selectedResultAndTestimonial.afterimage &&
													<div className="col-6 col-sm-4 col-md-3 col-xl-4 pointer" key= {'exist-img' + selectedResultAndTestimonial.afterimage }  onClick={() => this.onPhotoClick(selectedResultAndTestimonial.afterimage)}>
														<span className = "fw-bold"> After  </span>
														<RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden " >
															<div className="overlay-wrap overflow-hidden" >
																<div className="text-center p-4">
																		<img src={CustomConfig.serverUrl + selectedResultAndTestimonial.afterimage}  alt="" type="file" name="afterimage" className="w-100  img-fluid" />
																 </div>
																<div className="overlay-content d-flex align-items-end">
																</div>
														</div>
													</RctCard>
												</div>
											}
	 							 		</div>


										{selectedResultAndTestimonial.testimoniallink &&
											<div className = "row">
												<div className = "col-12 ">
													<ReactPlayer url={selectedResultAndTestimonial.testimoniallink} width='100%' volume = {0.2} muted = {true} height='auto' controls = {true}  loop={true}
												 />
												</div>
											 </div>
										 }


			</div>
        </div>
            }
          </DialogContent>
					</PerfectScrollbar>

        </Dialog>

				{ imgsrc &&

					<Dialog open={true} fullScreen ={isMobile  ? true : false} fullWidth  onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle >
									<CloseIcon onClick={this.handleClose} className = {"pull-right pointer"}/>
					</DialogTitle>
					<DialogContent>

					<div className="row" >
					<div className="col-12">
					<img src={ CustomConfig.serverUrl  + imgsrc}  className = "w-100" style = {{height:"auto"}}/>
					 </div>
					</div>

					</DialogContent>
							</Dialog>

						}
				</div>

	);
  }
  }
const mapStateToProps = ({ resultAndTestimonialReducer }) => {
	const { viewResultAndTestimonialDialog, selectedResultAndTestimonial } =  resultAndTestimonialReducer;
  return { viewResultAndTestimonialDialog, selectedResultAndTestimonial }
}

export default connect(mapStateToProps,{
	clsViewResultAndTestimonialModel,push})(ViewResultAndTestimonial);
