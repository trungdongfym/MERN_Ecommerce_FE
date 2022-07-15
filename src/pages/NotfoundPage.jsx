import { Link } from "react-router-dom";

export default function NotFoundPage(){
   return(
      <div className="notFound">
         <h2 className="notFound__notify">404 Not Found!</h2>
         <Link to={'/'}>Quay lại trang chủ</Link>
      </div>
   );
}