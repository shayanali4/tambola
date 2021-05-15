import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsViewTaxCodeCategoryModel } from 'Actions';
import CustomConfig from 'Constants/custom-config';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import { RctCard } from 'Components/RctCard';
import { push } from 'connected-react-router';
import {isMobile} from 'react-device-detect';
class ViewTaxCodeCategory extends Component {
	onClose()
		{
			this.props.clsViewTaxCodeCategoryModel();
			this.props.push('/app/setting/organization/2');
		}
	render() {
	 const	{ viewtaxCodeCategoryDialog, selectedtaxcodecategory,istextgroup } = this.props;
		return (
      <Dialog fullWidth fullScreen = {isMobile ? true : false}
          onClose={() => this.onClose()}
          open={viewtaxCodeCategoryDialog}
        >

				<DialogTitle >
							<span className="fw-bold text-capitalize"> {selectedtaxcodecategory && (selectedtaxcodecategory.taxcategoryname + (selectedtaxcodecategory.taxcodecategorytype ? ' (' + selectedtaxcodecategory.taxcodecategorytype + ')' : ''))}</span>

								<CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>
				</DialogTitle>

          <DialogContent>

            {selectedtaxcodecategory == null ? <RctSectionLoader /> :
                <div className="clearfix d-flex">
                    <div className="media-body">
      										<div className = "row">
      											<div className = "col-6 col-sm-3 col-md-3">
      												    <p>Tax Code:  </p>
      											 </div>
      											 <div className = "col-6 col-sm-3 col-md-3">
      															 <p><span className="badge badge-warning w-100">{selectedtaxcodecategory.taxcode}</span></p>
      											 </div>

                              <div className = "col-6 col-sm-3 col-md-3">
                                    <p>Tax Group:  </p>
                               </div>
                               <div className = "col-6 col-sm-3 col-md-3">
                                       <p><span className="badge badge-warning w-100">{selectedtaxcodecategory.taxgroupname+ "(" +selectedtaxcodecategory.percentage +" %)"}</span></p>
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
const mapStateToProps = ({ settings }) => {
	const {viewtaxCodeCategoryDialog, selectedtaxcodecategory } =  settings;
  return { viewtaxCodeCategoryDialog, selectedtaxcodecategory }
}

export default connect(mapStateToProps,{
	clsViewTaxCodeCategoryModel,push})(ViewTaxCodeCategory);
