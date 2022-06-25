import { FaFacebook, FaInstagram, FaRegQuestionCircle, FaBell } from 'react-icons/fa';
import { commonLink, customerLink } from '../../helpers/linkConstants';

export const navlistLeft = [
   {
      id: 'support',
      title: 'Hỗ trợ',
      path: '/',
      icon: <FaRegQuestionCircle />,
      subList: false,
   },
   {
      id: 'contact',
      title: 'Liên hệ',
      path: null,
      icon: null,
      subList: false,
   },
   {
      id: 'facebookConnect',
      title: null,
      pathAbs: true,
      path: 'https://www.facebook.com/profile.php?id=100010401908856',
      icon: <FaFacebook />,
      subList: false,
   },
   {
      id: 'instagramConnect',
      title: null,
      pathAbs: true,
      path: 'https://www.instagram.com/trungdongfym/',
      icon: <FaInstagram />,
      subList: false,
   }
]

export const navlistRight = [
   {
      id: 'notification',
      title: 'Thông báo',
      path: null,
      icon: <FaBell />,
      subList: false,
   },
   {
      id: 'auth',
      subList: true,
      children: [
         {
            id: 'register',
            title: 'Đăng ký',
            path: customerLink.registerLink,
            icon: null
         },
         {
            id: 'login',
            title: 'Đăng nhập',
            path: commonLink.loginLink,
            icon: null
         }
      ]
   }
]