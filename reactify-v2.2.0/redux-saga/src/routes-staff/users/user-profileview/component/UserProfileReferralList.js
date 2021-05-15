
import React, { Component } from 'react';
import api from 'Api';
import {getFormtedDate,getFormtedDateTime,getStatusColor,cloneDeep,getLocalDate,setLocalDateTime} from 'Helpers/helpers';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { RctCardFooter } from 'Components/RctCard';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import Button from 'reactstrap/lib/Button';
import Month from 'Assets/data/month';
import $ from 'jquery';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const styles = {
    media: {
        minHeight: 275,
        paddingTop: '56.25%', // 16:9
    },
};

class UserProfileReferralList extends Component {
   constructor(props) {
      super(props);
      this.state = this.getInitialState();
   }
   getInitialState()
   {
     this.initialState = {
                     referrallist:null,
                     randomImage : Math.floor((Math.random() * 3) + 1),
                     month: (getLocalDate(new Date()).getMonth() + 1).toString(),
                     year : getLocalDate(new Date()).getFullYear(),
                     activeTab : 0,
                     membercount: 0,
                     totalrefrence: 0
                   }
                   return cloneDeep(this.initialState);
     }

     onChangeActiveStateMonth({month ,year,activeTab})
     {
       month = month == undefined ? this.state.month: month;
       year = year == undefined ? this.state.year: year;
       activeTab = activeTab == undefined ? this.state.activeTab: activeTab;

            this.setState({ month,year,activeTab});
            this.getUserreferrallist({ month,year,activeTab });
     }

     componentDidMount()
     {
       const  {month,year,activeTab} = this.state;

         this.getUserreferrallist({month,year,activeTab});
       }


    getUserreferrallist({ month,year,activeTab })
    {
      let branchid =  this.props.branchid;
      let id =  this.props.id;
      let {membercount} = this.state;
      let client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
      api.post('user-referral-list', { month,year,activeTab,branchid,id,client_timezoneoffsetvalue})
     .then(response =>
       {
           let chartdata = {};
           let referrallist = response.data[0];
           chartdata.referrallist = referrallist;
           membercount = referrallist.filter(x => x.memberid != null).length;

          this.setState({referrallist : referrallist, membercount : membercount, totalrefrence : referrallist.length  })
        }
     ).catch(error => console.log(error) )
    }

    shouldComponentUpdate(nextProps, nextState) {

  		if(this.state)
  		{
  			return true;
  		}
  		else {
  			return false;
  		}
  	}

	render() {

	let	{ referrallist,month,year,randomImage,activeTab,membercount,totalrefrence} = this.state;
  const {classes} = this.props;

  var date = getLocalDate(new Date());
  var Year = [];

  for(let i = 2018; i <= getLocalDate(new Date()).getFullYear() ; i++ )
  {
      Year.push(i);
  }
  Year = $.unique(Year);

   	return (
      <RctCollapsibleCard
          heading={"Referral List"}
         fullBlock
         customClasses="overflow-hidden"
      >
         <div className="support-widget-wrap">

                          <div className="pl-15 py-10">
                          <h5 className = "text-capitalize"> total reference : {totalrefrence}</h5>
                           <h5 className = "text-capitalize">total member : { membercount}</h5>
                          </div>



                          <PerfectScrollbar style={{ height: '140px' }}>
                          {referrallist && referrallist.map((data, key) => (
                    <CardActions className="d-flex justify-content-between px-15 py-0"  key={"workoutday" + key}>
                            <div className="post-content d-flex">
                            {data.createdmemberdetail ? data.createdmemberdetail.map((createdmemberdetail, key) => (
                               <div className="post-info">
                                      <h5 className = "text-capitalize">{data.name} (Member)
                                       <span className= " badge ml-5" style={{"backgroundColor": getStatusColor(createdmemberdetail.statusId)}} >
                                         {createdmemberdetail.status}
                                       </span>
                                      </h5>
                                      <h5 className = "text-capitalize"> Registration date -
                                      {setLocalDateTime(createdmemberdetail.registrationdate)}</h5>
                               </div>
                             ))
                             :
                             <div className="post-info">
                                    <h5 className = "text-capitalize">{data.name} (Enquiry)
                                    </h5>
                                    <h5 className = "text-capitalize">Enquiry date -
                                    {getFormtedDateTime(data.date)}</h5>
                             </div>
                           }
                            </div>



                    </CardActions>
                  ))}
                  </PerfectScrollbar>

                  <RctCardFooter customClasses="d-flex border-0 pull-right">
                    <ButtonGroup className="default-btn-group d-inline">
                        <Button className={"btn-sm " + (activeTab == 0 ? "active" : "") } disabled = {activeTab == 0 ? true : false}  onClick={() => this.onChangeActiveStateMonth({activeTab : 0})}>Month</Button>
                        <Button className={"mr-10 btn-sm " + (activeTab == 1 ? "active" : "") } disabled = {activeTab == 1 ? true : false}  onClick={() => this.onChangeActiveStateMonth({activeTab : 1})}>Year</Button>
                    </ButtonGroup>
                    {activeTab == 0 &&
                      <Select value={month} className = {'dropdown-chart'} onChange={(e) => this.onChangeActiveStateMonth({month : e.target.value})}
                          inputProps={{name: 'month', id: 'month', }}>
                          {
                            Month.map((month, key) => ( <MenuItem value={month.value} key= {'monthOption' + key}>{month.short}</MenuItem> ))
                           }
                       </Select>
                     }
                     <Select value={year} className = {'dropdown-chart'} onChange={(e) => this.onChangeActiveStateMonth({year : e.target.value})}
                           inputProps={{name: 'year', id: 'year', }}>
                           {
                           Year.map((year, key) => ( <MenuItem value={year} key= {'yearOption' + key}>{year}</MenuItem> ))
                           }
                     </Select>
                  </RctCardFooter>

            </div>

            </RctCollapsibleCard>

	);
  }
  }

export default withStyles(styles) (UserProfileReferralList);
