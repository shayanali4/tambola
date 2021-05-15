import Auth from '../Auth/Auth';
const authObject = new Auth();

import update from 'react-addons-update';


// action types
import {

OPEN_VIEW_BIOMAX_MODEL,
CLOSE_VIEW_BIOMAX_MODEL,

GET_BIOMAX_MEMBERS,
GET_BIOMAX_MEMBERS_SUCCESS,

GET_BIOMAX_MEMBERS_LOGS,
GET_BIOMAX_MEMBERS_LOGS_SUCCESS,


GET_BIOMAX_USERS,
GET_BIOMAX_USERS_SUCCESS,

GET_BIOMAX_USERS_LOGS,
GET_BIOMAX_USERS_LOGS_SUCCESS,


GET_BIOMAX_UNAUTHORISED_LOGS,
GET_BIOMAX_UNAUTHORISED_LOGS_SUCCESS,

BIOMAX_HANDLE_CHANGE_SELECT_ALL,
BIOMAX_HANDLE_SINGLE_CHECKBOX_CHANGE,

USER_BIOMAX_HANDLE_CHANGE_SELECT_ALL,
USER_BIOMAX_HANDLE_SINGLE_CHECKBOX_CHANGE,

REQUEST_SUCCESS,
REQUEST_FAILURE,
ON_SHOW_LOADER,
ON_HIDE_LOADER

} from 'Actions/types';
const INIT_STATE = {
      loading : false,
      disabled : false,
      dialogLoading : false,
      selectedBiomaxdata: null,
      viewBiomaxDialog:false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      biometricdevicelist : null,
      members : null,
      memberslogs : null,
      tableInfoLogs : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      tableInfoUnauthorisedLogs : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      users : null,
      userslogs : null,
      unauthorisedlogs : null,
      selectAll: false,
      userselectAll : false,
  };
  export default (state = INIT_STATE, action) => {



      switch (action.type) {

           case OPEN_VIEW_BIOMAX_MODEL:
                       return { ...state, viewBiomaxDialog : true , selectedBiomaxdata : action.payload.data};

         case CLOSE_VIEW_BIOMAX_MODEL:
                      return { ...state, viewBiomaxDialog : false, selectedBiomaxdata : null};
            // get Members
          case GET_BIOMAX_MEMBERS:
                      let tableInfo = state.tableInfo;

                        if(action.payload)
                        {
                          if(action.payload.state)
                          {
                            tableInfo.pageIndex  = (action.payload.state.page ? action.payload.state.page : (action.payload.state.pageIndex ? action.payload.state.pageIndex : 0));
                            tableInfo.pageSize  = action.payload.state.pageSize;
                            tableInfo.sorted  = action.payload.state.sorted || [];
                            tableInfo.filtered = action.payload.state.filtered || [];
                            tableInfo.memberstatusfilter = action.payload.state.memberstatusfilter;
                          }
                          else {
                            if(action.payload.memberstatusfilter){
                              tableInfo.memberstatusfilter = action.payload.memberstatusfilter;
                            }
                          }
                        }
                      return { ...state , tableInfo : tableInfo,loading : true};

        case GET_BIOMAX_MEMBERS_SUCCESS:

                        return { ...state, members: action.payload.data ? action.payload.data : state.members ,selectAll : false,
                          tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count},
                          biometricdevicelist :  action.payload.biometricdevicelist ? action.payload.biometricdevicelist : state.biometricdevicelist,loading : false };


            // get Members
            case GET_BIOMAX_MEMBERS_LOGS:
                  let tableInfoLogs = state.tableInfoLogs;
                        if(action.payload)
                            {
                                tableInfoLogs.pageIndex  = action.payload.state.page || 0;
                                tableInfoLogs.pageSize  = action.payload.state.pageSize;
                                tableInfoLogs.sorted  = action.payload.state.sorted || [] ;
                                tableInfoLogs.filtered = action.payload.state.filtered || [] ;
                                tableInfoLogs.month = action.payload.state.month ;
                                tableInfoLogs.year = action.payload.state.year;
						     if(tableInfoLogs.filtered.length <= 0){
                                  tableInfoLogs.filtered.push({id: "intime",value: new Date()});
                                }
                                else if (tableInfoLogs.filtered.length > 0) {
                                  let filter = tableInfoLogs.filtered.filter(x => x.id == "intime");
                                  if(filter.length <= 0){
                                    tableInfoLogs.filtered.push({id: "intime",value: new Date()});
                                  }
                                }
                              }
                    return { ...state , tableInfoLogs : tableInfoLogs,loading : true};

          case GET_BIOMAX_MEMBERS_LOGS_SUCCESS:
          let memberslogs = action.payload.data;

            return { ...state, memberslogs: memberslogs , tableInfoLogs : {...state.tableInfoLogs , pages :  action.payload.pages ?  action.payload.pages[0].pages : 1 ,totalrecord : action.payload.pages ? action.payload.pages[0].count : 0},biometricdevicelist :  action.payload.biometricdevicelist ,loading : false};

        // get users
        case GET_BIOMAX_USERS:
                  let tableInfousers = state.tableInfo;
                  if(action.payload)
                    {
                          tableInfousers.pageIndex  = (action.payload.state.page ? action.payload.state.page : (action.payload.state.pageIndex ? action.payload.state.pageIndex : 0));
                          tableInfousers.pageSize  = action.payload.state.pageSize;
                          tableInfousers.sorted  = action.payload.state.sorted || [];
                          tableInfousers.filtered = action.payload.state.filtered || [];
                      }
                    return { ...state , tableInfo : tableInfousers,loading : true};

    case GET_BIOMAX_USERS_SUCCESS:

                  let users = action.payload.data;
                  return { ...state, users: users ,userselectAll :false, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages ,totalrecord : action.payload.pages[0].count},biometricdevicelist :  action.payload.biometricdevicelist ,loading : false};


      // get Members
      case GET_BIOMAX_USERS_LOGS:
                  let tableInfoLogsUsers = state.tableInfoLogs;
                  if(action.payload)
                          {
                              tableInfoLogsUsers.pageIndex  = action.payload.state.page || 0;
                              tableInfoLogsUsers.pageSize  = action.payload.state.pageSize;
                              tableInfoLogsUsers.sorted  = action.payload.state.sorted || [] ;
                              tableInfoLogsUsers.filtered = action.payload.state.filtered || [] ;
                              tableInfoLogsUsers.month = action.payload.state.month ;
                              tableInfoLogsUsers.year = action.payload.state.year;


                              if(tableInfoLogsUsers.filtered.length <= 0){
                                   tableInfoLogsUsers.filtered.push({id: "intime",value: new Date()});
                                 }
                                 else if (tableInfoLogsUsers.filtered.length > 0) {
                                   let filter = tableInfoLogsUsers.filtered.filter(x => x.id == "intime");
                                   if(filter.length <= 0){
                                     tableInfoLogsUsers.filtered.push({id: "intime",value: new Date()});
                                   }
                                 }

                              }

              return { ...state , tableInfoLogs : tableInfoLogsUsers,loading : true};

      case GET_BIOMAX_USERS_LOGS_SUCCESS:
            let userslogs = action.payload.data;

              return { ...state, userslogs: userslogs , tableInfoLogs : {...state.tableInfoLogs , pages :  action.payload.pages ?  action.payload.pages[0].pages : 1 ,totalrecord : action.payload.pages ? action.payload.pages[0].count : 0},biometricdevicelist :  action.payload.biometricdevicelist,loading : false };

              // get biomax Unauthorised uset
              case GET_BIOMAX_UNAUTHORISED_LOGS:
                          let tableInfounauthorisedLog = state.tableInfoUnauthorisedLogs;
                          if(action.payload)
                                  {
                                      tableInfounauthorisedLog.pageIndex  = action.payload.state.page || 0;
                                      tableInfounauthorisedLog.pageSize  = action.payload.state.pageSize;
                                      tableInfounauthorisedLog.sorted  = action.payload.state.sorted || [] ;
                                      tableInfounauthorisedLog.filtered = action.payload.state.filtered || [] ;
                                      tableInfounauthorisedLog.month = action.payload.state.month ;
                                      tableInfounauthorisedLog.year = action.payload.state.year;

                           	if(tableInfounauthorisedLog.filtered.length <= 0){
                                  tableInfounauthorisedLog.filtered.push({id: "intime",value: new Date()});
                                }
                                else if (tableInfounauthorisedLog.filtered.length > 0) {
                                  let filter = tableInfounauthorisedLog.filtered.filter(x => x.id == "intime");
                                  if(filter.length <= 0){
                                    tableInfounauthorisedLog.filtered.push({id: "intime",value: new Date()});
                                  }
                                }


                                    }
                      return { ...state , tableInfoUnauthorisedLogs : tableInfounauthorisedLog,loading : true};

              case GET_BIOMAX_UNAUTHORISED_LOGS_SUCCESS:
                let unauthorisedlogs =  action.payload.data;
                 if(unauthorisedlogs){
                   unauthorisedlogs.forEach(x => x.isunauthorised = true)
                 }
                    return { ...state, unauthorisedlogs: action.payload.data , tableInfoUnauthorisedLogs : {...state.tableInfoUnauthorisedLogs , pages :  action.payload.pages ?  action.payload.pages[0].pages : 1  , totalrecord : action.payload.pages ? action.payload.pages[0].count : 0},biometricdevicelist :  action.payload.biometricdevicelist,loading : false };


              case BIOMAX_HANDLE_CHANGE_SELECT_ALL:

                    var selectAll = !state.selectAll;
                    state.members.forEach(x => x.checked = action.payload.value);
                    return update(state, {
                          selectAll: { $set:selectAll },
                      });

              case BIOMAX_HANDLE_SINGLE_CHECKBOX_CHANGE:
                      let memberIndex = state.members.indexOf(action.payload.data);
                      return update(state, {
                        members: {
                          [memberIndex]: {
                            checked: { $set: action.payload.value },

                          }
                      }
                    });
            case USER_BIOMAX_HANDLE_CHANGE_SELECT_ALL:

                    var userselectAll = !state.userselectAll;
                    state.users.forEach(x => x.checked = action.payload.value);
                    return update(state, {
                          userselectAll: { $set:userselectAll },
                      });

            case USER_BIOMAX_HANDLE_SINGLE_CHECKBOX_CHANGE:
                      let userIndex = state.users.indexOf(action.payload.data);
                      return update(state, {
                        users: {
                          [userIndex]: {
                            checked: { $set: action.payload.value },

                          }
                      }
                    });

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
