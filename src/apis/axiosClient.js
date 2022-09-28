import axios from 'axios';
import qs from 'qs';
import Cookies from 'universal-cookie';
import { commonLink } from '../helpers/linkConstants';
import RefreshTokenApi from './refreshTokenApi';

const axiosClient = axios.create({
   baseURL: process.env.REACT_APP_API_URL,
   headers: {
      'content-type': 'application/json'
   },
   paramsSerializer: (searchParam) => {
      return qs.stringify(searchParam);
   }
});

let refeshTokenApi = null;
// Do something before request
axiosClient.interceptors.request.use(async (config) => {
   const cookie = new Cookies();
   let accessToken = cookie.get('accessToken');

   // Check a request need accesstoken
   const isRequestAuth = config.headers['auth'];
   if (isRequestAuth === false) {
      // delete config.headers['auth'];
      return config;
   }
   // If accessToken expired
   if (!accessToken && isRequestAuth !== false) {
      try {
         refeshTokenApi = refeshTokenApi ? refeshTokenApi : RefreshTokenApi;
         const refreshToken = cookie.get('refreshToken');
         if (!refreshToken) {
            throw new Error('Not refreshtoken!');
         }
         const accessTokenPayload = await refeshTokenApi(refreshToken);
         // console.log(accessTokenPayload);
         // Save accessToken to cookie
         const { expiresIn: accExpiresIn, token: newAccessToken } = accessTokenPayload;
         cookie.set('accessToken', newAccessToken, {
            maxAge: accExpiresIn - 5,
            sameSite: 'strict',
            path: '/'
         });
         accessToken = newAccessToken;
         refeshTokenApi = null;
      } catch (error) {
         localStorage.removeItem('user');
         cookie.remove('refreshToken');
         window.location.href = commonLink.loginLink;
         console.log("Axios error:", error);
      }
   }
   accessToken = 'Bearer ' + accessToken;
   config.headers['authorization'] = accessToken;
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
      //    }, 2000);
      // });
   }
   return response;
}, (err) => {
   if (!axios.isCancel(err)) {
      const { response } = err;
      throw new Error(response?.data || err);
   }
});

export default axiosClient;