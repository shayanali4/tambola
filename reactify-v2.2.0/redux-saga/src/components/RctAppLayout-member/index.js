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
import Header from 'Components/Header-member/Header';
import SidebarContent from 'Components/Sidebar-member';
import Footer from 'Components/Footer-member/Footer';
import ThemeOptions from 'Components/ThemeOptions/ThemeOptions';
import SocialMedia from 'Components/SocialMedia/SocialMedia';

// preload Components
import PreloadHeader from 'Components/PreloadLayout/PreloadHeader';
import PreloadSidebar from 'Components/PreloadLayout/PreloadSidebar';

// app config
import AppConfig from 'Constants/AppConfig';
import { push } from 'connected-react-router';
// actions
import { collapsedSidebarAction, startUserTour,saveMemberTheme, getMemberProfile ,getClientProfile, getSessionTypeList,getBranchProfile} from 'Actions';
import { isMobile} from "react-device-detect";
//render Sidebar
import { NotificationManager } from 'react-notifications';
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

class SidebarComponent extends PureComponent
{
  render()
  {
    const { memberProfileDetail, clientProfileDetail,isbranchprofileupdated } = this.props;

    if (!(memberProfileDetail && clientProfileDetail && isbranchprofileupdated == 1)) {
        return <PreloadSidebar  />;
    }
    return <SidebarContent memberProfileDetail = {memberProfileDetail}  clientProfileDetail = {clientProfileDetail}/>
  }
}


class MainApp extends Component {

    state = {
        loadingHeader: true
    }

componentWillMount()
{
  this.updateDimensions();
  this.props.getMemberProfile();
  this.props.getClientProfile();
  this.props.getSessionTypeList();
}

    componentDidMount() {
      const { memberProfileDetail, clientProfileDetail,isbranchprofileupdated } = this.props;
      if ((memberProfileDetail && clientProfileDetail && isbranchprofileupdated == 1)) {
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
            if(nextProps.location.pathname != "/member-app/setting" && nextProps.location.pathname != "/member-app/disclaimerform" && nextProps.location.pathname != "/member-app/covid19disclaimerform")
            {
              let profile = this.props.memberProfileDetail;
              let clientProfile = this.props.clientProfileDetail;
                if ((profile && clientProfile) && (clientProfile.enablecovid19disclaimertomember == 1 && profile.isSaveCovid19Discalaimer == 0)) {
                  this.props.push('/member-app/covid19disclaimerform');
                }
                else if(profile && (profile.gender == null || profile.dateofbirth  == null || profile.weight  == null || profile.height  == null)){
                  this.props.push('/member-app/setting');
                  NotificationManager.error("Please update profile detail.");
                }
                else if ((profile && clientProfile) && (clientProfile.enabledisclaimertomember == 1 && profile.isSubmitedDisclaimer == 0)) {
                  this.props.push('/member-app/disclaimerform');
                }

              }
        }
        else if ((nextProps.memberProfileDetail != this.props.memberProfileDetail) || (nextProps.clientProfileDetail != this.props.clientProfileDetail)) {
          let profile = nextProps.memberProfileDetail || this.props.memberProfileDetail;
          let clientProfile = nextProps.clientProfileDetail ||  this.props.clientProfileDetail;
          if(profile && clientProfile){
           profile.isSaveCovid19Discalaimer  = profile.lastSaveCovid19Discalaimer != null ? (profile.lastSaveCovid19Discalaimer <= clientProfile.covid19daysconfig ? 1 : 0) : 0 ;
             if(this.props.memberProfileDetail)
             {
               this.props.memberProfileDetail.isSaveCovid19Discalaimer = profile.isSaveCovid19Discalaimer;
             }
          }
          if ((profile && clientProfile) && (clientProfile.enablecovid19disclaimertomember == 1 && profile.isSaveCovid19Discalaimer == 0)) {
            this.props.push('/member-app/covid19disclaimerform');
          }
          else if((nextProps.memberProfileDetail != this.props.memberProfileDetail) && profile && (profile.gender == null || profile.dateofbirth  == null || profile.weight  == null || profile.height  == null)){
            this.props.push('/member-app/setting');
            NotificationManager.error("Please update profile detail.");
          }
          else if ((profile && clientProfile) && (clientProfile.enabledisclaimertomember == 1 && profile.isSubmitedDisclaimer == 0)) {
            this.props.push('/member-app/disclaimerform');
          }
          if (nextProps.clientProfileDetail != this.props.clientProfileDetail && nextProps.isbranchprofileupdated != 1 ) {
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
        const { children ,memberProfileDetail, clientProfileDetail,isbranchprofileupdated} = this.props;
        if ((memberProfileDetail && clientProfileDetail && isbranchprofileupdated == 1)) {
          return (
                  <div className="rct-page-content "  id = "rct-page-content">
                      {children}
                      <Footer />
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
        const { navCollapsed, rtlLayout, miniSidebar, memberProfileDetail, clientProfileDetail,isbranchprofileupdated } = this.props;
        const { windowWidth } = this.state;

        const { history, location } = this.props;

        return (
            <div className="app">
                <div className="app-main-container">
                  {/*    <Tour />*/}
                    <Sidebar
                        sidebar={<SidebarComponent  memberProfileDetail = {memberProfileDetail}  clientProfileDetail = {clientProfileDetail} isbranchprofileupdated = {isbranchprofileupdated}/>}
                        open={windowWidth <= 1199 ? navCollapsed : false}
                        docked={windowWidth > 1199 ? !navCollapsed : false}
                        pullRight={rtlLayout}
                        onSetOpen={() =>  this.props.collapsedSidebarAction(!navCollapsed) }
                        styles={{ content: { overflowY: '' },  sidebar : {zIndex : 4} , overlay : {zIndex : 3} ,  dragHandle : {zIndex : 3} }}
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

                  <ThemeOptions location = {location}  history = {history} onChange = {() => this.props.saveMemberTheme()} userProfileDetail ={memberProfileDetail}/>
                  <SocialMedia location = {location}  history = {history} />
                  {location &&  (location.pathname == "/member-app/home" || location.pathname == "/app/dashboard/master-dashboard") && isMobile && clientProfileDetail &&
                    <div className="fixed-plugin mt-140 add-button">
                        <Tooltip title= {"Install " + (clientProfileDetail.brandedapp == 1 ? (clientProfileDetail.organizationbrandname || clientProfileDetail.organizationname) : "Fitness Pro League")} placement="left">
                            <i className = "fa fa-download pr-10 text-white"></i>
                        </Tooltip>
                   </div>
                  }
                </div>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ settings }) => {
    const  { navCollapsed, rtlLayout, miniSidebar, memberProfileDetail, clientProfileDetail,isbranchprofileupdated } = settings;

    return  { navCollapsed, rtlLayout, miniSidebar, memberProfileDetail , clientProfileDetail,isbranchprofileupdated};
}

export default withRouter(connect(mapStateToProps, {
    collapsedSidebarAction,
    startUserTour,
    saveMemberTheme,
    push,
    getMemberProfile,
    getClientProfile,
    getSessionTypeList,
    getBranchProfile
})(MainApp));
