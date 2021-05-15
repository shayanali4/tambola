import IconButton from '@material-ui/core/IconButton';

import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';


import React, { Component } from 'react';


class ClearGoogleTranslate extends Component {


    componentDidMount() {
    }

    render() {
        return (
          <Tooltip PopperProps={{ style: { pointerEvents: 'none' } }} id="tooltip-top" disableFocusListener disableTouchListener  title={"Show Original" } placement="bottom-end">
          {
            document.getElementsByTagName("iframe")[0] ?
  							<CloseIcon onClick={() =>  document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById(":2.restore").click()}/>
                : <div></div>
          }
  				</Tooltip>
          );
     }
}

export default ClearGoogleTranslate;
