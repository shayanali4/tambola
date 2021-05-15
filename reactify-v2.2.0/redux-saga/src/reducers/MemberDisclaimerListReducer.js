// action types
import {
  GET_MEMBER_DISCLAIMER_LIST,
  GET_MEMBER_DISCLAIMER_LIST_SUCCESS,
  OPEN_ADD_MEMBER_CONSULTATIONNOTE_MODEL,
  CLOSE_ADD_MEMBER_CONSULTATIONNOTE_MODEL,
  SAVE_MEMBER_CONSULTATIONNOTE,
  SAVE_MEMBER_CONSULTATIONNOTE_SUCCESS,

    REQUEST_SUCCESS,
    REQUEST_FAILURE,
    ON_SHOW_LOADER,
    ON_HIDE_LOADER

} from 'Actions/types';

const INIT_STATE = {
      disclaimerlist: null, // initial service data
      loading : false,
      disabled : false,
      dialogLoading : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
	  addMemberConsultationNote : null,
	  addMemberConsultationNoteDialog : false,
	  isMemberConsultationNoteSave : false,
  };
  export default (state = INIT_STATE, action) => {

      switch (action.type) {

        case GET_MEMBER_DISCLAIMER_LIST:
        let tableInfo = state.tableInfo;
          if(action.payload)
          { 	
			if(action.payload.state)
            {
              tableInfo.pageIndex  = action.payload.state.page;
              tableInfo.pageSize  = action.payload.state.pageSize;
              tableInfo.sorted  = action.payload.state.sorted;
              tableInfo.filtered = action.payload.state.filtered;
              tableInfo.startDate = action.payload.state.startDate;
              tableInfo.endDate = action.payload.state.endDate;
			  tableInfo.memberfilter = action.payload.state.memberfilter;
            }
            else {
              if (action.payload.startDate) {
                tableInfo.startDate = action.payload.startDate;
                tableInfo.endDate = action.payload.endDate;
              }
			  else if(action.payload.memberfilter){
                tableInfo.memberfilter = action.payload.memberfilter;
              }
            }
          }
		  
            return { ...state ,tableInfo : tableInfo};
        
        case GET_MEMBER_DISCLAIMER_LIST_SUCCESS:
            return { ...state, disclaimerlist: action.payload.data, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};

		case OPEN_ADD_MEMBER_CONSULTATIONNOTE_MODEL:
       
               return { ...state,addMemberConsultationNote:action.payload.data,addMemberConsultationNoteDialog : true,isMemberConsultationNoteSave : false};
        case CLOSE_ADD_MEMBER_CONSULTATIONNOTE_MODEL:
               return { ...state, addMemberConsultationNoteDialog : false,isMemberConsultationNoteSave : false,addMemberConsultationNote : null };
        case SAVE_MEMBER_CONSULTATIONNOTE:
               return { ...state,dialogLoading : true, disabled : true,isMemberConsultationNoteSave : false};
        case SAVE_MEMBER_CONSULTATIONNOTE_SUCCESS:
               return { ...state,addMemberConsultationNoteDialog : false,dialogLoading : false,addMemberConsultationNote : null, disabled : false,isMemberConsultationNoteSave : true};
	
			
			
        case REQUEST_FAILURE:
                     return { ...state , loading : false, dialogLoading : false, disabled : false};
        case REQUEST_SUCCESS:
                     return { ...state};
        case ON_SHOW_LOADER:
                     return { ...state, loading : true, disabled : true};
        case ON_HIDE_LOADER:
                    return { ...state, loading : false, dialogLoading : false, disabled : false};
         break;
                   default: return { ...state};
        }
   }
