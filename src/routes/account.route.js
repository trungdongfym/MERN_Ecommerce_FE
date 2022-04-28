import LogoOnly from '../layouts/logoOnly';
import LoginPage from '../pages/loginPage';
import Register from '../pages/customers/register';

export const CommonRoute = {
   path: '/user',
   element: <LogoOnly />,
   children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <Register /> }
   ]
}