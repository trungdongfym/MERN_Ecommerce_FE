import { Avatar, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { FastField, Form, Formik } from "formik";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { addOrderApi } from "../../apis/orderApi";
import { FormNormal, InputSelect, Page, TextArea } from "../../components/base";
import ModalNotify from "../../components/base/modalNotify";
import { TableHeadComponent } from "../../components/base/tableComponents";
import { paymenTypeEnum } from "../../helpers/constants/productsConst";
import { priceFormat } from "../../helpers/formats/priceFormat";
import { customerLink } from '../../helpers/linkConstants';
import useCloseModal from "../../hooks/autoCloseModal";
import { fetchCartAction } from '../../redux/actions/cartActions';
import { orderListSelector, userSelector } from '../../redux/selectors';
import { orderSchema } from "../../validates/orderSchema";
import './styles/orderStyles.scss';

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

function generateOrderListData(orderList) {
   const orderData = orderList.map((orderItem) => {
      const { product, amount } = orderItem;
      const { _id: productID, price, sale = 0 } = product || {};
      return { product: productID, amount, price, sale };
   });
   return orderData;
}

export default function OrderPage() {
   const orderList = useSelector(orderListSelector);
   const userActive = useSelector(userSelector);
   const [modalNotify, setModalNotify] = useState({ type: 'success', open: false, message: '' });
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const initialValues = {
      receiveAddress: '',
      receivePhone: '',
      note: '',
      paymentType: paymenTypeEnum.cash,
      orderList: generateOrderListData(orderList)
   };

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

   const handleOrder = async (orderData) => {
      const { _id: userID } = userActive;
      orderData.user = userID;
      try {
         const response = await addOrderApi(orderData);
         if (response?.status) {
            const { payload: orderSaved } = response;
            const { _id: orderID } = orderSaved || {};
            dispatch(fetchCartAction(userID));
            navigate(`${customerLink.detailOrderLink}/${orderID}`, { replace: true });
            return;
         } else {
            const { errors } = response;
            setModalNotify({ open: true, type: 'error', message: errors?.message || 'Lỗi đặt hàng!'});
         }
      } catch (error) {
         console.log(error);
      }
   }

   const handleCloseModalNotify = () => {
      setModalNotify(prev => ({ ...prev, open: false }));
   }
   useCloseModal(handleCloseModalNotify, modalNotify, 2500);

   return (
      <Page title='Đặt hàng' className='orderPage'>
         {modalNotify.open &&
            <ModalNotify
               {...modalNotify}
               handleClose={handleCloseModalNotify}
            />
         }
         <h3 className='orderPage__title'>Thông tin đơn đặt hàng</h3>
         <Formik
            initialValues={initialValues}
            validationSchema={orderSchema}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
               setSubmitting(true);
               await handleOrder(values);
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
                           />
                        </div>
                        <div className='orderWapper__wapperText__field'>
                           <label className='fieldProductsLabel'>Số điện thoại người nhận</label>
                           <FastField
                              name='receivePhone'
                              component={FormNormal}
                           />
                        </div>
                        <div className='orderWapper__wapperText__field'>
                           <label className='fieldProductsLabel'>Phương thức thanh toán</label>
                           <FastField
                              name='paymentType'
                              component={InputSelect}
                              optionsList={paymenOptions}
                           />
                        </div>
                        <div className='orderWapper__wapperText__field'>
                           <label className='fieldProductsLabel'>Ghi chú đặt hàng</label>
                           <FastField
                              name='note'
                              component={TextArea}
                              className='textAreaCustom'
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
                                    const { product, amount } = orderItem;
                                    const {
                                       _id: idProduct, name: nameProduct,
                                       image, price, sale
                                    } = product || {};

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
                        <div className='orderWapper__order__provision'>
                           <span>Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản</span>
                           <Link className="linkProvision" to='/'>
                              Shopman
                           </Link>
                        </div>
                        <button
                           type='submit'
                           className='button'
                           disabled={isSubmitting}
                        >
                           Đặt hàng
                        </button>
                     </div>
                  </Form>
               );
            }}
         </Formik>
      </Page>
   )
}