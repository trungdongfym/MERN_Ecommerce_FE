import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CgSearchFound } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { getListProductApi } from '../../apis/productsApi';
import { Page } from '../../components/base';
import { PaginationComp } from '../../components/base/pagination';
import ProductContainer from '../../components/customer/productContainer';
import { customerLink } from '../../helpers/linkConstants';
import { scrollToAny } from '../../helpers/scrollToAny';
import useQueryParam from '../../hooks/useQueryParam';
import './styles/productPageStyles.scss';

function ShopPage() {
   const [products, setProducts] = useState([]);
   const [page, setPage] = useState(0);
   const [pageSize, setPageSize] = useState(16);
   const [totalProducts, setTotalProducts] = useState(0);

   const [sortQueryParam, setSortQueryParam] = useQueryParam('sort');
   const [filterQueryParam, setFilterQueryParam] = useQueryParam('filter');
   const [paginationParam, setPaginationParam] = useQueryParam('pagination');
   const [searchValueParam, setSearchValueParam] = useQueryParam('search', null, {
      stringParam: true,
   });
   // For init all query
   const [allQuery, setAllQuery] = useQueryParam('all', {
      sort: { _id: 1 },
      pagination: { page: 0, pageSize: pageSize },
   });

   const refTopList = useRef();

   const getDataShopPage = useCallback(async () => {
      try {
         // Create object query
         if (!allQuery) return;
         if (Object.keys(allQuery).length === 0) return;
         // -----
         const listProduct = await getListProductApi(allQuery);
         const {
            data: { products: productsRetrieved = [], count },
            meta,
         } = listProduct;

         setProducts(productsRetrieved);
         setTotalProducts(count);
      } catch (error) {
         console.log(error);
      }
   }, [allQuery]);

   useEffect(() => {
      let timeID = null;
      timeID = setTimeout(() => {
         getDataShopPage();
      }, 0);

      return () => {
         timeID && clearTimeout(timeID);
      };
   }, [paginationParam]);

   useEffect(() => {
      let timeID = null;
      timeID = setTimeout(() => {
         setPage(0);
         getDataShopPage();
      }, 0);

      return () => {
         timeID && clearTimeout(timeID);
      };
   }, [sortQueryParam, filterQueryParam, searchValueParam]);

   useEffect(() => {
      setAllQuery({ ...allQuery, pagination: { page: page, pageSize: pageSize } });
   }, [page]);

   const handleChangePage = (e, pageChange) => {
      const { page } = paginationParam;
      if (typeof page === 'number' && page === pageChange - 1) return;
      setPage(pageChange - 1);
      setPaginationParam({ page: pageChange - 1, pageSize });
      // scroll to top list when change page
      if (refTopList.current) {
         scrollToAny(refTopList, 0);
      }
   };

   return (
      <Page className="productsPage" title="Cửa hàng" ref={refTopList}>
         {allQuery?.search && (
            <div className="search-result">
               <span className="search-result__icon">
                  <CgSearchFound />
               </span>
               {`Kết quả tìm kiếm cho `}
               <span className="search-result__keyword">{`"${allQuery?.search}"`}</span>
            </div>
         )}
         <ul className={clsx('productList', { empty: products.length === 0 })}>
            {products.map((product) => {
               const { _id } = product;
               return (
                  <li key={_id} className="productList__productItem">
                     <Link
                        className="productList__productItem__link"
                        to={`${customerLink.productsLink}/${_id}`}
                     >
                        <ProductContainer product={product} showSellNumber={true} />
                     </Link>
                  </li>
               );
            })}
            {products && products.length === 0 ? (
               <div className="productEmpty">
                  <div className="productEmpty__img"></div>
                  <div className="productEmpty__notifyProductEmpty">Không có sản phẩm nào</div>
               </div>
            ) : null}
         </ul>
         {totalProducts > pageSize ? (
            <PaginationComp
               size="large"
               color="primary"
               handleChangePage={handleChangePage}
               paginationData={{
                  totalPage: Math.ceil(totalProducts / pageSize) || 1,
                  page,
                  pageSize,
               }}
            />
         ) : null}
      </Page>
   );
}

export default ShopPage;
