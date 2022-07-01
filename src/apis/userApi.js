import axiosClient from "./axiosClient";

const registerUserApi = async (user) => {
   try {
      const response = await axiosClient.post('/user/register', user, { headers: { 'x-auth': false } });
      return response;
   } catch (error) {
      throw error;
   }
}

const loginUserApi = async (userLoginPayload) => {
   try {
      const userAccessData = await axiosClient.post('/user/login', userLoginPayload, { headers: { 'x-auth': false } });
      return userAccessData;
   } catch (error) {
      throw error;
   }
}

const logoutUserApi = async (user) => {
   try {
      const userLogoutResult = await axiosClient.post('/user/logout', user);
      return userLogoutResult;
   } catch (error) {
      throw error;
   }
}

const updateUserApi = async (userUpdateForm) => {
   try {
      const userUpdated = await axiosClient.post('/user/updateUser', userUpdateForm, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });
      return userUpdated;
   } catch (error) {
      throw error;
   }
}

const getUserApi = async (userID) => {
   try {
      const userRetrieved = await axiosClient.get(`/user/getUser/${userID}`);
      return userRetrieved;
   } catch (error) {
      throw error;
   }
}

const checkEmailApi = async (email) => {
   try {
      const response = await axiosClient.post(`/user/checkEmail`, {email});
      return response;
   } catch (error) {
      throw error;
   }
}

const changePasswordApi = async (dataPassChange, userID) => {
   try {
      const response = await axiosClient.post(`/user/changePassword/${userID}`, dataPassChange);
      return response;
   } catch (error) {
      throw error;
   }
}

export {
   registerUserApi,
   loginUserApi,
   logoutUserApi,
   updateUserApi,
   getUserApi,
   checkEmailApi,
   changePasswordApi
}