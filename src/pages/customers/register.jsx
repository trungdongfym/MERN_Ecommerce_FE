import {
   Box, Button, CircularProgress, Alert
} from '@mui/material';
import { FastField, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { Link, Navigate } from 'react-router-dom';
import { InputOutline, InputPassword, Page, Spinner } from '../../components/base';
import { commonLink } from '../../helpers/linkConstants';
import '../pageStyles.scss';
import './styles/customerStyles.scss';
import { registerSchema } from '../../validates/userSchema';
import { registerUserApi } from '../../apis/userApi';
import { loginUserAction } from '../../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { isLogingSelector, userSelector } from '../../redux/selectors';

const Register = () => {

   const [showPassword, setShowPassword] = useState(false);
   const [step, setStep] = useState([]);
   const [userRegisterStatus, setUserRegisterStatus] = useState({
      userRegisted: null,
      error: false,
      message: ''
   });

   const [loginNowErrors, setLoginNowErrors] = useState(null);
   const isLogoingNow = useSelector(isLogingSelector);
   // If loginnow success then userLoginNow != null
   const userLoginNow = useSelector(userSelector);

   const dispatch = useDispatch();

   useEffect(() => {
      const lengthStep = document.getElementsByClassName('step').length;
      const arrayStep = Array(lengthStep);
      arrayStep.fill(0);
      if (lengthStep > 0) arrayStep[0] = 1;
      setStep(arrayStep);
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
      const steps = step.map((val) => {
         if (flag === 1) {
            flag = 0;
            return 1;
         }
         if (val === 1) flag = 1;
         return 0;
      });
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

   const handleLoginNow = async () => {
      try {
         const userLogin = userRegisterStatus.userRegisted;
         const cloneUserLogin = structuredClone(userLogin);
         const { email, methodLogin, password } = cloneUserLogin;
         const userLoginPayload = { email, methodLogin, password, rememberMe: false };
         await dispatch(loginUserAction(userLoginPayload));
      } catch (error) {
         setLoginNowErrors(error.message);
      }
   }

   const handleClickShowPassword = () => {
      setShowPassword(prev => !prev);
   };

   const handleSubmitForm = async (userData) => {
      try {
         const userRegister = await registerUserApi(userData);
         if (userRegister) {
            // Set account registered into state
            setUserRegisterStatus({
               userRegisted: userData,
               error: false,
               message: '????ng k?? th??nh c??ng!'
            });
            handleNextStep();
         } else {
            setUserRegisterStatus({
               userRegisted: null,
               error: true,
               message: '????ng k?? th???t b???i vui l??ng th??? l???i sau!'
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

   if (isLogoingNow) {
      return (
         <Spinner />
      );
   } else if (userLoginNow) {
      return <Navigate to='/' replace={true} />;
   } else
      return (
         <>
            <Page title='????ng k??' className='auth__content'>
               <div className='auth__content__top'>
                  <div className='auth__content__top__title'>
                     ????ng k??
                  </div>
                  <div className='auth__content__top__sub'>
                     Nh???p th??ng tin t??i kho???n c???a b???n, h??y b???o m???t nh???ng th??ng tin n??y
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
                                 label='H??? t??n'
                                 name='name'
                                 placeholder='Your name here...'
                              />
                              <FastField
                                 component={InputOutline}
                                 label='S??? ??i???n tho???i'
                                 name='phone'
                                 placeholder='Your phone here...'
                              />
                              <FastField
                                 component={InputOutline}
                                 label='?????a ch???'
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
                                 Ti???p t???c
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
                                 label='M???t kh???u'
                                 name='password'
                                 placeholder='Your password here...'
                                 showPassword={showPassword}
                                 handleShowPassword={handleClickShowPassword}
                              />
                              <Field
                                 component={InputPassword}
                                 label='X??c nh???n m???t kh???u'
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
                                    Quay l???i
                                 </Button>
                                 <Button
                                    variant='contained'
                                    size='large'
                                    type='submit'
                                    disabled={isSubmitting}
                                 >
                                    ????ng k??
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
                              <div className='note'>H??y b???o m???t t??i kho???n c???a b???n</div>
                              <Button className='loginNow' onClick={handleLoginNow}>????ng nh???p ngay</Button>
                              {loginNowErrors &&
                                 (<div className='alert_register'>
                                    <Alert severity="error">{loginNowErrors}</Alert>
                                 </div>)
                              }
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
                     <button className='google'>
                        <FaGoogle className="icon" />
                     </button>
                  </div>
                  <div className='auth__content__bottom__register'>
                     <div className='login__content__bottom__register__text'>
                        B???n ???? c?? t??i kho???n?
                     </div>
                     <Link
                        to={commonLink.loginLink}
                        className='auth__content__bottom__register__link'
                     >
                        Tr??? l???i ????ng nh???p
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
};

export default Register;
