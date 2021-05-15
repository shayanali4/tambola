
import React, { Component } from 'react';
import { connect } from 'react-redux';


import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import api from 'Api';
import { getParams } from 'Helpers/helpers';
//Auth File
import Auth from '../Auth/Auth';

const auth = new Auth();

export default class oauthcallback extends Component {

  componentWillMount()
  {
    let url_id = '';
    let client_type = '';
    let isgooglecalendar= '';
    if(location.search)
    {
      let params = getParams(location.search);
      url_id = params && params.url_id ? params.url_id : '';
      client_type = params && params.client_type ? params.client_type : '';
      isgooglecalendar = params && params.isgooglecalendar ? params.isgooglecalendar : 0;
    }
    
     if(url_id && client_type)
     {
         localStorage.setItem('old_client', JSON.stringify({url_id , client_type, isgooglecalendar}));
         api.post('get-google-api',{isgooglecalendar})
        .then(response =>
          {
                if(response && response.data)
                {
                  location.href = response.data.url;
                }
           }
        ).catch(error => console.log(error) )
     }
  }

	render() {

		return (
		      <div>
          	<RctCollapsibleCard fullBlock>
                <LinearProgress/>
             </RctCollapsibleCard>
          </div>
		);
	}
}
