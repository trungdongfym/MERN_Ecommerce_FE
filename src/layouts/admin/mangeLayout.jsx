import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import './styles/mangeLayout.scss';

export default function MangeLayout(){
   return(
      <div className="manageWapper">
         <Outlet />
      </div>
   );
}