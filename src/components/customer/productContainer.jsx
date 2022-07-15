import { forwardRef } from 'react';
import { priceFormat } from '../../helpers/formats/priceFormat';
import clsx from 'clsx';
import './styles/productContainer.scss';

function ProductContainer({ children, ...props }, ref) {
   const { product, className } = props;
   const { name, image, price, sale } = product;
   return (
      <div className={clsx('productContainer', className)} ref={ref}>
         <div className='productContainer__imageProduct'>
            <img src={image} alt={name} />
         </div>
         <div className='productContainer__productInfo'>
            <div className='productContainer__productInfo__name'>{name}</div>
            <div className={clsx('productContainer__productInfo__price', { sale: sale && sale > 0 })}>
               {`${priceFormat(price)} VNĐ`}
            </div>
            {sale && sale > 0 ?
               (<div className='productContainer__productInfo__price'>
                  {`${priceFormat(parseInt(price - price * sale / 100))} VNĐ`}
               </div>): null
            }
         </div>
         {sale && sale > 0 ?
            (<div className='productContainer__shopBadge'>
               <div className='productContainer__shopBadge__content'>
                  <span className='text'>Giảm</span>
                  <span className='percent'>{`${sale}%`}</span>
               </div>
            </div>): null
         }
      </div>
   );
}

export default forwardRef(ProductContainer);