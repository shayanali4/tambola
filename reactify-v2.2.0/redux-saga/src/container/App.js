/**
 * App.js Layout Start Here
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Redirect, Route } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import CustomConfig from 'Constants/custom-config';
import api from 'Api';
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';
import asyncComponent from 'Components/AsyncComponent/AsyncComponent';
import ErrorHandler from 'Components/ErrorHandler/ErrorHandler.js';
// rct theme provider
import RctThemeProvider from './RctThemeProvider';

function getParams(search)
{
  var a = search.split("&");
  var o = a.reduce(function(o, v) {
    var kv = v.split("=");
    kv[0] = kv[0].replace("?", "");
    o[kv[0]] = kv[1];
    return o;
    },
  {});

return o;
}


const MainApp = asyncComponent(() =>
    import('Routes').then(module => module.default)
);
const AppSignIn = asyncComponent(() =>
    import('./SigninFirebase').then(module => module.default)
);

const GamePage = asyncComponent(() =>
    import('./gamepage').then(module => module.default)
);

const AppSignUp = asyncComponent(() =>
    import('./SignupFirebase').then(module => module.default)
);


import {getClientId } from 'Helpers/helpers';


// async components
import {
	AsyncSessionLoginComponent,

} from 'Components/AsyncComponent/AsyncComponent';

//Auth0
import Auth from '../Auth/Auth';

// callback component
//import Callback from "Components/Callback/Callback";

//Auth0 Handle Authentication
const auth = new Auth();

/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */
const InitialPath = ({ component: Component, authUser, ...rest }) =>
	<Route
		{...rest}
		render={props =>
			authUser
				? <Component {...props} />
				: <Redirect
					to={{
						pathname: '/signin',
						state: { from: props.location }
					}}
				/>}
	/>;

class App extends Component {

  refresh_token()
  {
    let requestData = new URLSearchParams();
    requestData.append('client_id', localStorage.getItem('url_id'));
    requestData.append('client_secret', localStorage.getItem('url_id'));
    requestData.append('grant_type' , 'refresh_token');
    requestData.append('refresh_token', localStorage.getItem('refresh_token'));

    api.post('oauth/token', requestData)
      .then(({data}) => {
        data.clientId = localStorage.getItem('url_id');
        auth.setSession(data);
        this.forceUpdate();
      }).catch(error => auth.logout() )
  }



	render() {
		const { location, match, user ,logintype} = this.props;
    let isAuthenticated = auth.isAuthenticated();
    let clientId = getClientId();

	   if (location.pathname === '/') {


      if(user === null)
			{
				return (<Redirect to={'/gamepage'} />);
			}
			 else if(isAuthenticated) {
				 if(logintype == 1)
				 {
             return (<Redirect to={'/member-app/home'} />);

				 }

				 else {
				 			return (<Redirect to={'/app/dashboard'} />);
				 }
			 }
       else {

             this.refresh_token();
              return (<RctPageLoader />);
          }
		}
    else if((location.pathname.indexOf("/member-app") > -1 || location.pathname.indexOf("/app") > -1) && user === null && clientId) {
      return (<Redirect to={'/signin'} />);
    }
    else if(location.pathname.indexOf("/app") > -1 && logintype == 1  && clientId) {
      return (<Redirect to={'/member-app/home'} />);
    }
    else if(location.pathname.indexOf("/member-app") > -1 && logintype == 0  && clientId) {
      return (<Redirect to={'/app'} />);
    }
    else if(!isAuthenticated && (location.pathname.indexOf("/app") > -1  || location.pathname.indexOf("/member-app") > -1))
    {
      this.refresh_token();
      return (<RctPageLoader />);
    }

		return (
      <RctThemeProvider>
      		<NotificationContainer />
      <ErrorHandler>

				{	clientId && logintype == 0 &&	<InitialPath
					path={`${match.url}app`}
					authUser={user}
					component={MainApp}
					/>
				}


				<Route path="/signin" component={AppSignIn} />
        <Route path="/gamepage" component={GamePage} />
      </ErrorHandler>
      </RctThemeProvider>

		);
	}
}

// map state to props
const mapStateToProps = ({ authUser }) => {
	const { user ,logintype} = authUser;
	return { user ,logintype};
};

export default connect(mapStateToProps)(App);
