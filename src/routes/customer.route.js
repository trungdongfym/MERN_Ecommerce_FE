import HomeLayout from "../layouts/customer/homeLayout";
import AccountLayout from "../layouts/customer/accountLayout";
import AccountPage from "../pages/accountPage";
import RequireAuth from "../authentication/requireAuth";
import DecentralAuth from "../authentication/decentralAuth";
import {roleEnum} from '../helpers/constants/userConst';
import ChangePasswordPage from "../pages/changePasswordPage";
import HomePage from "../pages/customers/homePage";
import { customerLink } from "../helpers/linkConstants";
import DetailProductPage from "../pages/customers/detailProductPage";
import CartPage from "../pages/customers/cartPage";

export const customerRoute = {
   path: '/',
   element: 
      <DecentralAuth roleArray={[roleEnum.Custommer]}>
         <HomeLayout />
      </DecentralAuth>
   ,
   children: [
      {
         path: customerLink.userinfo,
         element: 
            <RequireAuth>
               <AccountLayout />
            </RequireAuth>,
         children: [
            {path: [customerLink.userAccount, customerLink.profile].join('/'), element: <AccountPage/>},
            {path: [customerLink.userAccount, customerLink.password].join('/'), element: <ChangePasswordPage/>},
            {path: 'orders', element: <></>}
         ]
      },
      {
         path: '/',
         element: <HomePage />
      },
      {
         path: customerLink.productsLink + '/:productID',
         element: <DetailProductPage/>
      },
      {
         path: customerLink.cartLink,
         element: <CartPage/>
      }
   ]
}
