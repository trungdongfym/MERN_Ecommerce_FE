import DecentralAuth from "../authentication/decentralAuth";
import RequireAuth from "../authentication/requireAuth";
import { roleEnum } from "../helpers/constants/userConst";
import HomeLayoutAdmin from "../layouts/admin/homeLayoutAdmin";
import ChangePasswordPage from "../pages/changePasswordPage";
import AccountPage from "../pages/accountPage";
import AccountAdminLayout from "../layouts/admin/accountAdminLayout";
import MangeLayout from "../layouts/admin/mangeLayout";
import ManageProductsPage from "../pages/admin/products/manageProductsPage";
import ManageCategoriesPage from "../pages/admin/products/mangeCategoriesPage";
import AddCategoriesPage from "../pages/admin/products/addCategoriesPage";
import AddProductsPage from "../pages/admin/products/addProductsPage";
import ManageImportProductsPage from "../pages/admin/products/mangeImportProductsPage";
import AddImportProductsPage from "../pages/admin/products/addImportProductsPage";

export const RouteAdmin = {
   path: '/admin',
   element:
      <RequireAuth>
         <DecentralAuth roleArray={[roleEnum.Admin]}>
            <HomeLayoutAdmin />
         </DecentralAuth>
      </RequireAuth>
   ,
   children: [
      {
         path: 'userinfo',
         element: <AccountAdminLayout />,
         children: [
            {path: 'account/profile', element: <AccountPage/>},
            {path: 'account/password', element: <ChangePasswordPage/>},
            {path: 'orders', element: <></>}
         ]
      },
      {
         path: 'products',
         element: <MangeLayout />,
         children: [
            {path: 'manageProducts', element: <ManageProductsPage/>},
            {path: 'addProducts', element: <AddProductsPage />},
            {path: 'updateProducts', element: <></>},
            {path: 'mangeImportProducts', element: <ManageImportProductsPage/>},
            {path: 'addImportProducts', element: <AddImportProductsPage/>}
         ]
      },
      {
         path: 'categories',
         element: <MangeLayout />,
         children: [
            {path: 'manageCategories', element: <ManageCategoriesPage/>},
            {path: 'addCategories', element: <AddCategoriesPage/>},
            {path: 'updateCategories', element: <></>}
         ]
      },
   ]
};