import { useEffect, useState } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getCategoriesApi } from '../../apis/categoriesApi';
import { getListProductApi, getProductsApi } from '../../apis/productsApi';
import { Page, Spinner } from '../../components/base';
import BestSellHome from '../../sections/customer/home/bestsallHome';
import CategoriesHome from '../../sections/customer/home/categoriesHome';
import FlashSaleHome from '../../sections/customer/home/flashSaleHome';
import { slideBarConfig } from './config/slideBarConfig';
import './styles/homeStyles.scss';

export default function HomePage() {
   const [homeData, setHomeData] = useState({
      categories: [],
      flashSale: [],
      bestsellList: [],
   });
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      async function getDataHome() {
         try {
            const categoriesRetrieved = await getCategoriesApi();
            const productFlashSale = await getProductsApi({ flashSale: true });
            const bestsellProduct = await getListProductApi({
               pagination: { page: 0, pageSize: 20 },
               sort: { bestsell: -1 },
            });

            setHomeData({
               categories: categoriesRetrieved,
               flashSale: productFlashSale,
               bestsellList: bestsellProduct?.data?.products ?? [],
            });
            setIsLoading(false);
         } catch (error) {
            console.log(error);
         }
      }
      getDataHome();
   }, []);

   return (
      <Page title="Trang chủ" className="home">
         {isLoading ? (
            <div className="homeWapper">
               <Spinner />
            </div>
         ) : (
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
                        prevEl: '.swiper-prev-slideBar',
                     }}
                     modules={[Navigation, Autoplay]}
                     className="mySwiper"
                  >
                     {slideBarConfig.map((item) => {
                        const { id, image, path } = item;
                        return (
                           <SwiperSlide key={id}>
                              <Link className="homeWapper__slideBar__link" to={path}>
                                 <img
                                    className="homeWapper__slideBar__link__image"
                                    src={image}
                                    alt={id}
                                 />
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
                  <CategoriesHome categoriesList={homeData?.categories} />
               </div>
               <div className="homeWapper__flashSale">
                  <FlashSaleHome flashSaleList={homeData?.flashSale} />
               </div>
               <div className="homeWapper__bestsell">
                  <BestSellHome bestsellList={homeData?.bestsellList} />
               </div>
            </div>
         )}
      </Page>
   );
}
