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
import { opnEnablePublishingStatusResultAndTestimonialModel,clsEnablePublishingStatusResultAndTestimonialModel ,saveEnablePublishingStatusResultAndTestimonial} from 'Actions';

class BulkEnablePublishingStatus extends Component {

  onClose(){
		this.props.clsEnablePublishingStatusResultAndTestimonialModel();
  }

	onSave()
 {
	 let {enablePublishingStatusResultAndTestimonialData}= this.props;

	 let requestData = {};
	 requestData.id = enablePublishingStatusResultAndTestimonialData.map(x => x.id);
	 requestData.isEnable = 1;
	 this.props.saveEnablePublishingStatusResultAndTestimonial({requestData});
 }

		onClickEnablePublishingStatus(){
			let {resultandtestimonial} = this.props;
			let data = resultandtestimonial;
			data = data.filter(x => x.checked == true);
				this.props.opnEnablePublishingStatusResultAndTestimonialModel(data);
		}

	render() {

   const {enablePublishingStatusResultAndTestimonialData,opnEnablePublishingStatusResultAndTestimonialDialog} = this.props;
		return (
			<div>
					<div className="d-flex justify-content-between p-10">
             <Button color="primary" variant="contained" onClick={() => this.onClickEnablePublishingStatus()}  className="mr-10 text-white">Enable Publishing Status</Button>
					</div>
      <Dialog fullScreen = {isMobile ? true : false} fullWidth = {true} maxWidth = 'md'
           onClose={() => this.onClose()}
          open={opnEnablePublishingStatusResultAndTestimonialDialog}
					scroll = 'body'
        >
				<DialogTitle >
									{enablePublishingStatusResultAndTestimonialData &&		<span className=" fw-bold text-capitalize"> Total {enablePublishingStatusResultAndTestimonialData.length}  Result/Testimonial to enable for publishing</span>}
				</DialogTitle>

				{
					enablePublishingStatusResultAndTestimonialData != null &&
          <DialogContent>
								<div>
								<h4 className = "fw-bold pb-10 pt-10">Services:</h4>
								<PerfectScrollbar style={{ height: 'auto' , minHeight : '120px'  }}>
										{enablePublishingStatusResultAndTestimonialData && enablePublishingStatusResultAndTestimonialData.map(x => (x.name + ' - ' + x.resultof)).join(", ")}
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


	const mapStateToProps = ({ resultAndTestimonialReducer }) => {
		const { opnEnablePublishingStatusResultAndTestimonialDialog,enablePublishingStatusResultAndTestimonialData ,resultandtestimonial } =  resultAndTestimonialReducer;
	  return { opnEnablePublishingStatusResultAndTestimonialDialog,enablePublishingStatusResultAndTestimonialData ,resultandtestimonial }
	}

	export default connect(mapStateToProps,{
	opnEnablePublishingStatusResultAndTestimonialModel,clsEnablePublishingStatusResultAndTestimonialModel,saveEnablePublishingStatusResultAndTestimonial})(BulkEnablePublishingStatus)
