import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userSelector } from '../redux/selectors';

export default function RequireAuth({ children }) {
   const navigate = useNavigate();
   const userActive = useSelector(userSelector);
   if (!userActive) {
      return navigate('/login', { replace: true });
   }
   return children;
}