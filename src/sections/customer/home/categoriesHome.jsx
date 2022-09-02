import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Grid, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { customerLink } from '../../../helpers/linkConstants';
import qs from 'qs';
import '../styles/categoriesHome.scss';

export default function CategoriesHome(props) {
   const { categoriesList = [] } = props;
   return (
      <div className="homeWapper__categoriesWapper">
         <h3 className="homeWapper__categoriesWapper__title">Danh mục</h3>
         <div className="homeWapper__categoriesWapper__cateSlide">
            <Swiper
               slidesPerView={5}
               grid={{
                  rows: 2,
                  fill: 'row',
               }}
               navigation={{
                  enabled: true,
                  nextEl: '.swiper-next-cate',
                  prevEl: '.swiper-prev-cate',
               }}
               spaceBetween={10}
               modules={[Grid, Navigation]}
            >
               {categoriesList.map((category) => {
                  const { avatarOfCate, name, _id } = category;

                  const searchPam = new URLSearchParams();
                  searchPam.set(
                     'filter',
                     qs.stringify({
                        cateId: _id,
                     })
                  );

                  const linkCate = `${customerLink.shopLink}?${searchPam.toString()}`;

                  return (
                     <SwiperSlide key={_id}>
                        <Link
                           className="homeWapper__categoriesWapper__cateSlide__link"
                           to={linkCate}
                           state={{ concat: true }}
                        >
                           <div className="homeWapper__categoriesWapper__cateSlide__imageCate">
                              <img src={avatarOfCate} alt={name} />
                           </div>
                           <div className="homeWapper__categoriesWapper__cateSlide__nameCate">
                              {name}
                           </div>
                        </Link>
                     </SwiperSlide>
                  );
               })}
            </Swiper>
            <div className="swiper-prev-cate swiper-prev-common">
               <MdOutlineArrowBackIos />
            </div>
            <div className="swiper-next-cate swiper-next-common">
               <MdOutlineArrowForwardIos />
            </div>
         </div>
      </div>
   );
}
