import axiosClient from "./axiosClient";

const getWareHouseApi = async (objectQuery) => {
   try {
      const res = await axiosClient.get('/admin/getWarehouse',{
         params: objectQuery
      });
      return res;
   } catch (error) {
      throw error;
   }
}

export {
   getWareHouseApi
}