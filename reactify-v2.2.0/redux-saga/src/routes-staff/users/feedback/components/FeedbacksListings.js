/**
 * Feedbacks Listings
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import Select from '@material-ui/core/Select';
import Search from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import {FormControlLabel,Radio,RadioGroup,Checkbox,FormControl,InputLabel} from '@material-ui/core';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import { RctCard, RctCardContent, RctCardHeading } from 'Components/RctCard/index';
import {cloneDeep} from 'Helpers/helpers';
import FeedbackStatus  from 'Assets/data/feedbackstatus';
import Feedback  from 'Assets/data/feedback';
import Feedbackfor  from 'Assets/data/feedbackfor';
import MultiSelect from 'Routes/advance-ui-components/autoComplete/component/MultiSelect';
import FeedbackDetail from './FeedbackDetail';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Button from 'reactstrap/lib/Button';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import Month from 'Assets/data/month';
import Pagesizefilter from 'Assets/data/pagesizefilter';
import $ from 'jquery';

// actions
import {
    viewFeedbackDetails,
    showFeedbackLoadingIndicator,
    replyFeedback,
    sendReply,
    getFeedbacks,
} from 'Actions';

// components
import FeedbacksListItem from './FeedbacksListItem';
import InfiniteScroll from "react-infinite-scroll-component";
import {isMobile} from 'react-device-detect';

class FeedbacksListing extends Component {
  constructor(props) {
       super(props);
	     this.state = this.getInitialState();
  }
    getInitialState()
        {
  		 	this.initialState = {
              		feedbackfor:!this.props.ismember ? '' : (this.props.clientProfileDetail && ((this.props.clientProfileDetail.id == 1) || ((this.props.clientProfileDetail.serviceprovidedId == 1) || (this.props.clientProfileDetail.clienttypeId == 2))) ? '1' :'2'),
                  feedbackstatus :!this.props.ismember ? '' : '1,3',
                  idea : !this.props.ismember ? '' : (this.props.clientProfileDetail && ((this.props.clientProfileDetail.id == 1) || ((this.props.clientProfileDetail.serviceprovidedId == 1) || (this.props.clientProfileDetail.clienttypeId == 2))) ? '1,2,3,4' :'3,5'),
                  month: '',
                  year : '',
                  activeTab : 0,
	            };
                    return cloneDeep(this.initialState);

          }

    componentDidMount() {
      let {tableInfo} = this.props;
      let {feedbackfor,feedbackstatus,idea} = this.state;
      if(feedbackfor){
        tableInfo.filtered = tableInfo.filtered.filter(x => x.id != "feedbackfor");
        tableInfo.filtered.push({id: "feedbackfor",value:feedbackfor});
      }
      if(feedbackstatus){
        tableInfo.filtered = tableInfo.filtered.filter(x => x.id != "feedbackstatus");
        tableInfo.filtered.push({id: "feedbackstatus",value:feedbackstatus});
      }
      if(idea){
        tableInfo.filtered = tableInfo.filtered.filter(x => x.id != "idea");
        tableInfo.filtered.push({id: "idea",value:idea});
      }
      if(!this.props.ismember)
      {
        tableInfo.filtered = [];
      }

        tableInfo.month = '';
        tableInfo.year = '';
        tableInfo.activeTab = 0;

      if(this.props.clientProfileDetail  && this.props.clientProfileDetail.id == 1 || this.props.ismember){
        tableInfo.isgeneralfeedback = 1;
      }
      else {
        tableInfo.isgeneralfeedback = 0;
      }

      this.props.getFeedbacks({tableInfo});
    }

    /**
     * View Feedback Details
     */
    viewFeedbackDetails(feedback) {
        this.props.showFeedbackLoadingIndicator();
        let self = this;
        setTimeout(() => {
            self.props.viewFeedbackDetails({id :feedback.id});
        }, 1500);
    }

    /**
     * Reply Feedback
     */
    replyFeedback(feedback) {
        this.props.replyFeedback(feedback);
    }


    onChange(key,value)
    {

      if(key == 'feedbackfor')
      {
        if(value == 1)
        {
          this.state.idea = '1,2,3,4';
        }
        else {
          this.state.idea = '3,5';
        }
        this.state.feedbackstatus = '1,3';
      }

      this.setState({
        [key] : value
      });

      if(key == 'feedbackfor')
      {
        this.props.getFeedbacks({[key] : value , idea : this.state.idea});
      }
      else {
        this.props.getFeedbacks({[key] : value });
      }
    }

    onClearFilter = () =>{
       this.setState(this.initialState);
       this.props.getFeedbacks(this.initialState);
    }

    changePage = (value) =>
    {
       let tableInfo = this.props.tableInfo;
       let pageindex = tableInfo.pageIndex + value;
        this.props.getFeedbacks({pageIndex : pageindex});
    }

    changePageIndex = value => {
      const {tableInfo} = this.props;
      if(value > 0 && value < tableInfo.pages)
      {
        value = value;
      }
      else if (value > tableInfo.pages) {
        value = tableInfo.pages;
      }
      else if (value < 0) {
        value = Math.abs(value);
      }

        this.props.getFeedbacks({pageIndex : value ? value-1 : 0});

  }

    render() {
        const { feedbacks,loadingScroll ,tableInfo,ismember,clientList,clientProfileDetail,viewFeedback,loading,updateRights} = this.props;
        const { feedbackfor,feedbackstatus,idea,activeTab,month,year} = this.state;
          var date = new Date();
          var Year = [];

          for(let i = 2018; i <= new Date().getFullYear() ; i++ )
          {
              Year.push(i);
          }
          Year = $.unique(Year);

        return (
          <div className="shop-wrapper">
          { tableInfo && tableInfo.totalrecord != '' && <span className = "pr-10 pt-5 pull-right"> Total {tableInfo.totalrecord} Records </span>}

    				<div className="shop-head row ">

            <div className="col-sm-12 col-md-12 col-xl-12  ">
            <div className="d-inline ">
                <FormGroup row style={{marginBottom:0,marginRight:0}} className = {"pull-right"}>
                      <ButtonGroup className="default-btn-group d-inline">
                          <Button className={"btn-sm " + (activeTab == 0 ? "active" : "") } disabled = {activeTab == 0 ? true : false}  onClick={() => {this.props.getFeedbacks({'activeTab' : 0}); this.onChange('activeTab',0); }}>Month</Button>
                          <Button className={"mr-10 btn-sm " + (activeTab == 1 ? "active" : "") } disabled = {activeTab == 1 ? true : false}  onClick={() => {this.props.getFeedbacks({'activeTab' : 1}); this.onChange('activeTab',1); }}>Year</Button>
                      </ButtonGroup>
                        {activeTab == 0 &&  <Select className = {'dropdown-chart'} value={month} onChange={(e) => {this.props.getFeedbacks({'month' : e.target.value}); this.onChange('month',e.target.value);}}
                            inputProps={{name: 'month', id: 'month', }}>
                            {
                              Month.map((month, key) => ( <MenuItem value={month.value} key= {'monthOption' + key}>{month.short}</MenuItem> ))
                             }
                             </Select> }
                          <Select className = {'dropdown-chart'} value={year} onChange={(e) => {this.props.getFeedbacks({'year' : e.target.value}); this.onChange('year',e.target.value);}}
                            inputProps={{name: 'year', id: 'year', }}>
                            {
                            Year.map((year, key) => ( <MenuItem value={year} key= {'yearOption' + key}>{year}</MenuItem> ))
                            }
                          </Select>
                </FormGroup>
            </div>
           </div>


    					<div className="col-sm-12 col-md-8 col-xl-8 mb-10">
              {
    						// <form>
    						// 	<FormGroup className="has-wrapper mb-0">
    						// 		<Input type="search" name="servicename" id="servicename" className="has-input-right input-lg-icon" placeholder="Search Service" value={this.state.servicename} onChange={(e) => this.onChangeRadio(e)}/>
    						// 		<span className="has-icon-left"><i className="ti-search"></i></span>
    						// 	</FormGroup>
    						// </form>
              }
    					</div>



    				</div>
    				<div className="shop-grid">
    					<div className="row">

              {feedbacks && feedbacks.length > 0 ?
                (
                <div className="col-12 d-flex page-title mb-10" style = {{justifyContent: 'center'}}>

                      <a href="javascript:void(0)" style = {{color: 'black'}} onClick={(e) => {
                        if((tableInfo.pageIndex + 1) > 1)
                        { this.changePage(-1); }
                        }
                      }> <i className="ti-angle-double-left text-center  mx-5 size-20"></i></a>

                      <span  style ={{width: 'fit-content' , fontSize : '1rem' , color: 'black' , paddingRight : '5px' }}>
                        Page {(tableInfo.pageIndex + 1)}
                      </span>

                      {/*
                        <Input
                          style ={{width: '45px'}}
                          className = "py-0 px-5"
                           type="number"
                           min = {1}
                           value={ (tableInfo.pageIndex + 1)}
                           onChange={(e) => { this.changePageIndex(e.target.value);}}
                        />
                        */}

                       <span className = "pl-5 " style ={{width: 'fit-content' , fontSize : '1rem', color: 'black'}}>
                             of {tableInfo.pages}
                       </span>

                      <a href="javascript:void(0)" style = {{color: 'black'}} onClick={(e) =>
                        {
                          if((tableInfo.pageIndex + 1) < tableInfo.pages)
                          {  this.changePage(1);  }
                        }
                      }> <i className="ti-angle-double-right text-center mx-5 size-20"></i></a>
                      {/*	ref={(node) => {if (node) { node.style.setProperty("color", "white", "important");  } }} */}



                      <Select className = {'dropdown-chart'} value={tableInfo.pageSize} onChange={(e) => { this.props.getFeedbacks({pageSize : e.target.value});}}
                          inputProps={{name: 'pageSize', id: 'pageSize', }}>
                          {
                            Pagesizefilter.map((pageSize, key) => ( <MenuItem value={pageSize.value} key= {'pageSizeOption' + key}>{pageSize.name}</MenuItem> ))
                          }
                      </Select>
                 </div>

               )
                 :
                 <div className="col-12 d-flex mt-10 page-title" style = {{justifyContent: 'center'}}>
                    <div className="page-title-wrap">
                        <h2 style ={{fontSize : '1rem', color: 'black'}}> No data found </h2>
                    </div>
                 </div>
             }

    							<div className="col-lg-3 col-md-4 col-12">
    							<div className="filters-wrapper">

                      <RctCard className="feedbackfor">
                      {clientProfileDetail  && clientProfileDetail.id == 1 &&
                        <RctCardContent>
                            <FormGroup className="has-wrapper">
                               <FormControl fullWidth>
                                 <InputLabel htmlFor="title">Select Client</InputLabel>
                                   <Select value={tableInfo.clientid} onChange={(e) => this.props.getFeedbacks({'clientid' : e.target.value})}
                                     inputProps={{name: 'clientid', id: 'clientid' }}>
                                         {
                                           clientList && clientList.map((clientid, key) => ( <MenuItem value={clientid.id} key= {'clientidOption'}>{clientid.label}</MenuItem> ))
                                          }
                                    </Select>
                               </FormControl>
                             </FormGroup>
                       	  </RctCardContent>
                        }

                          <RctCardContent customClasses = {"pb-0"}>
      											 <RctCardHeading title="Feedback For" customClasses = {"p-0"}/>
      											    <RadioGroup row aria-label="feedbackfor"  id="feedbackfor" name="feedbackfor" value={this.state.feedbackfor} onChange={(e) => this.onChange('feedbackfor',e.target.value)}>
      													 {
      														 Feedbackfor.filter(x => ((clientProfileDetail.serviceprovidedId == 1) || (clientProfileDetail.clienttypeId == 2)) ? x.value != 2 : x.value).map((feedbackfor, key) => ( <FormControlLabel value={feedbackfor.value} key= {'feedbackforOption' + key} control={<Radio />} label={feedbackfor.name} />))
      													 }
      											    </RadioGroup>

                                {feedbackfor != '' &&

                                      <MultiSelect selectAll = {true}
                                      label = {"Feedback Type"}
                                      value = {this.state.idea}
                                      options = {Feedback.filter(x =>feedbackfor == 1 ?  x.value != 5 : x.value == 3 || x.value == 5).map(y => ({value : y.value, label : y.name}))}
                                      onChange={(e) => this.onChange('idea',e)}
                                       />
                               }

                          </RctCardContent>
                         {idea != 5 &&
                           <RctCardContent>

                                <MultiSelect selectAll = {true}
                                label = {"Feedback Status"}
                                value = {this.state.feedbackstatus}
                                options = {FeedbackStatus.map(x => ({value : x.value, label : x.name}))}
                                onChange={(e) => this.onChange('feedbackstatus',e)}
                                 />

                           </RctCardContent>

                        }

                        <RctCardContent>
                            <Button variant="contained" value="Clear Filter" color="primary" className=" btn-md" onClick={() => this.onClearFilter()}>
                              Clear Filter
                            </Button>
                        </RctCardContent>
                        </RctCard>

    							</div>

    							</div>
    							<div className="col-lg-9 col-md-8 col-12 d-inline">
    								<div className="row">
                    { loading ?
                          <div className = "col-12 text-center"><RctSectionLoader /> </div>: feedbacks && feedbacks.map((feedback, key) => (
                                   <FeedbacksListItem
                                       data={feedback}
                                       key={key}
                                       initiateDelete={() => this.initiateDelete(feedback)}
                                       viewFeedbackDetails={() => this.viewFeedbackDetails(feedback)}
                                       onReply={() => this.replyFeedback(feedback)}
                                       isGeneral={ this.props.ismember ? 1 : 0}
                                       updateRights = {updateRights}
                                   />
                               ))}
    								</div>
    					  	</div>

    						{feedbacks && feedbacks.length > 0 &&
    							<div className="col-12 d-flex mb-10 page-title" style = {{justifyContent: 'center'}}>

    										<a href="javascript:void(0)" style = {{color: 'black'}} onClick={(e) => {
    											if((tableInfo.pageIndex + 1) > 1)
    											{ this.changePage(-1); }
    											}
    										}> <i className="ti-angle-double-left text-center mx-5 size-20"></i></a>

    										<span  style ={{width: 'fit-content', fontSize : '1rem',color: 'black', paddingRight : '5px' }}>
    											Page {(tableInfo.pageIndex + 1)}
    										</span>

                        {/*
                        <Input
                          style ={{width: '45px'}}
                          className = "py-0 px-5"
                           type="number"
                           min = {1}
                           value={ (tableInfo.pageIndex + 1)}
                           onChange={(e) => { this.changePageIndex(e.target.value);}}
                        />
                        */}

    										 <span className = "pl-5 " style ={{width: 'fit-content', fontSize : '1rem',color: 'black'}}>
    													 of {tableInfo.pages}
    										 </span>

    										<a href="javascript:void(0)"  style = {{color: 'black'}} onClick={(e) =>
    											{
    												if((tableInfo.pageIndex + 1) < tableInfo.pages)
    												{  this.changePage(1);  }
    											}
    										}> <i className="ti-angle-double-right text-center mx-5 size-20"></i></a>

                        <Select className = {'dropdown-chart'} value={tableInfo.pageSize} onChange={(e) => { this.props.getFeedbacks({pageSize : e.target.value});}}
                            inputProps={{name: 'pageSize', id: 'pageSize', }}>
                            {
                              Pagesizefilter.map((pageSize, key) => ( <MenuItem value={pageSize.value} key= {'pageSizeOption' + key}>{pageSize.name}</MenuItem> ))
                            }
                        </Select>
    									</div>

    						 }


    							</div>
    				</div>
            {viewFeedback &&
            <FeedbackDetail />
            }
    			</div>
        );
    }
}


const mapStateToProps = ({ feedback, settings }) => {
	const {feedbacks ,loadingScroll,tableInfo,clientList ,viewFeedback,loading} =  feedback;
  const { clientProfileDetail } =  settings;
  return { feedbacks ,loadingScroll,tableInfo,clientList,clientProfileDetail,viewFeedback,loading}
}


export default connect(mapStateToProps, {
    viewFeedbackDetails,
    showFeedbackLoadingIndicator,
    replyFeedback,
    sendReply,
    getFeedbacks,
})(FeedbacksListing);
