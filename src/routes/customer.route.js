import HomeLayout from "../layouts/customer/homeLayout";
import AccountLayout from "../layouts/customer/accountLayout";
import AccountPage from "../pages/accountPage";

export const customerRoute = {
   path: '/',
   element: <HomeLayout />,
   children: [
      {
         path: 'userinfo',
         element: <AccountLayout />,
         children: [
            {path: 'account/profile', element: <AccountPage/>},
            {path: 'account/password', element: <></>},
            {path: 'orders', element: <></>}
         ]
      }
   ]
}
