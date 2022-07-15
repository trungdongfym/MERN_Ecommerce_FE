import { Link } from "react-router-dom";

export default function NotPermissionPage(){
   return(
      <div className="notFound">
         <h3 className="notFound__notify">Bạn không có quyền vào trang này!</h3>
         <Link to={'/'}>Quay lại trang chủ</Link>
      </div>
   );
}