

import CustomConfig from 'Constants/custom-config';
import {getClientURL,getLocalDate} from 'Helpers/helpers';
import Gender from 'Assets/data/gender';


export default class Auth {

  constructor() {
    this.login= this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.setSession = this.setSession.bind(this);
  }

setSession(authResult) {
    let expiresAt = JSON.stringify(((authResult.expires_in - 60) * 1000) + new Date().getTime());

    localStorage.setItem('user_id', authResult.access_token);
    if(authResult.loginType != undefined)
    {
      localStorage.setItem('login_type', authResult.loginType);
      localStorage.setItem('client_type', authResult.clientType);
    }
    localStorage.setItem('url_id', authResult.clientId);
    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('refresh_token', authResult.refresh_token);
    localStorage.setItem('expires_at', expiresAt);

  }

  getToken() {
      return 'Bearer ' + localStorage.getItem('access_token');
    }

  login({clientId,clientType,path})
  {
        path = path ? path : '';
        window.location.replace(location.protocol +'//'+ clientId + '.' + getClientURL(clientType) + path);
  }

  signup()
  {
        window.location.replace(location.protocol +'//' + CustomConfig.domainName  + '/signup');
  }



  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('user_id');
    localStorage.removeItem('login_type');
    localStorage.removeItem('client_type');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user_profile');
    localStorage.removeItem('client_profile');
    window.location.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  setProfile(userResult) {
      if(userResult)
      {
        if(userResult && localStorage.getItem('user_defaultbranchid'))
        {
          userResult.defaultbranchid = localStorage.getItem('user_defaultbranchid');
          userResult.defaultbranchname = localStorage.getItem('user_defaultbranchname');
        }
        else {
          localStorage.setItem('user_defaultbranchid' , userResult.defaultbranchid);
            localStorage.setItem('user_defaultbranchname' , userResult.defaultbranchname);
        }
        localStorage.setItem('client_timezoneoffsetvalue', userResult.timezoneoffsetvalue ? userResult.timezoneoffsetvalue : 330);
        let profile = JSON.stringify(userResult);
        localStorage.setItem('user_profile', profile);
      }
    }

    getProfile() {
        let profile = localStorage.getItem('user_profile');
        profile =  JSON.parse(profile) || null;
        if(profile && localStorage.getItem('user_defaultbranchid'))
        {
          profile.defaultbranchid = localStorage.getItem('user_defaultbranchid');
          profile.defaultbranchname = localStorage.getItem('user_defaultbranchname');
        }
        return profile;
      }


      setClientProfile(clientResult) {
          if(clientResult)
          {
            localStorage.setItem('client_currency', clientResult.currency ? unescape(clientResult.currency) : '₹');
            let clientprofile = JSON.stringify(clientResult);
            localStorage.setItem('client_profile', clientprofile);
          }
        }
      getClientProfile() {
          let clientprofile = localStorage.getItem('client_profile');
          clientprofile =  JSON.parse(clientprofile) || null;
          return clientprofile;
        }


        setMasterDashboardChartData(chartdata,modulename,componentname,minutes) {
            if(chartdata)
            {
              let data = {};
              let currentdate = new Date();
              data.expirydate = new Date(currentdate.setMinutes(currentdate.getMinutes() + minutes));
              data.data = chartdata;
              data = JSON.stringify(data);
              localStorage.setItem(modulename + '_' + componentname , data);
            }
          }


          getMasterDashboardChartData(modulename,componentname) {
              let data = localStorage.getItem(modulename + '_' + componentname);
              data = JSON.parse(data);
              if(data && data.expirydate && new Date(data.expirydate) > new Date())
              {
                data =  data.data || null;
              }
              else {
                data = null;
              }
              return data;
            }


}
