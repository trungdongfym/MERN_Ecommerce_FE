import { Outlet } from "react-router-dom";
import SidebarAccount from "./sidebarAccount";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors";
import './styles/sidebarAccount.scss';

export default function AccountLayout(){
   const userActive = useSelector(userSelector);
   return(
      <div className="accountLayoutWapper">
         <div className="userinfo">
            <SidebarAccount user={userActive}/>
            <Outlet />
         </div>
      </div>
   );
}