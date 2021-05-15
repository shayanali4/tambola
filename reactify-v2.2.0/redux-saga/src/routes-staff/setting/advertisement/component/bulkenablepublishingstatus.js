/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import {isMobile} from 'react-device-detect';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { opnEnablePublishingStatusAdvertisementModel,clsEnablePublishingStatusAdvertisementModel ,saveEnablePublishingStatusAdvertisement} from 'Actions';

class BulkEnablePublishingStatus extends Component {

  onClose(){
		this.props.clsEnablePublishingStatusAdvertisementModel();
  }

	onSave()
 {
	 let {enablePublishingStatusAdvertisementData}= this.props;

	 let requestData = {};
	 requestData.id = enablePublishingStatusAdvertisementData.map(x => x.id);
	 requestData.isEnable = 1;
	 this.props.saveEnablePublishingStatusAdvertisement({requestData});
 }

		onClickEnablePublishingStatus(){
			let {advertisements} = this.props;
			let data = advertisements;
			data = data.filter(x => x.checked == true);
				this.props.opnEnablePublishingStatusAdvertisementModel(data);
		}

	render() {

   const {enablePublishingStatusAdvertisementData,opnEnablePublishingStatusAdvertisementDialog} = this.props;
		return (
			<div>
					<div className="d-flex justify-content-between p-10">
             <Button color="primary" variant="contained" onClick={() => this.onClickEnablePublishingStatus()}  className="mr-10 text-white">Enable Publishing Status</Button>
					</div>
      <Dialog fullScreen = {isMobile ? true : false} fullWidth = {true} maxWidth = 'md'
           onClose={() => this.onClose()}
          open={opnEnablePublishingStatusAdvertisementDialog}
					scroll = 'body'
        >
				<DialogTitle >
									{enablePublishingStatusAdvertisementData &&		<span className=" fw-bold text-capitalize"> Total {enablePublishingStatusAdvertisementData.length} Advertisements to enable for publishing</span>}
				</DialogTitle>

				{
					enablePublishingStatusAdvertisementData != null &&
          <DialogContent>
								<div>
								<h4 className = "fw-bold pb-10 pt-10">Title:</h4>
								<PerfectScrollbar style={{ height: 'auto' , minHeight : '120px'  }}>
										{enablePublishingStatusAdvertisementData && enablePublishingStatusAdvertisementData.map(x => x.title).join(", ")}
									</PerfectScrollbar>
								</div>

				  </DialogContent>
				}

						<DialogActions>
								   <Button variant="contained" onClick={() => this.onClose()} className="btn-danger text-white">Cancel</Button>
								   <Button variant="contained"  color="primary" onClick={() => this.onSave()}  className="text-white"> Save </Button>
					  </DialogActions>
			</Dialog>
			</div>

	);
  }
  }


	const mapStateToProps = ({ advertisementReducer }) => {
		const { opnEnablePublishingStatusAdvertisementDialog,enablePublishingStatusAdvertisementData ,advertisements } =  advertisementReducer;
	  return { opnEnablePublishingStatusAdvertisementDialog,enablePublishingStatusAdvertisementData ,advertisements }
	}

	export default connect(mapStateToProps,{
	opnEnablePublishingStatusAdvertisementModel,clsEnablePublishingStatusAdvertisementModel,saveEnablePublishingStatusAdvertisement})(BulkEnablePublishingStatus)
