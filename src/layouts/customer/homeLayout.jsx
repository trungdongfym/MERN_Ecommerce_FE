import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import { useSelector, useDispatch } from 'react-redux';
import { userSelector } from '../../redux/selectors';
import { logoutUserAction } from "../../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { loginLink } from '../../helpers/linkConstants/commonLink';

export default function HomeLayout() {
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
         <Navbar user={userActived} handleLogout={handleLogout} />
         <Outlet />
      </>
   );
}