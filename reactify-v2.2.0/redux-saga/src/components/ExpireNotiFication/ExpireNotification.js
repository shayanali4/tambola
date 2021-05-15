21
/**
 * Theme Options
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {getDateDifference,getFormtedDate,getLocalDate,setLocalDate,compareDates} from 'Helpers/helpers';

class ExpireNotification extends Component {
    state = {
        open: false,
    }
    componentDidMount(){
            this.onOpen();
    }
    componentWillReceiveProps(nextProps){
          if((this.props.clientProfileDetail != nextProps.clientProfileDetail) || (this.props.userProfileDetail != nextProps.userProfileDetail)){
            const clientProfileDetail = nextProps.clientProfileDetail || this.props.clientProfileDetail;
            const userProfileDetail = nextProps.userProfileDetail || this.props.userProfileDetail;
            this.onOpen(clientProfileDetail,userProfileDetail);
          }
    }
    onOpen(clientProfileDetail,userProfileDetail){
      let expirydatenotification =  localStorage.getItem('Expirydate_notification');
      let logintype = localStorage.getItem('login_type');
          if(!expirydatenotification || (!compareDates(new Date(expirydatenotification),getLocalDate(new Date())))) {
              clientProfileDetail = clientProfileDetail == undefined  ? this.props.clientProfileDetail : clientProfileDetail;
              userProfileDetail   = userProfileDetail ==  undefined ? this.props.userProfileDetail : userProfileDetail;

            if(clientProfileDetail && userProfileDetail){
            const datediff = Math.abs(getDateDifference(getLocalDate(new Date()),getLocalDate(clientProfileDetail.expirydate)));

            if(userProfileDetail.rolealias == 'gymowner' && (clientProfileDetail.billingtypeId == 1 ? datediff <= 5 : datediff <= 30)){
              this.setState({open : true});
            }
            else if (userProfileDetail.rolealias == 'systemadmin' && (clientProfileDetail.billingtypeId == 1 ? datediff <= 3 : datediff <= 15)) {
              this.setState({open : true});
            }
            else if ((clientProfileDetail.billingtypeId == 1 ? datediff <= 1 : datediff <= 7) && logintype == 0) {
              this.setState({open : true});
            }
          }
      }
  }
    onClose(){
      localStorage.setItem('Expirydate_notification', getLocalDate(new Date()).toJSON());
      this.setState({open : false});
    }

    render() {
        const {open} = this.state;
        const { clientProfileDetail} = this.props;
        let datediff = 0;
        if(clientProfileDetail){
           datediff = Math.abs(getDateDifference(getLocalDate(new Date()),clientProfileDetail.expirydate));
        }

        return (
          <div>
                  {clientProfileDetail && clientProfileDetail.expirydate!= null && datediff <= 30 && open == true &&
                          <div className="d-flex justify-content-between px-10 text-white rounded py-2 mb-20 bg-danger ">
                                  <div className ="pr-10">
                                  {datediff == 1 ?
                                             <p> {"Your account will be deactivated today. Please contact on 8980906939 for your renewal."}</p>
                                              :
                                             <p> Dear Valued Customer , <br/><span className = "ml-10"> {"You have " + datediff + " days to renew your account. Your account will be active till " + getFormtedDate(clientProfileDetail.expirydate) + ". Please contact on 8980906939 for your renewal."} </span></p>
                                  }
                                  </div>
                                  <div>
                                       <a href="#" className = "text-white pull-right" onClick={(e) => {e.preventDefault(); this.onClose();} }>  <i className="ti-close" ></i></a>
                                  </div>
                         </div>
                 }
         </div>
        );
    }
}
const mapStateToProps = ({ settings}) => {
  const {  clientProfileDetail,userProfileDetail } =  settings;
   return { clientProfileDetail,userProfileDetail}
}

export default connect(mapStateToProps, {
})(ExpireNotification);
