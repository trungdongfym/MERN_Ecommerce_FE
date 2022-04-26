import { forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * 
 * @param {*} tille --Title page
 * @param {} meta --Element meta for title
 * @param {} ref --React ref
 * @param {} other --Props other
 * @returns fuctions
 */
function Page({ title, children, meta, ...other }, ref) {
   return (
      <>
         <Helmet>
            <title>{title}</title>
            {meta}
         </Helmet>
         <div ref={ref} {...other}>
            {children}
         </div>
      </>
   );
}

export default forwardRef(Page);