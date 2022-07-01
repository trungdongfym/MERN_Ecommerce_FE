import { ADD_USER, DELETE_USER, LOGIN_USER, UPDATE_USER } from '../constants';
import { loginUserApi, logoutUserApi } from '../../apis/userApi';
import { methodLoginEnum } from '../../helpers/constants/userConst';
import Cookies from 'universal-cookie';
import { firebaseAuth } from '../../firebase/firebase';

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

const loginAction = (payload) => {
   return {
      type: LOGIN_USER,
      payload: payload
   }
}

const loginUserAction = userLoginPayload => async (dispatch) => {
   try {
      dispatch(loginAction({ isLoging: true }));
      const responsePayload = await loginUserApi(userLoginPayload);

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

      dispatch(addUserAction({ user, isLoging: false }));
   } catch (error) {
      dispatch(deleteUserAction());
      throw error;
   }
}

const logoutUserAction = userActive => async (dispatch) => {
   try {
      const userLogoutRes = await logoutUserApi(userActive);
      if (userLogoutRes.payload === true) {
         dispatch(deleteUserAction());
         
         new Cookies().remove('refreshToken');
         if (userActive.methodLogin !== methodLoginEnum.normal) {
            await firebaseAuth.signOut();
         }
      }
   } catch (error) {
      throw error;
   }
}

export {
   addUserAction,
   deleteUserAction,
   updateUserAction,
   loginUserAction,
   logoutUserAction
}