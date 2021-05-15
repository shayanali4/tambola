/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
// Import React Table

import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import api from 'Api';
import { NotificationManager } from 'react-notifications';
import { getParams } from 'Helpers/helpers';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

class LinkPay extends Component {

	shouldComponentUpdate(nextProps, nextState)
	{

		const {pathname, hash, search} = nextProps.location;
  	if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
  	{
  		return true;
  	}


		return false;
	}
	componentWillMount(){
				if(location.search)
				{
							let params = getParams(location.search);
							if(params && params.request_number)
							{
								let request_number = params.request_number;
								api.post('link-payrequestcheck',{request_number})
							 .then(response =>
								 {
									 document.write(response.data)

									}
							 ).catch(error => {
								 if(error.response){
		               NotificationManager.error(error.response.data.errorMessage);
									 this.props.push("/signin");
		             }
								 console.log(error);})
				}
				else if(params && params.STATUS == "TXN_SUCCESS")
				{
					NotificationManager.success("Online payment done successfully.");
				}
			else if(params && params.STATUS == "TXN_FAILURE")
				{
					NotificationManager.error("Online payment Failed.");
				}
				else{
					NotificationManager.error("If any amount debited please contact to administrative staff.");

				}
			}
}

	render() {


		return (
			<div>
	</div>
	);
  }
  }
	const mapStateToProps = ({settings }) => {
		const {   } =  settings;
	  return {  }
	}

	export default connect(mapStateToProps,{push})(LinkPay);
