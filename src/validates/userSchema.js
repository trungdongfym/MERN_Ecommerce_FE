import * as yup from 'yup';
import { regexNoSpace, regexPassword } from '../helpers/regexPatern';
import { methodLoginEnum } from '../helpers/constants/userConst';
import { checkEmailApi } from '../apis/userApi';
import getUserActived from '../helpers/getUserActived';

const loginSchema = yup.object().shape({
   email: yup.string().email('Email không hợp lệ!').required('Email không được bỏ trống!'),
   password: yup.string().required('Mật khẩu không được bỏ trống!'),
   rememberMe: yup.boolean().typeError('Remember phải là kiểu boolean!').required(),
   methodLogin: yup.string()
      .oneOf([methodLoginEnum.normal], 'MethodLogin is invalid')
      .required('Phải có phương thức đăng nhập!')
});

const loginWithThirdPartySchema = yup.object().shape({
   user: yup.object().shape({
      uid: yup.string().required('Uid is required!'),
      name: yup.string().required('Name is required!'),
      email: yup.string().required('Email is required!'),
      phone: yup.string().default(''),
      avatar: yup.string().required('Avatar is required!'),
   }),
   token: yup.object().shape({
      refreshToken: yup.string().required('RefreshToken is required!'),
      accessToken: yup.string().required('AccessToken is required!'),
   }),
   isNewUser: yup.boolean().required('isNewUser is required!'),
   rememberMe: yup.boolean().required('rememberMe is required!'),
   methodLogin: yup.string()
      .oneOf([methodLoginEnum.google, methodLoginEnum.facebook], 'MethodLogin is invalid')
      .required('methodLogin is required!'),
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

let timeID = null;
const updateUserSchema = yup.object().shape({
   name: yup.string().required('Tên không được bỏ trống!'),
   email:yup.string().email('Email không hợp lệ!').required('Email được bỏ trống!')
            .test('emailExist','Email này đã tồn tại!', async (email)=>{
               if(timeID) clearTimeout(timeID);
               const userActive = getUserActived();
               const {email:emailActive} = userActive;
               // Check email is change
               if(!emailActive) return false;
               if(email === emailActive) return true;
               // For prevent call api too much
               const isContaint = !await new Promise((resolve, reject) => {
                  timeID = setTimeout(async () => {
                     try {
                        const {isExist} = await checkEmailApi(email);
                        resolve(isExist);
                     } catch (error) {
                        resolve(false);
                     }
                  },2000);
               });
               return isContaint;
            }),
   address: yup.string().typeError('Địa chỉ không hợp lệ!').notRequired(),
   phone: yup.string().typeError('Số điện thoại không hợp lệ!').notRequired(),
   gender: yup.string().notRequired(),
   dateOfBirth: yup.date().nullable(true).notRequired(),
   avatar: yup.mixed().test('avatar','File không hợp lệ!', (file) => {
      if(typeof file ==='string') return true;
      if(file){
         const fileType = file.type;
         const fileSizeMax = 1024*1024;
         if((fileType === "image/jpeg" || fileType === "image/png") && file.size < fileSizeMax)
            return true;
         else return false;
      }
      return true;
   })
});

const changePassordSchema = yup.object().shape({
   oldPassword:yup.string()
      .required('Chưa nhập mật khẩu cũ!')
      .matches(regexNoSpace,'Mật khẩu không được phép có khoảng trống!'),
   newPassword:yup.string().required('Chưa nhập mật khẩu mới!!')
      .matches(regexPassword, 'Mật khẩu phải lớn hơn 5 ký tự, chứa it nhất một chữ hoa và một ký tự đặc biệt!')
      .matches(regexNoSpace,'Mật khẩu không được phép có khoảng trống!')
      .notOneOf([yup.ref('oldPassword')],'Mật khẩu mới phải khác mật khẩu cũ!'),
   confirmNewPassword:yup.string()
      .required('Chưa xác nhận khẩu mới!!')
      .matches(regexNoSpace,'Mật khẩu không được phép có khoảng trống!')
      .oneOf([yup.ref('newPassword')],'Mật khẩu cũ và mới phải giống nhau!'),
});

export {
   loginSchema,
   registerSchema,
   loginWithThirdPartySchema,
   updateUserSchema,
   changePassordSchema
}