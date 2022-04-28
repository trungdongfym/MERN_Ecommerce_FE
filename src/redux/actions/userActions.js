import { ADD_USER, DELETE_USER, UPDATE_USER } from '../constants';
import { loginUserApi } from '../../apis/userApi';
import Cookies from 'universal-cookie';

const addUserAction = (payload) => {
   return {
      type: ADD_USER,
      payload: payload
   }
}

const deleteUserAction = () => {
   return {
      type: DELETE_USER,
      payload: null
   }
}

const updateUserAction = (payload) => {
   return {
      type: UPDATE_USER,
      payload: payload
   }
}

const loginUserAction = userLoginPayload => async (dispatch) => {
   try {
      dispatch(updateUserAction({ isLoging: true }));
      const responsePayload = await loginUserApi(userLoginPayload);

      console.log(responsePayload);

      if (!responsePayload || responsePayload && !responsePayload.status) {
         throw new Error(responsePayload?.errors?.message || 'Đăng nhập thất bại!');
      }

      // Get payload of dataformat
      const { payload: userAccessData } = responsePayload;
      const { user, accessToken, refreshToken } = userAccessData;
      if (!user || !accessToken || !refreshToken)
         throw new Error('Đăng nhập thất bại!');

      const cookie = new Cookies();

      //Get info token
      const { expiresIn: refExpiresIn, token: refToken } = refreshToken;
      const { expiresIn: accExpiresIn, token: accToken } = accessToken;
      const { rememberMe } = userLoginPayload;

      const optionsCookieRefresh = {
         maxAge: refExpiresIn,
         sameSite: 'strict',
         path: '/'
      };

      const optionsCookieAccess = {
         maxAge: accExpiresIn - 5, //refresh token before 5 seconds
         sameSite: 'strict',
         path: '/'
      }

      // If user require remember account
      if (rememberMe) {
         // Save time session login
         localStorage.setItem('timeSession', refExpiresIn);
      } else delete optionsCookieRefresh.maxAge;

      // Save accesstoken to cookie
      cookie.set('accessToken', accToken, optionsCookieAccess);
      cookie.set('refreshToken', refToken, optionsCookieRefresh);
      // Save user to store and localStorage
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(addUserAction({ user, isLoging: false }));
   } catch (error) {
      dispatch(deleteUserAction());
      throw error;
   }
}


export {
   addUserAction,
   deleteUserAction,
   updateUserAction,
   loginUserAction
}