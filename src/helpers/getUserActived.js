import Cookies from "universal-cookie";

function getUserActived() {
   const cookie = new Cookies();

   const refreshToken = cookie.get('refreshToken');
   const user = localStorage.getItem('user');

   if (!user || !refreshToken) {
      localStorage.removeItem('user');
      cookie.remove('refreshToken');
      return null;
   }
   return JSON.parse(user);
}

export default getUserActived;