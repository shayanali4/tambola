/**
 * Member Management Sagas
 */
import { all, call, fork, put, takeEvery,select } from 'redux-saga/effects';
import FormData from 'form-data';
import {equipmentReducer,settings} from './states';
import { push } from 'connected-react-router';
// api
import api, {fileUploadConfig} from 'Api';
import {setDateTime,cloneDeep,setLocalDate} from 'Helpers/helpers';

import {
    SAVE_EQUIPMENT,
    GET_EQUIPMENT,
    OPEN_VIEW_EQUIPMENT_MODEL,
    OPEN_EDIT_EQUIPMENT_MODEL,
    DELETE_EQUIPMENT,

    GET_EQUIPMENT_INSTOCK,
    OPEN_VIEW_EQUIPMENT_INSTOCK_MODEL,
    SAVE_EQUIPMENT_INSTOCK_MAINTENANCE,

    GET_EQUIPMENT_PURCHASED,
    OPEN_VIEW_EQUIPMENT_PURCHASED_MODEL,
    OPEN_EDIT_EQUIPMENT_PURCHASED_MODEL,
    SAVE_EQUIPMENT_PURCHASED,
    DELETE_EQUIPMENT_PURCHASED,

    SAVE_EQUIPMENT_BRAND,
    GET_EQUIPMENT_BRAND,
    DELETE_EQUIPMENT_BRAND,
} from 'Actions/types';

import {
    saveEquipmentSuccess,
    getEquipmentSuccess,
    viewEquipmentSuccess,
    editEquipmentSuccess,

    getEquipmentInstockSuccess,
    viewEquipmentInstockSuccess,
    saveEquipmentinstockMaintenanceSuccess,

    getEquipmentPurchasedSuccess,
    viewEquipmentPurchasedSuccess,
    editEquipmentPurchasedSuccess,
    saveEquipmentPurchasedSuccess,

    saveEquipmentBrandSuccess,
    getEquipmentBrandSuccess,

    showLoader,
    hideLoader,
    requestFailure,
    requestSuccess
} from 'Actions';

/**
 * Send Product Save Request To Server
 */
const saveEquipmentRequest = function* (data)
{
  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

    data.equipmentdetail.imageFiles.map((files) =>
    formData.append("files", files));

    let response = yield api.post('save-equipment',  formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveEquipmentFromServer(action) {
    try {

        const response = yield call(saveEquipmentRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {

            const {equipmentdetail} = action.payload;
            if(equipmentdetail.id && equipmentdetail.id != 0)
            {
              yield put(requestSuccess("Equipment updated successfully."));
            }
            else {
              yield put(requestSuccess("Equipment created successfully."));
            }
            yield put(saveEquipmentSuccess());
              yield call(getEquipmentFromServer);
              yield put(push('/app/equipment/equipmentlibrary'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveEquipment() {
    yield takeEvery(SAVE_EQUIPMENT, saveEquipmentFromServer);
}

const getEquipmentRequest = function* (data)
{let response = yield  api.post('get-equipment', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getEquipmentFromServer(action) {
    try {

        const state = yield select(equipmentReducer);
        const response = yield call(getEquipmentRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getEquipmentSuccess({data : response[0] , pages : response[1]}));
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
export function* getEquipment() {
    yield takeEvery(GET_EQUIPMENT, getEquipmentFromServer);
}

const viewEquipmentRequest = function* (data)
{  let response = yield api.post('view-equipment', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

function* viewEquipmentFromServer(action) {
   try {

       const response = yield call(viewEquipmentRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(viewEquipmentSuccess({data : response[0]}));
       }
       else {
         yield put(requestFailure(response.errorMessage));
       }

   } catch (error) {
       console.log(error);
   }
   finally
   {

   }
}

export function* opnViewEquipmentModel() {
   yield takeEvery(OPEN_VIEW_EQUIPMENT_MODEL, viewEquipmentFromServer);
}

function* editEquipmentFromServer(action) {
    try {

        const response = yield call(viewEquipmentRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(editEquipmentSuccess({data : response[0]}));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }
    } catch (error) {
        console.log(error);
    }

}

export function* opnEditEquipmentModel() {
    yield takeEvery(OPEN_EDIT_EQUIPMENT_MODEL, editEquipmentFromServer);
}

const deleteEquipmentRequest = function* (data)
{  let response = yield api.post('delete-equipment', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

 function* deleteEquipmentFromServer(action) {
     try {

       const response = yield call(deleteEquipmentRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Equipment deleted successfully."));
             yield call(getEquipmentFromServer);
        }
        else {
           yield put(requestFailure(response.errorMessage));
        }

     } catch (error) {
         console.log(error);
     }

 }

export function* deleteEquipment() {
    yield takeEvery(DELETE_EQUIPMENT, deleteEquipmentFromServer);
}


const getEquipmentInstockRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "purchasedate" || x.id == "maintenancedate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-equipment-instock', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getEquipmentInstockFromServer(action) {
    try {

        const state = yield select(equipmentReducer);
        const state1 = yield select(settings);

         state.tableInfo.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getEquipmentInstockRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getEquipmentInstockSuccess({data : response[0] , pages : response[1]}));
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
 * Get equipment
 */
export function* getEquipmentInstock() {
    yield takeEvery(GET_EQUIPMENT_INSTOCK, getEquipmentInstockFromServer);
}

const viewEquipmentInstockRequest = function* (data)
{  let response = yield api.post('view-equipment-instock', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

function* viewEquipmentInstockFromServer(action) {
   try {

       const response = yield call(viewEquipmentInstockRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(viewEquipmentInstockSuccess({data : response[0]}));
       }
       else {
         yield put(requestFailure(response.errorMessage));
       }

   } catch (error) {
       console.log(error);
   }
   finally
   {

   }
}

export function* opnViewEquipmentInstockModel() {
   yield takeEvery(OPEN_VIEW_EQUIPMENT_INSTOCK_MODEL, viewEquipmentInstockFromServer);
}




const saveEquipmentBrandRequest = function* (data)
{
    let response = yield api.post('save-equipment-brand', data)
        .then(response => response.data)
        .catch(error => error.response.data )
    return response;
}

function* saveEquipmentBrandFromServer(action) {
    try {

        const response = yield call(saveEquipmentBrandRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {

            const {branddetail} = action.payload;
            if(branddetail.id && branddetail.id != 0)
            {
              yield put(requestSuccess("Brand updated successfully."));
            }
            else {
              yield put(requestSuccess("Brand created successfully."));
            }
            yield put(saveEquipmentBrandSuccess());
              yield call(getEquipmentBrandFromServer);
              yield put(push('/app/equipment/brands'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveEquipmentBrand() {
    yield takeEvery(SAVE_EQUIPMENT_BRAND, saveEquipmentBrandFromServer);
}


const getEquipmentBrandRequest = function* (data)
{let response = yield  api.post('get-equipment-brand', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getEquipmentBrandFromServer(action) {
    try {

        const state = yield select(equipmentReducer);
        const response = yield call(getEquipmentBrandRequest, state.tableInfo);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getEquipmentBrandSuccess({data : response[0] , pages : response[1]}));
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


export function* getEquipmentBrand() {
    yield takeEvery(GET_EQUIPMENT_BRAND, getEquipmentBrandFromServer);
}

const deleteEquipmentBrandRequest = function* (data)
{  let response = yield api.post('delete-equipment-brand', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

 function* deleteEquipmentBrandFromServer(action) {
     try {

       const response = yield call(deleteEquipmentBrandRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Brand deleted successfully."));
             yield call(getEquipmentBrandFromServer);
        }
        else {
           yield put(requestFailure(response.errorMessage));
        }

     } catch (error) {
         console.log(error);
     }

 }

export function* deleteEquipmentBrand() {
    yield takeEvery(DELETE_EQUIPMENT_BRAND, deleteEquipmentBrandFromServer);
}


const getEquipmentPurchasedRequest = function* (data)
{
  data = cloneDeep(data);
  data.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

  data.filtered.map(x => {
    if(x.id == "purchasedate" || x.id == "maintenancedate") {
      x.value = setLocalDate(x.value)
    }
  });
  let response = yield  api.post('get-equipment-purchased', data)
        .then(response => response.data)
        .catch(error => error.response.data);

      return response;
}

function* getEquipmentPurchasedFromServer(action) {
    try {

        const state = yield select(equipmentReducer);
        const state1 = yield select(settings);

         state.tableInfoEquipmentPurchased.branchid = state1.userProfileDetail.defaultbranchid;
        const response = yield call(getEquipmentPurchasedRequest, state.tableInfoEquipmentPurchased);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(getEquipmentPurchasedSuccess({data : response[0] , pages : response[1]}));
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

export function* getEquipmentPurchased() {
    yield takeEvery(GET_EQUIPMENT_PURCHASED, getEquipmentPurchasedFromServer);
}


const viewEquipmentPurchasedRequest = function* (data)
{  let response = yield api.post('view-equipment-purchased', data)
      .then(response => response.data)
      .catch(error => error.response.data )

    return response;
}

function* viewEquipmentPurchasedFromServer(action) {
   try {

       const response = yield call(viewEquipmentPurchasedRequest,action.payload);

       if(!(response.errorMessage  || response.ORAT))
       {
           yield put(viewEquipmentPurchasedSuccess({data : response[0]}));
       }
       else {
         yield put(requestFailure(response.errorMessage));
       }

   } catch (error) {
       console.log(error);
   }
   finally
   {

   }
}

export function* opnViewEquipmentPurchasedModel() {
   yield takeEvery(OPEN_VIEW_EQUIPMENT_PURCHASED_MODEL, viewEquipmentPurchasedFromServer);
}

function* editEquipmentPurchasedFromServer(action) {
    try {

        const response = yield call(viewEquipmentPurchasedRequest,action.payload);
        if(!(response.errorMessage  || response.ORAT))
        {
            yield put(editEquipmentPurchasedSuccess({data : response[0]}));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }
    } catch (error) {
        console.log(error);
    }

}

export function* opnEditEquipmentPurchasedModel() {
    yield takeEvery(OPEN_EDIT_EQUIPMENT_PURCHASED_MODEL, editEquipmentPurchasedFromServer);
}


/**
 * Send Equipment In-stock Save Request To Server
 */
const saveEquipmentPurchasedRequest = function* (data)
{
  data = cloneDeep(data);
  data.equipmentPurchaseddetail.purchasedate = setLocalDate(data.equipmentPurchaseddetail.purchasedate);
  data.equipmentPurchaseddetail.equipmentPurchasedItem.map(x => {
      x.maintenancedate = x.maintenancedate ? setLocalDate(x.maintenancedate) : null;
      x.warrantyenddate = x.warrantyenddate ? setLocalDate(x.warrantyenddate) : null;
  });

  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, JSON.stringify(data[key]));
  }

    data.equipmentPurchaseddetail.imageFiles.map((files) =>
    formData.append("files", files));

    let response = yield api.post('save-equipment-purchased',  formData, fileUploadConfig)
        .then(response => response.data)
        .catch(error => error.response.data)

    return response;
}

function* saveEquipmentPurchasedFromServer(action) {
    try {
      const state = yield select(settings);

      action.payload.equipmentPurchaseddetail.branchid = state.userProfileDetail.defaultbranchid;
        const response = yield call(saveEquipmentPurchasedRequest,action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {

            const {equipmentPurchaseddetail} = action.payload;
            if(equipmentPurchaseddetail.id && equipmentPurchaseddetail.id != 0)
            {
              yield put(requestSuccess("Equipment invoice updated successfully."));
            }
            else {
              yield put(requestSuccess("Equipment invoice added successfully."));
            }
            yield put(saveEquipmentPurchasedSuccess());
              yield call(getEquipmentPurchasedFromServer);
              yield put(push('/app/equipment/equipmentpurchased'));
        }
        else {
          yield put(requestFailure(response.errorMessage));
        }

    } catch (error) {
        console.log(error);
    }
}

export function* saveEquipmentPurchased() {
    yield takeEvery(SAVE_EQUIPMENT_PURCHASED, saveEquipmentPurchasedFromServer);
}



const deleteEquipmentPurchasedRequest = function* (data)
{  let response = yield api.post('delete-equipment-purchased', data)
      .then(response => response.data)
      .catch(error => error.response.data )
    return response;
}

 function* deleteEquipmentPurchasedFromServer(action) {
     try {

       const response = yield call(deleteEquipmentPurchasedRequest, action.payload);

        if(!(response.errorMessage  || response.ORAT))
        {
             yield put(requestSuccess("Equipment invoice deleted successfully."));
             yield call(getEquipmentPurchasedFromServer);
        }
        else {
           yield put(requestFailure(response.errorMessage));
        }

     } catch (error) {
         console.log(error);
     }

 }

export function* deleteEquipmentPurchased() {
    yield takeEvery(DELETE_EQUIPMENT_PURCHASED, deleteEquipmentPurchasedFromServer);
}



const saveEquipmentinstockMaintenanceRequest = function* (data)
{
  data = cloneDeep(data);
  data.equipmentinstock.maintenancedate = setLocalDate(data.equipmentinstock.maintenancedate);

    let response = yield api.post('save-equipment-instock-maintenance', data)
        .then(response => response.data)
        .catch(error => error.response.data )

    return response;
}

function* saveEquipmentinstockMaintenanceFromServer(action) {
    try {
      const state = yield select(settings);

      action.payload.defaultbranchid = state.userProfileDetail.defaultbranchid;
      const response = yield call(saveEquipmentinstockMaintenanceRequest,action.payload);
      if(!(response.errorMessage  || response.ORAT))
      {
            yield put(requestSuccess("Maintenance date updated successfully."));
              yield  put(saveEquipmentinstockMaintenanceSuccess());
              yield call(getEquipmentInstockFromServer);
          }
          else {
            yield put(requestFailure(response.errorMessage));
          }

      } catch (error) {
          console.log(error);
      }
      }

export function* saveEquipmentinstockMaintenance() {
    yield takeEvery(SAVE_EQUIPMENT_INSTOCK_MAINTENANCE, saveEquipmentinstockMaintenanceFromServer);
}


/**
 * Equipment Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(saveEquipment),
        fork(getEquipment),
        fork(opnViewEquipmentModel),
        fork(opnEditEquipmentModel),
        fork(deleteEquipment),
        fork(opnViewEquipmentInstockModel),
        fork(getEquipmentInstock),
        fork(saveEquipmentBrand),
        fork(getEquipmentBrand),
        fork(deleteEquipmentBrand),
        fork(getEquipmentPurchased),
        fork(opnViewEquipmentPurchasedModel),
        fork(opnEditEquipmentPurchasedModel),
        fork(saveEquipmentPurchased),
        fork(deleteEquipmentPurchased),
        fork(saveEquipmentinstockMaintenance),
    ]);
}
