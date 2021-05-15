
  import React, { Component } from 'react';

  // Components
  import AddBrandingImages from './component/AddBrandingImages';
  // rct card box
  import { RctCard } from 'Components/RctCard';

  // page title bar
  import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

  // intl messages
  import IntlMessages from 'Util/IntlMessages';


  export default class Branding extends Component {

    handleChange = (event, value) => {

      this.setState({ activeTab: value });
    }

    shouldComponentUpdate(nextProps, nextState)
  	{

  		const {pathname, hash, search} = nextProps.location;
  	if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
  	{
  		return true;
  	}


  		return false;
  	}

    render() {
      return (
        <div className="userProfile-wrapper">
          <PageTitleBar title={<IntlMessages id="sidebar.branding" />} match={this.props.match} />
          <RctCard>
                  <AddBrandingImages/>
          </RctCard>
        </div>
      );
    }
  }
