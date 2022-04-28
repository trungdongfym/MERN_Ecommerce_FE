import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userSelector } from '../redux/selectors';
import { firebaseAuth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default function RequireAuth({ children }) {
   const navigate = useNavigate();
   const userActive = useSelector(userSelector);
   useEffect(() => {
      const unsubcribe = onAuthStateChanged(firebaseAuth, (user) => {
         const { methodLogin } = userActive || false;
         if (methodLogin !== 'normal' && methodLogin !== false && !user) {
            navigate('/login', { replace: true });
            return;
         }
      });
      return unsubcribe;
   }, []);
   if (!userActive) {
      return navigate('/login', { replace: true });
   }
   return children;
}