
import update from 'react-addons-update';
import { NotificationManager } from 'react-notifications';
// action types
import {
  GET_BOOKTICKETS,
  GET_BOOKTICKETS_SUCCESS,

  OPEN_ADD_NEW_BOOKTICKET_MODEL,
  CLOSE_ADD_NEW_BOOKTICKET_MODEL,
  OPEN_ADD_NEW_BOOKTICKET_MODEL_SUCCESS,

  OPEN_EDIT_BOOKTICKET_MODEL,
  OPEN_EDIT_BOOKTICKET_MODEL_SUCCESS,

  OPEN_VIEW_BOOKTICKET_MODEL,
  OPEN_VIEW_BOOKTICKET_MODEL_SUCCESS,
  CLOSE_VIEW_BOOKTICKET_MODEL,

  SAVE_BOOKTICKET,
  SAVE_BOOKTICKET_SUCCESS,

  DELETE_BOOKTICKET,
  DELETE_BOOKTICKET_SUCCESS,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER
} from 'Actions/types';

const INIT_STATE = {
      booktickets: null, // initial BookTicket data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewBookTicketModal : false,
      viewBookTicketDialog:false,
      selectedBookTicket: null,
      editBookTicket : null,
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
      // get booktickets
      case GET_BOOKTICKETS:

      let tableInfo = state.tableInfo;
        if(action.payload)
        {
          tableInfo.pageIndex  = action.payload.state.page;
          tableInfo.pageSize  = action.payload.state.pageSize;
          tableInfo.sorted  = action.payload.state.sorted;
          tableInfo.filtered = action.payload.state.filtered;
        }
      return { ...state , tableInfo : tableInfo};
      // get BookTicket success
      case GET_BOOKTICKETS_SUCCESS:
      {
         let booktickets = action.payload.pages;
             let game = action.payload.data[0];

         let sheets = [];
         for(var x = 0; x < booktickets.length/6 ; x++){
           sheets.push([booktickets[6*x],booktickets[6*x + 1],booktickets[6*x + 2],booktickets[6*x + 3]
             ,booktickets[6*x + 4],booktickets[6*x + 5]]);
         }

         return { ...state, booktickets: sheets, game : game};
     }
     case OPEN_ADD_NEW_BOOKTICKET_MODEL :
     {
       let ticketToBook = action.payload;
              return { ...state, addNewBookTicketModal : true ,editMode : true ,editBookTicket : ticketToBook};
      }
      case OPEN_ADD_NEW_BOOKTICKET_MODEL_SUCCESS:

               return { ...state,addNewBookTicketModal : true, editMode : false ,editBookTicket : null,booktickettypelist : action.payload.booktickettypelist,storelist : action.payload.storelist};
    case CLOSE_ADD_NEW_BOOKTICKET_MODEL:
              return { ...state, addNewBookTicketModal : false ,editMode : false,editBookTicket : null};
    case OPEN_EDIT_BOOKTICKET_MODEL:
        return { ...state, addNewBookTicketModal : true, editMode : true, editBookTicket: null };
    case OPEN_EDIT_BOOKTICKET_MODEL_SUCCESS:
            let editBookTicket = action.payload.data[0];
            let tickets = action.payload.tickets;

            if(editBookTicket)
            {
               editBookTicket.statusId =  editBookTicket.statusId ? editBookTicket.statusId.toString() : '';
               editBookTicket.tickets =   tickets.map(x => x.ticket  = JSON.parse(x.ticket));

          	  }
              return { ...state,editBookTicket:editBookTicket,booktickettypelist : action.payload.booktickettypelist ,storelist : action.payload.storelist };
     case OPEN_VIEW_BOOKTICKET_MODEL :
         return { ...state, viewBookTicketDialog : true , selectedBookTicket : null};

      case OPEN_VIEW_BOOKTICKET_MODEL_SUCCESS:
        let selectedBookTicket = action.payload.data[0];
        if(selectedBookTicket)
        {
          selectedBookTicket.images = JSON.parse(selectedBookTicket.images);
           selectedBookTicket.images = selectedBookTicket.images || [];

             selectedBookTicket.statusId =  selectedBookTicket.statusId ? selectedBookTicket.statusId.toString() : '';
      		 selectedBookTicket.measurementunitId = selectedBookTicket.measurementunitId ? selectedBookTicket.measurementunitId.toString() : '';
      		 selectedBookTicket.BookTickettypeId = selectedBookTicket.BookTickettypeId ? selectedBookTicket.BookTickettypeId.toString() : '';
      		 selectedBookTicket.BookTicketvalidityId = selectedBookTicket.BookTicketvalidityId ?  selectedBookTicket.BookTicketvalidityId.toString() : '';

        }
              return { ...state,selectedBookTicket:selectedStor };
      case CLOSE_VIEW_BOOKTICKET_MODEL:
          return { ...state, viewBookTicketDialog : false ,selectedBookTicket :null};
     case SAVE_BOOKTICKET:
                  return { ...state, dialogLoading : true, disabled : true };
      case SAVE_BOOKTICKET_SUCCESS:
                  return { ...state, dialogLoading : false,addNewBookTicketModal : false , editMode : false, editBookTicket : null, disabled : false};


      case DELETE_BOOKTICKET:
                  return { ...state, dialogLoading : true, disabled : true };
      case DELETE_BOOKTICKET_SUCCESS:
                  return { ...state, dialogLoading : false,addNewBookTicketModal : false , editMode : false, editBookTicket : null, disabled : false};

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
