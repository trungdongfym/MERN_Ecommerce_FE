import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { BsDash } from 'react-icons/bs';
import clsx from 'clsx';
import useQueryParam from '../../hooks/useQueryParam';
import { useEffect } from 'react';
import { useState } from 'react';

function ShowListItem({ children, item, className, ...other }) {
   const { id, icon, title, path } = item;

   return (
      <li key={id} className={clsx('listItem', { [className]: className })}>
         <Box
            to={path ? path : ''}
            component={path ? Link : 'div'}
            className={clsx('listItem__content', { link: path })}
            {...other}
         >
            {icon && <span className="listItem__content__icon">{icon}</span>}
            <span className="listItem__content__title">{title}</span>
         </Box>
         {children}
      </li>
   );
}

function SidebarShop({ config }) {
   const [filterQueryParams, setFilterQueryParams] = useQueryParam('filter');
   const [cateIdActive, setCateIdActive] = useState(filterQueryParams?.cateId);
   const [priceFilter, setPriceFilter] = useState({ minPrice: '', maxPrice: '' });
   const [priceRangeError, setPriceRangeError] = useState(false);

   useEffect(() => {
      setCateIdActive(filterQueryParams?.cateId);
   }, [filterQueryParams?.cateId]);

   const handleFilterCate = (cateId) => {
      setFilterQueryParams({ ...filterQueryParams, cateId: cateId });
   };

   const handleChangeFilterPrice = (e, type) => {
      const value = e.target.value;
      if (!/^\d*$/.test(value)) return;

      if (type === 'min') {
         setPriceFilter((prev) => ({ ...prev, minPrice: value }));
      }
      if (type === 'max') {
         setPriceFilter((prev) => ({ ...prev, maxPrice: value }));
      }
   };

   const handleApplyFilter = () => {
      const { maxPrice, minPrice } = priceFilter;
      if (minPrice === '' && maxPrice === '') {
         setFilterQueryParams(null);
         return;
      }

      if (minPrice === '' || maxPrice === '') {
         setPriceRangeError(true);
         return;
      }

      if (+minPrice >= +maxPrice) {
         setPriceRangeError(true);
         return;
      }

      setFilterQueryParams({ ...filterQueryParams, price: priceFilter });
      if (priceRangeError) {
         setPriceRangeError(false);
      }
   };

   const handleDeleteAllFilter = () => {
      setFilterQueryParams(null);
      setPriceFilter({ maxPrice: '', minPrice: '' });
   };

   const clickAllCategory = (e) => {
      const cloneFilterParam = structuredClone(filterQueryParams);
      if (cloneFilterParam?.cateId) {
         delete cloneFilterParam.cateId;
      }
      if (cloneFilterParam && Object.keys(cloneFilterParam).length === 0) {
         setFilterQueryParams(null);
         return;
      }
      setFilterQueryParams(cloneFilterParam);
   };

   return (
      <div className="sidebarShop">
         <ul className="sidebarShop__list">
            {config.map((sidebarItem) => {
               const { id, icon, subList, title, path } = sidebarItem;
               let event = null;
               if (id === 'allCategory') {
                  event = clickAllCategory;
               }
               return (
                  <ShowListItem
                     key={id}
                     item={{ id, icon, title, path }}
                     className={clsx('header', { pointer: event ? true : false })}
                     onClick={event}
                  >
                     {subList && (
                        <ul className="listItem__subList">
                           {subList.map((subListItem) => {
                              if (id === 'allCategory') {
                                 const { _id, name } = subListItem;
                                 const isActive = cateIdActive === _id;

                                 return (
                                    <ShowListItem
                                       key={_id}
                                       item={{ id: _id, title: name }}
                                       className={clsx('category', { active: isActive })}
                                       onClick={() => handleFilterCate(_id)}
                                    />
                                 );
                              }

                              if (id === 'filterSearch') {
                                 const { id, title } = subListItem;
                                 return (
                                    <ShowListItem key={id} item={{ id, title }}>
                                       <div className="priceRange">
                                          <input
                                             className="priceRange__input minPrice"
                                             type="text"
                                             placeholder="₫ Từ"
                                             value={priceFilter.minPrice}
                                             onChange={(e) => handleChangeFilterPrice(e, 'min')}
                                          />
                                          <span className="priceRange__separate">
                                             <BsDash />
                                          </span>
                                          <input
                                             className="priceRange__input minPrice"
                                             type="text"
                                             placeholder="₫ Đến"
                                             value={priceFilter.maxPrice}
                                             onChange={(e) => handleChangeFilterPrice(e, 'max')}
                                          />
                                       </div>
                                       {priceRangeError && (
                                          <div className="priceRange__error">
                                             Khoảng giá không hợp lệ
                                          </div>
                                       )}
                                    </ShowListItem>
                                 );
                              }
                           })}
                           {id === 'filterSearch' && (
                              <Button
                                 className="btnApply"
                                 variant="contained"
                                 size="small"
                                 fullWidth
                                 onClick={handleApplyFilter}
                              >
                                 Áp dụng
                              </Button>
                           )}
                           {id === 'filterSearch' && (
                              <Button
                                 className="btnApply"
                                 variant="contained"
                                 size="small"
                                 fullWidth
                                 onClick={handleDeleteAllFilter}
                              >
                                 Xóa tất cả
                              </Button>
                           )}
                        </ul>
                     )}
                  </ShowListItem>
               );
            })}
         </ul>
      </div>
   );
}

export default SidebarShop;
