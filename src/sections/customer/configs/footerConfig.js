import { BsFacebook, BsInstagram, BsLinkedin, BsFillTelephoneFill } from 'react-icons/bs';
import { MdLocationPin, MdEmail } from 'react-icons/md';

export const footerConfig = [
   {
      id: 'aboutMe',
      label: 'Về shopman',
      icon: null,
      title: null,
      path: null,
      subList: [
         {
            id: 'introDuce',
            label: 'Giới thiệu về shopman',
            icon: null,
            title: '',
            path: '/'
         },
         {
            id: 'recruit',
            label: 'Tuyển dụng',
            icon: null,
            title: '',
            path: '/'
         },
         {
            id: 'flasSale',
            label: 'Flash Sales',
            icon: null,
            title: '',
            path: '/'
         },
      ]
   },
   {
      id: 'customerCare',
      label: 'Chăm sóc khách hàng',
      icon: null,
      title: null,
      path: null,
      subList: [
         {
            id: 'FAQ',
            label: 'FAQ',
            icon: null,
            title: '',
            path: '/'
         },
         {
            id: 'paymentType',
            label: 'Phương thức thanh toán',
            icon: null,
            title: '',
            path: '/'
         },
         {
            id: 'actionMethod',
            label: 'Cách hoạt động',
            icon: null,
            title: '',
            path: '/'
         },
      ]
   },
   {
      id: 'flowMe',
      label: 'THEO DÕI CHÚNG TÔI TRÊN',
      icon: null,
      title: null,
      path: null,
      subList: [
         {
            id: 'Facebook',
            label: 'Facebook',
            icon: <BsFacebook />,
            title: '',
            path: '/'
         },
         {
            id: 'intagram',
            label: 'Instagram',
            icon: <BsInstagram />,
            title: '',
            path: '/'
         },
         {
            id: 'LinkedIn',
            label: 'LinkedIn',
            icon: <BsLinkedin />,
            title: '',
            path: '/'
         },
      ]
   },
   {
      id: 'ask',
      label: 'Câu hỏi ?',
      icon: null,
      title: null,
      path: null,
      subList: [
         {
            id: 'address',
            label: 'Thanh Trì, Hà Nội',
            icon: <MdLocationPin />,
            title: '',
            path: '/'
         },
         {
            id: 'phone',
            label: '+0975107xxx',
            icon: <BsFillTelephoneFill />,
            title: '',
            path: '/'
         },
         {
            id: 'email',
            label: 'Trungdongfym@gmail.com',
            icon: <MdEmail />,
            title: '',
            path: '/'
         },
      ]
   }
]