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
      const userAccessData = await loginUserApi(userLoginPayload);
      if (!userAccessData) {
         throw new Error('Đăng nhập thất bại!');
      }
      const { user, accessToken, refreshToken } = userAccessData;

      if (!user || !accessToken || !refreshToken)
         throw new Error('Đăng nhập thất bại!');

      // Save accesstoken to localstorage
      localStorage.setItem('accessToken', accessToken);
      // Save refreshtoken to cookie
      new Cookies().set('refreshToken', refreshToken);
      // Save user to store
      dispatch(addUserAction(user));
   } catch (error) {
      dispatch(deleteUserAction());
   }
}


export {
   addUserAction,
   deleteUserAction,
   updateUserAction,
   loginUserAction
}