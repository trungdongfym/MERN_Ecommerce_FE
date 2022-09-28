import axiosClient from "./axiosClient";

const addProductsApi = async (productFormData) => {
   try {
      const productAdded = await axiosClient.post('/admin/addProducts', productFormData, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });
      return productAdded;
   } catch (error) {
      throw error;
   }
}

const getProductsApi = async (objectQuery) => {
   try {
      const products = await axiosClient.get('/getProducts', {
         params: objectQuery,
         headers: {
            'auth': false
         }
      });
      return products;
   } catch (error) {
      throw error;
   }
}

const getListProductApi = async (objectQuery) => {
   try {
      const products = await axiosClient.get('/products', {
         params: objectQuery,
         headers: {
            'auth': false
         }
      });
      return products;
   } catch (error) {
      throw error;
   }
}

const getRelateProductApi = async (productID) => {
   try {
      const products = await axiosClient.get('/getRelateProducts', {
         params: { productID },
         headers: {
            'auth': false
         }
      });
      return products;
   } catch (error) {
      throw error;
   }
}

const updateProductsApi = async (productsFormData, productID) => {
   try {
      const res = await axiosClient.patch(`/admin/updateProducts/${productID}`, productsFormData, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });
      return res;
   } catch (error) {
      throw error;
   }
}

const searchProductsApi = async (searchText) => {
   try {
      const categories = await axiosClient.get('/searchProducts', {
         params: { name: searchText }
      });
      return categories;
   } catch (error) {
      throw error;
   }
}

const addImportProductsApi = async (importProduct) => {
   try {
      const importProductAdded = await axiosClient.post('/admin/addImportProducts', importProduct);
      return importProductAdded;
   } catch (error) {
      throw error;
   }
}

const getImportProductsApi = async (requireObject) => {
   try {
      const importProducts = await axiosClient.get('/admin/getImportProducts', {
         params: requireObject
      });
      return importProducts;
   } catch (error) {
      throw error;
   }
}

const updateImportProductsApi = async (importProduct, importID) => {
   try {
      const updateStatus = await axiosClient.patch(
         `/admin/updateImportProducts/${importID}`,
         importProduct
      );
      return updateStatus;
   } catch (error) {
      throw error;
   }
}

const deleteProductApi = async (productID) => {
   try {
      const response = await axiosClient.delete(`/admin/deleteProduct/${productID}`);
      return response;
   } catch (error) {
      throw error;
   }
}

const deleteImportProductApi = async (importProductID) => {
   try {
      const response = await axiosClient.delete(`/admin/deleteImportProduct/${importProductID}`);
      return response;
   } catch (error) {
      throw error;
   }
}

export {
   addProductsApi,
   getProductsApi,
   searchProductsApi,
   addImportProductsApi,
   getImportProductsApi,
   updateImportProductsApi,
   deleteProductApi,
   deleteImportProductApi,
   updateProductsApi,
   getRelateProductApi,
   getListProductApi
}