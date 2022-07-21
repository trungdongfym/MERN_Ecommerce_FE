
export function getCartFromLocalStorage() {
   const cartRaw = localStorage.getItem('cart');
   const cartLocal = JSON.parse(cartRaw);
   return cartLocal;
}

export function getOrderListFromLocalStorage() {  
   const orderListJson = localStorage.getItem('orderList');
   const orderList = JSON.parse(orderListJson);
   return orderList;
}

export function mergeCart(cartLocal, cartRemote) {
   if (!Array.isArray(cartLocal) && !Array.isArray(cartRemote)) {
      return null;
   }
   if (Array.isArray(cartLocal) && cartLocal.length === 0) {
      return {
         isUpdateRemoteCart: false,
         newCart: cartRemote
      }
   }
   if (Array.isArray(cartRemote) && cartRemote.length === 0) {
      return {
         isUpdateRemoteCart: true,
         newCart: cartLocal
      }
   }
   const newCart = cartLocal;
   for (const cartItem of cartRemote) {
      const { product } = cartItem;
      const { _id: productID } = product || {};
      const isExist = cartLocal.some((cartRemoteItem) => {
         const { product: productRemote } = cartRemoteItem;
         const { _id: remoteProductID } = productRemote || {};
         return productID === remoteProductID;
      });
      if (!isExist) {
         newCart.push(cartItem);
      }
   }
   return {
      isUpdateRemoteCart: true,
      newCart: newCart
   }
}