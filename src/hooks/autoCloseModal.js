import { useEffect } from 'react';

export default function useCloseModal(closeFunction, modelStatus, time) {
   useEffect(() => {
      let timeID = null;
      const { open = null } = modelStatus;
      if(open){
         timeID = setTimeout(() => {
            closeFunction();
         }, time);
      }
      return () => {
         timeID && clearTimeout(timeID);
      }
   }, [modelStatus]);
}