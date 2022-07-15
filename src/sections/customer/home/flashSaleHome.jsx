import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { Link } from "react-router-dom";
import { Grid, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import '../styles/flashSaleHome.scss';
import { BsFillLightningChargeFill } from 'react-icons/bs';
import ProductContainer from '../../../components/customer/productContainer';
import { customerLink } from '../../../helpers/linkConstants';

export default function FlashSaleHome(props) {

   const { flashSaleList = [] } = props;

   return (
      <div className="homeWapper__flashSaleWapper">
         <h3 className="homeWapper__flashSaleWapper__title">
            <span className='text'>Flash Sale</span>
            <BsFillLightningChargeFill className='icon' />
         </h3>
         <div className="homeWapper__flashSaleWapper__flashSaleSlide">
            <Swiper
               slidesPerView={5}
               grid={{
                  rows: 2,
                  fill: "row"
               }}
               navigation={{
                  enabled: true,
                  nextEl: '.swiper-next-flashSale',
                  prevEl: '.swiper-prev-flashSale'
               }}
               spaceBetween={10}
               modules={[Grid, Navigation]}
            >
               {flashSaleList.map((productSale) => {
                  const { _id } = productSale;
                  return (
                     <SwiperSlide key={_id}>
                        <Link
                           className="homeWapper__flashSaleWapper__flashSaleSlide__link"
                           to={`${customerLink.productsLink}/${_id}`}
                        >
                           <ProductContainer
                              product={productSale}
                           />
                        </Link>
                     </SwiperSlide>
                  );
               })}
            </Swiper>
            <div className="swiper-prev-flashSale swiper-prev-common">
               <MdOutlineArrowBackIos />
            </div>
            <div className="swiper-next-flashSale swiper-next-common">
               <MdOutlineArrowForwardIos />
            </div>
         </div>
      </div>
   );
}