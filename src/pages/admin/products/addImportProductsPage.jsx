import { Avatar, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { FastField, FieldArray, Form, Formik } from 'formik';
import { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { addImportProductsApi } from '../../../apis/productsApi';
import MoreMenuTableImport from '../../../components/admin/moreMenuTableImport';
import { FormNormal, InputSelect, Page, TextArea } from '../../../components/base';
import AlertDialog from '../../../components/base/alertDialog';
import ModalNotify from '../../../components/base/modalNotify';
import { TableHeadComponent } from '../../../components/base/tableComponents';
import { paymenTypeEnum } from '../../../helpers/constants/productsConst';
import { parsePriceFormat, priceFormat } from '../../../helpers/formats/priceFormat';
import { adminLink } from '../../../helpers/linkConstants';
import useCloseModal from '../../../hooks/autoCloseModal';
import { userSelector } from '../../../redux/selectors';
import ChooseProducts from '../../../sections/chooseProducts';
import { addImportProductsSchema, importProductsSchema } from '../../../validates/productSchema';

const paymenOptions = [
   {
      id: paymenTypeEnum.cash,
      label: 'Thanh toán tiền mặt',
      value: paymenTypeEnum.cash
   },
   {
      id: paymenTypeEnum.paypal,
      label: 'Thanh toán qua paypal',
      value: paymenTypeEnum.paypal
   }
]

const tableProductsHead = [
   { id: 'name', label: 'Tên sản phẩm', alignRight: false },
   { id: 'price', label: 'Giá nhập (VNĐ)', alignRight: false },
   { id: 'amount', label: 'Số lượng', alignRight: false },
   { id: 'totalMoney', label: 'Tổng tiền (VNĐ)', alignRight: false },
   { id: 'manipulation', label: 'Thao tác', alignRight: true }
]

function FieldArrayImportProducts(props) {
   const { initialDetailImport,
      productSelected, handleClickOpenChooseProducts,
      refFieldControl, errorLabel,
      handleAddImportProducts
   } = props;

   const { setFieldTouchedRef, setFieldValueRef } = refFieldControl;

   return (
      <Formik
         initialValues={initialDetailImport}
         validationSchema={importProductsSchema}
      >
         {(formikProps) => {
            const { setTouched, setFieldTouched, setFieldValue, resetForm,
               errors, values, touched
            } = formikProps;
            return (
               <div className='addImportOrderWapper__formAddProducts'>
                  <h3 className='addImportOrderWapper__formAddProducts__title'>
                     Thêm sản phẩm nhập
                  </h3>
                  <div className='addProductsWapper__form__wapperText__field'>
                     <label className='fieldProductsLabel'>Sản phẩm nhập</label>
                     <FormNormal
                        form={{ errors, touched }}
                        field={{
                           name: 'products',
                           value: productSelected ? productSelected.name : '',
                           onChange: (e) => (e.target.value)
                        }}
                        disabled={true}
                        onClick={(e) => {
                           setFieldTouchedRef.current = setFieldTouched;
                           setFieldValueRef.current = setFieldValue;
                           handleClickOpenChooseProducts(e);
                        }}
                        className="formCustom chooseField"
                     />
                  </div>
                  <div className='addProductsWapper__form__wapperText__field'>
                     <label className='fieldProductsLabel'>Số lượng nhập</label>
                     <FastField
                        name='amount'
                        component={FormNormal}
                        type='Number'
                     />
                  </div>
                  <div className='addProductsWapper__form__wapperText__field'>
                     <label className='fieldProductsLabel'>Giá nhập</label>
                     <FastField
                        name='price'
                        component={FormNormal}
                        type='Number'
                     />
                  </div>
                  {errorLabel &&
                     <div style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}
                     >
                        {errorLabel}
                     </div>}
                  <div className='addProductsWapper__form__btnGroup'>
                     <button type='button' className='button'
                        onClick={
                           () => {
                              handleAddImportProducts(values, setTouched, resetForm);
                           }
                        }
                     >
                        Thêm sản phẩm
                     </button>
                  </div>
               </div>
            );
         }}
      </Formik>
   )
}

export default function AddImportProductsPage() {
   const location = useLocation();
   const [modalNotifyStatus, setModalNotifyStatus] = useState({
      open: false,
      type: 'success',
      message: ''
   });
   // a single product due to user import select
   const [productsSelected, setProductsSelected] = useState(null);
   const [modalChooseProducts, setModalChooseProducts] = useState({ open: false, title: 'Chọn sản phẩm nhập' });
   // a array of product include {_id, image, name, amount, price}
   const [importProducts, setImportProducts] = useState([]); 
   const setFieldTouchedRef = useRef(null);
   const setFieldValueRef = useRef(null);
   const controlFieldArrayRef = useRef(null);
   const userActive = useSelector(userSelector);

   const totalMoneyImport = useMemo(() => {
      const total = importProducts.reduce((totalImport, curImportProduct) => {
         const { price: curPrice, amount: curAmount } = curImportProduct;
         return totalImport + curPrice * curAmount;
      }, 0);
      return total;
   }, [importProducts]);

   const initialValues = {
      titleImport: '',
      supplierName: '',
      phone: '',
      note: '',
      payment: paymenTypeEnum.cash,
      detailImportProducts: []
   }

   const initialDetailImport = {
      products: "",
      amount: "",
      price: "",
   }

   const handleSubmitAddImportProducts = async (importProduct, resetForm) => {
      const {_id: userActiveId} = userActive;
      importProduct.user = userActiveId; // add user ID import
      try {
         const importProductAdded = await addImportProductsApi(importProduct);
         if (importProductAdded) {
            setModalNotifyStatus({ open: true, type: 'success', message: 'Thêm thành công!' });
            setProductsSelected(null);
            setImportProducts([]);
            resetForm({});
         } else {
            setModalNotifyStatus({ open: true, type: 'error', message: 'Thất bại!' });
         }
      } catch (error) {
         setModalNotifyStatus({ open: true, type: 'error', message: error.message });
      }
   }

   const handleAddImportProducts = (values, setTouched, resetForm) => {
      try {
         importProductsSchema.validateSync(values);
      } catch (error) {
         setTouched({
            products: true,
            amount: true,
            price: true
         });
         return;
      }
      controlFieldArrayRef.current.push(values);
      resetForm({});
      setProductsSelected(null);
      // generate import products
      const { amount, price } = values;
      const { _id, name, image } = productsSelected;
      const newImportProduct = { _id, name, image, amount, price };
      setImportProducts(prev => ([...prev, newImportProduct]));
   }

    // update import product
   const handleClickDeleteProductImport = (indexDelete) => {
      controlFieldArrayRef.current.remove(indexDelete);
      importProducts.splice(indexDelete, 1);
      const importProductsClone = structuredClone(importProducts);
      setImportProducts(importProductsClone);
   }

   const handleClickUpdateProductImport = (indexUpdate, setFieldValue) => {
      const {_id:products, amount, price} = importProducts[indexUpdate];
      const importProductUpdate = {products, amount, price};
      setFieldValue(`detailImportProducts[${indexUpdate}]`, importProductUpdate );
   }

   const handleChangPice = (e, index) => {
      const val = parsePriceFormat(e.target.value);
      const regexDigit = /^\d+$/;
      if(val !=='' && !regexDigit.test(val)) return;
      importProducts[index].price = val;
      const tmp = structuredClone(importProducts);
      setImportProducts(tmp);
   }

   const handleChangeAmount = (e, index) => {
      const val = e.target.value;
      importProducts[index].amount = val;
      const tmp = structuredClone(importProducts);
      setImportProducts(tmp);
   }
   // end update import product

   // handle modal notify
   const handleCloseModalNotify = () => {
      setModalNotifyStatus(prev => ({ ...prev, open: false }));
   }

   useCloseModal(handleCloseModalNotify, modalNotifyStatus, 2000); // auto close modal
   // end handle modal notify

   // handle choose products
   const handleClickOpenChooseProducts = () => {
      setModalChooseProducts(prev => ({ ...prev, open: true }));
   }

   const handleCloseChooseProducts = (e) => {
      const { click } = e.target.dataset;
      if (!click) {
         setModalChooseProducts(prev => ({ ...prev, open: false }));
         return;
      }

      if (click === 'confirm' && productsSelected) {
         setFieldValueRef.current('products', productsSelected._id);
         setModalChooseProducts(prev => ({ ...prev, open: false }));
         return;
      }
      if (click === 'cancel') {
         setFieldTouchedRef.current('products', true);
         setProductsSelected(null);
         setModalChooseProducts(prev => ({ ...prev, open: false }));
         return;
      }
   }

   const handleClickCheckboxProducts = (e, productChoosed) => {
      setProductsSelected(productChoosed);
   }
   //end handle choose products
   return (
      <Page title='Nhập sản phẩm' className='addProductsWapper addImportOrderWapper'>
         {modalNotifyStatus.open &&
            <ModalNotify {...modalNotifyStatus} handleClose={handleCloseModalNotify} />
         }
         <AlertDialog
            {...modalChooseProducts}
            handleClose={handleCloseChooseProducts}
         >
            <ChooseProducts
               productSelected={productsSelected}
               importedProducts={importProducts}
               handleClickCheckboxProducts={handleClickCheckboxProducts}
            />
         </AlertDialog>
         <h3 className='addProductsWapper__title'>Đơn nhập sản phẩm</h3>
         <Formik
            initialValues={initialValues}
            validationSchema={addImportProductsSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
               setSubmitting(true);
               await handleSubmitAddImportProducts(values, resetForm);
               setSubmitting(false);
            }}
         >
            {(formikProps) => {
               const { errors,
                  touched, isSubmitting,
                  setFieldValue
               } = formikProps;
               return (
                  <Form className='addProductsWapper__form '>
                     <div className='addProductsWapper__form__wapperText'>
                        <div className='addProductsWapper__form__wapperText__field'>
                           <label className='fieldProductsLabel'>Tiêu đề đơn nhập</label>
                           <FastField
                              name='titleImport'
                              component={FormNormal}
                           />
                        </div>
                        <div className='addProductsWapper__form__wapperText__field'>
                           <label className='fieldProductsLabel'>Tên nhà cung cấp</label>
                           <FastField
                              name='supplierName'
                              component={FormNormal}
                           />
                        </div>
                        <div className='addProductsWapper__form__wapperText__field'>
                           <label className='fieldProductsLabel'>Số điện thoại nhà cung cấp</label>
                           <FastField
                              name='phone'
                              component={FormNormal}
                           />
                        </div>
                        <div className='addProductsWapper__form__wapperText__field'>
                           <label className='fieldProductsLabel'>Phương thức thanh toán</label>
                           <FastField
                              name='payment'
                              component={InputSelect}
                              optionsList={paymenOptions}
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
                        <div className='addProductsWapper__form__wapperText__field'>
                           <FieldArray name='detailImportProducts'>
                              {fieldArrayProps => {
                                 const { push, remove } = fieldArrayProps;
                                 controlFieldArrayRef.current = { push, remove };
                                 const errorLabel = errors['detailImportProducts'] &&
                                    touched['detailImportProducts'] ? errors['detailImportProducts'] : null;
                                 return (
                                    <FieldArrayImportProducts
                                       initialDetailImport={initialDetailImport}
                                       handleClickOpenChooseProducts={handleClickOpenChooseProducts}
                                       refFieldControl={{ setFieldTouchedRef, setFieldValueRef }}
                                       productSelected={productsSelected}
                                       errorLabel={errorLabel}
                                       handleAddImportProducts={(values, setTouched, resetForm) => {
                                          handleAddImportProducts(values, setTouched, resetForm);
                                       }}
                                    />
                                 );
                              }}
                           </FieldArray>
                        </div>
                        <div className='addImportOrderWapper__formAddProducts__tableProducts'>
                           <h4 className='addImportOrderWapper__formAddProducts__tableProducts__title'>
                              Sản phẩm nhập
                           </h4>
                           <TableContainer>
                              <Table>
                                 <TableHeadComponent tableHeadList={tableProductsHead} />
                                 <TableBody>
                                    {importProducts.map((importProduct, index) => {
                                       const { _id: idProduct, name: nameProduct,
                                          image, amount, price
                                       } = importProduct;
                                       const subtTotalMoney = price * amount;
                                       return (
                                          <TableRow
                                             hover
                                             key={idProduct}
                                             tabIndex={-1}
                                          >
                                             <TableCell component="th" scope="row" padding="none">
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                   <Avatar alt={nameProduct} src={image} />
                                                   <Typography variant="subtitle2" noWrap>
                                                      {nameProduct}
                                                   </Typography>
                                                </Stack>
                                             </TableCell>
                                             <TableCell align="left" padding="none">
                                                <input type="text"
                                                   className='inputUpdateImport'
                                                   value={priceFormat(price)}
                                                   onChange = { (e) => {handleChangPice(e, index)} }
                                                />
                                             </TableCell>
                                             <TableCell align="left" padding="none">
                                                <input type="Number"
                                                   className='inputUpdateImport'
                                                   value={amount}
                                                   onChange = { (e) => {handleChangeAmount(e, index)} }
                                                />
                                             </TableCell>
                                             <TableCell align="left" padding="none">
                                                {priceFormat(subtTotalMoney)}
                                             </TableCell>
                                             <TableCell align="right" padding="none">
                                                <MoreMenuTableImport
                                                   handleClickDeleteProductImport={() => {
                                                      handleClickDeleteProductImport(index);
                                                   }}
                                                   handleClickUpdateProductImport={() => {
                                                      handleClickUpdateProductImport(index, setFieldValue);
                                                   }}
                                                />
                                             </TableCell>
                                          </TableRow>
                                       );
                                    })}
                                 </TableBody>
                              </Table>
                           </TableContainer>
                           <div className='addImportOrderWapper__formAddProducts__tableProducts__totalMoney'>
                              {`Tổng số tiền đơn nhập: ${priceFormat(totalMoneyImport)} (VNĐ)`}
                           </div>
                        </div>
                        <div className='addProductsWapper__form__btnGroup'>
                           <Link to={location?.state?.pathname ?
                              location?.state?.pathname : adminLink.manageImportProductLink
                           }>
                              <button className='button'>
                                 Quay lại
                              </button>
                           </Link>
                           <button type='submit' className='button' disabled={isSubmitting}>
                              Thêm đơn nhập
                           </button>
                        </div>
                     </div>
                  </Form>
               );
            }}
         </Formik>
      </Page>
   );
}