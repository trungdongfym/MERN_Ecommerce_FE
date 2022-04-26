import {
   Box, Button, CircularProgress, Alert
} from '@mui/material';
import { FastField, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { Link, Navigate } from 'react-router-dom';
import { InputOutline, InputPassword, Page } from '../../components/base';
import { commonLink } from '../../helpers/linkConstants';
import '../pageStyles.scss';
import './customerStyles.scss';
import { registerSchema } from '../../validates/userSchema';
import { registerUserApi } from '../../apis/userApi';
import { loginUserAction } from '../../redux/actions/userActions';
import { useDispatch } from 'react-redux';

const Register = () => {

   const [showPassword, setShowPassword] = useState(false);
   const [step, setStep] = useState([]);
   const [userRegisterStatus, setUserRegisterStatus] = useState({
      userRegisted: null,
      error: false,
      message: ''
   });

   const dispatch = useDispatch();

   useEffect(() => {
      const lengthStep = document.getElementsByClassName('step').length;
      const arrayStep = Array(lengthStep);
      arrayStep.fill(0);
      if (lengthStep > 0) arrayStep[0] = 1;
      // setStep(arrayStep);
      setStep([1, 1, 1]);
   }, []);

   useEffect(() => {
      const listStep = document.getElementsByClassName('step');
      if (listStep.length === 0) return;
      for (let i = 0; i < step.length; i++) {
         if (step[i] === 1) {
            listStep[i].classList.add('active');
         } else listStep[i].classList.remove('active');
      }
   }, [step]);

   const initalValues = {
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
      methodLogin: 'normal'
   }

   const handleNextStep = (e) => {
      let flag = 0;
      // Move 1 to the next element
      console.log(step);
      const steps = step.map((val) => {
         if (flag === 1) {
            flag = 0;
            return 1;
         }
         if (val === 1) flag = 1;
         return 0;
      });
      console.log(steps);
      setStep(steps);
   }

   const handlePreStep = (e) => {
      let flag = 0;
      // Move 1 to the previous element
      const steps = step.map((val, index) => {
         if (val === 1) {
            flag = index - 1;
            return 0;
         }
      });
      if (flag < 0) return;
      steps[flag] = 1;
      setStep(steps);
   }

   const handleLoginNow = () => {
      try {
         const userLogin = userRegisterStatus.userRegisted;
         const cloneUserLogin = structuredClone(userLogin);
         const { email, methodLogin, password } = cloneUserLogin;
         const userLoginPayload = { email, methodLogin, password };
         console.log(userLoginPayload);
         dispatch(loginUserAction(userLoginPayload));
      } catch (error) {

      }
   }

   const handleClickShowPassword = () => {
      setShowPassword(prev => !prev);
   };

   const handleSubmitForm = async (userData) => {
      try {
         const userRegister = await registerUserApi(userData);
         if (userRegister) {
            setUserRegisterStatus({
               userRegisted: userData,
               error: false,
               message: 'Đăng ký thành công!'
            });
            // handleNextStep();
         } else {
            setUserRegisterStatus({
               userRegisted: null,
               error: true,
               message: 'Đăng ký thất bại vui lòng thử lại sau!'
            });
         }
      } catch (error) {
         setUserRegisterStatus({
            userRegisted: null,
            error: true,
            message: error.message
         });
      }
   };

   if (false) {
      return (
         <Box className='spinner'>
            <CircularProgress />
         </Box>
      );
   } else if (false) {
      return <Navigate to='/' />;
   } else
      return (
         <Page title='Register' className='auth__content'>
            <div className='auth__content__top'>
               <div className='auth__content__top__title'>
                  Đăng ký
               </div>
               <div className='auth__content__top__sub'>
                  Nhập thông tin tài khoản của bạn, hãy bảo mật những thông tin này
               </div>
            </div>
            <Formik
               initialValues={initalValues}
               validationSchema={registerSchema}
               onSubmit={
                  async (values, { setSubmitting }) => {
                     setSubmitting(true);
                     await handleSubmitForm(values);
                     setSubmitting(false);
                  }
               }
            >
               {formikProps => {
                  const { getFieldMeta, isSubmitting } = formikProps;
                  const fieldMetaName = getFieldMeta('name');
                  return (
                     <Form className='auth__content__form register'>
                        <div className='userInfo step'>
                           <FastField
                              component={InputOutline}
                              label='Họ tên'
                              name='name'
                              placeholder='Your name here...'
                           />
                           <FastField
                              component={InputOutline}
                              label='Số điện thoại'
                              name='phone'
                              placeholder='Your phone here...'
                           />
                           <FastField
                              component={InputOutline}
                              label='Địa chỉ'
                              name='address'
                              placeholder='Your address here...'
                           />
                           <Button
                              variant='contained'
                              size='large'
                              type='button'
                              disabled={
                                 fieldMetaName.error !== undefined || !fieldMetaName.touched
                                    ? true : false
                              }
                              onClick={handleNextStep}
                           >
                              Tiếp tục
                           </Button>
                        </div>
                        <div className='userAccount step'>
                           <FastField
                              component={InputOutline}
                              label='Email'
                              name='email'
                              placeholder='Your email here...'
                           />
                           <Field
                              component={InputPassword}
                              label='Mật khẩu'
                              name='password'
                              placeholder='Your password here...'
                              showPassword={showPassword}
                              handleShowPassword={handleClickShowPassword}
                           />
                           <Field
                              component={InputPassword}
                              label='Xác nhận mật khẩu'
                              name='confirmPassword'
                              placeholder='Your confirm here...'
                              showPassword={showPassword}
                              handleShowPassword={handleClickShowPassword}
                           />
                           <div className='group__button'>
                              <Button
                                 variant='contained'
                                 size='large'
                                 type='button'
                                 onClick={handlePreStep}
                              >
                                 Quay lại
                              </Button>
                              <Button
                                 variant='contained'
                                 size='large'
                                 type='submit'
                                 disabled={isSubmitting}
                              >
                                 Đăng ký
                                 {isSubmitting && (
                                    <Box sx={{ display: 'flex' }}>
                                       <CircularProgress
                                          disableShrink size={15} color='error'
                                          className='progressBar'
                                       />
                                    </Box>
                                 )}
                              </Button>
                           </div>
                           {userRegisterStatus.error &&
                              (<div className='alert_register'>
                                 <Alert severity="error">{userRegisterStatus.message}</Alert>
                              </div>)
                           }
                        </div>
                        <div className='registerSuccess step'>
                           <Alert className='alert' severity="success">{userRegisterStatus.message}</Alert>
                           <div className='emailRegisted'>{userRegisterStatus.userRegisted?.email}</div>
                           <div className='note'>Hãy bảo mật tài khoản của bạn</div>
                           <Button className='loginNow' onClick={handleLoginNow}>Đăng nhập ngay</Button>
                        </div>
                     </Form>
                  );
               }}
            </Formik>
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
                     Bạn đã có tài khoản?
                  </div>
                  <Link
                     to={commonLink.loginLink}
                     className='auth__content__bottom__register__link'
                  >
                     Trở lại đăng nhập
                  </Link>
               </div>
            </div>
         </Page>
      );
};

export default Register;
