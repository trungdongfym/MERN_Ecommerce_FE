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
      path: adminLink.manageUsersLink,
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
            title:'Quản lý kho',
            path: adminLink.manageWarehouseLink,
            icon: null,
         },
      ]
   },
]