import { useEffect } from 'react';

export default function useCloseModal(closeFunction, dependecies) {
   useEffect(() => {
      let timeID = null;
      timeID = setTimeout(() => {
         closeFunction();
      }, 2000);
      return () => {
         timeID && clearTimeout(timeID);
      }
   }, dependecies);
}