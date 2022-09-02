import { Page } from '../../components/base';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './styles/orderListPageStyles.scss';
import { useMemo, useState } from 'react';
import useQueryParam from '../../hooks/useQueryParam';
import clsx from 'clsx';
import { customerLink } from '../../helpers/linkConstants';
import { GoSearch } from 'react-icons/go';
import { useEffect } from 'react';
import { getOrderListApi } from '../../apis/orderApi';
import { importProductStatusEnum, paymenTypeEnum } from '../../helpers/constants/productsConst';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { TableHeadComponent } from '../../components/base/tableComponents';
import { useCallback } from 'react';
import { priceFormat } from '../../helpers/formats/priceFormat';
import { statusOrderEnum } from '../../helpers/constants/orderConst';

const statusOrderMap = {
   Pending: 'Chờ xác nhận',
   Approved: 'Đã duyệt',
   Delivery: 'Đang giao hàng',
   Completed: 'Hoàn thành',
   Canceled: 'Đã hủy',
};

const paymentMap = {
   [paymenTypeEnum.cash]: 'Thanh toán tiền mặt',
   [paymenTypeEnum.paypal]: 'Thanh toán qua paypal',
};

const statusMap = {
   [statusOrderEnum.PENDING]: {
      label: statusOrderMap[statusOrderEnum.PENDING],
      color: '#fabb05',
   },
   [statusOrderEnum.CANCELED]: {
      label: statusOrderMap[statusOrderEnum.CANCELED],
      color: '#e94235',
   },
   [statusOrderEnum.COMPLETE]: {
      label: statusOrderMap[statusOrderEnum.COMPLETE],
      color: '#34a853',
   },
   [statusOrderEnum.DELIVERY]: {
      label: statusOrderMap[statusOrderEnum.DELIVERY],
      color: '#4285f4',
   },
   [statusOrderEnum.APPROVED]: {
      label: statusOrderMap[statusOrderEnum.APPROVED],
      color: '#32a551',
   },
};

const orderStatus = [
   { id: 'all', label: 'Tất cả', value: 'all' },
   { id: 'Pending', label: statusOrderMap.Pending, value: 'Pending' },
   { id: 'Approved', label: statusOrderMap.Approved, value: 'Approved' },
   { id: 'Delivery', label: statusOrderMap.Delivery, value: 'Delivery' },
   { id: 'Completed', label: statusOrderMap.Completed, value: 'Completed' },
   { id: 'Canceled', label: statusOrderMap.Canceled, value: 'Canceled' },
];

const tableOdersHead = [
   { id: 'orderId', label: 'Mã đơn hàng', alignRight: false },
   { id: 'payment', label: 'Phương thức thanh toán', alignRight: false },
   { id: 'listProduct', label: 'Danh sách sản phẩm', alignRight: false },
   { id: 'totalMoney', label: 'Tổng tiền (VNĐ)', alignRight: false },
   { id: 'orderStatus', label: 'Trạng thái đơn hàng', alignRight: false },
];

function OrderListPage() {
   const [orders, setOrders] = useState([]);
   const [statusParam, setStatusParam] = useQueryParam('status', 'all', { stringParam: true });
   const [searchValue, setSearchValue] = useState('');
   const navigate = useNavigate();

   const getOrderList = useCallback(
      async function () {
         try {
            const query = { filter: { status: statusParam } };

            if (searchValue !== '') {
               query.search = searchValue;
            }
            const orderList = await getOrderListApi(query);
            console.log(orderList);
            setOrders(orderList);
         } catch (error) {
            console.log('Get order list error:', error);
         }
      },
      [statusParam, searchValue]
   );

   useEffect(() => {
      getOrderList();
   }, [statusParam]);

   useEffect(() => {
      let timeId = null;

      timeId = setTimeout(() => {
         getOrderList();
      }, 500);

      return () => {
         timeId && clearTimeout(timeId);
      };
   }, [searchValue]);

   const totalMoneyOrder = useCallback((orderItem) => {
      const { orderList = [] } = orderItem;
      const total = orderList.reduce((totalOrder, curOrder) => {
         const { price: curPrice, amount: curAmount, sale } = curOrder;
         if (sale) {
            return totalOrder + parseInt(curPrice - curPrice * (sale / 100)) * curAmount;
         }
         return totalOrder + curPrice * curAmount;
      }, 0);
      return total;
   }, []);

   const handleChangeFilterStatusOrder = (status) => {
      setStatusParam(status);
   };

   const handleClickDetailOrder = (orderId) => {
      navigate(`${customerLink.detailOrderLink}/${orderId}`);
   };

   const handleChangeSearch = (e) => {
      const val = e.target.value;
      setSearchValue(val);
   };

   return (
      <Page title="Đơn hàng" className="listOrderPage">
         <div className="listOrder">
            <ul className="listOrder__listStatus">
               {orderStatus.map((status) => {
                  const { id, label, value } = status;
                  const searchValue = new URLSearchParams();
                  searchValue.set('status', value);
                  return (
                     <li key={id} className={clsx('listItem', { active: statusParam === value })}>
                        <div
                           className="listItem__link"
                           onClick={() => handleChangeFilterStatusOrder(value)}
                        >
                           {label}
                        </div>
                     </li>
                  );
               })}
            </ul>
            {statusParam === 'all' ? (
               <div className="listOrder__search">
                  <GoSearch className="listOrder__search__icon" />
                  <input
                     className="listOrder__search__input"
                     type="text"
                     autoComplete="off"
                     placeholder="Tìm kiếm theo ID đơn hàng hoặc tên sản phẩm"
                     onChange={handleChangeSearch}
                  />
               </div>
            ) : null}
            <div className="listOrder__wrapper">
               {orders.length > 0 ? (
                  <TableContainer>
                     <Table>
                        <TableHeadComponent tableHeadList={tableOdersHead} />
                        <TableBody>
                           {orders.map((orderItem) => {
                              const {
                                 _id: orderId,
                                 paymentType,
                                 statusOrder,
                                 orderList = [],
                              } = orderItem;
                              return (
                                 <TableRow
                                    sx={{ cursor: 'pointer' }}
                                    hover
                                    key={orderId}
                                    tabIndex={-1}
                                    onClick={() => handleClickDetailOrder(orderId)}
                                 >
                                    <TableCell component="th" scope="row" padding="normal">
                                       {orderId}
                                    </TableCell>
                                    <TableCell align="left">{paymentMap[paymentType]}</TableCell>
                                    <TableCell align="left">
                                       <ul className="listProduct">
                                          {orderList.map((orderItem) => {
                                             const { product } = orderItem;
                                             const { name, _id } = product;
                                             return (
                                                <li key={_id} className="listProduct__name">
                                                   {`- ${name}`}
                                                </li>
                                             );
                                          })}
                                       </ul>
                                    </TableCell>
                                    <TableCell align="left">
                                       {priceFormat(totalMoneyOrder(orderItem))}
                                    </TableCell>
                                    <TableCell
                                       align="left"
                                       style={{
                                          color: `${statusMap[statusOrder].color}`,
                                          fontWeight: 500,
                                       }}
                                    >
                                       {statusMap[statusOrder].label}
                                    </TableCell>
                                 </TableRow>
                              );
                           })}
                        </TableBody>
                     </Table>
                  </TableContainer>
               ) : (
                  <div className="listOrder__empty">
                     <div
                        className="listOrder__empty__imgage"
                        style={{
                           backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/static/orderImage.png)`,
                        }}
                     ></div>
                     <div className="listOrder__empty__text">Không có đơn hàng</div>
                  </div>
               )}
            </div>
         </div>
      </Page>
   );
}

export default OrderListPage;
