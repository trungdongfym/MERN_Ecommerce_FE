import { Outlet } from "react-router-dom";
import { Logo } from "../components/base";
import './baseLayout.scss';

export default function LogoOnly() {
   return (
      <>
         <header className="logoOnly">
            <Logo />
         </header>
         <div className='auth'>
            <div className='auth__wrapper'>
               <Outlet />
               <div
                  className='auth__background-img'
                  style={{ backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/static/login_bg_img.png)` }}
               >
               </div>
            </div>
         </div>
      </>
   );
}