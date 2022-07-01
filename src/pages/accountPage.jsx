import {FastField, Form, Formik} from 'formik';
import Page from '../components/base/page';
import { FormNormal, RadioButtonGroup, DateField, InputFileImage } from '../components/base/inputField';
import './pageStyles.scss';
import { Avatar } from '@mui/material';
import { useState } from 'react';
import { updateUserApi, getUserApi } from '../apis/userApi';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector } from '../redux/selectors';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { updateUserAction } from '../redux/actions/userActions';
import ModalNotify from '../components/base/modalNotify';
import useCloseModal from '../hooks/autoCloseModal';
import { updateUserSchema } from '../validates/userSchema';

const genderArray = [
   {
      id:'male',
      value: 'Male',
      label: 'Nam'
   },
   {
      id:'female',
      value: 'Female',
      label: 'Nữ'
   },
   {
      id:'other',
      value: 'Other',
      label: 'Khác'
   }
]

function generateUserInfo(userObject){
   const {
      email='',
      name='',
      phone='',
      address='',
      avatar='',
      gender='',
      dateOfBirth = null
   } = userObject;
   return {email, name, phone, address, avatar, gender, dateOfBirth};
}

export default function AccountPage(){

   const [previewAvt, setPreviewAvt] = useState(null);
   const userActive = useSelector(userSelector);
   const [userInfo, setUserInfo] = useState(null);
   const [openModalNotify, setOpenModalNotify] = useState({open:false, type:'success', message:''});
   const dispatch = useDispatch();

   let initialValue = useMemo(() => {
      const userObject = generateUserInfo({});
      if(!userInfo) return userObject;
      return userInfo;
   }, [userInfo]);

   useEffect(() => {
      async function getUser(){
         const { _id:userID = null } = userActive || {};
         if(userID){
            try {
               const userRetrieved = await getUserApi(userID);
               const userIf = generateUserInfo(userRetrieved);
               // update form
               setUserInfo(userIf);
            } catch (error) {
               console.log(error);
            }
         }
      }
      getUser();
   }, [userActive]);

   const handleSubmit = async (values) => {
      if(values === initialValue) return;
      const userFd = new FormData();
      const {
         email,
         name,
         phone,
         address,
         avatar,
         gender,
         dateOfBirth
      } = values;
      userFd.append('email',email);
      userFd.append('name',name);
      userFd.append('phone',phone);
      userFd.append('address',address);
      userFd.append('gender',gender);
      userFd.append('dateOfBirth', dateOfBirth ? dateOfBirth:'');//send dateOfBirth or '' no send null
      userFd.append('_id',userActive._id);
      if(typeof avatar === 'object')
         userFd.append('avatar',avatar, avatar.name);
      try {
         const userUpdated = await updateUserApi(userFd);
         if(userUpdated && userUpdated.status){
            const userRetrieved = userUpdated.payload;
            const {name, email, avatar} = userRetrieved;
            // create user payload to update to redux store
            const userPayload = { name, email, avatar };
            dispatch(updateUserAction(userPayload));
            setOpenModalNotify({open:true,type:'success',message:'Cập nhập thành công!'});
         } else {
            if(userUpdated && userUpdated.errors){
               setOpenModalNotify({open:true,type:'error',message:userUpdated.errors.message});
            }
            setOpenModalNotify({open:true,type:'error',message:'Cập nhập thất bại!'});
         }
      } catch (error) {
         setOpenModalNotify({open:true,type:'error',message:error.message});
      }
   }

   const handleCloseModalNotify = () => {
      setOpenModalNotify(prev=>({...prev,open:false}))
   }
   // custom hook for atuo close modal
   useCloseModal(handleCloseModalNotify, openModalNotify, 2000);  

   return(
      <Page className="wrapperProfile" title='Hồ sơ'>
         <ModalNotify {...openModalNotify} handleClose={handleCloseModalNotify}/>
         <div className="wrapperProfile__header">
            <h3 className="wrapperProfile__header__title">Hồ Sơ Của Tôi</h3>
            <p className="wrapperProfile__header__text">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
         </div>
         <div className='wrapperProfile__formContainer'>
            <Formik
               enableReinitialize
               initialValues={initialValue}
               validationSchema={ updateUserSchema }
               onSubmit = {
                  async (values, { setSubmitting }) => {
                     setSubmitting(true);
                     await handleSubmit(values);
                     setSubmitting(false);
                  }
               }
            >
               {(formikProps)=>{
                  const {values, setFieldValue, isSubmitting, errors } = formikProps;
                  // console.log(errors)
                  return(
                     <Form className='wrapperProfile__formContainer__form' autoComplete='off'>
                        <div className='wrapperProfile__formContainer__form__inputText'>
                           <div className='fieldContainer'>
                              <FastField
                                 name='email'
                                 component={FormNormal}
                                 label='Email'
                              />
                           </div>
                           <div className='fieldContainer'>
                              <FastField
                                 name='name'
                                 component={FormNormal}
                                 autoComplete='false'
                                 label='Tên'
                              />
                           </div>
                           <div className='fieldContainer'>
                              <FastField
                                 name='address'
                                 component={FormNormal}
                                 label='Địa chỉ'
                              />
                           </div>
                           <div className='fieldContainer'>
                              <FastField
                                 name='phone'
                                 component={FormNormal}
                                 label='Số điện thoại'
                              />
                           </div>
                           <div className='fieldContainer'>
                              <FastField
                                 name='gender'
                                 component={RadioButtonGroup}
                                 radioList = {genderArray}
                                 label='Giới tính'
                              />
                           </div>
                           <div className='fieldContainer'>
                              <FastField
                                 name='dateOfBirth'
                                 component={DateField}
                                 setFieldValue={setFieldValue}
                                 label='Ngày sinh'
                              />
                           </div>
                           <div className='btnContainer'>
                              <button className='btnSubmit' type='submit' disabled={isSubmitting}>
                                 Cập nhập
                              </button>
                           </div>
                        </div>
                        <div className='wrapperProfile__formContainer__form__inputFile'>
                           <div className='avatarWapper'>
                              <Avatar 
                                 className='avatarWapper__avatar' 
                                 src={previewAvt ? previewAvt:values['avatar']} 
                                 alt='avatar'
                              />
                              <div className='avatarWapper__fileChoose'>
                                 <FastField
                                    name='avatar'
                                    component={InputFileImage}
                                    setFieldValue={setFieldValue}
                                    label = 'Chọn ảnh'
                                    setPreviewAvt = {setPreviewAvt}
                                 />
                              </div>
                              <div className='avatarWapper__note'>
                                 <p>Dụng lượng file tối đa 1 MB</p>
                                 <p>Định dạng:.JPEG, .PNG</p>
                              </div>
                           </div>
                        </div>
                     </Form>
                  );
               }}
            </Formik>
         </div>
      </Page>
   );
}