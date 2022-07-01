
import { Outlet } from "react-router-dom";
import NavbarAdmin from "./navbarAdmin";
import { useSelector, useDispatch } from 'react-redux';
import { userSelector } from '../../redux/selectors';
import { logoutUserAction } from "../../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { loginLink } from '../../helpers/linkConstants/commonLink';
import './styles/navbarAdmin.scss';
import './styles/homeLayout.scss';
import SidebarAdmin from "./sidebarAdmin";

export default function HomeLayoutAdmin() {
   const userActived = useSelector(userSelector);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   
   const handleLogout = async () => {
      try {
         await dispatch(logoutUserAction(userActived));
         navigate(loginLink, { replace: true });
      } catch (error) {
         console.log(error);
      }
   }

   return (
      <>
         <NavbarAdmin user={userActived} handleLogout={handleLogout} />
         <SidebarAdmin user={userActived}/>
         <Outlet />
      </>
   );
}