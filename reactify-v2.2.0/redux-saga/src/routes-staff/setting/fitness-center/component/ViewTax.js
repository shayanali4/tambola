import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsViewClientTaxModel } from 'Actions';
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
class ViewTax extends Component {
	onClose()
		{
			this.props.clsViewClientTaxModel();
			this.props.push('/app/setting/organization/2');
		}
	render() {
	 const	{ viewtaxDialog, selectedtax,istextgroup } = this.props;
		return (
      <Dialog fullWidth fullScreen = {isMobile ? true : false}
          onClose={() => this.onClose()}
          open={viewtaxDialog}
        >

				<DialogTitle >
							<span className="fw-bold text-capitalize"> {selectedtax && selectedtax.taxname}</span>

								<CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>
				</DialogTitle>

          <DialogContent>

            {selectedtax == null ? <RctSectionLoader /> :
                <div className="clearfix d-flex">
                    <div className="media-body">
      										<div className = "row">
      											<div className = "col-6 col-sm-3 col-md-3">
      												    <p>Percentage:  </p>
      											 </div>
      											 <div className = "col-6 col-sm-3 col-md-3">
      															 <p><span className="badge badge-warning w-100">{selectedtax.percentage + " %"}</span></p>
      											 </div>
      										</div>


                          {istextgroup && selectedtax.taxgroupitem  &&
                            <div className="table-responsive">
                                <table className={"flip-content w-100"}>
                                  <thead   style={{backgroundColor:"white"}} >
                                    <tr>
                                      <th className="text-dark fw-bold">Tax name </th>
                                      <th className="text-dark fw-bold"> Percentage </th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                      {selectedtax.taxgroupitem.filter(x => x.checked).map((item, key) => (
                                        <tr  key={'item' + key} className="w-50">
                                            <td className="pb-5"> {item.label} </td>
                                            <td className="numeric  pl-10"> {item.percentage + " %"} </td>
                                      </tr>
                                            ))}
                                  </tbody>
                                </table>
                            </div>
                          }
	               </div>
                </div>
            }
          </DialogContent>
        </Dialog>

	);
  }
  }
const mapStateToProps = ({ settings }) => {
	const {viewtaxDialog, selectedtax,istextgroup } =  settings;
  return { viewtaxDialog, selectedtax,istextgroup }
}

export default connect(mapStateToProps,{
	clsViewClientTaxModel,push})(ViewTax);
