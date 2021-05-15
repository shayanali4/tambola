/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
import { connect } from 'react-redux';
import {cloneDeep ,checkError} from 'Helpers/helpers';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { push } from 'connected-react-router';
// api
import api from 'Api';
import { NotificationManager } from 'react-notifications';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import {isMobile} from 'react-device-detect';
import TermsConditionDetail from './terms-conditiondetail';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { saveTermscondition } from 'Actions';
import {required } from 'Validations';
import FormHelperText from '@material-ui/core/FormHelperText';
import RctOverlayLoader from 'Components/RctOverlayLoader/RctOverlayLoader';

class TermsCondition extends PureComponent {

	 constructor(props) {
	 		 super(props);
	 						 this.state = this.getInitialState();
	 				}

					getInitialState()
					 {
							 this.initialState = {
								       checkagree : 0,
											 loading : true,
											 errors : { },
											 validated : false,
                  		};
						 	 return cloneDeep(this.initialState);
					 }
					 onChange(value){
						 let {checkagree} = this.state;
							checkagree = value?1:0;
						 this.setState({
							 'checkagree' : checkagree
						 })
					 }
					 validate()
			      {
			          let errors = {};

			          const checkagree = this.state.checkagree;
								if(checkagree != 1){
									errors.checkagree = 'Required.';
								}
			          let validated = checkError(errors);

			           this.setState({
			            	...this.state,
			                errors : errors, validated : validated
			           });
			           return validated;
			       }
					 onSave(){
						 let {checkagree} = this.state;
						 if(this.validate())
						 {
									this.props.saveTermscondition();
					 }
				 }



	render() {
		const {checkagree,errors} = this.state;
		const {userProfileDetail,dialogLoading,disabled} = this.props;
      return (
        	<div>
                <PageTitleBar
                        title={<IntlMessages id="sidebar.termsCondition" />}
                        match={this.props.match}
                      />
											<RctCollapsibleCard>
											{dialogLoading && <RctOverlayLoader/>}
											{(userProfileDetail &&  userProfileDetail.agreedate == null) &&
											<span className ="text-danger fs-16">Note : Please scroll down and read all of the following terms & conditions carefully and than click agree and continue button.</span>
										  }
																		{
							                         // <iframe src="https://www.fitnessproleague.com/terms-of-services" width="100%" height="100%" id = "termsAndCondition" sandbox = 'allow-same-origin' onLoad = {() => { this.setState({loading : false}); }}>
																			 //
																			 // </iframe>
																		 }
																	    <TermsConditionDetail/>
                   <div className = "row">
									 <div className="col-4 col-sm-4 col-md-4 col-xl-4">
									 </div>
									 {(userProfileDetail &&  userProfileDetail.agreedate == null) &&
									 <div className="col-12 col-sm-8 col-md-8 col-xl-8">
											<FormControlLabel  control={
												<Checkbox color="primary" checked={checkagree==0?false:true} onChange={(e) => this.onChange(e.target.checked )} />
											}  label='I have read and agree with the terms and conditions.'
											/>
											<FormHelperText  error>{errors.checkagree}</FormHelperText>
									</div>
								}
									<div className="col-6 col-sm-6 col-md-5 col-xl-5">
									</div>
									{(userProfileDetail &&  userProfileDetail.agreedate == null) &&
									<div className="col-12 col-sm-4 col-md-4 col-xl-2 mb-10">
										<Button variant="contained"  disabled = {disabled} className="text-white bg-primary  btn-xs mb-10" onClick={() => this.onSave()} >
										  Agree and Continue
										</Button>
										</div>
									}
										</div>
										</RctCollapsibleCard>
              	</div>
	);
  }
  }
	const mapStateToProps = ({ settings,employeeManagementReducer }) => {
		const {userProfileDetail} =  settings;
		const { dialogLoading ,disabled} =  employeeManagementReducer;
	  return {userProfileDetail,dialogLoading,disabled}
	}

	export default connect(mapStateToProps,{saveTermscondition,push})(TermsCondition);
