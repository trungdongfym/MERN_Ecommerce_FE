import * as yup from 'yup';
import { regexPassword } from '../helpers/regexPatern';

const loginSchema = yup.object().shape({
   email: yup.string().email('Email không hợp lệ!').required('Email không được bỏ trống!'),
   password: yup.string().required('Mật khẩu không được bỏ trống!'),
   rememberMe: yup.boolean().typeError('Remember phải là kiểu boolean!').required(),
   methodLogin: yup.string().required('Phải có phương thức đăng nhập!')
});

const registerSchema = yup.object().shape({
   name: yup.string().required('Họ tên không được trống'),
   email: yup.string().email('Email không hợp lệ!').required('Email không được bỏ trống!'),
   phone: yup.string().notRequired(),
   address: yup.string().notRequired(),
   password: yup.string()
      .matches(regexPassword, 'Mật khẩu phải lớn hơn 5 ký tự, chứa it nhất một chữ hoa và một ký tự đặc biệt!')
      .required('Mật khẩu không được bỏ trống!'),
   confirmPassword: yup.string()
      .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp!')
      .required('Không được bỏ trống xác nhận mật khẩu!')
});

export {
   loginSchema,
   registerSchema
}