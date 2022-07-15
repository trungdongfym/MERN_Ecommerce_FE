import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import { useSelector, useDispatch } from 'react-redux';
import { userSelector, cartSelecttor } from '../../redux/selectors';
import { logoutUserAction } from "../../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { loginLink } from '../../helpers/linkConstants/commonLink';
import FooterSection from "../../sections/customer/footerSection";

export default function HomeLayout() {
   const userActived = useSelector(userSelector);
   const cart = useSelector(cartSelecttor);
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
         <div className="homeHeader">
            <Navbar
               user={userActived}
               cart={cart}
               handleLogout={handleLogout}
            />
         </div>
         <div className="homeContent">
            <div className="homeContent__contentWapper">
               <Outlet />
            </div>
         </div>
         <div className="homeFooter">
            <div className="homeFooter__footerWapper">
               <FooterSection />
            </div>
         </div>
      </>
   );
}