
/**
 * Theme Options
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Dropdown from 'reactstrap/lib/Dropdown';
import Checkbox from '@material-ui/core/Checkbox';
import CardActions from '@material-ui/core/CardActions';
import {getFormtedTimeFromJsonDate, getStatusColor, getLocalDate,getCovidRiskStatusColor} from 'Helpers/helpers';
import CustomConfig from 'Constants/custom-config';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import $ from 'jquery';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import Auth from '../../Auth/Auth';
const authObject = new Auth();
import api from 'Api';

class BiometricInOutLogs extends Component {

    state = {
        biometriclogsPanelOpen: false,
        enabledbiometriclogs : localStorage.enabledbiometriclogs ? JSON.parse(localStorage.enabledbiometriclogs) : false,
        biometriclogsdata : []
    }
    componentDidMount()
    {
      if(this.state.enabledbiometriclogs)
      {
        this.setSocket();
      }
    }

    getBadgeCss(obj)
    {
      obj =  Object.assign(({borderRadius : "0.25rem",
        width: "auto",
        height: "auto",
        border: "none"}), obj || {})

        return obj;
    }

    getNewRegistered(createdbydate)
    {
        if(createdbydate && Math.ceil((new Date() - getLocalDate(createdbydate))/(1000 * 3600 * 24)) < 15)
        {
          return "text-success";
        }
        return "";
    }
    getTobeExpired(expirydate)
    {

        if(expirydate)
        {
            let tobeDays = Math.ceil(( getLocalDate(expirydate) - new Date())/(1000 * 3600 * 24));
            if(tobeDays > 0 && tobeDays <= 15)
            {
              return "text-danger";
            }
        }
          return "";
    }

  setSocket()
    {
      let {userProfileDetail} = this.props;
      import('socket.io-client').then(module => {
          this.socket = module.default(CustomConfig.socketurl, { withCredentials : false,query:{socketFor: 'biometric' , userid : userProfileDetail.id,emailid: userProfileDetail.emailid,clientid : userProfileDetail.clientid,branchid :userProfileDetail.defaultbranchid }});
          this.socket.on("swipeDetails", data => {
            let {biometriclogsdata} = this.state;
                 if(data.length > 0 && biometriclogsdata.length > 0 && data.length == biometriclogsdata.length && biometriclogsdata[0].membercode != data[0].membercode){
                    this.setState({
                      biometriclogsdata : data,
                      enabledbiometriclogs : true,
                      biometriclogsPanelOpen : true
                    });
                }
                else if (data.length && data.length != biometriclogsdata.length) {
                      this.setState({
                        biometriclogsdata : data,
                        enabledbiometriclogs : true,
                        biometriclogsPanelOpen : true
                      });
                }
          });
      });
    }
  onChange(key,value)
   {
      if (key == "enabledbiometriclogs")
      {
         if(value == true)
         {
             this.setSocket();
        }
        else if(value == false && this.socket) {
          this.socket.disconnect();
        }

        localStorage.enabledbiometriclogs = value;
        this.setState({
          enabledbiometriclogs : value
        });
      }

  }


    /**
     * Function To Toggle Theme Option Panel
     */
    toggleThemePanel() {
        this.setState({
            biometriclogsPanelOpen: !this.state.biometriclogsPanelOpen
        });
    }
    duesHighlight(days)
    {
        if(days < 0)
        {
              return " text-danger";
        }
        else if(days == 0)
        {
              return " text-success";
        }
        else if(days > 0)
        {
              return " text-primary";
        }
          return "";
    }
    onreload(){
      let branchid = this.props.userProfileDetail.defaultbranchid;
      api.post('view-checkinlogs',{branchid})
    .then(response =>
      {
        let {biometriclogsdata} = this.state;
        let data = response.data[0];
             if(data.length > 0 && biometriclogsdata.length > 0 && data.length == biometriclogsdata.length && biometriclogsdata[0].membercode != data[0].membercode){
                this.setState({
                  biometriclogsdata : data,
                  enabledbiometriclogs : true,
                  biometriclogsPanelOpen : true
                });
            }
            else if (data.length && data.length != biometriclogsdata.length) {
                  this.setState({
                    biometriclogsdata : data,
                    enabledbiometriclogs : true,
                    biometriclogsPanelOpen : true
                  });
            }
      }
    ).catch(error => console.log(error) );
    }

    render() {
        const { swipeDetailslogsdata , clientProfileDetail, userProfileDetail} = this.props;
        const {enabledbiometriclogs,biometriclogsdata} = this.state;
        return (
            <div className="fixed-plugin">
                <Dropdown isOpen={this.state.biometriclogsPanelOpen} toggle={() => this.toggleThemePanel()}>
                    { // location &&  (location.pathname == "/member-app/home" || location.pathname == "/app/dashboard/master-dashboard") &&
                      <DropdownToggle>
                        <Tooltip title="Attendance Logs" placement="left">
                           <i className="fa fa-camera-retro fa-1x tour-step-6"></i>
                        </Tooltip>
                    </DropdownToggle> }
                    <DropdownMenu>
                    <a href="#" className = "pull-right pt-5 pl-15"  onClick={(e) =>{e.preventDefault();this.onreload()}}><i className="ti-reload"></i></a>
                    <ul className="list-unstyled mb-0 text-center">
                    <li className="header-title mb-10">
                    Attendance Check-in Logs
                    </li>
                    <li>
                       <span className ={ enabledbiometriclogs == false ? 'fw-bold' : '' } >Disabled</span>
                        <FormControlLabel
                            className="m-0"
                            control={
                                <Switch
                                    checked={enabledbiometriclogs}
                                    onClick={(e) => this.onChange('enabledbiometriclogs', e.target.checked )}
                                    color="primary"
                                    className="switch-btn"
                                />
                            }
                        />
                      <span className ={ enabledbiometriclogs == true ? 'fw-bold' : '' } >Enabled</span>
                    </li>
                    </ul>

                        <PerfectScrollbar style = {{height : 500}} >
                          {biometriclogsdata && biometriclogsdata.map((data, key) => (
                              <CardActions className="d-flex justify-content-between  py-10" key={"data" + key}>
                              <Link className = "w-100 pointer" to= {userProfileDetail.isTrainer == 1 && clientProfileDetail && clientProfileDetail.packtypeId == 3 ? "/app/members/training-profile?id=" + data.id : "/app/members/member-profile?id=" + data.id} >
                                       <div className="media w-100">
                                           <img src={data.image ? CustomConfig.serverUrl + data.image : CustomConfig.serverUrl + data.memberprofileimage} alt = ""
                                           onError={(e)=>{
                                                let gender = data.genderId || '1';
                                               e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}
                                               className="rounded-circle" width="50" height="50"/>
                                               <div className="media-body pl-5">
                                                 <h5 className={"mb-0 text-capitalize " + this.getNewRegistered(data.createdbydate) + this.getTobeExpired(data.maxexpirydate)}>{data.firstname + " " + data.lastname}</h5>
                                                <div className = "d-flex justify-content-between align-items-center fs-12"> <div> {data.membercode} </div> <div> {getFormtedTimeFromJsonDate(data.date)} </div>  </div>
                                                   <span className= {"ml-5 px-10 py-5 fs-12 badge "}
                                                   ref={(node) => {if (node) {
                                                           node.style.setProperty("padding", "5px 10px", "important");
                                                         }}}
                                                    style={this.getBadgeCss({"backgroundColor": getStatusColor(data.statusId)})}>
                                                     {data.status}
                                                   </span>
                                                   {
                                                     (data.createdbydate && Math.ceil((new Date() - getLocalDate(data.createdbydate))/(1000 * 3600 * 24)) < 15) &&
                                                     <span className= "px-10 py-5 fs-12 badge badge-success"
                                                     ref={(node) => {if (node) {
                                                             node.style.setProperty("padding", "5px 10px", "important");
                                                           }}} style = {this.getBadgeCss()}>
                                                      New
                                                     </span>
                                                   }
                                                   {
                                                    (data.maxexpirydate && Math.ceil(( getLocalDate(data.maxexpirydate) - new Date())/(1000 * 3600 * 24)) <= 15) &&
                                                    <span className= "ml-5 px-10 py-5 fs-12 badge badge-danger" ref={(node) => {if (node) {
                                                            node.style.setProperty("padding", "5px 10px", "important");
                                                          }}} style = {this.getBadgeCss()}>
                                                     Ending Soon
                                                    </span>
                                                   }
                                                   {data.covidrisk &&
                                                   <h5 className = {"pt-10 " + getCovidRiskStatusColor(data.covidriskId)}>COVID-19 RISK STATUS :  {data.covidrisk} </h5>
                                                   }
                                                	{data.duedetails &&
                                                   <div className = "row pt-10">
                                                       <div className="table-responsive">
                                                        <table className="table table-bordered " style={{width:"90%"}}>
                                                        <thead  style={{backgroundColor:"white"}}>
                                                        <tr >
                                          								<th className = "text-center py-5 "> Due Date </th>
                                                          <th className = "text-center py-5"> Due Amount </th>
                                          					 		</tr>
                                                      	{data.duedetails && data.duedetails.map((dues, key) => (
                                                        <tr  key={'dues' + key}>
                                          								<td className = {"text-right py-5" + this.duesHighlight(dues.daysleft)} >{dues.duedate}</td>
                                                          <td className = {" text-right py-5" + this.duesHighlight(dues.daysleft)}>{dues.dueamount} </td>
                                          					 		</tr>
                                                      ))}

                                                        </thead>
                                                        </table>
                                                     </div>
                                                     </div>
                                               }
                                               </div>
                               </div>
                               </Link>
                            </CardActions>
                       ))}
                        </PerfectScrollbar>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}


const mapStateToProps = ({ settings}) => {
  const { userProfileDetail, clientProfileDetail } =  settings;
   return {userProfileDetail, clientProfileDetail}
}

export default connect(mapStateToProps, {

})(BiometricInOutLogs);
