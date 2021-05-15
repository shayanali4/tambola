// action types
import {
OPEN_ADD_NEW_POSTER_MODEL,
CLOSE_ADD_NEW_POSTER_MODEL,

GET_POSTER,
GET_POSTER_SUCCESS,

DELETE_POSTER,

SAVE_POSTER,
SAVE_POSTER_SUCCESS,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER

} from 'Actions/types';
const INIT_STATE = {
      posters: [], // initial service data
      loading : false,
      disabled : false,
      dialogLoading : false,
      addNewPosterModal : false,
      loadingScroll : false,
      posterid : null,
  };
  export default (state = INIT_STATE, action) => {

      switch (action.type) {

        case GET_POSTER:
            return { ...state,posterid : state.posterid ,posters : state.posters};

        case GET_POSTER_SUCCESS:

        let posters = state.posters;
        let event = action.payload.data || [];
          let posterid = event && event.map(x => x.posterid);
          posterid =  event.length == 0 ? state.posterid :  Math.min.apply(Math, posterid);
          let loadMore = (event.length == 0 || event.length < 4) ? false : true ;

            return { ...state,posters : posters.concat(event),posterid : posterid,
              loadingScroll : loadMore};
        case OPEN_ADD_NEW_POSTER_MODEL :
                     return { ...state, addNewPosterModal : true};
         case CLOSE_ADD_NEW_POSTER_MODEL:
                     return { ...state, addNewPosterModal : false};
         case SAVE_POSTER:
                      return { ...state,dialogLoading : true, disabled : true,posters : [],posterid : null};
        case SAVE_POSTER_SUCCESS:
                       return { ...state,addNewPosterModal : false,dialogLoading : false,disabled : false};

         case DELETE_POSTER:
                        return { ...state,posterid : null ,posters : []};
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
