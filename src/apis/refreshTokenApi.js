import axios from "axios"

const RefreshTokenApi = async (refreshToken) => {
   try {
      const response = await axios({
         method: 'POST',
         url: '/refreshtoken',
         baseURL: process.env.REACT_APP_API_URL,
         data: refreshToken
      });
      if(response && response.data) return response.data;
      return response;
   } catch (error) {
      throw error;
   }
}

export default RefreshTokenApi;