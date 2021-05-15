/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsViewAdvertisementModel } from 'Actions';
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

class ViewAdvertisement extends Component {

	constructor(props) {
		 super(props);
		 this.state = {
			          			imgsrc :null,
								 };
	         }

	onClose()
		{
			this.props.clsViewAdvertisementModel();
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

	 const	{ viewAdvertisemetDialog, selecteAdvertisemet } = this.props;
	 const {imgsrc} = this.state;

		return (
			<div>
      <Dialog fullWidth fullScreen = {isMobile ? true : false}
          onClose={() => this.onClose()}
          open={viewAdvertisemetDialog}
        >
				<DialogTitle >
					<span className = "fw-bold"> {selecteAdvertisemet ? selecteAdvertisemet.title : ''} </span>
					<CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>
				</DialogTitle>

				<PerfectScrollbar style={{ height: selecteAdvertisemet && selecteAdvertisemet.link ?  'calc(70vh - 5px)' : 'calc(40vh - 5px)' }}>

          <DialogContent className = {"pt-0"}>
            {selecteAdvertisemet == null ? <RctSectionLoader /> :

                <div className="clearfix d-flex">
								  <div className="media-body">

									<div className = "row">
										<div className = "col-5 col-sm-5 col-md-3">
											    <p>Category : </p>
										</div>

									  <div className = "col-7 col-sm-7 col-md-3">
													<p><span className="badge badge-warning w-100">{selecteAdvertisemet.advertisementcategory}</span></p>
										</div>
									</div>

										<div className = "row">
											<div className = "col-5 col-sm-5 col-md-3">
														<p>Publishing Status : </p>
											</div>
											<div className = "col-7 col-sm-7 col-md-3">
													 <p><span className="badge badge-warning w-100">{selecteAdvertisemet.publishingstatus == 1 ? 'On' : 'Off'}</span></p>
										 </div>
										</div>

										<div className = "row">

												<div className = "col-5 col-sm-5 col-md-3">
															<p>{selecteAdvertisemet.advertisementcategoryId == 2 ? 'Quote Date : ' : 'Publish Start Date : '}</p>
												</div>

												<div className = "col-7 col-sm-7 col-md-3">
														 <p><span className="badge badge-warning w-100">{getFormtedDate(selecteAdvertisemet.publishstartdate) }</span></p>
											  </div>

											{selecteAdvertisemet.advertisementcategoryId != 2 &&
											 <div className = "col-5 col-sm-5 col-md-3">
														 <p>Publish End Date : </p>
											 </div>
									    }
										  {selecteAdvertisemet.advertisementcategoryId != 2  &&
											 <div className = "col-7 col-sm-7 col-md-3">
										 				<p><span className="badge badge-warning w-100">{getFormtedDate(selecteAdvertisemet.publishenddate) }</span></p>
										   </div>
									  	}
										</div>


									 {selecteAdvertisemet.advertisementcategoryId == 1  &&
										<div className = "row">
											<div className = "col-6 col-sm-6 col-md-4">
														<p>Advertisement As : </p>
											</div>
											<div className = "col-6 col-sm-6 col-md-3">
													 <p><span className="badge badge-warning w-100">{selecteAdvertisemet.quotetype }</span></p>
										 </div>
										</div>
									 }


									{selecteAdvertisemet.quotetypeId == 2 && selecteAdvertisemet.link &&
										<div className = "row">
											<div className = "col-12 ">
												<ReactPlayer url={selecteAdvertisemet.link} width='100%' volume = {0.2} muted = {true} height='auto' controls = {true}  loop={true}
											 />
											</div>
										 </div>
									 }
									 {selecteAdvertisemet.quotetypeId == 1 && selecteAdvertisemet.image &&
										<div className = "row">
	 													<div className="col-10 col-sm-10 col-md-3 col-xl-3 pointer" key= {'exist-img' + selecteAdvertisemet.image }  onClick={() => this.onPhotoClick(selecteAdvertisemet.image)}>
	 														<RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden " >
	 															<div className="overlay-wrap overflow-hidden" >
	 																<div className="text-center p-4">
	 																   	<img src={CustomConfig.serverUrl + selecteAdvertisemet.image}  alt="" type="file" name="imageFiles" className="w-100  img-fluid" />
	 																 </div>
	 																<div className="overlay-content d-flex align-items-end">
	 																</div>
	 														</div>
	 													</RctCard>
	 												</div>
	 							 		</div>
								  }

								{selecteAdvertisemet.content &&
									<div className="address-wrapper">
												 <div className="row row-eq-height">

																	 <div className="col-md-12" >
																		 <div className={classnames("card-base", { 'border-primary': true })}>
																					 <div className="d-flex justify-content-between">
																							 <h5 className="fw-bold">Content</h5>
																					 </div>
																					 <address style = {{whiteSpace: 'pre-line'}}>
																								 { selecteAdvertisemet.content}
																							 </address>
																			 </div>
																		 </div>
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
const mapStateToProps = ({ advertisementReducer }) => {
	const { viewAdvertisemetDialog, selecteAdvertisemet } =  advertisementReducer;
  return { viewAdvertisemetDialog, selecteAdvertisemet }
}

export default connect(mapStateToProps,{
	clsViewAdvertisementModel,push})(ViewAdvertisement);
