import { FastField, Form, Formik } from "formik";
import { changePasswordApi } from "../apis/userApi";
import { FormNormal } from "../components/base/inputField";
import Page from "../components/base/page";
import { changePassordSchema } from "../validates/userSchema";
import {useSelector} from 'react-redux';
import { userSelector } from "../redux/selectors";
import { useState } from "react";
import useCloseModal from "../hooks/autoCloseModal";
import ModalNotify from "../components/base/modalNotify";


export default function ChangePasswordPage(){
   const userActive = useSelector(userSelector);
   const [openModalNotify, setOpenModalNotify] = useState({open:false, type:'success', message:''});
   const initalValues = {
      oldPassword: '',
      newPassword:'',
      confirmNewPassword:''
   }

   const handleSubmit = async (dataPassChange, resetForm) => {
      try {
         const {_id:userID} = userActive; 
         const res = await changePasswordApi(dataPassChange,userID);
         if(res.status){
            setOpenModalNotify({open:true, type:'success', message:'Đổi mật khẩu thành công!'});
            resetForm({});
         }else {
            setOpenModalNotify({open:true, type:'warning', message:res.errors});
         }
      } catch (error) {
         setOpenModalNotify({open:true, type:'error', message: error.message});
      }
   }

   const handleCloseModalNotify = () => {
      setOpenModalNotify(prev=>({...prev,open:false}))
   }
   // custom hook for atuo close modal
   useCloseModal(handleCloseModalNotify, openModalNotify, 2000);  

   return(
      <Page className='wrapperChangePassword' title='Đổi mật khẩu'>
         <ModalNotify {...openModalNotify} handleClose={handleCloseModalNotify}/>
         <Formik
            initialValues={initalValues}
            validationSchema={changePassordSchema}
            onSubmit = {
               async (values,{setSubmitting, resetForm}) => {
                  setSubmitting(true);
                  await handleSubmit(values,resetForm);
                  setSubmitting(false);
               }
            }
         >
            {formikProps => {
               const {isSubmitting} = formikProps;
               return(
                  <Form className="wrapperChangePassword__form">
                     <div className="wrapperChangePassword__form__field">
                        <FastField
                           name = 'oldPassword'
                           component = {FormNormal}
                           label='Mật khẩu cũ'
                           type='password'
                        />
                     </div>
                     <div className="wrapperChangePassword__form__field">
                        <FastField
                           name = 'newPassword'
                           component = {FormNormal}
                           label='Mật khẩu mới'
                           type='password'
                        />
                     </div>
                     <div className="wrapperChangePassword__form__field">
                        <FastField
                           name = 'confirmNewPassword'
                           component = {FormNormal}
                           label='Xác nhận mật khẩu mới'
                           type='password'
                        />
                     </div>
                     <div className='btnContainer'>
                        <button className='btnSubmit' type='submit' disabled={isSubmitting}>
                           Đổi mật khẩu
                        </button>
                     </div>
                  </Form>
               );
            }}
         </Formik>
      </Page>
   );
}