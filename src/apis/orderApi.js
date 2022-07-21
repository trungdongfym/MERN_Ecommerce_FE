import axiosClient from './axiosClient';

const addOrderApi = async (orderData) => {
   try {
      return new Promise(async (resolve, reject) => {
         const controller = new AbortController();
         const timeID = setTimeout(() => {
            controller.abort(); // cancel request
            reject(new Error('Request timeout!'));
         }, 5000);
         const response = await axiosClient.post('/orders', orderData, {
            signal: controller.signal
         });
         resolve(response);
         clearTimeout(timeID);
      });
   } catch (error) {
      throw error;
   }
}

const getOrderApi = async (orderID) => {
   try {
      const order = await axiosClient.get('/orders', {
         params: { orderID }
      });
      return order;
   } catch (error) {
      throw error;
   }
}

const updateOrderApi = async (orderUpdateData, orderID) => {
   try {
      const response = await axiosClient.patch(`/orders/${orderID}`, orderUpdateData);
      return response;
   } catch (error) {
      throw error;
   }
}

export {
   addOrderApi,
   getOrderApi,
   updateOrderApi
}