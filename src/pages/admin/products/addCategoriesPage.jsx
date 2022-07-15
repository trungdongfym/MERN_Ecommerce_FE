import { Formik, Form, FastField } from 'formik';
import { Link, useLocation } from 'react-router-dom';
import { FormNormal, InputFileImage, TextArea } from '../../../components/base';
import { adminLink } from '../../../helpers/linkConstants';
import { addCategorieSchema } from '../../../validates/productSchema';
import { addCategoryApi } from '../../../apis/categoriesApi';
import ModalNotify from '../../../components/base/modalNotify';
import useCloseModal from '../../../hooks/autoCloseModal';
import './styles/categories.scss';
import { useState } from 'react';
import { Avatar } from '@mui/material';

function stringAvatar(name) {
   return {
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
   };
}

export default function AddCategoriesPage() {
   const location = useLocation();
   const [modalNotifyStatus, setModalNotifyStatus] = useState({
      open: false,
      type: 'success',
      message: ''
   });
   const [previewAvt, setPreviewAvt] = useState(null);
   const initialValues = {
      name: '',
      avatarOfCate: '',
      describe: '',
      note: '',
   }

   const handleAddCategory = async (category, resetForm) => {
      const { name, avatarOfCate, describe, note } = category;
      const fd = new FormData();
      fd.append('name', name);
      fd.append('describe', describe);
      fd.append('note', note);
      fd.append('avatarOfCate', avatarOfCate, avatarOfCate.name);
      try {
         const cateSaved = await addCategoryApi(fd);
         if (cateSaved) {
            setModalNotifyStatus({ open: true, type: 'success', message: 'Thêm thành công!' });
            resetForm({});
         } else {
            setModalNotifyStatus({ open: true, type: 'error', message: 'Thất bại!' });
         }
      } catch (error) {
         setModalNotifyStatus({ open: true, type: 'error', message: error.message });
      }
   }

   const handleCloseModalNotify = () => {
      setModalNotifyStatus(prev => ({ ...prev, open: false }));
   }

   useCloseModal(handleCloseModalNotify, modalNotifyStatus, 2000); // auto close modal

   return (
      <div className='addCategoriesWapper'>
         {modalNotifyStatus.open &&
            <ModalNotify {...modalNotifyStatus} handleClose={handleCloseModalNotify} />
         }
         <h3 className='addCategoriesWapper__title'>Thêm loại sản phẩm</h3>
         <Formik
            initialValues={initialValues}
            validationSchema={addCategorieSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
               setSubmitting(true);
               await handleAddCategory(values, resetForm);
               setSubmitting(false);
            }}
         >
            {(formikProps) => {
               const { isSubmitting, errors, touched, values,
                  setFieldValue, setFieldTouched
               } = formikProps;
               return (
                  <Form className='addCategoriesWapper__form' encType='multipart/form-data'>
                     <div className='addProductsWapper__form__wapperText'>
                        <div className='addCategoriesWapper__form__field'>
                           <label className='fieldCategoriesLabel'>Tên loại sản phẩm</label>
                           <FastField
                              name='name'
                              component={FormNormal}
                           />
                        </div>
                        <div className='addCategoriesWapper__form__field'>
                           <label className='fieldCategoriesLabel'>Mô tả</label>
                           <FastField
                              name='describe'
                              component={TextArea}
                              className='textAreaCustom'
                           />
                        </div>
                        <div className='addCategoriesWapper__form__field'>
                           <label className='fieldCategoriesLabel'>Ghi chú</label>
                           <FastField
                              name='note'
                              component={TextArea}
                              className='textAreaCustom'
                           />
                        </div>
                        <div className='addCategoriesWapper__form__btnGroup'>
                           <Link to={location?.state?.pathname ?
                              location?.state?.pathname : adminLink.manageCategoriesLink
                           }>
                              <button className='button'>
                                 Quay lại
                              </button>
                           </Link>
                           <button type='submit' className='button' disabled={isSubmitting}>
                              Thêm loại sản phẩm
                           </button>
                        </div>
                     </div>
                     <div className='addCategoriesWapper__form__wapperFile'>
                        <div className='imageWapper'>
                           <Avatar
                              className='imageWapper__avatar'
                              {...stringAvatar('Category Avatar')}
                              src={previewAvt ? previewAvt : values['avatarOfCate']}
                              alt='avatarOfCate'
                           />
                           <div className='imageWapper__fileChoose'>
                              <FastField
                                 name='avatarOfCate'
                                 component={InputFileImage}
                                 setFieldValue={setFieldValue}
                                 label='Chọn ảnh thể loại sản phẩm'
                                 setPreviewAvt={setPreviewAvt}
                                 setFieldTouched={setFieldTouched}
                              />
                           </div>
                           <div className='imageWapper__note'>
                              <p>Dụng lượng file tối đa 1 MB</p>
                              <p>Định dạng:.JPEG, .PNG</p>
                           </div>
                           <div className='imageWapper__error'>
                              {errors['avatarOfCate'] && touched['avatarOfCate'] &&
                                 <p>{errors['avatarOfCate']}</p>
                              }
                           </div>
                        </div>
                     </div>
                  </Form>
               );
            }}
         </Formik>
      </div>
   );
}