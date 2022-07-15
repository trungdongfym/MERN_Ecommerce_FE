import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors";
import './styles/sidebarAccountAdmin.scss';
import SidebarAccountAdmin from "./sidebarAccountAdmin";

export default function AccountAdminLayout(){
   const userActive = useSelector(userSelector);
   return(
      <div className="accountLayoutWapper admin">
         <div className="userinfo">
            <SidebarAccountAdmin user={userActive}/>
            <Outlet />
         </div>
      </div>
   );
}