import axiosClient from "./axiosClient";

const registerUserApi = async (user) => {
   try {
      const response = await axiosClient.post('/user/register', user);
      return response;
   } catch (error) {
      throw error;
   }
}

const loginUserApi = async (userLoginPayload) => {
   try {
      const userAccessData = await axiosClient.post('/user/login', userLoginPayload);
      return userAccessData;
   } catch (error) {
      throw error;
   }
}

export {
   registerUserApi,
   loginUserApi
}