export const product = 'products';
export const admin = '/admin';
export const manageProduct = 'manageProducts';
export const categories = 'categories';
export const manageCategories = 'manageCategories';
export const addCategories = 'addCategories';
export const detailCategories = 'detailCategories';
export const addProducts = 'addProducts';
export const detailProducts = 'detailProducts';
export const mangeImportProducts = 'mangeImportProducts';
export const addImportProducts = 'addImportProducts';
export const detailImportProducts = 'detailImportProducts';
export const manageWarehouse = 'manageWarehouse';
export const manageUsers = 'manageUsers';
export const users = 'users';

export const manageProductLink = [admin, product, manageProduct].join('/');
export const addProductsLink = [admin, product, addProducts].join('/');
export const manageImportProductLink = [admin, product, mangeImportProducts].join('/');
export const addImportProductsLink = [admin, product, addImportProducts].join('/');
export const manageCategoriesLink = [admin, categories, manageCategories].join('/');
export const addCategoriesLink = [admin, categories, addCategories].join('/');
export const detailImportProductsLink = [admin, product, detailImportProducts].join('/');
export const manageWarehouseLink = [admin, product, manageWarehouse].join('/');
export const manageUsersLink = [admin, users, manageUsers].join('/');
export const detailProductsLink = [admin, product, detailProducts].join('/');
export const detailCategoriesLink = [admin, categories, detailCategories].join('/');