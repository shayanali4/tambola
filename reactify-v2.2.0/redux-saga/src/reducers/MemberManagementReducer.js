/**
 * EmployeeManagement Reducer
 */
import {cloneDeep} from 'Helpers/helpers';
import update from 'react-addons-update';
import {convertMinToHourMin} from 'Helpers/unitconversion';

// action types
import {
  GET_MEMBERS,
  GET_MEMBERS_SUCCESS,
  GET_MEMBERS_FAILURE,
  OPEN_ADD_NEW_MEMBER_MODEL,
  OPEN_ADD_NEW_MEMBER_MODEL_SUCCESS,
  CLOSE_ADD_NEW_MEMBER_MODEL,
  SAVE_MEMBER,
  SAVE_MEMBER_SUCCESS,

  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  OPEN_VIEW_MEMBER_MODEL,
  OPEN_VIEW_MEMBER_MODEL_SUCCESS,
  CLOSE_VIEW_MEMBER_MODEL,

  OPEN_EDIT_MEMBER_MODEL,
  OPEN_EDIT_MEMBER_MODEL_SUCCESS,

  DELETE_MEMBER,

  IMPORT_MEMBER,
  IMPORT_MEMBER_SUCCESS,
  IMPORT_MEMBER_LIST,
  IMPORT_MEMBER_LIST_SUCCESS,

  SAVE_ACTIVEMEMBERSHIP_CHANGEDATE,
  SAVE_ACTIVEMEMBERSHIP_CHANGEDATE_SUCCESS,
  GET_MEMBERPROFILE_MEMBERSHIP,
  GET_MEMBERPROFILE_MEMBERSHIP_SUCCESS,
  OPEN_MEMBERSHIP_CHANGEDATE_MODEL,
  OPEN_MEMBERSHIP_CHANGEDATE_MODEL_SUCCESS,
  CLOSE_MEMBERSHIP_CHANGEDATE_MODEL,

  OPEN_CANCEL_PAYMENT_MODEL,
  CLOSE_CANCEL_PAYMENT_MODEL,

  SAVE_CANCEL_PAYMENT,
  SAVE_CANCEL_PAYMENT_SUCCESS,

  OPEN_EDIT_MEMBER_CHANGESTATUS_MODEL,
  CLOSE_EDIT_MEMBER_CHANGESTATUS_MODEL,

  SAVE_MEMBER_STATUS,
  SAVE_MEMBER_STATUS_SUCCESS,

  OPEN_MEMBER_BALANCE_ADJUSTMENT_MODEL,
  CLOSE_MEMBER_BALANCE_ADJUSTMENT_MODEL,

  SAVE_MEMBER_BALANCE_ADJUSTMENT,
  SAVE_MEMBER_BALANCE_ADJUSTMENT_SUCCESS,

  MEMBER_HANDLE_CHANGE_SELECT_ALL,
  MEMBER_HANDLE_SINGLE_CHECKBOX_CHANGE,
  OPEN_CHANGE_MEMBER_SALESBY_MODEL,
  CLOSE_CHANGE_MEMBER_SALESBY_MODEL,
  SAVE_CHANGE_MEMBER_SALESBY,
  SAVE_CHANGE_MEMBER_SALESBY_SUCCESS,

  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		 members: null, // initial member data
       loading : false,
       disabled : false,
       dialogLoading : false,
       selectedmembers : 0,
      addNewMemberModal : false,
      branchList : null,
      viewMemberDialog:false,
      selectedmember: null,
      editMembers : null,
      editMode : false,
      tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },

      importloading:false,
      importfilelist : null,
      tableInfoImport : {
        pageSize : 5,
        pageIndex : 0,
        pages : 1,
      },

      chgMembershipdateModal : false,
      memberid : null,
      membershipdata : null,
      membershipdata_old : null,
      activemembership:null,
      activeaddonservice : null,
      activept : null,
      activegs : null,

      selectedmemberProfile : null,
      purchase:0,
      totalpayment : 0,
      totalbalanceadjust : null,
      cancelpaymentdialog : false,
      cancelpaymentdata : null,
      editMemberChangestatusModal : false,
      editchangestatusdata : null,
      balanceadjustmentdata : null,
      opnMemberbalanceadjustmentModal : false,
      isbalanceadjustmentsuccess : false,
      balanceadjustmentID :'',
      iscancelpaymentsucess : false,
      balanceadjustmentType : '',
      membershipeditdatesuccess : 0,
      selectAll: false,
      checked: [],
      opnChangeMemberSalesbyDialog : false,
      changemembersalesbydata : null
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

        // get Members
        case GET_MEMBERS:
        let tableInfo = state.tableInfo;
          if(action.payload)
          {
            if(action.payload.state)
            {
              tableInfo.pageIndex  = action.payload.state.page;
              tableInfo.pageSize  = action.payload.state.pageSize;
              tableInfo.sorted  = action.payload.state.sorted;
              tableInfo.filtered = action.payload.state.filtered;
              tableInfo.memberfilter = action.payload.state.memberfilter;
              tableInfo.memberstatusfilter = action.payload.state.memberstatusfilter;
              tableInfo.salesrepresentative = action.payload.state.salesrepresentative;
            }
            else {
              if(action.payload.memberfilter){
                tableInfo.memberfilter = action.payload.memberfilter;
              }
              else if(action.payload.memberstatusfilter){
                tableInfo.memberstatusfilter = action.payload.memberstatusfilter;
              }
              else if (action.payload.salesrepresentative) {
                tableInfo.salesrepresentative = action.payload.salesrepresentative;
              }
            }
          }
        return { ...state , tableInfo : tableInfo};

        case GET_MEMBERS_SUCCESS:

          let members = action.payload.data;
          return { ...state, members: members , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}, selectAll : false};

          case REQUEST_FAILURE:
          return { ...state , dialogLoading : false, disabled : false,importloading : false};

          case REQUEST_SUCCESS:
          return { ...state};

        case ON_SHOW_LOADER:
            return { ...state, loading: true };

        case ON_HIDE_LOADER:
            return { ...state, loading : false };

        case OPEN_ADD_NEW_MEMBER_MODEL :
            return { ...state, addNewMemberModal : true ,editMode : false,editMembers :null};
        case OPEN_ADD_NEW_MEMBER_MODEL_SUCCESS:
            return { ...state,branchList:action.payload.branchList,addNewMemberModal : true };
        case CLOSE_ADD_NEW_MEMBER_MODEL:
            return { ...state, addNewMemberModal : false ,editMode : false,editMembers :null};

        case SAVE_MEMBER:

            return { ...state,  dialogLoading : true, disabled : true };

        case   SAVE_MEMBER_SUCCESS:

               return { ...state, dialogLoading : false,addNewMemberModal : false ,editMembers :null,selectedmember : null,editMode : false ,disabled : false};

        case OPEN_VIEW_MEMBER_MODEL :
                return { ...state ,loading : true,selectedmemberProfile :null};
        case OPEN_VIEW_MEMBER_MODEL_SUCCESS:
                let selectedmemberProfile = action.payload.data[0][0];
                if(selectedmemberProfile)
        				{
        					selectedmemberProfile.memberprofilecoverimage = selectedmemberProfile.memberprofilecoverimage ?  JSON.parse(selectedmemberProfile.memberprofilecoverimage) : [];
                  selectedmemberProfile.branchlist = selectedmemberProfile.branchlist ? JSON.parse(selectedmemberProfile.branchlist) : [];
        				}
                return { ...state,selectedmemberProfile:selectedmemberProfile,purchase : action.payload.data[2][0].purchase,totalpayment : action.payload.data[1][0].totalpayment,totalbalanceadjust : action.payload.data[3][0],loading : false };

        case CLOSE_VIEW_MEMBER_MODEL:
                return { ...state, viewMemberDialog : false ,selectedmember :null};
        case OPEN_EDIT_MEMBER_MODEL:
                  return { ...state, addNewMemberModal : true, editMode : true, editMembers: null};

        case OPEN_EDIT_MEMBER_MODEL_SUCCESS:
                  return { ...state, editMembers:action.payload.data[0] ,branchList:action.payload.branchList };
        case IMPORT_MEMBER:
                  return { ...state ,importloading : true};
        case IMPORT_MEMBER_SUCCESS:
                  return { ...state,importloading : false};
        case IMPORT_MEMBER_LIST:
              let tableInfoImport = state.tableInfoImport;
              tableInfoImport.filtered = tableInfoImport.filtered || [];
                if(action.payload)
                  {
                    if(action.payload.state)
                      {
                        tableInfoImport.pageIndex  = action.payload.state.page;
                        tableInfoImport.pageSize  = action.payload.state.pageSize;
                        tableInfoImport.sorted  = action.payload.state.sorted;
                        tableInfoImport.filtered = action.payload.state.filtered;
                        tableInfoImport.modulename = 'members';
                      }
                      else {
                        tableInfoImport.sorted  =[];
                        tableInfoImport.filtered = [];
                        tableInfoImport.modulename = 'members';
                       }
                    }
                  return { ...state ,tableInfoImport : tableInfoImport,importloading : true};
       case IMPORT_MEMBER_LIST_SUCCESS:
                  return { ...state, importfilelist: action.payload.data,importloading : false, tableInfoImport : {...state.tableInfoImport , pages : action.payload.pages[0].pages}};


       case SAVE_ACTIVEMEMBERSHIP_CHANGEDATE:
                  return { ...state,  dialogLoading : true, disabled : true ,membershipeditdatesuccess : 0};

       case SAVE_ACTIVEMEMBERSHIP_CHANGEDATE_SUCCESS:
                  return { ...state, dialogLoading : false,disabled : false,chgMembershipdateModal : false , membershipdata : null , membershipdata_old : null,membershipeditdatesuccess : 1};

       case GET_MEMBERPROFILE_MEMBERSHIP:
              if(action.payload)
                 {
                    state.memberid = action.payload;
                 }
          return { ...state};

      case GET_MEMBERPROFILE_MEMBERSHIP_SUCCESS:
                 let activemembership = action.payload.data;

                 activemembership = activemembership.filter(x => x.servicetype == 1);

                 let activeaddonservice = action.payload.data;

                 activeaddonservice = activeaddonservice.filter(x => x.servicetype == 3);

                 let activept = action.payload.data;
                 activept = activept.filter(x => x.servicetype == 2 && x.activity == 2)

                 let activegs = action.payload.data;
                 activegs = activegs.filter(x => x.servicetype == 2 && x.activity == 1)


                 activemembership.forEach((membership) => {

                   let resp = '';
                       if(membership.minutesleft && membership.minutesleft > 0)
                        {
                          let Minhourleft = convertMinToHourMin(membership.minutesleft);
                           resp += Minhourleft.hh + " Hours " +  Minhourleft.mm  +" Min. in ";
                        }

                        if(membership.daysleft == 0)
                        {
                         resp += "Today last day";
                        }
                        else
                        {
                         resp += membership.daysleft + " Days left";
                        }

                        membership.daysleftlabel = resp;
                    })


                     activept.forEach((pt) => {
                       pt.sessiontypename = pt.sessiontypename ? pt.sessiontypename : "Any";
                       let resp = '';
                        if(pt.measurementunit == 2)
                            {
                               resp += pt.sessionleft  +" Sessions  (" + pt.sessiontypename + ") & ";
                            }
                            if(pt.daysleft == 0)
                            {
                             resp += "Today last day";
                            }
                            else
                            {
                             resp += pt.daysleft + " Days left";
                            }
                            if(pt.measurementunit == 1)
                                {
                                   resp += " (" + pt.sessiontypename + ")";
                                }
                            pt.daysleftlabel = resp;
                        })

                        activegs.forEach((gs) => {
                          gs.sessiontypename = gs.sessiontypename ? gs.sessiontypename : "Any";
                          let resp = '';
                           if(gs.measurementunit == 2)
                               {
                                  resp += gs.sessionleft  +" Sessions  (" + gs.sessiontypename + ") & ";
                               }
                               if(gs.daysleft == 0)
                               {
                                resp += "Today last day";
                               }
                               else
                               {
                                resp += gs.daysleft + " Days left";
                               }
                               if(gs.measurementunit == 1)
                               {
                                  resp += " (" + gs.sessiontypename + ")";
                               }
                               gs.daysleftlabel = resp;
                           })

                 return { ...state, activemembership : activemembership,activept : activept,activegs : activegs,activeaddonservice : activeaddonservice };

      case OPEN_MEMBERSHIP_CHANGEDATE_MODEL :
              let requestData = action.payload.requestData;
                 return { ...state, chgMembershipdateModal : true ,membershipdata:requestData,membershipdata_old : cloneDeep(requestData),membershipeditdatesuccess : 0};

      case CLOSE_MEMBERSHIP_CHANGEDATE_MODEL:
                 return { ...state, chgMembershipdateModal : false , membershipdata : null , membershipdata_old : null};

      case OPEN_CANCEL_PAYMENT_MODEL :
                 return { ...state, cancelpaymentdialog : true ,cancelpaymentdata:action.payload.data};

     case CLOSE_CANCEL_PAYMENT_MODEL:
              return { ...state, cancelpaymentdialog : false , cancelpaymentdata : null}

      case SAVE_CANCEL_PAYMENT:
                return { ...state,  dialogLoading : true, disabled : true ,iscancelpaymentsucess : false};
      case SAVE_CANCEL_PAYMENT_SUCCESS:
                return { ...state, dialogLoading : false,cancelpaymentdata : null,cancelpaymentdialog : false,iscancelpaymentsucess : true};

      case OPEN_EDIT_MEMBER_CHANGESTATUS_MODEL :
                return { ...state, editMemberChangestatusModal : true ,editMode : false,editMembers :null,editchangestatusdata : action.payload};
      case CLOSE_EDIT_MEMBER_CHANGESTATUS_MODEL:
                return { ...state, editMemberChangestatusModal : false ,editMode : false,editMembers :null,editchangestatusdata : null};
      case SAVE_MEMBER_STATUS:
                return { ...state,dialogLoading : true, disabled : true};
      case SAVE_MEMBER_STATUS_SUCCESS:
                return { ...state,editMemberChangestatusModal : false,dialogLoading : false,editchangestatusdata : null, disabled : false};
      case OPEN_MEMBER_BALANCE_ADJUSTMENT_MODEL :
                return { ...state, opnMemberbalanceadjustmentModal : true ,editMode : false,editMembers :null,balanceadjustmentdata : action.payload};
      case CLOSE_MEMBER_BALANCE_ADJUSTMENT_MODEL:
                return { ...state, opnMemberbalanceadjustmentModal : false ,editMode : false,editMembers :null,balanceadjustmentdata : null};
      case SAVE_MEMBER_BALANCE_ADJUSTMENT:
                return { ...state,dialogLoading : true, disabled : true,isbalanceadjustmentsuccess : false};
      case SAVE_MEMBER_BALANCE_ADJUSTMENT_SUCCESS:
                return { ...state,opnMemberbalanceadjustmentModal : false,dialogLoading : false,balanceadjustmentdata : null, disabled : false,isbalanceadjustmentsuccess : true,balanceadjustmentID : action.payload.balanceadjustmentID,balanceadjustmentType : action.payload.balanceadjustmentType};

      case MEMBER_HANDLE_CHANGE_SELECT_ALL:

        let membersList = state.members;
        var selectAll = !state.selectAll;
        membersList.forEach(x => x.checked = action.payload.value);
        return update(state, {
              selectAll: { $set:selectAll },
          });

      case MEMBER_HANDLE_SINGLE_CHECKBOX_CHANGE:
        let memberIndex = state.members.indexOf(action.payload.data);
        return update(state, {
          members: {
            [memberIndex]: {
              checked: { $set: action.payload.value },
            }
        }
      });

      case OPEN_CHANGE_MEMBER_SALESBY_MODEL :
               return { ...state, opnChangeMemberSalesbyDialog : true,editMode : false , editMembers : null,changemembersalesbydata : action.payload};

      case CLOSE_CHANGE_MEMBER_SALESBY_MODEL:
               return { ...state, opnChangeMemberSalesbyDialog : false, editMode : false , editMembers : null ,changemembersalesbydata : null};

      case SAVE_CHANGE_MEMBER_SALESBY:
               return { ...state,dialogLoading : true, disabled : true};

      case SAVE_CHANGE_MEMBER_SALESBY_SUCCESS:
                              return { ...state,opnChangeMemberSalesbyDialog : false,dialogLoading : false,changemembersalesbydata : null,editMode : false, editMembers : null, disabled : false};

      default: return { ...state};
    }
}
