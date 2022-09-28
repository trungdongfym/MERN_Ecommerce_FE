import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { InputSelect } from '../../components/base';
import NativeSelectCustom from '../../components/base/inputField';
import useQueryParam from '../../hooks/useQueryParam';

const sortPriceEnum = {
   LowToHightPrice: 'LowToHightPrice',
   HightToLowtPrice: 'HightToLowtPrice',
};

const optionSelectSortPrice = [
   {
      id: 'lowToHightPrice',
      value: sortPriceEnum.LowToHightPrice,
      label: 'Giá: Từ thấp đến cao',
   },
   {
      id: 'hightToLowtPrice',
      value: sortPriceEnum.HightToLowtPrice,
      label: 'Giá: Từ cao đến thấp',
   },
];

function TopbarShop() {
   const [sortQuery, setSortQuery] = useQueryParam('sort');

   const valueSelectSortPrice = useMemo(() => {
      if (!sortQuery || !sortQuery?.price) return '';
      return sortQuery?.price === '1'
         ? sortPriceEnum.LowToHightPrice
         : sortPriceEnum.HightToLowtPrice;
   }, [sortQuery]);

   const handleClickLastestSort = () => {
      setSortQuery({ _id: 1 });
   };

   const handleClickBestsellSort = () => {
      setSortQuery({ bestsell: -1 });
   };

   const handleChangeSortPrice = (e) => {
      const val = e.target.value;
      if (val === sortPriceEnum.LowToHightPrice) {
         setSortQuery({ price: 1 });
      }

      if (val === sortPriceEnum.HightToLowtPrice) {
         setSortQuery({ price: -1 });
      }
   };

   return (
      <div className="topbarShop">
         <ul className="topbarShop__list">
            <li className="listItem sortBy">
               <span className="listItem__title">Sắp xếp theo</span>
               <ul className="subList">
                  <li
                     className={clsx('listItem', 'btn', {
                        active: Object.prototype.hasOwnProperty.call(sortQuery, '_id'),
                     })}
                     onClick={handleClickLastestSort}
                  >
                     <div className="listItem__lastest">Mới nhất</div>
                  </li>
                  <li
                     className={clsx('listItem', 'btn', {
                        active: Object.prototype.hasOwnProperty.call(sortQuery, 'bestsell'),
                     })}
                     onClick={handleClickBestsellSort}
                  >
                     <div className="listItem__bestSell">Bán chạy</div>
                  </li>
                  <li
                     className={clsx('listItem', 'btn', {
                        active: Object.prototype.hasOwnProperty.call(sortQuery, 'price'),
                     })}
                  >
                     <NativeSelectCustom
                        optionsList={optionSelectSortPrice}
                        placeholder="Giá"
                        field={{
                           name: 'price',
                           value: valueSelectSortPrice,
                           onChange: handleChangeSortPrice,
                        }}
                     />
                  </li>
               </ul>
            </li>
         </ul>
      </div>
   );
}

export default TopbarShop;
