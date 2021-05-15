/**
 * User Profile
 */
import React, { Component ,Fragment} from 'react';
import { connect } from 'react-redux';
import {opnViewEmployeeModel } from 'Actions';
import compose from 'recompose/compose';
import UserProfileStaffpay from './UserProfileStaffpay';
import UserProfilePersonaltraining from './UserProfilePersonaltraining';
import UserProfileGroupSession from './UserProfileGroupSession';
import UserProfileReferralList from './UserProfileReferralList';
import { RctCardFooter } from 'Components/RctCard';
import Month from 'Assets/data/month';
import $ from 'jquery';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Rating from "react-rating";

// rct card box
import { RctCard } from 'Components/RctCard';

// rct collapsible card
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import {cloneDeep,getCurrency,getFormtedTimeFromJsonDate,getLocalDate } from 'Helpers/helpers';
import api from 'Api';

import CustomConfig from 'Constants/custom-config';
import {getFormtedDate,setLocalDateTime} from 'Helpers/helpers';
import QRCode from 'qrcode'
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import Assignment from '@material-ui/icons/Assignment';
import Schedule from '@material-ui/icons/Schedule';
import Button from 'reactstrap/lib/Button';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import Auth from '../../../../Auth/Auth';
const auth = new Auth();
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactTable from "react-table";
import {isMobile} from 'react-device-detect';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',

  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
		marginRight: 'auto' ,
		marginLeft: 'auto' ,
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
});


class UserProfileDetail extends Component {

  constructor(props) {
     super(props);
     this.state = this.getInitialState();
  }
  getInitialState()
  {
    this.initialState = {
										success: false,
										loadingMore : false,
										activitydialog : false,
                    scheduledialog : false,
                    month: (getLocalDate(new Date()).getMonth() + 1).toString(),
                    year : getLocalDate(new Date()).getFullYear(),
                    activeIndex : 0,
                    lastfetcheddate : null,
                    staffperformances : null,
                    openpersonaltariningdialog : false,
                    opengroupsessiondialog : false,
                    performancedata :{
                      pscount : 0,
                      gscount : 0,
                      rating : 0,
                      gscommissionamount : 0,
                      pscommissionamount : 0,
                      enquirycount : 0,
                      collectionamount : 0,
                      sellamount : 0,
                      memberfollowupcount : 0,
                      enquiryfollowupcount : 0,
                    },
                    imgsrc :null,
                  }
                  return cloneDeep(this.initialState);
    }


  componentDidMount()
  {
    let {id} = this.props;
    this.props.opnViewEmployeeModel({id});
    let	{ month,year,activeIndex} = this.state;

    let modulename = 'userprofiledetail';
    let componentname = 'userprofileview'+ '_' + activeIndex + '_' + month + '_' + year + '_' + id ;

       let data = auth.getMasterDashboardChartData(modulename,componentname);
    if(data)
    {
      let month = data.month;
      let year = data.year;

      let enquirycount = data.enquirycount;
      let collectionamount = data.collectionamount;
      let sellamount = data.sellamount;
      let memberfollowupcount = data.memberfollowupcount;
      let enquiryfollowupcount = data.enquiryfollowupcount;
      let pscount = data.pscount;
      let gscount =data.gscount;
      let rating = data.rating;
      let pscommissionamount = data.pscommissionamount;
      let gscommissionamount = data.gscommissionamount;
      let activeIndex = data.activeIndex;
      let lastfetcheddate = setLocalDateTime(data.startdate);

      this.setState({
        performancedata : {
        enquirycount,collectionamount,sellamount,memberfollowupcount,enquiryfollowupcount,pscount,
        gscount,rating,pscommissionamount,gscommissionamount
       },
       activeIndex,month,year,lastfetcheddate
    })
}
    else {
        this.getUserProfileDetail({});
    }
   }

	 handleButtonClick = () => {
     if (!this.props.loading) {
       this.setState(
         {
           success: false,
           loadingMore: true,
         },
         () => {
           this.timer = setTimeout(() => {
             this.setState({
               loadingMore: false,
               success: true,
             });
           }, 1000);
         },
       );
     }
   };

   opnDiscaimerForm()
   {
     let memberProfile = this.props.selectedemployee;

     if(memberProfile && memberProfile.isSaveDisclaimer > 0)
     {
       let memberid = memberProfile.id;
     }
     else {
     }
    }


    onChangeActiveStateMonth({month, year,activeIndex} )
    {
      let {id} = this.props;

      month = month == undefined ? this.state.month: month;
      year = year == undefined ? this.state.year: year;
      activeIndex = activeIndex == undefined ? this.state.activeIndex: activeIndex;

      let modulename = 'userprofiledetail';
      let componentname = 'userprofileview'+ '_' + activeIndex + '_' + month + '_' + year + '_' + id ;

      let data = auth.getMasterDashboardChartData(modulename,componentname);

           if(data)
           {
             let month = data.month;
             let year = data.year;

             let enquirycount = data.enquirycount;
             let collectionamount = data.collectionamount;
             let sellamount = data.sellamount;
             let memberfollowupcount =data.memberfollowupcount;
             let enquiryfollowupcount = data.enquiryfollowupcount;
             let pscount = data.pscount;
             let gscount =data.gscount;
             let rating = data.rating;
             let pscommissionamount = data.pscommissionamount;
             let gscommissionamount = data.gscommissionamount;
             let activeIndex = data.activeIndex;
             let lastfetcheddate = setLocalDateTime(data.startdate);
             this.setState({
               performancedata : {
               enquirycount,collectionamount,sellamount,memberfollowupcount,enquiryfollowupcount,pscount,
               gscount,rating,pscommissionamount,gscommissionamount
              },
              activeIndex,month,year,lastfetcheddate
           })
           }
           else {
                 this.setState({month, year,activeIndex });
                 this.getUserProfileDetail({month, year,activeIndex});
           }
    }
    getUserProfileDetail({month, year,activeIndex})
    {
      let {id} = this.props;
      month = month == undefined ? this.state.month: month;
      year = year == undefined ? this.state.year: year;
      activeIndex = activeIndex == undefined ? this.state.activeIndex: activeIndex;
      let client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

      api.post('userprofile-view',{month, year,activeIndex,id ,client_timezoneoffsetvalue})
     .then(response =>
       {

         let enquirycount = response.data[0][0].enquirycount;
         let collectionamount = response.data[1][0].collectionamount;
         let sellamount = response.data[2][0].sellamount;
         let memberfollowupcount = response.data[3][0].memberfollowupcount;
         let enquiryfollowupcount = response.data[4][0].enquiryfollowupcount;
         let pscount = response.data[5][0].pscount;
         let gscount =response.data[6][0].gscount;
         let rating =response.data[7][0].rating;
         let pscommissionamount =response.data[8][0].pscommissionamount;
         let gscommissionamount =response.data[9][0].gscommissionamount;


          let chartdata = {};
          let lastfetcheddate = getLocalDate(new Date());
          chartdata.activeIndex = activeIndex;
          chartdata.enquirycount = enquirycount;
          chartdata.collectionamount = collectionamount;
          chartdata.sellamount = sellamount;
          chartdata.memberfollowupcount = memberfollowupcount;
          chartdata.enquiryfollowupcount = enquiryfollowupcount;
          chartdata.pscount = pscount;
          chartdata.gscount = gscount;
          chartdata.rating = rating;
          chartdata.pscommissionamount = pscommissionamount;
          chartdata.gscommissionamount = gscommissionamount;

          chartdata.month = month;
          chartdata.year = year;
          chartdata.startdate = lastfetcheddate;
          let modulename = 'userprofiledetail';
          let componentname = 'userprofileview'+ '_' + activeIndex + '_' + month + '_' + year + '_' + id ;
          let minutes = 12*60;
          auth.setMasterDashboardChartData(chartdata,modulename,componentname,minutes);

            this.setState({
              performancedata : {
              enquirycount : enquirycount,collectionamount : collectionamount,
            sellamount : sellamount,memberfollowupcount : memberfollowupcount ,enquiryfollowupcount : enquiryfollowupcount,
            pscount : pscount ,gscount : gscount ,rating : rating,pscommissionamount : pscommissionamount ,gscommissionamount: gscommissionamount,
            },
            lastfetcheddate : setLocalDateTime(lastfetcheddate)
          })
        }
     ).catch(error => console.log(error) )
    }

onOpenpersonaltarining(){
  this.setState({openpersonaltariningdialog : true});
}
onClosepersonaltarining(){
  this.setState({openpersonaltariningdialog : false});
}
onOpengroupsession(){
  this.setState({opengroupsessiondialog : true});
}
onClosegroupsession(){
  this.setState({opengroupsessiondialog : false});
}

onPhotoClick(photo)
{
     let {imgsrc} = this.state;
       this.setState({ imgsrc:photo});
}

handleClose = () => {
     this.setState({ imgsrc: null});
  };


	render() {
    	 let	{ success ,loadingMore,activitydialog,month,year,activeIndex,lastfetcheddate,staffperformances,
         openpersonaltariningdialog,opengroupsessiondialog,performancedata,imgsrc,scheduledialog} = this.state;
       let { id ,purchase,totalpayment,selectedemployee,loading,clientProfileDetail,paidsalaryoflastmonth,sessiontypelist} = this.props;
			   const { classes } = this.props;
				 const buttonClassname = classnames({
		       [classes.buttonSuccess]: success,
		     });

			 let image  = {};
       let employeeprofileimage  = null;

       if(selectedemployee)
       {
					image = selectedemployee.memberprofilecoverimage && selectedemployee.memberprofilecoverimage.length > 0
					?  {backgroundImage :  "url('"+CustomConfig.serverUrl + selectedemployee.memberprofilecoverimage[0]+"')"} : {backgroundImage :  "url('"+require('Assets/img/profile-banner.jpg') + "')"}

				  QRCode.toDataURL(selectedemployee.employeecode, { errorCorrectionLevel: 'H' } , function (err, url) {
             selectedemployee.qrcode = url;
          });

          employeeprofileimage = selectedemployee.image ? CustomConfig.serverUrl + selectedemployee.image : '';

        }
        if(selectedemployee && sessiontypelist){
          selectedemployee.specilizationlist = sessiontypelist.filter(z => selectedemployee.specialization.includes(z.value.toString()))
        }
				selectedemployee = selectedemployee || {};

        var date = getLocalDate(new Date());
        var Year = [];

        for(let i = 2018; i <= getLocalDate(new Date()).getFullYear() ; i++ )
        {
            Year.push(i);
        }
        Year = $.unique(Year);

   	return (
	  <div className="user-profile-wrapper">
     {loading ? 	<RctSectionLoader /> :
      <div>

				<RctCard customClasses="profile-head">
					<div className="profile-top" style={ image }>

					</div>
					<div className="profile-bottom border-bottom">
						<div className="user-image text-center mb-30 d-flex">
            {
            selectedemployee &&	<img src={employeeprofileimage} alt = ""
            onClick={() => this.onPhotoClick(employeeprofileimage)}
              onError={(e)=>{
                   let gender = selectedemployee.genderId ? selectedemployee.genderId : '1';
                  e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}
                  className="rounded-circle rct-notify mx-auto pointer" width="110" height="110"/>

            }
						{ selectedemployee.qrcode && <img src={selectedemployee.qrcode} alt = "" />}


						</div>
						<div className="user-list-content">
							<div className="text-center">
								<h3 className="fw-bold  text-capitalize">{(selectedemployee.firstname || '')  +  " " + (selectedemployee.lastname || '')}
								</h3>

							</div>
						</div>

					</div>
          {clientProfileDetail && clientProfileDetail.clienttypeId != 2 && clientProfileDetail.packtypeId != 1 &&
					<div className="user-activity text-center">
						<ul className="list-inline d-inline-block">
            <li className="list-inline-item">
              <span className="fw-bold">{getCurrency()}{totalpayment > 0 ? totalpayment :0}</span>
              <span>Total Payment</span>
            </li>
            <li className="list-inline-item">
              <span className="fw-bold">{getCurrency()}{selectedemployee.payablesalary }</span>
              <span>Payable Salary</span>
            </li>
            {clientProfileDetail && clientProfileDetail.packtypeId != 1 &&
							<li className="list-inline-item">
								<span className="fw-bold">{getCurrency()}{selectedemployee.balance > 0 ? selectedemployee.balance : 0 }</span>
								<span>Payable Commission</span>
							</li>
            }
            <li className="list-inline-item">
              <span className="fw-bold">{getCurrency()}{selectedemployee.advancepayment > 0 ? selectedemployee.advancepayment :0}</span>
              <span>Dues</span>
            </li>
						</ul>
					</div>
         }
				</RctCard>
				<div className="profile-body">
					<div className="row">
						<div className={clientProfileDetail && clientProfileDetail.clienttypeId != 2 ? "col-sm-12 col-md-5 col-lg-4 w-xs-full" :  "col-sm-12 col-md-6 w-xs-full"}>
							<div className="dash-cards">
              {clientProfileDetail && <Schedule onClick={() =>	this.setState({scheduledialog : true})} className = {"square-30 rct-notify bg-warning ml-10 pointer card-right-top-action"}/>}
              {clientProfileDetail && clientProfileDetail.packtypeId != 1 && selectedemployee && selectedemployee.enabledisclaimertomember == 1 && <Assignment  onClick={() =>	this.opnDiscaimerForm()} className = {"square-30 bg-warning rct-notify ml-10 pointer card-right-top-action"} style = {{right : "40px"}}/>}
								<div className="card">
									<div className="media">
										<div className="media-body">
											<span className="mb-10 text-primary text-capitalize fw-bold fs-14 d-block">{selectedemployee.firstname +  " " + selectedemployee.lastname + "  "}
											{selectedemployee.statusId == 1 ?
												<span className="badge badge-success">
													{selectedemployee.status}
												</span>
												:
												<span className="badge badge-danger">
													{selectedemployee.status}
												</span>
											}
											</span>
											<h4 className="mb-5"></h4>

                      <div className = "row pl-5">
                      <div className="table-responsive">
              					<table className="table table-bordered " style={{width:"100%"}}>
              						<thead  style={{backgroundColor:"white"}}>
                          <tr>
            								<td className = "py-5 text-left fw-bold" width ="50%"> Employee Code </td>
                            <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.employeecode} </td>
            					 		</tr>
                          <tr>
            								<td className = "py-5 text-left fw-bold" width ="50%"> Middle Name </td>
                            <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.fathername} </td>
            					 		</tr>
                          <tr>
                            <td className = "py-5 text-left fw-bold" width ="50%"> Mobile </td>
                            <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.encryptmobile || selectedemployee.mobile} </td>
                          </tr>
                          <tr>
                            <td className = "py-5 text-left fw-bold" width ="50%"> Phone </td>
                            <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.encryptphone || selectedemployee.phone} </td>
                          </tr>
                          <tr>
                            <td className = "py-5 text-left fw-bold" width ="50%"> Username </td>
                            <td className = "py-5 text-right fs-14" width ="50%"  style = {{wordBreak:"break-all"}}> {selectedemployee.encryptemailid  || selectedemployee.emailid} </td>
                          </tr>
                          <tr>
                            <td className = "py-5 text-left fw-bold" width ="50%"> Personal Email-id </td>
                            <td className = "py-5 text-right fs-14" width ="50%" style = {{wordBreak:"break-all"}}> {selectedemployee.personalemailid} </td>
                          </tr>
                          <tr>
                            <td className = "py-5 text-left fw-bold" width ="50%"> Joining Date </td>
                            <td className = "py-5 text-right fs-14" width ="50%"> { getFormtedDate(selectedemployee.dateofjoining) } </td>
                          </tr>
                          <tr>
                            <td className = "py-5 text-left fw-bold" width ="50%"> Resignation Date </td>
                            <td className = "py-5 text-right fs-14" width ="50%"> { getFormtedDate(selectedemployee.dateofresigning) } </td>
                          </tr>
                          <tr>
                            <td className = "py-5 text-left fw-bold" width ="50%"> Assigned Role </td>
                            <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.rolename} </td>
                          </tr>
                          <tr>
                            <td className = "py-5 text-left fw-bold" width ="50%"> Blood Group </td>
                            <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.bloodgroup} </td>
                          </tr>
                          <tr>
                            <td className = "py-5 text-left fw-bold" width ="50%"> Date of Birth </td>
                            <td className = "py-5 text-right fs-14" width ="50%"> {getFormtedDate(selectedemployee.dateofbirth)} </td>
                          </tr>
                          <tr>
                            <td className = "py-5 text-left fw-bold" width ="50%"> Tax Id Number </td>
                            <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.panno} </td>
                          </tr>
                          <tr>
                            <td className = "py-5 text-left fw-bold" width ="50%"> Salary </td>
                            <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.salary ? getCurrency() + selectedemployee.salary : '-' } </td>
                          </tr>
                          {clientProfileDetail && clientProfileDetail.ishavemutliplebranch == 1 &&
                            <tr>
                              <td className = "py-5 text-left fw-bold" width ="50%"> Associate with </td>
                              <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.zoneid ? 'Zone' : 'Branch' }{selectedemployee.zoneid ? ' ('+ selectedemployee.zonename +' )' : ' ('+ selectedemployee.defaultbranchname +' )' } </td>
                            </tr>
                           }
                           <tr>
                             <td className = "py-5 text-left fw-bold" width ="50%"> App Access </td>
                             <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.appaccess} </td>
                           </tr>
                           <tr>
                             <td className = "py-5 text-left fw-bold" width ="50%"> Is Trainer </td>
                             <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.isTrainer == 1 ? 'Yes' : 'No'} </td>
                           </tr>
                           <tr>
                             <td className = "py-5 text-left fw-bold" width ="50%"> Sale Complimentary Service/Product </td>
                             <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.enablecomplimentarysale == 1 ? 'Yes' : 'No'} </td>
                           </tr>
                            {selectedemployee.complimentarysalelimit &&
                             <tr>
                               <td className = "py-5 text-left fw-bold" width ="50%"> Complimentary Sale Limit </td>
                               <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.complimentarysalelimit} </td>
                             </tr>
                            }
                            <tr>
                              <td className = "py-5 text-left fw-bold" width ="50%"> Sales With Discount </td>
                              <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.enablediscount == 1 ? 'Yes' : 'No'} </td>
                            </tr>
                             {selectedemployee.enablediscount == 1 &&
                              <tr>
                                <td className = "py-5 text-left fw-bold" width ="50%"> Sales With Discount Limit </td>
                                <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.enablediscountlimit == 1 ? 'Yes' : 'No'} </td>
                              </tr>
                             }
                             {selectedemployee.maxdiscountperitem &&
                             <tr>
                               <td className = "py-5 text-left fw-bold" width ="50%"> Max Discount Per Item </td>
                               <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.maxdiscountperitem + '%'} </td>
                             </tr>
                             }
                             {selectedemployee.maxdiscountperinvoice &&
                               <tr>
                                 <td className = "py-5 text-left fw-bold" width ="50%"> Max Discount Per Invoice </td>
                                 <td className = "py-5 text-right fs-14" width ="50%"> {getCurrency() + selectedemployee.maxdiscountperinvoice} </td>
                               </tr>
                             }
                             {selectedemployee.maxmonthlylimit != 0 && selectedemployee.maxmonthlylimit != null &&
                               <tr>
                                 <td className = "py-5 text-left fw-bold" width ="50%"> Max Monthly Discount </td>
                                 <td className = "py-5 text-right fs-14" width ="50%"> {getCurrency() + selectedemployee.maxmonthlylimit} </td>
                               </tr>
                             }
                               <tr>
                                 {selectedemployee && selectedemployee.specilizationlist &&
                                   <td className = "py-5 text-left fw-bold" width ="50%"> Specialization </td>
                                 }
                                 {selectedemployee && selectedemployee.specilizationlist &&
                                   <td className = "py-5 text-right fs-14" width ="50%">  {selectedemployee.specilizationlist.map(x => x.label).join(", ")}  </td>
                                }
                             </tr>
                             <tr>
                               <td className = "py-5 text-left fw-bold" width ="50%">Enable Online Listing ?</td>
                               <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.enableonlinelisting == 1 ? 'Yes' : 'No'} </td>
                             </tr>
                             {selectedemployee.enableonlinelisting == 1 &&
                             <tr>
                               <td className = "py-5 text-left fw-bold" width ="50%"> Employee Will Provide Online Training ?</td>
                               <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.enableonlinetraining == 1 ? 'Yes' : 'No'} </td>
                             </tr>
                           }
                           {selectedemployee.ptcommssion > 0 &&
                               <tr>
                                 <td className = "py-5 text-left fw-bold" width ="50%">PT Commission</td>
                                 {selectedemployee.ptcommissiontypeId == 1 ?
                                     <td className = "py-5 text-right fs-14" width ="50%"> {getCurrency() + selectedemployee.ptcommssion} </td>
                                     :
                                     <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.ptcommssion}% </td>
                                }
                               </tr>
                          }
                          <tr>
                            <td className = "py-5 text-left fw-bold" width ="50%"> How many days is allowed for back-dated invoice ?</td>
                            <td className = "py-5 text-right fs-14" width ="50%"> {selectedemployee.daysforbackdatedinvoice} </td>
                          </tr>

                          </thead>
                        </table>
                     </div>
              </div>

                      {selectedemployee.professionaldetails &&
												<div className="address-wrapper">
															 <div className="row row-eq-height">

																	 <div className="col-md-12" >
																		 <div className={classnames("card-base", { 'border-primary': true })}>
																					 <div className="d-flex justify-content-between">
																							 <h5 className="fw-bold"> Professional Details</h5>
																					 </div>
																					 <address>
																								 {selectedemployee.professionaldetails}
																							 </address>
																			 </div>
																		 </div>
												         </div>
											  </div>
										  }

                      <div className="address-wrapper">
                              <div className="row row-eq-height">


                                        <div className="col-md-12" >
                                          <div className={classnames("card-base", { 'border-primary': true })}>
                                            <div className="d-flex justify-content-between">
                                                <h5 className="fw-bold">Resident Address</h5>
                                            </div>
                                            <address>
                                              <span>{selectedemployee.address1}</span>
                                              <span>{selectedemployee.address2 && `${selectedemployee.address2}, `} {selectedemployee.city}</span>
                                              <span>{selectedemployee.state && `${selectedemployee.state}, `}{selectedemployee.country} - {selectedemployee.pincode && selectedemployee.pincode}  </span>
                                            </address>
                                            </div>
                                          </div>
                                </div>
                        </div>

										</div>
									</div>
								</div>
							</div>
						</div>
            {clientProfileDetail && clientProfileDetail.clienttypeId != 2 &&
					  <div className="col-sm-12 col-md-7 col-lg-8 w-xs-full d-inline">
            <div className="row">
                <RctCollapsibleCard
                  colClasses = "col-sm-12 col-md-6 col-lg-6 w-xs-full"
                  heading= "Performance Summary"
                  headingCustomClasses ="pb-0"
                  contentCustomClasses = "pt-0"
                  collapsible
                  reloadable
                  reloadabletooltip = {"Date last fetched on : " + lastfetcheddate}
                  onReload = {() =>  this.getUserProfileDetail({})}
                >

            <Fragment>
                <ul className="list-group m-10">
                            <div className="row mb-10">
                                  <span className="w-50 text-capitalize">Rating</span>
                                  <p className="w-50 mb-0">
                                    <span>
                                       <Rating
                                          emptySymbol="fa fa-star-o fa-2x low"
                                          fullSymbol="fa fa-star fa-2x low"
                                          initialRating={performancedata.rating}
                                          readonly = {true}
                                          className ="text-primary"
                                        />
                                    </span>
                                    <span className = "fs-16 fw-semi-bold pl-5 pt-5"> {"(" + (performancedata.rating ? parseFloat(performancedata.rating).toFixed(1) : 0) + ")"} </span>
                                  </p>
                                  </div>
                                  <div className="row mb-10">
                                        <span className="w-50 text-capitalize">Attended Enquiries </span>
                                        <span className="w-50 text-capitalize text-right"> {performancedata.enquirycount}</span>
                                  </div>
                                    <div className="row mb-10">
                                        <span className="w-50 text-capitalize">Collection </span>
                                        <span className="w-50 text-capitalize text-right">{getCurrency()}{performancedata.collectionamount}</span>
                                    </div>
                                    <div className="row mb-10">
                                        <span className="w-50 text-capitalize">Sales Amount </span>
                                        <span className="w-50 text-capitalize text-right">{getCurrency()}{performancedata.sellamount}</span>
                                    </div>
                                    <div className="row">
                                    <span className="text-capitalize fw-bold mb-10">Followup</span>
                                    </div>
                                    <div className="row pl-15 mb-10">
                                        <span className="w-50 text-capitalize">Member </span>
                                        <span className="w-50 text-capitalize text-right">{performancedata.memberfollowupcount}</span>
                                  </div>
                                <div className="row pl-15 mb-10 ">
                                    <span className="w-50 text-capitalize">Enquiry </span>
                                    <span className="w-50 text-capitalize text-right">{performancedata.enquiryfollowupcount}</span>
                                </div>
                          {clientProfileDetail && clientProfileDetail.packtypeId != 1 &&
                            <div className="row">
                          <span className="text-capitalize fw-bold  mb-10">Conducted Sessions</span>
                          </div>
                        }
                        {clientProfileDetail && clientProfileDetail.packtypeId != 1 &&
                              <div className="row pl-15  mb-10 pointer text-primary"  onClick={() => this.onOpenpersonaltarining()}>
                                  <span className="w-50 text-capitalize">Personal Training </span>
                                  <span className="w-50 text-capitalize text-right">{performancedata.pscount}</span>
                              </div>
                        }
                        {clientProfileDetail && clientProfileDetail.packtypeId != 1 &&
                            <div className="row pl-15  mb-10 pointer text-primary"  onClick={() => this.onOpengroupsession()}>
                                  <span className="w-50 text-capitalize">Group Session </span>
                                  <span className="w-50 text-capitalize text-right"> {performancedata.gscount}</span>
                            </div>
                          }
                          {clientProfileDetail && clientProfileDetail.packtypeId != 1 &&
                            <div className="row">
                            <span className="text-capitalize fw-bold  mb-10">Commission</span>
                            </div>
                         }
                         {clientProfileDetail && clientProfileDetail.packtypeId != 1 &&
                                <div className="row pl-15  mb-10 pointer text-primary"  onClick={() => this.onOpenpersonaltarining()}>
                                    <span className="w-50 text-capitalize">Personal Training </span>
                                    <span className="w-50 text-capitalize text-right">{getCurrency()}{performancedata.pscommissionamount}</span>
                                </div>
                        }
                        {clientProfileDetail && clientProfileDetail.packtypeId != 1 &&
                              <div className="row pl-15  mb-10 pointer text-primary"  onClick={() => this.onOpengroupsession()}>
                                    <span className="w-50 text-capitalize">Group Session </span>
                                    <span className="w-50 text-capitalize text-right">{getCurrency()}{performancedata.gscommissionamount}</span>
                              </div>
                        }
                </ul>
            </Fragment>
            <RctCardFooter customClasses="d-flex border-0 pull-right px-0">
            <div className="d-inline ">
            <ButtonGroup className="default-btn-group d-inline">
                <Button className={"btn-sm " + (activeIndex == 0 ? "active" : "") } disabled = {activeIndex == 0 ? true : false}  onClick={() => this.onChangeActiveStateMonth({activeIndex : 0})}>Month</Button>
                <Button className={"mr-10 btn-sm " + (activeIndex == 1 ? "active" : "") } disabled = {activeIndex == 1 ? true : false}  onClick={() => this.onChangeActiveStateMonth({activeIndex : 1})}>Year</Button>
            </ButtonGroup>
               {activeIndex == 0 && <Select className = {'dropdown-chart'} value={month} onChange={(e) => this.onChangeActiveStateMonth({month : e.target.value})}
                  inputProps={{name: 'month', id: 'month', }}>
                  {
                    Month.map((month, key) => ( <MenuItem value={month.value} key= {'monthOption' + key}>{month.short}</MenuItem> ))
                   }
                   </Select>}
                <Select className = {'dropdown-chart'} value={year} onChange={(e) => this.onChangeActiveStateMonth({year : e.target.value})}
                  inputProps={{name: 'year', id: 'year', }}>
                  {
                  Year.map((year, key) => ( <MenuItem value={year} key= {'yearOption' + key}>{year}</MenuItem> ))
                  }
                </Select>

            </div>
            </RctCardFooter>

            </RctCollapsibleCard>
            <div className="col-sm-12 col-md-5 col-lg-5 w-xs-full mb-20">
                    <UserProfileReferralList id={id}/>
            </div>
          </div>
            <RctCollapsibleCard
            heading={"Payment"}
            collapsible
            closeable
            fullBlock
          >
            <UserProfileStaffpay id={id} />
          </RctCollapsibleCard>
            {openpersonaltariningdialog &&
  						<UserProfilePersonaltraining open ={openpersonaltariningdialog} onClose ={this.onClosepersonaltarining.bind(this) } id={id} month = {month} year = {year} activeIndex = {activeIndex}
              sessiontypelist = {sessiontypelist}/>
          }
          {opengroupsessiondialog &&
            <UserProfileGroupSession open ={opengroupsessiondialog} onClose ={this.onClosegroupsession.bind(this) } id={id} month = {month} year = {year} activeIndex = {activeIndex}
            sessiontypelist = {sessiontypelist}/>
        }
          	</div>
        }
				</div>
				</div>

        { imgsrc &&

          <Dialog open={true} fullWidth  onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle >
                    <CloseIcon onClick={this.handleClose} className = {"pull-right pointer"}/>
            </DialogTitle>
            <DialogContent>
              <div className="row" >
                <div className="col-12">
                  <img src={ imgsrc}  className = "w-100" style = {{height:"auto"}}/>
                </div>
              </div>

             </DialogContent>
            </Dialog>
        }

        { scheduledialog && selectedemployee &&

          <Dialog open={true} fullScreen = {isMobile ? true : false} fullWidth = {true}  onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle >
                    <span className ="fw-bold">Schedule</span>
                    <CloseIcon onClick={() =>	this.setState({scheduledialog : false})} className = {"pull-right pointer"}/>
            </DialogTitle>
            <DialogContent>
            <div className = "row">
               <div className = "col-12 col-md-10">
                     <ReactTable
                     columns={[
                       {
                         Header: "Days",
                         accessor : 'name',
                         Cell : data =>
                              (
                              <div className="row">
                                    <label className="professionaldetail_padding" > {isMobile && data.original.short ? data.original.short : data.original.name } </label>
                               </div>
                             )
                       },
                       {
                         Header: "Timing",
                         Cell : data =>(
                           <div>
                           {data.original && data.original.duration && data.original.duration.length > 0 && data.original.duration.map((time, key) => (
                                   <div className ="col-12" key = {key}>
                                       {time.starttime &&
                                            <span >{getFormtedTimeFromJsonDate(time.starttime) + ' - ' + getFormtedTimeFromJsonDate(time.endtime)}</span>
                                       }
                                 </div>
                           ))
                         }
                           </div>
                         )	,
                       }

                     ]}

                               filterable = { false}
                               sortable = { false }
                               data = {selectedemployee && selectedemployee.schedule || []}
                              // Forces table not to paginate or sort automatically, so we can handle it server-side
                               showPagination= {false}
                               showPaginationTop = {false}
                               loading={false} // Display the loading overlay when we need it
                               defaultPageSize={7}
                               className=" -highlight"
                               freezeWhenExpanded = {true}
                               />
               </div>
           </div>

             </DialogContent>
            </Dialog>
        }
			</div>
    }
        </div>
		);
	}
}

const mapStateToProps = ({ employeeManagementReducer,settings }) => {
	const {selectedemployee , purchase , totalpayment ,loading,cancelpaymentdata,paidsalaryoflastmonth} =  employeeManagementReducer;
  const { clientProfileDetail,sessiontypelist} = settings;
   return {selectedemployee , purchase , totalpayment , loading,clientProfileDetail,cancelpaymentdata,paidsalaryoflastmonth,sessiontypelist}
}

export default compose (withStyles(styles),connect(mapStateToProps,{
  opnViewEmployeeModel}))(UserProfileDetail);
