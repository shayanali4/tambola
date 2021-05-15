
import update from 'react-addons-update';

// action types
import {
  GET_GAMES,
  GET_GAMES_SUCCESS,

  OPEN_ADD_NEW_GAME_MODEL,
  CLOSE_ADD_NEW_GAME_MODEL,
  OPEN_ADD_NEW_GAME_MODEL_SUCCESS,

  OPEN_EDIT_GAME_MODEL,
  OPEN_EDIT_GAME_MODEL_SUCCESS,

  OPEN_VIEW_GAME_MODEL,
  OPEN_VIEW_GAME_MODEL_SUCCESS,
  CLOSE_VIEW_GAME_MODEL,

  SAVE_GAME,
  SAVE_GAME_SUCCESS,

  DELETE_GAME,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      games: null, // initial Game data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewGameModal : false,
      viewGameDialog:false,
      selectedGame: null,
      editGame : null,
      editMode : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      };

export default (state = INIT_STATE, action) => {

    switch (action.type) {
      // get games
      case GET_GAMES:

      let tableInfo = state.tableInfo;
        if(action.payload)
        {
          tableInfo.pageIndex  = action.payload.state.page;
          tableInfo.pageSize  = action.payload.state.pageSize;
          tableInfo.sorted  = action.payload.state.sorted;
          tableInfo.filtered = action.payload.state.filtered;
        }
      return { ...state , tableInfo : tableInfo};
      // get Game success
      case GET_GAMES_SUCCESS:
      {
         let games = action.payload.data;

         return { ...state, games: games,selectAll : false,  tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};
     }
     case OPEN_ADD_NEW_GAME_MODEL :
              return { ...state, addNewGameModal : true ,editMode : false ,editGame : null};
      case OPEN_ADD_NEW_GAME_MODEL_SUCCESS:

               return { ...state,addNewGameModal : true, editMode : false ,editGame : null,gametypelist : action.payload.gametypelist,storelist : action.payload.storelist};
    case CLOSE_ADD_NEW_GAME_MODEL:
              return { ...state, addNewGameModal : false ,editMode : false,editGame : null};
    case OPEN_EDIT_GAME_MODEL:
        return { ...state, addNewGameModal : true, editMode : true, editGame: null };
    case OPEN_EDIT_GAME_MODEL_SUCCESS:
            let editGame = action.payload.data[0];
            let tickets = action.payload.tickets;

            if(editGame)
            { editGame.gameprice = JSON.parse(editGame.gameprice);
               editGame.drawsequence = JSON.parse(editGame.drawsequence);
               editGame.statusId =  editGame.statusId ? editGame.statusId.toString() : '';
               editGame.tickets =   tickets.map(x => {x.ticket  = JSON.parse(x.ticket);  return x; });
              }
              return { ...state,editGame:editGame,gametypelist : action.payload.gametypelist ,storelist : action.payload.storelist };
     case OPEN_VIEW_GAME_MODEL :
         return { ...state, viewGameDialog : true};

      case OPEN_VIEW_GAME_MODEL_SUCCESS:
      {

        let selectedGame = action.payload.data[0];
        if(selectedGame)
        {
          selectedGame.called_numbers = JSON.parse(selectedGame.called_numbers);
          selectedGame.drawsequence = JSON.parse(selectedGame.drawsequence);
          selectedGame.winners = JSON.parse(selectedGame.winners);
selectedGame.tickets = action.payload.tickets.map(x => {x.ticket = JSON.parse(x.ticket); return x; });

          Object.entries(selectedGame.winners).forEach(([key, value]) => {
            if(typeof(value) == "object" && value && value.length > 0)
            {
                  selectedGame.winners[key] = selectedGame.tickets.filter(x => value.includes(x.ticketid));
            }
          });

        }
          return { ...state,selectedGame:selectedGame };
      }

      case CLOSE_VIEW_GAME_MODEL:
          return { ...state, viewGameDialog : false ,selectedGame :null};
     case SAVE_GAME:
                  return { ...state, dialogLoading : true, disabled : true };
      case SAVE_GAME_SUCCESS:
                  return { ...state, dialogLoading : false,addNewGameModal : false , editMode : false, editGame : null, disabled : false};


       case REQUEST_FAILURE:
            return { ...state , dialogLoading : false, disabled : false};
        case REQUEST_SUCCESS:
                  return { ...state};
        case ON_SHOW_LOADER:
                return { ...state, loading : true};
         case ON_HIDE_LOADER:
              return { ...state, loading : false};
        break;
        default: return { ...state};
          }
          }
