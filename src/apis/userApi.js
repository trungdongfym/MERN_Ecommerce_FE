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

export {
   registerUserApi,
   loginUserApi
}