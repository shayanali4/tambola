import axios from 'axios';
import Auth from '../Auth/Auth';
import CustomConfig from '../constants/custom-config';
import {deviceDetect} from 'react-device-detect';

const authObject = new Auth();

let call = {};

axios.defaults.headers.common['Authorization'] = authObject.getToken();

var instanceAxios =  axios.create({
        baseURL: CustomConfig.serverUrl,
        timeout: 60000
   });

   instanceAxios.interceptors.request.use(function (config) {
       // Do something before request is sent
       config.headers['Authorization'] = authObject.getToken();
       let deviceinfo = deviceDetect();
       config.headers['deviceinfo'] = JSON.stringify(deviceinfo);

       let url = config.url;

       if(config.headers.ARAT != 1)
       {
         if (call[url]) {
           call[url].cancel("ORAT");
         }
          call[url] = axios.CancelToken.source();
          config.cancelToken = call[url].token
       }

       return config;
     }, function (error) {

       // Do something with request error
       return Promise.reject(error);
     });

   instanceAxios.interceptors.response.use(function (response) {
     return response;
   }, function (error) {
    const originalRequest = error.config;

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;

         let requestData = new URLSearchParams();
         requestData.append('client_id', localStorage.getItem('url_id'));
         requestData.append('client_secret', localStorage.getItem('url_id'));
         requestData.append('grant_type' , 'refresh_token');
         requestData.append('refresh_token', localStorage.getItem('refresh_token'));

         return instanceAxios.post('oauth/token', requestData)
           .then(({data}) => {

             data.clientId = localStorage.getItem('url_id');
             authObject.setSession(data);
             originalRequest.headers['Authorization'] = authObject.getToken();
             return axios(originalRequest);
           });
       }
       else if((error.response && error.response.status === 400 && error.response.data.error_description && error.response.data.error_description.indexOf('refresh token has expired') > -1) || (error.response && error.response.status === 503 && error.response.data.error_description && error.response.data.error_description.indexOf('Token') > -1) ||  (originalRequest && originalRequest._retry))
       {
               authObject.logout();
       }
       else if(error && error.message == "ORAT")
       {
         error = {response : { data : { ORAT : "Only one request allowed at a time." } }};
       }

     return Promise.reject(error);
   });

export default instanceAxios;

export const fileUploadConfig = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

export const fileDownloadConfig = {
            responseType: 'blob'
        }
