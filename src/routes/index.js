import { useRoutes } from 'react-router-dom';
import { RouteAdmin } from './admin.route';
import { CommonRoute } from './account.route';
import { customerRoute } from './customer.route';

export default function Router() {
   return useRoutes([
      CommonRoute,
      RouteAdmin,
      customerRoute
   ]);
}