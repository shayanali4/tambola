/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewGameModel, saveGame } from 'Actions';
import {getLocalDate, checkError, cloneDeep,getTaxValues} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import GameDetail from './GameDetail';
import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import { EditorState } from 'draft-js';

import {required,restrictLength,allowAlphaNumeric, convertToInt, checkDecimal} from 'Validations';
import { push } from 'connected-react-router';
import { NotificationManager } from 'react-notifications';
import tambola from 'Components/Tambola';
import {isMobile} from 'react-device-detect';
import Button from '@material-ui/core/Button';
import GamePrice from 'Assets/data/gameprice';

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddGame extends PureComponent {
	constructor(props) {
     super(props);
		   this.state = this.getInitialState();
   }

   getInitialState()
   {
     this.initialState = {
             activeIndex : 0,

             GameData :
             {
               fields : {
                  id : 0,
                  status:'1',
                  launchdate : null,
                  noofsheets : 100,
                  tickets : [],
                  drawsequence : [],
                  gameprice  : cloneDeep(GamePrice)
                },
                errors : { },
               validated : false
           },
     };

      return cloneDeep(this.initialState);
   }

	 componentWillReceiveProps(newProps)
	 {
		 const	{editGame, editMode} = newProps;
		 let {GameData} = this.state;

     GameData= GameData.fields;

		 if(editMode && editGame && editGame.id && editGame.id != this.state.GameData.fields.id)
		 {
       debugger;

       GameData = cloneDeep(editGame);
       GameData.id = editGame.id;
       GameData.status = GameData.statusId ? GameData.statusId.toString() : '1';
       GameData.noofsheets = GameData.tickets.length/6;
       this.state.GameData.fields = GameData;
       this.state.Game_old = cloneDeep(GameData);

     }
	 }



   componentWillUpdate(nextProps, nextState)
   {
     if((!nextProps.editMode && nextState.GameData.fields.id != 0) || (this.props.addNewGameModal && !nextProps.addNewGameModal))
     {
        this.setState(this.getInitialState());
     }
   }



   onChangeGame(key,value, isRequired)
   {

     let error= isRequired ? required(value) : '';
     const fields = this.state.GameData.fields;
      const { clientProfileDetail} = this.props;
      let {drawsequence} = this.state.GameData.fields;

      if(key == "tickets")
      {
          drawsequence = tambola.getDrawSequence();
      }


     this.setState({
       GameData: {
         ...this.state.GameData,
         fields : {...this.state.GameData.fields,
           [key] : value,
           drawsequence : drawsequence
         },
         errors : {...this.state.GameData.errors,
           [key] : error
         }
       }
     });
   }



   validate()
   {
       let errors = {};
       const fields = this.state.GameData.fields;
       errors.launchdate = required(fields.launchdate);
         let validated = checkError(errors);

         if(!(fields.tickets && fields.tickets.length > 0))
         {
              NotificationManager.error('Please generate Tickets and Save.');
              validated = false;
         }


        this.setState({
          GameData: {	...this.state.GameData,
             errors : errors, validated : validated
          }
        });

        return validated;
   }
   onSaveGame()
   {
     const {GameData,Game_old} = this.state;
     const	{editGame, editMode} = this.props;

     if(this.validate())
     {
        if(!editMode || (editGame && (JSON.stringify(Game_old) != JSON.stringify(GameData.fields))))
        {
            let game  = GameData.fields;
            this.props.saveGame({game});
        }
        else {
          NotificationManager.error('No changes detected');
         }
   }
  }

    onClose()
	 	{
      this.setState(this.getInitialState());
	 		this.props.clsAddNewGameModel();
      this.props.push('/app/game');
	 	}

	render() {

	 const	{ addNewGameModal, disabled , dialogLoading , editMode , editGame,gametypelist ,storelist,clientProfileDetail} = this.props;
 	 const {GameData ,activeIndex} = this.state;

		return (
			<Dialog fullScreen open={addNewGameModal} onClose={() =>this.onClose()} >
					<AppBar position="static" className="bg-primary">
							<Toolbar>
									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-50 mb-0 ">{ editMode || GameData.fields.id != 0 ? 'UPDATE ' : 'ADD '  } GAME</h5>
									<div className="w-50 mb-0">
											<Tabs
														variant = "fullWidth"
														indicatorColor="secondary">

																	</Tabs>
								 </div>

                 <Button onClick={() =>this.onSaveGame()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>


						</Toolbar>
				</AppBar>
				{((editMode && !editGame) || dialogLoading ) &&
					<RctSectionLoader />
				}
    	<PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>
            <TabContainer>
             <GameDetail fields = {GameData.fields} errors ={GameData.errors}  onChange = {this.onChangeGame.bind(this)}
           clientprofile ={clientProfileDetail} editMode = {editMode}
            /></TabContainer>

      	</PerfectScrollbar>
			</Dialog>

	);
  }
  }
const mapStateToProps = ({ gameReducer,settings }) => {
	const { addNewGameModal, disabled, dialogLoading, editGame, editMode,gametypelist, storelist } =  gameReducer;
  const { clientProfileDetail,userProfileDetail} = settings;
  return { addNewGameModal, disabled , dialogLoading, editGame, editMode,gametypelist,storelist, clientProfileDetail,userProfileDetail}
}

export default connect(mapStateToProps,{
	clsAddNewGameModel, saveGame, push})(AddGame);
