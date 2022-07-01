import {FiHome} from 'react-icons/fi';
import {AiOutlineShoppingCart} from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import {adminLink} from '../../../helpers/linkConstants';

export const sidebarAdminConfig = [
   {
      id:'dashboards',
      title:'Trang chủ',
      path: '/admin',
      icon: <FiHome className='icon' />,
      sublist: null
   },
   {
      id:'users',
      title:'Người dùng',
      path: '/admin',
      icon: <FaUsers className='icon'/>,
      sublist: null
   },
   {
      id:'products',
      title:'Sản phẩm',
      path: null,
      icon: <AiOutlineShoppingCart className='icon'/>,
      sublist: [
         {
            id:'manageProducts',
            title:'Quản lý sản phẩm',
            path: adminLink.manageProductLink,
            icon: null,
         },
         {
            id:'categoryProducts',
            title:'Loại sản phẩm',
            path: adminLink.manageCategoriesLink,
            icon: null,
         },
         {
            id:'importProducts',
            title:'Nhập sản phẩm',
            path: adminLink.manageImportProductLink,
            icon: null,
         },
         {
            id:'exportProducts',
            title:'Xuất sản phẩm',
            path: '/admin',
            icon: null,
         },
      ]
   },
]