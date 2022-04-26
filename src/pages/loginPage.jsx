import {
   Box, Button, Checkbox, CircularProgress, FormControlLabel
} from '@mui/material';
import { FastField, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { Link, Navigate } from 'react-router-dom';
import { InputOutline, InputPassword, Page } from "../components/base";
import { commonLink, customerLink } from '../helpers/linkConstants';
import { loginSchema } from "../validates/userSchema";
import './pageStyles.scss';


export default function LoginPage() {
   // Email and password state
   const [showPassword, setShowPassword] = useState(false);

   const intitalValues = {
      email: '',
      password: ''
   }

   // Handle show password
   const handleChangeValue = (prop) => (event) => {
   };

   const handleClickShowPassword = (e) => {
      setShowPassword(prev => !prev);
   };

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   const handleSubmitForm = async (event) => {
      event.preventDefault();
   };


   if (false) {
      return (
         <Page title="Login">
            <Box className='spinner'>
               <CircularProgress />
            </Box>
         </Page>
      );
   } else if (false) {
      return <Navigate to='/' />;
   } else
      return (
         <Page title="Login" className='auth__content'>
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
            >
               {(formikProps) => {
                  const { getFieldProps, getFieldMeta } = formikProps;
                  const fieldPassProps = getFieldProps('password');
                  return (
                     <Form className="auth__content__form">
                        <FastField
                           id='email'
                           component={InputOutline}
                           name='email'
                           label='Email'
                           placeholder = 'Your email here...'
                        />
                        <Field
                           id='password'
                           component={InputPassword}
                           handleShowPassword={handleClickShowPassword}
                           label='Mật khẩu'
                           name='password'
                           placeholder = 'Your password here...'
                           showPassword={showPassword}
                        />

                        <div className='auth__content__form__action'>
                           <div className='auth__content__form__action__remember'>
                              <FormControlLabel
                                 label='Nhớ tài khoản'
                                 control={
                                    <Checkbox
                                       sx={{
                                          '&.Mui-checked': {
                                             color: '#2065D1',
                                          },
                                       }}
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
                        </Button>
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
                  <button className='facebook'>
                     <FaFacebook className="icon" />
                  </button>
                  <button className='twitter'>
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
      );
}
