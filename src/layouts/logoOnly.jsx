import { Outlet } from "react-router-dom";
import { Logo } from "../components/base";
import './baseLayout.scss';

export default function LogoOnly() {
   return (
      <>
         <header className="logoOnly">
            <Logo path={'/'} />
         </header>
         <div className='auth'>
            <div className='auth__wrapper'>
               <Outlet />
            </div>
         </div>
      </>
   );
}