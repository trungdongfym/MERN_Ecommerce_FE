import { Avatar } from '@mui/material';
import { FastField, Form, Formik } from 'formik';
import { useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { addProductsApi, getProductsApi, updateProductsApi } from '../../../apis/productsApi';
import { FormNormal, InputFileImage, Page, TextArea } from '../../../components/base';
import AlertDialog from '../../../components/base/alertDialog';
import ModalNotify from '../../../components/base/modalNotify';
import { adminLink } from '../../../helpers/linkConstants';
import useCloseModal from '../../../hooks/autoCloseModal';
import ChooseCategories from '../../../sections/chooseCategories';
import { addProductsSchema, updateProductsSchema } from '../../../validates/productSchema';
import './styles/categories.scss';

function stringAvatar(name) {
   return {
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
   };
}

function generateProductField(productRaw) {
   let {
      name = '',
      preview = '',
      price = '',
      image = '',
      note = '',
      sale = '',
      category = null
   } = productRaw;
   const { _id: cateID = '' } = category || {};
   return { name, preview, price, image, note, sale, category: cateID }
}

export default function DetailProductsPage() {
   const location = useLocation();
   const { productID } = useParams();
   const [modalNotifyStatus, setModalNotifyStatus] = useState({
      open: false,
      type: 'success',
      message: ''
   });

   const [categorySelected, setCategorySelected] = useState(null);
   const [product, setProduct] = useState({});
   const [previewAvt, setPreviewAvt] = useState(null);
   const [modalChooseCate, setModalChooseCate] = useState({ open: false, title: 'Chọn loại sản phẩm' });
   const setFieldTouchedRef = useRef(null);
   const setFieldValueRef = useRef(null);

   const initialValues = useMemo(() => {
      return generateProductField(product);
   }, [product]);

   useEffect(() => {
      async function getProduct() {
         if (productID) {
            try {
               const productRetrived = await getProductsApi({
                  match: { _id: productID },
                  requireCate: true
               });
               if (productRetrived) {
                  const { category } = productRetrived;
                  setCategorySelected(category);
                  setProduct(productRetrived);
               } else {
                  console.log('error', productRetrived);
               }
            } catch (error) {
               console.log(error);
            }
         }
      }
      getProduct();
   }, [productID]);

   const handleUpdateProducts = async (productUpdate) => {
      const productFormData = new FormData();
      const { name, preview, price, image, category, note, sale } = productUpdate;
      const { _id: productID } = product;
      
      productFormData.append('name', name);
      productFormData.append('preview', preview);
      productFormData.append('price', price);
      productFormData.append('sale', sale);
      if(typeof image === 'object')
         productFormData.append('image', image, image.name);
      productFormData.append('category', category);
      productFormData.append('note', note);
      try {
         const productAdded = await updateProductsApi(productFormData, productID);
         if (productAdded) {
            setModalNotifyStatus({ open: true, type: 'success', message: 'Cập nhập thành công!' });
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

   // handle choose category
   const handleClickOpenChooseCate = () => {
      setModalChooseCate(prev => ({ ...prev, open: true }));
   }

   const handleCloseChooseCate = (e) => {
      const { click } = e.target.dataset;
      if (!click) {
         setModalChooseCate(prev => ({ ...prev, open: false }));
         return;
      }

      if (click === 'confirm' && categorySelected) {
         setFieldValueRef.current('category', categorySelected._id);
         setModalChooseCate(prev => ({ ...prev, open: false }));
         return;
      }
      if (click === 'cancel') {
         setFieldTouchedRef.current('category', true);
         setCategorySelected(null);
         setModalChooseCate(prev => ({ ...prev, open: false }));
         return;
      }
   }

   const handleClickCheckboxCate = (e, cateChoosed) => {
      setCategorySelected(cateChoosed);
   }
   //end handle choose category
   return (
      <Page title='Thêm sản phẩm' className='addProductsWapper'>
         {modalNotifyStatus.open &&
            <ModalNotify {...modalNotifyStatus} handleClose={handleCloseModalNotify} />
         }
         <AlertDialog
            {...modalChooseCate}
            handleClose={handleCloseChooseCate}
         >
            <ChooseCategories
               cateSelected={categorySelected}
               handleClickCheckboxCate={handleClickCheckboxCate}
            />
         </AlertDialog>
         <h3 className='addProductsWapper__title'>Thêm sản phẩm</h3>
         <Formik
            initialValues={initialValues}
            validationSchema={updateProductsSchema}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
               setSubmitting(true);
               await handleUpdateProducts(values);
               setSubmitting(false);
            }}
         >
            {(formikProps) => {
               const { values, errors,
                  touched, isSubmitting,
                  setFieldValue, setFieldTouched,
               } = formikProps;
               return (
                  <Form className='addProductsWapper__form'>
                     <div className='addProductsWapper__form__wapperText'>
                        <div className='addProductsWapper__form__wapperText__field'>
                           <label className='fieldProductsLabel'>Tên sản phẩm</label>
                           <FastField
                              name='name'
                              component={FormNormal}
                           />
                        </div>
                        <div className='addProductsWapper__form__wapperText__field'>
                           <label className='fieldProductsLabel'>Loại sản phẩm</label>
                           <FormNormal
                              form={{ errors, touched }}
                              field={{
                                 name: 'category',
                                 value: categorySelected ? categorySelected.name : '',
                                 onChange: (e) => (e.target.value)
                              }}
                              disabled={true}
                              onClick={() => {
                                 setFieldTouchedRef.current = setFieldTouched;
                                 setFieldValueRef.current = setFieldValue;
                                 handleClickOpenChooseCate();
                              }}
                              className="formCustom chooseField"
                           />
                        </div>
                        <div className='addProductsWapper__form__wapperText__field'>
                           <label className='fieldProductsLabel'>Giá sản phẩm (VNĐ)</label>
                           <FastField
                              name='price'
                              component={FormNormal}
                              type='Number'
                           />
                        </div>
                        <div className='addProductsWapper__form__wapperText__field'>
                           <label className='fieldProductsLabel'>Giảm giá sản phẩm (%)</label>
                           <FastField
                              name='sale'
                              component={FormNormal}
                              type='Number'
                           />
                        </div>
                        <div className='addProductsWapper__form__wapperText__field'>
                           <label className='fieldProductsLabel'>Giới thiệu sản phẩm</label>
                           <FastField
                              name='preview'
                              component={TextArea}
                              className='textAreaCustom'
                           />
                        </div>
                        <div className='addProductsWapper__form__wapperText__field'>
                           <label className='fieldProductsLabel'>Ghi chú</label>
                           <FastField
                              name='note'
                              component={TextArea}
                              className='textAreaCustom'
                           />
                        </div>
                        <div className='addProductsWapper__form__btnGroup'>
                           <Link to={location?.state?.pathname ?
                              location?.state?.pathname : adminLink.manageProductLink
                           }>
                              <button className='button'>
                                 Quay lại
                              </button>
                           </Link>
                           <button type='submit' className='button' disabled={isSubmitting}>
                              Cập nhập sản phẩm
                           </button>
                        </div>
                     </div>
                     <div className='addProductsWapper__form__wapperFile'>
                        <div className='imageWapper'>
                           <Avatar
                              className='imageWapper__avatar'
                              {...stringAvatar('Products Image')}
                              src={previewAvt ? previewAvt : values['image']}
                              alt='avatar'
                           />
                           <div className='imageWapper__fileChoose'>
                              <FastField
                                 name='image'
                                 component={InputFileImage}
                                 setFieldValue={setFieldValue}
                                 label='Chọn ảnh sản phẩm'
                                 setPreviewAvt={setPreviewAvt}
                                 setFieldTouched={setFieldTouched}
                              />
                           </div>
                           <div className='imageWapper__note'>
                              <p>Dụng lượng file tối đa 1 MB</p>
                              <p>Định dạng:.JPEG, .PNG</p>
                           </div>
                           <div className='imageWapper__error'>
                              {errors['image'] && touched['image'] ? (
                                 <p>{errors['image']}</p>
                              ) : null}
                           </div>
                        </div>
                     </div>
                  </Form>
               );
            }}
         </Formik>
      </Page>
   );
}