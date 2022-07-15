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
import DetailImportProductsPage from "../pages/admin/products/detailImportProductsPage";
import { adminLink } from "../helpers/linkConstants";
import ManageWarehousePage from "../pages/admin/products/manageWarehouse";
import ManageUsersPage from "../pages/admin/users/manageUsersPage";
import DetailProductsPage from "../pages/admin/products/detailProductsPage";
import DetailCategoriesPage from "../pages/admin/products/detailCategoriesPage";

export const RouteAdmin = {
   path: adminLink.admin,
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
            { path: 'account/profile', element: <AccountPage /> },
            { path: 'account/password', element: <ChangePasswordPage /> },
            { path: 'orders', element: <></> }
         ]
      },
      {
         path: adminLink.users,
         element: <MangeLayout />,
         children:[
            { path: adminLink.manageUsers, element: <ManageUsersPage /> },
         ]
      },
      {
         path: adminLink.product,
         element: <MangeLayout />,
         children: [
            { path: adminLink.manageProduct, element: <ManageProductsPage /> },
            { path: adminLink.addProducts, element: <AddProductsPage /> },
            { path: adminLink.detailProducts + '/:productID', element: <DetailProductsPage/> },
            { path: adminLink.manageImportProductLink, element: <ManageImportProductsPage /> },
            { path: adminLink.addImportProductsLink, element: <AddImportProductsPage /> },
            { path: adminLink.detailImportProducts + '/:importID', element: <DetailImportProductsPage /> },
            { path: adminLink.manageWarehouse, element: <ManageWarehousePage /> }
         ]
      },
      {
         path: adminLink.categories,
         element: <MangeLayout />,
         children: [
            { path: adminLink.manageCategories, element: <ManageCategoriesPage /> },
            { path: adminLink.addCategories, element: <AddCategoriesPage /> },
            { path: adminLink.detailCategories + '/:cateID', element: <DetailCategoriesPage/> }
         ]
      },
   ]
};