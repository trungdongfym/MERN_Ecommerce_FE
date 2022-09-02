import { FaUser } from 'react-icons/fa';
import { BsFileTextFill } from 'react-icons/bs';
import { customerLink } from '../../../helpers/linkConstants';

export const sidebarAccountConfig = [
   {
      id: 'account',
      title: 'Tài khoản của tôi',
      path: customerLink.profileLink,
      icons: <FaUser />,
      sublist: [
         {
            id: 'profile',
            title: 'Hồ sơ',
            path: customerLink.profileLink,
            icons: null,
         },
         {
            id: 'password',
            title: 'Mật khẩu',
            path: customerLink.passwordLink,
            icons: null,
         }
      ]
   },
   {
      id: 'orders',
      title: 'Đơn mua',
      path: customerLink.detailOrderLink,
      icons: <BsFileTextFill />,
      sublist: null
   }
]