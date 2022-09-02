import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Grid, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../styles/flashSaleHome.scss';
import { BsFillLightningChargeFill } from 'react-icons/bs';
import ProductContainer from '../../../components/customer/productContainer';
import { customerLink } from '../../../helpers/linkConstants';

export default function BestSellHome(props) {
   const { bestsellList = [] } = props;

   return (
      <div className="homeWapper__flashSaleWapper">
         <h3 className="homeWapper__flashSaleWapper__title">
            <span className="text">Best Sell</span>
            <BsFillLightningChargeFill className="icon" />
         </h3>
         <div className="homeWapper__flashSaleWapper__flashSaleSlide">
            <Swiper
               slidesPerView={5}
               grid={{
                  rows: 2,
                  fill: 'row',
               }}
               navigation={{
                  enabled: true,
                  nextEl: '.swiper-next-bestsell',
                  prevEl: '.swiper-prev-bestsell',
               }}
               spaceBetween={10}
               modules={[Grid, Navigation]}
            >
               {bestsellList.map((productSale) => {
                  const { _id } = productSale;
                  return (
                     <SwiperSlide key={_id}>
                        <Link
                           className="homeWapper__flashSaleWapper__flashSaleSlide__link"
                           to={`${customerLink.productsLink}/${_id}`}
                        >
                           <ProductContainer product={productSale} showSellNumber={true} />
                        </Link>
                     </SwiperSlide>
                  );
               })}
            </Swiper>
            <div className="swiper-prev-bestsell swiper-prev-common">
               <MdOutlineArrowBackIos />
            </div>
            <div className="swiper-next-bestsell swiper-next-common">
               <MdOutlineArrowForwardIos />
            </div>
         </div>
      </div>
   );
}
