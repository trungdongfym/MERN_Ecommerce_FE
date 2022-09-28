import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel } from '@mui/material';
import { FastField, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { InputOutline, InputPassword, Page } from '../components/base';
import { loginWithThirdParty } from '../firebase/firebaseAuth';
import { methodLoginEnum, roleEnum } from '../helpers/constants/userConst';
import { customerLink } from '../helpers/linkConstants';
import { loginUserAction } from '../redux/actions/userActions';
import { userSelector } from '../redux/selectors';
import { loginSchema } from '../validates/userSchema';
import NotPermissionPage from './notPermissionPage';
import './pageStyles.scss';

export default function LoginPage() {
   // Email and password state
   const [showPassword, setShowPassword] = useState(false);
   const [loginStatus, setLoginStatus] = useState({ error: null, message: '' });
   const userLogin = useSelector(userSelector);
   const dispatch = useDispatch();
   const location = useLocation();
   // const [userCredential, setUserCredential] = useState(null);

   const intitalValues = {
      email: '',
      password: '',
      rememberMe: false,
      methodLogin: 'normal',
   };

   const handleClickShowPassword = (e) => {
      setShowPassword((prev) => !prev);
   };

   const handleSubmitForm = async (userLoginPayload) => {
      try {
         await dispatch(loginUserAction(userLoginPayload));
      } catch (error) {
         setLoginStatus({ error: true, message: error.message });
      }
   };

   // Listener user login with google or facebook

   const handleLoginWithGoogle = async () => {
      try {
         const userPayload = await loginWithThirdParty(methodLoginEnum.google);
         await dispatch(loginUserAction(userPayload));
      } catch (error) {
         if (error?.name === 'FirebaseError') {
            const message =
               'Có thể bạn đã đăng nhập bằng một tài khoản có trùng email' +
               ' vui lòng dùng tài khoản có email đăng nhập trước đó!';
            setLoginStatus({ error: true, message: message });
            return;
         }
         setLoginStatus({ error: true, message: error.message });
      }
   };

   const handleLoginWithFacebook = async () => {
      try {
         const userPayload = await loginWithThirdParty(methodLoginEnum.facebook);
         await dispatch(loginUserAction(userPayload));
      } catch (error) {
         if (error?.name === 'FirebaseError') {
            const message =
               'Có thể bạn đã đăng nhập bằng một tài khoản có trùng email' +
               ' vui lòng dùng tài khoản có email đăng nhập trước đó!';
            setLoginStatus({ error: true, message: message });
            return;
         }
         setLoginStatus({ error: true, message: error.message });
      }
   };

   if (userLogin) {
      const { role } = userLogin;
      console.log(userLogin);
      if (role === roleEnum.Custommer)
         return <Navigate to={location?.state?.pathname || '/'} replace={true} />;
      if (role === roleEnum.Admin)
         return <Navigate to={location?.state?.pathname || '/admin'} replace={true} />;
      if (role === roleEnum.SaleStaff)
         return <Navigate to={location?.state?.pathname || '/saleStaff'} replace={true} />;
      return <NotPermissionPage />;
   } else
      return (
         <>
            <Page title="Đăng nhập" className="auth__content">
               <div className="auth__content__top">
                  <div className="auth__content__top__title">Đăng nhập</div>
                  <div className="auth__content__top__sub">
                     Chào mừng trở lại! Hãy đăng nhập vào tài khoản của bạn
                  </div>
               </div>
               <Formik
                  initialValues={intitalValues}
                  validationSchema={loginSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                     setSubmitting(true);
                     await handleSubmitForm(values);
                     setSubmitting(false);
                  }}
               >
                  {(formikProps) => {
                     const { getFieldProps, isSubmitting } = formikProps;
                     const fieldCheckProps = getFieldProps('rememberMe');
                     return (
                        <Form className="auth__content__form">
                           <FastField
                              id="email"
                              component={InputOutline}
                              name="email"
                              label="Email"
                              placeholder="Your email here..."
                           />
                           <Field
                              id="password"
                              component={InputPassword}
                              handleShowPassword={handleClickShowPassword}
                              label="Mật khẩu"
                              name="password"
                              placeholder="Your password here..."
                              showPassword={showPassword}
                           />

                           <div className="auth__content__form__action">
                              <div className="auth__content__form__action__remember">
                                 <FormControlLabel
                                    label="Nhớ tài khoản"
                                    control={
                                       <Checkbox
                                          name="rememberMe"
                                          sx={{
                                             '&.Mui-checked': {
                                                color: '#2065D1',
                                             },
                                          }}
                                          {...fieldCheckProps}
                                       />
                                    }
                                 />
                              </div>
                              <Link
                                 to={customerLink.registerLink}
                                 className="auth__content__form__action__forgot"
                              >
                                 Quên mật khẩu?
                              </Link>
                           </div>
                           <Button variant="contained" size="large" type="submit">
                              Đăng nhập
                              {isSubmitting && (
                                 <Box sx={{ display: 'flex' }}>
                                    <CircularProgress
                                       disableShrink
                                       size={15}
                                       color="error"
                                       className="progressBar"
                                    />
                                 </Box>
                              )}
                           </Button>
                           {loginStatus.error && (
                              <div className="alert_login">
                                 <Alert severity="error">{loginStatus.message}</Alert>
                              </div>
                           )}
                        </Form>
                     );
                  }}
               </Formik>
               <form onSubmit={handleSubmitForm} className="auth__content__form"></form>
               <div className="or">
                  <span>OR</span>
               </div>
               <div className="auth__content__bottom">
                  <div className="auth__content__bottom__social-btns">
                     <button className="facebook" onClick={handleLoginWithFacebook}>
                        <FaFacebook className="icon" />
                     </button>
                     <button className="google" onClick={handleLoginWithGoogle}>
                        <FaGoogle className="icon" />
                     </button>
                  </div>
                  <div className="auth__content__bottom__register">
                     <div className="login__content__bottom__register__text">
                        Không có tài khoản?
                     </div>
                     <Link
                        to={customerLink.registerLink}
                        className="auth__content__bottom__register__link"
                     >
                        Tạo tài khoản
                     </Link>
                  </div>
               </div>
            </Page>
            <div
               className="auth__background-img"
               style={{
                  backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/static/login_bg_img.png)`,
               }}
            ></div>
         </>
      );
}
