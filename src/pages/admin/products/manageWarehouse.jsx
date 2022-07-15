import { Avatar, Button, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tooltip, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import { MdSearch } from 'react-icons/md';
import { TiExport } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import { getWareHouseApi } from '../../../apis/wareHouseApi';
import Page from '../../../components/base/page';
import { SearchStyle } from '../../../components/base/searchInput';
import { TableHeadComponent } from '../../../components/base/tableComponents';
import { priceFormat } from '../../../helpers/formats/priceFormat';
import { adminLink } from '../../../helpers/linkConstants';

const tableProductsHead = [
   { id: 'product', label: 'Sản phẩm', alignRight: false },
   { id: 'categories', label: 'Loại sản phẩm', alignRight: false },
   { id: 'price', label: 'Giá bán', alignRight: false },
   { id: 'amount', label: 'Số lượng trong kho', alignRight: false },
   { id: 'Manipulation', label: 'Thao tác', alignRight: true }
]

export default function ManageWarehousePage() {
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [filterName, setFilterName] = useState('');
   const [totalProductsInStock, setTotalProductsInStock] = useState(0);
   const [productsInStock, setProductsInStock] = useState([]);
   const [filterProductsInStockArr, setFilterProductsInStockArr] = useState([]);
   const isCallApi = useRef(false);

   useEffect(() => {
      async function getProducts() {
         const limit = (page + 1) * rowsPerPage - productsInStock.length;
         const skip = productsInStock.length;
         // enough category
         if (limit <= 0 || isCallApi.current) return;
         try {
            isCallApi.current = true;
            const objectQuery = { limit, skip, requireCate: true };
            const { productInStock, amountInStock } = await getWareHouseApi(objectQuery);
            setProductsInStock(prev => {
               const tmp = structuredClone(prev.concat(productInStock));
               if (amountInStock > tmp.length) isCallApi.current = false;
               return tmp;
            });
            setTotalProductsInStock(amountInStock);
         } catch (error) {
            console.log(error);
         }
      }
      getProducts();
   }, [page, rowsPerPage]);

   const onFilterName = () => {

   }

   const productStockFilter = useMemo(() => {
      if (filterName === '') return productsInStock;
      return filterProductsInStockArr;
   }, [filterProductsInStockArr, productsInStock, filterName]);

   const emptyRows = useMemo(() => {
      const tmp = (page + 1) * rowsPerPage - productStockFilter.length;
      return tmp > 0 ? tmp : 0;
   }, [rowsPerPage, productStockFilter, page]);

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   return (
      <Page title='Quản lý kho'>
         <div className="container">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
               <Typography className="title" variant="h5" gutterBottom>
                  Kho sản phẩm
               </Typography>
               <Button variant="contained"
                  component={Link} to={adminLink.addProductsLink}
                  startIcon={<TiExport className="icon" />}
               >
                  Xuất kho
               </Button>
            </Stack>
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
                        {productStockFilter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                           .map((productStock) => {
                              const { _id, products, amount } = productStock;
                              const {
                                 category, name: nameProduct, price, image
                              } = products  || {};
                              const { name: nameCate } = category || {};
                              return (
                                 <TableRow
                                    hover
                                    key={_id}
                                    tabIndex={-1}
                                 >
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
                                    <TableCell align="left">{amount}</TableCell>
                                    <TableCell align="right">

                                    </TableCell>
                                 </TableRow>
                              );
                           })}
                        {emptyRows > 0 ? (
                           <TableRow>
                              <TableCell height={emptyRows * 73} colSpan={tableProductsHead.length}>
                              </TableCell>
                           </TableRow>
                        ) : null}
                     </TableBody>
                  </Table>
               </TableContainer>
               <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalProductsInStock}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage='Hàng trên trang'
                  showFirstButton={true}
                  showLastButton={true}
               />
            </div>
         </div>
      </Page>
   );
}