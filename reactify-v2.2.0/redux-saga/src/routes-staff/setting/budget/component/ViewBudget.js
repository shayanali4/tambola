/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsViewBudgetModel } from 'Actions';
import Status from 'Assets/data/status';
import Bloodgroup  from 'Assets/data/bloodgroup';
import Title  from 'Assets/data/title';
import Gender  from 'Assets/data/gender';
import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate, checkError} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import classnames from 'classnames';
import DialogTitle from '@material-ui/core/DialogTitle';
import { push } from 'connected-react-router';
import QRCode from 'qrcode'
import {isMobile} from 'react-device-detect';
import {getCurrency} from 'Helpers/helpers';

class ViewBudget extends Component {

onClose()
		{
			this.props.clsViewBudgetModel();
			this.props.push('/app/setting/budget');
		}

	render() {

	 const	{ viewBudgetDialog, selectedbudget } = this.props;

		return (
      <Dialog fullScreen = {isMobile ? true : false} fullWidth = {true}
           onClose={() => this.onClose()}
          open={viewBudgetDialog}
        >
				<DialogTitle >
					<span className="fw-bold text-capitalize">{selectedbudget && selectedbudget.budgetperiod + ' ' + getFormtedDate(selectedbudget.month,('MMM, YYYY'))}</span>
					<CloseIcon onClick={() => this.onClose()}  className = {"pull-right pointer"}/>
				</DialogTitle>

          <DialogContent>
            {selectedbudget == null ? <RctSectionLoader /> :

              <div>
                <div className="clearfix d-flex">
                    <div className="media-body">
                    	<div className = "row">
											<div className = "col-md-6">
											<p>Start Date: <span className="badge badge-warning">{getFormtedDate(selectedbudget.startDate)}</span></p>
											</div>
												<div className = "col-md-6">
												<p>End Date: <span className="badge badge-warning">{getFormtedDate(selectedbudget.endDate)}</span></p>
												</div>
											</div>
											{selectedbudget.budgettype &&
												<div className="table-responsive">
														<table className=" w-100"  style = {{border : "1px solid black"}}>
															<thead   style={{backgroundColor:"white"}} >
																<tr style = {{border : "1px solid black"}}>
																<th className="text-dark fw-bold w-10 "></th>
																<th className="text-dark fw-bold text-right w-10" style = {{border : "1px solid black"}}>  (%) Percentage </th>
																<th className="text-dark fw-bold text-right w-10" style = {{border : "1px solid black"}}> ({getCurrency()}) Budget </th>
																<th className="text-dark fw-bold text-right w-10" style = {{border : "1px solid black"}}> ({getCurrency()}) Consumed </th>
																<th className="text-dark fw-bold text-right w-10" style = {{border : "1px solid black"}}> ({getCurrency()}) Available </th>
																<th className="text-dark fw-bold text-right w-10" style = {{border : "1px solid black"}}> ({getCurrency()}) Overused </th>
															</tr>
															</thead>
															<tbody>
															{selectedbudget.budgettype.map((budgettype, key) => (
																<tr  key={'budgettype' + key}  style ={budgettype.name == 'Total' ? { borderTop: "2px solid #000" } : {borderTop : "1px solid #000"}}>
																			<td className={"fw-bold w-10 " + (isMobile ? "pl-15" : "")} style = {{border : "1px solid black"}}> {budgettype.name} </td>
																		  <td className={"numeric text-right w-10 " + (budgettype.name == 'Total' ? " fw-bold" : "")} style = {{border : "1px solid black"}}> {budgettype.name == 'Total' ? '-' : ((budgettype.budget /selectedbudget.totalbudget) * 100).toFixed(2) || ''} </td>
																		  <td className={"numeric text-right w-10 " + (budgettype.name == 'Total' ? " fw-bold" : "")} style = {{border : "1px solid black"}}> {budgettype.budget} </td>
																			 <td className={"numeric text-right w-10 " + (budgettype.name == 'Total' ? " fw-bold" : "")} style = {{border : "1px solid black"}}> {budgettype.consume} </td>
																			 <td className={"numeric text-right text-success w-10" + (budgettype.name == 'Total' ? " fw-bold" : "")} style = {{border : "1px solid black"}}> {budgettype.available > 0 ? budgettype.available : '-'} </td>
																			 <td className={"numeric text-right text-danger w-10" + (budgettype.name == 'Total' ? " fw-bold" : "")} style = {{border : "1px solid black"}}> {budgettype.available < 0 ? Math.abs(budgettype.available) : '-'} </td>
																	</tr>
																		))}
															</tbody>
														</table>
												</div>
											}
							    </div>
                </div>
              </div>
            }
          </DialogContent>
        </Dialog>

	);
  }
  }
const mapStateToProps = ({ budgetReducer }) => {
	const { viewBudgetDialog, selectedbudget } =  budgetReducer;
  return { viewBudgetDialog, selectedbudget }
}

export default connect(mapStateToProps,{
	clsViewBudgetModel,push})(ViewBudget);
