/**
 * Footer
 */
import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

// intl messages
import IntlMessages from 'Util/IntlMessages';
// app config
import AppConfig from 'Constants/AppConfig';
import GoogleTranslate from 'Components/GoogleTranslate';
import GoogleTranslateClear from 'Components/GoogleTranslate/clear';

const Footer = () =>
{

return (
	<div className="rct-footer d-flex justify-content-between align-items-center">
	<ul className="list-inline footer-menus mb-0">
			<li className="list-inline-item">
				<Button component={Link} to="/member-app/home"><IntlMessages id="sidebar.gettingStarted" /></Button>
			</li>
				{/*
			<li className="list-inline-item">
				<Button component={Link} to="/app/about-us"><IntlMessages id="sidebar.aboutUs" /></Button>
			</li>
			<li className="list-inline-item">
				<Button component={Link} to="/app/pages/faq"><IntlMessages id="sidebar.faq(s)" /></Button>
			</li>
			<li className="list-inline-item">
				<Button component={Link} to="/terms-condition"><IntlMessages id="sidebar.terms&Conditions" /></Button>
			</li>*/}
			<li className="list-inline-item">
				<Button component={Link} to="/member-app/member-feedback"><IntlMessages id="sidebar.feedback" /></Button>
			</li>
			<li className="list-inline-item">
			<div className = "d-flex" style ={{ alignItems : 'center'}}>
				<GoogleTranslate />
				<GoogleTranslateClear />
			</div>
				</li>
		</ul>
		<h5 className="mb-0"> <a href={AppConfig.brandUrl} target = "_blank">{AppConfig.brandName}<sup style = {{'fontSize' : '50%'}}>TM</sup>{AppConfig.copyRightText}</a>
		 &nbsp;&nbsp; {__VERSION__}&nbsp;
		<a href={window.location.href} > Update </a>
		 </h5>

	</div>
);
}

export default Footer;
