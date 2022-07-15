import { Avatar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { FastField, Form, Formik } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getImportProductsApi, updateImportProductsApi } from '../../../apis/productsApi';
import { FormNormal, InputSelect, Page, TextArea } from '../../../components/base';
import NativeSelectCustom from '../../../components/base/inputField';
import ModalNotify from '../../../components/base/modalNotify';
import { TableHeadComponent } from '../../../components/base/tableComponents';
import { importProductStatusEnum, paymenTypeEnum } from '../../../helpers/constants/productsConst';
import { dateTimeFormat } from '../../../helpers/formats/dateTimeFormat';
import { priceFormat } from '../../../helpers/formats/priceFormat';
import { adminLink } from '../../../helpers/linkConstants';
import useCloseModal from '../../../hooks/autoCloseModal';
import { userSelector } from '../../../redux/selectors';
import { updateImportProductsSchema } from '../../../validates/productSchema';

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
]

const statusOptions = [
   {
      id: importProductStatusEnum.Pending,
      label: 'Chờ duyệt',
      value: importProductStatusEnum.Pending
   },
   {
      id: importProductStatusEnum.Completed,
      label: 'Hoàn thành',
      value: importProductStatusEnum.Completed
   },
   {
      id: importProductStatusEnum.Cancelled,
      label: 'Đã hủy',
      value: importProductStatusEnum.Cancelled
   }
]

function generateImportProductField(importProductRaw) {
   let {
      titleImport = '',
      supplierName = '',
      phone = '',
      note = '',
      payment = paymenTypeEnum.cash,
      status = '',
      detailImportProducts = []
   } = importProductRaw;

   detailImportProducts = detailImportProducts.map((detailImportProduct) => {
      const { amount, price, products } = detailImportProduct;
      const { _id: productID } = products || {};
      return { products: productID, amount, price }
   });
   return { titleImport, supplierName, phone, payment, note, status, detailImportProducts }
}

export default function DetailImportProductsPage() {
   const location = useLocation();
   const { importID } = useParams();
   const [modalNotifyStatus, setModalNotifyStatus] = useState({
      open: false,
      type: 'success',
      message: ''
   });
   // a array of product include {_id, image, name, amount, price}
   const [importProduct, setImportProduct] = useState({}); // save raw importproduct
   const [detailImportProduct, setDetailImportProduct] = useState([]);
   const userActive = useSelector(userSelector);

   const totalMoneyImport = useMemo(() => {
      const total = detailImportProduct.reduce((totalImport, curImportProduct) => {
         const { price: curPrice, amount: curAmount } = curImportProduct;
         return totalImport + curPrice * curAmount;
      }, 0);
      return total;
   }, [detailImportProduct]);

   const initialValues = useMemo(() => {
      return generateImportProductField(importProduct);
   }, [importProduct]);

   useEffect(() => {
      async function getImportProduct() {
         if (importID) {
            try {
               let importProductRetrived = await getImportProductsApi({
                  match: { _id: importID },
                  requireUser: true,
                  requireProducts: true
               });//format [{importProduct}]
               // let importProductRetrived = generateUserInfo(userRetrieved); 
               if (importProductRetrived) {
                  const importProductTmp = importProductRetrived[0];//format [{importProduct}]
                  let { detailImportProducts } = importProductTmp;
                  detailImportProducts = detailImportProducts.map((detailImportProduct) => {
                     const { products, amount, price } = detailImportProduct || {};
                     const { _id, name, image } = products || {};
                     return { _id, name, amount, image, price };
                  });
                  // update form
                  setImportProduct(importProductRetrived[0]);
                  // update table
                  setDetailImportProduct(detailImportProducts);
               } else {
                  console.log('error', importProductRetrived);
               }
            } catch (error) {
               console.log(error);
            }
         }
      }
      getImportProduct();
   }, [importID]);

   const handleUpdateImportProducts = async (importProduct) => {
      const { _id: userActiveId } = userActive;
      importProduct.user = userActiveId; // add user ID import
      try {
         const updateStatus = await updateImportProductsApi(importProduct, importID);
         if (updateStatus.status) {
            setImportProduct(prev => ({ ...prev, status: importProduct.status }));
            setModalNotifyStatus({ open: true, type: 'success', message: 'Cập nhập thành công!' });
         } else {
            setModalNotifyStatus({ open: true, type: 'error', message: 'Thất bại!' });
         }
      } catch (error) {
         setModalNotifyStatus({ open: true, type: 'error', message: error.message });
      }
   }

   // handle modal notify
   const handleCloseModalNotify = () => {
      setModalNotifyStatus(prev => ({ ...prev, open: false }));
   }

   useCloseModal(handleCloseModalNotify, modalNotifyStatus, 2000); // auto close modal
   // end handle modal notify

   return (
      <Page title='Nhập sản phẩm' className='addProductsWapper addImportOrderWapper'>
         {modalNotifyStatus.open &&
            <ModalNotify {...modalNotifyStatus} handleClose={handleCloseModalNotify} />
         }
         <h3 className='addProductsWapper__title'>Thông tin đơn nhập sản phẩm</h3>
         <Formik
            initialValues={initialValues}
            validationSchema={updateImportProductsSchema}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
               setSubmitting(true);
               await handleUpdateImportProducts(values);
               setSubmitting(false);
            }}
         >
            {(formikProps) => {
               const { isSubmitting } = formikProps;
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
                        <div className='addImportOrderWapper__formAddProducts__tableProducts'>
                           <h4 className='addImportOrderWapper__formAddProducts__tableProducts__title'>
                              Sản phẩm nhập
                           </h4>
                           <TableContainer>
                              <Table>
                                 <TableHeadComponent tableHeadList={tableProductsHead} />
                                 <TableBody>
                                    {detailImportProduct.map((detailItem, index) => {
                                       const { _id: idProduct, name: nameProduct,
                                          image, amount, price
                                       } = detailItem;
                                       const subtTotalMoney = price * amount;
                                       return (
                                          <TableRow
                                             hover
                                             key={index}
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
                                                {priceFormat(price)}
                                             </TableCell>
                                             <TableCell align="left" padding="none">
                                                {amount}
                                             </TableCell>
                                             <TableCell align="left" padding="none">
                                                {priceFormat(subtTotalMoney)}
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
                        <div className='updateImportProduct__moreInfo'>
                           {importProduct && importProduct?.user &&
                              <div className='updateImportProduct__moreInfo__userImport'>
                                 <h4 className='updateImportProduct__moreInfo__userImport__title'>
                                    Thông tin người nhập
                                 </h4>
                                 <TableContainer>
                                    <Table>
                                       <TableHead>
                                          <TableRow>
                                             <TableCell align='left'>Tên người nhập</TableCell>
                                             <TableCell align='left'>Vị trí</TableCell>
                                             <TableCell align='left'>Số điện thoại</TableCell>
                                             <TableCell align='left'>Email</TableCell>
                                          </TableRow>
                                       </TableHead>
                                       <TableBody>
                                          <TableRow>
                                             <TableCell component="th" scope="row" padding='none'>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                   <Avatar
                                                      alt={importProduct.user.name}
                                                      src={importProduct.user.avatar}
                                                   />
                                                   <Typography variant="subtitle2" noWrap>
                                                      {importProduct.user.name}
                                                   </Typography>
                                                </Stack>
                                             </TableCell>
                                             <TableCell align='left'>{importProduct.user.role}</TableCell>
                                             <TableCell align='left'>{importProduct.user.phone}</TableCell>
                                             <TableCell align='left'>{importProduct.user.email}</TableCell>
                                          </TableRow>
                                       </TableBody>
                                    </Table>
                                 </TableContainer>
                              </div>
                           }
                        </div>
                        <div className='updateImportProduct__moreInfo'>
                           {importProduct &&
                              <p className='updateImportProduct__timeCreate'>
                                 {`Ngày tạo đơn: ${dateTimeFormat(new Date(importProduct.createdAt))}`}
                              </p>
                           }
                        </div>
                        <div className='updateImportProduct__moreInfo'>
                           {importProduct &&
                              <p className='updateImportProduct__timeUpdate'>
                                 {`Thời gian cập nhập lần cuối: 
                                 ${dateTimeFormat(new Date(importProduct.updatedAt))}`}
                              </p>
                           }
                        </div>
                        <div className='addProductsWapper__form__wapperText__field'>
                           <label className='fieldProductsLabel bold'>Trạng thái đơn nhập</label>
                           <FastField
                              name='status'
                              component={NativeSelectCustom}
                              optionsList={statusOptions}
                           />
                        </div>
                        <div className='addProductsWapper__form__btnGroup'>
                           <Link to={location?.state?.pathname ?
                              location?.state?.pathname : adminLink.manageImportProductLink
                           }>
                              <button className='button'>
                                 Quay lại
                              </button>
                           </Link>
                           <button
                              type='submit' className='button'
                              disabled={
                                 isSubmitting ||
                                 importProduct.status !== importProductStatusEnum.Pending
                              }
                           >
                              Cập nhập đơn nhập
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