import HomeLayout from "../layouts/customer/homeLayout";
import AccountLayout from "../layouts/customer/accountLayout";
import AccountPage from "../pages/accountPage";
import RequireAuth from "../authentication/requireAuth";
import DecentralAuth from "../authentication/decentralAuth";
import { roleEnum } from '../helpers/constants/userConst';
import ChangePasswordPage from "../pages/changePasswordPage";
import HomePage from "../pages/customers/homePage";
import { customerLink } from "../helpers/linkConstants";
import DetailProductPage from "../pages/customers/detailProductPage";
import CartPage from "../pages/customers/cartPage";
import OrderPage from "../pages/customers/orderPage";
import DetailOrderPage from "../pages/customers/detailOrderPage";
import ShopLayout from "../layouts/customer/shopLayout";
import ShopPage from "../pages/customers/shopPage";
import ListOrderPage from '../pages/customers/orderListPage';

export const customerRoute = {
   path: '/',
   element:
      <DecentralAuth roleArray={[roleEnum.Custommer]}>
         <HomeLayout />
      </DecentralAuth>
   ,
   children: [
      {
         path: '/',
         element: <HomePage />
      },
      {
         path: customerLink.userinfo,
         element:
            <RequireAuth>
               <AccountLayout />
            </RequireAuth>,
         children: [
            { path: [customerLink.userAccount, customerLink.profile].join('/'), element: <AccountPage /> },
            { path: [customerLink.userAccount, customerLink.password].join('/'), element: <ChangePasswordPage /> },
            { path: customerLink.listOrder, element: <ListOrderPage /> },
            { path: customerLink.listOrder + '/:orderID', element: <DetailOrderPage /> }
         ]
      },
      {
         path: customerLink.productsLink + '/:productID',
         element: <DetailProductPage />
      },
      {
         path: customerLink.cartLink,
         element: <CartPage />
      },
      {
         path: customerLink.orderLink,
         element:
            <RequireAuth>
               <OrderPage />
            </RequireAuth>
      },
      {
         path: customerLink.shopLink,
         element: <ShopLayout />,
         children: [
            { path: '', element: <ShopPage /> }
         ]
      }
   ]
}
