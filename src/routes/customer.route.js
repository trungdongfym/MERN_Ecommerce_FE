import HomeLayout from "../layouts/customer/homeLayout";
import AccountLayout from "../layouts/customer/accountLayout";
import AccountPage from "../pages/accountPage";
import RequireAuth from "../authentication/requireAuth";
import DecentralAuth from "../authentication/decentralAuth";
import {roleEnum} from '../helpers/constants/userConst';
import ChangePasswordPage from "../pages/changePasswordPage";

export const customerRoute = {
   path: '/',
   element: 
      <DecentralAuth roleArray={[roleEnum.Custommer]}>
         <HomeLayout />
      </DecentralAuth>
   ,
   children: [
      {
         path: 'userinfo',
         element: 
            <RequireAuth>
               <AccountLayout />
            </RequireAuth>,
         children: [
            {path: 'account/profile', element: <AccountPage/>},
            {path: 'account/password', element: <ChangePasswordPage/>},
            {path: 'orders', element: <></>}
         ]
      }
   ]
}
