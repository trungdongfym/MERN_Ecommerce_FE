import { addProductToCartApi, getCartApi, updateCartApi } from '../../apis/cartApi';
import * as cartConst from '../constants';

const addToCartAction = (cartItem) => {
   return {
      type: cartConst.ADD_TO_CART,
      payload: cartItem
   };
}

const updateCartAction = (newCart) => {
   return {
      type: cartConst.UPDATE_CART,
      payload: newCart
   }
}

const deleteCartAction = () => {
   return {
      type: cartConst.DELETE_CART,
      payload: []
   }
}

const addToCartAsyncAction = (cartItem, userID) => async (dispatch) => {
   if (!userID) {
      dispatch(addToCartAction(cartItem));
      return {
         status: true,
         message: 'Đã thêm sản phẩm vào giỏ hàng'
      }
   }
   try {
      const { product } = cartItem;
      if (!product?._id) {
         throw new Error('Lỗi sản phẩm!');
      }
      const cartItemData = {
         ...cartItem,
         product: product._id
      }
      const response = await addProductToCartApi(cartItemData, userID);
      if (response.status) {
         dispatch(addToCartAction(cartItem));
      }
      return response;
   } catch (error) {
      throw error;
   }
}

const updateCartAsyncAction = (newCart, userID) => async (dispatch) => {
   if (!userID) {
      dispatch(updateCartAction(newCart));
      return {
         status: true,
         message: 'Đã cập nhập giỏ hàng'
      }
   }
   const newCartFormatData = newCart.map((cartItem) => {
      const { product, amount } = cartItem;
      const { _id: productID } = product || {};
      return { product: productID, amount: amount };
   });
   try {
      const response = await updateCartApi(newCartFormatData, userID);
      if (response.status) {
         dispatch(updateCartAction(newCart));
      }
      return response;
   } catch (error) {
      throw error;
   }
}

const fetchCartAction = (userID) => async (dispatch) => {
   try {
      const cartRemote = await getCartApi(userID) || [];
      dispatch(updateCartAction(cartRemote));
   } catch (error) {
      throw error;
   }
}

export {
   addToCartAsyncAction,
   updateCartAsyncAction,
   deleteCartAction,
   fetchCartAction
};
