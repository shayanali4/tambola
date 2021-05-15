import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsViewTemplateConfigurationModel } from 'Actions';
import CustomConfig from 'Constants/custom-config';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { push } from 'connected-react-router';
import classnames from 'classnames';
import {isMobile} from 'react-device-detect';
import  TemplateType from 'Assets/data/templateType';

class ViewTemplateConfiguration extends Component {
	onClose()
		{
			this.props.clsViewTemplateConfigurationModel();
			this.props.push(this.props.location.pathname);
		}
	render() {
	 const	{ viewTemplateDialog,selectedTemplate } = this.props;
		return (
      <Dialog fullWidth fullScreen = {isMobile ? true : false}
          onClose={() => this.onClose()}
          open={viewTemplateDialog}
        >
        <DialogTitle >
          <span className="fw-bold text-capitalize"> {selectedTemplate && selectedTemplate.templatetitle}</span>
          <CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>
        </DialogTitle>

          <DialogContent>

            {selectedTemplate == null ? <RctSectionLoader /> :
              <div>
                <div className="clearfix d-flex">
                    <div className="media-body">
                      <div className = "row">
    													<div className = "col-6 col-sm-3 col-md-3">
																	<p>Template Type: </p>
														 </div>
														 <div className = "col-12 col-sm-9 col-md-9">
																		 <p><span className="badge badge-warning w-100">{selectedTemplate.templatetype}</span></p>
														</div>
											</div>
											{TemplateType.filter(value => value.name == selectedTemplate.templatetype)[0].value == "1" &&
    										<div className = "row">
														<div className = "col-6 col-sm-3 col-md-3">
																	<p>Subject: </p>
														 </div>
														 <div className = "col-12 col-sm-9 col-md-9">
																		 <p><span className="badge badge-warning w-100">{selectedTemplate.subject}</span></p>
														</div>
                      	</div>
											}
											<div className="address-wrapper">
														 <div className="row row-eq-height">

																			 <div className="col-md-12" >
																				 <div className={classnames("card-base", { 'border-primary': true })}>
																							 <div className="d-flex justify-content-between">
																									 <h5 className="fw-bold"> Content</h5>
																							 </div>
																							 <address>
																										 {selectedTemplate.content}
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
const mapStateToProps = ({ templateconfigurationReducer }) => {
	const {viewTemplateDialog, selectedTemplate } =  templateconfigurationReducer;
  return { viewTemplateDialog, selectedTemplate }
}

export default connect(mapStateToProps,{
	clsViewTemplateConfigurationModel,push})(ViewTemplateConfiguration);
