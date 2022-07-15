import axiosClient from './axiosClient';

const addCategoryApi = async (category) => {
   try {
      const cateSaved = await axiosClient.post('/admin/addCategories', category,{
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });
      return cateSaved;
   } catch (error) {
      throw error;
   }
}

const getCategoriesApi = async (objectQuery) => {
   try {
      const categories = await axiosClient.get('/admin/getCategories',{
         params: objectQuery,
         headers:{
            'x-auth': false
         }
      });
      return categories;
   } catch (error) {
      throw error;
   }
}

const searchCategoriesApi = async (searchText) => {
   try {
      const categories = await axiosClient.get('/admin/searchCategories',{
         params:{name: searchText}
      });
      return categories;
   } catch (error) {
      throw error;
   }
}

const deleteCategoryApi = async (cateID) => {
   try {
      const response = await axiosClient.delete(`/admin/deleteCategory/${cateID}`);
      return response;
   } catch (error) {
      throw error;
   }
}

const updateCategoriesApi = async (cateFormDate, cateID) => {
   try {
      const response = await axiosClient.patch(`/admin/updateCategories/${cateID}`, cateFormDate,{
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });
      return response;
   } catch (error) {
      throw error;
   }
}

export {
   addCategoryApi,
   getCategoriesApi,
   searchCategoriesApi,
   deleteCategoryApi,
   updateCategoriesApi
}