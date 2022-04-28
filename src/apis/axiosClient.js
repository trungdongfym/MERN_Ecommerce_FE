import axios from 'axios';
import queryString from 'query-string';
import RefreshTokenApi from './refreshTokenApi';
import Cookies from 'universal-cookie';


const axiosClient = axios.create({
   baseURL: process.env.REACT_APP_API_URL,
   headers: {
      'content-type': 'application/json'
   },
   paramsSerializer: (searchParam) => {
      return queryString.stringify(searchParam);
   }
});

let refeshTokenApi = null;
// Do something before request
axiosClient.interceptors.request.use(async (config) => {
   const cookie = new Cookies();
   let accessToken = cookie.get('accessToken');

   // Check a request need accesstoken
   const isRequestAuth = config.headers['x-auth'];
   if (isRequestAuth === false) {
      delete config.headers['x-auth'];
      return config;
   }
   // If accessToken expired
   if (!accessToken) {
      refeshTokenApi = refeshTokenApi ? refeshTokenApi : RefreshTokenApi;

      const refreshToken = cookie.get('refreshToken');
      if (!refreshToken) {
         window.location.reload();
         return;
      }
      const accessTokenPayload = await refeshTokenApi(refreshToken);
      // Save accessToken to cookie
      const { expiresIn: accExpiresIn, token: newAccessToken } = accessTokenPayload;
      cookie.set('accessToken', newAccessToken, {
         maxAge: accExpiresIn - 5,
         sameSite: 'strict',
         path: '/'
      });
      accessToken = newAccessToken;
      refeshTokenApi = null;
   }
   accessToken = 'Bearer ' + accessToken;
   config.headers['authoriztion'] = accessToken;
   return config;
}, (err) => {
   return new Promise.reject(err);
});

axiosClient.interceptors.response.use((response) => {
   if (response && response.data) {
      return response.data;
      // Fake latency

      // return new Promise((resolve, reject) => {
      //    setTimeout(() => {
      //       resolve(response.data);
      //    }, 5000);
      // });
   }
   return response;
}, (err) => {
   const { response } = err;
   throw new Error(response.data);
});

export default axiosClient;