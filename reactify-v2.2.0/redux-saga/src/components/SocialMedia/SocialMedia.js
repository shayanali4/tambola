
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
import {isMobile} from 'react-device-detect';

class SocialMedia extends Component {
  state = {
      themeOptionPanelOpen: false
  }
  toggleThemePanel() {
      this.setState({
          themeOptionPanelOpen: !this.state.themeOptionPanelOpen
      });
  }

    render() {
        const {clientProfileDetail, userProfileDetail,location} = this.props;
        const socialmedia = clientProfileDetail ? clientProfileDetail.socialmedia : null;
        return (
            <div className="fixed-plugin mt-90">
                <Dropdown isOpen={this.state.themeOptionPanelOpen} toggle={() => this.toggleThemePanel()}>
                      { location &&  (location.pathname == "/member-app/home" || location.pathname == "/app/dashboard/master-dashboard") &&
                      socialmedia &&
                      ((socialmedia.facebook && socialmedia.facebook.id) || (socialmedia.instagram && socialmedia.instagram.id) ||
                      (socialmedia.youtube && socialmedia.youtube.id) || (socialmedia.whatsapp && socialmedia.whatsapp.id)) &&
                      <DropdownToggle>
                        <Tooltip title="Social Media" placement="left">
                           <i className="fa fa-share-alt fa-1x tour-step-6"></i>
                        </Tooltip>
                      </DropdownToggle>
                  }
                    <DropdownMenu className ="p-20">
                    {this.state.themeOptionPanelOpen &&
                      <div>
                      	<p >
                        <div>
                        Follow us, we're social! &nbsp;
                        </div>

                        {socialmedia.facebook && socialmedia.facebook.id &&
                          <a href = {socialmedia.facebook.url + socialmedia.facebook.id} target = "_blank">
                            <img src={require('Assets/img/facebook.png') } className="size-40"  />
                          </a>
                        }

                        {socialmedia.instagram && socialmedia.instagram.id &&
                          <a href = {socialmedia.instagram.url + socialmedia.instagram.id}  target = "_blank">
                              <img src={require('Assets/img/instagram.png') } className="size-40"  />
                          </a>
                        }

                        {socialmedia.youtube && socialmedia.youtube.id &&
                          <a href = {socialmedia.youtube.url + socialmedia.youtube.id}  target = "_blank">
                              <img src={require('Assets/img/youtube.png') } className="size-40"  />
                          </a>
                        }

                      </p>

                      {socialmedia && socialmedia.whatsapp && socialmedia.whatsapp.id &&
                        <p>
                          Contact us on &nbsp;

                            <a href = {socialmedia.whatsapp.url + socialmedia.whatsapp.id}  target = "_blank">
                                <img src={require('Assets/img/whatsapp.png') } className="size-40"  />
                            </a>

                        </p>
                      }
                      </div>
                    }
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
})(SocialMedia);
