import {FaUser} from 'react-icons/fa';
import {BsFileTextFill} from 'react-icons/bs';
import { customerLink } from '../../../helpers/linkConstants';

export const sidebarAccountAdminConfig = [
   {
      id: 'account',
      title: 'Tài khoản của tôi',
      path: customerLink.profileAdminLink,
      icons: <FaUser />,
      sublist:[
         {
            id: 'profile',
            title: 'Hồ sơ',
            path: customerLink.profileAdminLink,
            icons: null,
         },
         {
            id: 'password',
            title: 'Mật khẩu',
            path: customerLink.passwordAdminLink,
            icons: null,
         }
      ]
   },
   // {
   //    id: 'orders',
   //    title: 'Đơn mua',
   //    path: '/admin/userinfo/orders',
   //    icons: <BsFileTextFill />,
   //    sublist: null
   // }
]