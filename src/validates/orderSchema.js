import * as yup from 'yup';
import { paymenTypeArray } from '../helpers/constants/productsConst';
import { regexPhone } from '../helpers/regexPatern';

const orderSchema = yup.object().shape({
   receiveAddress:
      yup.string()
         .required('Thiếu địa chỉ nhận hàng!'),
   receivePhone:
      yup.string()
         .required('Thiếu số điện thoại liên hệ!')
         .max(15, 'Số điện thoại không hợp lệ!')
         .min(10, 'Số điện thoại không hợp lệ!')
         .matches(regexPhone, 'Số điện thoại không hợp lệ!'),
   note:
      yup.string()
         .notRequired(),
   paymentType:
      yup.string()
         .oneOf(paymenTypeArray, 'Phương thức thanht toán không hợp lệ!')
         .required('Phương thức thanh toán không được bỏ trống!'),
   orderList:
      yup.array()
         .of(yup.object().shape({
            product: yup.string().required('Thiếu mã sản phẩm!'),
            amount: yup.number()
               .positive('Số lượng sản phẩm không hợp lệ!')
               .integer('Số lượng sản phẩm không hợp lệ!')
               .required('Thiếu số lượng sản phẩm!'),
            price: yup.number()
               .positive('Giá sản phẩm không hợp lệ!')
               .required('Thiếu giá sản phẩm!'),
            sale: yup.number()
         }))
         .min(1, 'Không có sản phẩm để đặt hàng!')
         .ensure()
});

const updateOrderSchema = orderSchema.shape({
   orderList: null
});

export {
   orderSchema,
   updateOrderSchema
}