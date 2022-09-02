import {
   Avatar,
   Checkbox,
   IconButton,
   InputAdornment,
   Stack,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TablePagination,
   TableRow,
   Tooltip,
   Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import { MdSearch } from 'react-icons/md';
import { getProductsApi, searchProductsApi } from '../apis/productsApi';
import MoreMenuTable from '../components/admin/moreMenuTable';
import { Page } from '../components/base';
import { SearchStyle } from '../components/base/searchInput';
import { TableHeadComponent } from '../components/base/tableComponents';
import { priceFormat } from '../helpers/formats/priceFormat';

const tableProductsHead = [
   { id: '' },
   { id: 'name', label: 'Tên sản phẩm', alignRight: false },
   { id: 'category', label: 'Loại sản phẩm', alignRight: false },
   { id: 'price', label: 'Giá bán (VNĐ)', alignRight: false },
   { id: 'manipulation', label: 'Thao tác', alignRight: true },
];

export default function ChooseProducts(props) {
   const { productSelected, handleClickCheckboxProducts, importedProducts } = props;
   const [products, setProducts] = useState([]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [filterName, setFilterName] = useState('');
   const [totalProducts, setTotalProducts] = useState(0);
   const [filterCateArr, setFilterCateArr] = useState([]);
   const isCallApi = useRef(false);

   useEffect(() => {
      async function getProducts() {
         const limit = (page + 1) * rowsPerPage - products.length;
         const skip = products.length;
         // enough category
         if (limit <= 0 || isCallApi.current) return;
         try {
            isCallApi.current = true;
            const { products: productsRetrieved, amount } = await getProductsApi({ limit, skip });

            setProducts((prev) => {
               const tmp = structuredClone(prev.concat(productsRetrieved));
               if (amount > tmp.length) isCallApi.current = false;
               return tmp;
            });
            setTotalProducts(amount);
         } catch (error) {
            console.log(error);
         }
      }
      getProducts();
   }, [page, rowsPerPage]);

   useEffect(() => {
      let timeID = null;
      if (filterName === '') return;
      async function searchProducts() {
         try {
            const products = await searchProductsApi(filterName);
            setFilterCateArr(products);
         } catch (error) {
            console.log(error);
         }
      }
      // Call api after 2 seconds
      timeID = setTimeout(() => {
         searchProducts();
      }, 1000);

      return () => {
         timeID && clearTimeout(timeID);
      };
   }, [filterName]);

   const productsFilter = useMemo(() => {
      if (filterName === '') return products;
      return filterCateArr;
   }, [filterCateArr, products, filterName]);

   const onFilterName = (e) => {
      setFilterName(e.target.value);
   };

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const emptyRows = useMemo(() => {
      const tmp = (page + 1) * rowsPerPage - productsFilter.length;
      return tmp > 0 ? tmp : 0;
   }, [rowsPerPage, productsFilter, page]);

   return (
      <Page title="Sản phẩm">
         <div className="container">
            <div className="tableContainer">
               <div className="tableContainer__toolbar">
                  <SearchStyle
                     value={filterName}
                     onChange={onFilterName}
                     placeholder="Tìm kiếm sản phẩm..."
                     startAdornment={
                        <InputAdornment position="start">
                           <MdSearch fontSize={'20px'} />
                        </InputAdornment>
                     }
                  />
                  <Tooltip title="Filter list">
                     <IconButton>
                        <BiFilter />
                     </IconButton>
                  </Tooltip>
               </div>
               <TableContainer>
                  <Table>
                     <TableHeadComponent tableHeadList={tableProductsHead} />
                     <TableBody>
                        {productsFilter
                           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                           .map((product) => {
                              const {
                                 _id: idProduct,
                                 name: nameProduct,
                                 image,
                                 price,
                                 category,
                              } = product;
                              const { name: nameCate } = category;
                              const { _id: idProductsSelected = null } = productSelected || {};
                              const isItemSelected = idProduct === idProductsSelected;
                              const isDisable =
                                 importedProducts &&
                                 importedProducts.some((importedProduct) => {
                                    return importedProduct._id === idProduct;
                                 });

                              return (
                                 <TableRow
                                    hover
                                    key={idProduct}
                                    tabIndex={-1}
                                    role="checkbox"
                                    selected={isItemSelected}
                                    aria-checked={isItemSelected}
                                 >
                                    <TableCell padding="checkbox">
                                       <Checkbox
                                          checked={isItemSelected}
                                          disabled={isDisable}
                                          onChange={(event) =>
                                             handleClickCheckboxProducts(event, product)
                                          }
                                       />
                                    </TableCell>
                                    <TableCell component="th" scope="row" padding="normal">
                                       <Stack direction="row" alignItems="center" spacing={2}>
                                          <Avatar alt={nameProduct} src={image} />
                                          <Typography variant="subtitle2" noWrap>
                                             {nameProduct}
                                          </Typography>
                                       </Stack>
                                    </TableCell>
                                    <TableCell align="left">{nameCate}</TableCell>
                                    <TableCell align="left">{priceFormat(price)}</TableCell>
                                    <TableCell align="right">
                                       <MoreMenuTable linkDelete="/" linkDetail="/" />
                                    </TableCell>
                                 </TableRow>
                              );
                           })}
                        {emptyRows > 0 ? (
                           <TableRow>
                              <TableCell
                                 height={emptyRows * 73}
                                 colSpan={tableProductsHead.length}
                              ></TableCell>
                           </TableRow>
                        ) : null}
                     </TableBody>
                  </Table>
               </TableContainer>
               <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalProducts}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Hàng trên trang"
                  showFirstButton={true}
                  showLastButton={true}
               />
            </div>
         </div>
      </Page>
   );
}
