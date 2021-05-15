/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import {cloneDeep} from 'Helpers/helpers';

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import api from 'Api';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import {isMobile} from 'react-device-detect';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

function TabContainer({ children }) {
		return (
				<Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
						{children}
				</Typography>
		);
}

 export default class TagnameList extends Component {

   constructor(props) {
      super(props);
      this.state = this.getInitialState();
   }
   getInitialState()
   {
     this.initialState = {
                     tagnames:null,
                     opnPredefinedTagDialog : false,
                     loading : false
                   }
                   return cloneDeep(this.initialState);
     }

   // componentDidMount()
   // {
   //   this.getTagnames();
   //  }



   getTagnames()
   {
     this.setState({opnPredefinedTagDialog : true});
     if(!this.state.tagnames)
     {
       this.setState({loading : true });
       api.post('tagnames-list')
      .then(response =>
        {
           this.setState({tagnames : response.data[0] , loading : false});
         }
      ).catch(error =>{ console.log(error); this.setState({loading : false});} )
     }
   }


	render() {

	const	{tagnames,opnPredefinedTagDialog,loading} = this.state;
   	return (
      <div className = "d-inline">

        <a href="javascript:void(0)" onClick={() =>	this.getTagnames()} className="btn-outline-default mr-10 mt-5"> Pre-Defined Tags</a>

        <Dialog fullScreen open={opnPredefinedTagDialog} onClose={() =>this.setState({opnPredefinedTagDialog : false})} >
            <AppBar position="static" className="bg-primary">
                <Toolbar>
                    <IconButton color="inherit" onClick={() =>this.setState({opnPredefinedTagDialog : false})} aria-label="Close">
                          <CloseIcon />
                    </IconButton>
                    <h5 className="w-50 mb-0 ">PRE-DEFINED TAGS</h5>
                    <div className="w-50 mb-0">
                      <Tabs
                            value = {0}
                            variant = "fullWidth"
                            indicatorColor="secondary" >
                      </Tabs>
                    </div>
                 </Toolbar>
             </AppBar>

             {loading &&
     					<RctSectionLoader />
     				}
            <PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>
              <TabContainer>
                <RctCollapsibleCard>

                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Tagnames </th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>

                               {tagnames && tagnames.map((tag, key) => (
                                <tr key={'tagnamesOption' + key}>
                                  <td>
                                      <h4>{tag.tagname}</h4>
                                  </td>
                                   <td>
                                      <h4>{tag.description}</h4>
                                    </td>
                                </tr>
                              ))
                            }

                      </tbody>

                    </table>
                </div>

                </RctCollapsibleCard>
             </TabContainer>

            </PerfectScrollbar>
       </Dialog>




         </div>
	);
  }
  }
