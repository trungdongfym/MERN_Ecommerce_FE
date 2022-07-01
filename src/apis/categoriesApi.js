import axiosClient from './axiosClient';

const addCategoryApi = async (category) => {
   try {
      const cateSaved = await axiosClient.post('/admin/addCategories', category);
      return cateSaved;
   } catch (error) {
      throw error;
   }
}

const getCategoriesApi = async (limit,skip) => {
   try {
      const categories = await axiosClient.get('/admin/getCategories',{
         params: {limit,skip}
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

export {
   addCategoryApi,
   getCategoriesApi,
   searchCategoriesApi
}