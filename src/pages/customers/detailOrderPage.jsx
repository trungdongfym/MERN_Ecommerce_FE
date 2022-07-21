import { Avatar, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { FastField, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderApi, updateOrderApi } from "../../apis/orderApi";
import { FormNormal, InputSelect, Page, TextArea } from "../../components/base";
import ModalNotify from "../../components/base/modalNotify";
import StepperCustom from "../../components/base/stepper";
import { TableHeadComponent } from "../../components/base/tableComponents";
import { statusOrderEnum } from "../../helpers/constants/orderConst";
import { paymenTypeEnum } from "../../helpers/constants/productsConst";
import { priceFormat } from "../../helpers/formats/priceFormat";
import useCloseModal from "../../hooks/autoCloseModal";
import { updateOrderSchema } from "../../validates/orderSchema";
import { MdOutlineCancel } from 'react-icons/md';
import './styles/detailOrderStyles.scss';

const tableProductsHead = [
   { id: 'name', label: 'Tên sản phẩm', alignRight: false },
   { id: 'unitPrice', label: 'Đơn giá (VNĐ)', alignRight: false },
   { id: 'amount', label: 'Số lượng', alignRight: false },
   { id: 'totalMoney', label: 'Tổng tiền (VNĐ)', alignRight: false },
]

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

const statusOrderMap = {
   Pending: 'Chờ duyệt',
   Approved: 'Đã duyệt',
   Delivery: 'Đang giao hàng',
   Completed: 'Hoàn thành',
}

const stepsOrder = Object.values(statusOrderMap);
const stepKeys = Object.keys(statusOrderMap);

export default function DetailOrderPage() {
   const { orderID } = useParams();
   const [modalNotify, setModalNotify] = useState({ type: 'success', open: false, message: '' });
   const [detailOrder, setDetailOrder] = useState({});

   const orderList = useMemo(() => {
      const { orderList = [] } = detailOrder || {};
      return orderList;
   }, [detailOrder]);

   const activeStep = useMemo(() => {
      const { statusOrder } = detailOrder;
      const index = stepKeys.indexOf(statusOrder);
      return index;
   }, [detailOrder]);

   const isDisableInput = useMemo(() => {
      if (activeStep > 0 || detailOrder?.statusOrder === statusOrderEnum.CANCELED) {
         return true;
      }
      return false;
   }, [detailOrder]);

   const initialValues = useMemo(() => {
      const {
         receiveAddress = '',
         receivePhone = '',
         note = '',
         paymentType = paymenTypeEnum.cash,
      } = detailOrder;
      return { receiveAddress, receivePhone, note, paymentType };
   }, [detailOrder]);

   const totalMoney = useMemo(() => {
      const totalSale = orderList.reduce((totalMoney, curItem) => {
         const { product, amount } = curItem;
         const { price, sale } = product || {};

         if (sale && sale > 0) {
            return totalMoney + parseInt(price - price * (sale / 100)) * amount;
         }
         return totalMoney + price * amount;
      }, 0);
      return totalSale;
   }, [orderList]);

   useEffect(() => {
      if (!orderID) return;
      const getOrder = async () => {
         try {
            const orderRetrieved = await getOrderApi(orderID);
            setDetailOrder(orderRetrieved);
         } catch (error) {
            console.log(error);
         }
      }
      getOrder();
   }, [orderID]);

   const handleCloseModalNotify = () => {
      setModalNotify(prev => ({ ...prev, open: false }));
   }
   useCloseModal(handleCloseModalNotify, modalNotify, 2500);

   const handleCancelOrder = async () => {
      if (activeStep > 0) {
         setModalNotify({ open: true, type: 'error', message: 'Không thể hủy đơn hàng đã được duyệt!' });
         return;
      }
      try {
         const result = await updateOrderApi({ statusOrder: statusOrderEnum.CANCELED }, orderID);
         if (result?.status) {
            setDetailOrder(prev => ({ ...prev, statusOrder: statusOrderEnum.CANCELED }))
            setModalNotify({ open: true, type: 'success', message: 'Hủy đơn hàng thành công!' });
         } else {
            setModalNotify({ open: true, type: 'error', message: 'Hủy đơn hàng thất bại!' });
         }
      } catch (error) {
         setModalNotify({ open: true, type: 'error', message: error?.message });
      }
   }

   const handleReOrder = async () => {
      try {
         const result = await updateOrderApi({ statusOrder: statusOrderEnum.PENDING }, orderID);
         if (result?.status) {
            setDetailOrder(prev => ({ ...prev, statusOrder: statusOrderEnum.PENDING }))
            setModalNotify({ open: true, type: 'success', message: 'Đặt lại đơn hàng thành công!' });
         } else {
            setModalNotify({ open: true, type: 'error', message: 'Đặt lại đơn hàng thất bại!' });
         }
      } catch (error) {
         setModalNotify({ open: true, type: 'error', message: error?.message });
      }
   }

   const handleUpdateOrder = (updateOrder) => {
      console.log('ok');
   }

   return (
      <Page title='Chi tiết đơn hàng' className='detailOrder'>
         {modalNotify.open &&
            <ModalNotify
               {...modalNotify}
               handleClose={handleCloseModalNotify}
            />
         }
         <h3 className='detailOrder__title'>Thông tin đơn hàng</h3>
         {detailOrder?.statusOrder !== statusOrderEnum.CANCELED ?
            (
               <StepperCustom
                  steps={stepsOrder}
                  activeStep={activeStep}
               />
            ) : (
               <div className="detailOrder__canceledOrder">
                  <MdOutlineCancel className="icon" />
                  <span className="detailOrder__canceledOrder__title">
                     Đơn hàng đã bị hủy
                  </span>
               </div>
            )
         }
         <Formik
            initialValues={initialValues}
            validationSchema={updateOrderSchema}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
               setSubmitting(true);
               await handleUpdateOrder(values);
               setSubmitting(false);
            }}
         >
            {(formikProps) => {
               const { isSubmitting, errors, values } = formikProps;
               return (
                  <Form className='orderWapper'>
                     <div className='orderWapper__wapperText'>
                        <div className='orderWapper__wapperText__field'>
                           <label className='fieldProductsLabel'>Địa chỉ nhận hàng</label>
                           <FastField
                              name='receiveAddress'
                              component={FormNormal}
                              disabled={isDisableInput}
                           />
                        </div>
                        <div className='orderWapper__wapperText__field'>
                           <label className='fieldProductsLabel'>Số điện thoại người nhận</label>
                           <FastField
                              name='receivePhone'
                              component={FormNormal}
                              disabled={isDisableInput}
                           />
                        </div>
                        <div className='orderWapper__wapperText__field'>
                           <label className='fieldProductsLabel'>Phương thức thanh toán</label>
                           <FastField
                              name='paymentType'
                              component={InputSelect}
                              optionsList={paymenOptions}
                              disabled={isDisableInput}
                           />
                        </div>
                        <div className='orderWapper__wapperText__field'>
                           <label className='fieldProductsLabel'>Ghi chú đặt hàng</label>
                           <FastField
                              name='note'
                              component={TextArea}
                              className='textAreaCustom'
                              disabled={isDisableInput}
                           />
                        </div>
                     </div>
                     <div className='orderWapper__tableProducts'>
                        <h4 className='orderWapper__tableProducts__title'>
                           Sản phẩm
                        </h4>
                        <TableContainer>
                           <Table>
                              <TableHeadComponent tableHeadList={tableProductsHead} />
                              <TableBody>
                                 {orderList.map((orderItem) => {
                                    const { product, amount, price, sale } = orderItem;
                                    const { _id: idProduct, name: nameProduct, image } = product || {};

                                    const unitPrice = sale && sale > 10 ?
                                       parseInt(price - price * (sale / 100)) * amount :
                                       price * amount;

                                    return (
                                       <TableRow
                                          key={idProduct}
                                          tabIndex={-1}
                                       >
                                          <TableCell component="th" scope="row">
                                             <Stack direction="row" alignItems="center" spacing={1}>
                                                <Avatar alt={nameProduct} src={image} />
                                                <Typography variant="subtitle2" noWrap>
                                                   {nameProduct}
                                                </Typography>
                                             </Stack>
                                          </TableCell>
                                          <TableCell align="left">
                                             {priceFormat(unitPrice)}
                                          </TableCell>
                                          <TableCell align="left">
                                             {amount}
                                          </TableCell>
                                          <TableCell align="left">
                                             {priceFormat(unitPrice * amount)}
                                          </TableCell>
                                       </TableRow>
                                    );
                                 })}
                              </TableBody>
                           </Table>
                        </TableContainer>
                        <div className='orderWapper__tableProducts__totalMoney'>
                           {`Tổng số tiền (${orderList.length} sản phẩm): ${priceFormat(totalMoney)} (VNĐ)`}
                        </div>
                     </div>
                     <div className='orderWapper__order'>
                        {detailOrder?.statusOrder === statusOrderEnum.CANCELED ?
                           (<button
                              type="button"
                              className='button'
                              disabled={isSubmitting}
                              onClick={handleReOrder}
                           >
                              Đặt lại đơn hàng
                           </button>) :
                           (<button
                              type="button"
                              className='button btnCancel'
                              disabled={isSubmitting}
                              onClick={handleCancelOrder}
                           >
                              Hủy đơn hàng
                           </button>)
                        }
                        <button
                           type='submit'
                           className='button'
                           disabled={isSubmitting || activeStep > 0
                              || detailOrder?.statusOrder === statusOrderEnum.CANCELED
                           }
                        >
                           Cập nhập đơn hàng
                        </button>
                     </div>
                  </Form>
               );
            }}
         </Formik>
      </Page>
   );
}