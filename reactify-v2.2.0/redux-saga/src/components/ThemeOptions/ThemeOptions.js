
/**
 * Theme Options
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';


import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Dropdown from 'reactstrap/lib/Dropdown';



import FormControlLabel from '@material-ui/core/FormControlLabel';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import $ from 'jquery';
import ChartConfig from 'Constants/chart-config';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';


// redux actions
import {
    toggleSidebarImage,
    setSidebarBgImageAction,
    miniSidebarAction,
    darkModeAction,
    lightModeAction,
    boxLayoutAction,
    rtlLayoutAction,
    changeThemeColor,
    toggleDarkSidebar,
    setUserTheme,
} from 'Actions';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import Auth from '../../Auth/Auth';
const authObject = new Auth();

class ThemeOptions extends Component {

    state = {
        switched: false,
        themeOptionPanelOpen: false
    }
    componentDidMount()
    {
      let profile = this.props.userProfileDetail;
      if(profile)
      {

        if(profile.theme && Object.keys(profile.theme).length > 0)
        {
            this.props.setUserTheme(profile.theme) ;
        }
        else if(this.props.darkMode)
        {
            this.darkModeHanlder(this.props.darkMode);
        }
      }
    }

  componentWillReceiveProps(nextProps)
  {

    if(nextProps && this.props.userProfileDetail && nextProps.userProfileDetail
       && (JSON.stringify(this.props.userProfileDetail.theme) !=  JSON.stringify(nextProps.userProfileDetail.theme)))
    {
      let profile = nextProps.userProfileDetail;
      if(profile && profile.theme)
      {
        this.props.setUserTheme(profile.theme) ;
      }
    }
    else
    {
       if(nextProps && nextProps.activeTheme && nextProps.activeTheme.id != this.props.activeTheme.id)
       {
        if (nextProps.activeTheme.name == "secondary") {
           ChartConfig.color.primary = "#fdabdd" ;
         }
         else{
           ChartConfig.color.primary = "#2e8de1" ;
         }
          this.changeThemeColor(nextProps.activeTheme);
       }
       if(nextProps && nextProps.darkMode)
       {
          this.darkModeHanlder(nextProps.darkMode);
       }
       if(nextProps && nextProps.lightMode && nextProps.lightMode != this.props.lightMode)
       {
          this.lightModeHanlder(nextProps.lightMode);
       }
       if(nextProps && nextProps.miniSidebar && nextProps.miniSidebar != this.props.miniSidebar)
       {
          this.miniSidebarHanlder(nextProps.miniSidebar);
       }
       if(nextProps && nextProps.rtlLayout && nextProps.rtlLayout != this.props.rtlLayout)
       {
          this.rtlLayoutHanlder(nextProps.rtlLayout);
       }
  }
  }

    /**
     * Set Sidebar Background Image
     */
    setSidebarBgImage(sidebarImage) {
        this.props.setSidebarBgImageAction(sidebarImage);
        setTimeout(() => {
          if(this.props.onChange)
          {
            this.props.onChange();
          }
        }, 100);
    }

    /**
     * Function To Toggle Theme Option Panel
     */
    toggleThemePanel() {
        this.setState({
            themeOptionPanelOpen: !this.state.themeOptionPanelOpen
        });
    }

    /**
     * Mini Sidebar Event Handler
    */
    miniSidebarHanlder(isTrue) {
        if (isTrue) {
            $('body').addClass('mini-sidebar');
        } else {
            $('body').removeClass('mini-sidebar');
        }
    }

    /**
     * Dark Mode Event Hanlder
     * Use To Enable Dark Mode
     * @param {*object} event
    */
    darkModeHanlder(isTrue) {
        if (isTrue) {
            $('body').addClass('dark-mode');
        } else {
            $('body').removeClass('dark-mode');
        }

    }

    /**
     * Light Mode Event Hanlder
     * Use To Enable LIGHt Mode
     * @param {*object} event
    */
    lightModeHanlder(isTrue) {
        if (isTrue) {
            $('body').addClass('light-mode');
        } else {
            $('body').removeClass('light-mode');
        }

    }

    /**
     * Box Layout Event Hanlder
     * Use To Enable Boxed Layout
     * @param {*object} event
    */
    boxLayoutHanlder(isTrue) {
        if (isTrue) {
            $('body').addClass('boxed-layout');
        } else {
            $('body').removeClass('boxed-layout');
        }
        this.props.boxLayoutAction(isTrue);
    }

    /**
     * Rtl Layout Event Hanlder
     * Use to Enable rtl Layout
     * @param {*object} event
    */
    rtlLayoutHanlder(isTrue) {
        if (isTrue) {
            $("html").attr("dir", "rtl");
            $('body').addClass('rtl');
          } else {
            $("html").attr("dir", "ltr")
            $('body').removeClass('rtl');
            $('.rtl').removeClass('rtl');
        }
        this.props.rtlLayoutAction(isTrue);
    }

    /**
     * Change Theme Color Event Handler
     * @param {*object} theme
     */
    changeThemeColor(theme) {
      const { themes } = this.props;
        for (const appTheme of themes) {
            if ($('body').hasClass(`theme-${appTheme.name}`)) {
                $('body').removeClass(`theme-${appTheme.name}`);
            }
        }
        $('body').addClass(`theme-${theme.name}`);
   }

    render() {
        const { themes, activeTheme, enableSidebarBackgroundImage, sidebarBackgroundImages, selectedSidebarImage, locale, miniSidebar, darkMode, boxLayout, rtlLayout, navCollapsed, isDarkSidenav, location,lightMode,disabled } = this.props;
        return (
            <div className="fixed-plugin mt-50">
                <Dropdown isOpen={this.state.themeOptionPanelOpen} toggle={() => this.toggleThemePanel()}>
                    { location &&  (location.pathname == "/member-app/home" || location.pathname == "/app/dashboard/master-dashboard") &&<DropdownToggle>
                        <Tooltip title="Theme Options" placement="left">
                            <i className="fa fa-cog fa-1x fa-spin tour-step-6"></i>
                        </Tooltip>
                    </DropdownToggle> }
                    <DropdownMenu>
                    {this.state.themeOptionPanelOpen &&
                      (disabled ?
                        <RctSectionLoader />
                      :
                        <PerfectScrollbar style = {{height : 500}} >
                            <ul className="list-unstyled text-center mb-0">
                                <li className="header-title mb-10">
                                    <IntlMessages id="themeOptions.themeColor" />
                                </li>
                                <li className="adjustments-line mb-10 ">
                                    <a href="javascript:void(0)" >
                                        <div>
                                            {themes.map((theme, key) => (
                                                <Tooltip title={theme.name} placement="top" key={key}>
                                                    <img
                                                        onClick={() =>
                                                          {this.changeThemeColor(theme);
                                                                  this.props.changeThemeColor(theme);

                                                                  setTimeout(() => {
                                                                    if(this.props.onChange)
                                                                    {
                                                                      this.props.onChange();
                                                                    }
                                                                  }, 200);
                                                                  this.setState({themeOptionPanelOpen : false})

                                                        }}
                                                        src={require(`Assets/img/${theme.name}-theme.png`)}
                                                        alt="theme"
                                                        className={classnames('img-fluid mr-5', { 'active': theme.id == activeTheme.id })}
                                                    />
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </a>
                                </li>
                                <li className="header-title sidebar-overlay">
                                    <IntlMessages id="themeOptions.sidebarOverlay" />
                                </li>
                                <li className="sidebar-color">
                                   <span className ={ isDarkSidenav == false ? 'fw-bold' : '' } >  <IntlMessages  id="themeOptions.sidebarLight" /></span>
                                    <FormControlLabel
                                        className="m-0"
                                        control={
                                            <Switch
                                                checked={isDarkSidenav}
                                                onClick={() => {this.props.toggleDarkSidebar();
                                                    setTimeout(() => {
                                                      if(this.props.onChange)
                                                      {
                                                        this.props.onChange();
                                                      }
                                                    }, 200) }}
                                                color="primary"
                                                className="switch-btn"
                                            />
                                        }
                                    />
                                  <span className ={ isDarkSidenav == true ? 'fw-bold' : '' } >  <IntlMessages  id="themeOptions.sidebarDark" /></span>
                                </li>
                                <li className="header-title">
                                    <FormControlLabel
                                        className="m-0"
                                        control={
                                            <Switch
                                                checked={enableSidebarBackgroundImage}
                                                onClick={() => {this.props.toggleSidebarImage();
                                                  setTimeout(() => {
                                                    if(this.props.onChange)
                                                    {
                                                      this.props.onChange();
                                                    }
                                                  }, 200)}}
                                                color="primary"
                                                className="switch-btn"
                                            />
                                        }
                                        label={<IntlMessages id="themeOptions.sidebarImage" />}
                                    />
                                </li>
                                {enableSidebarBackgroundImage &&
                                    <li  className="background-img">
                                        {sidebarBackgroundImages.map((sidebarImage, key) => (
                                            <a className={classnames('img-holder', { 'active': selectedSidebarImage === sidebarImage })} href="javascript:void(0)" key={key} onClick={() => this.setSidebarBgImage(sidebarImage)}>
                                                <img src={sidebarImage} alt="sidebar" className="img-fluid" width="" height="" />
                                            </a>
                                        ))}
                                    </li>
                                }
                            </ul>
                            <ul className="list-unstyled mb-0 p-10 app-settings">
                                <li className="header-title mb-10">
                                    <IntlMessages id="themeOptions.appSettings" />
                                </li>
                                <li className="header-title">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled={navCollapsed}
                                                checked={miniSidebar}
                                                onChange={(e) =>  {this.miniSidebarHanlder(e.target.checked);
                                                this.props.miniSidebarAction(e.target.checked);
                                                setTimeout(() => {
                                                  if(this.props.onChange)
                                                  {
                                                    this.props.onChange();
                                                  }
                                                }, 200)
                                              }}
                                                className="switch-btn"
                                                color="primary"
                                            />
                                        }
                                        label={<IntlMessages id="themeOptions.miniSidebar" />}
                                        className="m-0"
                                    />
                                </li>
                        {/*        <li className="header-title">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={boxLayout}
                                                onChange={(e) => this.boxLayoutHanlder(e.target.checked)}
                                                className="switch-btn"
                                                color="primary"
                                            />
                                        }
                                        label={<IntlMessages id="themeOptions.boxLayout" />}
                                        className="m-0"
                                    />
                                </li>
                                  */}
                               <li className="header-title">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={rtlLayout}
                                                onChange={(e) =>{ this.rtlLayoutHanlder(e.target.checked);
                                                  this.props.rtlLayoutAction(e.target.checked);
                                                  setTimeout(() => {
                                                    if(this.props.onChange)
                                                    {
                                                      this.props.onChange();
                                                    }
                                                  }, 200)
                                                }}
                                                className="switch-btn"
                                                color="primary"
                                            />
                                        }
                                        label={<IntlMessages id="themeOptions.rtlLayout" />}
                                        className="m-0"
                                    />
                                </li>

                                <li className="header-title">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={darkMode}
                                                onChange={(e) => {

                                                       if(e.target.checked)
                                                       {
                                                        this.lightModeHanlder(!e.target.checked);
                                                       }
                                                       this.darkModeHanlder(e.target.checked);

                                                        this.props.darkModeAction(e.target.checked);
                                                        setTimeout(() => {
                                                          if(this.props.onChange)
                                                          {
                                                            this.props.onChange();
                                                          }
                                                        }, 200)
                                                        }}
                                                className="switch-btn"
                                                color="primary"
                                            />
                                        }
                                        label={<IntlMessages id="themeOptions.darkMode" />}
                                        className="m-0"
                                    />
                                </li>
                                <li className="header-title">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={lightMode}
                                                onChange={(e) => {

                                                  if(e.target.checked)
                                                  {
                                                    this.darkModeHanlder(!e.target.checked);
                                                  }
                                                  this.lightModeHanlder(e.target.checked);

                                                        this.props.lightModeAction(e.target.checked);
                                                        setTimeout(() => {
                                                          if(this.props.onChange)
                                                          {
                                                            this.props.onChange();
                                                          }
                                                        }, 200)
                                                        }}
                                                className="switch-btn"
                                                color="primary"
                                            />
                                        }
                                        label={<IntlMessages id="themeOptions.lightMode" />}
                                        className="m-0"
                                    />
                                </li>
                            </ul>
                        </PerfectScrollbar>)}
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ settings }) => {
    const { themes, activeTheme, enableSidebarBackgroundImage, sidebarBackgroundImages, selectedSidebarImage, locale, miniSidebar, darkMode, boxLayout, rtlLayout, navCollapsed, isDarkSidenav,lightMode,disabled } = settings;
    return { themes, activeTheme, enableSidebarBackgroundImage, sidebarBackgroundImages, selectedSidebarImage, locale, miniSidebar, darkMode, boxLayout, rtlLayout, navCollapsed, isDarkSidenav,lightMode,disabled };
};

export default connect(mapStateToProps, {
    toggleSidebarImage,
    setSidebarBgImageAction,
    miniSidebarAction,
    darkModeAction,
    lightModeAction,
    boxLayoutAction,
    rtlLayoutAction,
    changeThemeColor,
    toggleDarkSidebar,
    setUserTheme,

})(ThemeOptions);
