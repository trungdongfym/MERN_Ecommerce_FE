import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { sidebarShopConfig } from './config/shopLayoutConfig';
import SidebarShop from './sidebarShop';
import TopbarShop from './topbarShop';
import { getCategoriesApi } from '../../apis/categoriesApi';
import './styles/sidebarShop.scss';

function ShopLayout() {
   const [sidebarConfig, setSidebarConfig] = useState(sidebarShopConfig);

   useEffect(() => {
      async function getDataShopLayout() {
         try {
            const categories = await getCategoriesApi();
            setSidebarConfig((prevConfig) => {
               const cateConfig = prevConfig.find((item) => item.id === 'allCategory');
               cateConfig.subList = categories;
               return [...prevConfig];
            });
         } catch (error) {
            console.log('Get data shop layout error:', error);
         }
      }
      getDataShopLayout();
   }, []);
   return (
      <div className="shopWapper">
         <SidebarShop config={sidebarConfig} />
         <div className="shopWapper__content">
            <TopbarShop />
            <Outlet />
         </div>
      </div>
   );
}

export default ShopLayout;
