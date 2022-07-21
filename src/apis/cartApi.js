import axiosClient from "./axiosClient";

export async function getCartApi(userID) {
   try {
      const cart = await axiosClient.get('/cart', {
         params: {
            userID: userID
         }
      });
      return cart;
   } catch (error) {
      throw error;
   }
}

export async function addProductToCartApi(cartItemData, userID) {
   try {
      const res = await axiosClient.post('/addProductToCart', {
         cartItem: cartItemData,
         userID: userID
      });
      return res;
   } catch (error) {
      throw error;
   }
}

export async function updateCartApi(newCart, userID){
   try {
      const res = await axiosClient.put(`/updateCart/${userID}`, newCart);
      return res;
   } catch (error) {
      throw error;
   }
} 
