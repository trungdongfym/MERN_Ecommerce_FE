import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { BsCartPlus } from 'react-icons/bs';
import { GrFormAdd, GrFormSubtract } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import { getProductsApi, getRelateProductApi } from '../../apis/productsApi';
import { Page, Spinner } from '../../components/base';
import ModalNotify from '../../components/base/modalNotify';
import SlideRow from '../../components/base/slideRow';
import ProductContainer from '../../components/customer/productContainer';
import { priceFormat } from '../../helpers/formats/priceFormat';
import { customerLink } from '../../helpers/linkConstants';
import { scrollToAny } from '../../helpers/scrollToAny';
import useCloseModal from '../../hooks/autoCloseModal';
import { addToCartAsyncAction, updateCartAsyncAction } from '../../redux/actions/cartActions';
import { addOrderListAction } from '../../redux/actions/orderActions';
import { cartSelecttor, userSelector } from '../../redux/selectors';
import './styles/detailProduct.scss';

export default function DetailProductPage() {
   const { productID } = useParams();
   const [detailProductData, setDetailProductData] = useState({
      product: null,
      relateProduct: null,
   });
   const [amountOrder, setAmountOrder] = useState(1);
   const [modalNotify, setModalNotify] = useState({ type: 'success', open: false, message: '' });
   const dispatch = useDispatch();
   const cart = useSelector(cartSelecttor);
   const navigate = useNavigate();
   const userActive = useSelector(userSelector);
   const refGotoTop = useRef();

   useEffect(() => {
      async function getProduct() {
         try {
            const objectQuery = {
               match: {
                  _id: productID,
               },
               requireCate: true,
            };
            const productRetrived = await getProductsApi(objectQuery);
            const relateProduct = await getRelateProductApi(productID);
            setDetailProductData({
               product: productRetrived,
               relateProduct: relateProduct,
            });
         } catch (error) {
            console.log(error);
         }
      }
      setDetailProductData((prev) => ({ ...prev, product: null }));
      setAmountOrder(1);
      getProduct();
   }, [productID]);

   const handleChangeAmount = (val) => {
      if (val !== '' && !/^\d+$/.test(val)) return;
      const productData = detailProductData.product;
      const amountProduct = productData?.warehouse?.amount ?? 0;
      if (+val > amountProduct) {
         val = amountProduct.toString();
      }
      setAmountOrder(val);
   };

   const handleAddToCart = async () => {
      const cartItem = {
         product: detailProductData.product,
         amount: amountOrder,
      };

      if (amountOrder <= 0) {
         setModalNotify({
            open: true,
            type: 'warning',
            message: 'Số lượng sản phẩm không hợp lệ!',
         });
         return;
      }

      let indexOfItem = -1;
      for (const index in cart) {
         const { product, amount } = cart[index];
         if (product._id == detailProductData?.product?._id) {
            if (amount === amountOrder) {
               setModalNotify({
                  open: true,
                  type: 'success',
                  message: 'Sản phẩm đã thêm vào giỏ hàng!',
               });
               return;
            }
            indexOfItem = index;
            break;
         }
      }
      try {
         const { _id: userID } = userActive || {};
         if (indexOfItem === -1) {
            const response = await dispatch(addToCartAsyncAction(cartItem, userID));
            const { status, message } = response || {};
            if (status && status === true) {
               setModalNotify({ open: true, type: 'success', message: message });
            } else {
               setModalNotify({
                  open: true,
                  type: 'error',
                  message: message || 'Lỗi không xác định',
               });
            }
         } else {
            const newCart = structuredClone(cart);
            newCart[indexOfItem] = cartItem;
            const response = await dispatch(updateCartAsyncAction(newCart, userID));
            const { status, message } = response || {};
            if (status && status === true) {
               setModalNotify({ open: true, type: 'success', message: message });
            } else {
               setModalNotify({
                  open: true,
                  type: 'error',
                  message: message || 'Lỗi không xác định',
               });
            }
         }
      } catch (error) {
         setModalNotify({
            open: true,
            type: 'error',
            message: error.message || 'Lỗi không xác định',
         });
      }
   };

   const handleBuyNow = () => {
      const productData = detailProductData.product;
      const amountProduct = productData?.warehouse?.amount ?? 0;
      if (amountOrder <= 0 || amountOrder > amountProduct) {
         setModalNotify({
            open: true,
            type: 'warning',
            message: 'Số lượng sản phẩm không hợp lệ!',
         });
         return;
      }
      const orderList = [{ product: detailProductData.product, amount: amountOrder }];
      dispatch(addOrderListAction(orderList));
      navigate(customerLink.orderLink);
   };

   const handleCloseModalNotify = () => {
      setModalNotify((prev) => ({ ...prev, open: false }));
   };

   useCloseModal(handleCloseModalNotify, modalNotify, 2500);

   if (!detailProductData.product) {
      return (
         <div className="loadingContainer">
            <Spinner />
         </div>
      );
   }
   const { product, relateProduct } = detailProductData;
   const { category, warehouse } = product;
   const { amount: amountProduct = 0 } = warehouse ?? {};

   return (
      <Page title={product && product.name} className="detailProductWapper">
         {modalNotify.open && <ModalNotify {...modalNotify} handleClose={handleCloseModalNotify} />}
         <div style={{ display: 'none' }} role="gotoPoint" ref={refGotoTop}></div>
         <div className="detailProductWapper__productWapper detailProductWapper__container">
            <div className="detailProductWapper__productWapper__avtProduct">
               <img src={product?.image} alt={product?.name} />
            </div>
            <div className="detailProductWapper__productWapper__productInfo">
               <div className="detailProductWapper__productWapper__productInfo__name">
                  {product?.name}
               </div>
               <div className="detailProductWapper__productWapper__productInfo__category">
                  <Link className="linkCate" to="/">
                     <span className="linkCate__title">Thể loại: </span>
                     <span className="linkCate__name">{category?.name}</span>
                  </Link>
               </div>
               <div className="detailProductWapper__productWapper__productInfo__priceWapper">
                  <div className={clsx('price', { sale: product?.sale && product?.sale > 0 })}>
                     {`${priceFormat(product?.price)} VNĐ`}
                  </div>
                  {product?.sale && product?.sale > 0 ? (
                     <div className="price">
                        {`${priceFormat(
                           parseInt(product?.price - (product?.price * product?.sale) / 100)
                        )} VNĐ`}
                     </div>
                  ) : null}
                  {product?.sale && product?.sale > 0 ? (
                     <div className="percentSale">{`Giảm ${product.sale}%`}</div>
                  ) : null}
               </div>
               <div className="detailProductWapper__productWapper__productInfo__bookAmount">
                  <div className="title">Số lượng</div>
                  <div className="amountWapper">
                     <div
                        className="amountWapper__subtract common"
                        onClick={() => {
                           const newVal = +amountOrder - 1;
                           handleChangeAmount(newVal.toString());
                        }}
                     >
                        <GrFormSubtract />
                     </div>
                     <div className="amountWapper__input common">
                        <input
                           type="text"
                           aria-label="order-amount"
                           role="number"
                           value={amountOrder}
                           onChange={(e) => {
                              const val = e.target.value;
                              handleChangeAmount(val);
                           }}
                        />
                     </div>
                     <div
                        className="amountWapper__add common"
                        onClick={() => {
                           const newVal = +amountOrder + 1;
                           handleChangeAmount(newVal.toString());
                        }}
                     >
                        <GrFormAdd />
                     </div>
                  </div>
                  <div className="quantityAvailable">{`${amountProduct} sản phẩm có sẵn`}</div>
               </div>
               <div className="detailProductWapper__productWapper__productInfo__orderWapper">
                  <div className="btnGroupOrder">
                     <button
                        className="btnGroupOrder__addCart"
                        onClick={() => {
                           handleAddToCart();
                        }}
                     >
                        <BsCartPlus className="icon" />
                        <span className="text">Thêm vào giỏ hàng</span>
                     </button>
                     <button className="btnGroupOrder__buyNow" onClick={handleBuyNow}>
                        Mua ngay
                     </button>
                  </div>
               </div>
            </div>
         </div>
         {product?.preview && (
            <div className="detailProductWapper__productDetail detailProductWapper__container">
               <div className="detailProductWapper__productDetail__wapper">
                  <h3 className="detailProductWapper__title">Mô tả sản phẩm</h3>
                  <div className="detailProductWapper__productDetail__wapper__content">
                     <pre className="preview">{product?.preview}</pre>
                  </div>
               </div>
            </div>
         )}
         {relateProduct && relateProduct.length > 0 && (
            <div className="detailProductWapper__productRelate detailProductWapper__container">
               <div className="detailProductWapper__productRelate__wapper">
                  <h3 className="detailProductWapper__title">Các sản phẩm liên quan</h3>
                  <SlideRow row={2} slidesPerView={5} suffixesClass="relateProduct">
                     {relateProduct.map((relateProduct) => {
                        const { _id } = relateProduct;
                        return (
                           <SwiperSlide key={_id}>
                              <Link
                                 className="detailProductWapper__productRelate__wapper__link"
                                 to={`${customerLink.productsLink}/${_id}`}
                                 onClick={() => scrollToAny(refGotoTop)}
                              >
                                 <ProductContainer product={relateProduct} />
                              </Link>
                           </SwiperSlide>
                        );
                     })}
                  </SlideRow>
               </div>
            </div>
         )}
      </Page>
   );
}
