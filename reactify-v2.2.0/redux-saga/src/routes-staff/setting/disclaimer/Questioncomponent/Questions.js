
 import React, {Fragment, Component } from 'react';
 import AppBar from '@material-ui/core/AppBar';
 import Tabs from '@material-ui/core/Tabs';
 import Tab from '@material-ui/core/Tab';
 import Typography from '@material-ui/core/Typography';
 import {isMobile} from 'react-device-detect';

 // Components
  import QuestionLibrary from './QuestionLibrary';
  import QuestionList from './QuestionList';
  import AddQuestion from './AddQuestion';

 // rct card box
 import { RctCard } from 'Components/RctCard';

// For Tab Content
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: isMobile ? 5 : 8  }}>
      {props.children}
    </Typography>
  );
}

class Questions extends Component {
  state = {
     activeTab: 0
   }

   handleChange = ( value) => {
     this.setState({ activeTab: value });
   }


  render() {
    const { activeTab } = this.state;
    const {updateRights,addRights} = this.props;
    return (

      <div className="userProfile-wrapper" style = {{"margin" : "-10px -24px 0 -24px"}}>
        <RctCard>
          <div className="rct-tabs">
            <AppBar position="static" >
              <Tabs
                value={activeTab ? parseInt(activeTab) : 0}
                onChange={(e, value) => this.handleChange(value)}
                variant = "scrollable"
                scrollButtons="off"
                indicatorColor="primary"
              >
                <Tab  label={"Pre-Defined Question"} />
                <Tab  label={"Custom Question"} />
              </Tabs>
            </AppBar>

            {activeTab == 0 &&
              <TabContainer>
                <QuestionLibrary updateRights ={updateRights} addRights ={addRights}/>
              </TabContainer>}
             {activeTab == 1 &&
                <TabContainer>
                  <QuestionList updateRights ={updateRights} addRights ={addRights} history = {this.props.history} location = {this.props.location}/>
                </TabContainer>}

                <AddQuestion updateRights ={updateRights} addRights ={addRights} history = {this.props.history} location = {this.props.location}/>

          </div>
        </RctCard>
      </div>

    );
  }
}


export default Questions;
