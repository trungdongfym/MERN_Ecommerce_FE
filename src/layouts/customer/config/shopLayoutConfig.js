import { FaListUl } from 'react-icons/fa';
import { GrFilter } from 'react-icons/gr';

export const sidebarShopConfig = [
   {
      id: 'allCategory',
      title: 'Tất cả danh mục',
      icon: <FaListUl />,
      maxShow: 6,
      showMore: 6,
      path: null,
      subList: []
   },
   {
      id: 'filterSearch',
      title: 'Bộ lọc tìm kiếm',
      icon: <GrFilter />,
      subList: [
         {
            id: 'filterPrice',
            title: 'Khoảng giá',
            icon: null,
         }
      ]
   },
];