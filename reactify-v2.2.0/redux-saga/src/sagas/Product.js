/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {productReducer,settings} from './states';
import { push } from 'connected-react-router';


// api
import api, {fileUploadConfig} from 'Api';

import {
  OPEN_ADD_NEW_PRODUCT_MODEL,
  CLOSE_ADD_NEW_PRODUCT_MODEL,
  SAVE_PRODUCT,
  GET_PRODUCTS,
  OPEN_VIEW_PRODUCT_MODEL,
  OPEN_EDIT_PRODUCT_MODEL,
  DELETE_PRODUCT,
  SAVE_ENABLEONLINESALE_PRODUCT,
  ADD_PRODUCT_QUANTITY,
} from 'Actions/types';

import {
    saveProductSuccess,
    getProductsSuccess,
    viewProductSuccess,
    editProductSuccess,
    opnAddNewProductModelSuccess,
    saveEnableOnlineSaleProductSuccess,
    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

const getTaxCodeCategoryRequest = function* (data)
{
   let response = yield api.post('taxcodecategory-list',data)
        .then(response => response.data)
        .catch(error => error.data);

    return response;
}
/**
 * Send Product Save Request To Server
 */
const saveProductRequest = function* (data)
{

  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

    data.productdetail.imageFiles.map((files) =>
    formData.append("files", files));

    let response = yield api.post('save-product', formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveProductFromServer(action) {
    try {
      const state = yield select(settings);

        action.payload.productdetail.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveProductRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {

            const {productdetail} = action.payload;
            if(productdetail.id && productdetail.id != 0)
            {
              yield put(requestSuccess("Product updated successfully."));
            }
            else {
              yield put(requestSuccess("Product created successfully."));
            }
            yield put(saveProductSuccess());
            yield call(getProductsFromServer);
            yield put(push('/app/product'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveProduct() {
    yield takeEvery(SAVE_PRODUCT, saveProductFromServer);
}

/**
 * Send Product List Request To Server
 */
const getProductsRequest = function* (data)
{let response = yield  api.post('get-product', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getProductsFromServer(action) {
    try {
        const state = yield select(productReducer);
        const state1 = yield select(settings);

        state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getProductsRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getProductsSuccess({data : response[0] , pages : response[1]}));
        }
        else {
            yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally {
    }
}

/**
 * Get Members
 */
export function* getProducts() {
    yield takeEvery(GET_PRODUCTS, getProductsFromServer);
}

/**
 * Send Product VIEW Request To Server
 */
 const viewProductRequest = function* (data)
 {  let response = yield api.post('view-product', data)
       .then(response => response.data)
       .catch(error => error.response.data )

     return response;
 }

function* viewProductFromServer(action) {
    try {
        const response = yield call(viewProductRequest,action.payload);
        const response1 = yield call(getTaxCodeCategoryRequest,{isService : 0});

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
        {
            yield put(viewProductSuccess({data : response[0],taxcodecategorylist : response1[0]}));
        }
        else {
          yield put(requestFailure(response.errorMessage || response1.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
    finally
    {

    }
}

export function* opnViewProductModel() {
    yield takeEvery(OPEN_VIEW_PRODUCT_MODEL, viewProductFromServer);
}

/**
 * Edit Product From Server
 */
function* editProductFromServer(action) {
    try {

        const response = yield call(viewProductRequest,action.payload);
        const response1 = yield call(getTaxCodeCategoryRequest,{isService : 0});

        if(!(response.errorMessage  || response.ORAT) && !response1.errorMessage)
        {
            yield put(editProductSuccess({data : response[0],taxcodecategorylist : response1[0]}));
        }
        else {
          yield put(requestFailure(response.errorMessage || response1.errorMessage));
        }
    } catch (error) {
        console.log(error);
    }
    finally
    {

    }
}

export function* opnEditProductModel() {
    yield takeEvery(OPEN_EDIT_PRODUCT_MODEL, editProductFromServer);
}

const deleteProductRequest = function* (data)
{  let response = yield api.post('delete-product', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete Employee From Server
 */
 function* deleteProductFromServer(action) {
     try {

       const response = yield call(deleteProductRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Product deleted successfully."));
             yield call(getProductsFromServer);
        }
        else {
           yield put(requestFailure(response.errorMessage));
        }

     } catch (error) {
         console.log(error);
     }
     finally{
     }
 }

/**
 * Get Employees
 */
export function* deleteProduct() {
    yield takeEvery(DELETE_PRODUCT, deleteProductFromServer);
}

const addProductQuantityRequest = function* (data)
{  let response = yield api.post('add-product-quantity', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

/**
 * Delete Employee From Server
 */
 function* addProductQuantityFromServer(action) {
     try {

       const response = yield call(addProductQuantityRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Product Quantity Added Successfully."));
             yield call(getProductsFromServer);
        }
        else {
           yield put(requestFailure(response.errorMessage));
        }

     } catch (error) {
         console.log(error);
     }
     finally{
     }
 }

/**
 * Get Employees
 */
export function* addProductQuantity() {
    yield takeEvery(ADD_PRODUCT_QUANTITY, addProductQuantityFromServer);
}

const saveEnableOnlineSaleProductRequest = function* (data)
{
    let response = yield api.post('save-bulkenablesaleonline-product', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}
/**
 * save transfer enquiry From Server
 */
function* saveEnableOnlineSaleProductFromServer(action) {
    try {
      const response = yield call(saveEnableOnlineSaleProductRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
        const data = action.payload.requestData;

          if(data.isEnable == 1)
           {
             yield put(requestSuccess("Products enabled for sale online successfully."));
            }
          else{
            yield put(requestSuccess("Products disabled for sale online successfully."));
          }
              yield  put(saveEnableOnlineSaleProductSuccess());
              yield call(getProductsFromServer);
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }


/**
 * Get EnableOnlineSaleProduct
 */
export function* saveEnableOnlineSaleProduct() {
    yield takeEvery(SAVE_ENABLEONLINESALE_PRODUCT, saveEnableOnlineSaleProductFromServer);
}


/**
* VIEW Subscription From Server
*/
function* addProductFromServer(action) {
   try {

       const response = yield call(getTaxCodeCategoryRequest,{isService : 0});
       if(!(response.errorMessage  || response.ORAT))
       {
       yield put(opnAddNewProductModelSuccess({taxcodecategorylist : response[0]}));
      }
      else {
        yield put(requestFailure(response.errorMessage ));
      }
    }catch (error) {
         console.log(error);
    }
    finally
    {
        yield put(hideLoader());
    }
}
/**
* VIEW Subscriptions
*/
export function* opnAddNewProductModel() {
   yield takeEvery(OPEN_ADD_NEW_PRODUCT_MODEL, addProductFromServer);
}


/**
 * Member Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveProduct),
        fork(getProducts),
        fork(opnViewProductModel),
        fork(opnEditProductModel),
        fork(deleteProduct),
        fork(addProductQuantity),
        fork(saveEnableOnlineSaleProduct),
        fork(opnAddNewProductModel)

    ]);
}
