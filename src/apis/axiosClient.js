import axios from 'axios';
import queryString from 'query-string';


const axiosClient = axios.create({
   baseURL: process.env.REACT_APP_API_URL,
   headers: {
      'content-type': 'application/json'
   },
   paramsSerializer: (searchParam) => {
      return queryString.stringify(searchParam);
   }
});

let RefeshTokenApi = null;
// Do something before request
axiosClient.interceptors.request.use((config) => {
   
}, (err) => {
   return new Promise.reject(err);
});

axiosClient.interceptors.response.use((response) => {
   if (response && response.data) return response.data;
   return response;
}, (err) => {
   return new Promise.reject(err);
});

export default axiosClient;