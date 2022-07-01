import { useSelector } from 'react-redux';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { userSelector } from '../redux/selectors';
import { firebaseAuth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useRef } from 'react';
import { commonLink } from '../helpers/linkConstants';

export default function RequireAuth({ children }) {
   const navigate = useNavigate();
   const userActive = useSelector(userSelector);
   const location = useLocation();

   useEffect(() => {
      const unsubcribe = onAuthStateChanged(firebaseAuth, (user) => {
         const { methodLogin } = userActive || false;
         // if user is logout 
         if (methodLogin !== 'normal' && methodLogin !== false && !user) {
            navigate(commonLink.loginLink, { replace: true });
            return;
         }
      });
      return unsubcribe;
   }, []);
   
   if (!userActive) {
      // return navigate(commonLink.loginLink,{replace:true, state:{location}});
      return <Navigate to={commonLink.loginLink} replace={true} state={location}/>
   }
   return children;
}