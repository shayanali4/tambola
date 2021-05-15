/**
 * Rct Collapsible Card
 */
import React, { Component, Fragment } from 'react';

import CustomScrollbar from 'react-scrollbars-custom';
import {cloneDeep} from 'Helpers/helpers';
import { isMobile} from "react-device-detect";

class PerfectScrollbarComponent extends Component {
  constructor(props) {
       super(props);
            }
    render() {



      if(isMobile)
      {
        let styles = cloneDeep(this.props.style) || {};

        return (
           <div className = "PerfectScrollbarDiv" style = {styles}>
              {(this.props.children === null) ? React.createElement('div') : this.props.children}
          </div >
        );
      }
      else {

        return (
            <CustomScrollbar {...this.props} >
              {(this.props.children === null) ? React.createElement('div') : this.props.children}
            </CustomScrollbar>
        );
      }


    }
}

export default PerfectScrollbarComponent;
