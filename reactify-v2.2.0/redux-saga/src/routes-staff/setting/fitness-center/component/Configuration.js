
/**
 * Profile Page
 /**
  * User Profile Page
  */
 import React, {Fragment, Component } from 'react';
 import AppBar from '@material-ui/core/AppBar';
 import Tabs from '@material-ui/core/Tabs';
 import Tab from '@material-ui/core/Tab';
 import Typography from '@material-ui/core/Typography';

 // Components
 import BasicConfiguration from './BasicConfiguration';
 import PaymentGateway from './PaymentGateway';

 // rct card box
 import { RctCard } from 'Components/RctCard';

// For Tab Content
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class Configuration extends Component {
  state = {
     activeTab: 0
   }

   handleChange = ( value) => {
     this.setState({ activeTab: value });
   }


  render() {
    const { activeTab } = this.state;
    const {updateRights,addRights , clientProfileDetail} = this.props;
    return (

      <div className="userProfile-wrapper" style = {{"margin" : "-10px -24px 0 -24px"}}>
        <RctCard>
          <div className="rct-tabs">
                  <BasicConfiguration updateRights ={updateRights} addRights ={addRights}/>
          </div>
        </RctCard>
      </div>

    );
  }
}


export default Configuration;
