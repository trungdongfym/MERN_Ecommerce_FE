import {
   Alert,
   Box, Button, Checkbox, CircularProgress, FormControlLabel
} from '@mui/material';
import { FastField, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { Link, Navigate } from 'react-router-dom';
import { InputOutline, InputPassword, Page, Spinner } from "../components/base";
import { customerLink } from '../helpers/linkConstants';
import { loginSchema } from "../validates/userSchema";
import { useLocation } from 'react-router-dom';
import { loginUserAction } from '../redux/actions/userActions';
import { userSelector, isLogingSelector } from '../redux/selectors';
import { useDispatch, useSelector } from 'react-redux';
import './pageStyles.scss';
import { firebaseAuth } from '../firebase/firebase';
import {
   GoogleAuthProvider, signInWithPopup,
   getAdditionalUserInfo, FacebookAuthProvider
} from 'firebase/auth';

function createDataLoginFirebasw(credentialUser, userInfo, methodLogin) {
   const {
      user: { uid, displayName, email, phoneNumber, photoURL, stsTokenManager: { accessToken, refreshToken } }
   } = credentialUser;
   const { isNewUser } = userInfo;
   const userPayload = {
      user: {
         uid: uid,
         name: displayName,
         email: email,
         phone: phoneNumber || '',
         avatar: photoURL,
      },
      token: {
         accessToken,
         refreshToken
      },
      isNewUser,
      rememberMe: false,
      methodLogin: methodLogin
   }
   return userPayload;
}


export default function LoginPage() {
   // Email and password state
   const [showPassword, setShowPassword] = useState(false);
   const [loginStatus, setLoginStatus] = useState({ error: null, message: '' });

   const userLogin = useSelector(userSelector);
   const dispatch = useDispatch();
   // const [userCredential, setUserCredential] = useState(null);

   const intitalValues = {
      email: '',
      password: '',
      rememberMe: false,
      methodLogin: 'normal'
   }

   const location = useLocation();

   const handleClickShowPassword = (e) => {
      setShowPassword(prev => !prev);
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
      const googleProvider = new GoogleAuthProvider();
      try {
         const credentialUser = await signInWithPopup(firebaseAuth, googleProvider);
         const userInfo = getAdditionalUserInfo(credentialUser);
         const userPayload = createDataLoginFirebasw(credentialUser, userInfo, 'google');
         await dispatch(loginUserAction(userPayload));
      } catch (error) {
         setLoginStatus({ error: true, message: error.message });
      }
   }

   const handleLoginWithFacebook = async () => {
      const facebookProvider = new FacebookAuthProvider();
      try {
         const credentialUser = await signInWithPopup(firebaseAuth, facebookProvider);
         const userInfo = getAdditionalUserInfo(credentialUser);
         const userPayload = createDataLoginFirebasw(credentialUser, userInfo, 'facebook');
         await dispatch(loginUserAction(userPayload));
      } catch (error) {
         setLoginStatus({ error: true, message: error.message });
      }
   }


   if (userLogin) {
      return <Navigate to={location?.state?.pathname || '/'} replace={true} />;
   } else
      return (
         <>
            <Page title="Đăng nhập" className='auth__content'>
               <div className='auth__content__top'>
                  <div className='auth__content__top__title'>
                     Đăng nhập
                  </div>
                  <div className='auth__content__top__sub'>
                     Chào mừng trở lại! Hãy đăng nhập vào tài khoản của bạn
                  </div>
               </div>
               <Formik
                  initialValues={intitalValues}
                  validationSchema={loginSchema}
                  onSubmit={
                     async (values, { setSubmitting }) => {
                        setSubmitting(true);
                        await handleSubmitForm(values);
                        setSubmitting(false);
                     }
                  }
               >
                  {(formikProps) => {
                     const { getFieldProps, isSubmitting } = formikProps;
                     const fieldCheckProps = getFieldProps('rememberMe');
                     return (
                        <Form className="auth__content__form">
                           <FastField
                              id='email'
                              component={InputOutline}
                              name='email'
                              label='Email'
                              placeholder='Your email here...'
                           />
                           <Field
                              id='password'
                              component={InputPassword}
                              handleShowPassword={handleClickShowPassword}
                              label='Mật khẩu'
                              name='password'
                              placeholder='Your password here...'
                              showPassword={showPassword}
                           />

                           <div className='auth__content__form__action'>
                              <div className='auth__content__form__action__remember'>
                                 <FormControlLabel
                                    label='Nhớ tài khoản'
                                    control={
                                       <Checkbox
                                          name='rememberMe'
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
                                 className='auth__content__form__action__forgot'
                              >
                                 Quên mật khẩu?
                              </Link>
                           </div>
                           <Button
                              variant='contained'
                              size='large'
                              type='submit'
                           >
                              Đăng nhập
                              {isSubmitting && (
                                 <Box sx={{ display: 'flex' }}>
                                    <CircularProgress
                                       disableShrink size={15} color='error'
                                       className='progressBar'
                                    />
                                 </Box>
                              )}
                           </Button>
                           {loginStatus.error &&
                              (<div className='alert_login'>
                                 <Alert severity="error">{loginStatus.message}</Alert>
                              </div>)
                           }
                        </Form>
                     )
                  }}
               </Formik>
               <form
                  onSubmit={handleSubmitForm}
                  className='auth__content__form'
               >

               </form>
               <div className='or'>
                  <span>OR</span>
               </div>
               <div className='auth__content__bottom'>
                  <div className='auth__content__bottom__social-btns'>
                     <button className='facebook' onClick={handleLoginWithFacebook}>
                        <FaFacebook className="icon" />
                     </button>
                     <button className='google' onClick={handleLoginWithGoogle}>
                        <FaGoogle className="icon" />
                     </button>
                  </div>
                  <div className='auth__content__bottom__register'>
                     <div className='login__content__bottom__register__text'>
                        Không có tài khoản?
                     </div>
                     <Link
                        to={customerLink.registerLink}
                        className='auth__content__bottom__register__link'
                     >
                        Tạo tài khoản
                     </Link>
                  </div>
               </div>
            </Page>
            <div
               className='auth__background-img'
               style={{ backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/static/login_bg_img.png)` }}
            >
            </div>
         </>
      );
}
