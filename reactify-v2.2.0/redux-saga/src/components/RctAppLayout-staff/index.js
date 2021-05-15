/**
 * App Routes
 */
import React, { Component, PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Sidebar from 'react-sidebar';
import $ from 'jquery';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import classnames from 'classnames';

// Components
import Header from 'Components/Header-staff/Header';
import SidebarContent from 'Components/Sidebar-staff';
import Footer from 'Components/Footer-staff/Footer';
//import Tour from 'Components/Tour';
import ThemeOptions from 'Components/ThemeOptions/ThemeOptions';

//import BiometricInOutLogs from 'Components/BiometricInOutLogs/BiometricInOutLogs';
// import SocialMedia from 'Components/SocialMedia/SocialMedia';

// preload Components
import PreloadHeader from 'Components/PreloadLayout/PreloadHeader';
import PreloadSidebar from 'Components/PreloadLayout/PreloadSidebar';

// app config
import AppConfig from 'Constants/AppConfig';
import {isMobile} from "react-device-detect";
// actions
import { collapsedSidebarAction, startUserTour, saveUserTheme ,getUserProfile, getClientProfile, getSessionTypeList,getBranchProfile } from 'Actions';
import { push } from 'connected-react-router';
import { NotificationManager } from 'react-notifications';
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';
// import EditStatus from './EditStatus';
// import SubscriptionFollowup from './SubscriptionFollowup';
// import ConsultationNote from './ConsultationNote';
// import Disclaimer from './Disclaimer';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';


class SidebarComponent extends PureComponent
{
  render()
  {
    const { userProfileDetail, clientProfileDetail,isbranchprofileupdated } = this.props;

    if (!(userProfileDetail && userProfileDetail.modules && clientProfileDetail && isbranchprofileupdated == 1)) {
        return <PreloadSidebar  />;
    }
    return <SidebarContent userProfileDetail = {userProfileDetail}  clientProfileDetail = {clientProfileDetail}/>
  }
}
class MainApp extends Component {

    state = {
        loadingHeader: true
        }


    componentWillMount()
    {
      this.updateDimensions();
      this.props.getClientProfile();
      this.props.getUserProfile();
    }

    componentDidMount() {
      const { userProfileDetail, clientProfileDetail,isbranchprofileupdated } = this.props;
      if ((userProfileDetail && userProfileDetail.modules && clientProfileDetail && isbranchprofileupdated == 1)) {
          if(isMobile)
          {
            $('#rct-page-content').parent()[0].setAttribute('id','rct-page-content-parrent' );
          }
          else {
            $('#rct-page-content').parent().parent()[0].setAttribute('id','rct-page-content-parrent' );
           }
     }
        const { windowWidth } = this.state;
        window.addEventListener("resize", this.updateDimensions);
        if (AppConfig.enableUserTour && windowWidth > 600) {
            setTimeout(() => {
                this.props.startUserTour();
            }, 2000);
        }
        setTimeout(() => {
            this.setState({ loadingHeader: false });
        }, 114);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    componentWillReceiveProps(nextProps) {
        const { windowWidth } = this.state;

        if (nextProps.location !== this.props.location) {
            if (windowWidth <= 1199) {
                this.props.collapsedSidebarAction(false);
            }
            if(nextProps.location.pathname != "/app/terms-condition" && nextProps.location.pathname != "/app/covid19staffdisclaimerform"){

              let profile = nextProps.userProfileDetail || this.props.userProfileDetail;
              let clientProfile = nextProps.clientProfileDetail || this.props.clientProfileDetail;

                if(profile && (profile.rolealias == 'systemadmin' || profile.rolealias == 'gymowner' ) &&  profile.agreedate == null){
                      this.props.push('/app/terms-condition');
                }
                else if ((profile && clientProfile) && (clientProfile.enablecovid19disclaimertostaff == 1 && profile.isSaveCovid19Disclaimer == 0)) {
                      this.props.push('/app/covid19staffdisclaimerform');
                    }
          }
        }
        else if ((nextProps.userProfileDetail != this.props.userProfileDetail) || (nextProps.clientProfileDetail != this.props.clientProfileDetail)) {
          let profile = nextProps.userProfileDetail || this.props.userProfileDetail;
          let clientProfile = nextProps.clientProfileDetail ||  this.props.clientProfileDetail;
           if(profile && clientProfile){
            profile.isSaveCovid19Disclaimer  = profile.last_covid19submitdate != null ? (profile.last_covid19submitdate <= clientProfile.covid19daysconfig ? 1 : 0) : 0 ;

              if(this.props.userProfileDetail)
              {
                  this.props.userProfileDetail.isSaveCovid19Disclaimer = profile.isSaveCovid19Disclaimer;
              }
           }
            if(profile && (profile.rolealias == 'systemadmin' || profile.rolealias == 'gymowner' ) &&  profile.agreedate == null){
             this.props.push('/app/terms-condition');
           }
          else if ((profile && clientProfile) && (clientProfile.enablecovid19disclaimertostaff == 1 && profile.isSaveCovid19Disclaimer == 0)) {
            this.props.push('/app/covid19staffdisclaimerform');
          }
          if (nextProps.clientProfileDetail != this.props.clientProfileDetail && nextProps.isbranchprofileupdated != 1) {

           this.props.getBranchProfile();
         }
        }
  }

    updateDimensions = () => {
        this.setState({ windowWidth: $(window).width(), windowHeight: $(window).height() });
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    renderPage() {
        const { pathname } = this.props.location;
        const { children ,userProfileDetail, clientProfileDetail,isbranchprofileupdated} = this.props;
        if ((userProfileDetail && userProfileDetail.modules && clientProfileDetail && isbranchprofileupdated == 1)) {
            if (pathname === '/app/chat' || pathname.startsWith('/app/mail') || pathname === '/app/todo') {
                return (
                    <div className="rct-page-content">
                        {children}
                    </div>
                );
            }
      }
        if ((userProfileDetail && userProfileDetail.modules && clientProfileDetail && isbranchprofileupdated == 1)) {
        return (
                <div className="rct-page-content"  id = "rct-page-content">
                    {children}
                  {/*  <Footer />*/}
                </div>

        );
      }
      else{
          <RctPageLoader />
      }
    }

    // render header
    renderHeader() {

      const { history, location } = this.props;

        const { loadingHeader } = this.state;
        if (loadingHeader) {
            return <PreloadHeader />;
        }
        return <Header  history = {history} location = {location} />
    }

    //Scrollbar height
    getScrollBarStyle() {
        return {
            height: 'calc(100vh - 65px)'
        }
    }

    render() {
        const { navCollapsed, rtlLayout, miniSidebar ,userProfileDetail, clientProfileDetail,isbranchprofileupdated} = this.props;
        const { windowWidth } = this.state;
        const { history, location } = this.props;
        return (
            <div className="app">
                <div className="app-main-container">
                    {/*    <Tour />*/}
                    <Sidebar
                        sidebar={<SidebarComponent  userProfileDetail = {userProfileDetail} clientProfileDetail = {clientProfileDetail} isbranchprofileupdated = {isbranchprofileupdated}/>}
                        open={windowWidth <= 1199 ? navCollapsed : false}
                        docked={windowWidth > 1199 ? !navCollapsed : false}
                        pullRight={rtlLayout}
                        onSetOpen={() => this.props.collapsedSidebarAction(!navCollapsed)}
                        styles={{ content: { overflowY: '' }, sidebar : {zIndex : 4} , overlay : {zIndex : 3} ,  dragHandle : {zIndex : 3} }}
                        contentClassName={classnames({ 'app-conrainer-wrapper': miniSidebar })}
                    >
                        <div className="app-container bg-grdnt-violet">
                            <div className="rct-app-content">
                                <div className="app-header">
                                    {this.renderHeader()}
                                </div>

                                <PerfectScrollbar style={this.getScrollBarStyle()}>
                                <div className="rct-page">
                                    {this.renderPage()}
                                    
                                </div>
                                </PerfectScrollbar>
                            </div>
                        </div>
                    </Sidebar>

                    {/*

                    {userProfileDetail && userProfileDetail.isbiometriclogs == 1 &&
                       <BiometricInOutLogs />
                    }

                    <ThemeOptions location = {location}  history = {history}  onChange = {() => this.props.saveUserTheme()} userProfileDetail ={userProfileDetail}/>
                    <SocialMedia location = {location}  history = {history} />
                    {location &&  (location.pathname == "/member-app/home" || location.pathname == "/app/dashboard/master-dashboard") &&  isMobile && clientProfileDetail &&
                      <div className="fixed-plugin add-button mt-140">
                          <Tooltip title= {"Install " + (clientProfileDetail.brandedapp == 1 ? (clientProfileDetail.organizationbrandname || clientProfileDetail.organizationname) : "Fitness Pro League")} placement="left">
                              <i className = "fa fa-download pr-10 text-white"></i>
                          </Tooltip>
                     </div>
                    }
                    */}
                </div>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ settings }) => {
    const { navCollapsed, rtlLayout, miniSidebar, userProfileDetail, clientProfileDetail,isbranchprofileupdated } = settings;
    return { navCollapsed, rtlLayout, miniSidebar,userProfileDetail, clientProfileDetail ,isbranchprofileupdated};
}

export default withRouter(connect(mapStateToProps, {
    collapsedSidebarAction,
    startUserTour,
    saveUserTheme,
    push,
  	getUserProfile,getClientProfile,getSessionTypeList,getBranchProfile
})(MainApp));
