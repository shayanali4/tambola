/**
 * Notification Component
 */
import React, { Component } from 'react';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Badge from 'reactstrap/lib/Badge';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { getFormtedTimeFromJsonDate,getDateDifference} from 'Helpers/helpers';
// api
import api from 'Api';
import {cloneDeep } from 'Helpers/helpers';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import Weekdays from 'Assets/data/weekdays';
import timer from 'Components/Timer';
import InfiniteScroll from "react-infinite-scroll-component";
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import {isMobile} from 'react-device-detect';
import {askForNotificationPermission} from '../../serviceWorker';
import Checkbox  from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  customWidth: {
    maxWidth: 250,
  }
});
// const NotificationToReadTimer = timer(30000)(getNewNotification);
//
// function getNewNotification({timer, that})
// {
//   let {notifications} = that.state;
//
//     that.getNotifications();
//      return (<div>43</div>);
//
// }

class Notifications extends Component {

  constructor(props) {
     super(props);
     this.state = this.getInitialState();
  }
  getInitialState()
  {
    this.initialState = {
                        dropdownOpen : false,
                        notificationcount : 0,
                        notifications: [],
                        notificationid : null,
                        loadingScroll : false,
                        loading : false,
                        enableNotifications : false,
                        markallread : false,
                  }
                  return cloneDeep(this.initialState);
    }

  componentDidMount() {

    if ('Notification' in window && 'serviceWorker' in navigator) {
       this.setState({ enableNotifications : true });

    }

    api.post('get-member-notification-count')
   .then(response =>
     {
             this.setState({ notificationcount : response.data[0][0].notificationcount  });
    }
 ).catch(error => console.log(error) )
  }

  // get notifications
  getNotifications = () => {
    let {notifications ,notificationid}  = this.state ;

      api.post('get-member-notification', {id : notificationid})
     .then(response =>
       {
         let notificationslist = response.data[0] || [];
         let today = new Date();
         let daylabel = '';

         notificationslist && notificationslist.map((x, key) => {
          // let dayscount = today.getDate() - new Date(x.createdbydate).getDate();
           let dayscount = getDateDifference(new Date(x.createdbydate),today) - 1;
            if(dayscount == 0)
            {
              daylabel = getFormtedTimeFromJsonDate(x.createdbydate);
            }
            else if(dayscount <= 7)
            {
              let dayname = Weekdays.filter(y => y.value == new Date(x.createdbydate).getDay())[0].short;
              daylabel = dayname + ',' + getFormtedTimeFromJsonDate(x.createdbydate);
            }
            else {
                daylabel = dayscount + ' days ago';
            }

            x.daylabel = daylabel;
         });

            let notificationid = notificationslist.map(x => x.id);
              let loadMore = (notificationslist.length == 0 || notificationslist.length < 10) ? false : true ;

          this.setState({notificationid : Math.min.apply(Math, notificationid),
                        notifications : notifications.concat(notificationslist),
                        loadingScroll : loadMore,
                        notificationcount : 0,
                        loading : false
                  })
        }
     ).catch(error => {this.setState({ loading : false }); console.log(error);} )
  }

  onClickbell()
  {
    const {notifications,dropdownOpen} = this.state;
      if(notifications.length == 0 && !dropdownOpen)
      {
        this.setState({ loading : true });
          this.getNotifications();
      }
  }

  toggle = () => {
    const { dropdownOpen,markallread} = this.state;
    if(dropdownOpen == true && markallread)
    {
       api.post('read-member-notification')
      .then(response =>
        {
           this.setState({notifications:[],notificationid : null,markallread : false});
         }
      ).catch(error =>  console.log(error) )
    }
    this.setState({
      dropdownOpen: !dropdownOpen
    });
  }

  render() {
     const { classes } = this.props;
    const { notificationcount, notifications ,notificationid , loadingScroll ,loading, enableNotifications,markallread} = this.state;


    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} nav className="list-inline-item notification-icon">
        <DropdownToggle nav className="p-0">
          <Tooltip title="Notifications" placement="bottom">
            <IconButton className={notificationcount > 0 ? "shake" : ''} aria-label="bell" onClick={() => this.onClickbell()}>
              <i className="zmdi zmdi-notifications-active"></i>
              <Badge color="danger" className="badge-xs badge-top-right rct-notify">{notificationcount}</Badge>
            </IconButton>
          </Tooltip>
        </DropdownToggle>
        <DropdownMenu right>

        {enableNotifications &&
            <Button variant="contained"  className="bg-primary enable-notifications text-white w-100 pointer"  onClick={()=> askForNotificationPermission() }>
              Enable Push Notifications
            </Button>
        }

          <div className="dropdown-head d-flex justify-content-between">
            <span><IntlMessages id="widgets.recentNotifications" /></span>
          </div>
        <div className="dropdown-head d-flex p-0">
          <div className= "pull-right">
          <Checkbox color="primary"
          checked = {markallread}
          onChange = {(e) => this.setState({ markallread: e.target.checked }) }
           />
          <label className="pr-5" >Mark all as read</label>
          <Tooltip  id="tooltip-top" classes={{ tooltip: classes.customWidth }} disableFocusListener disableTouchListener  title= "Checked means you have read all notifications and not to show it again." placement="bottom-start">
            <a href="#" onClick = {(e) => e.preventDefault()}><i className="fa fa-info-circle mr-10"></i></a>
            </Tooltip>
          </div>
        </div>

        <PerfectScrollbar style={{ height : '290px', width : '100%' }} noScroll = {true}>
          <InfiniteScroll
              style = {!isMobile ? {"marginRight" : "-15px"} : {}}
              dataLength={this.state.notifications.length}
              next={this.getNotifications}
              hasMore={this.state.loadingScroll}
              height = {300}
              loader={<h4 className = {"pl-30"}>Loading....</h4>}
          >
        {loading ? <RctSectionLoader /> :
            <ul className="list-unstyled dropdown-body">
              {notifications.length > 0 ?  notifications.map((notification, key) => (
                <li key={key}>
                  <div className="media">
                    <div className="media-body pt-5">
                      <div className="d-flex justify-content-between">
                        <h5 className="mb-5 text-primary">{unescape(notification.subject)}</h5>
                        <span className="fs-12">{notification.daylabel}</span>
                      </div>
                      <span className="text-muted fs-12 d-block">{unescape(notification.content)}</span>
                      {/*<Button className="btn-default mr-10">
                        <i className="zmdi zmdi-mail-reply"></i> <IntlMessages id="button.reply" />
                      </Button>
                      <Button className="btn-default">
                        <i className="zmdi zmdi-thumb-up"></i> <IntlMessages id="button.like" />
                      </Button>*/}
                    </div>
                  </div>
                </li>
              ))
              :
              (
                     <h5 className = "fw-bold text-center pt-20"> No recent notification.  </h5>
              )

            }
            </ul>
          }
            </InfiniteScroll>
           </PerfectScrollbar>

          {/*<div className="dropdown-foot text-center">
            <a href="javascript:void(0);" className=""><IntlMessages id="button.viewAll" /></a>
          </div>*/}
        </DropdownMenu>
     </Dropdown>
    );
  }
}

export default withStyles(styles)(Notifications);
