import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { userSelector } from "../redux/selectors";

/**
 * 
 * @param children 
 * @param roleArray:Array of role permission 
 * @returns 
 */
export default function DecentralAuth({children, roleArray}){
   const userActive = useSelector(userSelector);
   if(userActive){
      const { role } = userActive;
      if(roleArray.includes(role)) return children;
      return <Navigate to= {'/'+role.toLowerCase()} replace/>
   }
   return children;
}