import { Formik, Form, FastField } from 'formik';
import { Link, useLocation } from 'react-router-dom';
import { FormNormal, TextArea } from '../../../components/base';
import { adminLink } from '../../../helpers/linkConstants';
import {categorieSchema} from '../../../validates/productSchema';
import { addCategoryApi } from '../../../apis/categoriesApi';
import ModalNotify from '../../../components/base/modalNotify';
import useCloseModal from '../../../hooks/autoCloseModal';
import './styles/categories.scss';
import { useState } from 'react';

export default function AddCategoriesPage(){
   const location = useLocation();
   const [modalNotifyStatus, setModalNotifyStatus] = useState({
      open: false,
      type: 'success',
      message: ''
   });
   const initialValues = {
      name:'',
      describe:'',
      note: '',
   }

   const handleAddCategory = async (category, resetForm) => {
      try {
         const cateSaved = await addCategoryApi(category);
         if(cateSaved) {
            setModalNotifyStatus({open:true, type:'success', message:'Thêm thành công!'});
            resetForm({});
         } else{
            setModalNotifyStatus({open:true, type:'error', message:'Thất bại!'});
         }
      } catch (error) {
         setModalNotifyStatus({open:true, type:'error', message:error.message});
      } 
   }

   const handleCloseModalNotify = () => {
      setModalNotifyStatus(prev => ({...prev, open:false}));
   }

   useCloseModal(handleCloseModalNotify, modalNotifyStatus, 2000); // auto close modal

   return(
      <div className='addCategoriesWapper'>
         {modalNotifyStatus.open&&
            <ModalNotify {...modalNotifyStatus} handleClose = {handleCloseModalNotify}/>
         }
         <h3 className='addCategoriesWapper__title'>Thêm loại sản phẩm</h3>
         <Formik
            initialValues={initialValues}
            validationSchema = {categorieSchema}
            onSubmit = {async (values, {setSubmitting,resetForm}) => {
               setSubmitting(true);
               await handleAddCategory(values,resetForm);
               setSubmitting(false);
            }}
         >
            {(formikProps) => {
               const {isSubmitting} = formikProps;
               return(
                  <Form className='addCategoriesWapper__form'>
                     <div className='addCategoriesWapper__form__field'>
                        <label className='fieldCategoriesLabel'>Tên loại sản phẩm</label>
                        <FastField
                           name = 'name'
                           component = {FormNormal}
                        />
                     </div>
                     <div className='addCategoriesWapper__form__field'>
                        <label className='fieldCategoriesLabel'>Mô tả</label>
                        <FastField
                           name = 'describe'
                           component = {TextArea}
                           className = 'textAreaCustom'
                        />
                     </div>
                     <div className='addCategoriesWapper__form__field'>
                        <label className='fieldCategoriesLabel'>Ghi chú</label>
                        <FastField
                           name = 'note'
                           component = {TextArea}
                           className = 'textAreaCustom'
                        />
                     </div>
                     <div className='addCategoriesWapper__form__btnGroup'>
                        <Link to={location?.state?.pathname ?
                            location?.state?.pathname:adminLink.manageCategoriesLink
                        }>
                           <button className='button'>
                              Quay lại
                           </button>
                        </Link>
                        <button type='submit' className='button' disabled={isSubmitting}>
                           Thêm loại sản phẩm
                        </button>
                     </div>
                  </Form>
               );
            }}
         </Formik>
      </div>
   );
}