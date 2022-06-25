import axios from "axios"

const RefreshTokenApi = async (refreshToken) => {
   try {
      const response = await axios({
         method: 'POST',
         timeout: 5000, //5s
         url: '/user/refreshToken',
         baseURL: process.env.REACT_APP_API_URL,
         data: { refreshToken: refreshToken }
      });
      if (response && response.data) return response.data;
      return response;
   } catch (error) {
      throw error;
   }
}

export default RefreshTokenApi;