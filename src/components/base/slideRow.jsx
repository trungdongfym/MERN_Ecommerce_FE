import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { Grid, Navigation } from "swiper";
import { Swiper } from 'swiper/react';
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import './base.scss';

export default function SlideRow({ children, ...props }) {
   const { row, slidesPerView, suffixesClass } = props;
   return (
      <div className="slider">
         <Swiper
            slidesPerView={slidesPerView}
            grid={{
               rows: row,
               fill: "row"
            }}
            navigation={{
               enabled: true,
               nextEl: `.swiper-next-${suffixesClass}`,
               prevEl: `.swiper-prev-${suffixesClass}`
            }}
            spaceBetween={10}
            modules={[Grid, Navigation]}
         >
            {children}
         </Swiper>
         <div className="swiperBtnWapper">
            <div className={`swiper-prev-${suffixesClass} swiper-prev-common`}>
               <MdOutlineArrowBackIos />
            </div>
         </div>
         <div className="swiperBtnWapper">
            <div className={`swiper-next-${suffixesClass} swiper-next-common`}>
               <MdOutlineArrowForwardIos />
            </div>
         </div>
      </div>
   )
}