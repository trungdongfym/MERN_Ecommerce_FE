import * as yup from 'yup';
import { paymenTypeArray, importProductStatusArray } from '../helpers/constants/productsConst';
import { regexPhone } from '../helpers/regexPatern';

export const addProductsSchema = yup.object().shape({
   name: yup.string().required('Tên sản phẩm không được bỏ trống!'),
   preview: yup.string(),
   price: yup.number()
      .positive('Giá sản phẩm không hợp lệ!')
      .required('Giá sản phẩm không được bỏ trống!'),
   note: yup.string(),
   category: yup.string().required('Loại sản phẩm không được bỏ trống!'),
   image: yup.mixed().test('fileValid','File không hợp lệ!',(file) => {
      if(typeof file ==='string') return true;
      if(file){
         const fileType = file.type;
         const fileSizeMax = 1024*1024;
         if((fileType === "image/jpeg" || fileType === "image/png") && file.size < fileSizeMax)
            return true;
         else return false;
      }
      return true;
   }).required('Thiếu ảnh sản phẩm!'),
});

export const updateProductsSchema = addProductsSchema.shape({
   sale: yup.number()
      .typeError('Giá trị không hợp lệ')
      .positive('Giảm giá không được âm!')
      .min(0, 'Giá trị không hợp lệ!')
      .max(100,'Giá trị không hợp lệ!')
});

export const addImportProductsSchema = yup.object().shape({
   titleImport: yup.string().required('Tiêu đề đơn nhập không được bỏ trống!'),
   supplierName: yup.string().required('Nhà cung cấp không được bỏ trống!'),
   phone: yup.string()
      .required('Số điện thoại nhà cung cấp không được bỏ trống!')
      .max(15, 'Số điện thoại không hợp lệ!')
      .min(10, 'Số điện thoại không hợp lệ!')
      .matches(regexPhone, 'Số điện thoại không hợp lệ!'),
   note: yup.string().notRequired(),
   payment: yup.string()
      .oneOf(paymenTypeArray, 'Phương thức thanht toán không hợp lệ!')
      .required('Phương thức thanh toán không được bỏ trống!'),
   detailImportProducts: yup.array()
      .of(yup.object().shape({
         products: yup.string().required('Thiếu sản phẩm nhập!'),
         amount: yup.number()
            .positive('Số lượng không hợp lệ!')
            .integer('Số lượng không hợp lệ!')
            .required('Thiếu số lượng nhập!'),
         price: yup.number().positive('Số lượng sản phẩm không hợp lệ!').required('Thiếu giá nhập!'),
      }))
      .min(1, 'Chưa có sản phẩm nhập!')
      .ensure(),
});

export const updateImportProductsSchema = addImportProductsSchema.shape({
   status: yup.string()
      .oneOf(importProductStatusArray, 'Trạng thái đơn nhập không hợp lệ!')
      .required('Thiếu trạng thái đơn nhập!'),
});

export const importProductsSchema = yup.object().shape({
   products: yup.string().required('Thiếu sản phẩm nhập!'),
   amount: yup.number()
      .positive('Số lượng không hợp lệ!')
      .integer('Số lượng không hợp lệ!')
      .required('Thiếu số lượng nhập!'),
   price: yup.number().positive('Số lượng không hợp lệ!').required('Thiếu giá nhập!'),
});

export const addCategorieSchema = yup.object().shape({
   name: yup.string().required('Tên loại sản phẩm không được bỏ trống!'),
   avatarOfCate: yup.mixed().test('fileValid','File không hợp lệ!',(file) => {
      if(typeof file ==='string') return true;
      if(file){
         const fileType = file.type;
         const fileSizeMax = 1024*1024;
         if((fileType === "image/jpeg" || fileType === "image/png") && file.size < fileSizeMax)
            return true;
         else return false;
      }
      return true;
   }).required('Thiếu ảnh đại diện thể loại sản phẩm!'),
});