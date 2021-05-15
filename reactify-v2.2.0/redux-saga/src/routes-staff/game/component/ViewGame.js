/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsViewGameModel } from 'Actions';

import CustomConfig from 'Constants/custom-config';
import {getFormtedFromTime,getLocalTime ,getFormtedDate ,getFormtedTimeFromJsonDate} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import classnames from 'classnames';
import DialogTitle from '@material-ui/core/DialogTitle';

import {isMobile} from 'react-device-detect';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import { push } from 'connected-react-router';
import { RctCard } from 'Components/RctCard';
import GamePage from '../../../container/gamepage';
class ViewGame extends Component {

onClose()
		{
			const {pathname, hash, search} = this.props.location;
			this.props.clsViewGameModel();
			this.props.push(pathname);
		}
	render() {
	 const	{ viewGameDialog, selectedGame } = this.props;

		return (
      <Dialog fullWidth fullScreen
            onClose={() => this.onClose()}
          open={viewGameDialog}
						scroll = 'body'
        >
				<DialogTitle >
			<CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>

				</DialogTitle>

			    <DialogContent className = {"pt-0"}>
<GamePage showwinners ={1}/>
				  </DialogContent>
        </Dialog>

	);
  }
  }
const mapStateToProps = ({ gameReducer }) => {
	const { viewGameDialog, selectedGame } =  gameReducer;
  return { viewGameDialog, selectedGame }
}

export default connect(mapStateToProps,{
	clsViewGameModel,push})(ViewGame);
