import { Formik, Form, FastField } from 'formik';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FormNormal, InputFileImage, TextArea } from '../../../components/base';
import { adminLink } from '../../../helpers/linkConstants';
import { addCategorieSchema } from '../../../validates/productSchema';
import { addCategoryApi, getCategoriesApi, updateCategoriesApi } from '../../../apis/categoriesApi';
import ModalNotify from '../../../components/base/modalNotify';
import useCloseModal from '../../../hooks/autoCloseModal';
import './styles/categories.scss';
import { useState } from 'react';
import { Avatar } from '@mui/material';
import { useEffect } from 'react';
import { useMemo } from 'react';

function stringAvatar(name) {
   return {
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
   };
}

export default function DetailCategoriesPage() {
   const location = useLocation();
   const { cateID } = useParams();
   const [modalNotifyStatus, setModalNotifyStatus] = useState({
      open: false,
      type: 'success',
      message: ''
   });
   const [previewAvt, setPreviewAvt] = useState(null);
   const [category, setCategory] = useState({});
   const initialValues = useMemo(() => {
      const {
         name = '',
         avatarOfCate = '',
         describe = '',
         note = '',
      } = category;
      return { name, avatarOfCate, describe, note };
   }, [category]);

   useEffect(() => {
      async function getCategory() {
         try {
            const categoryRetrived = await getCategoriesApi({ match: { _id: cateID } });
            if (categoryRetrived) {
               setCategory(categoryRetrived);
            }
         } catch (error) {
            console.log(error);
         }
      }
      getCategory();
   }, [cateID]);

   const handleUpdateCategory = async (category) => {
      const { name, avatarOfCate, describe, note } = category;
      const fd = new FormData();
      fd.append('name', name);
      fd.append('describe', describe);
      fd.append('note', note);
      if (typeof avatarOfCate === 'object')
         fd.append('avatarOfCate', avatarOfCate, avatarOfCate.name);
      try {
         const res = await updateCategoriesApi(fd, cateID);
         setModalNotifyStatus({ open: res.status, type: res.type, message: res.message });
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
         <h3 className='addCategoriesWapper__title'>Chi tiết loại sản phẩm</h3>
         <Formik
            initialValues={initialValues}
            validationSchema={addCategorieSchema}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
               setSubmitting(true);
               await handleUpdateCategory(values);
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
                              Cập nhập
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