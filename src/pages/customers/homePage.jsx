import { useEffect, useState } from "react";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { Link } from 'react-router-dom';
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from 'swiper/react';
import { getCategoriesApi } from "../../apis/categoriesApi";
import { getProductsApi } from "../../apis/productsApi";
import { Page } from "../../components/base";
import CategoriesHome from "../../sections/customer/home/categoriesHome";
import FlashSaleHome from "../../sections/customer/home/flashSaleHome";
import { slideBarConfig } from "./config/slideBarConfig";
import "./styles/homeStyles.scss";

export default function HomePage() {
   const [homeData, setHomeData] = useState({
      categories: [],
      flashSale: []
   });

   useEffect(() => {
      async function getDateHome() {
         try {
            const categoriesRetrieved = await getCategoriesApi();
            const productFlashSale = await getProductsApi({ flashSale: true });
            setHomeData({
               categories: categoriesRetrieved,
               flashSale: productFlashSale
            });
         } catch (error) {
            console.log(error);
         }
      }
      getDateHome();
   }, []);

   return (
      <Page title='Trang chủ' className='home'>
         <div className="homeWapper">
            <div className="homeWapper__slideBar">
               <Swiper
                  slidesPerView={2}
                  spaceBetween={10}
                  autoplay={{
                     delay: 3000,
                     disableOnInteraction: false,
                  }}
                  slidesPerGroup={1}
                  loop={true}
                  loopFillGroupWithBlank={true}
                  navigation={{
                     enabled: true,
                     nextEl: '.swiper-next-slideBar',
                     prevEl: '.swiper-prev-slideBar'
                  }}
                  modules={[Navigation, Autoplay]}
                  className="mySwiper"
               >
                  {slideBarConfig.map((item) => {
                     const { id, image, path } = item;
                     return (
                        <SwiperSlide key={id}>
                           <Link className="homeWapper__slideBar__link" to={path}>
                              <img className="homeWapper__slideBar__link__image" src={image} alt={id} />
                           </Link>
                        </SwiperSlide>
                     );
                  })}
               </Swiper>
               <div className="swiper-prev-slideBar">
                  <MdOutlineArrowBackIos />
               </div>
               <div className="swiper-next-slideBar">
                  <MdOutlineArrowForwardIos />
               </div>
            </div>
            <div className="homeWapper__categories">
               <CategoriesHome
                  categoriesList={homeData?.categories}
               />
            </div>
            <div className="homeWapper__flashSale">
               <FlashSaleHome
                  flashSaleList={homeData?.flashSale}
               />
            </div>
         </div>
      </Page>
   );
}