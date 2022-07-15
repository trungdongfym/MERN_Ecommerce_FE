import { Avatar, Checkbox, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { GrFormAdd, GrFormSubtract } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Page } from "../../components/base";
import { TableHeadComponent } from "../../components/base/tableComponents";
import { priceFormat } from "../../helpers/formats/priceFormat";
import { customerLink } from "../../helpers/linkConstants";
import { cartSelecttor, userSelector } from "../../redux/selectors";
import { updateCartAsyncAction } from "../../redux/actions/cartActions";
import "./styles/cartStyles.scss";
import { useEffect } from "react";
import { useRef } from "react";
import ModalNotify from "../../components/base/modalNotify";
import useCloseModal from "../../hooks/autoCloseModal";
import ConfirmDialog from "../../components/base/conFirmDialog";

const headerCart = [
   { id: 'checkbox' },
   { id: 'product', label: 'Sản phẩm', alignRight: false, styles: { width: '500px' } },
   { id: 'unitPrice', label: 'Đơn giá (VNĐ)', alignRight: false },
   { id: 'amount', label: 'Số lượng', alignRight: false },
   { id: 'totalPrice', label: 'Số tiền (VNĐ)', alignRight: false },
   { id: 'manipulation', label: 'Thao tác', alignRight: true }
]

export default function CartPage() {
   const cart = useSelector(cartSelecttor) || [];
   const userActive = useSelector(userSelector);
   const [cartUpdate, setCartUpdate] = useState(cart);
   const [cartItemSelected, setCartItemSelected] = useState([]);
   const [modalNotify, setModalNotify] = useState({ type: 'success', open: false, message: '' });
   const [confirmDialog, setConfirmDialog] = useState({
      open: false, message: ''
   });
   const dispatch = useDispatch();
   const isUpdate = useRef(false); // lock call api

   const { totalNoSale, totalSale } = useMemo(() => {
      const totalNoSale = cart.reduce((totalMoney, curItem) => {
         const { product, amount } = curItem;
         const { price } = product || {};
         return totalMoney + price * amount;
      }, 0);
      const totalSale = cart.reduce((totalMoney, curItem) => {
         const { product, amount } = curItem;
         const { price, sale } = product || {};

         if (sale) {
            return totalMoney + parseInt(price - price * (sale / 100)) * amount;
         }
         return totalMoney + price * amount;
      }, 0);
      return { totalNoSale: totalNoSale, totalSale: totalSale };
   }, [cart]);

   useEffect(() => {
      let timeID = null;
      if (!isUpdate.current) return;
      async function updateCart() {
         const { _id: userID } = userActive || {};
         try {
            await dispatch(updateCartAsyncAction(cartUpdate, userID));
            isUpdate.current = false;
         } catch (error) {
            setCartUpdate(cart);
            isUpdate.current = false;
            console.log(error);
         }
      }

      timeID = setTimeout(() => {
         updateCart();
      }, 1500);
      return () => {
         timeID && clearTimeout(timeID);
      }
   }, [cartUpdate]);

   useEffect(() => {
      setCartUpdate(cart);
   }, [cart]);

   const handleChaneAmount = (index, newAmount) => {
      if (newAmount === '') {
         newAmount = 0;
      }
      if (newAmount !== '' && !/^\d+$/.test(newAmount)) return;
      if (typeof newAmount === 'string') {
         newAmount = parseInt(newAmount);
      }

      if (newAmount === 0) {
         const cartClone = structuredClone(cartUpdate);
         cartClone[index].amount = 0;
         setCartUpdate(cartClone);
         return;
      }

      if (newAmount >= 1) {
         const cartClone = structuredClone(cartUpdate);
         cartClone[index].amount = newAmount;
         setCartUpdate(cartClone);
         isUpdate.current = true;
      }
   }
   // handle select cart item
   const handleClickCheckbox = (event, productID) => {
      const selectedIndex = cartItemSelected.indexOf(productID);
      let newSelected = [];
      if (selectedIndex === -1) {
         newSelected = newSelected.concat(cartItemSelected, productID);
      } else if (selectedIndex === 0) {
         newSelected = newSelected.concat(cartItemSelected.slice(1));
      } else if (selectedIndex === cartItemSelected.length - 1) {
         newSelected = newSelected.concat(cartItemSelected.slice(0, -1));
      } else if (selectedIndex > 0) {
         newSelected = newSelected.concat(cartItemSelected.slice(0, selectedIndex),
            cartItemSelected.slice(selectedIndex + 1));
      }
      setCartItemSelected(newSelected);
   };

   const handleSelectAllClick = (event) => {
      if (event.target.checked) {
         const newSelecteds = cartUpdate.map((cartItem) => {
            const { product } = cartItem;
            const { _id: productID } = product;
            return productID;
         });
         setCartItemSelected(newSelecteds);
         return;
      }
      setCartItemSelected([]);
   };
   //end handle select cart item

   const handleDeleteCartItem = (index) => {
      const cartClone = structuredClone(cartUpdate);
      cartClone.splice(index, 1);
      setCartUpdate(cartClone);
      isUpdate.current = true;
   }

   const handleDeleteManyCartItem = () => {
      if (cartItemSelected.length === 0) {
         setModalNotify({ open: true, type: 'warning', message: 'Vui lòng chọn sản phẩm!' });
         return;
      }
      setConfirmDialog({
         open: true, message: `Bạn có muốn loại bỏ ${cartItemSelected.length} sản phảm không?`
      });
   }

   const handleCloseModalNotify = () => {
      setModalNotify(prev => ({ ...prev, open: false }));
   }

   const handleCloseConfirmDialog = (e) => {
      const { click } = e.target.dataset;
      if (click === 'confirm') {
         const newCart = cartUpdate.filter((cartItem) => {
            const { product } = cartItem;
            const { _id: productID } = product || {};
            return !cartItemSelected.includes(productID);
         });
         setCartUpdate(newCart);
         isUpdate.current = true; // unlock call
         setCartItemSelected([]);
      }
      setConfirmDialog(prev => ({ ...prev, open: false }));
   }

   useCloseModal(handleCloseModalNotify, modalNotify, 2000);

   if (Array.isArray(cart) && cart.length === 0) {
      return (
         <Page title='Giỏ hàng' className='cart'>
            <div className="cart__cartEmpty">
               <div className="imgCartEmpty"
                  style={{ backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/static/cartEmpty.png)` }}
               >
               </div>
               <div className="notifyCartEmpty">Giỏ hàng của bạn còn trống</div>
               <Link to={'/'} className='buyNow'>
                  Mua ngay
               </Link>
            </div>
         </Page>
      );
   }

   return (
      <Page title='Giỏ hàng' className='cart'>
         {modalNotify.open &&
            <ModalNotify
               {...modalNotify}
               handleClose={handleCloseModalNotify}
            />
         }
         {confirmDialog.open &&
            <ConfirmDialog
               {...confirmDialog}
               handleClose={handleCloseConfirmDialog}
               className='confirmDeleteCartItem'
            />
         }
         <div className="cartWapper">
            <TableContainer className="cartWapper__tableCartContainer">
               <Table className="cartWapper__tableCartContainer__tableCart">
                  <TableHeadComponent
                     className='tableCartHeader'
                     tableHeadList={headerCart}
                     checkboxProps={{
                        numSelected: cartItemSelected.length,
                        rowCount: cartUpdate?.length || 0,
                        onSelectAllClick: handleSelectAllClick
                     }}
                  />
                  <TableBody className="tableCartBody">
                     {cartUpdate.map((cartItem, index) => {
                        const { product, amount } = cartItem;
                        const { _id: productID, name, image, sale, price } = product || {};
                        const isItemSelected = cartItemSelected.indexOf(productID) !== -1;
                        return (
                           <TableRow
                              hover
                              key={index}
                              tabIndex={-1}
                              role="checkbox"
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
                           >
                              <TableCell padding="checkbox">
                                 <Checkbox
                                    checked={isItemSelected}
                                    onClick={
                                       (e) => {
                                          handleClickCheckbox(e, productID);
                                       }
                                    }
                                 />
                              </TableCell>
                              <TableCell component="th" scope="row" padding="normal">
                                 <Stack direction="row" alignItems="center" spacing={2}>
                                    <Link className="linkProduct"
                                       to={`${customerLink.productsLink}/${productID}`}
                                    >
                                       <Avatar alt={name} src={image} />
                                       <Typography sx={{ marginLeft: '10px' }} variant="subtitle2" noWrap>
                                          {name}
                                       </Typography>
                                    </Link>
                                 </Stack>
                              </TableCell>
                              <TableCell align="left">
                                 <div className={
                                    clsx('unitPrice', { sale: sale && sale > 0 })
                                 }>
                                    {`${priceFormat(price)}`}
                                 </div>
                                 {sale && sale > 0 ?
                                    (<div className='unitPrice'>
                                       {`${priceFormat(parseInt(price - price * sale / 100))}`}
                                    </div>) : null
                                 }
                              </TableCell>
                              <TableCell align="left">
                                 <div className="amountWapper">
                                    <div
                                       className="amountWapper__subtract common"
                                       onClick={(e) => {
                                          handleChaneAmount(index, amount - 1);
                                       }}
                                    >
                                       <GrFormSubtract />
                                    </div>
                                    <div className="amountWapper__input common">
                                       <input
                                          type="text" aria-label="order-amount" role='number'
                                          value={amount !== 0 ? amount : ''}
                                          onChange={(e) => {
                                             const val = e.target.value;
                                             handleChaneAmount(index, val);
                                          }}
                                       />
                                    </div>
                                    <div
                                       className="amountWapper__add common"
                                       onClick={(e) => {
                                          handleChaneAmount(index, amount + 1);
                                       }}
                                    >
                                       <GrFormAdd />
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell align="left">
                                 {sale && sale > 0 ?
                                    `${priceFormat(parseInt(price - price * sale / 100) * amount)}` :
                                    `${priceFormat(price * amount)}`
                                 }
                              </TableCell>
                              <TableCell align="right">
                                 <Tooltip title='Xoá'
                                    onClick={() => {
                                       handleDeleteCartItem(index);
                                    }}
                                 >
                                    <IconButton>
                                       <RiDeleteBin6Line className='moreMenu__delete' />
                                    </IconButton>
                                 </Tooltip>
                              </TableCell>
                           </TableRow>
                        );
                     })}
                  </TableBody>
               </Table>
            </TableContainer>
            <div className="toolCartWapper">
               <div className="toolCartWapper__checkAll">
                  <Checkbox
                     className="toolCartWapper__checkbox"
                     id="toolCartCheckAll"
                     indeterminate={
                        cartItemSelected.length > 0 &&
                        cartItemSelected.length < cartUpdate.length
                     }
                     checked={cartItemSelected.length > 0 && cartItemSelected.length === cartUpdate.length}
                     onChange={handleSelectAllClick}
                  />
                  <label htmlFor="toolCartCheckAll"
                     className="toolCartWapper__checkBoxLabel"
                  >
                     {`Chọn tất cả (${cart?.length})`}
                  </label>
                  <span
                     className="toolCartWapper__delete"
                     onClick={handleDeleteManyCartItem}
                  >
                     Xóa mục đã chọn
                  </span>
               </div>
               <div className="toolCartWapper__cartInfoWapper">
                  <div className="toolCartWapper__cartInfoWapper__cartInfo">
                     <span className="toolCartWapper__cartInfoWapper__cartInfo__totalPayment">
                        {`Tổng thanh toán (${cart?.length} sản phẩm): `}
                        <span className="totalMoney">{`${priceFormat(totalSale)} (VNĐ)`}</span>
                     </span>
                     <span>
                        {
                           `Tiết kiệm: ${`${priceFormat(totalNoSale - totalSale)} (VNĐ)`}`
                        }
                     </span>
                  </div>
                  <div className="toolCartWapper__cartInfoWapper__payment">
                     <button className="btnPayment">Thanh toán</button>
                  </div>
               </div>
            </div>
         </div>
      </Page>
   );
}