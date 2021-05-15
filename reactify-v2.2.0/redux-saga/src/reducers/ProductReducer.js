/**
 * EmployeeManagement Reducer
 */
 import update from 'react-addons-update';

// action types
import {
  OPEN_ADD_NEW_PRODUCT_MODEL,
  OPEN_ADD_NEW_PRODUCT_MODEL_SUCCESS,
  CLOSE_ADD_NEW_PRODUCT_MODEL,
  SAVE_PRODUCT,
  SAVE_PRODUCT_SUCCESS,
  GET_PRODUCTS,
  GET_PRODUCTS_SUCCESS,
  OPEN_EDIT_PRODUCT_MODEL,
  OPEN_EDIT_PRODUCT_MODEL_SUCCESS,
  OPEN_VIEW_PRODUCT_MODEL,
  OPEN_VIEW_PRODUCT_MODEL_SUCCESS,
  CLOSE_VIEW_PRODUCT_MODEL,
  DELETE_PRODUCT,
  ADD_PRODUCT_QUANTITY,
  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  PRODUCT_HANDLE_CHANGE_SELECT_ALL,
  PRODUCT_HANDLE_SINGLE_CHECKBOX_CHANGE,
  OPEN_ENABLEONLINESALE_PRODUCT_MODEL,
  CLOSE_ENABLEONLINESALE_PRODUCT_MODEL,
  SAVE_ENABLEONLINESALE_PRODUCT,
  SAVE_ENABLEONLINESALE_PRODUCT_SUCCESS,
  OPEN_DISABLEONLINESALE_PRODUCT_MODEL,
  CLOSE_DISABLEONLINESALE_PRODUCT_MODEL,
  REQUEST_SUCCESS
} from 'Actions/types';

// initial state
const INIT_STATE = {
  		 product: null, // initial member data
       loading : false,
       disabled : false,
       dialogLoading : false,
       editproduct : null,
       editMode : false,
       addNewProductModal : false,
       viewProductDialog:false,
       selectedproduct: null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      selectAll: false,
      taxcodecategorylist : null

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

        case OPEN_ADD_NEW_PRODUCT_MODEL :
            return { ...state, addNewProductModal : true ,editMode : false , editproduct : null };
        case OPEN_ADD_NEW_PRODUCT_MODEL_SUCCESS:
                 return { ...state, addNewProductModal : true,taxcodecategorylist : action.payload.taxcodecategorylist };

        case CLOSE_ADD_NEW_PRODUCT_MODEL:
            return { ...state, addNewProductModal : false ,editMode : false , editproduct : null};
        case SAVE_PRODUCT:
            return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_PRODUCT_SUCCESS:
            return { ...state, dialogLoading : false,addNewProductModal : false ,  editMode : false, editproduct : null, disabled : false};
        case GET_PRODUCTS:
            let tableInfo = state.tableInfo;
              if(action.payload)
              {
                tableInfo.pageIndex  = action.payload.state.page;
                tableInfo.pageSize  = action.payload.state.pageSize;
                tableInfo.sorted  = action.payload.state.sorted;
                tableInfo.filtered = action.payload.state.filtered;
              }
          return { ...state , tableInfo : tableInfo};
          case GET_PRODUCTS_SUCCESS:
              let product = action.payload.data;
                product.map(x => {
                  x.taxgroupitem = JSON.parse(x.taxgroupitem);
                    if(x.taxgroupitem)
                    {
                      x.taxpercentage =  x.taxgroupitem.filter(z => z.checked).map(y => y.percentage).reduce((a, b) => parseFloat(a) + parseFloat(b));
                    }
                 });
               return { ...state, product: product ,selectAll : false, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };
          case OPEN_EDIT_PRODUCT_MODEL:
             return { ...state, addNewProductModal : true, editMode : true, editproduct: null };
          case OPEN_EDIT_PRODUCT_MODEL_SUCCESS:
              let editproduct = action.payload.data[0];
              if(editproduct)
              {
                 editproduct.images =  JSON.parse(editproduct.images)
              }
             return { ...state , editproduct : editproduct ,taxcodecategorylist : action.payload.taxcodecategorylist };
          case CLOSE_VIEW_PRODUCT_MODEL:
             return { ...state, viewProductDialog : false , selectedproduct : null};
          case OPEN_VIEW_PRODUCT_MODEL:
             return { ...state, viewProductDialog : true , selectedproduct : null};
          case OPEN_VIEW_PRODUCT_MODEL_SUCCESS:
              let selectedproduct = action.payload.data[0];
              if(selectedproduct)
              {
                selectedproduct.images = JSON.parse(selectedproduct.images);
              	 selectedproduct.images = selectedproduct.images || [];
              }
             return { ...state, selectedproduct:selectedproduct ,taxcodecategorylist : action.payload.taxcodecategorylist };

             case PRODUCT_HANDLE_CHANGE_SELECT_ALL:

                     var selectAll = !state.selectAll;
                     state.product.forEach(x => x.checked = action.payload.value);
                     return update(state, {
                           selectAll: { $set:selectAll },
                     });

             case PRODUCT_HANDLE_SINGLE_CHECKBOX_CHANGE:

                     let productIndex = state.product.indexOf(action.payload.data);
                     return update(state, {
                        product: {
                        [productIndex]: {
                             checked: { $set: action.payload.value },
                             }
                           }
                   });
                   case OPEN_ENABLEONLINESALE_PRODUCT_MODEL :
                                      return { ...state, opnEnableOnlineSaleProductDialog : true,editMode : false , editProduct : null,enableOnlineSaleProductdata : action.payload};
                   case CLOSE_ENABLEONLINESALE_PRODUCT_MODEL:
                                      return { ...state, opnEnableOnlineSaleProductDialog : false, editMode : false , editProduct : null ,enableOnlineSaleProductdata : null};
                   case OPEN_DISABLEONLINESALE_PRODUCT_MODEL :
                                      return { ...state, opnDisableOnlineSaleProductDialog : true,editMode : false , editProduct : null,enableOnlineSaleProductdata : action.payload};
                   case CLOSE_DISABLEONLINESALE_PRODUCT_MODEL:
                                      return { ...state, opnDisableOnlineSaleProductDialog : false, editMode : false , editProduct : null ,enableOnlineSaleProductdata : null};

                   case SAVE_ENABLEONLINESALE_PRODUCT:
                   
                                      return { ...state,dialogLoading : true, disabled : true};
                   case SAVE_ENABLEONLINESALE_PRODUCT_SUCCESS:
                                       return { ...state,opnEnableOnlineSaleProductDialog : false,opnDisableOnlineSaleProductDialog :false,dialogLoading : false,enableOnlineSaleProductdata : null,editMode : false, editProduct : null, disabled : false};


        default: return { ...state};
    }
}
