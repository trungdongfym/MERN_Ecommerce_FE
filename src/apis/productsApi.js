import axiosClient from "./axiosClient";

const addProductsApi = async (productFormData) => {
   try {
      const productAdded = await axiosClient.post('/admin/addProducts',productFormData,{
         headers:{
            'Content-Type':'multipart/form-data'
         }
      }); 
      return productAdded;
   } catch (error) {
      throw error;
   }
}

const getProductsApi = async (limit, skip) => {
   try {
      const products = await axiosClient.get('/getProducts',{
         params: {limit,skip}
      });
      return products;
   } catch (error) {
      throw error;
   }
}

const searchProductsApi = async (searchText) => {
   try {
      const categories = await axiosClient.get('/searchProducts',{
         params:{name: searchText}
      });
      return categories;
   } catch (error) {
      throw error;
   }
}

export {
   addProductsApi,
   getProductsApi,
   searchProductsApi
}