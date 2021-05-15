/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsViewZoneModel } from 'Actions';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import { push } from 'connected-react-router';
import PerfectScrollbar from 'Components/PerfectScrollbar';

class ViewZone extends Component {

	onClose()
		{
			this.props.clsViewZoneModel();
			this.props.push('/app/setting/zone');
		}

	render() {

	 const	{viewZoneDialog ,selectedZone} = this.props;

		return (
      <Dialog fullWidth
          onClose={() => this.onClose()}
          open={viewZoneDialog}
        >
				<DialogTitle className = "pb-0">
										<span className="fw-bold text-capitalize"> {selectedZone && selectedZone.zonename}</span>
											<CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>
				</DialogTitle>

          <DialogContent>
            {selectedZone == null ? <RctSectionLoader /> :

						    <div className="clearfix d-flex">
                  <div className="media-body">

						 								<h4 className = "fw-bold pb-10 pt-10">Branch List:</h4>
						 								<PerfectScrollbar style={{ height: 'auto' , minHeight : '120px' ,maxHeight : '120px' }}>
						 										{selectedZone && selectedZone.branchlist && selectedZone.branchlist.map(x => unescape(x.label)).join(", ")}
						 								</PerfectScrollbar>


										</div>
                </div>
            }
          </DialogContent>
        </Dialog>

	);
  }
  }
const mapStateToProps = ({ zoneReducer }) => {
	const { viewZoneDialog, selectedZone ,} =  zoneReducer;
  return { viewZoneDialog, selectedZone }
}

export default connect(mapStateToProps,{
	clsViewZoneModel,push})(ViewZone);
