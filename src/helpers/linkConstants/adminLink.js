const product = 'products';
const admin = '/admin';
const manageProduct = 'manageProducts';
const categories = 'categories';
const manageCategories = 'manageCategories';
const addCategories = 'addCategories';
const addProducts = 'addProducts';
const mangeImportProducts = 'mangeImportProducts';
const addImportProducts = 'addImportProducts';

export const manageProductLink = [admin, product, manageProduct].join('/');
export const addProductsLink = [admin, product, addProducts].join('/');
export const manageImportProductLink = [admin, product, mangeImportProducts].join('/');
export const addImportProductsLink = [admin, product, addImportProducts].join('/');
export const manageCategoriesLink = [admin, categories, manageCategories].join('/');
export const addCategoriesLink = [admin, categories, addCategories].join('/');