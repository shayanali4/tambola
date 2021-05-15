import ExpensePaymentMode from 'Assets/data/expensepaymentmode';

import {
  OPEN_ADD_NEW_EQUIPMENT_MODEL,
  CLOSE_ADD_NEW_EQUIPMENT_MODEL,
  SAVE_EQUIPMENT,
  SAVE_EQUIPMENT_SUCCESS,
  GET_EQUIPMENT,
  GET_EQUIPMENT_SUCCESS,
  OPEN_VIEW_EQUIPMENT_MODEL,
  OPEN_VIEW_EQUIPMENT_MODEL_SUCCESS,
  CLOSE_VIEW_EQUIPMENT_MODEL,
  OPEN_EDIT_EQUIPMENT_MODEL,
  OPEN_EDIT_EQUIPMENT_MODEL_SUCCESS,


  SAVE_EQUIPMENT_PURCHASED,
  SAVE_EQUIPMENT_PURCHASED_SUCCESS,
  GET_EQUIPMENT_INSTOCK,
  GET_EQUIPMENT_INSTOCK_SUCCESS,
  OPEN_VIEW_EQUIPMENT_INSTOCK_MODEL,
  OPEN_VIEW_EQUIPMENT_INSTOCK_MODEL_SUCCESS,
  CLOSE_VIEW_EQUIPMENT_INSTOCK_MODEL,

  OPEN_VIEW_EQUIPMENT_INSTOCK_MAINTENANCE_MODEL,
  OPEN_VIEW_EQUIPMENT_INSTOCK_MAINTENANCE_MODEL_SUCCESS,
  CLOSE_VIEW_EQUIPMENT_INSTOCK_MAINTENANCE_MODEL,
  SAVE_EQUIPMENT_INSTOCK_MAINTENANCE,
  SAVE_EQUIPMENT_INSTOCK_MAINTENANCE_SUCCESS,

  DELETE_EQUIPMENT_PURCHASED,

  GET_EQUIPMENT_PURCHASED,
  GET_EQUIPMENT_PURCHASED_SUCCESS,
  OPEN_VIEW_EQUIPMENT_PURCHASED_MODEL,
  OPEN_VIEW_EQUIPMENT_PURCHASED_MODEL_SUCCESS,
  CLOSE_VIEW_EQUIPMENT_PURCHASED_MODEL,
  OPEN_EDIT_EQUIPMENT_PURCHASED_MODEL,
  OPEN_EDIT_EQUIPMENT_PURCHASED_MODEL_SUCCESS,
  OPEN_ADD_NEW_EQUIPMENT_PURCHASED_MODEL,
  CLOSE_ADD_NEW_EQUIPMENT_PURCHASED_MODEL,

  OPEN_ADD_NEW_EQUIPMENT_BRAND_MODEL,
  CLOSE_ADD_NEW_EQUIPMENT_BRAND_MODEL,
  SAVE_EQUIPMENT_BRAND,
  SAVE_EQUIPMENT_BRAND_SUCCESS,
  GET_EQUIPMENT_BRAND,
  GET_EQUIPMENT_BRAND_SUCCESS,
  OPEN_EDIT_EQUIPMENT_BRAND_MODEL,
  DELETE_EQUIPMENT_BRAND,

  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		 equipment: null, // initial member data
       loading : false,
       disabled : false,
       dialogLoading : false,
       editequipment : null,
       editMode : false,
       addNewEquipmentModal : false,
       viewEquipmentDialog:false,
       selectedequipment: null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      tableInfoEquipmentPurchased : {
       pageSize : 10,
       pageIndex : 0,
       pages : 1,
       totalrecord :0,
     },

      equipmentinstock :null,
      viewEquipmentInstockDialog : false,
      selectedequipmentInstock : null,

      equipmentpurchased :null,
      viewEquipmentPurchasedDialog : false,
      selectedequipmentPurchased : null,
      addNewEquipmentPurchasedModal : false,
      editModePurchased : false,
      editequipmentPurchased : null,

      addNewEquipmentBrandModal : false,
      equipmentbrandList: null,
      editequipmentbrand : null,

      viewEquipmentinstockMaintenance : null,
      viewEquipmentinstockMaintenanceDialog:false,
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

          case REQUEST_FAILURE:
          return { ...state ,  dialogLoading : false, disabled : false};

          case REQUEST_SUCCESS:
          return { ...state};

        case ON_SHOW_LOADER:
            return { ...state, loading: true };

        case ON_HIDE_LOADER:
            return { ...state, loading : false };

        case OPEN_ADD_NEW_EQUIPMENT_MODEL :
            return { ...state, addNewEquipmentModal : true ,editMode : false , editequipment : null };
        case CLOSE_ADD_NEW_EQUIPMENT_MODEL:
            return { ...state, addNewEquipmentModal : false ,editMode : false , editequipment : null};
        case SAVE_EQUIPMENT:
            return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_EQUIPMENT_SUCCESS:
            return { ...state, dialogLoading : false,addNewEquipmentModal : false ,  editMode : false, editequipment : null, disabled : false};
        case GET_EQUIPMENT:
                let tableInfo = state.tableInfo;

                if(action.payload)
                {
                  if(action.payload.state)
                  {
                    tableInfo.pageIndex  = action.payload.state.page;
                    tableInfo.pageSize  = action.payload.state.pageSize;
                    tableInfo.sorted  = action.payload.state.sorted;
                    tableInfo.filtered = action.payload.state.filtered;
                      tableInfo.equipmentlibraryfilter = action.payload.state.equipmentlibraryfilter;
                        tableInfo.customequipmentfilter = action.payload.state.customequipmentfilter;
                  }
                  else if(action.payload.equipmentlibraryfilter || action.payload.customequipmentfilter) {
                      tableInfo.equipmentlibraryfilter = action.payload.equipmentlibraryfilter;
                      tableInfo.customequipmentfilter = action.payload.customequipmentfilter;
                  }
                }

            return { ...state , tableInfo : tableInfo};
        case GET_EQUIPMENT_SUCCESS:
            return { ...state, equipment: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

        case CLOSE_VIEW_EQUIPMENT_MODEL:
            return { ...state, viewEquipmentDialog : false , selectedequipment : null};
        case OPEN_VIEW_EQUIPMENT_MODEL:
            return { ...state, viewEquipmentDialog : true , selectedequipment : null};
        case OPEN_VIEW_EQUIPMENT_MODEL_SUCCESS:
              let selectedequipment = action.payload.data[0];
              if(selectedequipment)
              {
                 selectedequipment.images =  selectedequipment.images ? JSON.parse(selectedequipment.images) : [];
              }
            return { ...state, selectedequipment:selectedequipment };
        case OPEN_EDIT_EQUIPMENT_MODEL:
            return { ...state, addNewEquipmentModal : true, editMode : true, editequipment: null };
        case OPEN_EDIT_EQUIPMENT_MODEL_SUCCESS:
            let editequipment = action.payload.data[0];
            if(editequipment)
            {
               editequipment.images =editequipment.images ? JSON.parse(editequipment.images) : [];
            }
            return { ...state , editequipment : editequipment };


        case GET_EQUIPMENT_INSTOCK:
                      let tableInfoInstock = state.tableInfo;
                        if(action.payload)
                        {
                          tableInfoInstock.pageIndex  = action.payload.state.page;
                          tableInfoInstock.pageSize  = action.payload.state.pageSize;
                          tableInfoInstock.sorted  = action.payload.state.sorted;
                          tableInfoInstock.filtered = action.payload.state.filtered;
                        }
                  return { ...state , tableInfo : tableInfoInstock};
          case GET_EQUIPMENT_INSTOCK_SUCCESS:
                  return { ...state, equipmentinstock: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

        case CLOSE_VIEW_EQUIPMENT_INSTOCK_MODEL:
                  return { ...state, viewEquipmentInstockDialog : false , selectedequipmentInstock : null};
        case OPEN_VIEW_EQUIPMENT_INSTOCK_MODEL:
                  return { ...state, viewEquipmentInstockDialog : true , selectedequipmentInstock : null};
        case OPEN_VIEW_EQUIPMENT_INSTOCK_MODEL_SUCCESS:
                  return { ...state, selectedequipmentInstock:action.payload.data[0] };

         case OPEN_ADD_NEW_EQUIPMENT_BRAND_MODEL :
                return { ...state, addNewEquipmentBrandModal : true ,editMode : false , editequipmentbrand : null };
         case CLOSE_ADD_NEW_EQUIPMENT_BRAND_MODEL:
                return { ...state, addNewEquipmentBrandModal : false ,editMode : false , editequipmentbrand : null};
         case SAVE_EQUIPMENT_BRAND:
               return { ...state,  dialogLoading : true, disabled : true };
         case SAVE_EQUIPMENT_BRAND_SUCCESS:
               return { ...state, dialogLoading : false,addNewEquipmentBrandModal : false ,  editMode : false, editequipmentbrand : null, disabled : false};
         case GET_EQUIPMENT_BRAND:
                let tableInfoBrandList = state.tableInfo;

                if(action.payload)
                {
                  if(action.payload.state)
                  {
                    tableInfoBrandList.pageIndex  = action.payload.state.page;
                    tableInfoBrandList.pageSize  = action.payload.state.pageSize;
                    tableInfoBrandList.sorted  = action.payload.state.sorted;
                    tableInfoBrandList.filtered = action.payload.state.filtered;
                    tableInfoBrandList.brandlibraryfilter = action.payload.state.brandlibraryfilter;
                    tableInfoBrandList.custombrandfilter = action.payload.state.custombrandfilter;
                  }
                  else if(action.payload.brandlibraryfilter || action.payload.custombrandfilter) {
                      tableInfoBrandList.brandlibraryfilter = action.payload.brandlibraryfilter;
                      tableInfoBrandList.custombrandfilter = action.payload.custombrandfilter;
                  }
                }

                return { ...state , tableInfo : tableInfoBrandList};
          case GET_EQUIPMENT_BRAND_SUCCESS:
                return { ...state, equipmentbrandList: action.payload.data , tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };
          case OPEN_EDIT_EQUIPMENT_BRAND_MODEL:
                return { ...state, addNewEquipmentBrandModal : true, editMode : true, editequipmentbrand: action.payload };

          case GET_EQUIPMENT_PURCHASED:
                        let tableInfoEquipmentPurchased = state.tableInfoEquipmentPurchased;
                          if(action.payload)
                          {
                            tableInfoEquipmentPurchased.pageIndex  = action.payload.state.page;
                            tableInfoEquipmentPurchased.pageSize  = action.payload.state.pageSize;
                            tableInfoEquipmentPurchased.sorted  = action.payload.state.sorted;
                            tableInfoEquipmentPurchased.filtered = action.payload.state.filtered;
                          }
                    return { ...state , tableInfoEquipmentPurchased : tableInfoEquipmentPurchased};
            case GET_EQUIPMENT_PURCHASED_SUCCESS:
                    return { ...state, equipmentpurchased: action.payload.data , tableInfoEquipmentPurchased : {...state.tableInfoEquipmentPurchased , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };

            case OPEN_VIEW_EQUIPMENT_PURCHASED_MODEL:
                      return { ...state, viewEquipmentPurchasedDialog : true , selectedequipmentPurchased : null};
            case OPEN_VIEW_EQUIPMENT_PURCHASED_MODEL_SUCCESS:
                        let selectedequipmentPurchased = action.payload.data[0];
                        if(selectedequipmentPurchased)
                        {
                           selectedequipmentPurchased.images =  selectedequipmentPurchased.images ? JSON.parse(selectedequipmentPurchased.images) : [];
                           if(selectedequipmentPurchased.expensedetail){
                             selectedequipmentPurchased.expensedetail.forEach(x => x.paymentmodeid = ExpensePaymentMode.filter(value => value.name == x.paymentMode)[0].value)
                           }
                        }
                      return { ...state, selectedequipmentPurchased:selectedequipmentPurchased };
            case CLOSE_VIEW_EQUIPMENT_PURCHASED_MODEL:
                      return { ...state, viewEquipmentPurchasedDialog : false , selectedequipmentPurchased : null};

            case OPEN_EDIT_EQUIPMENT_PURCHASED_MODEL:
                    return { ...state, addNewEquipmentPurchasedModal : true, editModePurchased : true, editequipmentPurchased: null };

            case OPEN_EDIT_EQUIPMENT_PURCHASED_MODEL_SUCCESS:
                      let editequipmentPurchased = action.payload.data[0];
                      if(editequipmentPurchased)
                      {
                         editequipmentPurchased.images = editequipmentPurchased.images ? JSON.parse(editequipmentPurchased.images) : [];
                      }
                      return { ...state , editequipmentPurchased : editequipmentPurchased };


            case OPEN_ADD_NEW_EQUIPMENT_PURCHASED_MODEL :
                  return { ...state, addNewEquipmentPurchasedModal : true ,editModePurchased : false , editequipmentPurchased : null };
            case CLOSE_ADD_NEW_EQUIPMENT_PURCHASED_MODEL:
                  return { ...state, addNewEquipmentPurchasedModal : false ,editModePurchased : false , editequipmentPurchased : null};

            case SAVE_EQUIPMENT_PURCHASED:
                      return { ...state,  dialogLoading : true, disabled : true };
            case SAVE_EQUIPMENT_PURCHASED_SUCCESS:
                      return { ...state, dialogLoading : false,addNewEquipmentPurchasedModal : false ,  editModePurchased : false, editequipmentPurchased : null, disabled : false};

            case OPEN_VIEW_EQUIPMENT_INSTOCK_MAINTENANCE_MODEL:
                     return { ...state,viewEquipmentinstockMaintenance:action.payload,viewEquipmentinstockMaintenanceDialog : true,isEnquiryFollowupsave : false};
            case CLOSE_VIEW_EQUIPMENT_INSTOCK_MAINTENANCE_MODEL:
                     return { ...state, viewEquipmentinstockMaintenanceDialog : false,isEnquiryFollowupsave : false };

            case SAVE_EQUIPMENT_INSTOCK_MAINTENANCE:
                     return { ...state,dialogLoading : true, disabled : true};
            case SAVE_EQUIPMENT_INSTOCK_MAINTENANCE_SUCCESS:
                     return { ...state,viewEquipmentinstockMaintenanceDialog : false,dialogLoading : false,viewEquipmentinstockMaintenance : null, disabled : false};

        default: return { ...state};
    }
}
